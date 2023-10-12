// ランク変化
function changeTargetRank( pokemon: Pokemon, target: Pokemon, parameter: string, change: number ): void {

  let value: number = getRankVariation( target, parameter, change );
  const parameterJP: string = translateENintoJP( parameter );

  if ( value === 0 ) {
    if ( change > 0 ) writeLog( `${getArticle( target )}の ${parameterJP}は もう上がらない!` );
    if ( change < 0 ) writeLog( `${getArticle( target )}の ${parameterJP}は もう下がらない!` );
    return;
  }

  if ( value < 0 ) {
    // しろいきり
    mist:
    /*
    if ( fieldStatus.getSide( target.isMe ).mist.isTrue === true ) {
      if ( pokemon.stateChange.memo.text === 'わたげ' ) {
        const infiltrator: Pokemon | false = getPokemonByBattle( pokemon.stateChange.memo.target.isMe, pokemon.stateChange.memo.target.battle );
        if ( infiltrator === false ) break mist;
        if ( infiltrator.ability.isName( 'すりぬけ' ) && infiltrator.isMe !== target.isMe ) {
          return;
        }
      } else {
        if ( pokemon.ability.isName( 'すりぬけ' ) && pokemon.isMe !== target.isMe ) {
          return;
        }
      }
    }
    */
    // 特性
    if ( target.ability.isName( 'しろいけむり' ) ) return;
    if ( target.ability.isName( 'クリアボディ' ) ) return;
    if ( target.ability.isName( 'メタルプロテクト' ) ) return;
    if ( isExistAbilityOneSide( target.isMe, 'フラワーベール' ) && getPokemonType( target ).includes( 'GRASS' ) ) return;
    if ( target.ability.isName( 'ミラーアーマー' )) {
      changeTargetRank( target, pokemon, parameter, change );
      return;
    }
    // 個別のパラメーター
    if ( parameter === 'attack' ) {
      if ( target.ability.isName( 'かいりきバサミ' ) ) return;
    }
    if ( parameter === 'defense' ) {
      if ( target.ability.isName( 'はとむね' ) ) return;
    }
    if ( parameter === 'accuracy' ) {
      if ( target.ability.isName( 'するどいめ' ) ) return;
    }
  }

  // ランク変化
  //target.status.rank[parameter].add( value );

  // メッセージ
  if ( value >= 3 )   writeLog( `${getArticle( target )}の ${parameterJP}が ぐぐーんと上がった!` );
  if ( value === 2 )  writeLog( `${getArticle( target )}の ${parameterJP}が ぐーんと上がった!` );
  if ( value === 1 )  writeLog( `${getArticle( target )}の ${parameterJP}が 上がった!` );
  if ( value === -1 ) writeLog( `${getArticle( target )}の ${parameterJP}が 下がった!` );
  if ( value === -2 ) writeLog( `${getArticle( target )}の ${parameterJP}が がくっと下がった!` );
  if ( value <= -3 )  writeLog( `${getArticle( target )}の ${parameterJP}が がくーんと下がった!` );

  // まけんき・かちき
  if ( value < 0 ) {
    if ( target.ability.isName( 'まけんき' ) ) {
      changeMyRank( target, 'attack', 2 );
    }
    if ( target.ability.isName( 'かちき' ) ) {
      changeMyRank( target, 'specialAttack', 2 );
    }
  }
}

function changeMyRank( pokemon: Pokemon, parameter: string, change: number ): void {

  let value: number = getRankVariation( pokemon, parameter, change );
  const parameterJP: string = translateENintoJP( parameter );

  if ( value === 0 ) {
    if ( change > 0 ) writeLog( `${getArticle( pokemon )}の ${parameterJP}は もう上がらない!` );
    if ( change < 0 ) writeLog( `${getArticle( pokemon )}の ${parameterJP}は もう下がらない!` );
    return;
  }

  // ランク変化
  //pokemon.rank[parameter].add( value );

  // メッセージ
  if ( value >= 3 )   writeLog( `${getArticle( pokemon )}の ${parameterJP}が ぐぐーんと上がった!` );
  if ( value === 2 )  writeLog( `${getArticle( pokemon )}の ${parameterJP}が ぐーんと上がった!` );
  if ( value === 1 )  writeLog( `${getArticle( pokemon )}の ${parameterJP}が 上がった!` );
  if ( value === -1 ) writeLog( `${getArticle( pokemon )}の ${parameterJP}が 下がった!` );
  if ( value === -2 ) writeLog( `${getArticle( pokemon )}の ${parameterJP}が がくっと下がった!` );
  if ( value <= -3 )  writeLog( `${getArticle( pokemon )}の ${parameterJP}が がくーんと下がった!` );
}

function changeMyRankByItem( pokemon: Pokemon, parameter: string, change: number, item: string ): void {

  let value: number = getRankVariation( pokemon, parameter, change );
  const parameterJP: string = translateENintoJP( parameter );

  if ( value === 0 ) {
    if ( change > 0 ) writeLog( `${getArticle( pokemon )}の ${parameterJP}は もう上がらない!` );
    if ( change < 0 ) writeLog( `${getArticle( pokemon )}の ${parameterJP}は もう下がらない!` );
    return;
  }

  // ランク変化
  //pokemon.rank[parameter].add( value );

  // メッセージ
  if ( value >= 3 )   writeLog( `${getArticle( pokemon )}は ${item}で ${parameterJP}が ぐぐーんと上がった!` );
  if ( value === 2 )  writeLog( `${getArticle( pokemon )}は ${item}で ${parameterJP}が ぐーんと上がった!` );
  if ( value === 1 )  writeLog( `${getArticle( pokemon )}は ${item}で ${parameterJP}が 上がった!` );
  if ( value === -1 ) writeLog( `${getArticle( pokemon )}は ${item}で ${parameterJP}が 下がった!` );
  if ( value === -2 ) writeLog( `${getArticle( pokemon )}は ${item}で ${parameterJP}が がくっと下がった!` );
  if ( value <= -3 )  writeLog( `${getArticle( pokemon )}は ${item}で ${parameterJP}が がくーんと下がった!` );

  // なげつける・むしくい・ついばむ
  if ( pokemon.stateChange.memo.isTrue === true ) {
    pokemon.stateChange.memo.count += 1;
  }
}

function changeMyRankByRage( pokemon: Pokemon, parameter: string, change: number ): void {

  let value: number = getRankVariation( pokemon, parameter, change );

  if ( value === 0 ) return;

  // ランク変化
  //pokemon.rank[parameter].add( value );

  // メッセージ
  writeLog( `${pokemon}の いかりのボルテージが 上がっていく!` );
}

function getRankVariation( pokemon: Pokemon, parameter: string, value: number ): number {

  let result: number = value;

  if ( pokemon.ability.isName( 'たんじゅん' ) ) {
    result = result * 2;
  }
  if ( pokemon.ability.isName( 'あまのじゃく' ) ) {
    result = 0 - result;
  }

  if ( result > 0 ) {
    //result = Math.min( result, 6 - pokemon.rank[parameter].value )
  }
  if ( result < 0 ) {
    //result = -1 * Math.min( Math.abs( result ), 6 + pokemon.rank[parameter].value )
  }

  return result
}
