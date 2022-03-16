from typing import List

from databaseSvc.databaseManipulation import DataBaseManipulation
from fastapi import HTTPException, Depends

from ..models.events import CreateEvent


class EventService:
    def __init__(self, session=Depends(DataBaseManipulation)):
        self.session = session

    def get_all_events(self) -> List[dict]:
        return self.session.get_all_events()

    def get_event(self, event_id: str) -> dict:
        event = self.session.find_event(event_id)
        if not event:
            raise HTTPException(status_code=404, detail='No event with chosen ID')
        return event

    def create_event(self, event_data: CreateEvent) -> dict:
        event_data['Status'] = 'created'
        self.session.insert_event(event_data)
        return event_data

    def update_event(self, event_id: str, event_data: CreateEvent) -> dict:
        return self.session.update_event(event_id, event_data)

    def delete_event(self, event_id: str) -> bool:
        return self.session.delete_event(event_id)
