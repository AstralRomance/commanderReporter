import os
from pathlib import Path
import pandas as pd
import requests


os.chdir(Path(__file__).resolve().parents[1])

import pymongo


with open('.env') as env_doc:
    target_mongo_creds = env_doc.read()
    target_mongo_creds = target_mongo_creds.split(r'"')[1]
mongo_session = pymongo.MongoClient(target_mongo_creds, serverSelectionTimeoutMS=5000)['CommanderPairingService']['events']
os.chdir(Path(__file__).resolve().parents[0])

events = mongo_session.find({})
attendance_list = []
for event in events:
    if 'spellmarket' in event['Event_name'].lower():
        attendance_list.append((event['Event_Date'].split()[0], len(event['Players'])))


df = pd.DataFrame(attendance_list, columns=['date', 'players'])
df.to_csv('spellmarket_players.csv')



moscow_events_request = requests.get('https://edh-pairings.herokuapp.com/api/v1/tournaments/')
if moscow_events_request.ok:
    moscow_events_data = moscow_events_request.json()
    target_data = []
    for event in moscow_events_data:
        if ('goldfish' in event['name'].lower()) or ('cedh' in event['name'].lower()):
            target_data.append((event['date_created'].split('T')[0], len(event['players'])))

df = pd.DataFrame(target_data, columns=['date', 'players'])
df.to_csv('moscow_players.csv')
