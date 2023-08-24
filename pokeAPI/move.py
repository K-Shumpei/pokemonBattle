import requests

def getMove():
  moveList = []

  with open("../src/public/master/move.ts", "w") as o:
    print('const moveMaster: MoveData[] = [', file=o)

    # 特性の数は 826
    for i in range(1, 830):
      if i % 10 == 0: print(i)
      url = "https://pokeapi.co/api/v2/move/" + str(i) + "/"
      r = requests.get(url, timeout=5)

      try:
        r = r.json()
        move = {
          'id': r['id'],
          'nameEN': '',
          'nameJA': '',
          'type': r['type']['name'],
          'class': r['damage_class']['name'],
          'target': r['target']['name'],
          'category': r['meta']['category']['name'],
          'power': r['power'],
          'accuracy': r['accuracy'],
          'powerPoint': r['pp'],
          'priority': r['priority'],
          'critical': r['meta']['crit_rate'],
          'drain': r['meta']['drain'],
          'flinch': r['meta']['flinch_chance'],
          'healing': r['meta']['healing'],
          'hits': { 'max': 0, 'min': 0 },
          'turns': { 'max': 0, 'min': 0 },
          'ailment': { 'chance': r['meta']['ailment_chance'], 'name': r['meta']['ailment']['name'] },
          'stat': { 'chance': r['meta']['stat_chance'], 'changes': [] },
          'text': '',
        }

        for a in r['names']:
          if a['language']['name'] == 'ja': move['nameJA'] = a['name']
          if a['language']['name'] == 'en': move['nameEN'] = a['name']

        for a in r['stat_changes']:
          data = { 'stat': a['stat']['name'], 'change': a['change'] }
          move['stat']['changes'].append(data)

        if r['meta']['max_hits'] != None: move['hits']['max'] = r['meta']['max_hits']
        if r['meta']['min_hits'] != None: move['hits']['min'] = r['meta']['min_hits']
        if r['meta']['max_turns'] != None: move['turns']['max'] = r['meta']['max_turns']
        if r['meta']['max_turns'] != None: move['turns']['min'] = r['meta']['min_turns']

        for a in r['flavor_text_entries']:
          if a['language']['name'] == 'ja':
            move['text'] = a['flavor_text'].replace('\u3000', ' ').replace('\n', ' ')
            break

        print( ' ', move, ',', file=o )
        moveList.append(move['nameEN'])

      except:
        pass

    print(']', file=o)

  return moveList

def makeMoveList( moveList ):
  moveList.sort()
  with open("../src/public/nameEN/move.ts", "w") as o:
    print('type MoveText = ( typeof moveTextList )[number];', file=o)
    print('const moveTextList =', moveList, 'as const;', file=o)

def main():
  moveList = getMove()
  makeMoveList( moveList )


if __name__ == '__main__':
    main()
