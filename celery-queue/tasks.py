import os
import time
from celery import Celery
from kombu import Exchange, Queue
from utils.spide import crawl, internal_urls, get_all_page_forms

CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379'),
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379')
CELERY_DEFAULT_QUEUE = 'tasks'
CELERY_CREATE_MISSING_QUEUES = True
#CELERY_QUEUES = (
#    Queue('tasks', Exchange('tasks'), routing_key='tasks'),
#)


#CELERY_ROUTES = {
#    'tasks.crawl': {'queue': 'tasks'},
#    'tasks.pages': {'queue': 'tasks'},
#}

celery = Celery('tasks', 
                broker=CELERY_BROKER_URL, 
                backend=CELERY_RESULT_BACKEND)

#celery.conf.task_default_queue = 'default'




@celery.task(name='tasks.crawl')
def process_crawl(url):
    #site_links = crawl(url, max_urls=20)
    #crawled_pages = list(site_links)
    return "URL WAS {url}"#crawled_pages


@celery.task(name='tasks.pages')
def process_pages(pages):
    return "ALL DONE"


@celery.task(name='tasks.forms')
def process_forms(forms):
    pass


@celery.task(name='tasks.read')
def read_anagrams():
    time.sleep(5)
