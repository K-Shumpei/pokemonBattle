function moveEffect( pokemon: Pokemon ): void {

  if ( pokemon.moveUsed.category !== '変化' ) {
    // 対象全員へのダメージ計算
    calculateDamageForAll( pokemon );
  }


}

function calculateDamageForAll( pokemon: Pokemon ): void {

  for ( const info of pokemon.target ) {
    if ( info.success === false ) {
      continue;
    }

    const target: Pokemon | false = getPokemonByID( info.trainer, info.battleNumber );
    if ( target === false ) {
      continue;
    }

    calculateDamage( pokemon, target );

    console.log( `${target.damage.damage } のダメージ！`);



  }

}
