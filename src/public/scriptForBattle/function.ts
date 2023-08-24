// ポケモン検索
function getPokemonDataByName( name: string ): PokemonData {

  const result = pokemonMaster.filter( pokemon => pokemon.nameJA === name );

  return result[0];
}


// 技検索
function getMoveDataByName( name: string ): MoveData {

  const result = moveMaster.filter( move => move.nameJA === name );

  return result[0];
}


// 性格検索
function getNatureDataByName( name: NatureType ): NatureDataType {

  for ( const nature of natureData ) {
    if ( nature.name === name ) {
      return nature;
    }
  }

  return natureData[0];
}


// タイプ検索
function getTypeColorByName( name: string ): TypeColorType {

  for ( const type of typeColor ) {
    if ( type.name === name ) {
      return type;
    }
  }

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

function translateJPintoEN( string: string ): string {

  for ( const dictionary of translationDictionary ) {
    if ( dictionary.JP === string ) {
      return dictionary.EN;
    }
  }

  return '';
}

function getBaseStatusList( pokemon: PokemonData ): ParameterSixType {

  const baseStatusList: ParameterSixType = {
    hitPoint: pokemon.baseStatus.hitPoint,
    attack: pokemon.baseStatus.attack,
    defense: pokemon.baseStatus.defense,
    specialAttack: pokemon.baseStatus.specialAttack,
    specialDefense: pokemon.baseStatus.specialDefense,
    speed: pokemon.baseStatus.speed
  }

  return baseStatusList;
}

