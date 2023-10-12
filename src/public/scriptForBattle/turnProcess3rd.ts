// 3.トレーナーの行動、ポケモンの行動順に関する行動
function actionBeforeTurn(): void {

  main.calcSpeed();
  const pokeList: Pokemon[] = main.getPokemonInBattle();

  for ( const pokemon of sortByActionOrder( pokeList ) ) {

    if ( pokemon.command.isExchange() ) continue;

    quickDraw: // クイックドロウ
    if ( pokemon.ability.isName( 'クイックドロウ' ) ) {
      if ( pokemon.move.selected.isStatus() ) break quickDraw;
      if ( getRandom() >= 30 ) break quickDraw;

      pokemon.actionOrder.raise = true;
      pokemon.declareAbility();
      pokemon.msgQuickDraw();
      continue;
    }

    quickClaw: // せんせいのつめ
    if ( pokemon.item.isName( 'せんせいのツメ' ) ) {
      if ( getRandom() >= 20 ) break quickClaw;

      pokemon.actionOrder.raise = true;
      pokemon.msgQuickClaw();
      continue;
    }

    custapBerry: // イバンのみ
    if ( pokemon.item.isName( 'イバンのみ' ) ) {
      if ( !pokemon.isActivateBerryByHP() ) break custapBerry;

      pokemon.actionOrder.raise = true;
      pokemon.msgCustapBerry();

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
    //if ( getSpeedValue( b, 'e' ) > getSpeedValue( a, 'e' ) ) return 1;
    //if ( getSpeedValue( b, 'e' ) < getSpeedValue( a, 'e' ) ) return -1;
    // 乱数
    if ( getRandom() > 50 ) return 1;
    else return -1;
  });

  for ( const pokemon of changePokemon ) {
    const battle: number | null = pokemon.order.battle;
    const reserve: number | null = pokemon.command.reserve;
    if ( battle === null ) continue;
    if ( reserve === null ) continue;

    //writeLog( `${translateENintoJP( pokemon.isMe )}は ${pokemon.name}を 引っこめた!` );
    toReserve( pokemon );

    const next: Pokemon = getPokemonByParty( pokemon.isMe, reserve );
    toBattleField( next, battle );
  }
}
