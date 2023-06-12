// 持ち物
function isItem( pokemon: Pokemon, item: string ): boolean {

  if ( pokemon.status.item !== item ) {
    return false;
  }

  return true;
}

// 特性
function isAbility( pokemon: Pokemon, ability: string ): boolean {

  if ( pokemon.status.ability !== ability ) {
    return false;
  }

  return true;
}

// 状態異常
function isStatusAilment( pokemon: Pokemon, statusAilment: string ): boolean {

  if ( pokemon.status.statusAilment.name === statusAilment ) {
    return true;
  }

  if ( statusAilment === 'どく' ) {
    if ( pokemon.status.statusAilment.name === 'もうどく' ) {
      return true;
    }
  }

  return false;
}

// ランク補正
function getValueWithRankCorrection( actualValue: number, rank: number, critical: boolean ): number {

  let thisRank = rank;
  let rankCorr = 1;

  if ( critical === true ) {
    thisRank = Math.max( thisRank, 0 );
  }

  if ( thisRank > 0 ) {
    rankCorr = ( 2 + thisRank ) / 2;
  } else {
    rankCorr = 2 / ( 2 - thisRank );
  }

  return Math.floor( actualValue * rankCorr );
}

// 天気
function isWeather( pokemon: Pokemon, weather: WeatherType ): boolean {

  for ( const pokemon of allPokemonInBattlefield() ) {
    if ( isAbility( pokemon, 'エアロック' ) === true ) {
      return false;
    }
    if ( isAbility( pokemon, 'ノーてんき' ) === true ) {
      return false;
    }
  }

  if ( weather === 'あめ' || weather === 'おおあめ' || weather === 'にほんばれ' || weather === 'おおひでり' ) {
    if ( isItem( pokemon, 'ばんのうがさ' ) === true ) {
      return false;
    }
  }

  if ( fieldStatus.weather.name === weather ) {
    return true;
  }

  if ( weather === 'あめ' ) {
    if ( fieldStatus.weather.name === 'おおあめ' ) {
      return true;
    }
  }

  if ( weather === 'にほんばれ' ) {
    if ( fieldStatus.weather.name === 'おおひでり' ) {
      return true;
    }
  }

  return false;
}


// 接地判定
function isGrounded( pokemon: Pokemon ): boolean {

  return true;
  /*
  // 姿を隠しているポケモンは、地面にいない
  if ( poke.myCondition.myHide ) return false

  // 以下の状態のポケモンは、地面にいる
  if ( poke.myCondition.myIngrain ) return true
  if ( poke.myCondition.mySmack_down ) return true
  if ( fieldStatus.myGravity > 0 ) return true
  if ( poke.myItem == "くろいてっきゅう" && isItem(poke) ) return true

  // 以下の状態のポケモンは、地面にいない
  if ( poke.myType.includes("ひこう") ) return false
  if ( poke.myAbility == "ふゆう" && isAbility(poke) ) return false
  if ( poke.myItem == "ふうせん" && isItem(poke) ) return false
  if ( poke.myCondition.myMagnet_rise > 0 ) return false
  if ( poke.myCondition.myTelekinesis > 0 ) return false

  // それ以外のポケモンは、地面にいる
  return true
  */
}

// ポケモンのタイプ
function getPokemonType( pokemon: Pokemon ): MoveTypeType[] {

  let result: MoveTypeType[] = [];

  if ( pokemon.status.type1 !== null ) {
    result.push( pokemon.status.type1 );
  }
  if ( pokemon.status.type2 !== null ) {
    result.push( pokemon.status.type2 );
  }

  if ( result.length === 0 ) {
    result.push( null );
  }

  return result;
}

// バトル場の特性存在判定
function isExistAbility( ability: string ): boolean {

  for ( const pokemon of allPokemonInBattlefield() ) {
    if ( isAbility( pokemon, ability ) === true ) {
      return true;
    }
  }
  return false;
}

// 片側の場の特性存在判定
 function isExistAbilityOneSide( trainer: 'me' | 'opp' , ability: string ): boolean {

  for ( const pokemon of allPokemonInSide( trainer ) ) {
    if ( isAbility( pokemon, ability ) === true ) {
      return true;
    }
  }
  return false;
 }

