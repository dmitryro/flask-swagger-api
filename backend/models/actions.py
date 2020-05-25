from flask import Flask
from marshmallow_sqlalchemy import ModelSchema
from flask_marshmallow import Marshmallow
from flask_marshmallow.fields import fields
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import *

Base = declarative_base()

app = Flask(__name__, instance_relative_config=True)
ma = Marshmallow(app)

#rule_association_table = Table('action_rule_link', Base.metadata,
#    Column('rule_id', Integer, ForeignKey('rules.id')),
#    Column('action_id', Integer, ForeignKey('actions.id'))
#)

#form_association_table = Table('action_form_link', Base.metadata,
#    Column('form_id', Integer, ForeignKey('forms.id')),
#    Column('action_id', Integer, ForeignKey('actions.id'))    
#)

#field_association_table = Table('action_formfield_link', Base.metadata,
#    Column('formfield_id', Integer, ForeignKey('formfields.id')),
#    Column('action_id', Integer, ForeignKey('actions.id'))
#)

class FormField(Base):
    """ Form Field """
    id = Column(Integer, primary_key=True, autoincrement=True)
    field_id = Column(String(256), unique=False)
    field_name = Column(String(256), unique=False)
    field_type = Column(String(256), unique=False)
    field_placeholder = Column(String(256), unique=False)
    field_value = Column(String(2256), unique=False)
    form_id = Column(Integer, ForeignKey("forms.id"), unique=False, nullable=False)
    action_id = Column(Integer, unique=False, nullable=True)
    actions = relationship("Action", secondary="action_formfield_link")

    __tablename__ = "formfields"

    def __init__(self, field_id=None, field_name=None, field_value=None,
                form_id=None, field_type=None, field_placeholder=None):
        self.field_id = field_id
        self.field_name = field_name
        self.field_value = field_value
        self.form_id = form_id
        self.field_type = field_type
        self.field_placeholder = field_placeholder

    def __repr__(self):
        return "<FormField {} {} {}>".format(self.field_id,
                                             self.field_name,
                                             self.field_valuer)



class Form(Base):
    """ Form """
    id = Column(Integer, primary_key=True, autoincrement=True)
    form_id = Column(String(256), unique=False)
    name = Column(String(256), unique=False)
    method = Column(String(256), unique=False)
    body = Column(String(2256), unique=False)
    page_id = Column(Integer, ForeignKey("pages.id"), unique=False, nullable=False)
    action = Column(String(2256), unique=False, nullable=True)
    action_id = Column(Integer, unique=False, nullable=True)
    actions = relationship("Action", secondary="action_form_link")

    __tablename__ = "forms"

    def __init__(self, form_id=None,
                       name=None,
                       method=None,
                       action=None,
                       body=None,
                       page_id=None):
        self.action = action
        self.name = name
        self.body = body
        self.method = method
        self.form_id = form_id
        self.page_id = page_id

    def __repr__(self):
        return "<Form {} {}>".format(self.name,
                                     self.body)


class Rule(Base):
    """ Form Field """
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(256), unique=False)
    code = Column(String(256), unique=False)
    is_active = Column(Boolean, unique=False, default=True)
    actions = relationship("Action", secondary="action_rule_link")

    __tablename__ = "rules"

    def __init__(self,
                 name=None,
                 code=None,
                 is_active=True):
        self.name = name
        self.code = code
        self.is_active = is_active

    def __repr__(self):
        return "<Rule {} {} {}>".format(self.code,
                                        self.name,
                                        self.is_active)



class Action(Base):
    """ Form Field """
    id = Column(Integer, primary_key=True, autoincrement=True)
    profile_key = Column(String(256), unique=False)
    name = Column(String(256), unique=False)
    is_running =  Column(Boolean, unique=False)
    last_run = Column(DateTime(timezone=True), server_default=func.now())
    rules = relationship("Rule", secondary="action_rule_link")
    forms = relationship("Form", secondary="action_form_link")
    formfields = relationship("FormField", secondary="action_formfield_link")

    __tablename__ = "actions"

    def __init__(self, profile_key=None, name=None, 
                 form_id =  None,
                 form_field_id = None,
                 is_running = False, last_run=func.now()):
        self.profile_key = profile_key
        self.name = name
        self.is_running = is_running
        self.last_run = last_run
        self.form_id = form_id
        self.field_id = field_id

    def __repr__(self):
        return "<Action {} {} {} {} {} {}>".format(self.profile_key,
                                                   self.name,
                                                   self.is_running,
                                                   self.last_run,
                                                   self.form_id,
                                                   self.form_field_id)

