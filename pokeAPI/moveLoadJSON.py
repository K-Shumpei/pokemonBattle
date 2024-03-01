import json

move = ""
with open('tmpJSON/move.json') as f:
    move = json.load(f)

flag = ""
with open('tmpJSON/moveFlag.json') as f:
  flag = json.load(f)

moveNameList = []
moveNameJAList = []


with open("../src/public/master/move.ts", "w") as o:
  print('const', 'moveMaster:', 'MoveData[] = [', file=o)

  for key in move:
    m = move[key]
    f = flag[key]

    moveNameList.append(m["nameEN"])
    moveNameJAList.append(m["nameJA"])

    if m["power"] == None: m["power"] = 'null'
    if m["accuracy"] == None: m["accuracy"] = 'null'
    if not m["critical"]: m["critical"] = 0
    if not m["drain"]: m["drain"] = 0
    if not m["flinch"]: m["flinch"] = 0
    if not m["healing"]: m["healing"] = 0
    if not m["ailment"]: m["ailment"] = {"chance": 0, "name": 'null'}
    if not m["stat"]: m["stat"] = {"chance": 0, "changes": '[]'}


    print(
      "  {",
      "id: {},".format(m["id"]),
      "nameEN: '{}',".format(m["nameEN"]),
      "nameJA: '{}',".format(m["nameJA"]),
      "type: '{}',".format(m["type"]),
      "class: '{}',".format(m["class"]),
      "target: '{}',".format(m["target"]),
      "category: '{}',".format(m["category"]),
      "power: {},".format(m["power"]),
      "accuracy: {},".format(m["accuracy"]),
      "powerPoint: {},".format(m["powerPoint"]),
      "priority: {},".format(m["priority"]),
      "critical: {},".format(m["critical"]),
      "drain: {},".format(m["drain"]),
      "flinch: {},".format(m["flinch"]),
      "healing: {},".format(m["healing"]),
      "hits: {", "max: {}, min: {}".format(m["hits"]["max"], m["hits"]["min"]), "},",
      "turns: {", "max: {}, min: {}".format(m["turns"]["max"], m["turns"]["min"]), "},",
      "ailment: {", "chance: {}, name: '{}'".format(m["ailment"]["chance"], m["ailment"]["name"]), "},",
      "stat: {", "chance: {}, changes: {}".format(m["stat"]["chance"], m["stat"]["changes"]), "},",
      "text: '{}'".format(m["text"]), ",",
      "contact: {}".format(str(f["contact"]).lower()), ",",
      "charge: {}".format(str(f["charge"]).lower()), ",",
      "recharge: {}".format(str(f["recharge"]).lower()), ",",
      "protect: {}".format(str(f["protect"]).lower()), ",",
      "reflectable: {}".format(str(f["reflectable"]).lower()), ",",
      "snatch: {}".format(str(f["snatch"]).lower()), ",",
      "mirror: {}".format(str(f["mirror"]).lower()), ",",
      "punch: {}".format(str(f["punch"]).lower()), ",",
      "sound: {}".format(str(f["sound"]).lower()), ",",
      "gravity: {}".format(str(f["gravity"]).lower()), ",",
      "defrost: {}".format(str(f["defrost"]).lower()), ",",
      "distance: {}".format(str(f["distance"]).lower()), ",",
      "heal: {}".format(str(f["heal"]).lower()), ",",
      "authentic: {}".format(str(f["authentic"]).lower()), ",",
      "powder: {}".format(str(f["powder"]).lower()), ",",
      "bite: {}".format(str(f["bite"]).lower()), ",",
      "pulse: {}".format(str(f["pulse"]).lower()), ",",
      "ballistics: {}".format(str(f["ballistics"]).lower()), ",",
      "mental: {}".format(str(f["mental"]).lower()), ",",
      "nonSkyBattle: {}".format(str(f["non-sky-battle"]).lower()), ",",
      "dance: {}".format(str(f["dance"]).lower()),
      "},",
      file=o
    )


  print(']', file=o)


moveNameList.sort()
moveNameJAList.sort()

with open("../src/public/nameEN/move.ts", "w") as o:
  print('type MoveText = ( typeof moveTextList )[number];', file=o)
  print('const', 'moveTextList', '= [', file=o)
  print('  null,', file=o)
  for m in moveNameList:
    print("  '" + m + "',", file=o)
  print('] as const;', file=o)

with open("../src/public/nameJA/move.ts", "w") as o:
  print('type MoveJAText = ( typeof moveJATextList )[number];', file=o)
  print('const', 'moveJATextList', '= [', file=o)
  print('  null,', file=o)
  for m in moveNameJAList:
    print("  '" + m + "',", file=o)
  print('] as const;', file=o)

