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

from models.states import State, StateSchema
 
states_blueprint = Blueprint('states', __name__, template_folder='templates')


def obtain_session():
    """ Get SQLAlchemy session """
    engine = create_engine('postgresql+psycopg2://postgres:postgres@postgres:5432/postgres')
    session = sessionmaker()
    # Bind the sessionmaker to engine
    session.configure(bind=engine)
    return session()


@states_blueprint.route("/states/<int:id>", methods=['GET']) 
def get_state(id):
    """
    Retrieve a single state
    This endpoint will return a State based on it's id
    ---
    tags:
      - States
    produces:
      - application/json
    parameters:
      - name: id
        in: path
        description: ID of state to retrieve
        type: integer
        required: true
    responses:
      200:
        description: State returned
        schema:
          $ref: '#/definitions/State'
      404:
        description: State not found
    """
    sess = obtain_session()
    state = sess.query(State).get(id)
    state_schema = StateSchema(many=False)
    result = state_schema.dump(state)
    return make_response(jsonify(result), status.HTTP_200_OK) 


@states_blueprint.route("/states", methods=['GET'])
def list_states():
    """
    Retrieve a list of States
    This endpoint will return all States unless a query parameter is specificed
    ---
    tags:
      - States
    description: The State endpoint allows you to query States
    definitions:
      State:
        type: object
        properties:
            name:
              type: string
              description: State name
            code:
              type: string
              description: State code
    responses:
      200:
        description: An array of States
        schema:
          type: array
          items:
            schema:
              $ref: '#/definitions/State'
    """
    sess = obtain_session()
    all_states = sess.query(State).all()
    states_schema = StateSchema(many=True)
    result = states_schema.dump(all_states)
    return make_response(jsonify(result), status.HTTP_200_OK) 


@states_blueprint.route("/states/<int:id>", methods=['DELETE']) 
def delete_state(id):
    """
    Delete a State
    This endpoint will delete a State based the id specified in the path
    ---
    tags:
      - States
    description: Deletes a State from the database
    parameters:
      - name: id
        in: path
        description: ID of state to delete
        type: integer
        required: true
    responses:
      204:
        description: State deleted
    """
    return make_response('', status.HTTP_204_NO_CONTENT)


@states_blueprint.route("/states/<int:id>", methods=['PUT'])
def update_state(id):
    """
    Update a State
    This endpoint will update a State based the body that is posted
    ---
    tags:
      - States
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
      - name: id
        in: path
        description: ID of state to retrieve
        type: integer
        required: true
      - in: body
        name: body
        schema:
          id: data
          required:
            - name
            - code
          properties:
            name:
              type: string
              description: State or province name
            code:
              type: string
              description: State or province code
    responses:
      200:
        description: State Updated
        schema:
          $ref: '#/definitions/State'
      400:
        description: Bad Request (the posted data was not valid)
    """
    return make_response(jsonify([]), status.HTTP_200_OK)


@states_blueprint.route("/states", methods=['POST'])
def create_state():
    """
    Creates a State
    This endpoint will create a User based the data in the body that is posted
    ---
    tags:
      - States
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          id: state_data
          required:
            - name
            - code
          properties:
            name:
              type: string
              description: State name
            code:
              type: string
              description: State code
    responses:
      201:
        description: State created
        schema:
          $ref: '#/definitions/State'
      400:
        description: Bad Request (the posted data was not valid)
    """
    result = []
    try:
        data = request.json
        name = data.get("name", "")
        code = data.get("code", "")
    except Exception as e:
        print(f"SOME SHIT HAPPENED IN CREATING STATE {e}")

    return make_response(jsonify([]), status.HTTP_201_CREATED,
                         {'Location': '' })