class Script(Base):
    """ Form Field """
    id = Column(Integer, primary_key=True, autoincrement=True)
    profile_key = Column(String(256), unique=False)
    code = Column(String(10000), unique=False)
    version = Column(Float, nullable=True, default=1.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __tablename__ = "scripts"


    def __init__(self, code=None,
                       version=1.0,
                       profile_key=None,
                       time_created=func.now()):
        self.code = code
        self.version = version
        self.profile_key = profile_key
        self.time_created = time_created

    def __repr__(seld):
        return f"<Script {self.code} {self.version} {self.profile_key} {self.time_created}>"


class ActionRuleLink(Base):
    __tablename__ = 'action_rule_link'
    id = Column(Integer, primary_key=True)
    action_id = Column(Integer, ForeignKey('actions.id'))
    rule_id = Column(Integer, ForeignKey('rules.id'))
    # ... any other fields
    #rule_actions = relationship(Action, backref=backref("actions", cascade="all, delete-orphan"))
    #actions = relationship(Action, backref=backref("rules", cascade="all, delete-orphan"))

    #rules = relationship(Rule, backref=backref("rules", cascade="all, delete-orphan"))


class FormLink(Base):
    __tablename__ = 'action_form_link'
    id = Column(Integer, primary_key=True)
    action_id = Column(Integer, ForeignKey('actions.id'))
    form_id = Column(Integer, ForeignKey('forms.id'))
    # ... any other fields
    #form_actions = relationship(Action, backref=backref("actions", cascade="all, delete-orphan"))
    forms = relationship(Form, backref=backref("forms", cascade="all, delete-orphan"))


class FormFormFieldLink(Base):
    __tablename__ = 'form_formfield_link'
    id = Column(Integer, primary_key=True)
    form_id = Column(Integer, ForeignKey('actions.id'))
    formfield_id = Column(Integer, ForeignKey('forms.id'))
    # ... any other fields
    #form_actions = relationship(Action, backref=backref("actions",cascade="all, delete-orphan"))
    #formsfields = relationship(FormField, backref=backref("formsfields", cascade="all, delete-orphan"))


class FormFieldLink(Base):
    __tablename__ = 'action_formfield_link'
    id = Column(Integer, primary_key=True)
    action_id = Column(Integer, ForeignKey('actions.id'))
    formfield_id = Column(Integer, ForeignKey('formfields.id'))
    # ... any other fields
    #formfield_actions = relationship(Action, backref=backref("actions", cascade="all, delete-orphan"))
    #formfields = relationship(Form, backref=backref("formsfields", cascade="all, delete-orphan"))


class RuleSchema(ModelSchema):
    """ Use this schema to serialize rules """
    class Meta:
        fields = ("id", "code", "name", "is_active",)


class FormFieldSchema(ModelSchema):
    """ Use this schema to serialize formfields """
    class Meta:
        fields = ("id", "field_id", "field_nname", "field_type",
                  "field_placeholder", "field_value", "form_id",)


class FormSchema(ModelSchema):
    """ Use this schema to serialize forms """
    fields = fields.Nested(FormFieldSchema)

    class Meta:
        fields = ("id", "form_id", "name", "method", "body", "page_id", "action",)


class ScriptSchema(ModelSchema):
    class Meta:
        fields = ("id", "profile_key", "code", "version",
                  "created_at",)


class ActionSchema(ModelSchema):
    """ Use this schema to serialize actions """
    rules = fields.Nested(RuleSchema)
    forms = fields.Nested(FormSchema)
    fields = fields.Nested(FormFieldSchema)

    class Meta:
        fields = ("id", "profile_key", "name", "is_running", "last_run",)

