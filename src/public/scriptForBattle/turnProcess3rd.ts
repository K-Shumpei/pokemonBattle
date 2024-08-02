// 3.トレーナーの行動、ポケモンの行動順に関する行動
function actionBeforeTurn(): void {

  main.calcRankCorrectionValue();

  // クイックドロウ/せんせいのツメ/イバンのみの発動
  // こうこうのしっぽ/まんぷくおこう/あとだし/きんしのちから (アナウンスはなし)
  for ( const pokemon of getPokemonScheduledToAttack() ) {
    pokemon.actionOrder.onActivateQuickDraw( pokemon );
    pokemon.actionOrder.onActivateQuickClaw( pokemon );
    pokemon.actionOrder.onActivatecustapBerry( pokemon );
    pokemon.actionOrder.onActivatelater( pokemon );
  }

  // 交代・よびかける
  for ( const pokemon of getPokemonScheduledToExchange() ) {
    const battle: number | null = pokemon.order.battle;
    const reserve: number | null = pokemon.command.reserve;
    if ( battle === null ) continue;
    if ( reserve === null ) continue;

    pokemon.toHand();

    const next: Pokemon = main.getPokemonByParty( pokemon.isMine(), reserve );
    next.toBattleField( battle );
  }

  // 場に出した時の効果
  onActivateLandingEffect();

  // メガシンカ/ウルトラバースト

}
