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
  //const param = getStatus(poke, tgt)
  // 最終攻撃
  //const attack = attackCalculation(poke, tgt, param.atk)
  // 最終防御
  //const defense = defenseCalculation(poke, tgt, param.def)
  // 最終ダメージ
  //finalDamage(poke, tgt, power, attack, defense)
}

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
    if ( target.status.statusAilment === 'まひ' ) {
      basicPower = 140;
    }
  }

  if ( move.name === 'めざましビンタ' ) {
    if ( target.status.statusAilment === 'ねむり' ) {
      basicPower = 140;
    }
  }

  if ( move.name === 'たたりめ' ) {
    if ( target.status.statusAilment !== false ) {
      basicPower = 130;
    }
  }

  if ( move.name === 'ウェザーボール' ) {
    if ( isWeather( pokemon, 'にほんばれ') ) basicPower = 100;
    if ( isWeather( pokemon, 'あめ' ) ) basicPower = 100;
    if ( isWeather( pokemon, 'すなあらし' ) ) basicPower = 100;
    if ( isWeather( pokemon, 'あられ' ) ) basicPower = 100;
    if ( isWeather( pokemon, 'ゆき' ) ) basicPower = 100;
  }

  return basicPower;
}
