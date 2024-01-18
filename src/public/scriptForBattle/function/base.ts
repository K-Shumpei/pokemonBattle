

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


// バトル場の特性存在判定
function isExistAbility( ability: string ): Pokemon | false {

  for ( const pokemon of allPokemonInBattlefield() ) {
    if ( pokemon.ability.isName( ability ) ) {
      return pokemon;
    }
  }
  return false;
}

// 片側の場の特性存在判定
 function isExistAbilityOneSide( trainer: boolean , ability: string ): Pokemon | false {

  for ( const pokemon of allPokemonInSide( trainer ) ) {
    if ( pokemon.ability.isName( ability ) ) {
      return pokemon;
    }
  }
  return false;
}

// 技の追加効果によるHP変化
function drainHP( pokemon: Pokemon, target: Pokemon, drain: number ): void {

  let value: number = drain;

  if ( pokemon.item.isName( 'おおきなねっこ' ) ) {
    value = fiveRoundEntry( value * 5324 / 4096 );
  }

  if ( target.ability.isName( 'ヘドロえき' ) ) {
    if ( pokemon.ability.isName( 'マジックガード' ) ) return;

    target.msgDeclareAbility();
    pokemon.status.hp.value.sub( value );
    pokemon.msgLiquidOoze();
  } else {
    if ( pokemon.status.hp.value.isMax() ) return;
    if ( pokemon.stateChange.healBlock.isTrue ) return;

    pokemon.status.hp.value.add( value );
    pokemon.msgDrain( target.getArticle() );
  }
}







// リサイクル
/*
function recycleAvailable( pokemon: Pokemon ): void {

  if ( pokemon.item === null ) return;

  const item = pokemon.item.name;
  pokemon.item.name = null;

  if ( pokemon.stateChange.recycle.isTrue === true ) return;

  pokemon.stateChange.recycle.isTrue = true;
  pokemon.stateChange.recycle.text = String( item );
}
*/




// きのみを食べる
/*
function eatBerry( pokemon: Pokemon, berry: string | null ): void {

  if ( berry === null ) return;

  const ripen: number = ( pokemon.ability.isName( 'じゅくせい' ) )? 2 : 1;

  if ( berry === 'クラボのみ' ) {
    cureAilmentByItem( pokemon, 'PARALYSIS', berry );
  }
  if ( berry === 'カゴのみ' ) {
    cureAilmentByItem( pokemon, 'ASLEEP', berry );
  }
  if ( berry === 'モモンのみ' ) {
    cureAilmentByItem( pokemon, 'POISONED', berry );
  }
  if ( berry === 'チーゴのみ' ) {
    cureAilmentByItem( pokemon, 'BURNED', berry );
  }
  if ( berry === 'ナナシのみ' ) {
    cureAilmentByItem( pokemon, 'FROZEN', berry );
  }
  leppaBerry:
  if ( berry === 'ヒメリのみ' ) {
    // 自分で食べるとき
    if ( pokemon.stateChange.memo.text === 'ヒメリのみ' ) {
      for ( let i = 0; i < 4; i++ ) {
        if ( pokemon.learnedMove[i].remainingPP === 0 ) {
          pokemon.learnedMove[i].curePPByLeppaBerry( pokemon, 10 * ripen );
          break leppaBerry;
        }
      }
    } else {
      for ( let i = 0; i < 4; i++ ) {
        if ( pokemon.learnedMove[i].remainingPP < pokemon.learnedMove[i].powerPoint ) {
          pokemon.learnedMove[i].curePPByLeppaBerry( pokemon, 10 * ripen );
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
*/


