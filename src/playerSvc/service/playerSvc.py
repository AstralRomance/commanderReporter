from typing import List

from databaseSvc.databaseManipulation import DataBaseManipulation
from fastapi import Depends


class PlayerService:
    def __init__(self, session=Depends(DataBaseManipulation)):
        self.session = session

    def all_event_players(self, event_id: str) -> List[dict]:
        return self.session.find_event(event_id).get('Players')

    def player_on_event(self, event_id: str, player_id: int) -> dict:
        event = self.session.find_event(event_id)
        for player in event['Players']:
            if player['Player_id'] == player_id:
                return player
