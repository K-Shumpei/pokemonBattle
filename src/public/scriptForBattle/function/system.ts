function allPokemonInBattlefield(): Pokemon[] {

  const result: Pokemon[] = [];

  for ( const pokemon of myParty ) {
    if ( pokemon.order.battle !== null ) {
      result.push( pokemon );
    }
  }

  for ( const pokemon of opponentParty ) {
    if ( pokemon.order.battle !== null ) {
      result.push( pokemon );
    }
  }

  return result;
}

function getPokemonByID( trainer: string, battleNumber: number | null ): Pokemon | false {

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

function writeLog( text: string ): void {

  const battleLog = getHTMLInputElement( 'battle_log' );
  battleLog.value += text + "\n";
}

// 乱数 0以上1未満 0.00, 0.01, 0.02, 0.03, ・・・ , 0.98, 0.99 の 100種類
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
