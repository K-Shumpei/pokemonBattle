// 持ち物
function isItem( pokemon: Pokemon, item: ItemNameJA ): boolean {

  if ( pokemon.status.item !== item ) {
    return false;
  }

  return true;
}

// 特性
function isAbility( pokemon: Pokemon, ability: AbilityNameJA ): boolean {

  if ( pokemon.status.remainingHP === 0 ) {
    return false;
  }
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

  if ( pokemon.stateChange.ingrain.isTrue === true ) return true;
  if ( pokemon.stateChange.smackDown.isTrue === true ) return true;
  if ( fieldStatus.whole.gravity.isTrue === true ) return true;
  if ( isItem( pokemon, 'くろいてっきゅう' ) === true ) return true;

  if ( getPokemonType( pokemon ).includes( 'ひこう' ) ) return false;
  if ( isAbility( pokemon, 'ふゆう' ) === true ) return false;
  if ( isItem( pokemon, 'ふうせん' ) === true ) return false;
  if ( pokemon.stateChange.magnetRise.isTrue === true ) return false;
  if ( pokemon.stateChange.telekinesis.isTrue === true ) return false;

  return true;
  /*
  以下のポケモンは地面にいないことになる。

  ひこうタイプのポケモン
  特性がふゆうのポケモン
  ふうせんを持っているポケモン
  でんじふゆう状態・テレキネシス状態のポケモン
  これらに当てはまらない、もしくはこれらをわざや特性で無効化された場合、そのポケモンは地面にいることになる。

  地面にいない状態を打ち消す効果を持つわざやアイテムとして以下のものがある。

  ねをはる状態・うちおとす状態・じゅうりょく状態
  くろいてっきゅう
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
function isExistAbility( ability: AbilityNameJA ): Pokemon | false {

  for ( const pokemon of allPokemonInBattlefield() ) {
    if ( isAbility( pokemon, ability ) === true ) {
      return pokemon;
    }
  }
  return false;
}

// 片側の場の特性存在判定
 function isExistAbilityOneSide( trainer: 'me' | 'opp' , ability: AbilityNameJA ): Pokemon | false {

  for ( const pokemon of allPokemonInSide( trainer ) ) {
    if ( isAbility( pokemon, ability ) === true ) {
      return pokemon;
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
function eatBerry( pokemon: Pokemon, berry: string | null ): void {

  if ( berry === null ) return;

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
  leppaBerry:
  if ( berry === 'ヒメリのみ' ) {
    // 自分で食べるとき
    if ( pokemon.stateChange.memo.text === 'ヒメリのみ' ) {
      for ( let i = 0; i < 4; i++ ) {
        if ( pokemon.move[i].remainingPP === 0 ) {
          pokemon.move[i].curePPByLeppaBerry( pokemon, 10 * ripen );
          break leppaBerry;
        }
      }
    } else {
      for ( let i = 0; i < 4; i++ ) {
        if ( pokemon.move[i].remainingPP < pokemon.move[i].powerPoint ) {
          pokemon.move[i].curePPByLeppaBerry( pokemon, 10 * ripen );
          break leppaBerry;
        }
      }
    }
  }
  if ( berry === 'オレンのみ' ) {
    changeHPByBerry( pokemon, berry );
  }
  if ( berry === 'キーのみ' ) {
    cureConfuseByItem( pokemon, berry);
  }
  if ( berry === 'ラムのみ' ) {
    cureAilmentByItem( pokemon, null, berry );
    cureConfuseByItem( pokemon, berry );
  }
  if ( berry === 'オボンのみ' ) {
    changeHPByBerry( pokemon, berry );
  }
  if ( berry === 'フィラのみ' ) {
    changeHPByBerry( pokemon, berry );
    giveConfuseByItem( pokemon, berry );
  }
  if ( berry === 'ウイのみ' ) {
    changeHPByBerry( pokemon, berry );
    giveConfuseByItem( pokemon, berry );
  }
  if ( berry === 'マゴのみ' ) {
    changeHPByBerry( pokemon, berry );
    giveConfuseByItem( pokemon, berry );
  }
  if ( berry === 'バンジのみ' ) {
    changeHPByBerry( pokemon, berry );
    giveConfuseByItem( pokemon, berry );
  }
  if ( berry === 'イアのみ' ) {
    changeHPByBerry( pokemon, berry );
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

      // なげつける・むしくい・ついばむ
      if ( pokemon.stateChange.memo.isTrue === true ) {
        pokemon.stateChange.memo.count += 1;
      }
    }
  }
  if ( berry === 'スターのみ' ) {
    const targetParameter: string[] = [];
    for ( const parameter of parameterFive ) {
      if ( getRankVariation( pokemon, parameter, 2 ) !== 0 ) {
        targetParameter.push( parameter );
      }
    }
    if ( targetParameter.length === 0 ) return;
    targetParameter.sort( ( a, b ) => 50 - getRandom() );
    changeMyRankByItem( pokemon, targetParameter[0], 2 * ripen, berry );
  }
  if ( berry === 'ミクルのみ' ) {
    if ( pokemon.stateChange.micleBerry.isTrue === false ) {
      pokemon.stateChange.micleBerry.isTrue = true;
      writeLog( `${getArticle( pokemon )}は ミクルのみで 次にくりだす 技が 当たりやすくなった!` );

      // なげつける・むしくい・ついばむ
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
  if ( pokemon.stateChange.memo.text === 'なげつける' ) return;

  if ( berry === 'ナゾのみ' ) {
    changeHPByBerry( pokemon, berry );
  }

  // むしくい・ついばむ
  if ( pokemon.stateChange.memo.text === 'むしくい' ) return;

  // 半減きのみ
  for ( const _berry of berryTable ) {
    if ( _berry.name === berry && _berry.half !== null ) {
      pokemon.stateChange.halfBerry.isTrue = true;
      pokemon.stateChange.halfBerry.text = berry;
    }
  }

  // リサイクル
  recycleAvailable( pokemon );

  for ( const _berry of berryTable ) {
    if ( _berry.name === berry ) {
      // ゲップ
      pokemon.stateChange.belch.isTrue = true;
      // ほおぶくろ
      activateCheekPouch( pokemon );
    }
  }
}
// メロメロ
function attractTarget( pokemon: Pokemon, target: Pokemon, type: string ): void {

  if ( pokemon.status.gender === '-' ) return;
  if ( target.status.gender === '-' ) return;
  if ( pokemon.status.gender === target.status.gender ) return;
  if ( pokemon.trainer === target.trainer ) return;
  if ( target.stateChange.attract.isTrue === true ) return;
  if ( isAbility( target, 'どんかん' ) === true ) return;
  if ( isExistAbilityOneSide( target.trainer, 'アロマベール' ) !== false ) return;

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

  fieldStatus.terrain.reset();
  fieldStatus.terrain.name = terrain;
  if ( isItem( pokemon, 'グランドコート' ) === true ) {
    fieldStatus.terrain.turn = 8;
    fieldStatus.terrain.extend = true;
  } else {
    fieldStatus.terrain.turn = 5;
    fieldStatus.terrain.extend = false;
  }

  if ( terrain === 'エレキフィールド' ) writeLog( `足下に 電気が かけめぐる!` );
  if ( terrain === 'グラスフィールド' ) writeLog( `足下に 草がおいしげった!` );
  if ( terrain === 'サイコフィールド' ) writeLog( `足下が 不思議な感じに なった!` );
  if ( terrain === 'ミストフィールド' ) writeLog( `足下に 霧が立ち込めた!` );

}

function isChangableTerrain( terrain: TerrainType ): boolean {

  if ( fieldStatus.terrain.name === terrain ) return false;

  return true;
}

function vanishTerrian(): void {

  if ( fieldStatus.terrain.name === 'エレキフィールド' ) writeLog( `足下の 電気が 消え去った!` );
  if ( fieldStatus.terrain.name === 'グラスフィールド' ) writeLog( `足下の 電気が 消え去った!` );
  if ( fieldStatus.terrain.name === 'サイコフィールド' ) writeLog( `足下の 電気が 消え去った!` );
  if ( fieldStatus.terrain.name === 'ミストフィールド' ) writeLog( `足下の 電気が 消え去った!` );

  fieldStatus.terrain.reset();
}

// フォルムチェンジ
function formChange( pokemon: Pokemon ): void {

  let nextFrom: string = ''

  for ( const form of formChangeTable ) {
    if ( form.name === pokemon.status.name ) {
      nextFrom = form.next;
    }
  }

  if ( pokemon.status.name === 'ウッウ' ) {
    if ( pokemon.status.remainingHP > pokemon.actualValue.hitPoint / 2 ) nextFrom = 'ウッウ(鵜呑み)';
    else nextFrom = 'ウッウ(丸呑み)'
  }

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
    const nextBaseStatus: ParameterSixType = getBaseStatusList( nextPokemon )
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


  /*
  みずびたし/もりののろいなどにより自身のタイプが変更されている場合、ばけのかわの発動によりゴースト/フェアリータイプに戻る。
  パワーシェア/ガードシェア/パワートリック/スピードスワップにより自身のステータスが変更されている場合、ばけのかわの発動により元のステータスに戻る。
  */
}

