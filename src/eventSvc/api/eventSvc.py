import json
import os
import random
from typing import List

from fastapi import APIRouter, Depends

from ..models.events import EventBase, CreateEvent
from ..service.eventSvc import EventService

router = APIRouter(
    prefix='/events'
)


@router.get('/all-events', response_model=List[EventBase])
def get_all_events(service: EventService = Depends()):
    return service.get_all_events()


@router.get('get-event/{event_id}', response_model=EventBase)
def get_event(event_id: str, service: EventService = Depends()):
    return service.get_event(event_id)


@router.post('/add-event', response_model=EventBase)
def create_event(event_data: CreateEvent, service: EventService = Depends()):
    return service.create_event(event_data)


@router.put('/update-event/{event_id}', response_model=EventBase)
def update_event(event_id: str, event_data: CreateEvent, service: EventService = Depends()):
    return service.update_event(event_id, event_data)


@router.delete('/delete-event/{event_id}', response_model=bool)
def delete_event(event_id: str, service: EventService = Depends()):
    return service.delete_event(event_id)
    # return Response(status_code=status.HTTP_204_NO_CONTENT)


##################################### TEMPORARY THING, DON'T LOOK AT THIS)0) #########################################

@router.post('/random-player-deck-generation')
def create_random_player_generation(player: str, deck: str):
    try:
        exists_data = None
        with open('random-decks.json', 'r') as target_input:
            exists_data = json.load(target_input)
        exists_data[player] = deck
        with open('random-decks.json', 'w') as target_input:
            json.dump(exists_data, target_input)
    except IOError:
        with open('random-decks.json', 'w') as target_input:
            json.dump({player: deck})
    return {player: deck}


@router.get('/random-player-deck-generation')
def get_random_player_generation():
    players = []
    decks = []
    with open('random-decks.json', 'r') as target_input:
        all_data = json.load(target_input)
    players = list(all_data.keys())
    decks = list(all_data.values())
    for _ in range(10):
        random.shuffle(players)
        random.shuffle(decks)
    t = dict(zip(players, decks))
    print(t)
    return t


@router.delete('/random-player-deck-generation')
def clean_players():
    try:
        os.remove('random-decks.json')
    except Exception as e:
        return 'Failed to remove'
