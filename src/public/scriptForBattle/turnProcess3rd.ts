// 3.トレーナーの行動、ポケモンの行動順に関する行動
function actionBeforeTurn(): void {

  main.calcSpeed();

  // 技選択したポケモンの効果
  for ( const pokemon of main.getPokemonToAttack() ) {

    quickDraw: // クイックドロウ
    if ( pokemon.ability.isName( 'クイックドロウ' ) ) {
      if ( pokemon.move.selected.isStatus() ) break quickDraw;
      if ( getRandom() >= 30 ) break quickDraw;

      pokemon.actionOrder.raise = true;
      pokemon.msgDeclareAbility();
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
      if ( !pokemon.isActivateBerryByHP( 4 ) ) break custapBerry;

      pokemon.actionOrder.raise = true;
      pokemon.msgCustapBerry();
      pokemon.consumeItem();
    }
  }

  // 交代・よびかける
  for ( const pokemon of main.getPokemonToExchange() ) {
    const battle: number | null = pokemon.order.battle;
    const reserve: number | null = pokemon.command.reserve;
    if ( battle === null ) continue;
    if ( reserve === null ) continue;

    //writeLog( `${translateENintoJP( pokemon.isMe )}は ${pokemon.name}を 引っこめた!` );
    toReserve( pokemon );

    const next: Pokemon = getPokemonByParty( pokemon.isMine(), reserve );
    toBattleField( next, battle );
  }
}
