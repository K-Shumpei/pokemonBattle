function moveEffect( pokemon: Pokemon ): void {

  // 範囲攻撃技
  const isRange = ( pokemon: Pokemon ): boolean => {
    return pokemon.move.selected.getMaster().target === 'all-opponents'
      || pokemon.move.selected.getMaster().target === 'all-other-pokemon';
  }

  if ( !pokemon.move.selected.isStatus() ) {
    // 対象全員へのダメージ計算
    calculateDamageForAll( pokemon );

    if ( isRange( pokemon ) ) {
      // みがわり状態に攻撃技が防がれたときの効果: 本体がダメージを受けたとき(4)~(10)などより優先して処理される

    }

    // じばく/だいばくはつ/ミストバースト/ビックリヘッド/てっていこうせん使用時のダメージ: ひんしになるときは使用者のひんし判定


    if ( isRange( pokemon ) ) {
      // ダメージを本体に与える
      damageToBody( pokemon, pokemon.isMine() );
      // バツグンの相性判定のメッセージ
      goodCompatibilityMessage( pokemon, pokemon.isMine() );
      // 今ひとつの相性判定のメッセージ
      badCompatibilityMessage( pokemon, pokemon.isMine() );
      // ダメージの判定に関するメッセージ
      damageDeterminationMessage( pokemon, pokemon.isMine() );
      // ダメージをHP1で耐える効果のメッセージなど
      enduringEffectsMessage( pokemon, pokemon.isMine() );
      // 追加効果などの発動
      activateAdditionalEffects( pokemon, pokemon.isMine(), isRange( pokemon ) );
      // ダメージが発生したときの効果
      effectsWhenDamageOccurs( pokemon, pokemon.isMine() );
      // ひんし判定
      faintingJudgment( pokemon, pokemon.isMine(), isRange( pokemon ) );
      // ひんしできんちょうかん/かがくへんかガスが解除されたことによる封じられていた効果の発動
      activateSealedEffects( pokemon, pokemon.isMine(), isRange( pokemon ) );
    }
    // ダメージを本体に与える
    damageToBody( pokemon, !pokemon.isMine() );
    // バツグンの相性判定のメッセージ
    goodCompatibilityMessage( pokemon, !pokemon.isMine() );
    // 今ひとつの相性判定のメッセージ
    badCompatibilityMessage( pokemon, !pokemon.isMine() );
    // ダメージの判定に関するメッセージ
    damageDeterminationMessage( pokemon, !pokemon.isMine() );
    // ダメージをHP1で耐える効果のメッセージなど
    enduringEffectsMessage( pokemon, !pokemon.isMine() );
    // 追加効果などの発動
    activateAdditionalEffects( pokemon, !pokemon.isMine(), isRange( pokemon ) );
    // ダメージが発生したときの効果
    effectsWhenDamageOccurs( pokemon, !pokemon.isMine() );
    // ひんし判定
    faintingJudgment( pokemon, !pokemon.isMine(), isRange( pokemon ) );
    // ひんしできんちょうかん/かがくへんかガスが解除されたことによる封じられていた効果の発動
    activateSealedEffects( pokemon, !pokemon.isMine(), isRange( pokemon ) );
  }

  // 技の効果
  activateMoveEffect( pokemon );
  // 特性の効果（その1）
  activateAbilityEffectPart1( pokemon );
  // 防御側の持ち物の効果 (その3)
  targetItemEffectPart3( pokemon );
  // いにしえのうた/きずなへんげによるフォルムチェンジ
  formChangeByMove( pokemon );
  // いのちのたまの反動/かいがらのすずの回復
  lifeOrbShellBell( pokemon );
  // 防御側の持ち物の効果 (その4)
  targetItemEffectPart4( pokemon );
  // わるいてぐせ
  activatePickpocket( pokemon );
  // 技の効果
  otherEffect( pokemon );
  // 攻撃側の持ち物の効果
  myItemEffect( pokemon );

}

// 対象全員へのダメージ計算
function calculateDamageForAll( pokemon: Pokemon ): void {

  const getFinalDamage = ( pokemon: Pokemon, target: Pokemon, attack: Attack, calcDamage: number): number => {

    let result: number = calcDamage;

    result = Math.max( result, 1 );
    result = result % 65536;
    result = Math.min( result, target.status.hp.value.value );

    if ( attack.substitute ) {
      return Math.min( result, target.stateChange.substitute.count );
    }

    if ( result !== target.status.hp.value.value ) {
      return result;
    }

    if ( target.stateChange.endure.isTrue ) {
      target.stateChange.endureMsg.isTrue === true;
      target.stateChange.endureMsg.text === 'こらえる';
      return result - 1;
    }

    if ( pokemon.move.selected.isName( 'みねうち' ) || pokemon.move.selected.isName( 'てかげん' ) ) {
      target.stateChange.endureMsg.isTrue === true;
      target.stateChange.endureMsg.text === pokemon.move.selected.name;
      return result - 1;
    }

    if ( pokemon.ability.isName( 'がんじょう' ) ) {
      if ( target.status.hp.value.isMax() ) {
        target.stateChange.endureMsg.isTrue === true;
        target.stateChange.endureMsg.text === 'がんじょう';
        return result - 1;
      }
    }

    if ( target.item.isName( 'きあいのタスキ' ) ) {
      if ( target.status.hp.value.isMax() ) {
        target.stateChange.endureMsg.isTrue === true;
        target.stateChange.endureMsg.text === 'きあいのタスキ';
        return result - 1;
      }
    }

    if ( target.item.isName( 'きあいのタスキ' ) ) {
      if ( getRandom() < 10 ) {
        target.stateChange.endureMsg.isTrue === true;
        target.stateChange.endureMsg.text === 'きあいのハチマキ';
        return result - 1;
      }
    }

    return result;
  }

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    // ばけのかわ/アイスフェイス
    if ( !attack.substitute ) {
      if ( target.isName( 'ミミッキュ(化けた姿)' ) && target.ability.isName( 'ばけのかわ' ) ) {
        target.stateChange.disguise.isTrue = true;
        continue;
      }
      if ( target.isName( 'コオリッポ(アイス)' ) && target.ability.isName( 'アイスフェイス' ) && pokemon.move.selected.isPhysical()  ) {
        target.stateChange.iceFace.isTrue = true;
        continue;
      }
    }

    // ダメージ計算
    const calcDamage: number = calculateDamage( pokemon, target, attack );

    // ダメージ計算後の処理
    attack.damage = getFinalDamage( pokemon, target, attack, calcDamage );
  }
}

// ダメージを本体に与える
function damageToBody( pokemon: Pokemon, isMe: boolean ): void {

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );
    if ( target.isMine() !== isMe ) continue;

    target.status.hp.value.sub( attack.damage );
    target.msgDamage( attack.damage );
  }
}

// バツグンの相性判定のメッセージ
function goodCompatibilityMessage( pokemon: Pokemon, isMe: boolean ): void {

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );
    if ( target.isMine() !== isMe ) continue;
    if ( attack.effective <= 1 ) continue;

    pokemon.msgSuperEffective( target.getArticle() );
  }
}

// 今ひとつの相性判定のメッセージ
function badCompatibilityMessage( pokemon: Pokemon, isMe: boolean ): void {

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );
    if ( target.isMine() !== isMe ) continue;
    if ( attack.effective >= 1 ) return;

    pokemon.msgNotEffective( target.getArticle() );
  }
}

// ダメージの判定に関するメッセージ
function damageDeterminationMessage( pokemon: Pokemon, isMe: boolean ): void {

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );
    if ( target.isMine() !== isMe ) continue;

    if ( attack.critical ) {
      pokemon.msgCritical( target.getArticle() );
    }
  }
}

// ダメージをHP1で耐える効果のメッセージなど
function enduringEffectsMessage( pokemon: Pokemon, isMe: boolean ): void {

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );
    if ( target.isMine() !== isMe ) continue;
    if ( !target.stateChange.endureMsg.isTrue ) return;

    if ( target.stateChange.endureMsg.text === 'こらえる' ) {
      target.msgEndure();
    }
    if ( target.stateChange.endureMsg.text === 'がんじょう' ) {
      target.msgDeclareAbility();
      target.msgEndure();
    }
    if ( target.stateChange.endureMsg.text === 'きあいのタスキ' ) {
      target.consumeItem();
      target.msgFocusSash();
    }
    if ( target.stateChange.endureMsg.text === 'きあいのハチマキ' ) {
      target.msgFocusBand();
    }

    target.stateChange.endureMsg.reset();
  }
}

