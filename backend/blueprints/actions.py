#################
#### imports ####
#################
from sqlalchemy.sql import func
from datetime import datetime
import logging

from flask import Blueprint, Flask, json, jsonify, render_template, request, url_for, make_response
from flask import current_app
from flasgger import Swagger
from flask_api import status    # HTTP Status Codes
from flask_cors import CORS, cross_origin
from werkzeug.local import LocalProxy

from worker import celery
import celery.states as states

from models.actions import Script, ScriptSchema
from models.actions import Rule, RuleSchema
from models.actions import Action, ActionRuleLink, ActionSchema
from models.actions import FormFieldLink, FormLink
from models.actions import Form, FormSchema
from models.actions import FormField, FormFieldSchema
from utils.session import obtain_session

actions_blueprint = Blueprint('actions', __name__, template_folder='templates')

logger = LocalProxy(lambda: current_app.logger)


@actions_blueprint.route("/scripts", methods=['POST'])
def generate_script():
    """
    Creates a Script
    This endpoint will create a Script based on profile key.
    ---
    tags:
      - Script
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          id: script_data
          required:
            - profile_key
          properties:
            profile_key:
              type: string
              description: Profile Key
    responses:
      201:
        description: Script created
        schema:
          $ref: '#/definitions/Script'
      400:
        description: Bad Request (the posted data was not valid)
    """
    try:
        data = request.json
        profile_key = data.get("profile_key", None)

        if not profile_key:
            raise NotFound("Product key '{profile_key}' was not found.")

        sess = obtain_session()

        #action = sess.query(Action).filter(Action.profile_key==key).first()

        #if not action:
        #    raise NotFound("Product key '{key}' was not found.")

        code = ("<script>", f"let key = {profile_key};", 
                "(function run() {})();"
                "</script>")

        sc = Script(profile_key=profile_key,
                    code="".join(code),
                    version=1.0,
                    created_at=func.now())
        sess.add(sc)
        sess.commit()

        script_schema = ScriptSchema(many=False)
        result = script_schema.dump(sc)
        logger.debug(f"Successfully generated script for {profile_key}")
        return make_response(jsonify(result), status.HTTP_200_OK)
    except Exception as e:
        result = {"error": str(e)}
        return make_response(jsonify(result), status.HTTP_500_INTERNAL_SERVER_ERROR)
        

@actions_blueprint.route("/actions/<int:id>", methods=['GET'])
def get_actions(id):
    """
    Retrieve a single Action
    This endpoint will return a Action based on it's id
    ---
    tags:
      - Actions
    produces:
      - application/json
    parameters:
      - name: id
        in: path
        description: ID of action to retrieve
        type: integer
        required: true
    responses:
      200:
        description: Action returned
        schema:
          $ref: '#/definitions/Action'
      404:
        description: Action not found
    """
    try:
        sess = obtain_session()
        action = sess.query(Action).filter(Action.id==id).first()
        forms = sess.query(Form).join(Form.forms).filter_by(action_id=action.id).all() 
        #formfields = sess.query(FormField).join(Form.formfields).filter_by(action_id=action.id).all()
        rules = action.rules #sess.query(Action).filter(Action.id==id).all() #.rules.any(action_id=action.id)).all() 
        forms = action.forms
        formfields = action.formfields        
        #sess.query(Rule).join(ActionLink.rules).filter_by(action_id=action.id).all()
        action_schema = ActionSchema(many=False)
        form_schema = FormFieldSchema(many=True)
        formfield_schema = FormFieldSchema(many=True)
        rules_schema = RuleSchema(many=True)
        
        forms_result = form_schema.dump(forms)
        formfields_result = formfield_schema.dump(formfields)
        rules_result = rules_schema.dump(rules)

        result = action_schema.dump(action)
        result['forms'] = forms_result
        result['formfields'] = formfields_result
        result['rules'] = rules_result

        logger.debug(f"Successfully fetched action {id}")
        return make_response(jsonify(result), status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Failed reading action {id} - {e}")
        result = {"error": str(e)}
        return make_response(jsonify(result), status.HTTP_500_INTERNAL_SERVER_ERROR)


@actions_blueprint.route("/actions", methods=['GET'])
def list_actions():
    """
    Retrieve a list of Actions
    This endpoint will return all Actions unless a query parameter is specificed
    ---
    tags:
      - Actions
    description: The Actions endpoint allows you to query Actions
    definitions:
      Action:
        type: object
        properties:
            host:
              type: string
              description: Host of the action
            port:
              type: string
              description: Port of the action
    responses:
      200:
        description: An array of Actions
        schema:
          type: array
          items:
            schema:
              $ref: '#/definitions/Action'
    """
    sess = obtain_session()
    all_actions  = sess.query(Action).all()
    actions_schema = ActionSchema(many=True)
    result = actions_schema.dump(all_actions)

    forms_schema = FormFieldSchema(many=True)
    formfields_schema = FormFieldSchema(many=True)
    rules_schema = RuleSchema(many=True)

    for i, action in enumerate(all_actions):
        result[i]['rules'] = rules_schema.dump(action.rules) 
        result[i]['forms'] = forms_schema.dump(action.forms)
        result[i]['formfields'] = formfields_schema.dump(action.formfields)

    logger.debug(f"Successfully fetched all the actions.")
    return make_response(jsonify(result), status.HTTP_200_OK)


@actions_blueprint.route("/actions/<int:id>", methods=['DELETE'])
def delete_action(id):
    """
    Delete a Action
    This endpoint will delete a Action based the id specified in the path
    ---
    tags:
      - Actions
    description: Deletes a Action from the database
    parameters:
      - name: id
        in: path
        description: ID of action to delete
        type: integer
        required: true
    responses:
      204:
        description: Action deleted
    """
    try:
        sess = obtain_session()
        action = sess.query(Action).filter(Action.id==id).first()

        if action:
            sess.delete(action)
            sess.commit()
            sess.flush()
        logger.debug(f"Successfully deleted action {id}")
        result = {"result": "success"}
        return make_response(jsonify(result), status.HTTP_204_NO_CONTENT)
    except Exception as e:
        logger.error(f"Failed deleting action {id} - {e}")
        result = {"result": "failure"}
        return make_response(jsonify(result), status.HTTP_500_INTERNAL_SERVER_ERROR)

