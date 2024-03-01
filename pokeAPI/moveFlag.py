import pandas as pd
import json

df_flag = pd.read_csv('csv/move_flags.csv', encoding='utf-8')
df_flag_map = pd.read_csv('csv/move_flag_map.csv', encoding='utf-8')

with open("tmpJSON/moveFlag.json", "w") as f:
  print("{", file=f)

  for i in range(1000):
    df = df_flag_map[df_flag_map["move_id"] == i]

    move = {
      'id': i,
      'contact': False,
      'charge': False,
      'recharge': False,
      'protect': False,
      'reflectable': False,
      'snatch': False,
      'mirror': False,
      'punch': False,
      'sound': False,
      'gravity': False,
      'defrost': False,
      'distance': False,
      'heal': False,
      'authentic': False,
      'powder': False,
      'bite': False,
      'pulse': False,
      'ballistics': False,
      'mental': False,
      'non-sky-battle': False,
      'dance': False
    }

    if not df.empty:
      for row in df.itertuples():
        move[df_flag.iat[row.move_flag_id - 1, 1]] = True

    print('"No' + str(i) + '": ', file=f)
    json.dump(move, f, indent=2, ensure_ascii=False)
    print(",", file=f)

  print('}', file=f)