// メロメロ
/*
function attractTarget( pokemon: Pokemon, target: Pokemon, type: string ): void {

  if ( pokemon.gender === 'genderless' ) return;
  if ( target.gender === 'genderless' ) return;
  if ( pokemon.gender === target.gender ) return;
  if ( pokemon.isMe === target.isMe ) return;
  if ( target.stateChange.attract.isTrue === true ) return;
  if ( pokemon.ability.isName( 'どんかん' ) ) return;
  if ( isExistAbilityOneSide( target.isMe, 'アロマベール' ) !== false ) return;

  // メロメロ状態にする
  target.stateChange.attract.isTrue = true;
  if ( pokemon.order.battle !== null ) {
    //target.stateChange.attract.target = setTargetInfo( pokemon.isMe, pokemon.order.battle );
  }

  // メッセージ
  // if ( type === 'メロメロ' )
  // if ( type === 'メロメロボディ' ) pokemon.declareAbility();
  // if ( type === 'あかいいと' )
  // if ( type === 'キョダイホーヨー' )

  writeLog( `${getArticle( target )}は メロメロに なった!` );

  if ( target.item.isName( 'あかいいと' ) ) {
    attractTarget( target, pokemon, 'あかいいと' );
  }
}
*/



const formChangeTable = [
  { name: 'ミミッキュ(化けた姿)', next: 'ミミッキュ(ばれた姿)' },
  { name: 'コオリッポ(アイス)', next: 'コオリッポ(ナイス)' },
  { name: 'コオリッポ(ナイス)', next: 'コオリッポ(アイス)' },
  { name: 'ウッウ(鵜呑み)', next: 'ウッウ' },
  { name: 'ウッウ(丸呑み)', next: 'ウッウ' },
  { name: 'メロエッタ(ボイス)', next: 'メロエッタ(ステップ)' },
  { name: 'メロエッタ(ステップ)', next: 'メロエッタ(ボイス)' },
  { name: 'ギルガルド(盾)', next: 'ギルガルド(剣)' },
  { name: 'ギルガルド(剣)', next: 'ギルガルド(盾)' },
  { name: 'モルペコ(満腹)', next: 'モルペコ(空腹)' },
  { name: 'モルペコ(空腹)', next: 'モルペコ(満腹)' },
]
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



// 相手の場の変化
function changeOpponentField( trainer: boolean, state: string, sign: SignType ): void {

  //const opponent: 'me' | 'opp' = getOpponentTrainer( pokemon.isMe );
  const article: string = ( trainer === false )? '相手の ' : '味方の ';
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
  for ( const _pokemon of getParty( pokemon.isMine() ) ) {
    if ( _pokemon.order.hand < hand ) {
      _pokemon.order.hand += 1;
    }
  }
  pokemon.order.hand = 0;

  if ( pokemon.isMine() ) {
    getHTMLInputElement( 'battleMyImage_' + battle ).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pokemon.id + '.png';
  } else {
    getHTMLInputElement( 'battleOpponentImage_' + battle ).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pokemon.id + '.png';
  }

  pokemon.msgToBattleField();
}

// 手持ちに戻る
function toReserve( pokemon: Pokemon ): void {

  pokemon.order.battle = null;

  const hand: number = pokemon.order.hand;
  pokemon.order.hand = fieldStatus.numberOfPokemon;
  for ( const _pokemon of getParty( pokemon.isMine() ) ) {
    if ( _pokemon.order.hand > hand ) {
      _pokemon.order.hand -= 1;
    }
  }

  // ひんし処理
  if ( pokemon.status.hp.value.isZero() ) {
    writeLog( `${getArticle( pokemon )}は たおれた!` );
  }

  naturalCure:
  if ( pokemon.ability.isName( 'しぜんかいふく' ) ) {
    pokemon.statusAilment.getHealth();
  }

  regenerator:
  if ( pokemon.ability.isName( 'さいせいりょく' ) ) {
    const value: number = Math.floor( pokemon.status.hp.av / 3 );
    pokemon.status.hp.value.add( value );
  }


  // 情報のリセット
  // pokemon.ability = pokemon.statusOrg.ability;
  // pokemon.type1 = pokemon.statusOrg.type1;
  // pokemon.type2 = pokemon.statusOrg.type2;
  // pokemon.command = new Command;
  // pokemon.damage = [];
  // pokemon.moveUsed = new AvailableMove;
  pokemon.status.resetRank();
}

