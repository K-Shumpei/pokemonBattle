function isItem( pokemon: Pokemon, item: string ): boolean {

  if ( pokemon.status.item !== item ) {
    return false;
  }

  return true;
}

function isAbility( pokemon: Pokemon, ability: string ): boolean {

  if ( pokemon.status.ability !== ability ) {
    return false;
  }

  return true;
}

function getValueWithRankCorrection( pokemon: Pokemon, parameter: string, critical: boolean ): number {

  const actualValue: number = pokemon.actualValue[parameter];
  const rank: number = pokemon.rank[parameter];

  if ( critical === true ) {
    const thisRank: number = Math.max( rank, 0 );
    return Math.floor( ( actualValue * ( 2 + thisRank ) ) / 2 );
  } else {
    if ( rank > 0 ) {
      return Math.floor( ( actualValue * ( 2 + rank ) ) / 2 );
    } else {
      return Math.floor( ( actualValue * 2 ) / ( 2 - rank ) );
    }
  }
}

// 天候が有効であるかどうか
function isWeather( pokemon: Pokemon, weather: string ): boolean {

  for ( const pokemon of allPokemonInBattlefield() ) {
    if ( isAbility( pokemon, 'エアロック' ) === true ) {
      return false;
    }
    if ( isAbility( pokemon, 'ノーてんき' ) === true ) {
      return false;
    }
  }

  if ( weather === 'あめ' ) {
    if ( isItem( pokemon, 'ばんのうがさ' ) === true ) {
      return false;
    }
    if ( fieldStatus.weather.name === 'あめ' || fieldStatus.weather.name === 'おおあめ' ) {
      return true;
    }
  }

  if ( weather === 'にほんばれ' ) {
    if ( isItem( pokemon, 'ばんのうがさ' ) === true ) {
      return false;
    }
    if ( fieldStatus.weather.name === 'にほんばれ' || fieldStatus.weather.name === 'おおひでり' ) {
      return true;
    }
  }

  if( weather === 'すなあらし' ) {
    ;
  }

  if ( weather === 'あられ' ) {
    ;
  }

  if ( weather === 'ゆき' ) {
    ;
  }

  if ( weather === 'おおあめ' ) {
    if ( isItem( pokemon, 'ばんのうがさ' ) === true ) {
      return false;
    }
  }

  if ( weather === 'おおひでり' ) {
    if ( isItem( pokemon, 'ばんのうがさ' ) === true ) {
      return false;
    }
  }

  if ( weather === 'らんきりゅう' ) {
    ;
  }

  if ( fieldStatus.weather.name === weather ) {
    return true;
  }

  return false;
}

