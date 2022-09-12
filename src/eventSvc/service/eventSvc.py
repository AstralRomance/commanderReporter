from typing import List, Dict
from datetime import datetime

from fastapi import HTTPException, Depends

from databaseSvc.databaseManipulation import DataBaseManipulation
from eventSvc.models.events import CreateEvent, EventBase, DeleteEvent
from eventSvc.service.gen_default import GenDefaultEventData


class EventService:
    def __init__(self, session=Depends(DataBaseManipulation)):
        self.session = session

    def get_all_events(self) -> List[EventBase]:
        return self.session.get_all_events()

    def get_event(self, event_id: str) -> dict:
        event = self.session.find_event(event_id)
        if not event:
            raise HTTPException(status_code=404,
                                detail={'status': False,
                                        'details': 'No event with ID: {event_id}'})
        return event

    def create_event(self, event_data: CreateEvent) -> EventBase:
        event_data = GenDefaultEventData.gen_default_event_data(event_data)
        try:
            actual_event_data = self.session.insert_event(event_data)
        except Exception as e:
            raise HTTPException(status_code=500,
                                detail=f'Cant create event with input data: {event_data};'
                                       f'Database insert response: {actual_event_data}')
        return event_data

    def update_event(self, event_id: str, event_data: CreateEvent) -> EventBase:
        event_data.Event_Date = datetime.strptime(event_data.Event_Date, '%d %B, %Y')
        update_response = self.session.update_event(event_id, dict(event_data))
        if not update_response:
            raise HTTPException(status_code=404, detail={'status': False,
                                                         'details': f'Not found event with id {event_id}'})
        update_response = {'Event_id': update_response['Event_id'],
                           'Event_name': update_response['Event_name'],
                           'Event_Date': update_response['Event_Date']}
        return update_response

    def delete_event(self, event_id: str) -> DeleteEvent:
        delete_data = self.session.delete_event(event_id)
        delete_response = {'status': delete_data == 1,
                           'delete_count': delete_data}
        return delete_response
