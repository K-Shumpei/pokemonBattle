function calculateDamage( pokemon: Pokemon, target: Pokemon ): void {

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
  // 急所判定
  // getCritical(poke, tgt)
  // 攻撃と防御の実数値取得　
  // const param = getStatus(poke, tgt)
  // 最終攻撃
  //const attack = getAttack(poke, tgt, param.atk)
  // 最終防御
  //const defense = defenseCalculation(poke, tgt, param.def)
  // 最終ダメージ
  getDamage( pokemon, target, power )
}

function getPower( pokemon: Pokemon, target: Pokemon ): number {

  // 威力 = 基礎威力 * 威力補正 / 4096

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
    if ( isExistAbility( 'フェアリーオーラ' ) && move.type === 'フェアリー' ) {
      correction = Math.round( correction * 3072 / 4096 );
    }
    if ( isExistAbility( 'ダークオーラ' ) && move.type === 'あく' ) {
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
    if ( move.isDirect === true ) {
      correction = Math.round( correction * 5325 / 4096 );
    }
  }

  if ( isAbility( pokemon, 'すなのちから' ) ) {
    if ( isWeather( pokemon, 'すなあらし' ) === true && ( move.type === 'いわ' || move.type === 'じめん' || move.type === 'はがね' ) ) {
      correction = Math.round( correction * 5325 / 4096 );
    }
  }


  return basicPower;
}



function getDamage( pokemon: Pokemon, target: Pokemon, power: number ): void {

  target.damage.damage = power;
}
