#################
#### imports ####
#################
from datetime import datetime
import logging

from flask import Blueprint, Flask, json, jsonify, render_template, request, url_for, make_response
from flasgger import Swagger
from flask_api import status    # HTTP Status Codes
from flask_cors import CORS, cross_origin


from sqlalchemy import *
from sqlalchemy.orm.session import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from worker import celery
import celery.states as states

from models.actions import Action, ActionSchema
from models.sites import Form, FormSchema
from models.sites import FormField, FormFieldSchema

actions_blueprint = Blueprint('actions', __name__, template_folder='templates')

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


def obtain_session():
    """ Get SQLAlchemy session """
    engine = create_engine('postgresql+psycopg2://postgres:postgres@postgres:5432/postgres')
    session = sessionmaker(autoflush=True)
    # Bind the sessionmaker to engine
    session.configure(bind=engine)
    return session()


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
    except Exception as e:
        result = {"error": str(e)}

    return make_response(jsonify(result), status.HTTP_200_OK)


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
        result = {"result": "success"}
    except Exception as e:
        result = {"result": "failure"}

    return make_response(jsonify(result), status.HTTP_204_NO_CONTENT)
