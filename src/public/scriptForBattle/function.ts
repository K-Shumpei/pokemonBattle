// ポケモン検索
function getPokemonDataByName( name: string ): PokemonDataType {

  for ( const pokemon of pokemonData ) {
    if ( pokemon.name === name ) {
      return pokemon;
    }
  }

  return getPokemonDataFalse();
}


function getPokemonDataFalse(): PokemonDataType {

  const sampleData = getPokemonDataByName( 'フシギダネ' );
  sampleData.isOK = false;

  return sampleData;
}


// 技検索
function getMoveDataByName( name: string ): MoveDataType {

  for ( const move of moveData ) {
    if ( move.name === name ) {
      return move;
    }
  }

  return getMoveDataFalse();
}


function getMoveDataFalse(): MoveDataType {

  const sampleData = getMoveDataByName( 'アームハンマー' );
  sampleData.isOK = false;

  return sampleData;
}

// 性格検索
function getNatureDataByName( name: string ): NatureDataType {

  for ( const nature of natureData ) {
    if ( nature.name === name ) {
      return nature;
    }
  }

  return getNatureDataFalse();
}


function getNatureDataFalse(): NatureDataType {

  const sample: NatureDataType = { name: '', plus: '', minus: '', isOK: false };

  return sample;
}

// タイプ検索
function getTypeColorByName( name: string ): TypeColorType {

  for ( const type of typeColor ) {
    if ( type.name === name ) {
      return type;
    }
  }

  return getTypeColorFalse();
}

function getTypeColorFalse(): TypeColorType {

  const sample: TypeColorType = { name: '', light: '', normal: '', dark: '', isOK: false };

  return sample;
}


// 翻訳
function translateENintoJP( string: string ): string {

  for ( const dictionary of translationDictionary ) {
    if ( dictionary.EN === string ) {
      return dictionary.JP;
    }
  }

  return '';
}

function getBaseStatusList( pokemon: PokemonDataType ): ParameterSixType {

  const baseStatusList: ParameterSixType = {
    hitPoint: pokemon.hitPoint,
    attack: pokemon.attack,
    defense: pokemon.defense,
    specialAttack: pokemon.specialAttack,
    specialDefense: pokemon.specialDefense,
    speed: pokemon.speed
  }

  return baseStatusList;
}
