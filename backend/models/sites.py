from flask import Flask
from flask_marshmallow import Marshmallow
from flask_marshmallow.fields import fields
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import *

app = Flask(__name__, instance_relative_config=True)
Base = declarative_base()
ma = Marshmallow(app)

class FormField(Base):
    """ Form Field """
    id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
    field_id = Column(String(256), unique=False)
    field_name = Column(String(256), unique=False)
    field_value = Column(String(2256), unique=False)
    form_id = Column(Integer, ForeignKey("forms.id"), unique=False, nullable=False)
    
    __tablename__ = "formfields"

    def __init__(self, field_id=None, field_name=None, field_value=None, form_id=None):
        self.field_id = field_id 
        self.field_name = field_name
        self.field_value = field_value
        self.form_id = form_id

    def __repr__(self):
        return "<FormField {} {} {}>".format(self.field_id,
                                             self.field_name,
                                             self.field_valuer)


class Form(Base):
    """ Form """
    id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
    form_id = Column(String(256), unique=False)
    name = Column(String(256), unique=False)
    method = Column(String(256), unique=False)
    body = Column(String(2256), unique=False)
    page_id = Column(Integer, ForeignKey("pages.id"), unique=False, nullable=False)

    __tablename__ = "forms"

    def __init__(self, form_id=None, 
                       name=None, 
                       method=None, 
                       body=None,
                       page_id=None):
        self.name = name
        self.body = body
        self.method = method
        self.form_id = form_id
        self.page_id = page_id

    def __repr__(self):
        return "<Form {} {}>".format(self.name,
                                     self.body)



class Site(Base):
    """ The site record to save in Postgres """

    id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
    host = Column(String(1256), unique=False)
    port = Column(Integer, primary_key=True)
    ip = Column(String(256), unique=True)
    date_last_crawled = Column(DateTime(timezone=True),    
                               server_default=func.now())


    __tablename__ = "sites"

    def __init__(self, host=None, port=None,
                 date_last_crawled=func.now()):
        self.host = host
        self.port = port
        self.ip = '127.0.0.1'
        self.date_last_crawled = date_last_crawled

    def __repr__(self):
        return "<Site {} {} {} {} {}>".format(self.id,
                                              self.host,
                                              self.port,
                                              self.ip,
                                              self.date_last_crawled)



class Page(Base):
    """ The site page """
    id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
    name = Column(String(256), unique=False)
    meta = Column(String(1256), unique=False)
    headers = Column(String(1256), unique=False)
    site_id = Column(Integer, ForeignKey(Site.id), unique=True, nullable=False)

    __tablename__ = "pages"


    def __init__(self, name=None, meta=None, headers=None, site_id=None):
        self.name = name
        self.meta = meta
        self.headers = headers
        self.site_id = site_id

    def __repr__(self):
        return "<Page {} {} {} {} {}>".format(self.id,
                                              self.name,
                                              self.meta,
                                              self.headers,
                                              self.site_id)

class FormFieldSchema(ma.ModelSchema):
    """ Use this schema to serialize formfields """
    class Meta:
        model = FormField


class FormSchema(ma.ModelSchema):
    """ Use this schema to serialize forms """
    fields = fields.Nested(FormFieldSchema)

    class Meta:
        model = Form


class PageSchema(ma.ModelSchema):
    """ Use this schema to serialize pages """
    forms = fields.Nested(FormSchema)

    class Meta:
        model = Page


class SiteSchema(ma.ModelSchema):
    """ Use this schema to serialize sites """
    pages = fields.Nested(PageSchema)

    class Meta:
        model = Site





