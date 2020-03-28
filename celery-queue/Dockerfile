FROM python:3.8-alpine

ENV CELERY_BROKER_URL redis://redis:6379/0
ENV CELERY_RESULT_BACKEND redis://redis:6379/0
ENV C_FORCE_ROOT true
ENV CELERY_MAX_CONCURRENCY 40
COPY . /queue
WORKDIR /queue

RUN pip install -r requirements.txt
ENTRYPOINT celery -A tasks worker --loglevel=debug 
#info -Q tasks --autoscale=${CELERY_MAX_CONCURRENCY},${CELERY_MIN_CONCURRENCY}
