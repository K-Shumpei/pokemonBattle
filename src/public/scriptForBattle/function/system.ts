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

function allPokemonInSide( trainer: 'me' | 'opp' ): Pokemon[] {

  const result: Pokemon[] = [];

  if ( trainer === 'me' ) {
    for ( const pokemon of myParty ) {
      if ( pokemon.order.battle !== null ) {
        result.push( pokemon );
      }
    }

    return result;
  } else {
    for ( const pokemon of opponentParty ) {
      if ( pokemon.order.battle !== null ) {
        result.push( pokemon );
      }
    }

    return result;
  }
}

// わたげの対象ポケモン
function pokemonForCottonDown( pokemon: Pokemon ): Pokemon[] {

  const result: Pokemon[] = [];

  for ( let i = fieldStatus.battleStyle - 1; i >= 0; i-- ) {
    const target: Pokemon | false = getPokemonByBattle( getOpponentTrainer( pokemon.trainer ), i );
    if ( target === false ) continue;
    result.push( target );
  }

  for ( let i = 0; i < fieldStatus.battleStyle; i++ ) {
    const target: Pokemon | false = getPokemonByBattle( pokemon.trainer, i );
    if ( target === false ) continue;
    if ( isSame( target, pokemon ) === true ) continue;
    result.push( target );
  }

  return result;
}

function getPokemonByParty( trainer: string, party: number ): Pokemon {

  if ( trainer === 'me' ) {
    for ( const pokemon of myParty ) {
      if ( pokemon.order.party === party ) {
        return pokemon;
      }
    }
  } else {
    for ( const pokemon of opponentParty ) {
      if ( pokemon.order.party === party ) {
        return pokemon;
      }
    }
  }

  return myParty[0];
}

function getPokemonByBattle( trainer: string, battle: number | null ): Pokemon | false {

  if ( trainer === 'me' ) {
    for ( const pokemon of myParty ) {
      if ( pokemon.order.battle === battle ) {
        return pokemon;
      }
    }
  }
  if ( trainer === 'opp' ) {
    for ( const pokemon of opponentParty ) {
      if ( pokemon.order.battle === battle ) {
        return pokemon;
      }
    }
  }

  return false;
}

function getOpponentTrainer( trainer: 'me' | 'opp' ): 'me' | 'opp' {

  if ( trainer === 'me' ) {
    return 'opp';
  } else  {
    return 'me';
  }
}

function getParty( trainer: 'me' | 'opp' ): Pokemon[] {

  if ( trainer === 'me' ) return myParty;
  else return opponentParty;
}

function writeLog( text: string ): void {

  const battleLog = getHTMLInputElement( 'battle_log' );
  battleLog.value += text + "\n";
}

// 乱数 0以上100未満の整数
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

// トレーナー判断
function getArticle( pokemon: Pokemon ): string {

  if ( pokemon.trainer === 'me' ) {
    return translatePokemonName( pokemon.name );
  } else {
    return '相手の ' + translatePokemonName( pokemon.name );
  }
}

function isSame( pokemon: Pokemon, target: Pokemon ): boolean {

  if ( pokemon.trainer === target.trainer && pokemon.order.party === target.order.party ) {
    return true;
  } else {
    return false;
  }
}

function isFriend( pokemon: Pokemon, target: Pokemon ): boolean {

  if ( pokemon.trainer === target.trainer && pokemon.order.party !== target.order.party ) {
    return true;
  } else {
    return false;
  }
}

function getTargetList( pokemon: Pokemon ): TargetDataType[] {

  const result: TargetDataType[] = []

  for ( const damage of pokemon.damage ) {
    if ( damage.success === false ) {
      continue;
    }
    const target: Pokemon = getPokemonByParty( damage.trainer, damage.party );
    result.push( { target: target, damage: damage } );
  }

  return result;
}
