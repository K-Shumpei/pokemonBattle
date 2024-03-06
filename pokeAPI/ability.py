import requests
import json

with open("tmpJSON/ability.json", "w") as f:
  print("{", file=f)

  for i in range(1, 310):
    if i % 10 == 0: print(i)


    try:
      url = "https://pokeapi.co/api/v2/ability/" + str(i) + "/"
      r = requests.get(url, timeout=5)
      r = r.json()

      if i != 0:
        print(",", file=f)
    except:
      continue


    ability = { 'id': r['id'], 'nameJA': '', 'nameEN': '', 'text': '' }

    for a in r['names']:
      if a['language']['name'] == 'ja': ability['nameJA'] = a['name']
      elif a['language']['name'] == 'en': ability['nameEN'] = a['name']

    for a in r['flavor_text_entries'][::-1]:
      if a['language']['name'] == 'ja':
        ability['text'] = a['flavor_text'].replace('\u3000', ' ').replace('\n', ' ')
        break

    print('"No' + str(i) + '": ', file=f)
    json.dump(ability, f, indent=2, ensure_ascii=False)

  print('}', file=f)

