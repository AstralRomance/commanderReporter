from uuid import uuid4
import datetime
import os
import json

import pytest
import pymongo
import requests

from constants import DEFAULT_TARGET_ENV


@pytest.fixture(scope='session')
def setup_database_connection():
    mongo_client = pymongo.MongoClient("DATABASE_URL", serverSelectionTimeoutMS=50000)['CommanderPairingService']['events']
    yield mongo_client
    mongo_client.close()


@pytest.fixture(scope='class')
def generate_workflow_target_event(setup_database_connection):
    create_event_endpoint = '/events/add-event'
    target_event_name = f'Test_event_{uuid4()}'
    target_event_date = datetime.datetime.now()
    target_event_date = target_event_date.strftime('%d %B, %Y')
    print(DEFAULT_TARGET_ENV+create_event_endpoint)
    resp = requests.post(DEFAULT_TARGET_ENV+create_event_endpoint,
                         data=json.dumps({'Event_name': target_event_name,
                                          'Event_Date': '18 April, 2022'}))
    assert resp.ok, resp.text
    event_data = resp.json()
    yield event_data
    mongo_session = setup_database_connection
    mongo_session.delete_one({'Event_name': target_event_name})