// 追加効果などの発動
function activateAdditionalEffects( pokemon: Pokemon, isMe: boolean, isRange: boolean ): void {

  const master: MoveData = pokemon.move.selected.getMaster();
  const flag: MoveFlagData = pokemon.move.selected.getFlag();
  const addOn: MoveAddOnData = pokemon.move.selected.getAddOn();

  const lower = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( master.category !== 'damage+lower' ) return;
    if ( !pokemon.isAdditionalEffect( target, attack ) ) return;
    if ( !pokemon.isAdditionalRate( master.stat.chance ) ) return;

    for ( const changes of master.stat.changes ) {
      const stat = changes.stat;
      const change = changes.change;
      if ( !target.isChangeRankByOther( stat, change, pokemon ) ) continue;

      target.changeRankByOther( stat, change, pokemon );
    }
  }

  const raiseByAdditional = ( pokemon: Pokemon ): void => {
    if ( master.category !== 'damage+raise' ) return;
    if ( pokemon.stateChange.sheerForce.isTrue ) return;
    if ( !pokemon.isAdditionalRate( master.stat.chance ) ) return;

    for ( const changes of master.stat.changes ) {
      const stat = changes.stat;
      const change = changes.change;
      if ( !pokemon.isChangeRank( stat, change ) ) continue;

      pokemon.changeRank( stat, change );
    }
  }

  const raiseNotAdditional = ( pokemon: Pokemon ): void => {
    if ( master.category !== 'damage+raise' ) return;

    for ( const changes of master.stat.changes ) {
      const stat = changes.stat;
      const change = changes.change;
      if ( !pokemon.isChangeRank( stat, change ) ) continue;

      pokemon.changeRank( stat, change );
    }
  }

  const ailment = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( master.category !== 'damage+ailment' ) return;
    if ( !pokemon.isAdditionalEffect( target, attack ) ) return;
    if ( !pokemon.isAdditionalRate( master.ailment.chance ) ) return;

    target.getAilmentByAdditionalEffect( master.ailment.name, pokemon )
  }

  const confuse = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( master.category !== 'damage+ailment' ) return;
    if ( master.ailment.name !== 'confusion' ) return;
    if ( !pokemon.isAdditionalEffect( target, attack ) ) return;
    if ( !pokemon.isAdditionalRate( master.ailment.chance ) ) return;
    if ( !target.isGetConfusionByAdditionalEffect( pokemon ) ) return;

    target.getConfusion();
  }

  const flinch = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( master.flinch === 0 ) return;
    if ( !pokemon.isAdditionalEffect( target, attack ) ) return;
    if ( !pokemon.isAdditionalFlinch( master.flinch ) ) return;

    target.stateChange.flinch.isTrue = true;
  }

  const anchorShot = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !pokemon.move.selected.isName( 'アンカーショット' ) && !pokemon.move.selected.isName( 'かげぬい' ) ) return;
    if ( !pokemon.isAdditionalEffect( target, attack ) ) return;
    if ( target.type.has( 'Ghost' ) ) return;
    if ( target.stateChange.cannotEscape.isTrue ) return;

    target.stateChange.cannotEscape.beTrue( pokemon.order );
    target.msgCannotEscape();
  }

  const saltCure = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !pokemon.move.selected.isName( 'しおづけ' ) ) return;
    if ( !pokemon.isAdditionalEffect( target, attack ) ) return;;
    if ( target.stateChange.saltCure.isTrue ) return;

    target.stateChange.saltCure.isTrue = true;
    target.msgSaltCure();
  }

  const throatChop = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !pokemon.move.selected.isName( 'じごくづき' ) ) return;
    if ( !pokemon.isAdditionalEffect( target, attack ) ) return;
    if ( target.stateChange.throatChop.isTrue ) return;

    target.stateChange.throatChop.isTrue = true;
    target.stateChange.throatChop.turn = 2;
  }

  const triAttack = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !pokemon.move.selected.isName( 'トライアタック' ) ) return;
    if ( !pokemon.isAdditionalEffect( target, attack ) ) return;
    if ( !pokemon.isAdditionalRate( master.ailment.chance ) ) return;

    const rate: number = getRandom();
    if ( rate < 100 / 3 ) {
      target.getAilmentByAdditionalEffect( 'paralysis', pokemon );
    } else if ( rate < 200 / 3 ) {
      target.getAilmentByAdditionalEffect( 'burn', pokemon );
    } else {
      target.getAilmentByAdditionalEffect( 'freeze', pokemon );
    }
  }

  const fling = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !pokemon.move.selected.isName( 'なげつける' ) ) return;

    const item: string = pokemon.stateChange.fling.text;
    pokemon.stateChange.fling.reset();

    if ( !pokemon.isAdditionalEffect( target, attack ) ) return;

    if ( item === 'でんきだま' ) {
      target.getAilmentByAdditionalEffect( 'paralysis', pokemon );
    }
    if ( item === 'かえんだま' ) {
      target.getAilmentByAdditionalEffect( 'burn', pokemon );
    }
    if ( item === 'どくバリ' ) {
      target.getAilmentByAdditionalEffect( 'poison', pokemon );
    }
    /*
    if ( item === 'どくどくだま' ) {
      giveAilment( pokemon, target, 'sp-poisoned' );
    }
    */
    if ( item === 'おうじゃのしるし' || pokemon.stateChange.fling.text === 'するどいキバ' ) {
      target.stateChange.flinch.isTrue = true;
    }
    if ( item === 'しろいハーブ' ) {
      if ( target.status.useWhiteHerb() ) {
        target.msgWhiteHerb();
      }
    }
    for ( const berry of berryTable ) {
      /*
      if ( berry.name === pokemon.stateChange.fling.text && berry.fling === true ) {
        target.stateChange.memo.isTrue = true;
        target.stateChange.memo.text = 'なげつける';
        eatBerry( target, pokemon.stateChange.fling.text );
        // ゲップ
        target.stateChange.belch.isTrue = true;
        // ほおぶくろ
        if ( target.stateChange.memo.count > 0 ) {
          activateCheekPouch( target );
        }
        target.stateChange.memo.reset();
      }
      */
    }
  }

  const direClaw = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !pokemon.move.selected.isName( 'フェイタルクロー' ) ) return;
    if ( !pokemon.isAdditionalEffect( target, attack ) ) return;
    if ( !pokemon.isAdditionalRate( master.ailment.chance ) ) return;

    const rate: number = getRandom();
    if ( rate < 100 / 3 ) {
      target.getAilmentByAdditionalEffect( 'poison', pokemon );
    } else if ( rate < 200 / 3 ) {
      target.getAilmentByAdditionalEffect( 'paralysis', pokemon );
    } else {
      target.getAilmentByAdditionalEffect( 'sleep', pokemon );
    }
  }




  // 一度だけ発動する
  if ( !isRange ) {
    if ( pokemon.move.selected.isName( 'なげつける' ) ) { // 持ち物を失う
      pokemon.stateChange.fling.isTrue = true;
      if ( pokemon.item.name !== null ) {
        pokemon.stateChange.flinch.text = pokemon.item.name;
      }
      pokemon.item.recyclable();
    }

    if ( addOn.additional ) { // 自分のランク変化
      raiseByAdditional( pokemon );
    } else {
      raiseNotAdditional( pokemon );
    }
  }

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );
    if ( target.isMine() !== isMe ) continue;

    // HP吸収技
    if ( master.category === 'damage+heal' ) {
      const value = Math.round( attack.damage * master.drain / 100 );
      drainHP( pokemon, target, value );
    }

    // 追加効果
    if ( !addOn.additional ) continue;
    lower( pokemon, target, attack );   // 対象のランク変化
    ailment( pokemon, target, attack ); // 状態異常付与
    confuse( pokemon, target, attack ); // 混乱付与
    flinch( pokemon, target, attack );  // ひるみ付与

    // その他の追加効果
    anchorShot( pokemon, target, attack ); // アンカーショット・かげぬい
    saltCure( pokemon, target, attack );   // しおづけ
    throatChop( pokemon, target, attack ); // じごくづき
    triAttack( pokemon, target, attack );  // トライアタック
    fling( pokemon, target, attack );      // なげつける
    direClaw( pokemon, target, attack );   // フェイタルクロー
  }
}

