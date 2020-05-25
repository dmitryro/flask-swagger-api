#################
#### imports ####
#################
from datetime import datetime
from flask import Blueprint, Flask, json, jsonify, render_template, request, url_for, make_response
from flask import current_app
from flasgger import Swagger
from flask_api import status    # HTTP Status Codes
from flask_cors import CORS, cross_origin
from werkzeug.local import LocalProxy

from worker import celery
import celery.states as states

from models.sites import Site, SiteSchema
from models.sites import Page, PageSchema
from models.actions import Form, FormSchema
from models.actions import FormField, FormFieldSchema
from utils.spide import crawl, internal_urls, get_all_page_forms
from utils.session import obtain_session

sites_blueprint = Blueprint('sites', __name__, template_folder='templates')

logger = LocalProxy(lambda: current_app.logger)


@sites_blueprint.route("/crawled/<int:id>", methods=['GET'])
def get_crawled(id):
    """
    Retrieve a single Site
    This endpoint will return a Site based on it's id
    ---
    tags:
      - Crawled
    produces:
      - application/json
    parameters:
      - name: id
        in: path
        description: ID of site to read crawled pages
        type: integer
        required: true
    responses:
      200:
        description: Site forms crawled
        schema:
          $ref: '#/definitions/Site'
      404:
        description: Site not found
    """
    try:
        s = obtain_session()
        site = s.query(Site).get(id)
        host = site.host
        port = site.port
        pages = s.query(Page).filter(Page.site_id==id)
        site_schema = SiteSchema(many=False)
        form_schema = FormSchema(many=True)
        page_schema = PageSchema(many=True)
        pages = []

        stored_forms = {}
        stored_fields = {}

        for page in pages:
            link = f"{base_url}{page.name}"
            forms = s.query(Form).filter(Form.page_id==page.id)
            for i, form in enumerate(forms):
               stored_fields[f'fields_{page.id}_{i}'] = form.fields
            forms_result = form_schema.dump(forms)
            stored_forms[f'forms_{page.id}'] = forms_result

        pages_result = page_schema.dump(pages)


        for page in pages_result:
            forms = stored_forms[f'forms_{page_id}']

            for i, form in enumerate(forms):
                form_id = form.get('id')
                fields = stored_fields[f'fields_{page_id}_{i}']

                form['fields'] = fields

            page['forms'] = forms

        result = site_schema.dump(site)
        result['pages'] = pages_result
        logger.debug(f"Successfully read the crawled site {id}")
        return make_response(jsonify(result),  status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error reading the crawled site {id} - {e}")
        result = {"error": str(e)}
        return make_response(jsonify(result), status.HTTP_500_INTERNAL_SERVER_ERROR)
   

@sites_blueprint.route("/crawl/<int:id>", methods=['GET'])
def get_elements(id):
    """
    Retrieve a single Site
    This endpoint will return a Site based on it's id
    ---
    tags:
      - Crawl
    produces:
      - application/json
    parameters:
      - name: id
        in: path
        description: ID of site to crawl
        type: integer
        required: true
    responses:
      200:
        description: Site forms crawled
        schema:
          $ref: '#/definitions/Site'
      404:
        description: Site not found
    """
    try:
        base_url = "https://lovehate.io"
        s = obtain_session()
        site = s.query(Site).get(id)
        host = site.host
        port = site.port
        site_links = crawl(base_url, max_urls=20)
        crawled_pages = list(site_links)

        site_schema = SiteSchema(many=False)
        form_schema = FormSchema(many=True)
        page_schema = PageSchema(many=True)
        pages = []

        for page in crawled_pages:
            p = Page(name=page, site_id=site.id)
            s.add(p)
            pages.append(p)

        s.commit()
        s.flush()


        stored_forms = {}
        stored_fields = {}

        for page in pages:
            link = f"{base_url}{page.name}"
            crawled_forms = get_all_page_forms(link)
            forms = []

            for i, form in enumerate(crawled_forms):
               f = Form(name=form.get('name',''),
                        method=form.get('method', ''),
                        action=form.get('action', ''),
                        form_id=form.get('id',''),
                        page_id=page.id)
               s.add(f)
               forms.append(f)
               form_id = form.get('form_id')
               stored_fields[f'fields_{page.id}_{i}'] = form['fields']


            s.commit()
            s.flush()
            forms_result = form_schema.dump(forms)
            stored_forms[f'forms_{page.id}'] = forms_result
            stored_forms[f'forms_{page.id}_crawled'] = crawled_forms



        pages_result = page_schema.dump(pages)


        for page in pages_result:
            page_id = page.get('id')
            forms = stored_forms[f'forms_{page_id}']
            crawled_forms = stored_forms[f'forms_{page_id}_crawled']

            for i, form in enumerate(forms):
                form_id = form.get('id')
                fields = stored_fields[f'fields_{page_id}_{i}']
        
                form['fields'] = fields

            page['forms'] = forms

        result = site_schema.dump(site)
        result['pages'] = pages_result
        logger.debug(f"Successfully crawled the site {id}")
        return make_response(jsonify(result),  status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error crawling the site {id} - {e}")
        result = {"error": str(e)}
        return make_response(jsonify(result), status.HTTP_500_INTERNAL_SERVER_ERROR)




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
    try:
        logger.debug(f"Reading the site {id} ...")
        sess = obtain_session()
        site = sess.query(Site).get(id)
        logger.debug(f"SITE WAS ----------> {site}")
        pages = sess.query(Page).filter(Page.site_id==site.id)
        page_schema = PageSchema(many=True)
        site_schema = SiteSchema(many=False)
        pages_result = page_schema.dump(pages)
        result = site_schema.dump(site)
        result['pages'] = pages_result
        return make_response(jsonify(result), status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error reading the site {id} - {e}")
        result = {"error": str(e)}
        return make_response(jsonify(result), status.HTTP_500_INTERNAL_SERVER_ERROR)




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
            ga:
              type: string
              description: Google Analytics
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
        ga = data.get("ga", "")
        host = data.get("host", "")
        port = data.get("port", "80")
        site = Site(host=host,
                    port=int(port),
                    ga=ga)
        base_url = f"https://{host}"
        base_url = "https://lovehate.io"
        l = []

        s = obtain_session()
        s.add(site)
        s.commit()

        site_schema = SiteSchema(many=False)
        result = site_schema.dump(site)
        logger.debug(f"Saved new site {host} {port}")
        return make_response(jsonify(result),  status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Failed saving site - {e}")
        result = {"result": "failure"}
        return make_response(jsonify(result), status.HTTP_500_INTERNAL_SERVER_ERROR)



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
    logger.debug("Reading the list of all the sites ...")
    sess = obtain_session()
    all_sites  = sess.query(Site).all()
    sites_schema = SiteSchema(many=True)
    result = sites_schema.dump(all_sites)
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
    logger.debug(f"Reading the list of pages for site id {site_id}...")
    sess = obtain_session()
    pages = sess.query(Page).filter_by(site_id=site_id)
    page_schema = PageSchema(many=True)
    result = page_schema.dump(pages)
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
    logger.debug("Reading the list of all  pages ...")
    sess = obtain_session()
    all_pages  = sess.query(Page).all()
    pages_schema = PageSchema(many=True)
    result = pages_schema.dump(all_pages)
    return make_response(jsonify(result), status.HTTP_200_OK)


@sites_blueprint.route("/sites/<int:id>", methods=['DELETE'])
def delete_site(id):
    """
    Delete a Site
    This endpoint will delete a Site based the id specified in the path
    ---
    tags:
      - Sites
    description: Deletes a Site from the database
    parameters:
      - name: id
        in: path
        description: ID of site to delete
        type: integer
        required: true
    responses:
      204:
        description: Site deleted
    """
    try:
        sess = obtain_session()
        site = sess.query(Site).get(id)
        logger.debug(f"Deleting site {id} ...")

        if site:
            sess.delete(site)
            sess.commit()
            sess.flush()
        result = {"result": "success"}
        return make_response(jsonify(result), status.HTTP_204_NO_CONTENT)
    except Exception as e:
        logger.error(f"Error deleting the site {id} - {e}")
        result = {"result": "failure"}
        return make_response(jsonify(result), status.HTTP_500_INTERNAL_SERVER_ERROR)


@sites_blueprint.route("/forms", methods=['GET'])
def list_forms():
    """
    Retrieve a list of Forms
    This endpoint will return all Sites unless a query parameter is specificed
    ---
    tags:
      - Forms
    description: The Sites endpoint allows you to query Sites
    definitions:
      Form:
        type: object
        properties:
            id:
              type: integer
              description: Form id
            action:
              type: string
              desctiption: Form action
            method:
              type: string
              description: Method (POST/GET/PUT)
            form_id:
              type: string
              description: Form text ID
            name:
              type: string
              description: Form name
            page_id:
              type: integer
              description: Page ID
    responses:
      200:
        description: An array of Sites
        schema:
          type: array
          items:
            schema:
              $ref: '#/definitions/Form'
    """
    logger.debug("Reading the list of forms ...")
    sess = obtain_session()
    all_forms = sess.query(Form).all()
    forms_schema = FormSchema(many=True)
    result = forms_schema.dump(all_forms)
    return make_response(jsonify(result), status.HTTP_200_OK)


@sites_blueprint.route("/forms/<int:page_id>", methods=['GET'])
def get_forms(page_id):
    """
    Retrieve a single Form by Page ID
    This endpoint will return a Form based on it's page_id
    ---
    tags:
      - Forms
    produces:
      - application/json
    parameters:
      - name: page_id
        in: path
        description: ID of site to retrieve
        type: integer
        required: true
    responses:
      200:
        description: Form returned
        schema:
          $ref: '#/definitions/Form'
      404:
        description: Page not found
    """
    try:
        logger.debug(f"Reading the list of forms for page {page_id} ...")
        sess = obtain_session()
        forms = sess.query(Form).filter_by(page_id=page_id)
        form_schema = FormSchema(many=True)
        result = form_schema.dump(forms)
        return make_response(jsonify(result), status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error reading forms for page {page_id} - {e}")
        result = {"result": "failure"}
        return make_response(jsonify(result), status.HTTP_500_INTERNAL_SERVER_ERROR)

