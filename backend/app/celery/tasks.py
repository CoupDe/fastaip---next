import time
from celery import Celery
from dotenv import load_dotenv
import os

load_dotenv("backend/.env")
broker_url = os.environ.get("BROKER_URL")
backend_url = os.environ.get("BACKEND_URL")
print("broker_url", broker_url)
print("broker_url", backend_url)
app = Celery('myapp')
app.config_from_object('celeryconfig')



@app.task(name="testTask")
def testTask(a, b, c):
    time.sleep(5)
    return a * b * c
