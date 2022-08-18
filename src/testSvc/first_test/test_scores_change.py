import json
import pytest
import requests
from constants import DEFAULT_TARGET_ENV


def test_scores_change(setup_database_connection, generate_workflow_target_event, add_player):
    event_data = generate_workflow_target_event
    mongo_session = setup_database_connection
    target_endpoint = f'{DEFAULT_TARGET_ENV}/event-manager/add-player/{event_data["Event_id"]}'
    player_info = add_player()
    resp = requests.post(target_endpoint, data = json.dumps(player_info))
    assert resp.ok
    db_event_data = mongo_session.find_one({'Event_id': event_data['Event_id']})
    player_db_data = mongo_session.find_one({'Event_id': event_data["Event_id"]},
                                            {'Players': {'$elemMatch': {'Player_id': ['id']}}}).get('Players')[0]
    update_points_endpoint = f'{DEFAULT_TARGET_ENV}/event-manager/update-player-points/{event_data["Event_id"]}/'
    update_points_response = requests.put(update_points_endpoint+['id'],
                                          data=json.dumps({'Points': 3,
                                                           'Sub_points': 4}))
    assert player_db_data['Points'] == 3
    assert player_db_data['Sub_points'] == 4