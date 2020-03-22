from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import *
from flask_marshmallow import Marshmallow

app = Flask(__name__, instance_relative_config=True)
Base = declarative_base()
ma = Marshmallow(app)

class FormField(Base):
    """ Form Field """
    id = Column(Integer, primary_key=True, unique=True)
    field_id = Column(String(256), unique=False)
    field_name = Column(String(256), unique=False)
    field_value = Column(String(2256), unique=False)
    form_id = Column(Integer, ForeignKey("form.id"), unique=True)
    
    __tablename__ = "formfield"

    def __init__(self, field_id=None, field_name=None, field_value=None):
        self.field_id = field_id 
        self.field_name = field_name
        self.field_value = field_value

    def __repr__(self):
        return "<FormField {} {} {}>".format(self.field_id,
                                             self.field_name,
                                             self.field_valuer)


class Form(Base):
    """ Form """
    id = Column(Integer, primary_key=True, unique=True)
    form_id = Column(String(256), unique=False)
    name = Column(String(256), unique=False)
    method = Column(String(256), unique=False)
    body = Column(String(2256), unique=False)
    page_id = Column(Integer, ForeignKey("page.id"), unique=True)

    __tablename__ = "form"

    def __init__(self, form_id=None, 
                       name=None, 
                       method=None, 
                       body=None):
        self.name = name
        self.body = body
        self.method = method
        self.form_id = form_id

    def __repr__(self):
        return "<Form {} {}>".format(self.name,
                                     self.body)


class Page(Base):
    """ The site page """
    id = Column(Integer, primary_key=True, unique=True)
    name = Column(String(256), unique=False)
    meta = Column(String(1256), unique=False)
    headers = Column(String(1256), unique=False)
    site_id = Column(Integer, ForeignKey("site.id"), unique=True)

    __tablename__ = "page"


    def __init__(self, name=None, meta=None, headers=None):
        self.name = name
        self.meta = meta
        self.headers = headers

    def __repr__(self):
        return "<Page {} {} {}>".format(self.name,
                                        self.meta,
                                        self.header)

class Site(Base):
    """ The site record to save in Postgres """

    id = Column(Integer, primary_key=True, unique=True)
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
        return "<Site {} {} {} {}>".format(self.host,
                                           self.port,
                                           self.ip,
                                           self.date_last_crawled)



class FormFieldSchema(ma.ModelSchema):
    """ Use this schema to serialize formfields """
    class Meta:
        model = FormField


class FormSchema(ma.ModelSchema):
    """ Use this schema to serialize forms """
    class Meta:
        model = Form


class PageSchema(ma.ModelSchema):
    """ Use this schema to serialize pages """
    class Meta:
        model = Page


class SiteSchema(ma.ModelSchema):
    """ Use this schema to serialize sites """
    class Meta:
        model = Site





