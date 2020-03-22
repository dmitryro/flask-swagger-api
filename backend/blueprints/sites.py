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

from models.sites import Site, SiteSchema
from models.sites import Page, PageSchema
from models.sites import Form, FormSchema
from models.sites import FormField, FormFieldSchema

sites_blueprint = Blueprint('sites', __name__, template_folder='templates')

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

def obtain_session():
    """ Get SQLAlchemy session """
    engine = create_engine('postgresql+psycopg2://postgres:postgres@postgres:5432/postgres')
    session = sessionmaker()
    # Bind the sessionmaker to engine
    session.configure(bind=engine)
    return session()

@sites_blueprint.route("/sites/<int:id>", methods=['GET'])
def get_sites(id):
    """
    Retrieve a single Site
    This endpoint will return a Site based on it's id
    ---
    tags:
      - Sites
    produces:
      - application/json
    parameters:
      - name: id
        in: path
        description: ID of site to retrieve
        type: integer
        required: true
    responses:
      200:
        description: Site returned
        schema:
          $ref: '#/definitions/Site'
      404:
        description: Site not found
    """
    sess = obtain_session()
    site = sess.query(Site).get(id)
    site_schema = SiteSchema(many=False)
    result = site_schema.dump(site)
    return make_response(jsonify(result), status.HTTP_200_OK)


@sites_blueprint.route("/sites", methods=['POST'])
def create_site():
    """
    Creates a Site
    This endpoint will create a Site based the data in the body that is posted
    ---
    tags:
      - Sites
    consumes:
      - application/json
    produces:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          id: site_data
          required:
            - host
          properties:
            host:
              type: string
              description: Site host
            port:
              type: integer
              description: Site port
    responses:
      201:
        description: Site created
        schema:
          $ref: '#/definitions/Site'
      400:
        description: Bad Request (the posted data was not valid)
    """
    try:
        data = request.json
        host = data.get("host", "")
        port = data.get("port", "80")
        site = Site(host=host,
                    port=int(port))     

        s = obtain_session()
        s.add(site)
        s.commit()
        s.flush()
        logging.info(f"Saved new site {host} {port}")
    except Exception as e:
        logging.error(f"Failed saving site - {e}")

    sess = obtain_session()
    all_sites  = sess.query(Site).all()
    sites_schema = SiteSchema(many=True)
    result = sites_schema.dump(all_sites)
    return make_response(jsonify(result), status.HTTP_201_CREATED)

@sites_blueprint.route("/sites", methods=['GET'])
def list_sites():
    """
    Retrieve a list of Sites
    This endpoint will return all Sites unless a query parameter is specificed
    ---
    tags:
      - Sites
    description: The Sites endpoint allows you to query Sites
    definitions:
      Site:
        type: object
        properties:
            host:
              type: string
              description: Host of the site
            port:
              type: string
              description: Port of the site
    responses:
      200:
        description: An array of Sites
        schema:
          type: array
          items:
            schema:
              $ref: '#/definitions/Site'
    """
    sess = obtain_session()
    all_sites  = sess.query(Site).all()
    sites_schema = SiteSchema(many=True)
    result = sites_schema.dump(all_sites)
    return make_response(jsonify(result), status.HTTP_200_OK)