// みがわり
function isSubstitute( pokemon: Pokemon, target: Pokemon ): boolean {

  if ( target.stateChange.substitute.isTrue === false ) return false;
  if ( pokemon.moveUsed.name === 'いじげんホール' ) return false;
  if ( pokemon.moveUsed.name === 'いじげんラッシュ' ) return false;
  if ( pokemon.moveUsed.name === 'シャドースチール' ) return false;
  if ( pokemon.moveUsed.category === '変化' ) {
    if ( pokemon.moveUsed.target === '全体の場' ) return false;
    if ( pokemon.moveUsed.target === '相手の場' ) return false;
    if ( pokemon.moveUsed.target === '味方の場' ) return false;
  }
  if ( isSame( pokemon, target ) ) return false;
  if ( isAbility( pokemon, 'すりぬけ' ) === true ) {
    if ( pokemon.moveUsed.name === 'へんしん' || pokemon.moveUsed.name === 'フリーフォール' ) {
      ;
    } else {
      return false;
    }
  }
  if ( soundMoveList.includes( pokemon.moveUsed.name ) === true ) {
    if ( pokemon.moveUsed.name === 'とおぼえ' && isFriend( pokemon, target ) ) {
      ;
    } else {
      return false;
    }
  }

  return true;
}

// 姿を隠す
function isHide( pokemon: Pokemon ): boolean {

  if ( pokemon.stateChange.fly.isTrue === true ) return true;
  if ( pokemon.stateChange.dig.isTrue === true ) return true;
  if ( pokemon.stateChange.dive.isTrue === true ) return true;
  if ( pokemon.stateChange.shadowForce.isTrue === true ) return true;

  return false;
}

// 直接攻撃
function isDirect( pokemon: Pokemon ): boolean {

  if ( pokemon.moveUsed.isDirect === false ) {
    return false;
  }
  if ( isAbility( pokemon, 'えんかく' ) === true ) {
    return false;
  }
  return true;
}

// リサイクル
function recycleAvailable( pokemon: Pokemon ): void {

  if ( pokemon.status.item === null ) return;

  const item = pokemon.status.item;
  pokemon.status.item = null;

  if ( pokemon.stateChange.recycle.isTrue === true ) return;

  pokemon.stateChange.recycle.isTrue = true;
  pokemon.stateChange.recycle.text = item;
}




