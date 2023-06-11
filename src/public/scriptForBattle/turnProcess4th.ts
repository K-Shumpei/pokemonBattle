// 4. ポケモンの行動
function pokemonAction(): void {

  while ( getActionOrder().length > 0 ) {
    const order = getActionOrder()[0]
    const pokemon: Pokemon | false = getPokemonByBattle( order.trainer, order.battleNumber );
    if ( pokemon === false ) {
      continue;
    }

    // 技の成功判定
    const judge = isSuccess( pokemon );

    // コマンドの削除
    pokemon.command = new Command;

    if ( judge === false ) {
      continue;
    }

    // 技の効果
    moveEffect( pokemon );
  }
}





