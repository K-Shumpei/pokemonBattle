function allPokemonInBattlefield(): Pokemon[] {

  const result: Pokemon[] = [];

  for ( const pokemon of myParty ) {
    if ( pokemon.order.battle !== false ) {
      result.push( pokemon );
    }
  }

  for ( const pokemon of opponentParty ) {
    if ( pokemon.order.battle !== false ) {
      result.push( pokemon );
    }
  }

  return result;
}

function getPokemonByID( trainer: string, battleNumber: number | false ): Pokemon | false {

  if ( trainer === 'me' ) {
    for ( const pokemon of myParty ) {
      if ( pokemon.order.battle === battleNumber ) {
        return pokemon;
      }
    }
  }
  if ( trainer === 'opponent' ) {
    for ( const pokemon of opponentParty ) {
      if ( pokemon.order.battle === battleNumber ) {
        return pokemon;
      }
    }
  }

  return false;
}

// 乱数
function getRandom(): number {

  const first = randomList[0];
  randomList.shift();

  return first;
}

// 5捨6入
function fiveRoundEntry( number: number ) {

  if ( number % 1 > 0.5 ) {
      return Math.floor(number) + 1;
  } else {
      return Math.floor(number);
  }
}