// ダメージが発生したときの効果
function effectsWhenDamageOccurs( pokemon: Pokemon, isMe: boolean ) {

  const rage = ( target: Pokemon, attack: Attack ): void => {
    if ( target.status.hp.value.isZero() ) return;
    if ( attack.substitute ) return;
    if ( !target.stateChange.rage.isTrue ) return;
    if ( !target.isChangeRank( 'atk', 1 ) ) return;

    target.changeRankByRage();
    target.msgRage();
  }

  const clearSmog = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( target.status.hp.value.isZero() ) return;
    if ( attack.substitute ) return;
    if ( !pokemon.move.selected.isName( 'クリアスモッグ' ) ) return;

    target.status.toZeroAllRank();
    target.msgClearSmog();
  }

  const grudge = ( pokemon: Pokemon, target: Pokemon ): void => {
    if ( !target.stateChange.grudge.isTrue ) return;
    if ( !target.status.hp.value.isZero() ) return;
    if ( pokemon.move.learned[pokemon.move.selected.slot].powerPoint.isZero() ) return;

    pokemon.move.learned[pokemon.move.selected.slot].powerPoint.toZero();
    pokemon.msgGrudge();
  }

  const beakBlast = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !pokemon.isContact() ) return;
    if ( !target.stateChange.beakBlast.isTrue ) return;
    if ( pokemon.move.selected.isName( 'フリーフォール' ) ) return;
    if ( !pokemon.isGetAilmentByOther( 'Burned', target ) ) return;

    pokemon.statusAilment.getBurned();
  }

  const poisonTouch = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !pokemon.isContact() ) return;
    if ( !pokemon.ability.isName( 'どくしゅ' ) ) return;
    if ( target.ability.isName( 'りんぷん' ) ) return;
    if ( getRandom() >= 30 ) return;
    if ( !target.isGetAilmentByOther( 'Poisoned', pokemon ) ) return;

    pokemon.msgDeclareAbility();
    target.statusAilment.getPoisoned();
    // writeLog( `${getArticle( target )}に 毒を あびせた!` );
  }

  const synchronize = ( pokemon: Pokemon, target: Pokemon ): void => {
    if ( !target.ability.isName( 'シンクロ' ) ) return;
    if ( !target.stateChange.synchronize.isTrue ) return;
    const ailment = target.stateChange.synchronize.name;
    if ( ailment === 'Poisoned' || ailment === 'BadPoisoned' || ailment === 'Burned' || ailment === 'Paralysis' ) {
      target.msgDeclareAbility();
      pokemon.statusAilment.getBurned();
    }
    target.stateChange.synchronize.reset();
  }

  const roughSkin = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !pokemon.isContact() ) return;
    if ( !target.ability.isName( 'さめはだ' ) && !target.ability.isName( 'てつのトゲ' ) ) return;

    target.msgDeclareAbility();

    if ( pokemon.item.isName( 'ぼうごパット' ) ) {
      pokemon.msgProtectivePads();
      return;
    }
    if ( pokemon.ability.isName( 'マジックガード' ) ) {
      return;
    }

    const value = Math.max( 1, Math.floor( pokemon.getOrgHP() / 8 ) );
    pokemon.status.hp.value.sub( value );
    pokemon.msgRoughSkin();
  }

  const effectSpore = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    const random: number = Math.floor( getRandom() );

    if ( attack.substitute ) return;
    if ( !pokemon.isContact() ) return;
    if ( !target.ability.isName( 'ほうし' ) ) return;
    if ( pokemon.type.has( 'Grass' ) ) return;
    if ( pokemon.ability.isName( 'ぼうじん' ) ) return;
    if ( pokemon.item.isName( 'ぼうじんゴーグル' ) ) return;
    if ( pokemon.item.isName( 'ぼうごパット' ) ) return;
    if ( random >= 30 ) return;

    if ( random < 9 ) {
      if ( !pokemon.isGetAilmentByOther( 'Poisoned', target ) ) return;
      target.msgDeclareAbility();
      pokemon.statusAilment.getPoisoned();
    } else if ( random < 19 ) {
      if ( !pokemon.isGetAilmentByOther( 'Paralysis', target ) ) return;
      target.msgDeclareAbility();
      pokemon.statusAilment.getParalysis();
    } else {
      if ( !pokemon.isGetAilmentByOther( 'Asleep', target ) ) return;
      target.msgDeclareAbility();
      pokemon.statusAilment.getAsleep();
    }
  }

  const poisonPoint = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !pokemon.isContact() ) return;
    if ( !target.ability.isName( 'どくのトゲ' ) ) return;
    if ( pokemon.item.isName( 'ぼうごパット' ) ) return;
    if ( getRandom() > 30 ) return;
    if ( !pokemon.isGetAilmentByOther( 'Poisoned', target ) ) return;

    target.msgDeclareAbility();
    pokemon.statusAilment.getPoisoned();
  }

  const staticElectricity = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !pokemon.isContact() ) return;
    if ( !target.ability.isName( 'せいでんき' ) ) return;
    if ( pokemon.item.isName( 'ぼうごパット' ) ) return;
    if ( getRandom() > 30 ) return;
    if ( !pokemon.isGetAilmentByOther( 'Paralysis', target ) ) return;

    target.msgDeclareAbility();
    pokemon.statusAilment.getParalysis();
  }

  const flameBody = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !pokemon.isContact() ) return;
    if ( !target.ability.isName( 'ほのおのからだ' ) ) return;
    if ( pokemon.item.isName( 'ぼうごパット' ) ) return;
    if ( getRandom() > 30 ) return;
    if ( !pokemon.isGetAilmentByOther( 'Burned', target ) ) return;

    target.msgDeclareAbility();
    pokemon.statusAilment.getBurned();
  }

  const cuteCharm = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !pokemon.isContact() ) return;
    if ( !target.ability.isName( 'メロメロボディ' ) ) return;
    if ( pokemon.item.isName( 'ぼうごパット' ) ) return;
    if ( getRandom() >= 30 ) return;
    if ( !pokemon.isGetAttract( target ) ) return;

    target.msgDeclareAbility();
    pokemon.getAttract( target );
  }

  const mummy = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !pokemon.isContact() ) return;
    if ( !target.ability.isName( 'ミイラ' ) && !target.ability.isName( 'とれないにおい' ) ) return;

    const master: changeAbilityType = pokemon.ability.changeMaster();
    if ( master.exchange === 0 || master.exchange === 2 ) return;

    if ( pokemon.item.isName( 'ぼうごパット' ) ) {
      pokemon.msgProtectivePads();
      return;
    }

    target.msgDeclareAbility();
    pokemon.ability.name = target.ability.name;

    if ( target.ability.isName( 'ミイラ' ) ) {
      pokemon.msgMummy();
    }
    if ( target.ability.isName( 'とれないにおい' ) ) {
      pokemon.msgLingeringAroma();
    }
  }

  const gooey = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !pokemon.isContact() ) return;
    if ( !target.ability.isName( 'ぬめぬめ' ) && !target.ability.isName( 'カーリーヘアー' ) ) return;

    target.msgDeclareAbility();

    if ( pokemon.item.isName( 'ぼうごパット' ) ) {
      pokemon.msgProtectivePads();
      return;
    }

    pokemon.changeRankByOther( 'spe', -1, target );
  }

  const wanderingSpirit = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !pokemon.isContact() ) return;
    if ( !target.ability.isName( 'さまようたましい' ) ) return;
    if ( pokemon.item.isName( 'ぼうごパット' ) ) return;
    if ( pokemon.stateChange.dynamax.isTrue ) return;
    if ( target.stateChange.dynamax.isTrue ) return;

    const master: changeAbilityType = pokemon.ability.changeMaster();
    if ( master.exchange === 0 || master.exchange === 2 ) return;


    target.msgDeclareAbility();
    target.msgExchangeAbility();
    [ pokemon.ability.name, target.ability.name ] = [ target.ability.name, pokemon.ability.name ];

    if ( pokemon.isMine() !== target.isMine() ) {
      pokemon.msgDeclareAbility();
      target.msgDeclareAbility();
    }
  }

  const perishBody = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !pokemon.isContact() ) return;
    if ( !target.ability.isName( 'ほろびのボディ' ) ) return;
    if ( pokemon.status.hp.value.isZero() ) return;
    if ( pokemon.item.isName( 'ぼうごパット' ) ) return;
    if ( pokemon.stateChange.perishSong.isTrue && target.stateChange.perishSong.isTrue ) return;

    target.msgDeclareAbility();

    if ( !pokemon.stateChange.perishSong.isTrue && !target.stateChange.perishSong.isTrue ) {
      pokemon.msgPerishBodyAll();
      pokemon.stateChange.perishSong.isTrue = true;
      pokemon.stateChange.perishSong.count = 3;
      target.stateChange.perishSong.isTrue = true;
      target.stateChange.perishSong.count = 3;
    } else {
      if ( !pokemon.stateChange.perishSong.isTrue ) {
        pokemon.msgPerishBodySide();
        pokemon.stateChange.perishSong.isTrue = true;
        pokemon.stateChange.perishSong.count = 3;
      }
      if ( !target.stateChange.perishSong.isTrue ) {
        target.msgPerishBodySide();
        target.stateChange.perishSong.isTrue = true;
        target.stateChange.perishSong.count = 3;
      }
    }
  }

  const cursedBody = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !target.ability.isName( 'のろわれボディ' ) ) return;
    if ( pokemon.status.hp.value.isZero() ) return;
    // if ( pokemon.stateChange.disable.isTrue ) return; ダイマックス技に対しては発動しない
    if ( pokemon.stateChange.disable.isTrue ) return;
    if ( main.isExistAbilityInSide( pokemon.isMine(), 'アロマベール' ) ) return;
    if ( getRandom() >= 30 ) return;

    target.msgDeclareAbility();

    pokemon.stateChange.disable.isTrue = true;
    pokemon.stateChange.disable.turn = 4;
    pokemon.stateChange.disable.text = pokemon.move.selected.name;

    pokemon.msgCursedBody();
  }

  const stamina = ( target: Pokemon, attack: Attack ): void => {
    if ( target.status.hp.value.isZero() ) return;
    if ( attack.substitute ) return;
    if ( !target.ability.isName( 'じきゅうりょく' ) ) return;
    if ( !target.isChangeRank( 'def', 1 ) ) return;

    target.msgDeclareAbility();
    target.changeRank( 'def', 1 );
  }

  const sandSpit = ( target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !target.ability.isName( 'すなはき' ) ) return;
    if ( !fieldStatus.weather.isGetSandy() ) return;

    target.msgDeclareAbility();
    fieldStatus.weather.getSandy( target );
  }

  const cottonDown = ( target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !target.ability.isName( 'わたげ' ) ) return;

    const valid: Pokemon[] = []
    for ( const poke of main.getPokemonInBattle() ) {
      if ( poke.isMine() == target.isMine() && poke.order.party === target.order.party ) continue;
      if ( poke.stateChange.substitute.isTrue ) continue;
      if ( poke.stateChange.isHide() ) continue;
      valid.push( poke );
    }

    if ( valid.length === 0 ) return;

    // すりぬけの考慮が未実装
    target.msgDeclareAbility();
    for ( const poke of valid ) {
      poke.changeRankByOther( 'spe', -1, target );
    }
  }

  const gulpMissile = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !target.ability.isName( 'うのミサイル' ) ) return;
    if ( target.isName( 'ウッウ' ) ) return;
    if ( target.stateChange.isHide() ) return;
    if ( pokemon.status.hp.value.isZero() ) return;

    target.msgDeclareAbility();

    if ( !pokemon.ability.isName( 'マジックガード' ) ) {
      const value: number = Math.max( 1, Math.floor( pokemon.getOrgHP() / 4 ) );
      pokemon.status.hp.value.sub( value );
    }

    rank:
    if ( target.isName( 'ウッウ(鵜呑み)' ) ) {
      if ( !pokemon.isChangeRankByOther( 'def', -1, target ) ) break rank;
      pokemon.changeRankByOther( 'def', -1, target )
      changeTargetRank( target, pokemon, 'defense', -1 )
    }

    ailment:
    if ( target.isName( 'ウッウ(丸呑み)' ) ) {
      if ( !pokemon.isGetAilmentByOther( 'Paralysis', target ) ) break ailment;
      pokemon.statusAilment.getParalysis();
    }

    target.formChange();
  }

  const seedSower = ( target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !target.ability.isName( 'こぼれダネ' ) ) return;
    if ( main.field.terrain.isGrassy() ) return;

    target.msgDeclareAbility();
    main.field.terrain.getGrassy( target );
  }

  const electromorphosis = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !target.ability.isName( 'でんきにかえる' ) ) return;
    if ( target.status.hp.value.isZero() ) return;

    target.msgDeclareAbility();
    target.stateChange.charge.isTrue = true;
    target.msgElectromorphosis( pokemon.move.selected.translate() );
  }

  const weakArmor = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !pokemon.move.selected.isPhysical() ) return;
    if ( !target.ability.isName( 'くだけるよろい' ) ) return;
    if ( !target.isChangeRank( 'def', -1 ) && !target.isChangeRank( 'spe', -2 ) ) return;

    target.msgDeclareAbility();
    target.changeRank( 'def', -1 );
    target.changeRank( 'spe', 2 );
  }

  const toxicDebris = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !pokemon.move.selected.isPhysical() ) return;
    if ( !target.ability.isName( 'どくげしょう' ) ) return;
    if ( main.field.getSide( !target.isMine() ).toxicSpikes.count === 2 ) return;

    target.msgDeclareAbility();
    main.field.getSide( !target.isMine() ).beToxicSpikes();
  }

  const waterCompaction = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( target.status.hp.value.isZero() ) return;
    if ( attack.substitute ) return;
    if ( !target.ability.isName( 'みずがため' ) ) return;
    if ( pokemon.move.selected.type !== 'Water' ) return;
    if ( !target.isChangeRank( 'def', 2 ) ) return;

    target.msgDeclareAbility();
    target.changeRank( 'def', 2 );
  }

  const justified = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( target.status.hp.value.isZero() ) return;
    if ( attack.substitute ) return;
    if ( !target.ability.isName( 'せいぎのこころ' ) ) return;
    if ( pokemon.move.selected.type !== 'Dark' ) return;
    if ( !target.isChangeRank( 'atk', 1 ) ) return;

    target.msgDeclareAbility();
    target.changeRank( 'atk', 1 );
  }

  const rattled = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( target.status.hp.value.isZero() ) return;
    if ( attack.substitute ) return;
    if ( !target.ability.isName( 'びびり' ) ) return;
    if ( pokemon.move.selected.type !== 'Dark'
      && pokemon.move.selected.type !== 'Ghost'
      && pokemon.move.selected.type !== 'Bug' ) return;
    if ( !target.isChangeRank( 'spe', 1 ) ) return;

    target.msgDeclareAbility();
    target.changeRank( 'spe', 1 );
  }

  const steamEngine = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( target.status.hp.value.isZero() ) return;
    if ( attack.substitute ) return;
    if ( !target.ability.isName( 'じょうききかん' ) ) return;
    if ( pokemon.move.selected.type !== 'Water'
      && pokemon.move.selected.type !== 'Fire' ) return;
    if ( !target.isChangeRank( 'spe', 6 ) ) return;

    target.msgDeclareAbility();
    target.changeRank( 'spe', 6 );
  }

  const windPower = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( target.status.hp.value.isZero() ) return;
    if ( attack.substitute ) return;
    if ( !target.ability.isName( 'ふうりょくでんき' ) ) return;
    if ( !pokemon.move.selected.getAddOn().wind ) return;

    target.msgDeclareAbility();
    target.stateChange.charge.isTrue = true;
    target.msgElectromorphosis( pokemon.move.selected.translate() );
  }

  const angerPoint = ( target: Pokemon, attack: Attack ): void => {
    if ( target.status.hp.value.isZero() ) return;
    if ( attack.substitute ) return;
    if ( !target.ability.isName( 'いかりのつぼ' ) ) return;
    if ( !attack.critical ) return;

    target.msgDeclareAbility();
    target.status.atk.rank.add( 12 );
    target.msgAngerPoint();
  }

  const halfBerry = ( target: Pokemon ): void => {
    if ( !target.stateChange.halfBerry.isTrue ) return;
    target.msgHalfBerry();
    target.stateChange.halfBerry.reset();

    target.activateCheekPouch();
  }

  const enigmaBerry = ( target: Pokemon, attack: Attack ): void => {
    if ( target.status.hp.value.isZero() ) return;
    if ( attack.substitute ) return;
    if ( !target.item.isName( 'ナゾのみ' ) ) return;
    if ( attack.effective <= 1 ) return;
    if ( attack.damage === 0 ) return;

    target.eatEnigmaBerry();
    target.consumeItem();
  }

  const weaknessPolicy = ( target: Pokemon, attack: Attack ): void => {
    if ( target.status.hp.value.isZero() ) return;
    if ( attack.substitute ) return;
    if ( !target.item.isName( 'じゃくてんほけん' ) ) return;
    if ( attack.effective <= 1 ) return;
    if ( !target.isChangeRank( 'atk', 2 ) && !target.isChangeRank( 'spA', 2 ) ) return;

    target.changeRank( 'atk', 2, 'じゃくてんほけん' );
    target.changeRank( 'spA', 2, 'じゃくてんほけん' );
    target.consumeItem();
  }

  const cellBattery = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( target.status.hp.value.isZero() ) return;
    if ( attack.substitute ) return;
    if ( !target.item.isName( 'じゅうでんち' ) ) return;
    if ( pokemon.move.selected.type !== 'Electric' ) return;
    if ( !target.isChangeRank( 'atk', 1 ) ) return;

    target.changeRank( 'atk', 1, 'じゅうでんち' );
    target.consumeItem();
  }

  const snowball = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( target.status.hp.value.isZero() ) return;
    if ( attack.substitute ) return;
    if ( !target.item.isName( 'ゆきだま' ) ) return;
    if ( pokemon.move.selected.type !== 'Ice' ) return;
    if ( !target.isChangeRank( 'atk', 1 ) ) return;

    target.changeRank( 'atk', 1, 'ゆきだま' );
    target.consumeItem();
  }

  const absorbBulb = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( target.status.hp.value.isZero() ) return;
    if ( attack.substitute ) return;
    if ( !target.item.isName( 'きゅうこん' ) ) return;
    if ( pokemon.move.selected.type !== 'Water' ) return;
    if ( !target.isChangeRank( 'spA', 1 ) ) return;

    target.changeRank( 'spA', 1, 'きゅうこん' );
    target.consumeItem();
  }

  const luminousMoss = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( target.status.hp.value.isZero() ) return;
    if ( attack.substitute ) return;
    if ( !target.item.isName( 'ひかりごけ' ) ) return;
    if ( pokemon.move.selected.type !== 'Water' ) return;
    if ( !target.isChangeRank( 'spD', 1 ) ) return;

    target.changeRank( 'spD', 1, 'ひかりごけ' );
    target.consumeItem();
  }

  const rockyHelmet = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !target.item.isName( 'ゴツゴツメット' ) ) return;
    if ( !pokemon.isContact() ) return;
    if ( pokemon.item.isName( 'ぼうごパット' ) ) return;
    if ( pokemon.ability.isName( 'マジックガード' ) ) return;
    if ( pokemon.status.hp.value.isZero() ) return;

    const value: number = Math.floor( pokemon.getOrgHP() / 8 );
    pokemon.status.hp.value.sub( value );
    target.msgRockyHelmet();
  }

  const stickyBarb = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !target.item.isName( 'くっつきバリ' ) ) return;
    if ( !pokemon.isContact() ) return;
    if ( !pokemon.item.isNull() ) return;

    [ pokemon.item.name, target.item.name ] = [ target.item.name, pokemon.item.name ];
  }

  const airBalloon = ( target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !target.item.isName( 'ふうせん' ) ) return;

    target.item.name = null;
    target.msgAirBalloon();
  }

  const incinerate = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !pokemon.move.selected.isName( 'やきつくす' ) ) return;
    if ( target.ability.isName( 'ねんちゃく' ) ) return;
    if ( target.item.getMaster().category !== 'jeweles'
      && target.item.getCategory().pocket !== 'berries' ) return;

    target.msgIncinerate();
    target.item.name = null;
  }

  const jabocaBerry = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !target.item.isName( 'ジャポのみ' ) ) return;
    if ( !pokemon.move.selected.isPhysical() ) return;
    if ( pokemon.ability.isName( 'マジックガード' ) ) return;
    if ( pokemon.status.hp.value.isZero() ) return;

    const value: number = Math.floor( pokemon.getOrgHP() / 8 );
    pokemon.status.hp.value.sub( value );
    pokemon.msgJabocaBerry( target.getArticle() );
    target.consumeItem();
  }

  const rowapBerry = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( attack.substitute ) return;
    if ( !target.item.isName( 'レンブのみ' ) ) return;
    if ( !pokemon.move.selected.isSpecial() ) return;
    if ( pokemon.ability.isName( 'マジックガード' ) ) return;
    if ( pokemon.status.hp.value.isZero() ) return;

    const value: number = Math.floor( pokemon.getOrgHP() / 8 );
    pokemon.status.hp.value.sub( value );
    pokemon.msgRowapBerry( target.getArticle() );
    target.consumeItem();
  }

  const disguise = ( target: Pokemon ): void => {
    if ( !target.stateChange.disguise.isTrue ) return;

    target.stateChange.disguise.reset();
    target.msgDeclareAbility();
    target.formChange();
    target.msgDisguise();

    const value: number = Math.floor( target.getOrgHP() / 8 );
    target.status.hp.value.sub( value );
  }

  const iceFace = ( target: Pokemon ): void => {
    if ( !target.stateChange.iceFace.isTrue ) return;

    target.stateChange.iceFace.reset();
    target.msgDeclareAbility();
    target.formChange();
    target.msgIceFace();
  }




  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );
    if ( target.isMine() !== isMe ) continue;

    // コアパニッシャー
    rage( target, attack );                 // いかり
    clearSmog( pokemon, target, attack );   // クリアスモッグ
    grudge( pokemon, target );              // おんねん
    beakBlast( pokemon, target, attack );   // くちばしキャノン
    poisonTouch( pokemon, target, attack ); // どくしゅ

    // 防御側の特性
    // ゆうばく
    // とびだすなかみ
    // synchronize( pokemon, target );            // シンクロ
    roughSkin( pokemon, target, attack );         // さめはだ、てつのトゲ
    effectSpore( pokemon, target, attack );       // ほうし
    poisonPoint( pokemon, target, attack );       // どくのトゲ
    staticElectricity( pokemon, target, attack ); // せいでんき
    flameBody( pokemon, target, attack );         // ほのおのからだ
    cuteCharm( pokemon, target, attack );         // メロメロボディ
    mummy( pokemon, target, attack );             // ミイラ、とれないにおい
    gooey( pokemon, target, attack );             // ぬめぬめ、カーリーヘアー
    wanderingSpirit( pokemon, target, attack );   // さまようたましい
    perishBody( pokemon, target, attack );        // ほろびのボディ
    // cursedBody( pokemon, target, attack );     // のろわれボディ
    stamina( target, attack );                    // じきゅうりょく
    sandSpit( target, attack );                   // すなはき
    cottonDown( target, attack );                 // わたげ
    gulpMissile( pokemon, target, attack );       // うのミサイル
    seedSower( target, attack );                  // こぼれダネ
    electromorphosis( pokemon, target, attack );  // でんきにかえる
    weakArmor( pokemon, target, attack );         // くだけるよろい
    toxicDebris( pokemon, target, attack );       // どくげしょう
    waterCompaction( pokemon, target, attack );   // みずがため
    justified( pokemon, target, attack );         // せいぎのこころ
    rattled( pokemon, target, attack );           // びびり
    steamEngine( pokemon, target, attack );       // じょうききかん
    windPower( pokemon, target, attack );         // ふうりょくでんき
    angerPoint( target, attack );                 // いかりのつぼ

    // 防御側の持ち物の効果（その１）
    halfBerry( target );                     // 半減きのみ
    enigmaBerry( target, attack );           // ナゾのみ
    weaknessPolicy( target, attack );        // じゃくtねんほけん
    cellBattery( pokemon, target, attack );  // じゅうでんち
    snowball( pokemon, target, attack );     // ゆきだま
    absorbBulb( pokemon, target, attack );   // きゅうこん
    luminousMoss( pokemon, target, attack ); // ひかりごけ
    rockyHelmet( pokemon, target, attack );  // ゴツゴツメット
    stickyBarb( pokemon, target, attack );   // くっつきバリ
    airBalloon( target, attack );            // ふうせん

    // やきつくすによるきのみ/6-ジュエルの消失
    incinerate( pokemon, target, attack );

    // 防御側の持ち物の効果（その２）
    jabocaBerry( pokemon, target, attack ); // ジャポのみ
    rowapBerry( pokemon, target, attack );  // レンブのみ

    // 防御側のばけのかわ/アイスフェイス
    disguise( target ); // ばけのかわ
    iceFace( target );  // アイスフェイス
  }
}

