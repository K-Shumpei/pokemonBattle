// 3.トレーナーの行動、ポケモンの行動順に関する行動
function preliminaryAction(): void {

  for ( const pokemon of allPokemonInBattlefield() ) {

    quickDraw:
    if ( isAbility( pokemon, 'クイックドロウ' ) === true ) {
      if ( pokemon.moveUsed.category === '変化' ) break quickDraw;
      if ( getRandom() >= 30 ) break quickDraw;

      pokemon.stateChange.orderRaise.isTrue = true;
      pokemon.status.declareAbility();
      writeLog( `${getArticle( pokemon )}は クイックドロウで 行動が はやくなった!` );
      continue;
    }

    quickClaw:
    if ( isItem( pokemon, 'せんせいのツメ' ) === true ) {
      if ( getRandom() >= 30 ) break quickClaw;

      pokemon.stateChange.orderRaise.isTrue = true;
      writeLog( `${getArticle( pokemon )}は せんせいのツメで 行動が はやくなった!` );
      continue;
    }

    custapBerry:
    if ( isItem( pokemon, 'イバンのみ' ) === true ) {
      const gluttony: number = ( isAbility( pokemon, 'くいしんぼう' ) === true )? 2 : 1;
      if ( pokemon.status.remainingHP > pokemon.actualValue.hitPoint * gluttony / 4 ) break custapBerry;

      pokemon.stateChange.orderRaise.isTrue = true;
      writeLog( `${getArticle( pokemon )}は イバンのみで 行動が はやくなった!` );

      // リサイクル
      recycleAvailable( pokemon );
      // ゲップ
      pokemon.stateChange.belch.isTrue = true;
      // ほおぶくろ
      activateCheekPouch( pokemon );
    }
  }

  // 交代・よびかける
  const changePokemon = allPokemonInBattlefield().filter( pokemon => pokemon.command.reserve !== null ).sort( ( a, b ) => {
    // 素早さ
    if ( getSpeedValue( b, 'e' ) > getSpeedValue( a, 'e' ) ) return 1;
    if ( getSpeedValue( b, 'e' ) < getSpeedValue( a, 'e' ) ) return -1;
    // 乱数
    if ( getRandom() > 50 ) return 1;
    else return -1;
  });

  for ( const pokemon of changePokemon ) {
    const battle: number | null = pokemon.order.battle;
    const reserve: number | null = pokemon.command.reserve;
    if ( battle === null ) continue;
    if ( reserve === null ) continue;

    writeLog( `${translateENintoJP( pokemon.trainer )}は ${pokemon.status.name}を 引っこめた!` );
    toReserve( pokemon );

    const next: Pokemon = getPokemonByParty( pokemon.trainer, reserve );
    toBattleField( next, battle );
  }
}
