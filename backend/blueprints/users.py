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

from models.users import User, UserSchema
 
users_blueprint = Blueprint('users', __name__, template_folder='templates')

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

def obtain_session():
    """ Get SQLAlchemy session """
    engine = create_engine('postgresql+psycopg2://postgres:postgres@postgres:5432/postgres')
    session = sessionmaker()
    # Bind the sessionmaker to engine
    session.configure(bind=engine)
    return session()


@users_blueprint.route("/users/<int:id>", methods=['GET']) 
def get_users(id):
    """
    Retrieve a single User
    This endpoint will return a User based on it's id
    ---
    tags:
      - Users
    produces:
      - application/json
    parameters:
      - name: id
        in: path
        description: ID of user to retrieve
        type: integer
        required: true
    responses:
      200:
        description: User returned
        schema:
          $ref: '#/definitions/User'
      404:
        description: User not found
    """
    sess = obtain_session()
    user = sess.query(User).get(id)
    user_schema = UserSchema(many=False)
    result = user_schema.dump(user)
    return make_response(jsonify(result), status.HTTP_200_OK)


@users_blueprint.route("/users", methods=['GET'])
def list_users():
    """
    Retrieve a list of Users
    This endpoint will return all Users unless a query parameter is specificed
    ---
    tags:
      - Users
    description: The Users endpoint allows you to query Users
    parameters:
      - name: first_name
        in: query
        description: first name of the user
        required: true
        type: string
      - name: last_name
        in: query
        description: last name of the user
        required: true
        type: string
    definitions:
      User:
        type: object
        properties:
            first_name:
              type: string
              description: First name for the user
            last_name:
              type: string
              description: Last name of the user
            email:
              type: string
              description: Email of the user
            username:
              type: string
              description: Username of the user
            password:
              type: string
              description: Password of the user
    responses:
      200:
        description: An array of Users
        schema:
          type: array
          items:
            schema:
              $ref: '#/definitions/User'
    """
    sess = obtain_session()
    all_users  = sess.query(User).all()
    users_schema = UserSchema(many=True)
    result = users_schema.dump(all_users)
    return make_response(jsonify(result), status.HTTP_200_OK)



@users_blueprint.route("/users/<int:id>", methods=['DELETE']) 
def delete_user(id):
    """
    Delete a User
    This endpoint will delete a User based the id specified in the path
    ---
    tags:
      - Users
    description: Deletes a User from the database
    parameters:
      - name: id
        in: path
        description: ID of user to delete
        type: integer
        required: true
    responses:
      204:
        description: User deleted
    """
    sess = obtain_session()
    user = sess.query(User).get(id)

    if user:
        sess.delete(user)
        sess.commit()

    return make_response('', status.HTTP_204_NO_CONTENT)


@users_blueprint.route("/users/<int:id>", methods=['PUT'])
def update_user(id):
    """
    Update a User
    This endpoint will update a User based the body that is posted
    ---
    tags:
      - Users
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
      - name: id
        in: path
        description: ID of user to retrieve
        type: integer
        required: true
      - in: body
        name: body
        schema:
          id: data
          required:
            - name
            - category
          properties:
            first_name:
              type: string
              description: First name for the user
            last_name:
              type: string
              description: Last name of the user
            email:
              type: string
              description: Email of the user
            username:
              type: string
              description: Username of the user
            password:
              type: string
              description: Password of the user
    responses:
      200:
        description: User Updated
        schema:
          $ref: '#/definitions/User'
      400:
        description: Bad Request (the posted data was not valid)
    """
    data = request.json
    print(f"USER ID HERE WAS {id}")
        
    sess = obtain_session()
    user = sess.query(User).get(id)

    if not user:
        raise NotFound("User with id '{}' was not found.".format(id))

    user.password = data.get('password', user.password)
    user.bio = data.get('bio', user.bio)
    user.email = data.get('email', user.email)
    user.first_name = data.get('first_name', user.first_name) 
    user.last_name = data.get('last_name', user.last_name)   
    user.username = data.get('username', user.username)
    sess.commit()

    user_schema = UserSchema(many=False)
    result = user_schema.dump(user)
    return make_response(jsonify(result), status.HTTP_200_OK)


@users_blueprint.route("/users", methods=['POST'])
def create_user():
    """
    Creates a User
    This endpoint will create a User based the data in the body that is posted
    ---
    tags:
      - Users
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          id: data
          required:
            - first_name
            - last_name
            - username
            - email
            - password
          properties:
            first_name:
              type: string
              description: First name for the user
            last_name:
              type: string
              description: Last name of the user
            email:
              type: string
              description: Email of the user
            username:
              type: string
              description: Username of the user
            password:
              type: string
              description: Password of the user
    responses:
      201:
        description: User created
        schema:
          $ref: '#/definitions/User'
      400:
        description: Bad Request (the posted data was not valid)
    """
    data = request.json
    first_name = data.get("first_name", "")
    last_name = data.get("last_name", "")
    username = data.get("username", "")
    password = data.get("password", "")
    email = data.get("email", "")

    try:
        user = User(first_name=first_name,
                    last_name=last_name,
                    email=email,
                    username=username,
                    password=password,
                    is_active=True,
                    is_staff=False)

        s = obtain_session()
        s.add(user)
        s.commit()
        s.flush()
        logging.info(f"Saved new user {first_name} {last_name}")
    except Exception as e:
        logging.error(f"Failed saving user - {e}")

    sess = obtain_session()
    all_users  = sess.query(User).all()
    users_schema = UserSchema(many=True)
    result = users_schema.dump(all_users)
    return make_response(jsonify(result), status.HTTP_201_CREATED)