// ひんし判定
function faintingJudgment( pokemon: Pokemon, isMe: boolean, isRange: boolean ): void {

  // いのちがけ使用者のひんし: 防御側にダメージを与え、特性や持ち物の効果が発動した後にひんしになる
  // 防御側のひんし
  // 味方の特性や持ち物の効果による攻撃側のひんし
  // みちづれによる攻撃側のひんし: 防御側にダメージを与え、特性や持ち物の効果が発動した後にひんしになる

  if ( isRange ) {
    // 防御側のひんし
    for ( const attack of pokemon.attack.getTargetToPokemon() ) {
      const target: Pokemon = main.getPokemonByBattle( attack );
      if ( target.isMine() !== isMe ) continue;
      if ( !target.isFainted() ) continue;

      target.toHand();
    }

    // 味方の特性や持ち物の効果による攻撃側のひんし
    if ( pokemon.isFainted() ) {
      pokemon.toHand();
    }
  }

  if ( !isRange ) {
    // いのちがけ使用者のひんし: 防御側にダメージを与え、特性や持ち物の効果が発動した後にひんしになる
    if ( pokemon.move.selected.isName( 'いのちがけ' ) ) {
      pokemon.status.hp.value.toZero();
      pokemon.isFainted();
      pokemon.toHand();
    }

    // 防御側のひんし
    for ( const attack of pokemon.attack.getTargetToPokemon() ) {
      const target: Pokemon = main.getPokemonByBattle( attack );
      if ( !target.isFainted() ) continue;
      if ( target.isMine() !== isMe ) continue;

      target.toHand();
    }

    // みちづれによる攻撃側のひんし: 防御側にダメージを与え、特性や持ち物の効果が発動した後にひんしになる
    for ( const attack of pokemon.attack.getTargetToPokemon() ) {
      const target: Pokemon = main.getPokemonByBattle( attack );
      if ( target.isMine() !== isMe ) continue;
      if ( !target.stateChange.destinyBond.isTrue ) continue;
      if ( !target.status.hp.value.isZero() ) return;
      if ( pokemon.stateChange.dynamax.isTrue ) return;

      target.msgDestinyBond();

      pokemon.status.hp.value.toZero();
      pokemon.isFainted();
      pokemon.toHand();
    }
  }
}

