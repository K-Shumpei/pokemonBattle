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
    if ( fieldStatus.getSide( target.trainer ).mist.isTrue === true ) {
      if ( pokemon.stateChange.memo.text === 'わたげ' ) {
        const infiltrator: Pokemon | false = getPokemonByBattle( pokemon.stateChange.memo.target.trainer, pokemon.stateChange.memo.target.battle );
        if ( infiltrator === false ) break mist;
        if ( isAbility( infiltrator, 'すりぬけ' ) === true && infiltrator.trainer !== target.trainer ) {
          return;
        }
      } else {
        if ( isAbility( pokemon, 'すりぬけ' ) === true && pokemon.trainer !== target.trainer ) {
          return;
        }
      }
    }
    // 特性
    if ( isAbility( target, 'しろいけむり' ) === true ) return;
    if ( isAbility( target, 'クリアボディ' ) === true ) return;
    if ( isAbility( target, 'メタルプロテクト' ) === true ) return;
    if ( isExistAbilityOneSide( target.trainer, 'フラワーベール' ) && getPokemonType( target ).includes( 'くさ' ) ) return;
    if ( isAbility( target, 'ミラーアーマー' ) ) {
      changeTargetRank( target, pokemon, parameter, change );
      return;
    }
    // 個別のパラメーター
    if ( parameter === 'attack' ) {
      if ( isAbility( target, 'かいりきバサミ' ) ) return;
    }
    if ( parameter === 'defense' ) {
      if ( isAbility( target, 'はとむね' ) ) return;
    }
    if ( parameter === 'accuracy' ) {
      if ( isAbility( target, 'するどいめ' ) ) return;
    }
  }

  // ランク変化
  target.rank[parameter] += value;

  // メッセージ
  if ( value >= 3 )   writeLog( `${getArticle( target )}の ${parameterJP}が ぐぐーんと上がった!` );
  if ( value === 2 )  writeLog( `${getArticle( target )}の ${parameterJP}が ぐーんと上がった!` );
  if ( value === 1 )  writeLog( `${getArticle( target )}の ${parameterJP}が 上がった!` );
  if ( value === -1 ) writeLog( `${getArticle( target )}の ${parameterJP}が 下がった!` );
  if ( value === -2 ) writeLog( `${getArticle( target )}の ${parameterJP}が がくっと下がった!` );
  if ( value <= -3 )  writeLog( `${getArticle( target )}の ${parameterJP}が がくーんと下がった!` );

  // まけんき・かちき
  if ( value < 0 ) {
    if ( isAbility( target, 'まけんき' ) === true ) {
      changeMyRank( target, 'attack', 2 );
    }
    if ( isAbility( target, 'かちき' ) === true ) {
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
  pokemon.rank[parameter] += value;

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
  pokemon.rank[parameter] += value;

  // メッセージ
  if ( value >= 3 )   writeLog( `${getArticle( pokemon )}は ${item}で ${parameterJP}が ぐぐーんと上がった!` );
  if ( value === 2 )  writeLog( `${getArticle( pokemon )}は ${item}で ${parameterJP}が ぐーんと上がった!` );
  if ( value === 1 )  writeLog( `${getArticle( pokemon )}は ${item}で ${parameterJP}が 上がった!` );
  if ( value === -1 ) writeLog( `${getArticle( pokemon )}は ${item}で ${parameterJP}が 下がった!` );
  if ( value === -2 ) writeLog( `${getArticle( pokemon )}は ${item}で ${parameterJP}が がくっと下がった!` );
  if ( value <= -3 )  writeLog( `${getArticle( pokemon )}は ${item}で ${parameterJP}が がくーんと下がった!` );

  // なげつける
  if ( pokemon.stateChange.memo.isTrue === true ) {
    pokemon.stateChange.memo.count += 1;
  }
}

function changeMyRankByRage( pokemon: Pokemon, parameter: string, change: number ): void {

  let value: number = getRankVariation( pokemon, parameter, change );

  if ( value === 0 ) return;

  // ランク変化
  pokemon.rank[parameter] += value;

  // メッセージ
  writeLog( `${pokemon}の いかりのボルテージが 上がっていく!` );
}

function getRankVariation( pokemon: Pokemon, parameter: string, value: number ): number {

  let result: number = 0

  if ( isAbility( pokemon, 'たんじゅん' ) === true ) {
    result = value * 2;
  }
  if ( isAbility( pokemon, 'あまのじゃく' ) === true ) {
    result = 0 - value;
  }

  if ( result > 0 ) {
    result = Math.min( result, 6 - pokemon.rank[parameter] )
  }
  if ( result < 0 ) {
    result = -1 * Math.min( Math.abs( result ), 6 + pokemon.rank[parameter] )
  }

  return result
}