// 相手の場の変化
function changeOpponentField( trainer: 'me' | 'opp', state: string, sign: SignType ): void {

  //const opponent: 'me' | 'opp' = getOpponentTrainer( pokemon.trainer );
  const article: string = ( trainer === 'opp' )? '相手の ' : '味方の ';
  const field = fieldStatus.getSide( trainer );

  if ( state === 'どくびし' ) {
    if ( sign === '+' ) {
      if ( field.toxicSpikes.count === 2 ) return;
      field.toxicSpikes.isTrue = true;
      field.toxicSpikes.count += 1;
      writeLog( `${article}足元に どくびしが 散らばった!` );
    } else {
      if ( field.toxicSpikes.isTrue === false ) return;
      field.toxicSpikes.reset();
      writeLog( `${article}足元の どくびしが 消え去った!` );
    }
  }

  if ( state === 'まきびし' ) {
    if ( sign === '+' ) {
      if ( field.spikes.count === 3 ) return;
      field.spikes.isTrue = true;
      field.spikes.count += 1;
      writeLog( `${article}足元に まきびしが 散らばった!` );
    } else {
      if ( field.spikes.isTrue === false ) return;
      field.spikes.reset();
      writeLog( `${article}足元の まきびしが 消え去った!` );
    }
  }

  if ( state === 'ステルスロック' ) {
    if ( sign === '+' ) {
      if ( field.stealthRock.isTrue === true ) return;
      field.stealthRock.isTrue = true;
      writeLog( `${article}周りに とがった岩が ただよい始めた!`);
    } else {
      if ( field.stealthRock.isTrue === false ) return;
      field.stealthRock.reset();
      writeLog( `${article}周りの ステルスロックが 消え去った!` );
    }
  }

  if ( state === 'ねばねばネット' ) {
    if ( sign === '+' ) {
      if ( field.stickyWeb.isTrue === true ) return;
      field.stickyWeb.isTrue = true;
      writeLog( `${article}足元に ねばねばネットが 広がった!` );
    } else {
      if ( field.stickyWeb.isTrue === false ) return;
      field.stickyWeb.reset();
      writeLog( `${article}足元の ねばねばネットが 消え去った!` );
    }
  }
}