// ひんしできんちょうかん/かがくへんかガスが解除されたことによる封じられていた効果の発動
function activateSealedEffects( pokemon: Pokemon, isMe: boolean, isRange: boolean ): void {

  if ( pokemon.status.hp.value.isZero() === false ) return;

  if ( pokemon.ability.isName( 'きんちょうかん' ) ) {
    /*
    for ( const order of getSpeedOrder() ) {
      const target: Pokemon | false = getPokemonByBattle( order.isMe, order.battleNumber );
      if ( target === false ) continue;
      if ( isEnableEatBerry( target ) === true ) {
        eatBerry( target, target.item.name );
      }
    }
    */
  }
  if ( pokemon.ability.isName( 'かがくへんかガス' ) ) {

  }

}

// 技の効果
function activateMoveEffect( pokemon: Pokemon ): void {

  const master: MoveData = pokemon.move.selected.getMaster();
  const flag: MoveFlagData = pokemon.move.selected.getFlag();
  const addOn: MoveAddOnData = pokemon.move.selected.getAddOn();

  const recoil = ( pokemon: Pokemon, attack: Attack ): void => {
    // わるあがきの反動ダメージは無視されない
    if ( !pokemon.move.selected.isName( 'わるあがき' ) ) {
      if ( pokemon.ability.isName( 'マジックガード' ) ) return;
      if ( pokemon.ability.isName( 'いしあたま' ) ) return;
    }

    // 与ダメージ依存の反動技
    if ( master.drain < 0 && attack.damage > 0 ) {
      const value: number = Math.max( 1, Math.round( attack.damage * master.drain / 100 ) );
      pokemon.status.hp.value.add( value );
      pokemon.msgRecoil();
    }

    // 与ダメージ非依存の反動技
    if ( master.healing < 0 ) {
      const value: number = Math.max( 1, Math.round( pokemon.getOrgHP() * master.healing / 100 ) );
      pokemon.status.hp.value.add( value );
      pokemon.msgRecoil();
    }

    // ひんし判定
    if ( pokemon.isFainted() ) {
      pokemon.toHand();
    }
  }

  const bind = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( master.ailment.name !== 'trap' ) return;
    if ( target.status.hp.value.isZero() ) return;
    if ( target.stateChange.bind.isTrue ) return;
    if ( attack.substitute ) {
      if ( pokemon.move.selected.isName( 'キョダイサジン' ) ) return;
      if ( pokemon.move.selected.isName( 'キョダイヒャッカ' ) ) return;
    }

    const getTurn = ( pokemon: Pokemon ): number => {
      let turn: number = 4;
      if ( getRandom() < 50 ) turn = 5;
      if ( pokemon.item.isName( 'ねばりのかぎづめ' ) ) turn = 7;
      return turn;
    }

    target.stateChange.bind.isTrue = true;
    target.stateChange.bind.turn = getTurn( pokemon );
    if ( pokemon.item.isName( 'しめつけバンド' ) ) {
      target.stateChange.bind.text = 'しめつけバンド';
    }

    target.msgBind( pokemon.getArticle() );
  }

  const secretPower = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !pokemon.move.selected.isName( 'ひみつのちから' ) ) return;
    if ( target.status.hp.value.isZero() ) return;
    if ( !pokemon.isAdditionalEffect( target, attack ) ) return;
    if ( !pokemon.isAdditionalRate( 30 ) ) return;

    if ( fieldStatus.terrain.isElectric() ) {
      target.getAilmentByAdditionalEffect( 'paralysis', pokemon );
    }
    if ( fieldStatus.terrain.isGrassy() ) {
      target.getAilmentByAdditionalEffect( 'sleep', pokemon );
    }
    if ( fieldStatus.terrain.isPsychic() ) {
      if ( target.isChangeRankByOther( 'spe', -1, pokemon ) ) {
        target.changeRankByOther( 'spe', -1, pokemon );
      }
    }
    if ( fieldStatus.terrain.isMisty() ) {
      if ( target.isChangeRankByOther( 'spA', -1, pokemon ) ) {
        target.changeRankByOther( 'spA', -1, pokemon );
      }
    }
    if ( fieldStatus.terrain.isPlain() ) {
      target.getAilmentByAdditionalEffect( 'paralysis', pokemon );
    }
  }

  const fellStinger = ( pokemon: Pokemon, target: Pokemon ): void => {
    if ( !pokemon.move.selected.isName( 'とどめばり' ) ) return;
    if ( !target.status.hp.value.isZero() ) return;
    if ( !pokemon.isChangeRank( 'atk', 3 ) ) return;

    pokemon.msgDeclareAbility();
    pokemon.changeRank( 'atk', 3 );
  }

  const knockOff = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !pokemon.move.selected.isName( 'はたきおとす' ) ) return;
    if ( target.item.name === null ) return;
    if ( target.ability.isName( 'ねんちゃく' ) ) return;
    if ( attack.substitute ) return;

    pokemon.msgKnockOff( target.getArticle(), target.item.name );
    target.item.name = null;
  }

  const thief = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !pokemon.move.selected.isName( 'どろぼう' ) && !pokemon.move.selected.isName( 'ほしがる' ) ) return;
    if ( pokemon.item.name !== null ) return;
    if ( target.item.name === null ) return;
    if ( attack.substitute ) return;

    if ( target.ability.isName( 'ねんちゃく' ) ) {
      target.msgDeclareAbility();
      pokemon.msgNotThief( target.getArticle() );
      return;
    }

    pokemon.msgThief( target.getArticle(), target.item.name );
    [ pokemon.item.name, target.item.name ] = [ target.item.name, pokemon.item.name ];

    /*
    if ( isEnableEatBerry( pokemon ) === true ) {
      eatBerry( pokemon, pokemon.item.name );
    }
    */
  }

  const bugBite = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !pokemon.move.selected.isName( 'むしくい' )
      && !pokemon.move.selected.isName( 'ついばむ' ) ) return;
    if ( pokemon.item.name !== null ) return;
    if ( target.item.name === null ) return;
    if ( attack.substitute ) return;
    if ( target.ability.isName( 'ねんちゃく' ) ) return;
    if ( target.item.getCategory().pocket !== 'berries' ) return;

    const isActivate = ( berry: string, pokemon: Pokemon ): boolean => {
      switch ( berry ) {
        case 'クラボのみ':
          if ( pokemon.statusAilment.isParalysis() ) {
            pokemon.eatCheriBerry();
            return true;
          } else {
            return false;
          }
        case 'カゴのみ':
          if ( pokemon.statusAilment.isAsleep() ) {
            pokemon.eatChestoBerry();
            return true;
          } else {
            return false;
          }
        case 'モモンのみ':
          if ( pokemon.statusAilment.isPoisoned() || pokemon.statusAilment.isBadPoisoned() ) {
            pokemon.eatPechaBerry();
            return true;
          } else {
            return false;
          }
        case 'チーゴのみ':
          if ( pokemon.statusAilment.isBurned() ) {
            pokemon.eatRawstBerry();
            return true;
          } else {
            return false;
          }
        case 'ナナシのみ':
          if ( pokemon.statusAilment.isFrozen() ) {
            pokemon.eatAspearBerry();
            return true;
          } else {
            return false;
          }
        case 'ヒメリのみ':
          pokemon.eatLeppaBerry();
          return true;

        case 'オレンのみ':
          if ( !pokemon.status.hp.value.isMax() ) {
            pokemon.eatOranBerry();
            return true;
          } else {
            return false;
          }
        case 'キーのみ':
          if ( pokemon.stateChange.confuse.isTrue ) {
            pokemon.eatPersimBerry();
            return true;
          } else {
            return false;
          }
        case 'ラムのみ':
          if ( !pokemon.statusAilment.isHealth() || pokemon.stateChange.confuse.isTrue ) {
            pokemon.eatLumBerry();
            return true;
          } else {
            return false;
          }
        case 'オボンのみ':
          if ( !pokemon.status.hp.value.isMax() ) {
            pokemon.eatSitrusBerry();
            return true;
          } else {
            return false;
          }
        case 'フィラのみ':
          if ( !pokemon.status.hp.value.isMax() ) {
            pokemon.eatFigyBerry();
            return true;
          } else {
            return false;
          }
        case 'ウイのみ':
          if ( !pokemon.status.hp.value.isMax() ) {
            pokemon.eatWikiBerry();
            return true;
          } else {
            return false;
          }
        case 'マゴのみ':
          if ( !pokemon.status.hp.value.isMax() ) {
            pokemon.eatMagoBerry();
            return true;
          } else {
            return false;
          }
        case 'バンジのみ':
          if ( !pokemon.status.hp.value.isMax() ) {
            pokemon.eatAguavBerry();
            return true;
          } else {
            return false;
          }
        case 'イアのみ':
          if ( !pokemon.status.hp.value.isMax() ) {
            pokemon.eatIapapaBerry();
            return true;
          } else {
            return false;
          }
        case 'チイラのみ':
          if ( pokemon.isChangeRank( 'atk', 1 ) ) {
            pokemon.eatLiechiBerry();
            return true;
          } else {
            return false;
          }
        case 'リュガのみ':
          if ( pokemon.isChangeRank( 'def', 1 ) ) {
            pokemon.eatGanlonBerry();
            return true;
          } else {
            return false;
          }
        case 'カムラのみ':
          if ( pokemon.isChangeRank( 'spe', 1 ) ) {
            pokemon.eatSalacBerry();
            return true;
          } else {
            return false;
          }
        case 'ヤタピのみ':
          if ( pokemon.isChangeRank( 'spA', 1 ) ) {
            pokemon.eatPetayaBerry();
            return true;
          } else {
            return false;
          }
        case 'ズアのみ':
          if ( pokemon.isChangeRank( 'spD', 1 ) ) {
            pokemon.eatApicotBerry();
            return true;
          } else {
            return false;
          }
        case 'サンのみ':
          break;

        case 'スターのみ':
          break;

        case 'ナゾのみ':
          if ( !pokemon.status.hp.value.isMax() ) {
            pokemon.eatEnigmaBerry();
            return true;
          } else {
            return false;
          }
        case 'ミクルのみ':
          break;

        case 'アッキのみ':
          if ( pokemon.isChangeRank( 'def', 1 ) ) {
            pokemon.eatKeeBerry();
            return true;
          } else {
            return false;
          }
        case 'タラプのみ':
          if ( pokemon.isChangeRank( 'spD', 1 ) ) {
            pokemon.eatMarangaBerry();
            return true;
          } else {
            return false;
          }
        default:
          return false;
      }

      return false;
    }

    const berry: string = target.item.name;
    target.item.name = null;
    pokemon.msgBugBote( berry );

    // きのみを食べたら発動
    pokemon.item.belch = true;

    // 効果があれば発動
    if ( isActivate( berry, pokemon ) ) {
      pokemon.activateCheekPouch();
    }
  }

  const smackDown = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !pokemon.move.selected.isName( 'うちおとす' )
      && !pokemon.move.selected.isName( 'サウザンアロー' ) ) return;
    if ( target.status.hp.value.isZero() ) return;
    if ( attack.substitute ) return;
    if ( target.isGround() ) return;

    target.stateChange.magnetRise.reset();
    target.stateChange.telekinesis.reset();
    target.stateChange.smackDown.isTrue = true;
    target.msgSmackDown();
  }

  const thousandWaves = ( pokemon: Pokemon, target: Pokemon ): void => {
    if ( !pokemon.move.selected.isName( 'サウザンウェーブ' ) ) return;
    if ( target.status.hp.value.isZero() ) return;
    if ( target.type.has( 'Ghost' ) ) return;
    if ( target.stateChange.cannotEscape.isTrue ) return;

    target.stateChange.cannotEscape.beTrue( pokemon.order );
    target.msgThousandWaves();
  }

  const jawLock = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !pokemon.move.selected.isName( 'くらいつく' ) ) return;
    if ( target.status.hp.value.isZero() ) return;
    if ( attack.substitute ) return;
    if ( pokemon.stateChange.cannotEscape.isTrue ) return;
    if ( target.stateChange.cannotEscape.isTrue ) return;
    if ( pokemon.type.has( 'Ghost' ) ) return;
    if ( target.type.has( 'Ghost' ) ) return;

    pokemon.stateChange.cannotEscape.beTrue( target.order );
    target.stateChange.cannotEscape.beTrue( pokemon.order );
    pokemon.msgJawLock();
  }

  const plasmaFists = ( pokemon: Pokemon ): void => {
    if ( pokemon.move.selected.isName( 'プラズマフィスト' ) ) return;
    if ( pokemon.status.hp.value.isZero() ) return;

    fieldStatus.whole.ionDeluge.isTrue = true;
    writeLog( `電子のシャワーが 降りそそいだ!` );
  }

  const genesisSupernova = ( pokemon: Pokemon ): void => {
    if ( !pokemon.move.selected.isName( 'オリジンズスーパーノヴァ' ) ) return;
    if ( pokemon.stateChange.sheerForce.isTrue ) return;
    if ( fieldStatus.terrain.isPsychic() ) return;

    fieldStatus.terrain.getPsychic( pokemon );
  }

  const rapidSpin = ( pokemon: Pokemon ): void => {
    if ( !pokemon.move.selected.isName( 'こうそくスピン' )
      && !pokemon.move.selected.isName( 'キラースピン' ) ) return;
    if ( pokemon.stateChange.sheerForce.isTrue ) return;

    if ( pokemon.stateChange.ingrain.isTrue ) {
      pokemon.stateChange.ingrain.reset();
      writeLog( `` );
    }

    main.field.getSide( pokemon.isMine() ).resetSpikes();
    main.field.getSide( pokemon.isMine() ).resetToxicSpikes();
    main.field.getSide( pokemon.isMine() ).resetStealthRock();
    main.field.getSide( pokemon.isMine() ).resetStickyWeb();
  }

  const splinteredStormshards = ( pokemon: Pokemon ): void => {
    if ( !pokemon.move.selected.isName( 'ラジアルエッジストーム' ) ) return;
    main.field.terrain.resetWithMessage();
  }

  const scald = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !pokemon.move.selected.isName( 'ねっとう' )
      && !pokemon.move.selected.isName( 'スチームバースト' ) ) return;
    if ( attack.substitute ) return;
    if ( pokemon.stateChange.sheerForce.isTrue ) return;

    target.statusAilment.getHealth();
  }

  const hydroSteam = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !pokemon.move.selected.isName( 'ハイドロスチーム' ) ) return;
    if ( attack.substitute ) return;

    target.statusAilment.getHealth();
  }

  const smellingSalts = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !pokemon.move.selected.isName( 'きつけ' ) ) return;
    if ( attack.substitute ) return;
    if ( !target.statusAilment.isParalysis() ) return;

    target.statusAilment.getHealth();
  }

  const wakeUpSlap = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !pokemon.move.selected.isName( 'めざましビンタ' ) ) return;
    if ( attack.substitute ) return;
    if ( !target.statusAilment.isAsleep() ) return;

    target.statusAilment.getHealth();
  }

  const sparklingAria = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !pokemon.move.selected.isName( 'うたかたのアリア' ) ) return;
    if ( pokemon.stateChange.sheerForce.isTrue ) return;
    if ( !target.statusAilment.isBurned() ) return;

    /*
    for ( const data of targetList ) {
      if ( data.target.item.isName( 'おんみつマント' ) === true ) continue;
      if ( data.target.ability.isName( 'りんぷん' ) && targetList.length === 1 ) continue;

      cureAilment( data.target, 'ASLEEP' );
    }
    */

    target.statusAilment.getHealth();
  }

  const eerieSpell = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !pokemon.move.selected.isName( 'ぶきみなじゅもん' ) ) return;
    if ( !pokemon.isAdditionalEffect( target, attack ) ) return;

    // writeLog( `${getArticle( one.target)}の ${}を ${}削った!` );
  }



  // 炎技を受けたポケモンの氷を溶かす
  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    if ( !pokemon.move.selected.isType( 'Fire' ) ) return;
    if ( pokemon.move.selected.isStatus() ) return;
    if ( target.status.hp.value.isZero() ) return;

    target.statusAilment.getHealth();
  }

  // 以下の効果は攻撃側が瀕死なら発動しない
  if ( pokemon.order.battle === null ) return;

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    recoil( pokemon, attack );                // 反動技による反動ダメージ
    bind( pokemon, target, attack );          // バインド状態
    secretPower( pokemon, target, attack );   // ひみつのちからの追加効果
    fellStinger( pokemon, target );           // とどめばり
    knockOff( pokemon, target, attack );      // はたきおとす
    thief( pokemon, target, attack );         // どろぼう、ほしがる
    bugBite( pokemon, target, attack );       // むしくい、ついばむ
    smackDown( pokemon, target, attack );     // うちおとす、サウザンアロー
    thousandWaves( pokemon, target );         // サウザンウェーブ
    jawLock( pokemon, target, attack );       // くらいつく
    plasmaFists( pokemon );                   // プラズマフィスト
    genesisSupernova( pokemon );              // オリジンズスーパーノヴァ
    rapidSpin( pokemon );                     // こうそくスピン、キラースピン
    splinteredStormshards( pokemon );         // ラジアルエッジストーム
    scald( pokemon, target, attack );         // ねっとう、スチームバースト
    hydroSteam( pokemon, target, attack );    // ハイドロスチーム
    smellingSalts( pokemon, target, attack ); // きつけ
    wakeUpSlap( pokemon, target, attack );    // めざましビンタ
    sparklingAria( pokemon, target, attack ); // うたかたのアリア
    eerieSpell( pokemon, target, attack );    // ぶきみなじゅもん
  }
}

