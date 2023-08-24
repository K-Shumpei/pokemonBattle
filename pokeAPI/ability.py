import requests


# 特性の数は 298
for i in range(1, 300):

    url = "https://pokeapi.co/api/v2/ability/" + str(i) + "/"


    r = requests.get(url, timeout=5)

    try:
        r = r.json()



        ability = {
            'id': 0,
            'nameJA': None,
            'nameEN': None,
            'text': None
        }

        ability['id'] = r['id']


        for a in r['names']:
            if a['language']['name'] == 'ja':
                ability['nameJA'] = a['name']
            elif a['language']['name'] == 'en':
                ability['nameEN'] = a['name']
            else:
                pass


        for a in r['flavor_text_entries'][::-1]:
            if a['language']['name'] == 'ja':
                ability['text'] = a['flavor_text'].replace('\u3000', ' ').replace('\n', ' ')
                break

        print(ability)

    except:
        pass

