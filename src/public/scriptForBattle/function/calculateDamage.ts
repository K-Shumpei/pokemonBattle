function calculateDamage( pokemon: Pokemon, target: Pokemon, damage: Damage ): number {

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
  const finalDamage = getDamage( pokemon, target, power, status, damage )

  return finalDamage;
}

// 威力計算
function getPower( pokemon: Pokemon, target: Pokemon ): number {

  const move: SelectedMove = pokemon.move.selected;

  // 基礎威力
  let basicPower: number | null = move.power;

  if ( move.name === 'きしかいせい' || move.name === 'じたばた' ) {
    if ( pokemon.status.hitPoint.value.rate() >= 0 )     basicPower = 200;
    if ( pokemon.status.hitPoint.value.rate() >= 2/48 )  basicPower = 150;
    if ( pokemon.status.hitPoint.value.rate() >= 5/48 )  basicPower = 100;
    if ( pokemon.status.hitPoint.value.rate() >= 10/48 ) basicPower = 80;
    if ( pokemon.status.hitPoint.value.rate() >= 17/48 ) basicPower = 40;
    if ( pokemon.status.hitPoint.value.rate() >= 33/48 ) basicPower = 20;
  }

  if ( move.name === 'しおふき' || move.name === 'ふんか' || move.name === 'ドラゴンエナジー' ) {
    const base: number = Math.floor( 150 * pokemon.status.hitPoint.value.rate() );
    basicPower = Math.max( base, 1 );
  }

  if ( move.name === 'しぼりとる' || move.name === 'にぎりつぶす' ) {
    const base: number = Math.floor( 150 * target.status.hitPoint.value.rate() );
    basicPower = Math.max( base, 1 );
  }

  if ( move.name === 'アシストパワー' || move.name === 'つけあがる' ) {
    let count: number = 0;
    /*
    for ( const parameter of Object.keys( pokemon.rank ) ) {
      count += Math.max( pokemon.rank[parameter].value, 0 );
    }
    */
    basicPower = 20 * ( count + 1 );
  }

  if ( move.name === 'おしおき' ) {
    let count: number = 0;
    /*
    for ( const parameter of Object.keys( target.rank ) ) {
      count += Math.max( target.rank[parameter].value, 0 );
    }
    */
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
    const base: number = Math.floor( pokemon.happiness * 10 / 25 );
    basicPower = Math.max( base, 1 );
  }

  if ( move.name === 'やつあたり' ) {
    const base: number = Math.floor( ( 255 - pokemon.happiness ) * 10 / 25 );
    basicPower = Math.max( base, 1 );
  }

  if ( move.name === 'きりふだ' ) {
    const parameter: number = pokemon.move.learned[pokemon.move.selected.slot].powerPoint.value;
    if ( parameter === 0 ) basicPower = 200;
    if ( parameter === 1 ) basicPower = 80;
    if ( parameter === 2 ) basicPower = 60;
    if ( parameter === 3 ) basicPower = 50;
    if ( parameter >= 4 )  basicPower = 40;
  }

  if ( move.name === 'くさむすび' || move.name === 'けたぐり' ) {
    const parameter: number = target.getWeight();
    if ( parameter >= 0 )   basicPower = 20;
    if ( parameter >= 10 )  basicPower = 40;
    if ( parameter >= 25 )  basicPower = 60;
    if ( parameter >= 50 )  basicPower = 80;
    if ( parameter >= 100 ) basicPower = 100;
    if ( parameter >= 120 ) basicPower = 120;
  }

  if ( move.name === 'ヒートスタンプ' || move.name === 'ヘビーボンバー' ) {
    const parameter: number = target.getWeight() / pokemon.getWeight();
    basicPower = 40;
    if ( parameter <= 1/2 ) basicPower = 60;
    if ( parameter <= 1/3 ) basicPower = 80;
    if ( parameter <= 1/4 ) basicPower = 100;
    if ( parameter <= 1/5 ) basicPower = 120;
  }

  if ( move.name === 'きつけ' ) {
    if ( target.statusAilment.isParalysis() ) {
      basicPower = 140;
    }
  }

  if ( move.name === 'めざましビンタ' ) {
    if ( target.statusAilment.isAsleep() ) {
      basicPower = 140;
    }
  }

  if ( move.name === 'たたりめ' ) {
    if ( !target.statusAilment.isHealth() ) {
      basicPower = 130;
    }
  }

  if ( move.name === 'ウェザーボール' ) {
    if ( fieldStatus.weather.isSunny( pokemon ) ) basicPower = 100;
    if ( fieldStatus.weather.isRainy( pokemon ) ) basicPower = 100;
    if ( fieldStatus.weather.isSandy() ) basicPower = 100;
    if ( fieldStatus.weather.isSnowy() ) basicPower = 100;
  }

  if ( move.name === 'だいちのはどう' ) {
    if ( isGrounded( pokemon ) === true ) {
      if ( !fieldStatus.terrain.isPlain() ) basicPower = 100;
    }
  }

  if ( move.name === 'ライジングボルト' ) {
    if ( isGrounded( target ) === true && fieldStatus.terrain.isElectric() ) {
      basicPower = 140;
    }
  }

  if ( move.name === 'かぜおこし' || move.name === 'たつまき' ) {
    ;
  }

  if ( move.name === 'アクロバット' ) {
    if ( pokemon.item === null ) {
      basicPower = 110;
    }
  }

  if ( move.name === 'しぜんのめぐみ' ) {
    for ( const berry of berryTable ) {
      if ( pokemon.item.isName( berry.name ) === true ) {
        basicPower = berry.naturalGift.power;
      }
    }
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
    if ( isExistAbility( 'フェアリーオーラ' ) && move.type === 'FAIRY' ) {
      correction = Math.round( correction * 3072 / 4096 );
    }
    if ( isExistAbility( 'ダークオーラ' ) && move.type === 'DARK' ) {
      correction = Math.round( correction * 3072 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'とうそうしん' ) ) {
    if ( pokemon.gender !== target.gender && pokemon.gender !== 'genderless' && target.gender !== 'genderless' ) {
        correction = Math.round( correction * 3072 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'エレキスキン' ) || pokemon.ability.isName( 'スカイスキン' ) || pokemon.ability.isName( 'ノーマルスキン' ) || pokemon.ability.isName( 'フェアリースキン' ) || pokemon.ability.isName( 'フリーズスキン' ) ) {
    if ( pokemon.stateChange.skin.text === move.type ) {
      correction = Math.round( correction * 4915 / 4096 );
      pokemon.stateChange.skin.reset();
    }
  }

  if ( pokemon.ability.isName( 'すてみ' ) ) {
    if ( recklessMoveList.includes( move.name ) ) {
      correction = Math.round( correction * 4915 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'てつのこぶし' ) ) {
    if ( ironFistMoveList.includes( move.name ) ) {
      correction = Math.round( correction * 4915 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'とうそうしん' ) ) {
    if ( pokemon.gender === target.gender && pokemon.gender !== 'genderless' && target.gender !== 'genderless' ) {
        correction = Math.round( correction * 5120 / 4096 );
    }
  }

  for ( const poke of allPokemonInBattlefield() ) {
    if ( !move.isPhysical() ) continue;
    if ( poke.trainer !== pokemon.trainer ) continue;
    if ( poke.order.battle === pokemon.order.battle ) continue;
    if ( poke.ability.isName( 'バッテリー' ) ) {
      correction = Math.round( correction * 5325 / 4096 );
    }
  }

  for ( const poke of allPokemonInBattlefield() ) {
    if ( poke.trainer !== pokemon.trainer ) continue;
    if ( poke.order.battle === pokemon.order.battle ) continue;
    if ( poke.ability.isName( 'パワースポット' ) ) {
      correction = Math.round( correction * 5325 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'かたいツメ' ) ) {
    if ( pokemon.isContact() ) {
      correction = Math.round( correction * 5325 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'すなのちから' ) ) {
    if ( fieldStatus.weather.isSandy() && ( move.type === 'ROCK' || move.type === 'GROUND' || move.type === 'STEEL' ) ) {
      correction = Math.round( correction * 5325 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'ちからずく' ) ) {
    let isTrue = false;
    for ( const move of additionalEffectTargetRank ) {
      if ( move.name === pokemon.move.selected.name ) {
        isTrue = true;
      }
    }
    for ( const move of additionalEffectMyRank ) {
      if ( move.name === pokemon.move.selected.name ) {
        isTrue = true;
      }
    }
    for ( const move of additionalEffectAilment ) {
      if ( move.name === pokemon.move.selected.name ) {
        isTrue = true;
      }
    }
    for ( const move of additionalEffectConfuse ) {
      if ( move.name === pokemon.move.selected.name ) {
        isTrue = true;
      }
    }
    for ( const move of additionalEffectFlinch ) {
      if ( move.name === pokemon.move.selected.name ) {
        isTrue = true;
      }
    }
    if ( additionalEffectOthers.includes( pokemon.move.selected.name ) ) {
      isTrue = true;
    }

    if ( isTrue === true ) {
      pokemon.stateChange.sheerForce.isTrue = true;
      correction = Math.round( correction * 5325 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'パンクロック' ) ) {
    if ( soundMoveList.includes( move.name ) ) {
      correction = Math.round( correction * 5325 / 4096 );
    }
  }

  if ( isExistAbility( 'ダークオーラ' ) ) {
    if ( move.type === 'DARK' && isExistAbility( 'オーラブレイク' ) === false ) {
      correction = Math.round( correction * 5448 / 4096 );
    }
  }

  if ( isExistAbility( 'フェアリーオーラ' ) ) {
    if ( move.type === 'FAIRY' && isExistAbility( 'オーラブレイク' ) === false ) {
      correction = Math.round( correction * 5448 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'がんじょうあご' ) ) {
    if ( biteMoveList.includes( move.name ) ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'テクニシャン' ) ) {
    if ( basicPower !== null && basicPower <= 60 ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'どくぼうそう' ) ) {
    if ( pokemon.statusAilment.isPoisoned() && move.isPhysical() ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'ねつぼうそう' ) ) {
    if ( pokemon.statusAilment.isBurned() && move.isSpecial() ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  for ( const poke of allPokemonInBattlefield() ) {
    if ( poke.trainer !== pokemon.trainer ) continue;
    if ( poke.ability.isName( 'はがねのせいしん' ) ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'メガランチャー' ) ) {
    if ( waveMoveList.includes( move.name ) ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  if ( target.ability.isName( 'たいねつ' ) ) {
    if ( move.type === 'FIRE' ) {
      correction = Math.round( correction * 2048 / 4096 );
    }
  }

  if ( target.ability.isName( 'かんそうはだ' ) ) {
    if ( move.type === 'FIRE' ) {
      correction = Math.round( correction * 5120 / 4096 );
    }
  }

  if ( pokemon.item.isName( 'ちからのハチマキ' ) ) {
    if ( move.isPhysical() ) {
      correction = Math.round( correction * 4505 / 4096 );
    }
  }

  if ( pokemon.item.isName( 'ものしりメガネ' ) ) {
    if ( move.isSpecial() ) {
      correction = Math.round( correction * 4505 / 4096 );
    }
  }

  for ( const plate of plateTable ) {
    if ( pokemon.item.isName( plate.name ) && move.type === plate.type ) {
      correction = Math.round( correction * 4915 / 4096 );
    }
  }

  for ( const incense of incenseTable ) {
    if ( pokemon.item.isName( incense.name ) && move.type === incense.type ) {
      correction = Math.round( correction * 4915 / 4096 );
    }
  }

  if ( pokemon.item.isName( 'こころのしずく' ) ) {
    if ( ( pokemon.name === 'ラティオス' || pokemon.name === 'ラティアス' ) && ( move.type === 'DRAGON' || move.type === 'PSYCHIC' ) && pokemon.stateChange.transform.isTrue === false ) {
      correction = Math.round( correction * 4915 / 4096 );
    }
  }

  if ( pokemon.item.isName( 'こんごうだま' ) ) {
    if ( pokemon.name === 'ディアルガ' && ( move.type === 'STEEL' || move.type === 'DRAGON' ) && pokemon.stateChange.transform.isTrue === false ) {
      correction = Math.round( correction * 4915 / 4096 );
    }
  }

  if ( pokemon.item.isName( 'しらたま' ) ) {
    if ( pokemon.name === 'パルキア' && ( move.type === 'WATER' || move.type === 'DRAGON' ) && pokemon.stateChange.transform.isTrue === false ) {
      correction = Math.round( correction * 4915 / 4096 );
    }
  }

  if ( pokemon.item.isName( 'はっきんだま' ) ) {
    if ( ( pokemon.name === 'ギラティナ(オリジン)' || pokemon.name === 'ギラティナ(アナザー)' ) && ( move.type === 'STEEL' || move.type === 'DRAGON' ) && pokemon.stateChange.transform.isTrue === false ) {
      correction = Math.round( correction * 4915 / 4096 );
    }
  }

  if ( pokemon.stateChange.gem.text === move.type ) {
    correction = Math.round( correction * 5325 / 4096 );
    pokemon.stateChange.gem.reset();
  }

  if ( move.name === 'ソーラービーム' || move.name === 'ソーラーブレード' ) {
    if ( fieldStatus.weather.isRainy( pokemon ) || fieldStatus.weather.isSandy() || fieldStatus.weather.isSnowy() ) {
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
    if ( fieldStatus.terrain.isMisty() && isGrounded( pokemon ) === true ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  if ( move.name === 'ワイドフォース' ) {
    if ( fieldStatus.terrain.isPsychic() && isGrounded( pokemon ) === true ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  if ( pokemon.stateChange.helpingHand.isTrue === true ) {
    for ( let i = 0; i < pokemon.stateChange.helpingHand.count; i++ ) {
      correction = Math.round( correction * 6144 / 4096 );
    }
  }

  if ( pokemon.stateChange.charge.isTrue === true ) {
    if ( move.type === 'ELECTRIC' ) {
      correction = Math.round( correction * 8192 / 4096 );
      pokemon.stateChange.charge.reset();
    }
  }

  if ( move.name === 'からげんき' ) {
    if ( pokemon.statusAilment.isPoisoned() || pokemon.statusAilment.isBurned() || pokemon.statusAilment.isParalysis() ) {
      correction = Math.round( correction * 8192 / 4096 );
    }
  }

  if ( move.name === 'しおみず' ) {
    if ( target.status.hitPoint.value.isLessEqual( 2 ) ) {
      correction = Math.round( correction * 8192 / 4096 );
    }
  }

  if ( move.name === 'ベノムショック' ) {
    if ( pokemon.statusAilment.isPoisoned() ) {
      correction = Math.round( correction * 8192 / 4096 );
    }
  }

  if ( fieldStatus.terrain.isGrassy() && isGrounded( target ) ) {
    if ( move.name === 'じしん' || move.name === 'じならし' || move.name === 'マグニチュード' ) {
      correction = Math.round( correction * 2048 / 4096 );
    }
  }

  if ( fieldStatus.terrain.isMisty() && isGrounded( target ) ) {
    if ( move.type === 'DRAGON' ) {
      correction = Math.round( correction * 2048 / 4096 );
    }
  }

  if ( fieldStatus.terrain.isElectric() ) {
    if ( isGrounded( pokemon ) && move.type === 'ELECTRIC' ) {
      correction = Math.round( correction * 5325 / 4096 );
    }
  }

  if ( fieldStatus.terrain.isGrassy() ) {
    if ( isGrounded( pokemon ) && move.type === 'GRASS' ) {
      correction = Math.round( correction * 5325 / 4096 );
    }
  }

  if ( fieldStatus.terrain.isPsychic() ) {
    if ( isGrounded( pokemon ) && move.type === 'PSYCHIC' ) {
      correction = Math.round( correction * 5325 / 4096 );
    }
  }

  if ( fieldStatus.whole.mudSport.isTrue === true ) {
    if ( move.type === 'ELECTRIC' ) {
      correction = Math.round( correction * 1352 / 4096 );
    }
  }

  if ( fieldStatus.whole.waterSport.isTrue === true ) {
    if ( move.type === 'FIRE' ) {
      correction = Math.round( correction * 1352 / 4096 );
    }
  }


  // 基礎威力が定義されていない場合、０を返す
  if ( basicPower === null ) return 0;

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
  let attackValue = pokemon.status.attack.actual;
  let attackRank = pokemon.status.attack.rank.value;
  let defenseValue = target.status.defense.actual;
  let defenseRank = target.status.defense.rank.value;

  if ( pokemon.move.selected.isSpecial() ) {
    attackValue = pokemon.status.specialAttack.actual;
    attackRank = pokemon.status.specialAttack.rank.value;
    defenseValue = target.status.specialDefense.actual;
    defenseRank = target.status.specialDefense.rank.value
  }

  let finalAttack = getValueWithRankCorrection( attackValue, attackRank, damage.critical );
  let finalDefense = getValueWithRankCorrection( defenseValue, defenseRank, damage.critical );

  // はりきり
  if ( pokemon.ability.isName( 'はりきり' ) ) {
    if ( pokemon.move.selected.isPhysical() ) {
      finalAttack = Math.floor( finalAttack * 6144 / 4096 );
    }
  }

  // 攻撃補正
  let attackCorrection = 4096;

  if ( pokemon.ability.isName( 'スロースタート' ) ) {
    if ( pokemon.stateChange.slowStart.isTrue === true && pokemon.move.selected.isPhysical() ) {
      attackCorrection = Math.round( attackCorrection * 2048 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'よわき' ) ) {
    if ( pokemon.status.hitPoint.value.isLessEqual( 2 ) ) {
      attackCorrection = Math.round( attackCorrection * 2048 / 4096 );
    }
  }

  if ( isExistAbility( 'わざわいのうつわ' ) && target.ability.isName( 'わざわいのうつわ' ) === false ) {
    if ( pokemon.move.selected.isSpecial() ) {
      attackCorrection = Math.round( attackCorrection * 3072 / 4096 );
    }
  }

  if ( isExistAbility( 'わざわいのおふだ' ) && target.ability.isName( 'わざわいのおふだ' ) === false ) {
    if ( pokemon.move.selected.isPhysical() ) {
      attackCorrection = Math.round( attackCorrection * 3072 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'クォークチャージ' ) ) {
    const parameter: string = pokemon.stateChange.quarkDrive.text;
    if ( parameter === 'attack' && pokemon.move.selected.isPhysical() ) {
      attackCorrection = Math.round( attackCorrection * 5325 / 4096 );
    }
    if ( parameter === 'specialAttack' && pokemon.move.selected.isSpecial() ) {
      attackCorrection = Math.round( attackCorrection * 5325 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'こだいかっせい' ) ) {
    const parameter: string = pokemon.stateChange.protosynthesis.text;
    if ( parameter === 'attack' && pokemon.move.selected.isPhysical() ) {
      attackCorrection = Math.round( attackCorrection * 5325 / 4096 );
    }
    if ( parameter === 'specialAttack' && pokemon.move.selected.isSpecial() ) {
      attackCorrection = Math.round( attackCorrection * 5325 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'ハドロンエンジン' ) ) {
    if ( fieldStatus.terrain.isElectric() && pokemon.move.selected.isSpecial() ) {
      attackCorrection = Math.round( attackCorrection * 5461 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'ハドロンエンジン' ) ) {
    if ( fieldStatus.terrain.isElectric() && pokemon.move.selected.isSpecial() ) {
      attackCorrection = Math.round( attackCorrection * 5461 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'ひひいろのこどう' ) ) {
    if ( fieldStatus.weather.isSunny( pokemon ) && pokemon.move.selected.isPhysical() ) {
      attackCorrection = Math.round( attackCorrection * 5461 / 4096 );
    }
  }

  for ( const _pokemon of allPokemonInBattlefield() ) {
    if ( _pokemon.trainer !== pokemon.trainer ) continue;
    if ( _pokemon.name !== 'チェリム(ポジ)' ) continue;
    if ( !fieldStatus.weather.isSunny( _pokemon ) ) continue;
    if ( _pokemon.ability.isName( 'フラワーギフト' ) === false ) continue;
    if ( pokemon.move.selected.isPhysical() ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'こんじょう' ) ) {
    if ( !pokemon.statusAilment.isHealth() && pokemon.move.selected.isPhysical() ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'しんりょく' ) ) {
    if ( pokemon.status.hitPoint.value.isLessThan( 3 ) && pokemon.move.selected.type === 'GRASS' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'もうか' ) ) {
    if ( pokemon.status.hitPoint.value.isLessThan( 3 ) && pokemon.move.selected.type === 'FIRE' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'げきりゅう' ) ) {
    if ( pokemon.status.hitPoint.value.isLessThan( 3 ) && pokemon.move.selected.type === 'WATER' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'むしのしらせ' ) ) {
    if ( pokemon.status.hitPoint.value.isLessThan( 3 ) && pokemon.move.selected.type === 'BUG' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'もらいび' ) ) {
    if ( pokemon.stateChange.flashFire.isTrue === true && pokemon.move.selected.type === 'FIRE' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'サンパワー' ) ) {
    if ( fieldStatus.weather.isSunny( pokemon ) && pokemon.move.selected.isSpecial() ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'プラス' ) || pokemon.ability.isName( 'マイナス' ) ) {
    for ( const _pokemon of allPokemonInBattlefield() ) {
      if ( _pokemon.trainer !== pokemon.trainer ) continue;
      if ( _pokemon.order.battle === pokemon.order.battle ) continue;
      if ( _pokemon.ability.isName( 'プラス' ) === false && _pokemon.ability.isName( 'マイナス' ) === false ) continue;
      if ( pokemon.move.selected.isSpecial() ) {
        attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
        break;
      }
    }
  }

  if ( pokemon.ability.isName( 'いわはこび' ) ) {
    if ( pokemon.move.selected.type === 'ROCK' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'はがねつかい' ) ) {
    if ( pokemon.move.selected.type === 'STEEL' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'ごりむちゅう' ) ) {
    if ( pokemon.move.selected.isPhysical() ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'トランジスタ' ) ) {
    if ( pokemon.move.selected.type === 'ELECTRIC' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'りゅうのあぎと' ) ) {
    if ( pokemon.move.selected.type === 'DRAGON' ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'ちからもち' ) || pokemon.ability.isName( 'ヨガパワー' ) ) {
    if ( pokemon.move.selected.isPhysical() ) {
      attackCorrection = Math.round( attackCorrection * 8192 / 4096 );
    }
  }

  if ( pokemon.ability.isName( 'すいほう' ) ) {
    if ( pokemon.move.selected.type === 'WATER' ) {
      attackCorrection = Math.round( attackCorrection * 8192 / 4096 );
    }
  }

  if ( target.ability.isName( 'あついしぼう' ) ) {
    if ( pokemon.move.selected.type === 'FIRE' || pokemon.move.selected.type === 'ICE' ) {
      attackCorrection = Math.round( attackCorrection * 2048 / 4096 );
    }
  }

  if ( target.ability.isName( 'すいほう' ) ) {
    if ( pokemon.move.selected.type === 'FIRE' ) {
      attackCorrection = Math.round( attackCorrection * 2048 / 4096 );
    }
  }

  if ( target.ability.isName( 'きよめのしお' ) ) {
    if ( pokemon.move.selected.type === 'GHOST' ) {
      attackCorrection = Math.round( attackCorrection * 2048 / 4096 );
    }
  }

  if ( pokemon.item.isName( 'こだわりハチマキ' ) ) {
    if ( pokemon.move.selected.isPhysical() ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( pokemon.item.isName( 'こだわりメガネ' ) ) {
    if ( pokemon.move.selected.isSpecial() ) {
      attackCorrection = Math.round( attackCorrection * 6144 / 4096 );
    }
  }

  if ( pokemon.item.isName( 'ふといホネ' ) ) {
    if ( ( pokemon.name === 'カラカラ' || pokemon.name.includes( 'ガラガラ' ) ) && pokemon.move.selected.isPhysical() ) {
      attackCorrection = Math.round( attackCorrection * 8192 / 4096 );
    }
  }

  if ( pokemon.item.isName( 'しんかいのキバ' ) ) {
    if ( pokemon.name === 'パールル' && pokemon.move.selected.isSpecial() ) {
      attackCorrection = Math.round( attackCorrection * 8192 / 4096 );
    }
  }

  if ( pokemon.item.isName( 'でんきだま' ) ) {
    if ( pokemon.name === 'ピカチュウ' ) {
      attackCorrection = Math.round( attackCorrection * 8192 / 4096 );
    }
  }

  // 最終攻撃
  finalAttack = fiveRoundEntry( finalAttack * attackCorrection / 4096 );
  finalAttack = Math.max( finalAttack, 1 );

  // すなあらし
  if ( fieldStatus.weather.isSandy() ) {
    if ( getPokemonType( target ).includes( 'ROCK' ) && pokemon.move.selected.isSpecial() ) {
      finalDefense = Math.floor( finalDefense * 6144 / 4096 );
    }
  }

  // ゆき
  if ( fieldStatus.weather.isSnowy() ) {
    if ( getPokemonType( target ).includes( 'ICE' ) && pokemon.move.selected.isPhysical() ) {
      finalDefense = Math.floor( finalDefense * 6144 / 4096 );
    }
  }

  // 防御補正
  let defenseCorrection = 4096;

  if ( isExistAbility( 'わざわいのたま' ) && target.ability.isName( 'わざわいのたま' ) === false ) {
    if ( pokemon.move.selected.isSpecial() ) {
      defenseCorrection = Math.round( defenseCorrection * 3072 / 4096 );
    }
  }

  if ( isExistAbility( 'わざわいのつるぎ' ) && target.ability.isName( 'わざわいのつるぎ' ) === false ) {
    if ( pokemon.move.selected.isPhysical() ) {
      defenseCorrection = Math.round( defenseCorrection * 3072 / 4096 );
    }
  }

  if ( target.ability.isName( 'クォークチャージ' ) ) {
    const parameter: string = target.stateChange.quarkDrive.text;
    if ( parameter === 'defense' && pokemon.move.selected.isPhysical() ) {
      defenseCorrection = Math.round( defenseCorrection * 5325 / 4096 );
    }
    if ( parameter === 'specialDefense' && pokemon.move.selected.isSpecial() ) {
      defenseCorrection = Math.round( defenseCorrection * 5325 / 4096 );
    }
  }

  if ( target.ability.isName( 'こだいかっせい' ) ) {
    const parameter: string = target.stateChange.protosynthesis.text;
    if ( parameter === 'defense' && pokemon.move.selected.isPhysical() ) {
      defenseCorrection = Math.round( defenseCorrection * 5325 / 4096 );
    }
    if ( parameter === 'specialDefense' && pokemon.move.selected.isSpecial() ) {
      defenseCorrection = Math.round( defenseCorrection * 5325 / 4096 );
    }
  }

  for ( const _pokemon of allPokemonInBattlefield() ) {
    if ( _pokemon.trainer !== target.trainer ) continue;
    if ( _pokemon.name !== 'チェリム(ポジ)' ) continue;
    if ( !fieldStatus.weather.isSunny( _pokemon ) ) continue;
    if ( _pokemon.ability.isName( 'フラワーギフト' ) === false ) continue;
    if ( pokemon.move.selected.isSpecial() ) {
      defenseCorrection = Math.round( defenseCorrection * 6144 / 4096 );
    }
  }

  if ( target.ability.isName( 'ふしぎなうろこ' ) ) {
    if ( !target.statusAilment.isHealth() && pokemon.move.selected.isPhysical() ) {
      defenseCorrection = Math.round( defenseCorrection * 6144 / 4096 );
    }
  }

  if ( target.ability.isName( 'くさのけがわ' ) ) {
    if ( fieldStatus.terrain.isGrassy() && pokemon.move.selected.isPhysical() ) {
      defenseCorrection = Math.round( defenseCorrection * 6144 / 4096 );
    }
  }

  if ( target.ability.isName( 'ファーコート' ) ) {
    if ( pokemon.move.selected.isPhysical() ) {
      defenseCorrection = Math.round( defenseCorrection * 8192 / 4096 );
    }
  }

  if ( target.item.isName( 'とつげきチョッキ' ) ) {
    if ( pokemon.move.selected.isSpecial() ) {
      defenseCorrection = Math.round( defenseCorrection * 6144 / 4096 );
    }
  }

  if ( target.item.isName( 'しんかいのウロコ' ) ) {
    if ( target.name === 'パールル' && pokemon.move.selected.isSpecial() ) {
      defenseCorrection = Math.round( defenseCorrection * 8192 / 4096 );
    }
  }

  if ( target.item.isName( 'メタルパウダー' ) ) {
    if ( target.name === 'メタモン' && pokemon.move.selected.isPhysical() ) {
      defenseCorrection = Math.round( defenseCorrection * 8192 / 4096 );
    }
  }

  // 最終防御
  finalDefense = fiveRoundEntry( finalDefense * defenseCorrection / 4096 );
  finalDefense = Math.max( finalDefense, 1 );


  return finalAttack / finalDefense;
}



function getDamage( pokemon: Pokemon, target: Pokemon, power: number, status: number, damageInfo: Damage ): number {

  // 最終ダメージ
  let damage = Math.floor( Math.floor( Math.floor( pokemon.level * 2 / 5 + 2 ) * power * status ) / 50 + 2 );

  // 範囲補正
  if ( pokemon.stateChange.rangeCorr.isTrue === true ) {
    damage = fiveRoundEntry( damage * 3072 / 4096 );
  }

  // 天気補正
  if ( fieldStatus.weather.isRainy( target ) ) {
    if ( pokemon.move.selected.type === 'WATER' ) {
      damage = fiveRoundEntry( damage * 1.5 );
    }
    if ( pokemon.move.selected.type === 'FIRE' ) {
      damage = fiveRoundEntry( damage * 0.5 );
    }
  }
  if ( fieldStatus.weather.isSunny( target ) ) {
    if ( pokemon.move.selected.type === 'WATER' ) {
      damage = fiveRoundEntry( damage * 0.5 );
    }
    if ( pokemon.move.selected.type === 'FIRE' ) {
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
  if ( getPokemonType( pokemon ).includes( pokemon.move.selected.type ) ) {
    if ( pokemon.ability.isName( 'てきおうりょく' ) ) {
      damage = fiveRoundEntry( damage * 2.0 );
    } else {
      damage = fiveRoundEntry( damage * 1.5 );
    }
  }

  // 相性補正
  damage = Math.floor( damage * damageInfo.effective );

  // やけど補正
  if ( pokemon.statusAilment.isBurned() ) {
    if ( pokemon.move.selected.name !== 'からげんき' && pokemon.move.selected.isPhysical() ) {
      damage = fiveRoundEntry( damage * 0.5 );
    }
  }

  // M補正
  let corrM: number = 1.0;

  // 壁補正
  if ( pokemon.ability.isName( 'すりぬけ' ) && pokemon.trainer !== target.trainer ) {
    ;
  } else {
    let rate: number = 0.5;
    if ( fieldStatus.battleStyle === 2 || fieldStatus.battleStyle === 3 ) {
      rate = 2732 / 4096;
    }
    if ( fieldStatus.getSide( target.trainer ).auroraVeil.isTrue === true ) {
      corrM = Math.round( corrM * rate );
    } else if ( fieldStatus.getSide( target.trainer ).reflect.isTrue === true && pokemon.move.selected.isPhysical() ) {
      corrM = Math.round( corrM * rate );
    } else if ( fieldStatus.getSide( target.trainer ).lightScreen.isTrue === true && pokemon.move.selected.isSpecial() ) {
      corrM = Math.round( corrM * rate );
    }
  }

  // ブレインフォース補正
  if ( pokemon.ability.isName( 'ブレインフォース' ) ) {
    if ( damageInfo.effective > 1 ) {
      corrM = Math.round( corrM * 1.25 );
    }
  }

  // スナイパー補正
  if ( pokemon.ability.isName( 'スナイパー' ) ) {
    if ( damageInfo.critical === true ) {
      corrM = Math.round( corrM * 1.5 );
    }
  }

  // いろめがね補正
  if ( pokemon.ability.isName( 'いろめがね' ) ) {
    if ( damageInfo.effective < 1 ) {
      corrM = Math.round( corrM * 2 );
    }
  }

  // もふもふほのお補正
  if ( target.ability.isName( 'もふもふ' ) ) {
    if ( pokemon.move.selected.type === 'FIRE' ) {
      corrM = Math.round( corrM * 2 );
    }
  }

  // Mhalf
  if ( target.ability.isName( 'こおりのりんぷん' ) ) {
    if ( pokemon.move.selected.isSpecial() ) {
      corrM = Math.round( corrM * 0.5 );
    }
  }
  if ( target.ability.isName( 'パンクロック' ) ) {
    if ( soundMoveList.includes( pokemon.move.selected.name ) ) {
      corrM = Math.round( corrM * 0.5 );
    }
  }
  if ( target.ability.isName( 'ファントムガード' ) || target.ability.isName( 'マルチスケイル' ) ) {
    if ( target.status.hitPoint.value.isMax() ) {
      corrM = Math.round( corrM * 0.5 );
    }
  }
  if ( target.ability.isName( 'もふもふ' ) ) {
    if ( pokemon.isContact() ) {
      corrM = Math.round( corrM * 0.5 );
    }
  }

  // Mfikter
  if ( target.ability.isName( 'ハードロック' ) || target.ability.isName( 'フィルター' ) || target.ability.isName( 'プリズムアーマー' ) ) {
    if ( damageInfo.effective > 1 ) {
      corrM = Math.round( corrM * 0.75 );
    }
  }

  // フレンドガード補正
  for ( const _pokemon of allPokemonInBattlefield() ) {
    if ( _pokemon.trainer !== target.trainer ) continue;
    if ( _pokemon.order.battle === target.order.battle ) continue;
    if ( _pokemon.ability.isName( 'フレンドガード' ) ) {
      corrM = Math.round( corrM * 0.75 );
    }
  }

  // たつじんのおび補正
  if ( pokemon.item.isName( 'たつじんのおび' ) ) {
    if ( damageInfo.effective > 1 ) {
      corrM = Math.round( corrM * 4915 / 4096 );
    }
  }

  // いのちのたま補正
  if ( pokemon.item.isName( 'いのちのたま' ) ) {
    corrM = Math.round( corrM * 5324 / 4096 );
  }

  // 半減の実補正
  let isHalfBerry: boolean = false;
  if ( target.item.isName( 'ホズのみ' ) === true && pokemon.move.selected.type === 'NORMAL' ) {
    isHalfBerry = true;
  }
  for ( const berry of berryTable ) {
    if ( target.item.isName( berry.name ) === true && berry.half === pokemon.move.selected.type && damageInfo.effective > 1 ) {
      isHalfBerry = true;
    }
  }
  if ( isHalfBerry === true ) {
    const ripen: number = ( target.ability.isName( 'じゅくせい' ) )? 1 / 2 : 1;
    corrM = Math.round( corrM * 2048 * ripen / 4096 );
    eatBerry( target, target.name );
  }

  // Mtwice
  if ( target.stateChange.dig.isTrue === true ) {
    if ( pokemon.move.selected.name === 'じしん' || pokemon.move.selected.name === 'マグニチュード' ) {
      corrM = Math.round( corrM *  2 );
    }
  }
  if ( target.stateChange.dive.isTrue === true ) {
    if ( pokemon.move.selected.name === 'なみのり' ) {
      corrM = Math.round( corrM * 2 );
    }
  }
  if ( target.stateChange.minimize.isTrue === true ) {
    if ( stompMoveList.includes( pokemon.move.selected.name ) ) {
      corrM = Math.round( corrM * 2 );
    }
  }
  if ( target.stateChange.dynamax.isTrue === true ) {
    if ( pokemon.move.selected.name === 'きょじゅうざん' || pokemon.move.selected.name === 'きょじゅうだん' || pokemon.move.selected.name === 'ダイマックスほう' ) {
      corrM = Math.round( corrM * 2 );
    }
  }

  damage = fiveRoundEntry( damage * corrM );


  // 最終ダメージ
  return damage;
}
