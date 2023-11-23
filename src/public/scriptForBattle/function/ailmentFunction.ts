// 状態異常変化
function giveAilment( pokemon: Pokemon, target: Pokemon, ailment: StatusAilmentText, isOtherMsg?: boolean ): boolean {

  if ( ailment === null ) return false;

  // すでに状態異常
  if ( !target.statusAilment.isHealth() ) return false;
  // しんぴのまもり
  if ( fieldStatus.getSide( target.isMe ).safeguard.isTrue === true ) {
    if ( pokemon.ability.isName( 'すりぬけ' ) || pokemon.isMe === target.isMe ) return false;
  }
  // ミストフィールド
  if ( fieldStatus.terrain.isMisty() ) {
    if ( target.isGround() === true ) return false;
  }
  // 特性
  if ( target.ability.isName( 'りんぷん' ) ) return false;
  if ( target.ability.isName( 'きよめのしお' ) ) return false;
  if ( target.ability.isName( 'ぜったいねむり' ) ) return false;
  if ( target.ability.isName( 'リーフガード' )  && fieldStatus.weather.isSunny( target ) ) return false;
  if ( target.ability.isName( 'リミットシールド' ) && target.name === 'メテノ(流星)' ) return false;
  if ( isExistAbilityOneSide( target.isMe, 'フラワーベール' ) && target.type.has( 'Grass' ) ) return false;
  // 個別の無効化
  if ( ailment === 'PARALYSIS' ) {
    if ( target.type.has( 'Electric' ) ) return false;
  }
  if ( ailment === 'FROZEN' ) {
    if ( target.type.has( 'Ice' ) ) return false;
    if ( fieldStatus.weather.isSunny( target ) ) return false;
    if ( target.ability.isName( 'マグマのよろい' ) ) return false;
  }
  if ( ailment === 'BURNED' ) {
    if ( target.type.has( 'Fire' ) ) return false;
    if ( target.ability.isName( 'みずのベール' ) ) return false;
    if ( target.ability.isName( 'すいほう' ) ) return false;
  }
  if ( ailment === 'POISONED' ) {
    if ( target.ability.isName( 'めんえき' ) ) return false;
    if ( isExistAbilityOneSide( target.isMe, 'パステルベール' ) ) return false;
    if ( target.type.has( 'Poison' ) ) return false;
    if ( target.type.has( 'Steel' ) ) return false;
  }
  if ( ailment === 'ASLEEP' ) {
    if ( target.ability.isName( 'やるき' ) ) return false;
    if ( target.ability.isName( 'ふみん' ) ) return false;
    if ( isExistAbilityOneSide( target.isMe, 'スイートベール' ) ) return false;
    if ( fieldStatus.terrain.isElectric() && target.isGround() ) return false;
    for ( const _pokemon of allPokemonInBattlefield() ) {
      if ( _pokemon.stateChange.uproar.isTrue === true ) return false;
    }
  }

  // 状態異常になる
  // target.statusAilment.name = ailment;

  // シンクロ用
  if ( target.ability.isName( 'シンクロ' ) ) {
    target.stateChange.synchronize.isTrue = true;
    target.stateChange.synchronize.text = ailment;
  }

  // 特殊メッセージ
  if ( isOtherMsg === true ) {
    return true;
  }

  // メッセージ
  if ( ailment === 'PARALYSIS' ) {
    writeLog( `${getArticle( target )}は まひして 技が でにくくなった!` );
  }
  if ( ailment === 'FROZEN' ) {
    writeLog( `${getArticle( target )}は 凍りついた!` );
  }
  if ( ailment === 'BURNED' ) {
    writeLog( `${getArticle( target )}は やけどを 負った!` );
  }
  if ( ailment === 'POISONED' ) {
    writeLog( `${getArticle( target )}は 毒を あびた!` );
  }
  /*
  if ( ailment === 'sp-poisoned' ) {
    writeLog( `${getArticle( target )}は 猛毒を あびた!` );
  }
  */
  if ( ailment === 'ASLEEP' ) {
    writeLog( `${getArticle( target )}は 眠ってしまった!` );
  }

  return false;
}

// くちばしキャノンによるやけど
function giveAilmentByBeakBlast( pokemon: Pokemon, target: Pokemon ): void {

  // すでに状態異常
  if ( !target.statusAilment.isHealth() ) return;
  // しんぴのまもり
  if ( fieldStatus.getSide( target.isMe ).safeguard.isTrue === true ) {
    if ( !pokemon.ability.isName( 'すりぬけ' ) || pokemon.isMe === target.isMe ) return;
  }
  // ミストフィールド
  if ( fieldStatus.terrain.isMisty() ) {
    if ( target.isGround() === true ) return;
  }
  // 特性
  if ( target.ability.isName( 'りんぷん' ) ) return;
  if ( target.ability.isName( 'きよめのしお' ) ) return;
  if ( target.ability.isName( 'ぜったいねむり' ) ) return;
  if ( target.ability.isName( 'リーフガード' )  && fieldStatus.weather.isSunny( target ) ) return;
  if ( target.ability.isName( 'リミットシールド' ) && target.name === 'メテノ(流星)' ) return;
  if ( isExistAbilityOneSide( target.isMe, 'フラワーベール' ) && target.type.has( 'Grass' ) ) return;

  if ( target.type.has( 'Fire' ) ) return;
  if ( target.ability.isName( 'みずのベール' ) ) return;
  if ( target.ability.isName( 'すいほう' ) ) return;

  // 状態異常になる
  target.statusAilment.getBurned( target.getArticle() );

  // メッセージ
  writeLog( `${getArticle( target )}は やけどを 負った!` );
}

