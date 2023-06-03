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
function getValueWithRankCorrection( actualValue: number, rank: number, critical: boolean ): number {

  let thisRank = rank;
  let rankCorr = 1;

  if ( critical === true ) {
    thisRank = Math.max( thisRank, 0 );
  }

  if ( thisRank > 0 ) {
    rankCorr = ( 2 + thisRank ) / 2;
  } else {
    rankCorr = 2 / ( 2 - thisRank );
  }

  return Math.floor( actualValue * rankCorr );
}

// 天気
function isWeather( pokemon: Pokemon, weather: WeatherType ): boolean {

  for ( const pokemon of allPokemonInBattlefield() ) {
    if ( isAbility( pokemon, 'エアロック' ) === true ) {
      return false;
    }
    if ( isAbility( pokemon, 'ノーてんき' ) === true ) {
      return false;
    }
  }

  if ( weather === 'あめ' || weather === 'おおあめ' || weather === 'にほんばれ' || weather === 'おおひでり' ) {
    if ( isItem( pokemon, 'ばんのうがさ' ) === true ) {
      return false;
    }
  }

  if ( fieldStatus.weather.name === weather ) {
    return true;
  }

  if ( weather === 'あめ' ) {
    if ( fieldStatus.weather.name === 'おおあめ' ) {
      return true;
    }
  }

  if ( weather === 'にほんばれ' ) {
    if ( fieldStatus.weather.name === 'おおひでり' ) {
      return true;
    }
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
function getPokemonType( pokemon: Pokemon ): MoveTypeType[] {

  let result: MoveTypeType[] = [];

  if ( pokemon.status.type1 !== null ) {
    result.push( pokemon.status.type1 );
  }
  if ( pokemon.status.type2 !== null ) {
    result.push( pokemon.status.type2 );
  }

  if ( result.length === 0 ) {
    result.push( null );
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

// 片側の場の特性存在判定
 function isExistAbilityOneSide( trainer: 'me' | 'opp' , ability: string ): boolean {

  for ( const pokemon of allPokemonInSide( trainer ) ) {
    if ( isAbility( pokemon, ability ) === true ) {
      return true;
    }
  }
  return false;
 }

// みがわり
function isSubstitute( pokemon: Pokemon, target: Pokemon ): boolean {

  if ( target.stateChange.substitute.isTrue === false ) return false;
  if ( pokemon.moveUsed.name === 'いじげんホール' || pokemon.moveUsed.name === 'いじげんラッシュ' || pokemon.moveUsed.name === 'シャドースチール' ) return false;
  if ( pokemon.moveUsed.target === '全体の場' || pokemon.moveUsed.target === '相手の場' || pokemon.moveUsed.target === '味方の場' ) return false;
  if ( isAbility( pokemon, 'すりぬけ' ) === true ) {
    if ( pokemon.moveUsed.name === 'へんしん' || pokemon.moveUsed.name === 'フリーフォール' ) {
      ;
    } else {
      return false;
    }
  }
  if ( soundMoveList.includes( pokemon.moveUsed.name ) === true ) {
    if ( pokemon.moveUsed.name === 'とおぼえ' && pokemon.trainer === target.trainer && pokemon.order.battle === target.order.battle ) {
      ;
    } else {
      return false;
    }
  }

  return true;
}

// リサイクル
function recycleAvailable( pokemon: Pokemon ): void {

  if ( pokemon.status.item === null ) return;

  const item = pokemon.status.item;
  pokemon.status.item = null;

  if ( pokemon.stateChange.recycle.isTrue === true ) return;

  pokemon.stateChange.recycle.isTrue = true;
  pokemon.stateChange.recycle.text = item;

}

// ランク変化
function changeRank( pokemon: Pokemon, target: Pokemon, parameter: string, change: number, type: string ): void {

  let value: number = change;
  const parameterJP: string = translateENintoJP( parameter );

  if ( value === 0 ) return;

  if ( value < 0 ) {
    // 追加効果でランクが変化する場合
    if ( type === 'additional' ) {
      // 自分以外からランクを下げられない
      if ( pokemon.trainer !== target.trainer || pokemon.order.battle !== target.order.battle ) {
        // しんぴのまもり
        if ( fieldStatus.getSide( target.trainer ).mist.isTrue === true ) return;
        // 特性
        if ( isAbility( target, 'しろいけむり' ) === true ) return;
        if ( isAbility( target, 'クリアボディ' ) === true ) return;
        if ( isAbility( target, 'メタルプロテクト' ) === true ) return;
        if ( isExistAbilityOneSide( target.trainer, 'フラワーベール' ) && getPokemonType( target ).includes( 'くさ' ) ) return;
        if ( isAbility( target, 'ミラーアーマー' ) ) {
          changeRank( target, pokemon, parameter, change, '' );
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
    }
    /*
    // 自分以外からランクを下げられない
    if ( pokemon.trainer !== target.trainer || pokemon.order.battle !== target.order.battle ) {
      if ( fieldStatus.getSide( target.trainer ).mist.isTrue === true ) {
        if ( isMsg === false ) return;
        writeLog( `${target.status.name}は 白い霧に 守られている!` );
        return;
      }
      if ( isAbility( target, 'しろいけむり' ) || isAbility( target, 'クリアボディ' ) || isAbility( target, 'メタルプロテクト' ) ) {
        if ( isMsg === false ) return;
        target.status.declareAbility();
        writeLog( `${target.status.name}の 能力は 下がらない!` );
        return;
      }
      for ( const _pokemon of allPokemonInSide( target.trainer ) ) {
        if ( isAbility( _pokemon, 'フラワーベール' ) && getPokemonType( target ).includes( 'くさ' ) ) {
          if ( isMsg === false ) return;
          _pokemon.status.declareAbility();
          writeLog( `${target.status.name}は フラワーベールに 守られている!` );
          return;
        }
      }
      if ( isAbility( target, 'ミラーアーマー' ) ) {
        target.status.declareAbility();
        changeRank( target, pokemon, parameter, change );
        return;
      }

      if ( parameter === 'attack' ) {
        if ( isAbility( target, 'かいりきバサミ' ) ) {
          if ( isMsg === false ) return;
          target.status.declareAbility();
          writeLog( `${target.status.name}の 攻撃は 下がらない!` );
          return;
        }
      }
      if ( parameter === 'defense' ) {
        if ( isAbility( target, 'はとむね' ) ) {
          if ( isMsg === false ) return;
          target.status.declareAbility();
          writeLog( `${target.status.name}の 防御は 下がらない!` );
          return;
        }
      }
      if ( parameter === 'accuracy' ) {
        if ( isAbility( target, 'するどいめ' ) ) {
          if ( isMsg === false ) return;
          target.status.declareAbility();
          writeLog( `${target.status.name}の 命中は 下がらない!` );
          return;
        }
      }
    }
    */
  }

  if ( isAbility( target, 'たんじゅん' ) === true ) {
    value = value * 2;
  }
  if ( isAbility( target, 'あまのじゃく' ) === true ) {
    value = 0 - value;
  }

  // ランク変化
  target.rank[parameter] += value;

  // メッセージ
  if ( pokemon.moveUsed.name === 'はらだいこ' ) {
    writeLog( `体力を削って パワー全開!` );
    return;
  }
  if ( target.damage.critical === true && isAbility( target, 'いかりのつぼ' ) === true ) {
    writeLog( `${parameterJP}が 最大まで上がった` );
    return;
  }
  if ( value >= 3 ) writeLog( `${parameterJP}が ぐぐーんと上がった` );
  if ( value === 2 ) writeLog( `${parameterJP}が ぐーんと上がった` );
  if ( value === 1 ) writeLog( `${parameterJP}が 上がった` );
  if ( value === -1 ) writeLog( `${parameterJP}が 下がった` );
  if ( value === -2 ) writeLog( `${parameterJP}が がくっと下がった` );
  if ( value <= -3 ) writeLog( `${parameterJP}が がくーんと下がった` );

  // まけんき・かちき
  if ( value < 0 && pokemon.trainer !== target.trainer ) {
    if ( isAbility( target, 'まけんき' ) === true ) {
      changeRank( target, target, 'attack', 2, '' );
    }
    if ( isAbility( target, 'かちき' ) === true ) {
      changeRank( target, target, 'specialAttack', 2, '' );
    }
  }
}

// 状態異常変化
function giveAilment( pokemon: Pokemon, target: Pokemon, ailment: string, type: string ): void {

  // 追加効果で状態異常になる場合
  if ( type === 'additional' ) {
    // すでに状態異常
    if ( target.status.statusAilment.isTrue === true ) return;
    // しんぴのまもり
    if ( fieldStatus.getSide( target.trainer ).safeguard.isTrue === true ) {
      if ( isAbility( pokemon, 'すりぬけ' ) === false || pokemon.trainer === target.trainer ) return;
    }
    // ミストフィールド
    if ( fieldStatus.terrain.name === 'ミストフィールド' ) {
      if ( isGrounded( target ) === true ) return;
    }
    // 特性
    if ( isAbility( target, 'りんぷん' ) === true ) return;
    if ( isAbility( target, 'ぜったいねむり' ) === true ) return;
    if ( isAbility( target, 'リーフガード' ) === true  && isWeather( target, 'にほんばれ' ) ) return;
    if ( isAbility( target, 'リミットシールド' ) === true && target.status.name === 'メテノ(流星)' ) return;
    if ( isExistAbilityOneSide( target.trainer, 'フラワーベール' ) && getPokemonType( target ).includes( 'くさ' ) ) return;
    // 個別の無効化
    if ( ailment === 'まひ' ) {
      if ( getPokemonType( target ).includes( 'でんき' ) ) return;
    }
    if ( ailment === 'こおり' ) {
      if ( getPokemonType( target ).includes( 'こおり' ) ) return;
      if ( isWeather( target, 'にほんばれ' ) ) return;
      if ( isAbility( target, 'マグマのよろい' ) ) return;
    }
    if ( ailment === 'やけど' ) {
      if ( getPokemonType( target ).includes( 'ほのお' ) ) return;
      if ( isAbility( target, 'みずのベール' ) ) return;
      if ( isAbility( target, 'すいほう' ) ) return;
    }
    if ( ailment === 'どく' || ailment === 'もうどく' ) {
      if ( isAbility( target, 'めんえき' ) ) return;
      if ( isExistAbilityOneSide( target.trainer, 'パステルベール' ) ) return;
      if ( getPokemonType( target ).includes( 'どく' ) ) return;
      if ( getPokemonType( target ).includes( 'はがね' ) ) return;
    }
    if ( ailment === 'ねむり' ) {
      if ( isAbility( target, 'やるき' ) ) return;
      if ( isAbility( target, 'ふみん' ) ) return;
      if ( isExistAbilityOneSide( target.trainer, 'スイートベール' ) ) return;
      if ( fieldStatus.terrain.name === 'エレキフィールド' && isGrounded( target ) ) return;
      for ( const _pokemon of allPokemonInBattlefield() ) {
        if ( _pokemon.stateChange.uproar.isTrue === true ) return;
      }
    }

    // 状態異常になる
    target.status.statusAilment.isTrue = true;
    target.status.statusAilment.name = ailment;

    // メッセージ
    if ( ailment === 'まひ' ) writeLog( `${target.status.name}は まひして 技が でにくくなった!` );
    if ( ailment === 'こおり' ) writeLog( `${target.status.name}は 凍りついた!` );
    if ( ailment === 'やけど' ) writeLog( `${target.status.name}は やけどを 負った!` );
    if ( ailment === 'どく' ) writeLog( `${target.status.name}は 毒を あびた!` );
    if ( ailment === 'もうどく' ) writeLog( `${target.status.name}は 猛毒を あびた!` );
    if ( ailment === 'ねむり' ) writeLog( `${target.status.name}は 眠ってしまった!` );
  }
}

// こんらん
function giveConfuse( pokemon: Pokemon, target: Pokemon, type: string ): void {

  // 追加効果で状態異常になる場合
  if ( type === 'additional' ) {
    // しんぴのまもり
    if ( fieldStatus.getSide( target.trainer ).safeguard.isTrue === true ) {
      if ( isAbility( pokemon, 'すりぬけ' ) === false || pokemon.trainer === target.trainer ) return;
    }
    // ミストフィールド
    if ( fieldStatus.terrain.name === 'ミストフィールド' ) {
      if ( isGrounded( target ) === true ) return;
    }
    // 特性
    if ( isAbility( target, 'マイペース' ) ) return;
  }
}