// きのみを食べるかどうか
function isEnableEatBerry( pokemon: Pokemon ): boolean {

  const berry = pokemon.item.name;
  const confuse = pokemon.stateChange.confuse.isTrue;
  const hitPoint = pokemon.status.hp.av;
  const remaining = pokemon.status.hp.value.value;
  const gluttony = ( pokemon.ability.isName( 'くいしんぼう' ) )? 2 : 1;

  if ( berry === null ) return false;
  if ( pokemon.item.isName( berry ) === false ) return false;

  if ( berry === 'クラボのみ' && pokemon.statusAilment.isParalysis() ) return true;
  if ( berry === 'カゴのみ' && pokemon.statusAilment.isAsleep() ) return true;
  if ( berry === 'モモンのみ' && pokemon.statusAilment.isPoisoned() ) return true;
  if ( berry === 'チーゴのみ' && pokemon.statusAilment.isBurned() ) return true;
  if ( berry === 'ナナシのみ' && pokemon.statusAilment.isFrozen() ) return true;
  /*
  if ( berry === 'ヒメリのみ' ) {
    for ( const move of pokemon.learnedMove ) {
      if ( move.remainingPP < move.powerPoint ) return true;
    }
  }
  */
  if ( berry === 'オレンのみ' && remaining <= hitPoint / 2 ) return true;
  if ( berry === 'キーのみ' && confuse === true ) return true;
  if ( berry === 'ラムのみ' && !pokemon.statusAilment.isHealth() ) return true;
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






function giveCannotEscape( pokemon: Pokemon, target: Pokemon, move: string ): void {

  if ( move === 'くらいつく' ) {
    target.stateChange.cannotEscape.isTrue = true;
    //target.stateChange.cannotEscape.target.isMe = pokemon.isMe;
    //target.stateChange.cannotEscape.target.party = pokemon.order.party;

    pokemon.stateChange.cannotEscape.isTrue = true;
   // pokemon.stateChange.cannotEscape.target.isMe = target.isMe;
    //pokemon.stateChange.cannotEscape.target.party = target.order.party;

    writeLog( `おたがいの ポケモンは 逃げることが できなくなった!` );
  } else {
    target.stateChange.cannotEscape.isTrue = true;
    //target.stateChange.cannotEscape.target.isMe = pokemon.isMe;
    //target.stateChange.cannotEscape.target.party = pokemon.order.party;

    writeLog( `${getArticle( target )}は もう 逃げられない!` );
  }
}

function isReleasableItem( pokemon: Pokemon, target: Pokemon ): boolean {

  const atkName: string = pokemon.name;
  const defName: string = target.name;
  const item: string | null = target.item.name;

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
  if ( pokemon.ability.isName( 'こだいかっせい' ) || target.ability.isName( 'こだいかっせい' ) ) {
    if ( item === 'ブーストエナジー' ) {
      return false;
    }
  }
  if ( pokemon.ability.isName( 'クォークチャージ' ) || target.ability.isName( 'クォークチャージ' ) ) {
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
    item: string;
    terrain: string;
    parameter: ParameterStringType
  }[] = [
    { item: 'エレキシード', terrain: 'electric', parameter: 'defense' },
    { item: 'グラスシード', terrain: 'grassy', parameter: 'defense' },
    { item: 'サイコシード', terrain: 'psychic', parameter: 'specialDefense' },
    { item: 'ミストシード', terrain: 'ミストフィールド', parameter: 'specialDefense' },
  ]

  for ( const seed of seedTable ) {
    if ( pokemon.item.isName( seed.item ) === false ) continue;
    //if ( fieldStatus.terrain.name !== seed.terrain ) continue;
    if ( getRankVariation( pokemon, seed.parameter, 1 ) === 0 ) continue;

    changeMyRankByItem( pokemon, seed.parameter, 1, seed.item );
    //recycleAvailable( pokemon );
  }
}

function activateRoomService( pokemon: Pokemon ): void {

  if ( pokemon.item.isName( 'ルームサービス' )  ) return;
  if ( fieldStatus.whole.trickRoom.isTrue === false ) return;
  if ( getRankVariation( pokemon, 'speed', -1 ) === 0 ) return;

  changeMyRankByItem( pokemon, 'speed', -1, 'ルームサービス' );
  //recycleAvailable( pokemon );
}