// きのみを食べる
function eatBerry( pokemon: Pokemon, berry: string ): void {

  const ripen: number = ( isAbility( pokemon, 'じゅくせい' ) )? 2 : 1;

  if ( berry === 'クラボのみ' ) {
    cureAilmentByItem( pokemon, 'まひ', berry );
  }
  if ( berry === 'カゴのみ' ) {
    cureAilmentByItem( pokemon, 'ねむり', berry );
  }
  if ( berry === 'モモンのみ' ) {
    cureAilmentByItem( pokemon, 'どく', berry );
    cureAilmentByItem( pokemon, 'もうどく', berry );
  }
  if ( berry === 'チーゴのみ' ) {
    cureAilmentByItem( pokemon, 'やけど', berry );
  }
  if ( berry === 'ナナシのみ' ) {
    cureAilmentByItem( pokemon, 'こおり', berry );
  }
  if ( berry === 'ヒメリのみ' ) {
    for ( let i = 0; i < 4; i++ ) {
      if ( pokemon.move[i].remainingPP < pokemon.move[i].powerPoint ) {
        pokemon.move[i].curePPByLeppaBerry( pokemon, 10 * ripen );
        break;
      }
    }
  }
  if ( berry === 'オレンのみ' ) {
    changeHPByItem( pokemon, berry );
  }
  if ( berry === 'キーのみ' ) {
    cureConfuseByItem( pokemon, berry);
  }
  if ( berry === 'ラムのみ' ) {
    cureAilmentByItem( pokemon, null, berry );
    cureConfuseByItem( pokemon, berry );
  }
  if ( berry === 'オボンのみ' ) {
    changeHPByItem( pokemon, berry );
  }
  if ( berry === 'フィラのみ' ) {
    changeHPByItem( pokemon, berry );
    giveConfuseByItem( pokemon, berry );
  }
  if ( berry === 'ウイのみ' ) {
    changeHPByItem( pokemon, berry );
    giveConfuseByItem( pokemon, berry );
  }
  if ( berry === 'マゴのみ' ) {
    changeHPByItem( pokemon, berry );
    giveConfuseByItem( pokemon, berry );
  }
  if ( berry === 'バンジのみ' ) {
    changeHPByItem( pokemon, berry );
    giveConfuseByItem( pokemon, berry );
  }
  if ( berry === 'イアのみ' ) {
    changeHPByItem( pokemon, berry );
    giveConfuseByItem( pokemon, berry );
  }
  if ( berry === 'チイラのみ' ) {
    changeMyRankByItem( pokemon, 'attack', 1 * ripen, berry );
  }
  if ( berry === 'リュガのみ' ) {
    changeMyRankByItem( pokemon, 'defense', 1 * ripen, berry );
  }
  if ( berry === 'カムラのみ' ) {
    changeMyRankByItem( pokemon, 'speed', 1 * ripen, berry );
  }
  if ( berry === 'ヤタピのみ' ) {
    changeMyRankByItem( pokemon, 'specialAttack', 1 * ripen, berry );
  }
  if ( berry === 'ズアのみ' ) {
    changeMyRankByItem( pokemon, 'specialDefense', 1 * ripen, berry );
  }
  if ( berry === 'サンのみ' ) {
    if ( pokemon.stateChange.focusEnergy.isTrue === false ) {
      pokemon.stateChange.focusEnergy.isTrue = true;
      writeLog( `${getArticle( pokemon )}は サンのみを 使って 張り切り出した!` );

      // なげつける
      if ( pokemon.stateChange.memo.isTrue === true ) {
        pokemon.stateChange.memo.count += 1;
      }
    }
  }
  if ( berry === 'スターのみ' ) {
    const targetParameter: string[] = [];
    for ( const parameter of Object.keys( pokemon.rank ) ) {
      if ( parameter === 'accuracy' ) continue;
      if ( parameter === 'evasion' ) continue;
      if ( pokemon.rank[parameter] < 6 ) {
        targetParameter.push( parameter );
      }
    }
    if ( targetParameter.length > 0 ) {
      const index: number = Math.floor( getRandom() * targetParameter.length / 100 );
      changeMyRankByItem( pokemon, targetParameter[index], 2 * ripen, berry );
    }
  }
  if ( berry === 'ミクルのみ' ) {
    if ( pokemon.stateChange.micleBerry.isTrue === false ) {
      pokemon.stateChange.micleBerry.isTrue = true;
      writeLog( `${getArticle( pokemon )}は ミクルのみで 次にくりだす 技が 当たりやすくなった!` );

      // なげつける
      if ( pokemon.stateChange.memo.isTrue === true ) {
        pokemon.stateChange.memo.count += 1;
      }
    }
  }
  if ( berry === 'アッキのみ' ) {
    changeMyRankByItem( pokemon, 'defense', 1 * ripen, berry );
  }
  if ( berry === 'タラプのみ' ) {
    changeMyRankByItem( pokemon, 'specialDefense', 1 * ripen, berry );
  }

  // なげつける
  if ( pokemon.stateChange.memo.isTrue === true ) return;

  // 半減きのみ
  for ( const _berry of berryTable ) {
    if ( _berry.name === berry && _berry.half !== null ) {
      pokemon.stateChange.halfBerry.isTrue = true;
      pokemon.stateChange.halfBerry.text = berry;
    }
  }

  if ( berry === 'ナゾのみ' ) {
    changeHPByItem( pokemon, berry );
  }


  recycleAvailable( pokemon );
}
// メロメロ
function attractTarget( pokemon: Pokemon, target: Pokemon, type: string ): void {

  if ( pokemon.status.gender === '-' ) return;
  if ( target.status.gender === '-' ) return;
  if ( pokemon.status.gender === target.status.gender ) return;
  if ( pokemon.trainer === target.trainer ) return;
  if ( target.stateChange.attract.isTrue === true ) return;
  if ( isAbility( target, 'どんかん' ) === true ) return;
  if ( isExistAbilityOneSide( target.trainer, 'アロマベール' ) === true ) return;

  // メロメロ状態にする
  target.stateChange.attract.isTrue = true;
  if ( pokemon.order.battle !== null ) {
    target.stateChange.attract.target = setTargetInfo( pokemon.trainer, pokemon.order.battle );
  }

  // メッセージ
  // if ( type === 'メロメロ' )
  if ( type === 'メロメロボディ' ) pokemon.status.declareAbility();
  // if ( type === 'あかいいと' )
  // if ( type === 'キョダイホーヨー' )

  writeLog( `${getArticle( target )}は メロメロに なった!` );

  if ( isItem( target, 'あかいいと' ) === true ) {
    attractTarget( target, pokemon, 'あかいいと' );
  }
}

