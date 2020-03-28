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
from utils.spide import crawl, internal_urls, get_all_page_forms 

sites_blueprint = Blueprint('sites', __name__, template_folder='templates')

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

def obtain_session():
    """ Get SQLAlchemy session """
    engine = create_engine('postgresql+psycopg2://postgres:postgres@postgres:5432/postgres')
    session = sessionmaker(autoflush=True)
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
        base_url = f"https://{host}"

        s = obtain_session()
        s.add(site)
        s.commit()
        s.flush()

        site_links = crawl(base_url, max_urls=20)
        crawled_pages = list(site_links)

        page_schema = PageSchema(many=True)
        site_schema = SiteSchema(many=False)
        form_schema = FormSchema(many=True)

        pages = []

        for page in crawled_pages:
            p = Page(name=page, site_id=site.id)
            s.add(p)
            pages.append(p)            

        s.commit()
        s.flush()


        stored_forms = {}       

        for page in pages:
            link = f"{base_url}{page.name}"
            crawled_forms = get_all_page_forms(link)
            forms = []

            for form in crawled_forms:
               f = Form(name=form.get('name',''),
                        method=form.get('method', ''),
                        form_id=form.get('id',''),
                        page_id=p.id)
               s.add(f)
               forms.append(f)

            s.commit()
            s.flush()
            forms_result = form_schema.dump(forms)
            stored_forms[f'forms_{page.id}'] = forms_result


        pages_result = page_schema.dump(pages)


        for page in pages_result:
            page_id = page.get('id')
            forms = stored_forms[f'forms_{page_id}']
            page['forms'] = forms

        result = site_schema.dump(site)
        result['pages'] = pages_result
        logging.info(f"Saved new site {host} {port}")
        return make_response(jsonify(result),  status.HTTP_201_CREATED)
    except Exception as e:
        print(f"Failed saving site - {e}")

    return make_response(jsonify(l), status.HTTP_201_CREATED)

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

    print(f"ALL SITES {all_sites}")
    result = sites_schema.dump(all_sites)
    print(f"ALL SITES RESULT {result}")
    return make_response(jsonify(result), status.HTTP_200_OK)


@sites_blueprint.route("/pages/<int:site_id>", methods=['GET'])
def get_pages(site_id):
    """
    Retrieve a single Page by Site ID
    This endpoint will return a Page based on it's site_id
    ---
    tags:
      - Pages
    produces:
      - application/json
    parameters:
      - name: site_id
        in: path
        description: ID of site to retrieve
        type: integer
        required: true
    responses:
      200:
        description: Site returned
        schema:
          $ref: '#/definitions/Page'
      404:
        description: Site not found
    """
    sess = obtain_session()
    page = sess.query(Page).filter(site_id==site_id)
    page_schema = PageSchema(many=True)
    result = page_schema.dump(page)
    return make_response(jsonify(result), status.HTTP_200_OK)


@sites_blueprint.route("/pages", methods=['GET'])
def list_pages():
    """
    Retrieve a list of Pages
    This endpoint will return all Sites unless a query parameter is specificed
    ---
    tags:
      - Pages
    description: The Sites endpoint allows you to query Sites
    definitions:
      Site:
        type: object
        properties:
            name:
              type: string
              description: Page name
            meta:
              type: string
              description: Page meta
            headers:
              type: string
              description: Page headers
            site_id:
              type: integer
              description: Site ID
    responses:
      200:
        description: An array of Sites
        schema:
          type: array
          items:
            schema:
              $ref: '#/definitions/Page'
    """
    sess = obtain_session()
    all_pages  = sess.query(Page).all()
    pages_schema = PageSchema(many=True)
    result = pages_schema.dump(all_pages)
    return make_response(jsonify(result), status.HTTP_200_OK)
