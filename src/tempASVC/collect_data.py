from operator import itemgetter
from collections import Counter
from itertools import combinations
import requests
import pymongo
import seaborn as sns
from matplotlib import pyplot as plt
import pandas as pd

TRANSLITERATED_BASE = {'тумна': 'tymna', 'трасиос': 'thrasios'}

def get_sorted_players(players: list)-> list:
    return sorted(players, key=itemgetter('Hidden_points'), reverse=True)

def get_real_commander_name(commander_name: str) -> str:
    print(commander_name.lower())
    print(TRANSLITERATED_BASE.get(commander_name.lower()))
    current_commander = TRANSLITERATED_BASE.get(commander_name.lower(), commander_name)
    scryfall_request = requests.get(f'https://api.scryfall.com/cards/search?include_multilingual=true&q={current_commander} t:legendary')
    if scryfall_request.ok:
        real_name = scryfall_request.json()['data'][0]['name']
        return real_name


with open('.env') as env_doc:
    target_mongo_creds = env_doc.read()
    target_mongo_creds = target_mongo_creds.split(r'"')[1]
mongo_session = pymongo.MongoClient(target_mongo_creds, serverSelectionTimeoutMS=5000)['CommanderPairingService']['events']
events = mongo_session.find({})
spellmarket_events = [event for event in events if 'spellmarket' in event['Event_name'].lower()]
global_player_names = []
global_commanders = []
for event in spellmarket_events:
    players = [player for player in event['Players']]
    players = get_sorted_players(players)
    global_commanders.extend([player['Commander'] for player in players if player['Commander']])
    global_player_names.extend([player['Player_name'] for player in players])

global_player_names_unique = []
for player_comb in combinations(global_player_names, 2):
    if (player_comb[0] in player_comb[1]) or (player_comb[1] in player_comb[0]):
        pl1 = player_comb[0].split()
        pl2 = player_comb[1].split()
        if len(pl1) > 1:
            global_player_names_unique.append(player_comb[1])
        else:
            global_player_names_unique.append(player_comb[0])
global_player_names_unique = list(set(global_player_names_unique))
print(global_player_names)
print(len(global_player_names_unique))

for player in global_player_names:
    appended = False
    for appended_player in global_player_names_unique:
        if appended_player.lower() in player.lower():
            appended = True
            break
    if not appended:
        global_player_names_unique.append(player)
print(global_player_names_unique)
global_commanders_processed = []
for commander in global_commanders:
    actual_commanders = commander.split('+')
    if len(actual_commanders) > 1:
        global_commanders_processed.append(f'{get_real_commander_name(actual_commanders[0])}+{get_real_commander_name(actual_commanders[1])}')
    else:
        global_commanders_processed.append(get_real_commander_name(actual_commanders[0]))

commanders_counter = Counter(global_commanders_processed)
df = pd.DataFrame.from_dict(commanders_counter, orient='index').reset_index()
df = df.rename(columns={'index': 'commander', 0: 'count'})
print(df)

# print(processed_commanders_df)
ax = sns.catplot(x='count', y='commander', data=df, height=15, aspect=1.5, kind='bar')
plt.savefig('commanders_distr.png')
# bx = sns.countplot(x='commander', data=global_commanders_processed)
# plt.savefig('commanders_distr_countplot.png')
