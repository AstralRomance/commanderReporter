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
    mongo_client = pymongo.MongoClient(os.environ.get('DATABASE_URL'), serverSelectionTimeoutMS=5000)['CommanderPairingService']['events']
    yield mongo_client


@pytest.fixture(scope='class')
def generate_workflow_target_event(setup_database_connection):
    create_event_endpoint = '/events/add-event'
    target_event_name = f'Test_event_{uuid4()}'
    target_event_date = str(datetime.datetime.now())
    resp = requests.post(DEFAULT_TARGET_ENV+create_event_endpoint,
                         data=json.dumps({'Event_name': target_event_name,
                                          'Event_Date': target_event_date}))
    assert resp.ok, resp.json()
    event_data = resp.json()
    yield event_data
    mongo_session = setup_database_connection
    mongo_session.delete_one({'Event_name': target_event_name})
