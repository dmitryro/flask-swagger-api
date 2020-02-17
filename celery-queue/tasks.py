import os
import time
from celery import Celery


CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379'),
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379')

celery = Celery('tasks', broker=CELERY_BROKER_URL, backend=CELERY_RESULT_BACKEND)


@celery.task(name='tasks.anagram')
def anagram(w1, w2):
    time.sleep(5)
    w1, w2 = list(w1.upper()), list(w2.upper())
    w2.sort()
    w1.sort()
    return w1 == w2


@celery.task(name='tasks.read')
def read_anagrams():
    time.sleep(5)
