import requests

def getAbility():
  abilityList = []

  with open("../src/public/master/ability.ts", "w") as o:
    print('const abilityMaster: AbilityData[] = [', file=o)

    # 特性の数は 298
    for i in range(1, 300):
      if i % 10 == 0: print(i)
      url = "https://pokeapi.co/api/v2/ability/" + str(i) + "/"
      r = requests.get(url, timeout=5)

      try:
        r = r.json()
        ability = { 'id': r['id'], 'nameJA': '', 'nameEN': '', 'text': '' }

        for a in r['names']:
          if a['language']['name'] == 'ja': ability['nameJA'] = a['name']
          elif a['language']['name'] == 'en': ability['nameEN'] = a['name']

        for a in r['flavor_text_entries'][::-1]:
          if a['language']['name'] == 'ja':
            ability['text'] = a['flavor_text'].replace('\u3000', ' ').replace('\n', ' ')
            break

        print( ' ', ability, ',', file=o )
        abilityList.append(ability['nameEN'])
      except:
        pass

    print(']', file=o)

  return abilityList

def makeAbilityList( abilityList ):
  abilityList.sort()
  with open("../src/public/nameEN/ability.ts", "w") as o:
    print('type AbilityText = ( typeof abilityTextList )[number];', file=o)
    print('const abilityTextList =', abilityList, 'as const;', file=o)

def main():
  abilityList = getAbility()
  makeAbilityList( abilityList )


if __name__ == '__main__':
    main()
