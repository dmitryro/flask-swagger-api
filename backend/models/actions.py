from flask import Flask
from flask_marshmallow import Marshmallow
from marshmallow_sqlalchemy import ModelSchema
from flask_marshmallow.fields import fields
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import *

app = Flask(__name__, instance_relative_config=True)
Base = declarative_base()
ma = Marshmallow(app)

class Action(Base):
    """ Form Field """
    id = Column(Integer, primary_key=True, autoincrement=True)
    profile_key = Column(String(256), unique=False)
    name = Column(String(256), unique=False)
    is_running =  Column(Boolean, unique=False)
    last_run = Column(DateTime(timezone=True), server_default=func.now())

    __tablename__ = "actions"

    def __init__(self, profile_key=None, name=None, 
                 is_running = False, last_run=func.now()):
        self.profile_key = profile_key
        self.name = name
        self.is_running = is_running
        self.last_run = last_run


    def __repr__(self):
        return "<Action {} {} {} {}>".format(self.profile_key,
                                             self.name,
                                             self.is_running,
                                             self.last_run)




class ActionSchema(ModelSchema):
    """ Use this schema to serialize actions """
    class Meta:
        fields = ("id", "profile_key", "name", "is_running", "last_run",)







