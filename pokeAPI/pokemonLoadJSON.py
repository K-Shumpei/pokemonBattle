import json

def makePokemonList( pokemonList, value ):
  pokemonList.sort()
  with open("../src/public/nameEN/" + value['file'], "w") as o:
    print('type PokemonText = ( typeof pokemonTextList )[number];', file=o)
    print('const pokemonTextList =', pokemonList, 'as const;', file=o)





pokemon = ""
with open('tmpJSON/pokemon.json') as f:
    pokemon = json.load(f)

exceptP = ""
with open('tmpJSON/except.json') as f:
  exceptP = json.load(f)


pokemonList = []
for key in pokemon:
  pokemonList.append(pokemon[key][0])

for key in exceptP:
  pokemonList.append(exceptP[key][0])


pokemonList = sorted(pokemonList, key=lambda x: x['id'])







pokemonNameList = []

with open("../src/public/master/pokemon.ts", "w") as o:
  print('const', 'pokemonMaster:', 'PokemonData[] = [', file=o)

  for poke in pokemonList:
    if poke["isEvolve"] == "":
      poke["isEvolve"] = "false"

    pokemonNameList.append(poke["nameEN"])

    print(
      "  {",
      "id: {},".format(poke["id"]),
      "order: {},".format(poke["order"]),
      "nameEN: '{}',".format(poke["nameEN"]),
      "nameJA: '{}',".format(poke["nameJA"]),
      "gender: '{}',".format(poke["gender"]),
      "type: {},".format(poke["type"]),
      "ability: {},".format(poke["ability"]),
      "baseStatus: {", "hp: {}, atk: {}, def: {}, spA: {}, spD: {}, spe: {}".format(
        poke["baseStatus"]["hp"],
        poke["baseStatus"]["atk"],
        poke["baseStatus"]["def"],
        poke["baseStatus"]["spA"],
        poke["baseStatus"]["spD"],
        poke["baseStatus"]["spe"]
      ), "},",
      "height: {},".format(poke["height"]),
      "weight: {},".format(poke["weight"]),
      "isEvolve: {},".format(poke["isEvolve"]),
      "text: '{}'".format(poke["text"]),
      "},",
      file=o
    )


  print(']', file=o)