// こんらん
function giveConfuse( pokemon: Pokemon, target: Pokemon, type: string ): void {

  if ( target.stateChange.confuse.isTrue === true ) return;

  // 追加効果で状態異常になる場合
  if ( type === 'additional' ) {
    // しんぴのまもり
    if ( fieldStatus.getSide( target.isMe ).safeguard.isTrue === true ) {
      if ( !pokemon.ability.isName( 'すりぬけ' ) || pokemon.isMe === target.isMe ) return;
    }
    // ミストフィールド
    if ( fieldStatus.terrain.isMisty() ) {
      if ( target.isGround() === true ) return;
    }
    // 特性
    if ( target.ability.isName( 'マイペース' ) ) return;
  }

  // アイテムによる
  if ( type === 'item' ) {
    // ミストフィールド
    if ( fieldStatus.terrain.isMisty() ) {
      if ( target.isGround() === true ) return;
    }
    // 特性
    if ( target.ability.isName( 'マイペース' ) ) return;
  }

  // こんらん状態になる
  const turn: number = Math.floor( getRandom() * 0.04 ) + 2; // 2,3,4,5のいずれか
  target.stateChange.confuse.isTrue = true;
  target.stateChange.confuse.turn = turn;

  // メッセージ
  writeLog( `${getArticle( target )}は 混乱した!`)
}

function giveConfuseByItem( pokemon: Pokemon, item: string ): void {

  /*
  if ( item === 'フィラのみ' ) {
    for ( const nature of natureData ) {
      if ( nature.name === pokemon.nature && nature.minus === 'attack' ) {
        giveConfuse( pokemon, pokemon, 'item' );
      }
    }
  }
  if ( item === 'ウイのみ' ) {
    for ( const nature of natureData ) {
      if ( nature.name === pokemon.nature && nature.minus === 'specialAttack' ) {
        giveConfuse( pokemon, pokemon, 'item' );
      }
    }
  }
  if ( item === 'マゴのみ' ) {
    for ( const nature of natureData ) {
      if ( nature.name === pokemon.nature && nature.minus === 'speed' ) {
        giveConfuse( pokemon, pokemon, 'item' );
      }
    }
  }
  if ( item === 'バンジのみ' ) {
    for ( const nature of natureData ) {
      if ( nature.name === pokemon.nature && nature.minus === 'specialDefense' ) {
        giveConfuse( pokemon, pokemon, 'item' );
      }
    }
  }
  if ( item === 'イアのみ' ) {
    for ( const nature of natureData ) {
      if ( nature.name === pokemon.nature && nature.minus === 'defense' ) {
        giveConfuse( pokemon, pokemon, 'item' );
      }
    }
  }
  */
}

// こんらんの回復
function cureConfuseByItem( pokemon: Pokemon, item: string ): void {

  if ( pokemon.stateChange.confuse.isTrue === false ) return;

  pokemon.stateChange.confuse.reset();
  writeLog( `${getArticle( pokemon )}は ${item}で 混乱が 治った!`);

  // なげつける
  pokemon.stateChange.memo.isTrue = true;
}

// きのみによる回復
function cureAilmentByItem( pokemon: Pokemon, ailment: StatusAilmentText, item: string ): void {

  if ( item === 'ラムのみ' ) {
    if ( pokemon.statusAilment.isHealth() ) {
      return;
    }
  } else {
    //if ( ailment !== pokemon.statusAilment.name ) {
      //return;
    //}
  }

  // 状態異常回復
  pokemon.statusAilment.getHealth();

  // メッセージ
  if ( ailment === 'PARALYSIS' ) {
    writeLog( `${getArticle( pokemon )}は ${item}で まひが 治った!` );
  }
  if ( ailment === 'ASLEEP' ) {
    writeLog( `${getArticle( pokemon )}は ${item}で 目を 覚ました!` );
  }
  if ( ailment === 'POISONED' ) {
    writeLog( `${getArticle( pokemon )}は ${item}で 毒が 治った!` );
  }
  if ( ailment === 'BURNED' ) {
    writeLog( `${getArticle( pokemon )}は ${item}で やけどが 治った!` );
  }
  if ( ailment === 'FROZEN' ) {
    writeLog( `${getArticle( pokemon )}は ${item}で こおり状態が 治った!` );
  }

  // なげつける・むしくい・ついばむ
  if ( pokemon.stateChange.memo.isTrue === true ) {
    pokemon.stateChange.memo.count += 1;
  }
}

function cureAilment( pokemon: Pokemon, ailment: StatusAilmentText ): void {

  // if ( pokemon.statusAilment.name !== ailment ) return;

  // 状態異常回復
  pokemon.statusAilment.getHealth();

  // メッセージ
  if ( ailment === 'PARALYSIS' ) {
    writeLog( `${getArticle( pokemon )}は まひが 治った!` );
  }
  if ( ailment === 'ASLEEP' ) {
    writeLog( `${getArticle( pokemon )}は 目を 覚ました!` );
  }
  if ( ailment === 'POISONED' ) {
    writeLog( `${getArticle( pokemon )}は 毒が 治った!` );
  }
  if ( ailment === 'BURNED' ) {
    writeLog( `${getArticle( pokemon )}は やけどが 治った!` );
  }
  if ( ailment === 'FROZEN' ) {
    writeLog( `${getArticle( pokemon )}は こおり状態が 治った!` );
  }
}
