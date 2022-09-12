from typing import Dict, List, Union, Optional
from datetime import datetime
from pydantic import BaseModel


################################################ PLAYER MANAGEMENT MODELS ################################################

class AddPlayerToEvent(BaseModel):
    Player_name: str
    Commander: Optional[str] = None
    Deck_link: Optional[str] = None


# TODO: change model naming to avoid using reserved words
class PlayerOnTable(BaseModel):
    name: str
    id: str


class FullPlayerData(AddPlayerToEvent):
    Points: int
    Sub_points: int
    Hidden_points: float
    Status: bool
    Player_id: str
    Player_name: str
    

class UpdatePlayerResponse:
    status: bool
    player_data: FullPlayerData


################################################ ROUNDS MANAGEMENT MODELS ################################################


class RoundGenData(BaseModel):
    round_number: int
    tables: List[PlayerOnTable]
    buys: List[PlayerOnTable]


class Table(BaseModel):
    Table_num: int
    Table_players: List[PlayerOnTable]


class Round(BaseModel):
    Number: int
    Players_on_table: List[Table]


class TagretPlayerPoints(BaseModel):
    Points: int
    Sub_points: int


class GeneralEventInfo(BaseModel):
    Event_id: str
    Event_name: str
    Event_Date: datetime
    Players: List[FullPlayerData]
    Rounds: Union[List[Round], None]
    Status: str
