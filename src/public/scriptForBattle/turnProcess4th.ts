// 4. ポケモンの行動
function pokemonAction(): void {


  // !!間違ったコード!! ループさせるポケモンが違う
  while ( main.getPokemonInBattle().length > 0 ) {
    const order = main.getPokemonInBattle()[0]
    const pokemon: Pokemon | false = getPokemonByBattle( order.isMe, order.order.battle );
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
    break;
  }
}





