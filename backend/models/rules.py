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

class Rule(Base):
    """ Form Field """
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(256), unique=False)
    code = Column(String(256), unique=False)
    is_active = Column(Boolean, unique=False, default=True)
    action = relationship("Action", back_populates="rules")

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
                                        self.is_active):



class RuleSchema(ModelSchema):
    """ Use this schema to serialize actions """
    class Meta:
        fields = ("id", "code", "name", "is_active",)







