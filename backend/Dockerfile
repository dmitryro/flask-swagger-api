FROM python:3.8-alpine

ENV CELERY_BROKER_URL redis://redis:6379/0
ENV CELERY_RESULT_BACKEND redis://redis:6379/0
ENV C_FORCE_ROOT true

ENV HOST 0.0.0.0
ENV PORT 5000
ENV DEBUG true

COPY . /api
WORKDIR /api

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk update \
    && apk add --no-cache postgresql-dev gcc python3-dev musl-dev openssl-dev libffi-dev build-base

# install dependencies
RUN pip install --upgrade pip
# install requirements
RUN pip install -r requirements.txt

# expose the app port
EXPOSE 5000

RUN pip install gunicorn

# run the app server
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "5", "app:app", "--log-level", "debug", "--timeout", "120"]