// 天気変化
function changeWeather( pokemon: Pokemon, weather: WeatherType ): void {

  if ( isChangableWeather( weather ) === false ) return;

  fieldStatus.weather.reset();
  fieldStatus.weather.name = weather;

  if ( weather === 'おおあめ' ) writeLog( `強い雨が 降り始めた!` );
  if ( weather === 'おおひでり' ) writeLog( `日差しが とても強くなった!` );
  if ( weather === 'らんきりゅう' ) writeLog( `謎の乱気流が ひこうポケモンを 護る!` );

  if ( weather === 'あめ' ) {
    if ( isItem( pokemon, 'しめったいわ' ) === true ) {
      fieldStatus.weather.turn = 8;
      fieldStatus.weather.extend = true;
    } else {
      fieldStatus.weather.turn = 5;
      fieldStatus.weather.extend = false;
    }
    writeLog( `雨が 降り始めた!` );
  }

  if ( weather === 'にほんばれ' ) {
    if ( isItem( pokemon, 'あついいわ' ) === true ) {
      fieldStatus.weather.turn = 8;
      fieldStatus.weather.extend = true;
    } else {
      fieldStatus.weather.turn = 5;
      fieldStatus.weather.extend = false;
    }
    writeLog( `日差しが 強くなった!` );
  }

  if ( weather === 'すなあらし' ) {
    if ( isItem( pokemon, 'さらさらいわ' ) === true ) {
      fieldStatus.weather.turn = 8;
      fieldStatus.weather.extend = true;
    } else {
      fieldStatus.weather.turn = 5;
      fieldStatus.weather.extend = false;
    }
    writeLog( `砂あらしが 吹き始めた!` );
  }

  if ( weather === 'あられ' ) {
    if ( isItem( pokemon, 'つめたいいわ' ) === true ) {
      fieldStatus.weather.turn = 8;
      fieldStatus.weather.extend = true;
    } else {
      fieldStatus.weather.turn = 5;
      fieldStatus.weather.extend = false;
    }
    writeLog( `あられが 降り始めた!` );
  }

  if ( weather === 'ゆき' ) {
    if ( isItem( pokemon, 'つめたいいわ' ) === true ) {
      fieldStatus.weather.turn = 8;
      fieldStatus.weather.extend = true;
    } else {
      fieldStatus.weather.turn = 5;
      fieldStatus.weather.extend = false;
    }
    writeLog( `雪が 降り始めた!` );
  }
}

function isChangableWeather( weather: WeatherType ): boolean {

  if ( fieldStatus.weather.name === weather ) return false;

  if ( fieldStatus.weather.name === 'おおあめ' || fieldStatus.weather.name === 'おおひでり' || fieldStatus.weather.name === 'らんきりゅう' ) {
    if ( weather === 'あめ' ) return false;
    if ( weather === 'にほんばれ' ) return false;
    if ( weather === 'すなあらし' ) return false;
    if ( weather === 'あられ' ) return false;
    if ( weather === 'ゆき' ) return false;
  }

  return true;
}

// フィールド変化
function changeTerrain( pokemon: Pokemon, terrain: TerrainType ): void {

  if ( isChangableTerrain( terrain ) === false ) return;

  fieldStatus.weather.reset();
  fieldStatus.terrain.name = terrain;
  if ( isItem( pokemon, 'グランドコート' ) === true ) {
    fieldStatus.terrain.turn = 8;
    fieldStatus.terrain.extend = true;
  } else {
    fieldStatus.terrain.turn = 5;
    fieldStatus.terrain.extend = false;
  }

  if ( terrain === 'エレキフィールド' ) writeLog( `足元に 電気が かけめぐる!` );
  if ( terrain === 'グラスフィールド' ) writeLog( `足元に 草がおいしげった!` );
  if ( terrain === 'サイコフィールド' ) writeLog( `足元が 不思議な感じに なった!` );
  if ( terrain === 'ミストフィールド' ) writeLog( `足元に 霧が立ち込めた!` );
}

function isChangableTerrain( terrain: TerrainType ): boolean {

  if ( fieldStatus.terrain.name === terrain ) return false;

  return true;
}

