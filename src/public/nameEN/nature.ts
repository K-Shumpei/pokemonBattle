type NatureText = ( typeof natureTextList )[number];
const natureTextList = [
  'Adamant',
  'Bashful',
  'Bold',
  'Brave',
  'Calm ',
  'Careful ',
  'Docile',
  'Gentle',
  'Hardy',
  'Hasty',
  'Impish',
  'Jolly',
  'Lax',
  'Lonely',
  'Mild',
  'Modest',
  'Naive',
  'Naughty',
  'Quiet',
  'Quirky',
  'Rash',
  'Relaxed',
  'Sassy',
  'Serious',
  'Timid',
] as const;

/*
'Adamant (+At', -SpA)":"いじっぱり (攻撃+ 特攻-)',
'Bashful":"てれや',
'Bold (+De', -Atk)":"ずぶとい (防御+ 攻撃-)',
'Brave (+At', -Spe)":"ゆうかん (攻撃+ 素早-)',
'Calm (+Sp', -Atk)":"おだやか (特防+ 攻撃-)',
'Careful (+Sp', -SpA)":"しんちょう (特防+ 特攻-)',
'Docile":"すなお',
'Gentle (+Sp', -Def)":"おとなしい (特防+ 防御-)',
'Hardy":"がんばりや',
'Hasty (+Sp', -Def)":"せっかち (素早+ 防御-)',
'Impish (+De', -SpA)":"わんぱく (防御+ 特攻-)',
'Jolly (+Sp', -SpA)":"ようき (素早+ 特攻-)',
'Lax (+De', -SpD)":"のうてんき (防御+ 特防-)',
'Lonely (+At', -Def)":"さみしがり (攻撃+ 防御-)',
'Mild (+Sp', -Def)":"おっとり (特攻+ 防御-)',
'Modest (+Sp', -Atk)":"ひかえめ (特攻+ 攻撃-)',
'Naive (+Sp', -SpD)":"むじゃき (素早+ 特防-)',
'Naughty (+At', -SpD)":"やんちゃ (攻撃+ 特防-)',
'Quiet (+Sp', -Spe)":"れいせい (特攻+ 素早-)',
'Quirky":"きまぐれ',
'Rash (+Sp', -SpD)":"うっかりや (特攻+ 特防-)',
'Relaxed (+De', -Spe)":"のんき (防御+ 素早-)',
'Sassy (+Sp', -Spe)":"なまいき (特防+ 素早-)',
'Serious":"まじめ',
'Timid (+Sp', -Atk)":"おくびょう (素早+ 攻撃-)',
*/