// じゅうでん
function activateCharge( pokemon: Pokemon, move: string ): void {

  pokemon.stateChange.charge.isTrue = true;
  writeLog( `${getArticle( pokemon )}は ${move}を 受けて 充電した!` );
}

// バトル場に出す
function toBattleField( pokemon: Pokemon, battle: number ): void {

  pokemon.order.battle = battle;

  const hand: number = pokemon.order.hand;
  for ( const _pokemon of getParty( pokemon.trainer ) ) {
    if ( _pokemon.order.hand < hand ) {
      _pokemon.order.hand += 1;
    }
  }
  pokemon.order.hand = 0;

  if ( pokemon.trainer === 'me' ) {
    getHTMLInputElement( 'battleMyImage_' + battle ).src = './pokemonImage/' + pokemon.status.number + '.png';
  } else {
    getHTMLInputElement( 'battleOpponentImage_' + battle ).src = './pokemonImage/' + pokemon.status.number + '.png';
  }

  writeLog( `${translateENintoJP( pokemon.trainer )}は ${pokemon.status.name}を くりだした!` );
}

// 手持ちに戻る
function toReserve( pokemon: Pokemon ): void {

  pokemon.order.battle = null;

  const hand: number = pokemon.order.hand;
  pokemon.order.hand = fieldStatus.numberOfPokemon;
  for ( const _pokemon of getParty( pokemon.trainer ) ) {
    if ( _pokemon.order.hand > hand ) {
      _pokemon.order.hand -= 1;
    }
  }

  // ひんし処理
  if ( pokemon.status.remainingHP === 0 ) {
    writeLog( `${getArticle( pokemon )}は たおれた!` );
  }

  naturalCure:
  if ( isAbility( pokemon, 'しぜんかいふく' ) === true ) {
    pokemon.status.statusAilment.name = null;
    pokemon.status.statusAilment.turn = 0;
  }

  regenerator:
  if ( isAbility( pokemon, 'さいせいりょく' ) === true ) {
    const value: number = Math.floor( pokemon.actualValue.hitPoint / 3 );
    pokemon.status.remainingHP = Math.min( pokemon.status.remainingHP + value, pokemon.actualValue.hitPoint );
  }


  // 情報のリセット
  pokemon.status.ability = pokemon.statusOrg.ability;
  pokemon.status.type1 = pokemon.statusOrg.type1;
  pokemon.status.type2 = pokemon.statusOrg.type2;
  pokemon.command = new Command;
  // pokemon.damage = [];
  // pokemon.moveUsed = new AvailableMove;
  pokemon.rank = new ParameterRank;
}

