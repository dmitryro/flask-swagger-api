#################
#### imports ####
#################
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

from models.actions import Action, ActionSchema
from models.sites import Form, FormSchema
from models.sites import FormField, FormFieldSchema
from utils.session import obtain_session

actions_blueprint = Blueprint('actions', __name__, template_folder='templates')

logger = LocalProxy(lambda: current_app.logger)


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
        form = sess.query(Form).filter(Action.form_id==action.form_id).first()
        formfield = sess.query(FormField).filter(Action.field_id==action.field_id).first()
        action_schema = ActionSchema(many=False)
        form_schema = FormFieldSchema(many=False)
        formfield_schema = FormFieldSchema(many=False)
        form_result = form_schema.dump(form)
        formfield_result = formfield_schema.dump(formfield)
        result = action_schema.dump(action)
        result['form'] = form_result
        result['formfield'] = formfield_result
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

