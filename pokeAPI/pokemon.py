import requests

class BaseStatus:
  def __init__(self):
    self._hp = 0
    self._atk = 0
    self._def = 0
    self._spA = 0
    self._spD = 0
    self._spe = 0

  @property
  def hitPoint(self):
    return self._hp

  @property
  def attack(self):
    return self._atk

  @property
  def defense(self):
    return self._def

  @property
  def specialAttack(self):
    return self._spA

  @property
  def specialDefense(self):
    return self._spD

  @property
  def speed(self):
    return self._spe

  @hitPoint.setter
  def hitPoint(self, value):
    self._hp = value

  @attack.setter
  def attack(self, value):
    self._atk = value

  @defense.setter
  def defense(self, value):
    self._def = value

  @specialAttack.setter
  def specialAttack(self, value):
    self._spA = value

  @specialDefense.setter
  def specialDefense(self, value):
    self._spD = value

  @speed.setter
  def speed(self, value):
    self._spe = value

class Pokemon:
  def __init__(self):
    self._id = ''
    self._order = ''
    self._index = 1
    self._nameEN = ''
    self._nameJA = ''
    self._type = []
    self._ability = []
    self._baseStatus = BaseStatus()
    self._height = 0
    self._weight = 0
    self._isEvolve = ''
    self._text = ''

  @property
  def id(self):
    return self._id

  @property
  def order(self):
    return self._order

  @property
  def index(self):
    return self._index

  @property
  def nameEN(self):
    return self._nameEN

  @property
  def nameJA(self):
    return self._nameJA

  @property
  def type(self):
    return self._type

  @property
  def ability(self):
    return self._ability

  @property
  def baseStatus(self):
    return self._baseStatus

  @property
  def height(self):
    return self._height

  @property
  def weight(self):
    return self._weight

  @property
  def isEvolve(self):
    return self._isEvolve

  @property
  def text(self):
    return self._text

  @id.setter
  def id(self, value):
    self._id = value

  @order.setter
  def order(self, value):
    self._order = value

  @index.setter
  def index(self, value):
    self._index = value

  @nameEN.setter
  def nameEN(self, value):
    self._nameEN = value

  @nameJA.setter
  def nameJA(self, value):
    self._nameJA = value

  @type.setter
  def type(self, value):
    self._type = value

  @ability.setter
  def ability(self, value):
    self._ability = value

  @baseStatus.setter
  def baseStatus(self, value):
    self._baseStatus = value

  @height.setter
  def height(self, value):
    self._height = value

  @weight.setter
  def weight(self, value):
    self._weight = value

  @isEvolve.setter
  def isEvolve(self, value):
    self._isEvolve = value

  @text.setter
  def text(self, value):
    self._text = value

  def setAbility(self,ability):
    for a in ability:
      a = toCapital(a['ability']['name'])
      if not a in self._ability:
        self._ability.append(a)

  def setType(self, type):
    for t in type:
      self._type.append(toCapital(t['type']['name']))

  def setGender(self, less, male, female):
    for ll in less["pokemon_species_details"]:
      if ll["pokemon_species"]["name"] == self._nameEN:
        self._gender = 'genderless'
        print(self._gender)
        return

    for mm in male["pokemon_species_details"]:
      if mm["pokemon_species"]["name"] == self._nameEN and mm["rate"] == 0:
        self._gender = 'male'
        return

    for ff in female["pokemon_species_details"]:
      if ff["pokemon_species"]["name"] == self._nameEN and ff['rate'] == 8:
        self._gender = 'female'
        return

    self._gender = 'both'


  def setBaseStatus(self, stats):
    for s in stats:
      if s['stat']['name'] == 'hp':
        self._baseStatus.hitPoint = s['base_stat']
      if s['stat']['name'] == 'attack':
        self._baseStatus.attack = s['base_stat']
      if s['stat']['name'] == 'defense':
        self._baseStatus.defense = s['base_stat']
      if s['stat']['name'] == 'special-attack':
        self._baseStatus.specialAttack = s['base_stat']
      if s['stat']['name'] == 'special-defense':
        self._baseStatus.specialDefense = s['base_stat']
      if s['stat']['name'] == 'speed':
        self._baseStatus.speed = s['base_stat']

    print(self._baseStatus.hitPoint)

  def setNameJA(self, name):
    for a in name:
      if a['language']['name'] == 'ja':
        self._nameJA = a['name']

  def setText(self, text):
    for a in text[::-1]:
      if a['language']['name'] == 'ja':
        self._text = a['flavor_text'].replace('\u3000', ' ').replace('\n', ' ')
        break

  def setIsEvolve(self, chain):
    if chain['species']['name'] == self._nameEN:
      if chain['evolves_to'] != []:
        self._isEvolve = True
      else:
        self._isEvolve = False

    else:
      for data in chain['evolves_to']:
        if data['species']['name'] == self._nameEN:
          if data['evolves_to'] != []:
            self._isEvolve = True
          else:
            self._isEvolve = False

      if self._isEvolve == '':
        for d in chain['evolves_to']:
          for data in d['evolves_to']:
            if data['species']['name'] == self._nameEN:
              if data['evolves_to'] != []:
                self._isEvolve = True
              else:
                self._isEvolve = False


# ここまでクラス定義

def toCapital(string):
  string = string.split('-')
  string = [ s.title() for s in string ]
  string = ' '.join(string)
  return string