// 特性の効果（その1）
function activateAbilityEffectPart1( pokemon: Pokemon ): void {

  const magician = ( pokemon: Pokemon ): void => {
    if ( !pokemon.ability.isName( 'マジシャン' ) ) return;
    if ( pokemon.item.isNull() ) return;
    if ( pokemon.move.selected.isStatus() ) return;
    if ( pokemon.move.selected.isName( 'なげつける' ) ) return;
    if ( pokemon.move.selected.isName( 'しぜんのめぐみ' ) ) return;
    if ( pokemon.move.selected.isName( 'みらいよち' ) ) return;
    if ( pokemon.move.selected.isName( 'はめつのねがい' ) ) return;

    for ( const attack of pokemon.attack.getTargetToPokemon() ) {
      const target: Pokemon = main.getPokemonByBattle( attack );
      if ( attack.substitute ) return;
      if ( !pokemon.item.isReleasable( pokemon.name, pokemon.ability.name ) ) return;
      if ( !target.item.isReleasable( target.name, target.ability.name ) ) return;
      if ( target.ability.isName( 'ねんちゃく' ) && target.order.battle !== null ) return;
    }

  }

  const moxie = ( pokemon: Pokemon ): void => {
    if ( !pokemon.ability.isName( 'じしんかじょう' ) ) return;

    let number: number = 0;
    for ( const attack of pokemon.attack.getTargetToPokemon() ) {
      const target: Pokemon = main.getPokemonByBattle( attack );
      if ( target.status.hp.value.isZero() ) {
        number += 1;
      }
    }
    if ( !pokemon.isChangeRank( 'atk', number ) ) return;

    pokemon.msgDeclareAbility();
    pokemon.changeRank( 'atk', number );
  }

  const beastBoost = ( pokemon: Pokemon ): void => {
    if ( !pokemon.ability.isName( 'ビーストブースト' ) ) return;

    let number: number = 0;
    for ( const attack of pokemon.attack.getTargetToPokemon() ) {
      const target: Pokemon = main.getPokemonByBattle( attack );
      if ( target.status.hp.value.isZero() ) {
        number += 1;
      }
    }

    const statusValue: { status: RankStrings, value: number }[] = [
      { status: 'atk', value: pokemon.status.atk.value },
      { status: 'def', value: pokemon.status.def.value },
      { status: 'spA', value: pokemon.status.spA.value },
      { status: 'spD', value: pokemon.status.spD.value },
      { status: 'spe', value: pokemon.status.spe.value },
    ]

    statusValue.sort( ( a, b ) => {
      if ( a.value > b.value ) return 1;
      if ( a.value < b.value ) return -1;
      if ( getRandom() > 50 ) return 1;
      else return -1;
    })

    const status: RankStrings = statusValue[0].status;
    const value: number = statusValue[0].value;

    if ( !pokemon.isChangeRank( status, number ) ) return;

    pokemon.msgDeclareAbility();
    pokemon.changeRank( status, number );
  }

  const grimNeigh = ( pokemon: Pokemon ): void => {
    if ( !pokemon.ability.isName( 'くろのいななき' ) ) return;

    let number: number = 0;
    for ( const attack of pokemon.attack.getTargetToPokemon() ) {
      const target: Pokemon = main.getPokemonByBattle( attack );
      if ( target.status.hp.value.isZero() ) {
        number += 1;
      }
    }
    if ( !pokemon.isChangeRank( 'spA', number ) ) return;

    pokemon.msgDeclareAbility();
    pokemon.changeRank( 'spA', number );
  }

  const chillingNeigh = ( pokemon: Pokemon ): void => {
    if ( !pokemon.ability.isName( 'しろのいななき' ) ) return;

    let number: number = 0;
    for ( const attack of pokemon.attack.getTargetToPokemon() ) {
      const target: Pokemon = main.getPokemonByBattle( attack );
      if ( target.status.hp.value.isZero() ) {
        number += 1;
      }
    }
    if ( !pokemon.isChangeRank( 'atk', number ) ) return;

    pokemon.msgDeclareAbility();
    pokemon.changeRank( 'atk', number );
  }

  const colorChange = ( pokemon: Pokemon, target: Pokemon ): void => {
    if ( !target.ability.isName( 'へんしょく' ) ) return;
    if ( pokemon.move.selected.isStatus() ) return;
    if ( target.type.has( pokemon.move.selected.type ) ) return;
    if ( pokemon.move.selected.isName( 'わるあがき' ) ) return;
    if ( pokemon.move.selected.type === null ) return;
    if ( pokemon.stateChange.sheerForce.isTrue ) return;

    const type: PokemonType = pokemon.move.selected.type;
    target.msgDeclareAbility();
    target.type.toType( type );
    target.msgColorChange( type );
  }

  const berserk = ( pokemon: Pokemon, target: Pokemon ): void => {
    if ( !target.ability.isName( 'ぎゃくじょう' ) ) return;

  }

  const angerShell = ( pokemon: Pokemon, target: Pokemon ): void => {
    if ( !target.ability.isName( 'いかりのこうら' ) ) return;

  }




  if ( pokemon.order.battle === null ) return;

  const targetPokemon: Pokemon[] = [ pokemon ];

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );
    targetPokemon.push( target );
  }

  targetPokemon.sort( ( a, b ) => {
    // 素早さ
    if ( a.status.spe.actionOrder > b.status.spe.actionOrder ) return 1;
    if ( a.status.spe.actionOrder < b.status.spe.actionOrder ) return -1;
    // 乱数
    if ( getRandom() > 50 ) return 1;
    else return -1;
  })

  for ( const target of targetPokemon ) {

    // 攻撃側
    if ( isSame( pokemon, target ) ) {
      magician( target );      // マジシャン
      moxie( target );         // じしんかじょう
      beastBoost( target );    // ビーストブースト
      grimNeigh( target );     // くろのいななき
      chillingNeigh( target ); // しろのいななき
    }

    // 防御側
    if ( !isSame( pokemon, target ) ) {
      colorChange( pokemon, target ); // へんしょく
      berserk( pokemon, target );     // ぎゃくじょう
      angerShell( pokemon, target );  // いかりのこうら
    }
  }
}

