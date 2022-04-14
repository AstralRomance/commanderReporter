import random
from copy import copy, deepcopy
from operator import itemgetter
from uuid import uuid4

from fastapi import Depends
from loguru import logger

from databaseSvc.databaseManipulation import DataBaseManipulation

from eventManagerSvc.models.eventManager import AddPlayerToEvent


class EventManagerSvc:
    def __init__(self, session=Depends(DataBaseManipulation)):
        self.session = session

    def gen_default_player_params(self, player_data: AddPlayerToEvent) -> dict:
        new_player = {'Points': 0,
                      'Sub_points': 0,
                      'Has_autowin': 0,
                      'Hidden_points': 0,
                      'Status': False,
                      'Player_id': str(uuid4()),
                      'Player_name': player_data.Player_name,
                      'Commander': player_data.Commander}
        if player_data.Deck_link:
            new_player['Deck_link'] = player_data.Deck_link
        return new_player

    def gen_player_hidden_points(self, turn_postition: int, round_number: int, points: int, sub_points: int) -> float:
        """
            This is only my fantasies, we need to discuss this thing. This is only template for calculating points.
        """
        position_coefficient = 1 + (turn_postition / 10)
        round_coefficient = 1 + round_number / 10 if round_number > 1 else 1
        logger.debug(position_coefficient)
        logger.debug(round_coefficient)
        logger.debug((points * position_coefficient * round_coefficient) + sub_points / 15)
        return (points * position_coefficient * round_coefficient) + sub_points / 15

    def get_full_event_data(self, event_id: str) -> dict:
        return self.session.find_event(event_id)

    def change_event_state(self, event_id: str, target_state: str):
        return self.session.update_event(event_id, {'Status': target_state})

    def update_player_on_event(self, event_id: str, player_id: str, player_data: dict):
        return self.session.update_player(event_id, player_id, player_data)

    def add_player_to_event(self, event_id: str, player_data: AddPlayerToEvent) -> dict:
        target_event = self.session.find_event(event_id)
        target_player_data = self.gen_default_player_params(player_data)
        if target_event.get('Players'):
            target_event['Players'].append(target_player_data)
        else:
            target_event['Players'] = [target_player_data]
        self.session.replace_event(event_id, target_event)
        return target_player_data

    def remove_player_from_event(self, event_id: str, player_id: str) -> dict:
        event = self.session.find_event(event_id)
        if event['Status'] == 'created':
            return self.session.update_event(event_id,
                                             {'Players': {'Player_id': player_id}},
                                             operation='$pull')
        elif event['Status'] == 'started':
            return self.session.update_player(event_id,
                                              player_id,
                                              {'Status': True})
        elif event['Status'] == 'finished':
            return {'error': 'Event already finished'}  # Change this to http exception

    def update_player_points(self, event_id: str, player_id: str, round_number: int, player_data: dict):
        try:
            target_player = self.session.find_player_on_event(event_id, player_id).get('Players')[0]
        except Exception as e:
            return 404
        target_event_rounds = self.session.find_event(event_id).get('Rounds')
        target_table = None
        for event_round in target_event_rounds:
            if event_round['Number'] == round_number:
                for table in event_round['Players_on_table']:
                    if player_id in [t_id['id'] for t_id in table['Table_players']]:
                        target_table = table
        if target_table:
            table_players = [player['id'] for player in target_table['Table_players']]
            logger.debug(table_players)
            player_turn_pos = table_players.index(target_player['Player_id'])+1
        else:
            player_turn_pos = 1
        target_player['Points'] += player_data.Points
        target_player['Sub_points'] += player_data.Sub_points
        player_hidden_points = self.gen_player_hidden_points(player_turn_pos,
                                                             round_number,
                                                             int(target_player['Points']),
                                                             int(target_player['Sub_points']))
        if target_player.get('Hidden_points'):
            target_player['Hidden_points'] += player_hidden_points
        else:
            target_player['Hidden_points'] = player_hidden_points
        return self.session.update_player(event_id, player_id, target_player)

    def generate_round(self, event_id: str, round_number: int):
        target_event = self.session.find_event(event_id)
        logger.debug('*'*100)
        logger.debug(target_event)
        target_players_data = [{'name': player['Player_name'],
                                'id': player['Player_id'],
                                'Hidden_points': player['Hidden_points']} for player in target_event['Players']]
        if round_number == 1:
            for _ in range(5):
                random.shuffle(target_players_data)
        else:
            target_players_data = sorted(target_players_data, key=itemgetter('Hidden_points'), reverse=True)
        players_on_tables = [target_players_data[i:i + 4] for i in range(0, len(target_players_data), 4)]
        # Give buys to players
        # Need to update and generate rounds using this parameter.
        players_to_tables = deepcopy(players_on_tables)
        if len(players_on_tables[-1]) < 3:
            for player in players_on_tables[-1]:
                player['Has_autowin'] = 3
                self.session.update_player(event_id, player['id'], player)
            players_to_tables = players_on_tables[:-1]
        [random.shuffle(table) for table in players_to_tables]
        tables_data = [{'Table_num': table_num+1, 'Table_players': players_to_tables[table_num]} for table_num in range(len(players_to_tables))]
        logger.debug('*'*100)
        logger.debug(target_event)
        if target_event.get('Rounds'):
            target_event['Rounds'].append({'Number': round_number,
                                           'Players_on_table': tables_data})
        else:
            target_event['Rounds'] = [{'Number': round_number,
                                       'Players_on_table': tables_data}]
        return self.session.update_event(event_id, target_event)
        