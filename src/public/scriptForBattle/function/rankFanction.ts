function changeMyRank( pokemon: Pokemon, parameter: string, change: number ): void {

  let value: number = getRankVariation( pokemon, parameter, change );
  const parameterJP: string = translateENintoJP( parameter );

  if ( value === 0 ) {
    if ( change > 0 ) battleLog.write( `${getArticle( pokemon )}の ${parameterJP}は もう上がらない!` );
    if ( change < 0 ) battleLog.write( `${getArticle( pokemon )}の ${parameterJP}は もう下がらない!` );
    return;
  }

  // ランク変化
  //pokemon.rank[parameter].add( value );

  // メッセージ
  if ( value >= 3 )   battleLog.write( `${getArticle( pokemon )}の ${parameterJP}が ぐぐーんと上がった!` );
  if ( value === 2 )  battleLog.write( `${getArticle( pokemon )}の ${parameterJP}が ぐーんと上がった!` );
  if ( value === 1 )  battleLog.write( `${getArticle( pokemon )}の ${parameterJP}が 上がった!` );
  if ( value === -1 ) battleLog.write( `${getArticle( pokemon )}の ${parameterJP}が 下がった!` );
  if ( value === -2 ) battleLog.write( `${getArticle( pokemon )}の ${parameterJP}が がくっと下がった!` );
  if ( value <= -3 )  battleLog.write( `${getArticle( pokemon )}の ${parameterJP}が がくーんと下がった!` );
}

function changeMyRankByItem( pokemon: Pokemon, parameter: string, change: number, item: string ): void {

  let value: number = getRankVariation( pokemon, parameter, change );
  const parameterJP: string = translateENintoJP( parameter );

  if ( value === 0 ) {
    if ( change > 0 ) battleLog.write( `${getArticle( pokemon )}の ${parameterJP}は もう上がらない!` );
    if ( change < 0 ) battleLog.write( `${getArticle( pokemon )}の ${parameterJP}は もう下がらない!` );
    return;
  }

  // ランク変化
  //pokemon.rank[parameter].add( value );

  // メッセージ
  if ( value >= 3 )   battleLog.write( `${getArticle( pokemon )}は ${item}で ${parameterJP}が ぐぐーんと上がった!` );
  if ( value === 2 )  battleLog.write( `${getArticle( pokemon )}は ${item}で ${parameterJP}が ぐーんと上がった!` );
  if ( value === 1 )  battleLog.write( `${getArticle( pokemon )}は ${item}で ${parameterJP}が 上がった!` );
  if ( value === -1 ) battleLog.write( `${getArticle( pokemon )}は ${item}で ${parameterJP}が 下がった!` );
  if ( value === -2 ) battleLog.write( `${getArticle( pokemon )}は ${item}で ${parameterJP}が がくっと下がった!` );
  if ( value <= -3 )  battleLog.write( `${getArticle( pokemon )}は ${item}で ${parameterJP}が がくーんと下がった!` );

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
  battleLog.write( `${pokemon}の いかりのボルテージが 上がっていく!` );
}

function getRankVariation( pokemon: Pokemon, parameter: string, value: number ): number {
  /*
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
  */
 return 0;
}
