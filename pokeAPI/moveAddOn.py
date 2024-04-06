import json

addon = ""
with open('tmpJSON/moveAddOn.json') as f:
  addon = json.load(f)

with open("../src/public/master/moveAddOn.ts", "w") as o:
  print('const', 'moveAddOnMaster:', 'MoveAddOnData[] = [', file=o)

  for key in addon:
    a = addon[key]

    print(
      "  {",
      "id: {},".format(a["id"]),
      "nameEN: '{}',".format(a["nameEN"]),
      "nameJA: '{}',".format(a["nameJA"]),
      "additional: {},".format(str(a["additional"]).lower()),
      "wind: {},".format(str(a["wind"]).lower()),
      "stomp: {},".format(str(a["stomp"]).lower()),
      "reckLess: {},".format(str(a["reckLess"]).lower()),
      "explosion: {},".format(str(a["explosion"]).lower()),
      "changeType: {},".format(str(a["changeType"]).lower()),
      "fixedDamage: {}".format(str(a["fixedDamage"]).lower()),
      "},",
      file=o
    )

  print(']', file=o)
