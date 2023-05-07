// 4. ポケモンの行動
function pokemonBehavior(): void {

  while ( getActionOrder().length > 0 ) {
    const order = getActionOrder()[0]
    const pokemon: Pokemon | false = getPokemonByID( order.trainer, order.battleNumber );
    if ( pokemon === false ) {
      continue;
    }

    // 技の成功判定


    // コマンドの削除
    pokemon.command = new Command;

    // 技の効果
    moveEffect( pokemon );
  }


}





