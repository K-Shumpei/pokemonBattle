import json

with open('tmpJSON/ability.json') as f:
    ability = json.load(f)

abilityList = []
abilityListJA = []


with open("../src/public/master/ability.ts", "w") as o:
  print('const', 'abilityMaster:', 'AbilityData[] = [', file=o)

  for key in ability:
    a = ability[key]

    abilityList.append(a["nameEN"])
    abilityListJA.append(a["nameJA"])

    print(
      "  {",
      "id: {},".format(a["id"]),
      "nameEN: '{}',".format(a["nameEN"]),
      "nameJA: '{}',".format(a["nameJA"]),
      "text: '{}'".format(a["text"]),
      "},",
      file=o
    )


  print(']', file=o)


abilityList.sort()
abilityListJA.sort()

with open("../src/public/nameEN/ability.ts", "w") as o:
  print('type AbilityText = ( typeof abilityTextList )[number];', file=o)
  print('const', 'abilityTextList', '= [', file=o)
  print('  null,', file=o)
  for a in abilityList:
    print("  '" + a + "',", file=o)
  print('] as const;', file=o)

with open("../src/public/nameJA/ability.ts", "w") as o:
  print('type AbilityJAText = ( typeof abilityJATextList )[number];', file=o)
  print('const', 'abilityJATextList', '= [', file=o)
  print('  null,', file=o)
  for a in abilityListJA:
    print("  '" + a + "',", file=o)
  print('] as const;', file=o)

