from enum import unique
from operator import itemgetter
from collections import Counter
from itertools import combinations
import requests
import pymongo
import seaborn as sns
from matplotlib import pyplot as plt
import pandas as pd
import numpy as np

TRANSLITERATED_BASE = {'тумна': 'tymna',
                       'трасиос': 'thrasios',
                       'брюс': 'Bruse Tarl, Boorish Herder',
                       'икра': 'Ikra Shidiqi, the Usurper',
                       'наджила': 'Najeela',
                       'бирги': 'Birgi, God of Storytelling',
                       'капитан сисай': 'Captain Sisay',
                       'нив-мизет парун': 'Niv-Mizzet, Parun',
                       'сакашима': 'Sakashima of a thousand faces',
                       'краум': 'Kraum, Ludevic',
                       'кедисс': 'Kediss, Emberclaw Familiar',
                       'малкольм': 'Malcolm, Keen-Eyed Navigator',
                       'корвольд': 'Korvold, Fae-Cursed King',
                       'казур': 'Cazur, Ruthless Stalker',
                       'укимма': 'Ukkima, Stalking Shadow'}

def get_sorted_players(players: list)-> list:
    return sorted(players, key=itemgetter('Hidden_points'), reverse=True)

def get_real_commander_name(commander_name: str) -> str:
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
global_players = []
global_winners_array = []
for event in spellmarket_events:
    players = [player for player in event['Players']]
    global_players.extend(get_sorted_players(players))
    global_commanders.extend([player['Commander'] for player in players if player['Commander']])
    global_player_names.extend([player['Player_name'] for player in players])
    sorted_players = get_sorted_players(event['Players'])
    global_winners_array.append(sorted_players[0])

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

for player in global_player_names:
    appended = False
    for appended_player in global_player_names_unique:
        if appended_player.lower() in player.lower():
            appended = True
            break
    if not appended:
        global_player_names_unique.append(player)

global_commanders_processed = []
for commander in global_commanders:
    actual_commanders = commander.split('+')
    if len(actual_commanders) > 1:
        global_commanders_processed.append(f'{get_real_commander_name(actual_commanders[0])}+{get_real_commander_name(actual_commanders[1])}')
    else:
        if get_real_commander_name(actual_commanders[0]) is None:
            print(actual_commanders[0])
        global_commanders_processed.append(get_real_commander_name(actual_commanders[0]))

#####################################################################################################################################

commanders_counter = Counter(global_commanders_processed)
df = pd.DataFrame.from_dict(commanders_counter, orient='index').reset_index()
df = df.rename(columns={'index': 'commander', 0: 'count'})

# print(df)

ax = sns.catplot(x='count', y='commander', data=df, height=15, aspect=1.5, kind='bar')
plt.savefig('commanders_distr.png')

#####################################################################################################################################

players_with_points = []

for not_unique_player in global_players:
    is_repeated = False
    unique_name = not_unique_player['Player_name']
    for unique_player in global_player_names_unique:
        if unique_player in not_unique_player['Player_name']:
            unique_name = unique_player
    target_player_data = {'name': unique_name, 'points': not_unique_player['Points'],
                          'tiebreaks': not_unique_player['Sub_points'], 'hpoints': not_unique_player['Hidden_points']}
    players_with_points.append(target_player_data)

processed_players_names = [player['name'] for player in players_with_points]
players_count = Counter(processed_players_names)
players_with_points = sorted(players_with_points, key=itemgetter('name'), reverse=True)

unique_player_with_points = {}

for player in players_with_points:
    if not unique_player_with_points.get(player['name']):
        unique_player_with_points[player['name']] = player['points']
    else:
        unique_player_with_points[player['name']] += player['points']

# print(global_winners_array)

df = pd.DataFrame.from_dict(unique_player_with_points, orient='index').reset_index()
df = df.rename(columns={'index': 'player', 0: 'points'})
df = df.sort_values(by='points', ascending=False)

ax = sns.catplot(x='points', y='player', data=df, height=15, aspect=1.5, kind='bar')
plt.savefig('players_points_distr.png')

#######################################################################################################################################

players_count_df = pd.DataFrame.from_dict(players_count, orient='index').reset_index()
players_count_df = players_count_df.rename(columns={'index': 'player', 0: 'tournaments'})

df_merged = pd.merge(df, players_count_df)
df_merged['mid_points_per_tournament'] = df_merged['points'] / df_merged['tournaments']
df_merged = df_merged.sort_values(by='mid_points_per_tournament', ascending=False)
df_merged = df_merged.query('points != 0')

ax = sns.catplot(x='mid_points_per_tournament', y='player', data=df_merged, height=15, aspect=1.5, kind='bar')
plt.savefig('mid_points.png')


#########################################################################################################################################
global_winners_names = [player['Player_name'] for player in global_winners_array]

global_winners_names = [player.split()[0] for player in global_winners_names]
            
#print(global_winners_names)

winners_counter = Counter(global_winners_names)

df = pd.DataFrame.from_dict(winners_counter, orient='index').reset_index()
df = df.rename(columns={'index': 'player', 0: 'winner'})
df = df.sort_values(by='winner', ascending=False)

ax = sns.catplot(x='winner', y='player', data=df, height=15, aspect=1.5, kind='bar')
plt.savefig('winners_distr.png')

#########################################################################################################################################

# print(players_count)
# print(winners_counter)

player_winrate = {}

for player in winners_counter.keys():
    player_winrate[player] = winners_counter[player]/players_count.get(player)

df = pd.DataFrame.from_dict(player_winrate, orient='index').reset_index()
df = df.rename(columns={'index': 'player', 0: 'winrate'})
print(df)

df = df.sort_values(by='winrate', ascending=False)

ax = sns.catplot(x='winrate', y='player', data=df, height=15, aspect=1.5, kind='bar')
plt.savefig('winrate_distr.png')