// 防御側の持ち物の効果 (その4)
function targetItemEffectPart3( pokemon: Pokemon ): void {

  const keeBerry = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !target.item.isName( 'アッキのみ' ) ) return;
    if ( !pokemon.move.selected.isPhysical() ) return;
    if ( attack.substitute ) return;
    if ( !target.isChangeRank( 'def', 1 ) ) return;
    if ( pokemon.stateChange.sheerForce.isTrue ) return;

    target.eatKeeBerry();
  }

  const marangaBerry = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !target.item.isName( 'タラプのみ' ) ) return;
    if ( !pokemon.move.selected.isSpecial() ) return;
    if ( attack.substitute ) return;
    if ( !target.isChangeRank( 'spD', 1 ) ) return;
    if ( pokemon.stateChange.sheerForce.isTrue ) return;

    target.eatMarangaBerry();
  }

  const ejectButton = ( pokemon: Pokemon, target: Pokemon, attack: Attack ): void => {
    if ( !target.item.isName( 'だっしゅつボタン' ) ) return;

  }



  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    keeBerry( pokemon, target, attack );     // アッキのみ
    marangaBerry( pokemon, target, attack ); // タラプのみ
    ejectButton( pokemon, target, attack );  // だっしゅつボタン

  }
}

// いにしえのうた/きずなへんげによるフォルムチェンジ
function formChangeByMove( pokemon: Pokemon ): void {

  const relicSong = ( pokemon: Pokemon ) => {
    if ( !pokemon.move.selected.isName( 'いにしえのうた' ) ) return;
    if ( !pokemon.isName( 'メロエッタ(ボイス)' ) && !pokemon.isName( 'メロエッタ(ステップ)' ) ) return;
    if ( pokemon.stateChange.sheerForce.isTrue ) return;
    if ( pokemon.status.hp.value.isZero() ) return;

    pokemon.formChange();
    pokemon.msgRelicSong();
  }

  const battleBond = ( pokemon: Pokemon ) => {
    if ( !pokemon.ability.isName( 'きずなへんげ' ) ) return;
    if ( !pokemon.isName( 'サトシゲッコウガ' ) ) return;
    if ( !pokemon.isChangeRank( 'atk', 1 )
      && !pokemon.isChangeRank( 'spA', 1 )
      && !pokemon.isChangeRank( 'spe', 1 ) ) return;

    let number: number = 0;
    for ( const attack of pokemon.attack.getTargetToPokemon() ) {
      const target: Pokemon = main.getPokemonByBattle( attack );
      if ( target.status.hp.value.isZero() ) {
        number += 1;
      }
    }
    if ( number === 0 ) return;

    pokemon.changeRank( 'atk', 1 );
    pokemon.changeRank( 'spA', 1 );
    pokemon.changeRank( 'spe', 1 );
    pokemon.msgDeclareAbility();
    pokemon.msgBattleBond();
  }


  relicSong( pokemon ); // いにしえのうた
  battleBond( pokemon ); // きずなへんげ
}

// いのちのたまの反動/かいがらのすずの回復
function lifeOrbShellBell( pokemon: Pokemon ): void {

  const lifeOrb = ( pokemon: Pokemon ): void => {
    if ( !pokemon.item.isName( 'いのちのたま' ) ) return;
    if ( pokemon.status.hp.value.isZero() ) return;
    if ( pokemon.move.selected.isStatus() ) return;
    if ( pokemon.order.battle === null ) return;
    if ( pokemon.ability.isName( 'マジックガード' ) ) return;
    if ( pokemon.stateChange.sheerForce.isTrue ) return;

    const damage: number = Math.max( 1, Math.floor( pokemon.getOrgHP() / 10 ) );
    pokemon.status.hp.value.sub( damage );
    pokemon.msgLifeOrb();
  }

  const shellBell = ( pokemon: Pokemon ): void => {
    if ( !pokemon.item.isName( 'かいがらのすず' ) ) return;
    if ( pokemon.status.hp.value.isZero() ) return;
    if ( pokemon.order.battle === null ) return;
    if ( pokemon.stateChange.sheerForce.isTrue ) return;

    let value: number = 0;
    for ( const attack of pokemon.attack.getTargetToPokemon() ) {
      value += attack.damage;
    }
    if ( value === 0 ) return;

    const damage: number = Math.max( 1, Math.floor( value / 8 ) );
    pokemon.status.hp.value.add( damage );
    pokemon.msgShellBell();
  }


  lifeOrb( pokemon );   // いのちのたま
  shellBell( pokemon ); // かいがらのずず
}

