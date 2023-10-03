// 技の追加効果によるHP変化
function changeHPByMove( pokemon: Pokemon, target: Pokemon, change: number ): void {

  let value: number = change;

  if ( pokemon.item.isName( 'おおきなねっこ' ) === true ) {
    value = fiveRoundEntry( value * 5324 / 4096 );
  }

  if ( target.ability.isName( 'ヘドロえき' ) ) {
    if ( pokemon.ability.isName( 'マジックガード' ) ) return;

    // HP減少
    pokemon.status.hitPoint.value.add( -1 * value );
    // メッセージ
    target.declareAbility();
    writeLog( `${getArticle( pokemon )}は ヘドロえきを 吸い取った!` );
  } else {
    if ( pokemon.status.hitPoint.value.isMax() ) return;
    if ( pokemon.stateChange.healBlock.isTrue === true ) return;

    // HP回復
    pokemon.status.hitPoint.value.add( value );

    // メッセージ
    writeLog( `${getArticle( target )}から 体力を 吸い取った!` );
  }
}

// きのみを食べることによるHP回復
function changeHPByBerry( pokemon: Pokemon, item: string ): void {

  if ( pokemon.status.hitPoint.value.isMax() ) return;
  if ( pokemon.stateChange.healBlock.isTrue === true ) return;

  const ripen: number = ( pokemon.ability.isName( 'じゅくせい' ) )? 2 : 1;
  const dynamax: number = ( pokemon.stateChange.dynamax.isTrue )? 0.5 : 1;

  let value: number = 0;

  if ( item === 'オレンのみ' ) {
    value = 10 * ripen
  }
  if ( item === 'オボンのみ' ) {
    value = Math.floor( ( pokemon.status.hitPoint.actual * dynamax ) / 4 ) * ripen;
  }
  if ( item === 'フィラのみ' || item === 'ウイのみ' || item === 'マゴのみ' || item === 'バンジのみ' || item === 'イアのみ' ) {
    value = Math.floor( ( pokemon.status.hitPoint.actual * dynamax ) / 3 ) * ripen;
  }
  if ( item === 'ナゾのみ' ) {
    value = Math.floor( ( pokemon.status.hitPoint.actual * dynamax ) / 4 ) * ripen;
  }

  // HP回復
  pokemon.status.hitPoint.value.add( value );

  // メッセージ
  writeLog( `${getArticle( pokemon )}は ${item}で 体力を 回復した!` );

  // なげつける・むしくい・ついばむ
  if ( pokemon.stateChange.memo.isTrue === true ) {
    pokemon.stateChange.memo.count += 1;
  }
}

// アイテムによるHP変化
function changeHPByItem( pokemon: Pokemon, item: string, damage: number ): void {

  if ( item === 'いのちのたま' ) {
    // ダメージ
    pokemon.status.hitPoint.value.add( -1 * damage );
    // メッセージ
    writeLog( `${getArticle( pokemon )}は 命が 少し削られた!` );
  }

  if ( item === 'かいがらのすず' ) {
    // HP回復
    pokemon.status.hitPoint.value.add( damage );
    // メッセージ
    writeLog( `${getArticle( pokemon )}は かいがらのすずで 少し 回復` );
  }

  if ( item === 'きのみジュース' ) {
    // HP回復
    pokemon.status.hitPoint.value.add( damage );
    // メッセージ
    writeLog( `${getArticle( pokemon )}は ${item}で 体力を 回復した!` );
  }
}

// HP変化
function changeHPByAbility( pokemon: Pokemon, value: number, sign: SignType ): void {

  if ( sign === '-' ) {
    // ダメージ
    pokemon.status.hitPoint.value.add( -1 * value );
  }
  if ( sign === '+' ) {
    if ( pokemon.status.hitPoint.value.isMax() ) return;
    if ( pokemon.stateChange.healBlock.isTrue === true ) return;

    pokemon.declareAbility();

    // HP回復
    pokemon.status.hitPoint.value.add( value );

    // メッセージ
    writeLog( `${getArticle( pokemon )}の 体力が 回復した!` );
  }
}

// ほおぶくろ
function activateCheekPouch( pokemon: Pokemon ): void {

  if ( !pokemon.ability.isName( 'ほおぶくろ' ) ) return;

  const dynamax: number = ( pokemon.stateChange.dynamax.isTrue )? 0.5 : 1;
  const value: number = Math.floor( pokemon.status.hitPoint.actual * dynamax / 3 );
  changeHPByAbility( pokemon, value, '+' );
}