// きのみを食べるかどうか
function isEnableEatBerry( pokemon: Pokemon ): boolean {

  const berry = pokemon.status.item;
  const ailment = pokemon.status.statusAilment.name;
  const confuse = pokemon.stateChange.confuse.isTrue;
  const hitPoint = pokemon.actualValue.hitPoint;
  const remaining = pokemon.status.remainingHP;
  const gluttony = ( isAbility( pokemon, 'くいしんぼう' ) === true )? 2 : 1;

  if ( berry === null ) return false;
  if ( isItem( pokemon, berry ) === false ) return false;

  if ( berry === 'クラボのみ' && ailment === 'まひ' ) return true;
  if ( berry === 'カゴのみ' && ailment === 'ねむり' ) return true;
  if ( berry === 'モモンのみ' && ailment === 'どく' ) return true;
  if ( berry === 'モモンのみ' && ailment === 'もうどく' ) return true;
  if ( berry === 'チーゴのみ' && ailment === 'やけど' ) return true;
  if ( berry === 'ナナシのみ' && ailment === 'こおり' ) return true;
  if ( berry === 'ヒメリのみ' ) {
    for ( const move of pokemon.move ) {
      if ( move.remainingPP < move.powerPoint ) return true;
    }
  }
  if ( berry === 'オレンのみ' && remaining <= hitPoint / 2 ) return true;
  if ( berry === 'キーのみ' && confuse === true ) return true;
  if ( berry === 'ラムのみ' && ailment !== null ) return true;
  if ( berry === 'ラムのみ' && confuse === true ) return true;
  if ( berry === 'オボンのみ' && remaining <= hitPoint / 2 ) return true;
  if ( berry === 'フィラのみ' && remaining <= hitPoint * gluttony / 4 ) return true;
  if ( berry === 'ウイのみ' && remaining <= hitPoint * gluttony / 4 ) return true;
  if ( berry === 'マゴのみ' && remaining <= hitPoint * gluttony / 4 ) return true;
  if ( berry === 'バンジのみ' && remaining <= hitPoint * gluttony / 4 ) return true;
  if ( berry === 'イアのみ' && remaining <= hitPoint * gluttony / 4 ) return true;
  if ( berry === 'チイラのみ' && remaining <= hitPoint * gluttony / 4 && getRankVariation( pokemon, 'attack', 1 ) !== 0 ) return true;
  if ( berry === 'リュガのみ' && remaining <= hitPoint * gluttony / 4 && getRankVariation( pokemon, 'defense', 1 ) !== 0 ) return true;
  if ( berry === 'カムラのみ' && remaining <= hitPoint * gluttony / 4 && getRankVariation( pokemon, 'speed', 1 ) !== 0 ) return true;
  if ( berry === 'ヤタピのみ' && remaining <= hitPoint * gluttony / 4 && getRankVariation( pokemon, 'specialAttack', 1 ) !== 0 ) return true;
  if ( berry === 'ズアのみ' && remaining <= hitPoint * gluttony / 4 && getRankVariation( pokemon, 'specialDefnese', 1 ) !== 0 ) return true;
  if ( berry === 'サンのみ' && remaining <= hitPoint * gluttony / 4 ) return true;
  if ( berry === 'スターのみ' && remaining <= hitPoint * gluttony / 4 ) return true;
  if ( berry === 'ミクルのみ' && remaining <= hitPoint * gluttony / 4 ) return true;

  return false;
}


function isValidProbabilityAdditionalEffect( pokemon: Pokemon, moveRate: number ): boolean {

  let rate: number = moveRate;

  if ( isAbility( pokemon, 'てんのめぐみ' ) ) {
    rate = rate * 2;
  }
  if ( fieldStatus.getSide( pokemon.trainer ).rainbow.isTrue === true ) {
    if ( pokemon.moveUsed.name !== 'ひみつのちから' ) {
      rate = rate * 2;
    }
  }
  for ( const move of additionalEffectFlinch ) {
    if ( move.name === pokemon.moveUsed.name ) {
      rate = Math.min( rate, moveRate * 2 );
    }
  }

  if ( getRandom() >= rate ) return false;

  return true;
}

