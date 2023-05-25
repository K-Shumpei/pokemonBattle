// 持ち物
function isItem( pokemon: Pokemon, item: string ): boolean {

  if ( pokemon.status.item !== item ) {
    return false;
  }

  return true;
}

// 特性
function isAbility( pokemon: Pokemon, ability: string ): boolean {

  if ( pokemon.status.ability !== ability ) {
    return false;
  }

  return true;
}

// 状態異常
function isStatusAilment( pokemon: Pokemon, statusAilment: string ): boolean {

  if ( pokemon.status.statusAilment.name === statusAilment ) {
    return true;
  }

  if ( statusAilment === 'どく' ) {
    if ( pokemon.status.statusAilment.name === 'もうどく' ) {
      return true;
    }
  }

  return false;
}

// ランク補正
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

// 天気
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


// 接地判定
function isGrounded( pokemon: Pokemon ): boolean {

  return true;
  /*
  // 姿を隠しているポケモンは、地面にいない
  if ( poke.myCondition.myHide ) return false

  // 以下の状態のポケモンは、地面にいる
  if ( poke.myCondition.myIngrain ) return true
  if ( poke.myCondition.mySmack_down ) return true
  if ( fieldStatus.myGravity > 0 ) return true
  if ( poke.myItem == "くろいてっきゅう" && isItem(poke) ) return true

  // 以下の状態のポケモンは、地面にいない
  if ( poke.myType.includes("ひこう") ) return false
  if ( poke.myAbility == "ふゆう" && isAbility(poke) ) return false
  if ( poke.myItem == "ふうせん" && isItem(poke) ) return false
  if ( poke.myCondition.myMagnet_rise > 0 ) return false
  if ( poke.myCondition.myTelekinesis > 0 ) return false

  // それ以外のポケモンは、地面にいる
  return true
  */
}

// ポケモンのタイプ
function getPokemonType( pokemon: Pokemon ): string[] {

  let result: string[] = [];

  if ( pokemon.status.type1 !== '' ) {
    result.push( pokemon.status.type1 );
  }
  if ( pokemon.status.type2 !== '' ) {
    result.push( pokemon.status.type2 );
  }

  if ( result.length === 0 ) {
    result.push( '' );
  }

  return result;
}

// バトル場の特性存在判定
function isExistAbility( ability: string ): boolean {

  for ( const pokemon of allPokemonInBattlefield() ) {
    if ( isAbility( pokemon, ability ) === true ) {
      return true;
    }
  }
  return false;
}
