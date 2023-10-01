// 持ち物
function isItem( pokemon: Pokemon, item: string ): boolean {

  if ( pokemon.item !== item ) {
    return false;
  }

  return true;
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


// 接地判定
function isGrounded( pokemon: Pokemon ): boolean {

  if ( pokemon.stateChange.ingrain.isTrue === true ) return true;
  if ( pokemon.stateChange.smackDown.isTrue === true ) return true;
  if ( fieldStatus.whole.gravity.isTrue === true ) return true;
  if ( isItem( pokemon, 'くろいてっきゅう' ) === true ) return true;

  if ( getPokemonType( pokemon ).includes( 'FLYING' ) ) return false;
  if ( pokemon.ability.isName( 'ふゆう' ) ) return false;
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
function getPokemonType( pokemon: Pokemon ): PokemonType[] {

  let result: PokemonType[] = [];

  if ( pokemon.type1 !== null ) {
    result.push( pokemon.type1 );
  }
  if ( pokemon.type2 !== null ) {
    result.push( pokemon.type2 );
  }

  if ( result.length === 0 ) {
    result.push( null );
  }

  return result;
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
 function isExistAbilityOneSide( trainer: 'me' | 'opp' , ability: string ): Pokemon | false {

  for ( const pokemon of allPokemonInSide( trainer ) ) {
    if ( pokemon.ability.isName( ability ) ) {
      return pokemon;
    }
  }
  return false;
 }

// みがわり
function isSubstitute( pokemon: Pokemon, target: Pokemon ): boolean {

  if ( target.stateChange.substitute.isTrue === false ) return false;
  if ( pokemon.selectedMove.name === 'いじげんホール' ) return false;
  if ( pokemon.selectedMove.name === 'いじげんラッシュ' ) return false;
  if ( pokemon.selectedMove.name === 'シャドースチール' ) return false;
  if ( pokemon.selectedMove.category === '変化' ) {
    if ( pokemon.selectedMove.target === '全体の場' ) return false;
    if ( pokemon.selectedMove.target === '相手の場' ) return false;
    if ( pokemon.selectedMove.target === '味方の場' ) return false;
  }
  if ( isSame( pokemon, target ) ) return false;
  if ( pokemon.ability.isName( 'すりぬけ' ) ) {
    if ( pokemon.selectedMove.name === 'へんしん' || pokemon.selectedMove.name === 'フリーフォール' ) {
      ;
    } else {
      return false;
    }
  }
  if ( soundMoveList.includes( pokemon.selectedMove.name ) === true ) {
    if ( pokemon.selectedMove.name === 'とおぼえ' && isFriend( pokemon, target ) ) {
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

  if ( pokemon.selectedMove.flag.contact === false ) {
    return false;
  }
  if ( pokemon.ability.isName( 'えんかく' ) ) {
    return false;
  }
  return true;
}

// リサイクル
function recycleAvailable( pokemon: Pokemon ): void {

  if ( pokemon.item === null ) return;

  const item = pokemon.item;
  pokemon.item = null;

  if ( pokemon.stateChange.recycle.isTrue === true ) return;

  pokemon.stateChange.recycle.isTrue = true;
  pokemon.stateChange.recycle.text = item;
}




// きのみを食べる
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
// メロメロ
function attractTarget( pokemon: Pokemon, target: Pokemon, type: string ): void {

  if ( pokemon.gender === 'genderless' ) return;
  if ( target.gender === 'genderless' ) return;
  if ( pokemon.gender === target.gender ) return;
  if ( pokemon.trainer === target.trainer ) return;
  if ( target.stateChange.attract.isTrue === true ) return;
  if ( pokemon.ability.isName( 'どんかん' ) ) return;
  if ( isExistAbilityOneSide( target.trainer, 'アロマベール' ) !== false ) return;

  // メロメロ状態にする
  target.stateChange.attract.isTrue = true;
  if ( pokemon.order.battle !== null ) {
    target.stateChange.attract.target = setTargetInfo( pokemon.trainer, pokemon.order.battle );
  }

  // メッセージ
  // if ( type === 'メロメロ' )
  // if ( type === 'メロメロボディ' ) pokemon.declareAbility();
  // if ( type === 'あかいいと' )
  // if ( type === 'キョダイホーヨー' )

  writeLog( `${getArticle( target )}は メロメロに なった!` );

  if ( isItem( target, 'あかいいと' ) === true ) {
    attractTarget( target, pokemon, 'あかいいと' );
  }
}


// フォルムチェンジ
function formChange( pokemon: Pokemon ): void {

  let nextFrom: string = ''

  for ( const form of formChangeTable ) {
    if ( form.name === pokemon.name ) {
      nextFrom = form.next;
    }
  }

  if ( pokemon.name === 'ウッウ' ) {
    if ( pokemon.hitPoint.value.isGreaterThan( 2 ) ) nextFrom = 'ウッウ(鵜呑み)';
    else nextFrom = 'ウッウ(丸呑み)'
  }

  const nextPokemon: PokemonData = getPokemonDataByName( nextFrom );
  const nature: NatureDataType = getNatureDataByName( pokemon.nature );

  // 基本ステータスの更新
  pokemon.id.id = nextPokemon.id;
  pokemon.id.order = nextPokemon.order;
  pokemon.id.index = nextPokemon.index;
  pokemon.name = nextPokemon.nameEN;
  pokemon.type1 = nextPokemon.type[0];
  if ( nextPokemon.type.length === 2 ) pokemon.type2 = nextPokemon.type[1];
  pokemon.ability.name = nextPokemon.ability[0];
  pokemon.height = nextPokemon.height;
  pokemon.weight = nextPokemon.weight;

  // 実数値の更新
  /*
  for ( const parameter of Object.keys( parameterFive ) ) {
    const nextBaseStatus: ParameterSixType = getBaseStatusList( nextPokemon )
    const baseStatus: number = pokemon.baseStatus[parameter];
    const individualValue: number = pokemon.individualValue[parameter];
    const effortValue: number = pokemon.effortValue[parameter];

    // 実数値計算
    const step1: number = baseStatus * 2 + individualValue + Math.floor( effortValue / 4 );
    const step2: number = step1 * pokemon.level;
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
  */


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
    getHTMLInputElement( 'battleMyImage_' + battle ).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pokemon.id.index + '.png';
  } else {
    getHTMLInputElement( 'battleOpponentImage_' + battle ).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pokemon.id.index + '.png';
  }

  writeLog( `${translateENintoJP( pokemon.trainer )}は ${pokemon.name}を くりだした!` );
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
  if ( pokemon.hitPoint.value.isZero() ) {
    writeLog( `${getArticle( pokemon )}は たおれた!` );
  }

  naturalCure:
  if ( pokemon.ability.isName( 'しぜんかいふく' ) ) {
    pokemon.statusAilment.getHealth();
  }

  regenerator:
  if ( pokemon.ability.isName( 'さいせいりょく' ) ) {
    const value: number = Math.floor( pokemon.status.hitPoint.actual / 3 );
    pokemon.hitPoint.value.add( value );
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

  const berry = pokemon.item;
  const confuse = pokemon.stateChange.confuse.isTrue;
  const hitPoint = pokemon.status.hitPoint.actual;
  const remaining = pokemon.hitPoint.value.value;
  const gluttony = ( pokemon.ability.isName( 'くいしんぼう' ) )? 2 : 1;

  if ( berry === null ) return false;
  if ( isItem( pokemon, berry ) === false ) return false;

  if ( berry === 'クラボのみ' && pokemon.statusAilment.isParalysis() ) return true;
  if ( berry === 'カゴのみ' && pokemon.statusAilment.isAsleep() ) return true;
  if ( berry === 'モモンのみ' && pokemon.statusAilment.isPoisoned() ) return true;
  if ( berry === 'チーゴのみ' && pokemon.statusAilment.isBurned() ) return true;
  if ( berry === 'ナナシのみ' && pokemon.statusAilment.isFrozen() ) return true;
  if ( berry === 'ヒメリのみ' ) {
    for ( const move of pokemon.learnedMove ) {
      if ( move.remainingPP < move.powerPoint ) return true;
    }
  }
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


function isValidProbabilityAdditionalEffect( pokemon: Pokemon, moveRate: number ): boolean {

  let rate: number = moveRate;

  if ( pokemon.ability.isName( 'てんのめぐみ' ) ) {
    rate = rate * 2;
  }
  if ( fieldStatus.getSide( pokemon.trainer ).rainbow.isTrue === true ) {
    if ( pokemon.selectedMove.name !== 'ひみつのちから' ) {
      rate = rate * 2;
    }
  }
  for ( const move of additionalEffectFlinch ) {
    if ( move.name === pokemon.selectedMove.name ) {
      rate = Math.min( rate, moveRate * 2 );
    }
  }

  if ( getRandom() >= rate ) return false;

  return true;
}

function isValidToTargetAdditionalEffect( pokemon: Pokemon, target: Pokemon, damage: Damage ): boolean {

  if ( pokemon.stateChange.sheerForce.isTrue === true ) return false;
  if ( target.hitPoint.value.isZero() ) return false;
  if ( damage.substitute === true ) return false ;
  if ( target.ability.isName( 'りんぷん' ) ) return false;
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

  const atkName: string = pokemon.name;
  const defName: string = target.name;
  const item: string | null = target.item;

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
    if ( isItem( pokemon, seed.item ) === false ) continue;
    //if ( fieldStatus.terrain.name !== seed.terrain ) continue;
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
  result = Math.min( result, target.hitPoint.value.value );

  if ( damage.substitute === true ) {
    result = Math.min( result, target.stateChange.substitute.count );
  }

  if ( damage.substitute === false && result === target.hitPoint.value.value ) {
    if ( target.stateChange.endure.isTrue === true ) {
      result -= 1;
      target.stateChange.endureMsg.isTrue === true;
      target.stateChange.endureMsg.text === 'こらえる';
      return result;
    }
    if ( pokemon.selectedMove.name === 'みねうち' || pokemon.selectedMove.name === 'てかげん' ) {
      result -= 1;
      target.stateChange.endureMsg.isTrue === true;
      target.stateChange.endureMsg.text === pokemon.selectedMove.name;
      return result;
    }
    if ( pokemon.ability.isName( 'がんじょう' ) ) {
      if ( target.hitPoint.value.isMax() ) {
        result -= 1;
        target.stateChange.endureMsg.isTrue === true;
        target.stateChange.endureMsg.text === 'がんじょう';
        return result;
      }
    }
    if ( isItem( target, 'きあいのタスキ' ) === true ) {
      if ( target.hitPoint.value.isMax() ) {
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

function isActivateSkinAbikity( pokemon: Pokemon, type: PokemonType ): boolean {

  if ( changeTypeMoveList.includes( pokemon.selectedMove.name ) === true ) return false;
  if ( pokemon.selectedMove.name === 'わるあがき' ) return false;
  if ( pokemon.selectedMove.type === type ) return false;

  return true;
}

function activateSkin( pokemon: Pokemon, type: PokemonType ): void {

  pokemon.selectedMove.type = type;
  pokemon.stateChange.skin.isTrue === true;
  pokemon.stateChange.skin.text = String( pokemon.selectedMove.type );
}

function isWeight( pokemon: Pokemon ): number {

  let weight: number = pokemon.weight;

  // ボディパージ

  if ( pokemon.ability.isName( 'ライトメタル' ) ) {
    weight = weight / 2;
  }
  if ( pokemon.ability.isName( 'ヘヴィメタル' ) ) {
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
