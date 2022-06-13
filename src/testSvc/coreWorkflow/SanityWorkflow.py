import json
import random
from string import ascii_lowercase

import requests
import pytest

from constants import DEFAULT_TARGET_ENV


class SanityWorkflow:
    def test_points_changed_correctly(self, generate_workflow_target_event, setup_database_connection):
        event_info = generate_workflow_target_event.json()
        mongo_session = setup_database_connection
        add_player_endpoint = f'{DEFAULT_TARGET_ENV}/event-manager/add-player/{event_info["Event_id"]}'
        update_points_endpoint = f'{DEFAULT_TARGET_ENV}/event-manager/update-player-points/{event_info["Event_id"]}/'

        

        # update_points_response = requests.put(update_points_endpoint+table_winner['id'],
        #                                                   params={'round_num': 1},
        #                                                   data=json.dumps({'Points': 3,
        #                                                                    'Sub_points': random.randint(4, 4)}))
