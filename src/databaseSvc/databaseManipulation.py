import asyncio
from typing import List, Dict
from time import time

import pymongo
from pymongo import ReturnDocument

import motor.motor_asyncio

from .settings import settings
from .databaseSchema import Event, Player


class DataBaseManipulation:

    def __init__(self):
        self.session = \
            pymongo.MongoClient(settings.database_url, serverSelectionTimeoutMS=5000)['CommanderPairingService'][
                'events']

        self.logger = pymongo.MongoClient(settings.database_url, serverSelectionTimeoutMS=5000)['CommanderPairingService'][
                'logs']
        # self.logger = motor.motor_asyncio.AsyncIOMotorClient(settings.database_url, serverSelectionTimeoutMS=5000)['CommanderPairingService']['logs']

    def __log_insert(self, name, time_of_call, elapsed_time):
        self.logger.insert_one({'called_method': name, 'time': time_of_call, 'elapsed_time': elapsed_time})

    def __log(method):
        def inner(*args, **kwargs):
            start_time = time()
            ret = method(*args, **kwargs)
            elapsed_time = time() - start_time
            args[0].__log_insert(method.__name__, str(int(time())), str(elapsed_time))
            return ret

        return inner

    @__log
    def find_event(self, event_id: str) -> dict:
        return self.session.find_one({'Event_id': event_id})

    @__log
    def insert_event(self, event: dict):
        self.session.insert_one(event)

    @__log
    def get_all_events(self) -> List[dict]:
        return [event for event in self.session.find({})]

    @__log
    def delete_event(self, event_id: str) -> dict:
        return self.session.find_one_and_delete({'Event_id': event_id})

    @__log
    def update_event(self, event_id: str, new_values: dict) -> dict:
        return self.session.find_one_and_update({'Event_id': event_id}, {'$set': new_values},
                                                return_document=ReturnDocument.AFTER)

    @__log
    def update_player_on_event(self, event_id: str, player_id: str, player_data: dict):
        return self.session.find_one_and_update({'Event_id': event_id},
                                                {'$set': {'Players.$[element]': player_data}},
                                                array_filters=[{'element': {'$eq': {'Player_id': player_id}}}],
                                                return_document=ReturnDocument.AFTER)

    @__log
    def replace_event(self, event_id: str, new_event: dict) -> dict:
        return self.session.find_one_and_replace({'Event_id': event_id}, new_event,
                                                 return_document=ReturnDocument.AFTER)

    @__log
    def remove_player_from_event(self, event_id: str, player_id: str) -> dict:
        event = self.find_event(event_id)
        if event['Status'] == 'created':
            target_document = self.session.update({'Event_id': event_id},
                                                  {'$pull': {'Players': {'Player_id': player_id}}})
        elif event['Status'] == 'started':
            target_document = self.session.find_one_and_update({'Event_id': event_id},
                                                               {'$set': {'Players.$[element]': {'Status': True}}},
                                                               array_filters=[
                                                                   {'element': {'$eq': {'Player_id': player_id}}}],
                                                               return_document=ReturnDocument.AFTER)
        elif event['Status'] == 'finished':
            target_document = {'error': 'Event already finished'}
        return target_document

    @__log
    def update_player(self, event_id: str, player_id: str, player_data: dict):
        self.session.find_one_and_update({'Event_id': event_id},
                                         {'$set': {'Players.$[element]': player_data}},
                                         array_filters=[{'element': {'$eq': {'Player_id': player_id}}}],
                                         return_document=ReturnDocument.AFTER)

    @__log
    def get_player_from_event(self, event_id: str, player_id: str) -> dict:
        event = self.find_event(event_id)
        target_player = None
        for player in event['Players']:
            if player['Player_id'] == player_id:
                target_player = player
                break
        return target_player

    @__log
    def get_all_event_players(self, event_id: str) -> List[dict]:
        event = self.find_event(event_id)
        event_players = event.get('Players')
        return event_players

    @__log
    def add_player_into_event(self, event_id: str, player: dict) -> dict:
        return self.add_players_into_event(event_id, [player])

    @__log
    def add_players_into_event(self, event_id: str, players: List[dict]) -> dict:
        event = self.find_event(event_id)
        if event.get('Players') is None:
            event['Players'] = players
        else:
            event['Players'].extend(players)
        return self.replace_event(event_id, event)
