from time import time
from typing import List
from loguru import logger

import pymongo
from pymongo import ReturnDocument

from .settings import settings


class Logger:
    def __init__(self):
        self.logger = \
            pymongo.MongoClient(settings.database_url, serverSelectionTimeoutMS=5000)['CommanderPairingService'][
                'logs']

    def __call__(self, fn):
        def log(*args, **kwargs):
            start_time = time()
            ret = fn(*args, **kwargs)
            elapsed_time = time() - start_time
            self.save_log(fn.__name__, str(int(time())), str(elapsed_time))
            return ret

        return log

    def save_log(self, name: str, time_of_call: str, elapsed_time: str):
        self.logger.insert_one({'called_method': name, 'time': time_of_call, 'elapsed_time': elapsed_time})


class DataBaseManipulation:

    def __init__(self):
        self.session = \
            pymongo.MongoClient(settings.database_url, serverSelectionTimeoutMS=5000)['CommanderPairingService'][
                'events']

    @Logger()
    def find_event(self, event_id: str) -> dict:
        return self.session.find_one({'Event_id': event_id})

    @Logger()
    def get_all_events(self) -> List[dict]:
        return [event for event in self.session.find({})]

    @Logger()
    def insert_event(self, event: dict) -> bool:
        return self.session.insert_one(event) is not None

    @Logger()
    def update_event(self, event_id: str, new_values: dict, operation='$set', array_filters=None) -> dict:
        return self.session.find_one_and_update({'Event_id': event_id},
                                                {operation: new_values},
                                                array_filters=array_filters,
                                                return_document=ReturnDocument.AFTER)

    @Logger()
    def replace_event(self, event_id: str, new_event: dict) -> bool:
        return self.session.replace_one({'Event_id': event_id}, new_event).modified_count == 1

    @Logger()
    def delete_event(self, event_id: str) -> bool:
        return self.session.delete_one({'Event_id': event_id}).deleted_count == 1

    def update_player(self, event_id: str, player_id: str, player_data: dict):
        t = self.session.update_one({'Event_id': str(event_id)},
                                    {'$set': {'Players.$[element]': dict(player_data)}},
                                    array_filters=[{'element': {'Player_id': str(player_id)}}])
        logger.debug(t.matched_count)
        logger.debug(t.modified_count)
        logger.debug(t.raw_result)

    @Logger()
    def find_player_on_event(self, event_id: str, player_id: str):
        return self.session.find_one({'Event_id': event_id}, {'Players': {'$elemMatch': {'Player_id': player_id}}})
