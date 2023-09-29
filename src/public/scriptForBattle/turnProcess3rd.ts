// 3.トレーナーの行動、ポケモンの行動順に関する行動
function actionBeforeTurn(): void {

  for ( const pokemon of allPokemonInBattlefield() ) {

    quickDraw:
    if ( pokemon.ability.isName( 'クイックドロウ' ) ) {
      if ( pokemon.selectedMove.category === '変化' ) break quickDraw;
      if ( getRandom() >= 30 ) break quickDraw;

      pokemon.stateChange.orderRaise.isTrue = true;
      pokemon.declareAbility();
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
      const gluttony: number = ( pokemon.ability.isName( 'くいしんぼう' ) )? 2 : 1;
      if ( pokemon.hitPoint.isGreaterThan( 4 / gluttony ) ) break custapBerry;

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

    writeLog( `${translateENintoJP( pokemon.trainer )}は ${pokemon.name}を 引っこめた!` );
    toReserve( pokemon );

    const next: Pokemon = getPokemonByParty( pokemon.trainer, reserve );
    toBattleField( next, battle );
  }
}
