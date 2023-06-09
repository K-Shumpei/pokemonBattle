function calculateDamage( pokemon: Pokemon, target: Pokemon, damage: Damage ): void {

  /*
  // ダメージ固定技の時
    if ( fixedDamage.includes(poke.myMove.name) ) {
      tgt.damage    = isDamageByFixedDamageMove(poke, tgt)
      tgt.effective = 1     // タイプ相性
      tgt.critical  = false // 急所
      return
  }
  */

  // 最終威力
  const power = getPower( pokemon, target );
  // 攻撃と防御の実数値取得　A/D
  const status = getStatus( pokemon, target, damage );
  // 最終ダメージ
  getDamage( pokemon, target, power, status, damage )
}

// 威力計算
function getPower( pokemon: Pokemon, target: Pokemon ): number {

  const move: AvailableMove = pokemon.moveUsed;

  // 基礎威力
  let basicPower: number = move.power;

  if ( move.name === 'きしかいせい' || move.name === 'じたばた' ) {
    const parameter: number = pokemon.status.remainingHP / pokemon.actualValue.hitPoint;
    if ( parameter >= 0 )     basicPower = 200;
    if ( parameter >= 2/48 )  basicPower = 150;
    if ( parameter >= 5/48 )  basicPower = 100;
    if ( parameter >= 10/48 ) basicPower = 80;
    if ( parameter >= 17/48 ) basicPower = 40;
    if ( parameter >= 33/48 ) basicPower = 20;
  }

  if ( move.name === 'しおふき' || move.name === 'ふんか' || move.name === 'ドラゴンエナジー' ) {
    const base: number = Math.floor( 150 * pokemon.status.remainingHP / pokemon.actualValue.hitPoint );
    basicPower = Math.max( base, 1 );
  }

  if ( move.name === 'しぼりとる' || move.name === 'にぎりつぶす' ) {
    const base: number = Math.floor( 150 * target.status.remainingHP / target.actualValue.hitPoint );
    basicPower = Math.max( base, 1 );
  }

  if ( move.name === 'アシストパワー' || move.name === 'つけあがる' ) {
    let count: number = 0;
    for ( const parameter of Object.keys( pokemon.rank ) ) {
      count += Math.max( pokemon.rank[parameter], 0 );
    }
    basicPower = 20 * ( count + 1 );
  }

  if ( move.name === 'おしおき' ) {
    let count: number = 0;
    for ( const parameter of Object.keys( target.rank ) ) {
      count += Math.max( target.rank[parameter], 0 );
    }
    const base: number = 20 * ( count + 3 );
    basicPower = Math.min( base, 200 );
  }

  if ( move.name === 'エレキボール' ) {
    const mySpeed: number = getSpeedValue( pokemon, 'c' );
    const opponentSpeed: number = getSpeedValue( target, 'c' );
    if ( opponentSpeed === 0 ) {
      basicPower = 40;
    }
    const parameter: number = mySpeed / opponentSpeed;
    if ( parameter >= 0 ) basicPower = 40;
    if ( parameter >= 1 ) basicPower = 60;
    if ( parameter >= 2 ) basicPower = 80;
    if ( parameter >= 3 ) basicPower = 120;
    if ( parameter >= 4 ) basicPower = 150;
  }

  if ( move.name === 'ジャイロボール' ) {
    const mySpeed: number = getSpeedValue( pokemon, 'c' );
    const opponentSpeed: number = getSpeedValue( target, 'c' );
    if ( mySpeed === 0 ) {
      basicPower = 1;
    }
    basicPower = Math.floor( 25 * opponentSpeed / mySpeed ) + 1;
  }

  if ( move.name === 'おんがえし' ) {
    const base: number = Math.floor( pokemon.status.happiness * 10 / 25 );
    basicPower = Math.max( base, 1 );
  }

  if ( move.name === 'やつあたり' ) {
    const base: number = Math.floor( ( 255 - pokemon.status.happiness ) * 10 / 25 );
    basicPower = Math.max( base, 1 );
  }

  if ( move.name === 'きりふだ' ) {
    const parameter: number = pokemon.moveUsed.remainingPP;
    if ( parameter === 0 ) basicPower = 200;
    if ( parameter === 1 ) basicPower = 80;
    if ( parameter === 2 ) basicPower = 60;
    if ( parameter === 3 ) basicPower = 50;
    if ( parameter >= 4 )  basicPower = 40;
  }

  if ( move.name === 'くさむすび' || move.name === 'けたぐり' ) {
    const parameter: number = target.status.weight;
    if ( parameter >= 0 )   basicPower = 20;
    if ( parameter >= 10 )  basicPower = 40;
    if ( parameter >= 25 )  basicPower = 60;
    if ( parameter >= 50 )  basicPower = 80;
    if ( parameter >= 100 ) basicPower = 100;
    if ( parameter >= 120 ) basicPower = 120;
  }

  if ( move.name === 'ヒートスタンプ' || move.name === 'ヘビーボンバー' ) {
    const parameter: number = target.status.weight / pokemon.status.weight;
    basicPower = 40;
    if ( parameter <= 1/2 ) basicPower = 60;
    if ( parameter <= 1/3 ) basicPower = 80;
    if ( parameter <= 1/4 ) basicPower = 100;
    if ( parameter <= 1/5 ) basicPower = 120;
  }

  if ( move.name === 'きつけ' ) {
    if ( target.status.statusAilment.name === 'まひ' ) {
      basicPower = 140;
    }
  }

  if ( move.name === 'めざましビンタ' ) {
    if ( target.status.statusAilment.name === 'ねむり' ) {
      basicPower = 140;
    }
  }

  if ( move.name === 'たたりめ' ) {
    if ( target.status.statusAilment.name !== null ) {
      basicPower = 130;
    }
  }

  if ( move.name === 'ウェザーボール' ) {
    if ( isWeather( pokemon, 'にほんばれ' ) ) basicPower = 100;
    if ( isWeather( pokemon, 'あめ' ) ) basicPower = 100;
    if ( isWeather( pokemon, 'すなあらし' ) ) basicPower = 100;
    if ( isWeather( pokemon, 'あられ' ) ) basicPower = 100;
  }

  if ( move.name === 'だいちのはどう' ) {
    if ( isGrounded( pokemon ) === true ) {
      if ( fieldStatus.terrain.name === 'エレキフィールド' ) basicPower = 100;
      if ( fieldStatus.terrain.name === 'グラスフィールド' ) basicPower = 100;
      if ( fieldStatus.terrain.name === 'サイコフィールド' ) basicPower = 100;
      if ( fieldStatus.terrain.name === 'ミストフィールド' ) basicPower = 100;
    }
  }

  if ( move.name === 'ライジングボルト' ) {
    if ( isGrounded( target ) === true && fieldStatus.terrain.name === 'エレキフィールド' ) {
      basicPower = 140;
    }
  }

  if ( move.name === 'かぜおこし' || move.name === 'たつまき' ) {
    ;
  }

  if ( move.name === 'アクロバット' ) {
    if ( pokemon.status.item === '' ) {
      basicPower = 110;
    }
  }

  if ( move.name === 'しぜんのめぐみ' ) {
    ;
  }

  if ( move.name === 'なげつける' ) {
    ;
  }

  if ( move.name === 'アイスボール' || move.name === 'ころがる' ) {
    ;
  }

  if ( move.name === 'エコーボイス' ) {
    ;
  }

  if ( move.name === 'じだんだ' ) {
    ;
  }

  if ( move.name === 'トリプルキック' ) {
    ;
  }

  if ( move.name === 'トリプルアクセル' ) {
    ;
  }

  if ( move.name === 'はきだす' ) {
    ;
  }

  if ( move.name === 'りんしょう' ) {

  }

  if ( move.name === 'れんぞくぎり' ) {
    ;
  }

  if ( move.name === 'くさのちかい' || move.name === 'ほのおのちかい' || move.name === 'みずのちかい' ) {
    ;
  }

  if ( move.name === 'エラがみ' || move.name === 'でんげきくちばし' ) {
    ;
  }

  if ( move.name === 'おいうち' ) {
    ;
  }

  if ( move.name === 'しっぺがえし' ) {
    ;
  }

  if ( move.name === 'ダメおし' ) {
    ;
  }

  if ( move.name === 'ゆきなだれ' || move.name === 'リベンジ' ) {
    ;
  }

  if ( move.name === 'プレゼント' ) {
    const random: number = getRandom();
    if ( random >= 0  ) basicPower = 40;
    if ( random >= 40 ) basicPower = 80;
    if ( random >= 70 ) basicPower = 120;
    if ( random >= 88 ) basicPower = 0;
  }

  if ( move.name === 'マグニチュード' ) {
    ;
  }

  if ( move.name === 'みずしゅりけん' ) {
    ;
  }


  // 威力補正
  let correction: number = 4096;

  if ( isExistAbility( 'オーラブレイク' ) ) {
    if ( isExistAbility( 'フェアリーオーラ' ) === true && move.type === 'フェアリー' ) {
      correction = Math.round( correction * 3072 / 4096 );
    }
    if ( isExistAbility( 'ダークオーラ' ) === true && move.type === 'あく' ) {
      correction = Math.round( correction * 3072 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'とうそうしん' ) ) {
    if ( pokemon.status.gender !== target.status.gender && pokemon.status.gender !== '-' && target.status.gender !== '-' ) {
        correction = Math.round( correction * 3072 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'エレキスキン' ) || isAbility( pokemon, 'スカイスキン' ) || isAbility( pokemon, 'ノーマルスキン' ) || isAbility( pokemon, 'フェアリースキン' ) || isAbility( pokemon, 'アイススキン' ) ) {
    if ( pokemon.stateChange.skin.text === move.type ) {
      correction = Math.round( correction * 4915 / 4096 );
      pokemon.stateChange.skin.reset();
    }
  }

  if ( isAbility( pokemon, 'すてみ' ) ) {
    if ( recklessMoveList.includes( move.name ) ) {
      correction = Math.round( correction * 4915 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'てつのこぶし' ) ) {
    if ( ironFistMoveList.includes( move.name ) ) {
      correction = Math.round( correction * 4915 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'とうそうしん' ) ) {
    if ( pokemon.status.gender === target.status.gender && pokemon.status.gender !== '-' && target.status.gender !== '-' ) {
        correction = Math.round( correction * 5120 / 4096 );
    }
  }

  for ( const poke of allPokemonInBattlefield() ) {
    if ( move.category !== '特殊' ) continue;
    if ( poke.trainer !== pokemon.trainer ) continue;
    if ( poke.order.battle === pokemon.order.battle ) continue;
    if ( isAbility( poke, 'バッテリー' ) ) {
      correction = Math.round( correction * 5325 / 4096 );
    }
  }

  for ( const poke of allPokemonInBattlefield() ) {
    if ( poke.trainer !== pokemon.trainer ) continue;
    if ( poke.order.battle === pokemon.order.battle ) continue;
    if ( isAbility( poke, 'パワースポット' ) ) {
      correction = Math.round( correction * 5325 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'かたいツメ' ) ) {
    if ( isDirect( pokemon ) === true ) {
      correction = Math.round( correction * 5325 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'すなのちから' ) ) {
    if ( isWeather( pokemon, 'すなあらし' ) === true && ( move.type === 'いわ' || move.type === 'じめん' || move.type === 'はがね' ) ) {
      correction = Math.round( correction * 5325 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'ちからずく' ) ) {
    let isTrue = false;
    for ( const move of additionalEffectTargetRank ) {
      if ( move.name === pokemon.moveUsed.name ) {
        isTrue = true;
      }
    }
    for ( const move of additionalEffectMyRank ) {
      if ( move.name === pokemon.moveUsed.name ) {
        isTrue = true;
      }
    }
    for ( const move of additionalEffectAilment ) {
      if ( move.name === pokemon.moveUsed.name ) {
        isTrue = true;
      }
    }
    for ( const move of additionalEffectConfuse ) {
      if ( move.name === pokemon.moveUsed.name ) {
        isTrue = true;
      }
    }
    for ( const move of additionalEffectFlinch ) {
      if ( move.name === pokemon.moveUsed.name ) {
        isTrue = true;
      }
    }
    if ( additionalEffectOthers.includes( pokemon.moveUsed.name ) ) {
      isTrue = true;
    }

    if ( isTrue === true ) {
      pokemon.stateChange.sheerForce.isTrue = true;
      correction = Math.round( correction * 5325 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'パンクロック' ) ) {
    if ( soundMoveList.includes( move.name ) ) {
      correction = Math.round( correction * 5325 / 4096 );
    }
  }

  if ( isExistAbility( 'ダークオーラ' ) ) {
    if ( move.type === 'あく' && isExistAbility( 'オーラブレイク' ) === false ) {
      correction = Math.round( correction * 5448 / 4096 );
    }
  }

  if ( isExistAbility( 'フェアリーオーラ' ) ) {
    if ( move.type === 'フェアリー' && isExistAbility( 'オーラブレイク' ) === false ) {
      correction = Math.round( correction * 5448 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'がんじょうあご' ) ) {
    if ( biteMoveList.includes( move.name ) ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'テクニシャン' ) ) {
    if ( basicPower <= 60 ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'どくぼうそう' ) ) {
    if ( isStatusAilment( pokemon, 'どく' ) === true && move.category === '物理' ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'ねつぼうそう' ) ) {
    if ( isStatusAilment( pokemon, 'やけど' ) === true && move.category === '特殊' ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  for ( const poke of allPokemonInBattlefield() ) {
    if ( poke.trainer !== pokemon.trainer ) continue;
    if ( isAbility( poke, 'はがねのせいしん' ) ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'メガランチャー' ) ) {
    if ( waveMoveList.includes( move.name ) ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  if ( isAbility( target, 'たいねつ' ) ) {
    if ( move.type === 'ほのお' ) {
      correction = Math.round( correction * 2048 / 4096 );
    }
  }

  if ( isAbility( target, 'かんそうはだ' ) ) {
    if ( move.type === 'ほのお' ) {
      correction = Math.round( correction * 5120 / 4096 );
    }
  }

  if ( isItem( pokemon, 'ちからのハチマキ' ) ) {
    if ( move.category === '物理' ) {
      correction = Math.round( correction * 4505 / 4096 );
    }
  }

  if ( isItem( pokemon, 'ものしりメガネ' ) ) {
    if ( move.category === '特殊' ) {
      correction = Math.round( correction * 4505 / 4096 );
    }
  }

  for ( const plate of plateTable ) {
    if ( isItem( pokemon, plate.name ) && move.type === plate.type ) {
      correction = Math.round( correction * 4915 / 4096 );
    }
  }

  for ( const incense of incenseTable ) {
    if ( isItem( pokemon, incense.name ) && move.type === incense.type ) {
      correction = Math.round( correction * 4915 / 4096 );
    }
  }

  if ( isItem( pokemon, 'こころのしずく' ) ) {
    if ( ( pokemon.status.name === 'ラティオス' || pokemon.status.name === 'ラティアス' ) && ( move.type === 'ドラゴン' || move.type === 'エスパー' ) && pokemon.stateChange.transform.isTrue === false ) {
      correction = Math.round( correction * 4915 / 4096 );
    }
  }

  if ( isItem( pokemon, 'こんごうだま' ) ) {
    if ( pokemon.status.name === 'ディアルガ' && ( move.type === 'はがね' || move.type === 'ドラゴン' ) && pokemon.stateChange.transform.isTrue === false ) {
      correction = Math.round( correction * 4915 / 4096 );
    }
  }

  if ( isItem( pokemon, 'しらたま' ) ) {
    if ( pokemon.status.name === 'パルキア' && ( move.type === 'みず' || move.type === 'ドラゴン' ) && pokemon.stateChange.transform.isTrue === false ) {
      correction = Math.round( correction * 4915 / 4096 );
    }
  }

  if ( isItem( pokemon, 'はっきんだま' ) ) {
    if ( ( pokemon.status.name === 'ギラティナ(オリジン)' || pokemon.status.name === 'ギラティナ(アナザー)' ) && ( move.type === 'はがね' || move.type === 'ドラゴン' ) && pokemon.stateChange.transform.isTrue === false ) {
      correction = Math.round( correction * 4915 / 4096 );
    }
  }

  if ( pokemon.stateChange.gem.text === move.type ) {
    correction = Math.round( correction * 5325 / 4096 );
    pokemon.stateChange.gem.reset();
  }

  if ( move.name === 'ソーラービーム' || move.name === 'ソーラーブレード' ) {
    if ( isWeather( pokemon, 'あめ' ) || isWeather( pokemon, 'すなあらし' ) || isWeather( pokemon, 'あられ' ) ) {
      correction = Math.round( correction * 2048 / 4096 );
    }
  }

  if ( move.name === 'Gのちから' ) {
    if ( fieldStatus.whole.gravity.isTrue === true ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  if ( move.name === 'はたきおとす' ) {
    if ( isReleasableItem( pokemon, target ) === true ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  if ( move.name === 'ミストバースト' ) {
    if ( fieldStatus.terrain.name === 'ミストフィールド' && isGrounded( pokemon ) === true ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  if ( move.name === 'ワイドフォース' ) {
    if ( fieldStatus.terrain.name === 'サイコフィールド' && isGrounded( pokemon ) === true ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  if ( pokemon.stateChange.helpingHand.isTrue === true ) {
    for ( let i = 0; i < pokemon.stateChange.helpingHand.count; i++ ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  if ( pokemon.stateChange.charge.isTrue === true ) {
    if ( move.type === 'でんき' ) {
      correction = Math.round( correction * 8192 / 4096 );
      pokemon.stateChange.charge.reset();
    }
  }

  if ( move.name === 'からげんき' ) {
    if ( isStatusAilment( pokemon, 'どく' ) || isStatusAilment( pokemon, 'やけど' ) || isStatusAilment( pokemon, 'まひ' ) ) {
      correction = Math.round( correction * 8192 / 4096 );
    }
  }

  if ( move.name === 'しおみず' ) {
    if ( target.status.remainingHP <= target.actualValue.hitPoint / 2 ) {
      correction = Math.round( correction * 8192 / 4096 );
    }
  }

  if ( move.name === 'ベノムショック' ) {
    if ( isStatusAilment( target, 'どく' ) ) {
      correction = Math.round( correction * 8192 / 4096 );
    }
  }

  if ( fieldStatus.terrain.name === 'グラスフィールド' && isGrounded( target ) ) {
    if ( move.name === 'じしん' || move.name === 'じならし' || move.name === 'マグニチュード' ) {
      correction = Math.round( correction * 2048 / 4096 );
    }
  }

  if ( fieldStatus.terrain.name === 'ミストフィールド' && isGrounded( target ) ) {
    if ( move.type === 'ドラゴン' ) {
      correction = Math.round( correction * 2048 / 4096 );
    }
  }

  if ( fieldStatus.terrain.name === 'エレキフィールド' ) {
    if ( isGrounded( pokemon ) && move.type === 'でんき' ) {
      correction = Math.round( correction * 5325 / 4096 );
    }
  }

  if ( fieldStatus.terrain.name === 'グラスフィールド' ) {
    if ( isGrounded( pokemon ) && move.type === 'くさ' ) {
      correction = Math.round( correction * 5325 / 4096 );
    }
  }

  if ( fieldStatus.terrain.name === 'サイコフィールド' ) {
    if ( isGrounded( pokemon ) && move.type === 'エスパー' ) {
      correction = Math.round( correction * 5325 / 4096 );
    }
  }

  if ( fieldStatus.whole.mudSport.isTrue === true ) {
    if ( move.type === 'でんき' ) {
      correction = Math.round( correction * 1352 / 4096 );
    }
  }

  if ( fieldStatus.whole.waterSport.isTrue === true ) {
    if ( move.type === 'ほのお' ) {
      correction = Math.round( correction * 1352 / 4096 );
    }
  }


  // 威力 = 基礎威力 * 威力補正 / 4096
  const result: number = fiveRoundEntry( basicPower * correction / 4096 )

  return Math.max( result, 1 );
}

// 急所判定
function getStatus( pokemon: Pokemon, target: Pokemon, damage: Damage ): number {

  // 急所判定
  let critical: boolean = false;

  damage.critical = critical;

  // 実数値・ランク
  let attackValue = pokemon.actualValue.attack;
  let attackRank = pokemon.rank.attack;
  let defenseValue = target.actualValue.defense;
  let defenseRank = target.rank.defense;

  if ( pokemon.moveUsed.category === '特殊' ) {
    attackValue = pokemon.actualValue.specialAttack;
    attackRank = pokemon.rank.specialAttack;
    defenseValue = target.actualValue.specialDefense;
    defenseRank = target.rank.specialDefense
  }

  let finalAttack = getValueWithRankCorrection( attackValue, attackRank, damage.critical );
  let finalDefense = getValueWithRankCorrection( defenseValue, defenseRank, damage.critical );

  // はりきり
  if ( isAbility( pokemon, 'はりきり' ) ) {
    if ( pokemon.moveUsed.category === '物理' ) {
      finalAttack = Math.floor( finalAttack * 6144 / 4096 );
    }
  }

  // 攻撃補正
  let attackCorrection = 4096;

  if ( isAbility( pokemon, 'スロースタート' ) ) {
    if ( pokemon.stateChange.slowStart.isTrue === true && pokemon.moveUsed.category === '物理' ) {
      attackCorrection = Math.round( attackCorrection * 2048 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'よわき' ) ) {
    if ( pokemon.status.remainingHP <= pokemon.actualValue.hitPoint / 2 ) {
      attackCorrection = Math.round( attackCorrection * 2048 / 4096 );
    }
  }

  if ( isExistAbility( 'わざわいのうつわ' ) === true && isAbility( pokemon, 'わざわいのうつわ' ) === false ) {
    if ( pokemon.moveUsed.category === '特殊' ) {
      attackCorrection = Math.round( attackCorrection * 3072 / 4096 );
    }
  }

  if ( isExistAbility( 'わざわいのおふだ' ) === true && isAbility( pokemon, 'わざわいのおふだ' ) === false ) {
    if ( pokemon.moveUsed.category === '物理' ) {
      attackCorrection = Math.round( attackCorrection * 3072 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'クォークチャージ' ) ) {
    const parameter: string = pokemon.stateChange.quarkDrive.text;
    if ( parameter === 'attack' && pokemon.moveUsed.category === '物理' ) {
      attackCorrection = Math.round( attackCorrection * 5325 / 4096 );
    }
    if ( parameter === 'specialAttack' && pokemon.moveUsed.category === '特殊' ) {
      attackCorrection = Math.round( attackCorrection * 5325 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'こだいかっせい' ) ) {
    const parameter: string = pokemon.stateChange.protosynthesis.text;
    if ( parameter === 'attack' && pokemon.moveUsed.category === '物理' ) {
      attackCorrection = Math.round( attackCorrection * 5325 / 4096 );
    }
    if ( parameter === 'specialAttack' && pokemon.moveUsed.category === '特殊' ) {
      attackCorrection = Math.round( attackCorrection * 5325 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'ハドロンエンジン' ) ) {
    if ( fieldStatus.terrain.name === 'エレキフィールド' && pokemon.moveUsed.category === '特殊' ) {
      attackCorrection = Math.round( attackCorrection * 5461 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'ハドロンエンジン' ) ) {
    if ( fieldStatus.terrain.name === 'エレキフィールド' && pokemon.moveUsed.category === '特殊' ) {
      attackCorrection = Math.round( attackCorrection * 5461 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'ひひいろのこどう' ) ) {
    if ( isWeather( pokemon, 'にほんばれ' ) === true && pokemon.moveUsed.category === '物理' ) {
      attackCorrection = Math.round( attackCorrection * 5461 / 4096 );
    }
  }

  for ( const _pokemon of allPokemonInBattlefield() ) {
    if ( _pokemon.trainer !== pokemon.trainer ) continue;
    if ( _pokemon.status.name !== 'チェリム(ポジ)' ) continue;
    if ( isWeather( _pokemon, 'にほんばれ' ) === false ) continue;
    if ( isAbility( _pokemon, 'フラワーギフト' ) === false ) continue;
    if ( pokemon.moveUsed.category === '物理' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'こんじょう' ) ) {
    if ( pokemon.status.statusAilment.name !== null && pokemon.moveUsed.category === '物理' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'しんりょく' ) ) {
    if ( pokemon.status.remainingHP <= pokemon.actualValue.hitPoint / 3 && pokemon.moveUsed.type === 'くさ' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'もうか' ) ) {
    if ( pokemon.status.remainingHP <= pokemon.actualValue.hitPoint / 3 && pokemon.moveUsed.type === 'ほのお' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'げきりゅう' ) ) {
    if ( pokemon.status.remainingHP <= pokemon.actualValue.hitPoint / 3 && pokemon.moveUsed.type === 'みず' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'むしのしらせ' ) ) {
    if ( pokemon.status.remainingHP <= pokemon.actualValue.hitPoint / 3 && pokemon.moveUsed.type === 'むし' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'もらいび' ) ) {
    if ( pokemon.stateChange.flashFire.isTrue === true && pokemon.moveUsed.type === 'ほのお' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'サンパワー' ) ) {
    if ( isWeather( pokemon, 'にほんばれ' ) === true && pokemon.moveUsed.category === '特殊' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'プラス' ) || isAbility( pokemon, 'マイナス' ) ) {
    for ( const _pokemon of allPokemonInBattlefield() ) {
      if ( _pokemon.trainer !== pokemon.trainer ) continue;
      if ( _pokemon.order.battle === pokemon.order.battle ) continue;
      if ( isAbility( _pokemon, 'プラス' ) === false && isAbility( _pokemon, 'マイナス' ) === false ) continue;
      if ( pokemon.moveUsed.category === '特殊' ) {
        attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
        break;
      }
    }
  }

  if ( isAbility( pokemon, 'いわはこび' ) ) {
    if ( pokemon.moveUsed.type === 'いわ' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'はがねつかい' ) ) {
    if ( pokemon.moveUsed.type === 'はがね' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'ごりむちゅう' ) ) {
    if ( pokemon.moveUsed.category === '物理' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'トランジスタ' ) ) {
    if ( pokemon.moveUsed.type === 'でんき' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'りゅうのあぎと' ) ) {
    if ( pokemon.moveUsed.type === 'ドラゴン' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'ちからもち' ) || isAbility( pokemon, 'ヨガパワー' ) ) {
    if ( pokemon.moveUsed.category === '物理' ) {
      attackCorrection = Math.round( attackCorrection * 8192 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'すいほう' ) ) {
    if ( pokemon.moveUsed.type === 'みず' ) {
      attackCorrection = Math.round( attackCorrection * 8192 / 4096 );
    }
  }

  if ( isAbility( target, 'あついしぼう' ) ) {
    if ( pokemon.moveUsed.type === 'ほのお' || pokemon.moveUsed.type === 'こおり' ) {
      attackCorrection = Math.round( attackCorrection * 2048 / 4096 );
    }
  }

  if ( isAbility( target, 'すいほう' ) ) {
    if ( pokemon.moveUsed.type === 'ほのお' ) {
      attackCorrection = Math.round( attackCorrection * 2048 / 4096 );
    }
  }

  if ( isAbility( target, 'きよめのしお' ) ) {
    if ( pokemon.moveUsed.type === 'ゴースト' ) {
      attackCorrection = Math.round( attackCorrection * 2048 / 4096 );
    }
  }

  if ( isItem( pokemon, 'こだわりハチマキ' ) ) {
    if ( pokemon.moveUsed.category === '物理' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( isItem( pokemon, 'こだわりメガネ' ) ) {
    if ( pokemon.moveUsed.category === '特殊' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( isItem( pokemon, 'ふといホネ' ) ) {
    if ( ( pokemon.status.name === 'カラカラ' || pokemon.status.name.includes( 'ガラガラ' ) ) && pokemon.moveUsed.category === '物理' ) {
      attackCorrection = Math.round( attackCorrection * 8192 / 4096 );
    }
  }

  if ( isItem( pokemon, 'しんかいのキバ' ) ) {
    if ( pokemon.status.name === 'パールル' && pokemon.moveUsed.category === '特殊' ) {
      attackCorrection = Math.round( attackCorrection * 8192 / 4096 );
    }
  }

  if ( isItem( pokemon, 'でんきだま' ) ) {
    if ( pokemon.status.name === 'ピカチュウ' ) {
      attackCorrection = Math.round( attackCorrection * 8192 / 4096 );
    }
  }

  // 最終攻撃
  finalAttack = fiveRoundEntry( finalAttack * attackCorrection / 4096 );
  finalAttack = Math.max( finalAttack, 1 );

  // すなあらし
  if ( isWeather( target, 'すなあらし' ) ) {
    if ( getPokemonType( target ).includes( 'いわ' ) && pokemon.moveUsed.category === '特殊' ) {
      finalDefense = Math.floor( finalDefense * 6144 / 4096 );
    }
  }

  // ゆき
  if ( isWeather( target, 'ゆき' ) ) {
    if ( getPokemonType( target ).includes( 'こおり' ) && pokemon.moveUsed.category === '物理' ) {
      finalDefense = Math.floor( finalDefense * 6144 / 4096 );
    }
  }

  // 防御補正
  let defenseCorrection = 4096;

  if ( isExistAbility( 'わざわいのたま' ) === true && isAbility( target, 'わざわいのたま' ) === false ) {
    if ( pokemon.moveUsed.category === '特殊' ) {
      defenseCorrection = Math.round( defenseCorrection * 3072 / 4096 );
    }
  }

  if ( isExistAbility( 'わざわいのつるぎ' ) === true && isAbility( target, 'わざわいのつるぎ' ) === false ) {
    if ( pokemon.moveUsed.category === '物理' ) {
      defenseCorrection = Math.round( defenseCorrection * 3072 / 4096 );
    }
  }

  if ( isAbility( target, 'クォークチャージ' ) ) {
    const parameter: string = target.stateChange.quarkDrive.text;
    if ( parameter === 'defense' && pokemon.moveUsed.category === '物理' ) {
      defenseCorrection = Math.round( defenseCorrection * 5325 / 4096 );
    }
    if ( parameter === 'specialDefense' && pokemon.moveUsed.category === '特殊' ) {
      defenseCorrection = Math.round( defenseCorrection * 5325 / 4096 );
    }
  }

  if ( isAbility( target, 'こだいかっせい' ) ) {
    const parameter: string = target.stateChange.protosynthesis.text;
    if ( parameter === 'defense' && pokemon.moveUsed.category === '物理' ) {
      defenseCorrection = Math.round( defenseCorrection * 5325 / 4096 );
    }
    if ( parameter === 'specialDefense' && pokemon.moveUsed.category === '特殊' ) {
      defenseCorrection = Math.round( defenseCorrection * 5325 / 4096 );
    }
  }

  for ( const _pokemon of allPokemonInBattlefield() ) {
    if ( _pokemon.trainer !== target.trainer ) continue;
    if ( _pokemon.status.name !== 'チェリム(ポジ)' ) continue;
    if ( isWeather( _pokemon, 'にほんばれ' ) === false ) continue;
    if ( isAbility( _pokemon, 'フラワーギフト' ) === false ) continue;
    if ( pokemon.moveUsed.category === '特殊' ) {
      defenseCorrection = Math.round( defenseCorrection * 6144 / 4096 );
    }
  }

  if ( isAbility( target, 'ふしぎなうろこ' ) ) {
    if ( target.status.statusAilment.name !== null && pokemon.moveUsed.category === '物理' ) {
      defenseCorrection = Math.round( defenseCorrection * 6144 / 4096 );
    }
  }

  if ( isAbility( target, 'くさのけがわ' ) ) {
    if ( fieldStatus.terrain.name === 'グラスフィールド' && pokemon.moveUsed.category === '物理' ) {
      defenseCorrection = Math.round( defenseCorrection * 6144 / 4096 );
    }
  }

  if ( isAbility( target, 'ファーコート' ) ) {
    if ( pokemon.moveUsed.category === '物理' ) {
      defenseCorrection = Math.round( defenseCorrection * 8192 / 4096 );
    }
  }

  if ( isItem( target, 'とつげきチョッキ' ) ) {
    if ( pokemon.moveUsed.category === '特殊' ) {
      defenseCorrection = Math.round( defenseCorrection * 6144 / 4096 );
    }
  }

  if ( isItem( target, 'しんかいのウロコ' ) ) {
    if ( target.status.name === 'パールル' && pokemon.moveUsed.category === '特殊' ) {
      defenseCorrection = Math.round( defenseCorrection * 8192 / 4096 );
    }
  }

  if ( isItem( target, 'メタルパウダー' ) ) {
    if ( target.status.name === 'メタモン' && pokemon.moveUsed.category === '物理' ) {
      defenseCorrection = Math.round( defenseCorrection * 8192 / 4096 );
    }
  }

  // 最終防御
  finalDefense = fiveRoundEntry( finalDefense * defenseCorrection / 4096 );
  finalDefense = Math.max( finalDefense, 1 );


  return finalAttack / finalDefense;
}



function getDamage( pokemon: Pokemon, target: Pokemon, power: number, status: number, damageInfo: Damage ): void {

  // 最終ダメージ
  let damage = Math.floor( Math.floor( Math.floor( pokemon.status.level * 2 / 5 + 2 ) * power * status ) / 50 + 2 );


  // 天気補正
  if ( isWeather( target, 'あめ' ) ) {
    if ( pokemon.moveUsed.type === 'みず' ) {
      damage = fiveRoundEntry( damage * 1.5 );
    }
    if ( pokemon.moveUsed.type === 'ほのお' ) {
      damage = fiveRoundEntry( damage * 0.5 );
    }
  }
  if ( isWeather( target, 'にほんばれ' ) ) {
    if ( pokemon.moveUsed.type === 'みず' ) {
      damage = fiveRoundEntry( damage * 0.5 );
    }
    if ( pokemon.moveUsed.type === 'ほのお' ) {
      damage = fiveRoundEntry( damage * 1.5 );
    }
  }

  // 急所補正
  if ( damageInfo.critical === true ) {
    damage = fiveRoundEntry( damage * 1.5 );
  }

  // 乱数補正
  const randomCorrection = Math.floor( getRandom() * 16 ) + 8500;
  damage = Math.floor( damage * randomCorrection / 10000 );

  // タイプ一致補正
  if ( getPokemonType( pokemon ).includes( pokemon.moveUsed.type ) ) {
    if ( isAbility( pokemon, 'てきおうりょく' ) ) {
      damage = fiveRoundEntry( damage * 2.0 );
    } else {
      damage = fiveRoundEntry( damage * 1.5 );
    }
  }

  // 相性補正
  damage = Math.floor( damage * damageInfo.effective );

  // やけど補正
  if ( isStatusAilment( pokemon, 'やけど' ) ) {
    if ( pokemon.moveUsed.name !== 'からげんき' && pokemon.moveUsed.category === '物理' ) {
      damage = fiveRoundEntry( damage * 0.5 );
    }
  }

  // M補正
  let corrM: number = 1.0;

  // 壁補正
  if ( isAbility( pokemon, 'すりぬけ' ) && pokemon.trainer !== target.trainer ) {
    ;
  } else {
    let rate: number = 0.5;
    if ( fieldStatus.battleStyle === 2 || fieldStatus.battleStyle === 3 ) {
      rate = 2732 / 4096;
    }
    if ( fieldStatus.getSide( target.trainer ).auroraVeil.isTrue === true ) {
      corrM = Math.round( corrM * rate );
    } else if ( fieldStatus.getSide( target.trainer ).reflect.isTrue === true && pokemon.moveUsed.category === '物理' ) {
      corrM = Math.round( corrM * rate );
    } else if ( fieldStatus.getSide( target.trainer ).lightScreen.isTrue === true && pokemon.moveUsed.category === '特殊' ) {
      corrM = Math.round( corrM * rate );
    }
  }

  // ブレインフォース補正
  if ( isAbility( pokemon, 'ブレインフォース' ) ) {
    if ( damageInfo.effective > 1 ) {
      corrM = Math.round( corrM * 1.25 );
    }
  }

  // スナイパー補正
  if ( isAbility( pokemon, 'スナイパー' ) ) {
    if ( damageInfo.critical === true ) {
      corrM = Math.round( corrM * 1.5 );
    }
  }

  // いろめがね補正
  if ( isAbility( pokemon, 'いろめがね' ) ) {
    if ( damageInfo.effective < 1 ) {
      corrM = Math.round( corrM * 2 );
    }
  }

  // もふもふほのお補正
  if ( isAbility( target, 'もふもふ' ) ) {
    if ( pokemon.moveUsed.type === 'ほのお' ) {
      corrM = Math.round( corrM * 2 );
    }
  }

  // Mhalf
  if ( isAbility( target, 'こおりのりんぷん' ) ) {
    if ( pokemon.moveUsed.category === '特殊' ) {
      corrM = Math.round( corrM * 0.5 );
    }
  }
  if ( isAbility( target, 'パンクロック' ) ) {
    if ( soundMoveList.includes( pokemon.moveUsed.name ) ) {
      corrM = Math.round( corrM * 0.5 );
    }
  }
  if ( isAbility( target, 'ファントムガード' ) || isAbility( target, 'マルチスケイル ' ) ) {
    if ( target.status.remainingHP === target.actualValue.hitPoint ) {
      corrM = Math.round( corrM * 0.5 );
    }
  }
  if ( isAbility( target, 'もふもふ' ) ) {
    if ( isDirect( pokemon ) === true ) {
      corrM = Math.round( corrM * 0.5 );
    }
  }

  // Mfikter
  if ( isAbility( target, 'ハードロック' ) || isAbility( target, 'フィルター' ) || isAbility( target, 'プリズムアーマー' ) ) {
    if ( damageInfo.effective > 1 ) {
      corrM = Math.round( corrM * 0.75 );
    }
  }

  // フレンドガード補正
  for ( const _pokemon of allPokemonInBattlefield() ) {
    if ( _pokemon.trainer !== target.trainer ) continue;
    if ( _pokemon.order.battle === target.order.battle ) continue;
    if ( isAbility( _pokemon, 'フレンドガード' ) ) {
      corrM = Math.round( corrM * 0.75 );
    }
  }

  // たつじんのおび補正
  if ( isItem( pokemon, 'たつじんのおび' ) ) {
    if ( damageInfo.effective > 1 ) {
      corrM = Math.round( corrM * 4915 / 4096 );
    }
  }

  // いのちのたま補正
  if ( isItem( pokemon, 'いのちのたま' ) ) {
    corrM = Math.round( corrM * 5324 / 4096 );
  }

  // 半減の実補正
  let isHalfBerry: boolean = false;
  if ( isItem( target, 'ホズのみ' ) === true && pokemon.moveUsed.type === 'ノーマル' ) {
    isHalfBerry = true;
  }
  for ( const berry of berryTable ) {
    if ( isItem( target, berry.name ) === true && berry.half === pokemon.moveUsed.type && damageInfo.effective > 1 ) {
      isHalfBerry = true;
    }
  }
  if ( isHalfBerry === true ) {
    const ripen: number = ( isAbility( target, 'じゅくせい' ) )? 1 / 2 : 1;
    corrM = Math.round( corrM * 2048 * ripen / 4096 );
    eatBerry( target, target.status.name );
  }

  // Mtwice
  if ( target.stateChange.dig.isTrue === true ) {
    if ( pokemon.moveUsed.name === 'じしん' || pokemon.moveUsed.name === 'マグニチュード' ) {
      corrM = Math.round( corrM *  2 );
    }
  }
  if ( target.stateChange.dive.isTrue === true ) {
    if ( pokemon.moveUsed.name === 'なみのり' ) {
      corrM = Math.round( corrM * 2 );
    }
  }
  if ( target.stateChange.minimize.isTrue === true ) {
    if ( stompMoveList.includes( pokemon.moveUsed.name ) ) {
      corrM = Math.round( corrM * 2 );
    }
  }
  if ( target.stateChange.dynamax.isTrue === true ) {
    if ( pokemon.moveUsed.name === 'きょじゅうざん' || pokemon.moveUsed.name === 'きょじゅうだん' || pokemon.moveUsed.name === 'ダイマックスほう' ) {
      corrM = Math.round( corrM * 2 );
    }
  }

  damage = fiveRoundEntry( damage * corrM );


  // 最終ダメージ
  damageInfo.damage = damage;
}
