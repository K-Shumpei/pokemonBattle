import requests
import json

def toCapital(string):
  string = string.split('-')
  string = [ s.title() for s in string ]
  string = ' '.join(string)
  return string


# 技の最終番号
stop = 920

with open("tmpJSON/move.json", "w") as f:
  print("{", file=f)

  for i in range(1, stop):
    if i % 10 == 0: print(i)

    r = ''

    try:
      url = "https://pokeapi.co/api/v2/move/" + str(i) + "/"
      r = requests.get(url, timeout=5)
      r = r.json()

    except:
      continue

    move = {
      'id': r['id'],
      'nameEN': '',
      'nameJA': '',
      'type': '',
      'class': '',
      'target': '',
      'category': '',
      'power': '',
      'accuracy': '',
      'powerPoint': '',
      'priority': '',
      'critical': '',
      'drain': '',
      'flinch': '',
      'healing': '',
      'hits': { 'max': 0, 'min': 0 },
      'turns': { 'max': 0, 'min': 0 },
      'ailment': '',
      'stat': '',
      'text': '',
    }

    try:
      move["type"] = toCapital(r['type']['name'])
    except:
      pass

    try:
      move['class'] = r['damage_class']['name']
    except:
      pass

    try:
      move["target"] = r['target']['name']
    except:
      pass

    try:
      move["category"] = r['meta']['category']['name']
    except:
      pass

    try:
      move["power"] = r['power']
    except:
      pass

    try:
      move["accuracy"] = r['accuracy']
    except:
      pass

    try:
      move["powerPoint"] = r['pp']
    except:
      pass

    try:
      move["priority"] = r['priority']
    except:
      pass

    try:
      move["critical"] = r['meta']['crit_rate']
    except:
      pass

    try:
      move['drain'] = r['meta']['drain']
    except:
      pass

    try:
      move["flinch"] = r['meta']['flinch_chance']
    except:
      pass

    try:
      move["healing"] = r['meta']['healing']
    except:
      pass

    try:
      move["ailment"] = { 'chance': r['meta']['ailment_chance'], 'name': r['meta']['ailment']['name'] }
    except:
      pass

    try:
      move["stat"] = { 'chance': r['meta']['stat_chance'], 'changes': [] }
    except:
      pass


    try:
      for a in r['names']:
        if a['language']['name'] == 'ja': move['nameJA'] = a['name']
        if a['language']['name'] == 'en': move['nameEN'] = toCapital(a['name'])
    except:
      pass

    try:
      for a in r['stat_changes']:
        statname = ''
        if a['stat']['name'] == 'attack': statname = 'atk'
        if a['stat']['name'] == 'defense': statname = 'def'
        if a['stat']['name'] == 'special-attack': statname = 'spA'
        if a['stat']['name'] == 'special-defense': statname = 'spD'
        if a['stat']['name'] == 'speed': statname = 'spe'
        if a['stat']['name'] == 'accuracy': statname = 'acc'
        if a['stat']['name'] == 'evasion': statname = 'eva'
        data = { 'stat':statname, 'change': a['change'] }
        move['stat']['changes'].append(data)
    except:
      pass

    try:
      if r['meta']['max_hits'] != None: move['hits']['max'] = r['meta']['max_hits']
      if r['meta']['min_hits'] != None: move['hits']['min'] = r['meta']['min_hits']
      if r['meta']['max_turns'] != None: move['turns']['max'] = r['meta']['max_turns']
      if r['meta']['max_turns'] != None: move['turns']['min'] = r['meta']['min_turns']
    except:
      pass

    try:
      for a in r['flavor_text_entries']:
        if a['language']['name'] == 'ja':
          move['text'] = a['flavor_text'].replace('\u3000', ' ').replace('\n', ' ')
          break
    except:
      pass

    print('"No' + str(i) + '": ', file=f)
    json.dump(move, f, indent=2, ensure_ascii=False)


    if i != stop-1:
        print(",", file=f)

  print('}', file=f)

