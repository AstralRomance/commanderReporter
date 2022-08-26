import json
import pytest
import random
import requests
from constants import DEFAULT_TARGET_ENV


def test_scores_change(setup_database_connection, generate_workflow_target_event, add_player):
    event_data = generate_workflow_target_event
    mongo_session = setup_database_connection
    target_endpoint = f'{DEFAULT_TARGET_ENV}/event-manager/add-player/{event_data["Event_id"]}'
    player_name, player_commander = add_player()
    resp = requests.post(target_endpoint, json = {'Player_name': player_name, 'Commander': player_commander})
    assert resp.ok
    rounds_num = random.randint(1, 5)
    round_generate_endpoint = f'{DEFAULT_TARGET_ENV}/event-manager/generate-round/{event_data["Event_id"]}'
    for i in range(rounds_num):
        round_gen_response = requests.put(round_generate_endpoint, params={'round_number': i})
        assert round_gen_response.ok
        update_points_endpoint = f'{DEFAULT_TARGET_ENV}/event-manager/update-player-points/{event_data["Event_id"]}/{resp.json().get("Player_id")}'
        update_points_response = requests.put(update_points_endpoint,
                                              params={'round_num': i},
                                              json={'Points': 3,
                                                    'Sub_points': 4})
    
    player_db_data = mongo_session.find_one({'Event_id': event_data["Event_id"]},
                                            {'Players': {'$elemMatch': {'Player_id': resp.json().get('Player_id')}}}).get('Players')[0]
    assert player_db_data['Points'] == 3 * rounds_num
    assert player_db_data['Sub_points'] == 4 * rounds_num
    