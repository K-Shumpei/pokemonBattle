function moveEffect( pokemon: Pokemon ): void {

  if ( pokemon.moveUsed.category !== '変化' ) {
    // シングルバトルの場合
    if ( fieldStatus.battleStyle === 1 ) {
      const info: Target = pokemon.target[0];
      const target: Pokemon | false = getPokemonByID( info.trainer, info.battleNumber );
      if ( target === false ) return;

      // 対象全員へのダメージ計算
      calculateDamageForAll( pokemon, target );
      // じばく/だいばくはつ/ミストバースト/ビックリヘッド/てっていこうせん使用時のダメージ: ひんしになるときは使用者のひんし判定
      // ダメージを本体に与える
      damageToBody( target );
      // バツグンの相性判定のメッセージ
      goodCompatibilityMessage( pokemon, target );
      // 今ひとつの相性判定のメッセージ
      badCompatibilityMessage( pokemon, target );
      // ダメージの判定に関するメッセージ
      damageDeterminationMessage( pokemon, target );
      // ダメージをHP1で耐える効果のメッセージなど
      enduringEffectsMessage( target );
      // 追加効果などの発動
      activateAdditionalEffects( pokemon, target );
      // ダメージが発生したときの効果
    }
  }


}

// 対象全員へのダメージ計算
function calculateDamageForAll( pokemon: Pokemon, target: Pokemon ): void {

  // ばけのかわ/アイスフェイス
  if ( isAbility( target, 'ばけのかわ' ) === true ) {
    if ( target.stateChange.disguise.isTrue === true ) {
      return;
    }
  }
  if ( isAbility( target, 'アイスフェイス' ) === true ) {
    if ( target.stateChange.iceFace.isTrue === true && pokemon.moveUsed.category === '物理' ) {
      return;
    }
  }

  // ダメージ計算
  calculateDamage( pokemon, target );

  // ダメージ計算後の処理
  target.damage.damage = Math.max( target.damage.damage, 1 );
  target.damage.damage = target.damage.damage % 65536;
  target.damage.damage = Math.min( target.damage.damage, target.status.remainingHP );
  if ( isSubstitute( pokemon, target ) === true ) {
    target.damage.damage = Math.min( target.damage.damage, target.stateChange.substitute.number );
  }
  if ( isSubstitute( pokemon, target ) === false && target.damage.damage === target.status.remainingHP ) {
    if ( target.stateChange.endure.isTrue === true ) {
      target.damage.damage -= 1;
      target.stateChange.endureMsg.isTrue === true;
      target.stateChange.endureMsg.text === 'こらえる';
      return;
    }
    if ( pokemon.moveUsed.name === 'みねうち' || pokemon.moveUsed.name === 'てかげん' ) {
      target.damage.damage -= 1;
      target.stateChange.endureMsg.isTrue === true;
      target.stateChange.endureMsg.text === pokemon.moveUsed.name;
      return;
    }
    if ( isAbility( target, 'がんじょう' ) === true ) {
      if ( target.status.remainingHP === target.actualValue.hitPoint ) {
        target.damage.damage -= 1;
        target.stateChange.endureMsg.isTrue === true;
        target.stateChange.endureMsg.text === 'がんじょう';
        return;
      }
    }
    if ( isItem( target, 'きあいのタスキ' ) === true ) {
      if ( target.status.remainingHP === target.actualValue.hitPoint ) {
        target.damage.damage -= 1;
        target.stateChange.endureMsg.isTrue === true;
        target.stateChange.endureMsg.text === 'きあいのタスキ';
        return;
      }
    }
    if ( isItem( target, 'きあいのタスキ' ) === true ) {
      if ( getRandom() < 10 ) {
        target.damage.damage -= 1;
        target.stateChange.endureMsg.isTrue === true;
        target.stateChange.endureMsg.text === 'きあいのハチマキ';
        return;
      }
    }
  }
}

// ダメージを本体に与える
function damageToBody( target: Pokemon ): void {

  target.status.remainingHP -= target.damage.damage;
}

// バツグンの相性判定のメッセージ
function goodCompatibilityMessage( pokemon: Pokemon, target: Pokemon ): void {

  if ( target.damage.effective <= 1 ) return;

  if ( pokemon.target.length === 1 ) {
    writeLog( `効果は バツグンだ!` );
  } else {
    writeLog( `${target.status.name}に 効果は バツグンだ!` );
  }
}

// 今ひとつの相性判定のメッセージ
function badCompatibilityMessage( pokemon: Pokemon, target: Pokemon ): void {

  if ( target.damage.effective >= 1 ) return;

  if ( pokemon.target.length === 1 ) {
    writeLog( `${target.status.name}に 効果は 今ひとつのようだ......` );
  } else {
    writeLog( `${target.status.name}に 効果は いまひとつだ` );
  }
}

// ダメージの判定に関するメッセージ
function damageDeterminationMessage( pokemon: Pokemon, target: Pokemon ): void {

  if ( target.damage.critical === true ) {
    if ( pokemon.target.length === 1 ) {
      writeLog( `急所に 当たった!` );
    } else {
      writeLog( `${target.status.name}の 急所に 当たった!` );
    }
  }
}

// ダメージをHP1で耐える効果のメッセージなど
function enduringEffectsMessage( target: Pokemon ): void {

  if ( target.stateChange.endureMsg.isTrue === false ) return;

  if ( target.stateChange.encore.text === 'こらえる' ) {
    writeLog( `${target.status.name}は 攻撃を こらえた!` );
  }
  if ( target.stateChange.encore.text === 'がんじょう' ) {
    target.status.declareAbility();
    writeLog( `${target.status.name}は 攻撃を こらえた!` );
  }
  if ( target.stateChange.encore.text === 'きあいのタスキ' ) {
    recycleAvailable( target );
    writeLog( `${target.status.name}は きあいのタスキで 持ちこたえた!` );
  }
  if ( target.stateChange.encore.text === 'きあいのハチマキ' ) {
    writeLog( `${target.status.name}は きあいのハチマキで 持ちこたえた!` );
  }

  target.stateChange.endureMsg.reset();
}

// 追加効果などの発動
function activateAdditionalEffects( pokemon: Pokemon, target: Pokemon ): void {

  if ( pokemon.moveUsed.name === 'なげつける' ) {
    recycleAvailable( pokemon );
  }

  for ( const move of additionalEffectTargetRank ) {
    if ( move.name === pokemon.moveUsed.name ) {
      if ( getRandom() >= move.rate ) break;
      for ( const parameter of Object.keys( move.change ) ) {
        changeRank( pokemon, target, parameter, move.change[parameter], 'additional' );
      }
    }
  }
  for ( const move of additionalEffectMyRank ) {
    if ( move.name === pokemon.moveUsed.name ) {
      if ( getRandom() >= move.rate ) break;
      for ( const parameter of Object.keys( move.change ) ) {
        changeRank( pokemon, target, parameter, move.change[parameter], 'additional' );
      }
    }
  }
  for ( const move of additionalEffectAilment ) {
    if ( move.name === pokemon.moveUsed.name ) {
      if ( getRandom() >= move.rate ) break;
      giveAilment( pokemon, target, move.ailment, 'additional' );
    }
  }
}