// 防御側の持ち物の効果 (その4)
function targetItemEffectPart4( pokemon: Pokemon ): void {

  const oranBerry = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'オボンのみ' ) ) return;
    if ( !target.isActivateBerryByHP( 2 ) ) return;
    if ( target.stateChange.healBlock.isTrue ) return;

    target.eatOranBerry();
    target.consumeItem();
  }

  const sitrusBerry = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'オボンのみ' ) ) return;
    if ( !target.isActivateBerryByHP( 2 ) ) return;
    if ( target.stateChange.healBlock.isTrue ) return;

    target.eatSitrusBerry();
    target.consumeItem();
  }

  const figyBerry = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'フィラのみ' ) ) return;
    if ( !target.isActivateBerryByHP( 4 ) ) return;
    if ( target.stateChange.healBlock.isTrue ) return;

    target.eatFigyBerry();
    target.consumeItem();
  }

  const wikiBerry = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'ウイのみ' ) ) return;
    if ( !target.isActivateBerryByHP( 4 ) ) return;
    if ( target.stateChange.healBlock.isTrue ) return;

    target.eatWikiBerry();
    target.consumeItem();
  }

  const magoBerry = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'マゴのみ' ) ) return;
    if ( !target.isActivateBerryByHP( 4 ) ) return;
    if ( target.stateChange.healBlock.isTrue ) return;

    target.eatMagoBerry();
    target.consumeItem();
  }

  const aguavBerry = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'バンジのみ' ) ) return;
    if ( !target.isActivateBerryByHP( 4 ) ) return;
    if ( target.stateChange.healBlock.isTrue ) return;

    target.eatAguavBerry();
    target.consumeItem();
  }

  const iapapaBerry = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'イアのみ' ) ) return;
    if ( !target.isActivateBerryByHP( 4 ) ) return;
    if ( target.stateChange.healBlock.isTrue ) return;

    target.eatIapapaBerry();
    target.consumeItem();
  }

  const liechiBerry = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'チイラのみ' ) ) return;
    if ( !target.isActivateBerryByHP( 4 ) ) return;
    if ( !target.isChangeRank( 'atk', 1 ) ) return;

    target.eatLiechiBerry();
    target.consumeItem();
  }

  const ganlonBerry = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'リュガのみ' ) ) return;
    if ( !target.isActivateBerryByHP( 4 ) ) return;
    if ( !target.isChangeRank( 'def', 1 ) ) return;

    target.eatGanlonBerry();
    target.consumeItem();
  }

  const salacBerry = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'カムラのみ' ) ) return;
    if ( !target.isActivateBerryByHP( 4 ) ) return;
    if ( !target.isChangeRank( 'spe', 1 ) ) return;

    target.eatSalacBerry();
    target.consumeItem();
  }

  const petayaBerry = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'ヤタピのみ' ) ) return;
    if ( !target.isActivateBerryByHP( 4 ) ) return;
    if ( !target.isChangeRank( 'spA', 1 ) ) return;

    target.eatPetayaBerry();
    target.consumeItem();
  }

  const apicotBerry = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'ズアのみ' ) ) return;
    if ( !target.isActivateBerryByHP( 4 ) ) return;
    if ( !target.isChangeRank( 'spD', 1 ) ) return;

    target.eatApicotBerry();
    target.consumeItem();
  }

  const lansatBerry = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'サンのみ' ) ) return;
    if ( !target.isActivateBerryByHP( 4 ) ) return;
    if ( target.stateChange.focusEnergy.isTrue ) return;

    target.eatLansatBerry();
    target.consumeItem();
  }

  const starfBerry = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'スターのみ' ) ) return;
    if ( !target.isActivateBerryByHP( 4 ) ) return;
    if ( !target.isChangeRank( 'atk', 2 )
      && !target.isChangeRank( 'def', 2 )
      && !target.isChangeRank( 'spA', 2 )
      && !target.isChangeRank( 'spD', 2 )
      && !target.isChangeRank( 'spe', 2 ) ) return;

    target.eatStarfBerry();
    target.consumeItem();
  }

  const micleBerry = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'ミクルのみ' ) ) return;
    if ( !target.isActivateBerryByHP( 4 ) ) return;

    target.eatMicleBerry();
    target.consumeItem();
  }

  const berryJuice = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'きのみジュース' ) ) return;
    if ( !target.isActivateBerryByHP( 2 ) ) return;
    if ( pokemon.stateChange.healBlock.isTrue ) return;

    target.eatBerryJuice();
    target.consumeItem();
  }

  const electricSeed = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'エレキシード' ) ) return;
    if ( !main.field.terrain.isElectric() ) return;
    if ( !target.isChangeRank( 'def', 1 ) ) return;

    target.changeRank( 'def', 1, 'エレキシード' );
    target.consumeItem();
  }

  const grassySeed = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'グラスシード' ) ) return;
    if ( !main.field.terrain.isGrassy() ) return;
    if ( !target.isChangeRank( 'def', 1 ) ) return;

    target.changeRank( 'def', 1, 'グラスシード' );
    target.consumeItem();
  }

  const psychicSeed = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'サイコシード' ) ) return;
    if ( !main.field.terrain.isPsychic() ) return;
    if ( !target.isChangeRank( 'spD', 1 ) ) return;

    target.changeRank( 'spD', 1, 'サイコシード' );
    target.consumeItem();
  }

  const mistySeed = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'ミストシード' ) ) return;
    if ( !main.field.terrain.isMisty() ) return;
    if ( !target.isChangeRank( 'spD', 1 ) ) return;

    target.changeRank( 'spD', 1, 'ミストシード' );
    target.consumeItem();
  }

  const roomService = ( target: Pokemon ): void => {
    if ( !target.item.isName( 'ルームサービス' )  ) return;
    if ( main.field.whole.trickRoom.isTrue ) return;
    if ( !target.isChangeRank( 'spe', -1 ) ) return;

    target.changeRank( 'spe', -1, 'ルームサービス' );
    target.consumeItem();
  }





  const targetList: { target: Pokemon, attack: Attack }[] = [];
  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );
    targetList.push( { target: target, attack: attack } )
  }
  targetList.sort( ( a, b ) => {
    if ( a.target.status.spe.actionOrder > b.target.status.spe.actionOrder ) return 1;
    if ( a.target.status.spe.actionOrder < b.target.status.spe.actionOrder ) return -1;

    if ( getRandom() > 50 ) return 1;
    else return -1;
  })


  for ( const row of targetList ) {
    const target: Pokemon = row.target;
    const attack: Attack = row.attack;

    if ( target.status.hp.value.isZero() ) continue;

    oranBerry( target );   // オレンのみ
    sitrusBerry( target ); // オボンのみ
    figyBerry( target );   // フィラのみ
    wikiBerry( target );   // ウイのみ
    magoBerry( target );   // マゴのみ
    aguavBerry( target );  // バンジのみ
    iapapaBerry( target ); // イアのみ
    liechiBerry( target ); // チイラのみ
    ganlonBerry( target ); // リュガのみ
    salacBerry( target );  // カムラのみ
    petayaBerry( target ); // ヤタピのみ
    apicotBerry( target ); // ズアのみ
    lansatBerry( target ); // サンのみ
    micleBerry( target );  // ミクルのみ
    berryJuice( target );  // きのみジュース

    if ( attack.damage === 0 ) continue;

    electricSeed( target ); // エレキシード
    grassySeed( target );   // グラスシード
    psychicSeed( target );  // サイコシード
    mistySeed( target );    // ミストシード
    roomService( target );  // ルームサービス
  }
}

// わるいてぐせ
function activatePickpocket( pokemon: Pokemon ): void {

  const targetList: { target: Pokemon, attack: Attack }[] = [];
  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );
    targetList.push( { target: target, attack: attack } )
  }
  targetList.sort( ( a, b ) => {
    if ( a.target.status.spe.actionOrder > b.target.status.spe.actionOrder ) return 1;
    if ( a.target.status.spe.actionOrder < b.target.status.spe.actionOrder ) return -1;

    if ( getRandom() > 50 ) return 1;
    else return -1;
  })

  for ( const row of targetList ) {
    const target: Pokemon = row.target;
    const attack: Attack = row.attack;

    if ( !target.ability.isName( 'わるいてぐせ' ) ) continue;
    if ( !pokemon.isContact() ) continue;
    if ( target.item.isNull() ) continue;
    if ( !pokemon.item.isNull() ) continue;
    if ( !target.item.isReleasable( target.name, target.ability.name ) ) continue;
    if ( pokemon.stateChange.sheerForce.isTrue ) continue;
    if ( pokemon.ability.isName( 'ねんちゃく' ) ) continue;
    if ( attack.substitute ) continue;

    [ pokemon.item, target.item ] = [ target.item, pokemon.item ];

    target.msgDeclareAbility();
    target.msgPickpocket();
  }
}

// 技の効果
function otherEffect( pokemon: Pokemon ): void {

  if ( pokemon.move.selected.isName( 'もえつきる' ) ) {
    // if ( pokemon.type1 === 'FIRE' ) pokemon.type1 = null;
    // if ( pokemon.type2 === 'FIRE' ) pokemon.type2 = null;

    writeLog( `${getArticle( pokemon )}の 炎は 燃え尽きた!` );
  }

  naturalGift:
  if ( pokemon.move.selected.isName( 'しぜんのめぐみ' ) ) {
    if ( pokemon.order.battle === null ) break naturalGift;

    pokemon.consumeItem();
  }

  if ( pokemon.move.selected.isName( 'アイアンローラー' ) ) {
    fieldStatus.terrain.resetWithMessage();
  }

  iceSpinner:
  if ( pokemon.move.selected.isName( 'アイススピナー' ) ) {
    if ( pokemon.order.battle === null ) break iceSpinner;

    main.field.terrain.resetWithMessage();
  }
}

// 攻撃側の持ち物の効果
function myItemEffect( pokemon: Pokemon ): void {

  const leppaBerry = ( pokemon: Pokemon ): void => {
    if ( !pokemon.item.isName( 'ヒメリのみ' ) ) return;
    if ( pokemon.move.learned[pokemon.move.selected.slot].powerPoint.isPlus() ) return;

    pokemon.eatLeppaBerry();
    pokemon.consumeItem();
  }

  const throatSpray = ( pokemon: Pokemon ): void => {
    if ( !pokemon.item.isName( 'のどスプレー' ) ) return;
    if ( !pokemon.isChangeRank( 'spA', 1 ) ) return;
    if ( pokemon.attack.getTargetToPokemon().length === 0 ) return;
    if ( pokemon.order.battle === null ) return;

    pokemon.changeRank( 'spA', 1, 'のどスプレー' );
    pokemon.consumeItem();
  }

  leppaBerry( pokemon );  // ヒメリのみ
  throatSpray( pokemon ); // のどスプレー
}
