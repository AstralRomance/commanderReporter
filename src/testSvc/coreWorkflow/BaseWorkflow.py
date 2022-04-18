import json
import random
from string import ascii_lowercase

import requests
import pytest

from constants import DEFAULT_TARGET_ENV, DEFAULT_LOCAL_MANAGER


class TestBaseEventWorkflow:
    def test_created_event(self, generate_workflow_target_event, setup_database_connection):
        mongo_connection = setup_database_connection
        event_data = generate_workflow_target_event
        db_event_data = [event for event in mongo_connection.find({'Event_id': event_data['Event_id']})]
        assert len(db_event_data) == 1, db_event_data
        db_event_data = db_event_data[0]
        for mandatory_field in ['Event_name', 'Event_Date', 'Status', 'Event_id']:
            assert db_event_data.get(mandatory_field)

    @pytest.mark.parametrize('target_players_number', [random.randint(12, 24)])
    def test_add_players(self, generate_workflow_target_event, setup_database_connection, target_players_number):
        event_data = generate_workflow_target_event
        mongo_session = setup_database_connection
        target_endpoint = f'{DEFAULT_TARGET_ENV}/event-manager/add-player/{event_data["Event_id"]}'
        for _ in range(target_players_number):
            player_name = ''.join([letter for letter in random.sample(list(ascii_lowercase), random.randint(1, 8))])
            player_commander = ''.join([letter for letter in random.sample(list(ascii_lowercase), random.randint(1, 5))])
            resp = requests.post(target_endpoint, data = json.dumps({'Player_name': player_name, 'Commander': player_commander}))
            assert resp.ok, resp.json()
        db_event_data = mongo_session.find_one({'Event_id': event_data['Event_id']})
        assert len(db_event_data['Players']) == target_players_number

    @pytest.mark.parametrize('rounds_number', [random.randint(3, 6)])
    def test_update_players_points_and_round_gen(self, generate_workflow_target_event, setup_database_connection, rounds_number):
        event_info = generate_workflow_target_event
        mongo_session = setup_database_connection
        round_generate_endpoint = f'{DEFAULT_TARGET_ENV}/event-manager/generate-round/{event_info["Event_id"]}'
        update_points_endpoint = f'{DEFAULT_TARGET_ENV}/event-manager/update-player-points/{event_info["Event_id"]}/'
        for round_number in range(1, rounds_number):
            round_gen_response = requests.put(round_generate_endpoint, params={'round_number': round_number})
            assert round_gen_response.ok, round_gen_response.json()
            event_info = round_gen_response.json()
            assert len(event_info['Rounds']) == round_number
            for event_round in event_info['Rounds']:
                for table in event_round['Players_on_table']:
                    assert len(table['Table_players']) > 2, table
                    table_winner = random.choice(table['Table_players'])
                    player_db_data = mongo_session.find_one({'Event_id': event_info["Event_id"]},
                                                            {'Players': {'$elemMatch': {'Player_id': table_winner['id']}}}).get('Players')[0]
                    update_points_response = requests.put(update_points_endpoint+table_winner['id'],
                                                          params={'round_num': round_number},
                                                          data=json.dumps({'Points': 3,
                                                                           'Sub_points': random.randint(1, 4)}))
                    assert update_points_response.ok, update_points_response.json()
                    for player in update_points_response.json()['Players']:
                        if player['Player_id'] == table_winner['id']:
                            assert player['Points'] != player_db_data['Points']
                            assert player['Sub_points'] != player_db_data['Sub_points']
                            assert player['Hidden_points'] != player_db_data['Hidden_points']
                            break