def getPokemonData( i, pokemon: Pokemon ):
  url = "https://pokeapi.co/api/v2/pokemon/" + str(i) + "/"
  r = requests.get(url, timeout=5)
  print(i)

  url2 = ''
  try:
    r = r.json()

    pokemon.id = r['id']
    pokemon.order = r['order']
    pokemon.nameEN = r['name']
    pokemon.height = r['height']
    pokemon.weight = r['weight']
    pokemon.setAbility(r['abilities'])
    pokemon.setType(r['types'])
    pokemon.setBaseStatus(r['stats'])

    url2 = r['species']['url']

  except:
      pass

  return pokemon, url2

def getPokemonName( i, pokemon: Pokemon, url2, less, male, female ):

  url3 = ''

  if i < 10000:
    url2 = "https://pokeapi.co/api/v2/pokemon-species/" + str(i) + "/"

  r2 = requests.get(url2, timeout=5)

  try:
    r2 = r2.json()
    pokemon.id = r2['id']
    pokemon.setNameJA(r2['names'])
    pokemon.setText(r2['flavor_text_entries'])
    pokemon.setGender(less, male, female)
    url3 = r2['evolution_chain']['url']

  except:
      pass

  return pokemon, url3

def getPokemonEvolve( pokemon:Pokemon, url3 ):
  try:
    r3 = requests.get(url3, timeout=5)
    r3 = r3.json()
    pokemon.setIsEvolve(r3['chain'])

  except:
    pass

  return pokemon

def getPokemon(value):
  url_female = "https://pokeapi.co/api/v2/gender/1/"
  female = requests.get(url_female, timeout=5)
  female = female.json()

  url_male = "https://pokeapi.co/api/v2/gender/2/"
  male = requests.get(url_male, timeout=5)
  male = male.json()

  url_less = "https://pokeapi.co/api/v2/gender/3/"
  less = requests.get(url_less, timeout=5)
  less = less.json()

  pokemonList = []

  with open("../src/public/master/" + value['file'], "w") as o:
    print('const', value['name'], 'PokemonData[] = [', file=o)

    for i in range(value['start'], value['stop']):
      if i % 10 == 0: print(i)

      pokemon = Pokemon()
      pokemon, url2 = getPokemonData( i, pokemon )
      pokemon, url3 = getPokemonName( i, pokemon, url2, less, male, female )
      pokemon = getPokemonEvolve( pokemon, url3 )

      pokemon.nameEN = toCapital(pokemon.nameEN)
      print( ' ', pokemon, ',', file=o )
      pokemonList.append(pokemon.nameEN)
      if i % 10 == 0: break

    print(']', file=o)

  return pokemonList

def makePokemonList( pokemonList, value ):
  pokemonList.sort()
  with open("../src/public/nameEN/" + value['file'], "w") as o:
    print('type PokemonText = ( typeof pokemonTextList )[number];', file=o)
    print('const pokemonTextList =', pokemonList, 'as const;', file=o)

def main( value ):
  pokemonList = getPokemon( value )
  makePokemonList( pokemonList, value )


if __name__ == '__main__':

  # ポケモンの数は 1010
  # その他のポケモンは　10000~10280
  value = {
    'normal': {
      'start': 1,
      'stop': 1011,
      'file': 'pokemon.ts',
      'name': 'pokemonMaster:'
    },
    'except': {
      'start': 10001,
      'stop': 10280,
      'file': 'pokemonExcept.ts',
      'name': 'pokemonExceptMaster:'
    }
  }


  main(value['except'])

"""
{
  "baby_trigger_item":null,
  "chain":{
    "evolution_details":[],
    "evolves_to":[
      {
        "evolution_details":[
          {
            "gender":null,
            "held_item":null,
            "item":null,
            "known_move":null,
            "known_move_type":null,
            "location":null,
            "min_affection":null,
            "min_beauty":null,
            "min_happiness":null,
            "min_level":16,
            "needs_overworld_rain":false,
            "party_species":null,
            "party_type":null,
            "relative_physical_stats":null,
            "time_of_day":"",
            "trade_species":null,
            "trigger":{
              "name":"level-up",
              "url":"https://pokeapi.co/api/v2/evolution-trigger/1/"
            },
            "turn_upside_down":false
          }
        ],
        "evolves_to":[
          {
            "evolution_details":[
              {
                "gender":null,
                "held_item":null,
                "item":null,
                "known_move":null,
                "known_move_type":null,
                "location":null,
                "min_affection":null,
                "min_beauty":null,
                "min_happiness":null,
                "min_level":32,
                "needs_overworld_rain":false,
                "party_species":null,
                "party_type":null,
                "relative_physical_stats":null,
                "time_of_day":"",
                "trade_species":null,
                "trigger":{
                  "name":"level-up",
                  "url":"https://pokeapi.co/api/v2/evolution-trigger/1/"
                },
                "turn_upside_down":false
              }
            ],
            "evolves_to":[],
            "is_baby":false,
            "species":{
              "name":"venusaur",
              "url":"https://pokeapi.co/api/v2/pokemon-species/3/"
            }
          }
        ],
        "is_baby":false,
        "species":{
          "name":"ivysaur",
          "url":"https://pokeapi.co/api/v2/pokemon-species/2/"
        }
      }
    ],
    "is_baby":false,
    "species":{
      "name":"bulbasaur",
      "url":"https://pokeapi.co/api/v2/pokemon-species/1/"
    }
  },
  "id":1
}
"""