// フォルムチェンジ
function formChange( pokemon: Pokemon ): void {

  let nextFrom: string = ''

  if ( pokemon.status.name === 'ウッウ(鵜呑み)' ) nextFrom = 'ウッウ';
  if ( pokemon.status.name === 'ウッウ(丸呑み)' ) nextFrom = 'ウッウ';

  /*
  ポワルン (通常の姿⇔たいようのすがた⇔あまみずのすがた⇔ゆきぐものすがた | てんき)
  チェリム (ネガフォルム⇔ポジフォルム | ひざしがつよい・特性フラワーギフト[1])
  シェイミ (スカイフォルム⇒ランドフォルム | こおり状態)
  ヒヒダルマ (ノーマルモード⇔ダルマモード | 特性ダルマモード)
  メロエッタ (ボイスフォルム⇔ステップフォルム | 技いにしえのうたの成功)
  ゲッコウガ (通常の姿⇒サトシゲッコウガ | 特性きずなへんげ)
  ギルガルド (シールドフォルム⇔ブレードフォルム | 特性バトルスイッチ)
  ジガルデ (10%フォルム/50%フォルム⇒パーフェクトフォルム | 特性スワームチェンジ)[2]
  ヨワシ (たんどくのすがた⇔むれたすがた | 特性ぎょぐん)
  メテノ (コアのすがた⇔りゅうせいのすがた | 特性リミットシールド)
  ミミッキュ (ばけたすがた⇒ばれたすがた | 特性ばけのかわ)
  モルペコ (まんぷくもよう⇔はらぺこもよう | 特性はらぺこスイッチ)
  ウッウ (通常の姿⇔うのみのすがた | 技なみのり・ダイビング)
  コオリッポ (アイスフェイス⇔ナイスフェイス | 特性アイスフェイス)
  イルカマン (ナイーブフォルム⇔マイティフォルム | 特性マイティチェンジ)
  */

  const nextPokemon: PokemonDataType | false = getPokemonDataByName( nextFrom );
  const nature: NatureDataType = getNatureDataByName( pokemon.status.nature );

  if ( nextPokemon === false ) {
    return;
  }

  // 基本ステータスの更新
  pokemon.status.number = nextPokemon.number;
  pokemon.status.name = nextPokemon.name;
  pokemon.status.type1 = nextPokemon.type1;
  pokemon.status.type2 = nextPokemon.type2;
  pokemon.status.ability = nextPokemon.ability1;
  pokemon.status.height = nextPokemon.height;
  pokemon.status.weight = nextPokemon.weight;

  pokemon.statusOrg = pokemon.status

  // 実数値の更新
  for ( const parameter of Object.keys( parameterFive ) ) {
    const nextBaseStatus: ParameterFiveType = getBaseStatusList( nextPokemon )
    const baseStatus: number = pokemon.baseStatus[parameter];
    const individualValue: number = pokemon.individualValue[parameter];
    const effortValue: number = pokemon.effortValue[parameter];

    // 実数値計算
    const step1: number = baseStatus * 2 + individualValue + Math.floor( effortValue / 4 );
    const step2: number = step1 * pokemon.status.level;
    const step3: number = Math.floor( step2 / 100 );

    // 性格補正
    let natureRate: number = 1.0;
    if ( nature.plus === nature.minus ) {
      natureRate = 1.0;
    } else if ( nature.plus === parameter ) {
      natureRate = 1.1;
    } else if ( nature.minus === parameter ) {
      natureRate = 0.9;
    }

    // 種族値・実数値の更新
    pokemon.baseStatus[parameter] = nextBaseStatus[parameter];
    pokemon.actualValue[parameter] = Math.floor( ( step3 + 5 ) * natureRate );
  }
}

// 相手の場の変化
function changeOpponentField( pokemon: Pokemon, field: string ): void {

  const opponent: 'me' | 'opp' = getOpponentTrainer( pokemon.trainer );
  const article: string = ( opponent === 'opp' )? '相手の ' : '味方の ';

  if ( field === 'どくびし' ) {
    if ( fieldStatus.getSide( opponent ).toxicSpikes.count === 2 ) return;

    fieldStatus.getSide( opponent ).toxicSpikes.isTrue = true;
    fieldStatus.getSide( opponent ).toxicSpikes.count += 1;
    writeLog( `${article}足元に どくびしが 散らばった!` );
  }

  if ( field === 'まきびし' ) {
    if ( fieldStatus.getSide( opponent ).spikes.count === 3 ) return;

    fieldStatus.getSide( opponent ).spikes.isTrue = true;
    fieldStatus.getSide( opponent ).spikes.count += 1;
    writeLog( `${article}足元に まきびしが 散らばった!` );
  }

  if ( field === 'ステルスロック' ) {
    if ( fieldStatus.getSide( opponent ).stealthRock.isTrue === true ) return;

    fieldStatus.getSide( opponent ).stealthRock.isTrue = true;
    writeLog( `${article}周りに とがった岩が ただよい始めた!`);
  }

  if ( field === 'ねばねばネット' ) {
    if ( fieldStatus.getSide( opponent ).stickyWeb.isTrue === true ) return;

    fieldStatus.getSide( opponent ).stickyWeb.isTrue = true;
    writeLog( `${article}足元に ねばねばネットが 広がった!` );
  }
}

// じゅうでん
function activateCharge( pokemon: Pokemon, move: string ): void {

  pokemon.stateChange.charge.isTrue = true;
  writeLog( `${getArticle( pokemon )}は ${move}を 受けて 充電した!` );
}
