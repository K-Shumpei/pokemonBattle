import requests

def toCapital(string):
  string = string.split('-')
  string = [ s.title() for s in string ]
  string = ' '.join(string)
  return string

def getInfo(i):
  url = "https://pokeapi.co/api/v2/pokemon/" + str(i) + "/"
  r = requests.get(url, timeout=5)

  pokemon = {
    'id': 0,
    'order': 0,
    'nameEN': None,
    'move': [],
  }

  try:
    r = r.json()

    pokemon['id'] = r['id']
    pokemon['order'] = r['order']
    pokemon['nameEN'] = toCapital(r['name'])

    for m in r['moves']:
      pokemon['move'].append(toCapital(m['move']['name']))

  except:
    pass

  return pokemon



def main():
  with open("../src/public/master/moveLearned.ts", "w") as o:
    print('const', 'moveLearnedByPokemon', '= [', file=o)

    # ポケモンの数は 1010
    for i in range(1,1010):
      if i % 10 == 0: print(i)

      pokemon = getInfo(i)
      if len(pokemon['move']) == 0:
        continue

      print( ' ', pokemon, ',', file=o )

    # その他のポケモンは　10000~10280
    for i in range(10000,10200):
      if i % 10 == 0: print(i)

      pokemon = getInfo(i)
      if len(pokemon['move']) == 0:
        continue

      print( ' ', pokemon, ',', file=o )


    print(']', file=o)



if __name__ == "__main__":
  main()