function isValidToTargetAdditionalEffect( pokemon: Pokemon, target: Pokemon, damage: Damage ): boolean {

  if ( pokemon.stateChange.sheerForce.isTrue === true ) return false;
  if ( target.status.remainingHP === 0 ) return false;
  if ( damage.substitute === true ) return false ;
  if ( isAbility( target, 'りんぷん' ) ) return false;
  if ( isItem( target, 'おんみつマント' ) ) return false;

  return true;
}

function giveCannotEscape( pokemon: Pokemon, target: Pokemon, move: string ): void {

  if ( move === 'くらいつく' ) {
    target.stateChange.cannotEscape.isTrue = true;
    target.stateChange.cannotEscape.target.trainer = pokemon.trainer;
    target.stateChange.cannotEscape.target.party = pokemon.order.party;

    pokemon.stateChange.cannotEscape.isTrue = true;
    pokemon.stateChange.cannotEscape.target.trainer = target.trainer;
    pokemon.stateChange.cannotEscape.target.party = target.order.party;

    writeLog( `おたがいの ポケモンは 逃げることが できなくなった!` );
  } else {
    target.stateChange.cannotEscape.isTrue = true;
    target.stateChange.cannotEscape.target.trainer = pokemon.trainer;
    target.stateChange.cannotEscape.target.party = pokemon.order.party;

    writeLog( `${getArticle( target )}は もう 逃げられない!` );
  }
}

function isReleasableItem( pokemon: Pokemon, target: Pokemon ): boolean {

  const atkName: string = pokemon.status.name;
  const defName: string = target.status.name;
  const item: string | null = target.status.item;

  if ( item === null ) return false;

  if ( atkName.includes( 'ギラティナ' ) || defName.includes( 'ギラティナ' ) ) {
    if ( item === 'はっきんだま' ) {
      return false;
    }
  }
  if ( atkName === 'アルセウス' || defName === 'アルセウス' ) {
    for ( const plate of plateTable ) {
      if ( plate.name === item ) {
        return false;
      }
    }
  }
  if ( atkName === 'ゲノセクト' || defName === 'ゲノセクト' ) {
    for ( const drive of driveTable ) {
      if ( drive.name === item ) {
        return false;
      }
    }
  }
  if ( atkName === 'シルヴァディ' || defName === 'シルヴァディ' ) {
    for ( const memory of memoryTable ) {
      if ( memory.name === item ) {
        return false;
      }
    }
  }
  if ( atkName.includes( 'ザシアン' ) || defName.includes( 'ザシアン' ) ) {
    if ( item === 'くちたけん' ) {
      return false;
    }
  }
  if ( atkName.includes( 'ザマゼンタ' ) || defName.includes( 'マゼンタ' ) ) {
    if ( item === 'くちたたて' ) {
      return false;
    }
  }
  for ( const mega of megaStoneTable ) {
    if ( mega.pokemon === atkName || mega.pokemon === defName || mega.mega === atkName || mega.mega === defName ) {
      if ( mega.name === item ) {
        return false;
      }
    }
  }
  if ( atkName.includes( 'カイオーガ' ) || defName.includes( 'カイオーガ' ) ) {
    if ( item === 'あいいろのたま' ) {
      return false;
    }
  }
  if ( atkName.includes( 'グラードン' ) || defName.includes( 'グラードン' ) ) {
    if ( item === 'べにいろのたま' ) {
      return false;
    }
  }
  if ( pokemon.status.ability === 'こだいかっせい' || target.status.ability === 'こだいかっせい' ) {
    if ( item === 'ブーストエナジー' ) {
      return false;
    }
  }
  if ( pokemon.status.ability === 'クォークチャージ' || target.status.ability === 'クォークチャージ' ) {
    if ( item === 'ブーストエナジー' ) {
      return false;
    }
  }
  for ( const zCrystal of zCrystalTable ) {
    if ( zCrystal.name === item ) {
      return false;
    }
  }

  return true;
}

