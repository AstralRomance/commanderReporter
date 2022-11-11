from datetime import datetime
from typing import List, Union

from pydantic import BaseModel


class EventBase(BaseModel):
    Event_name: str
    Event_Date: Union[str, datetime]
    Event_id: str

class PlayerData(BaseModel):
    Player_id: str
    Player_name: str
    Player_points: int

class EventFullData(EventBase):
    Status: str
    Players: List
    Rounds: List

class CreateEvent(BaseModel):
    Event_name: str
    Event_Date: str

class DeleteEvent(BaseModel):
    status: bool
    delete_count: int