function activateSeed( pokemon: Pokemon ): void {

  const seedTable: {
    item: ItemNameJA;
    terrain: string;
    parameter: ParameterStringType
  }[] = [
    { item: 'エレキシード', terrain: 'エレキフィールド', parameter: 'defense' },
    { item: 'グラスシード', terrain: 'グラスフィールド', parameter: 'defense' },
    { item: 'サイコシード', terrain: 'サイコフィールド', parameter: 'specialDefense' },
    { item: 'ミストシード', terrain: 'ミストフィールド', parameter: 'specialDefense' },
  ]

  for ( const seed of seedTable ) {
    if ( isItem( pokemon, seed.item ) === false ) continue;
    if ( fieldStatus.terrain.name !== seed.terrain ) continue;
    if ( getRankVariation( pokemon, seed.parameter, 1 ) === 0 ) continue;

    changeMyRankByItem( pokemon, seed.parameter, 1, seed.item );
    recycleAvailable( pokemon );
  }
}

function activateRoomService( pokemon: Pokemon ): void {

  if ( isItem( pokemon, 'ルームサービス' ) === false ) return;
  if ( fieldStatus.whole.trickRoom.isTrue === false ) return;
  if ( getRankVariation( pokemon, 'speed', -1 ) === 0 ) return;

  changeMyRankByItem( pokemon, 'speed', -1, 'ルームサービス' );
  recycleAvailable( pokemon );
}

// ダメージ計算後の処理
function processAfterCalculation( pokemon: Pokemon, target: Pokemon, finalDamage: number, damage: Damage ): number {

  let result: number = finalDamage;

  result = Math.max( result, 1 );
  result = result % 65536;
  result = Math.min( result, target.status.remainingHP );

  if ( damage.substitute === true ) {
    result = Math.min( result, target.stateChange.substitute.count );
  }

  if ( damage.substitute === false && result === target.status.remainingHP ) {
    if ( target.stateChange.endure.isTrue === true ) {
      result -= 1;
      target.stateChange.endureMsg.isTrue === true;
      target.stateChange.endureMsg.text === 'こらえる';
      return result;
    }
    if ( pokemon.moveUsed.name === 'みねうち' || pokemon.moveUsed.name === 'てかげん' ) {
      result -= 1;
      target.stateChange.endureMsg.isTrue === true;
      target.stateChange.endureMsg.text === pokemon.moveUsed.name;
      return result;
    }
    if ( isAbility( target, 'がんじょう' ) === true ) {
      if ( target.status.remainingHP === target.actualValue.hitPoint ) {
        result -= 1;
        target.stateChange.endureMsg.isTrue === true;
        target.stateChange.endureMsg.text === 'がんじょう';
        return result;
      }
    }
    if ( isItem( target, 'きあいのタスキ' ) === true ) {
      if ( target.status.remainingHP === target.actualValue.hitPoint ) {
        result -= 1;
        target.stateChange.endureMsg.isTrue === true;
        target.stateChange.endureMsg.text === 'きあいのタスキ';
        return result;
      }
    }
    if ( isItem( target, 'きあいのタスキ' ) === true ) {
      if ( getRandom() < 10 ) {
        result -= 1;
        target.stateChange.endureMsg.isTrue === true;
        target.stateChange.endureMsg.text === 'きあいのハチマキ';
        return result;
      }
    }
  }

  return result;
}

function isActivateSkinAbikity( pokemon: Pokemon, type: MoveTypeType ): boolean {

  if ( changeTypeMoveList.includes( pokemon.moveUsed.name ) === true ) return false;
  if ( pokemon.moveUsed.name === 'わるあがき' ) return false;
  if ( pokemon.moveUsed.type === type ) return false;

  return true;
}

function activateSkin( pokemon: Pokemon, type: MoveTypeType ): void {

  pokemon.moveUsed.type = type;
  pokemon.stateChange.skin.isTrue === true;
  pokemon.stateChange.skin.text = String( pokemon.moveUsed.type );
}

function isWeight( pokemon: Pokemon ): number {

  let weight: number = pokemon.status.weight;

  // ボディパージ

  if ( isAbility( pokemon, 'ライトメタル' ) === true ) {
    weight = weight / 2;
  }
  if ( isAbility( pokemon, 'ヘヴィメタル' ) === true ) {
    weight = weight * 2;
  }
  if ( isItem( pokemon, 'かるいし' ) === true ) {
    weight = weight - 100;
  }

  return Math.max( 0.1, weight );
}


// 技の成功判定
function isMoveFailure( pokemon: Pokemon ): boolean {

  const targetList: TargetDataType[] = getTargetList( pokemon );

  if ( targetList.filter( target => target.damage.success === true ).length === 0 ) {
    return true;
  }

  return false;
}
