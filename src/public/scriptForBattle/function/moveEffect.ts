function moveEffect( pokemon: Pokemon ): void {

  if ( !pokemon.move.selected.isStatus() ) {
    // シングルバトルの場合
    if ( fieldStatus.battleStyle === 1 ) {
      const damage: Damage = pokemon.damage[0];
      const target: Pokemon | false = getPokemonByBattle( damage.isMe, damage.battle );
      if ( target === false ) return;

      // 対象全員へのダメージ計算
      calculateDamageForAll( pokemon, target, damage );
      // みがわり状態に攻撃技が防がれたときの効果: 本体がダメージを受けたとき(4)~(10)などより優先して処理される
      // じばく/だいばくはつ/ミストバースト/ビックリヘッド/てっていこうせん使用時のダメージ: ひんしになるときは使用者のひんし判定
      // ダメージを本体に与える
      damageToBody( target, damage );
      // バツグンの相性判定のメッセージ
      goodCompatibilityMessage( pokemon, target, damage );
      // 今ひとつの相性判定のメッセージ
      badCompatibilityMessage( pokemon, target, damage );
      // ダメージの判定に関するメッセージ
      damageDeterminationMessage( pokemon, target, damage );
      // ダメージをHP1で耐える効果のメッセージなど
      enduringEffectsMessage( target );
      // 追加効果などの発動
      activateAdditionalEffects( pokemon, target, damage );
      // ダメージが発生したときの効果
      effectsWhenDamageOccurs( pokemon, target, damage );
      // ひんし判定
      faintingJudgment( pokemon, target, 1 );
      faintingJudgment( pokemon, target, 2 );
      faintingJudgment( pokemon, target, 3 );
      faintingJudgment( pokemon, target, 4 );
      // ひんしできんちょうかん/かがくへんかガスが解除されたことによる封じられていた効果の発動
      activateSealedEffects( target );
      activateSealedEffects( pokemon );
    }
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
function calculateDamageForAll( pokemon: Pokemon, target: Pokemon, damage: Damage ): void {

  if ( isSubstitute( pokemon, target ) === true ) {
    damage.substitute = true;
  }

  // ばけのかわ/アイスフェイス
  if ( damage.substitute === false ) {
    if ( pokemon.name === 'ミミッキュ(化けた姿)' && target.ability.isName( 'ばけのかわ' ) ) {
      target.stateChange.disguise.isTrue = true;
      return;
    }
    if ( pokemon.name === 'コオリッポ(アイス)' && target.ability.isName( 'アイスフェイス' ) && pokemon.move.selected.isPhysical()  ) {
      target.stateChange.iceFace.isTrue = true;
      return;
    }
  }

  // ダメージ計算
  const finalDamage: number = calculateDamage( pokemon, target, damage );

  // ダメージ計算後の処理
  damage.damage = processAfterCalculation( pokemon, target, finalDamage, damage )
}

// ダメージを本体に与える
function damageToBody( target: Pokemon, damage: Damage ): void {

  target.status.hp.value.add( -1 * damage.damage );
  writeLog( `${damage.damage}の ダメージ!` );
}

// バツグンの相性判定のメッセージ
function goodCompatibilityMessage( pokemon: Pokemon, target: Pokemon, damage: Damage ): void {

  if ( damage.effective <= 1 ) return;

  if ( pokemon.damage.length === 1 ) {
    writeLog( `効果は バツグンだ!` );
  } else {
    writeLog( `${target.name}に 効果は バツグンだ!` );
  }
}

// 今ひとつの相性判定のメッセージ
function badCompatibilityMessage( pokemon: Pokemon, target: Pokemon, damage: Damage ): void {

  if ( damage.effective >= 1 ) return;

  if ( pokemon.damage.length === 1 ) {
    writeLog( `${target.name}に 効果は 今ひとつのようだ......` );
  } else {
    writeLog( `${target.name}に 効果は いまひとつだ` );
  }
}

// ダメージの判定に関するメッセージ
function damageDeterminationMessage( pokemon: Pokemon, target: Pokemon, damage: Damage ): void {

  if ( damage.critical === true ) {
    if ( pokemon.damage.length === 1 ) {
      writeLog( `急所に 当たった!` );
    } else {
      writeLog( `${target.name}の 急所に 当たった!` );
    }
  }
}

// ダメージをHP1で耐える効果のメッセージなど
function enduringEffectsMessage( target: Pokemon ): void {

  if ( target.stateChange.endureMsg.isTrue === false ) return;

  if ( target.stateChange.endureMsg.text === 'こらえる' ) {
    writeLog( `${target.name}は 攻撃を こらえた!` );
  }
  if ( target.stateChange.endureMsg.text === 'がんじょう' ) {
    target.declareAbility();
    writeLog( `${target.name}は 攻撃を こらえた!` );
  }
  if ( target.stateChange.endureMsg.text === 'きあいのタスキ' ) {
    recycleAvailable( target );
    writeLog( `${target.name}は きあいのタスキで 持ちこたえた!` );
  }
  if ( target.stateChange.endureMsg.text === 'きあいのハチマキ' ) {
    writeLog( `${target.name}は きあいのハチマキで 持ちこたえた!` );
  }

  target.stateChange.endureMsg.reset();
}

// 追加効果などの発動
function activateAdditionalEffects( pokemon: Pokemon, target: Pokemon, damage: Damage ): void {

  if ( pokemon.move.selected.name === 'なげつける' ) {
    pokemon.stateChange.fling.isTrue = true;
    const item: string | null = pokemon.item.name;
    if ( item !== null ) {
      pokemon.stateChange.flinch.text = item;
    }
    recycleAvailable( pokemon );
  }

  // 追加効果
  // 対象のランク変化
  for ( const move of additionalEffectTargetRank ) {
    if ( move.name === pokemon.move.selected.name ) {
      if ( isValidToTargetAdditionalEffect( pokemon, target, damage ) === false ) break;
      if ( isValidProbabilityAdditionalEffect( pokemon, move.rate ) === false ) break;

      let isTrue: boolean = false;
      for ( const parameter of Object.keys( move.change ) ) {
        if ( getRankVariation( target, parameter, move.change[parameter] ) !== 0 ) {
          isTrue = true;
        }
      }
      if ( isTrue === true ) {
        for ( const parameter of Object.keys( move.change ) ) {
          if ( move.change[parameter] === 0 ) continue;
          changeTargetRank( pokemon, target, parameter, move.change[parameter] );
        }
      }
    }
  }
  // 自分のランク変化
  for ( const move of additionalEffectMyRank ) {
    if ( move.name === pokemon.move.selected.name ) {
      if ( pokemon.stateChange.sheerForce.isTrue === true ) break;
      if ( isValidProbabilityAdditionalEffect( pokemon, move.rate ) === false ) break;

      let isTrue: boolean = false;
      for ( const parameter of Object.keys( move.change ) ) {
        if ( getRankVariation( pokemon, parameter, move.change[parameter] ) !== 0 ) {
          isTrue = true;
        }
      }
      if ( isTrue === true ) {
        for ( const parameter of Object.keys( move.change ) ) {
          if ( move.change[parameter] === 0 ) continue;
          changeMyRank( pokemon, parameter, move.change[parameter] );
        }
      }
    }
  }
  for ( const move of additionalEffectAilment ) {
    if ( move.name === pokemon.move.selected.name ) {
      if ( isValidToTargetAdditionalEffect( pokemon, target, damage ) === false ) break;
      if ( isValidProbabilityAdditionalEffect( pokemon, move.rate ) === false ) break;

      //giveAilment( pokemon, target, move.ailment );
    }
  }
  for ( const move of additionalEffectConfuse ) {
    if ( move.name === pokemon.move.selected.name ) {
      if ( isValidToTargetAdditionalEffect( pokemon, target, damage ) === false ) break;
      if ( isValidProbabilityAdditionalEffect( pokemon, move.rate ) === false ) break;

      giveConfuse( pokemon, target, 'additional' );
    }
  }
  for ( const move of additionalEffectFlinch ) {
    if ( move.name === pokemon.move.selected.name ) {
      if ( isValidToTargetAdditionalEffect( pokemon, target, damage ) === false ) break;
      if ( isValidProbabilityAdditionalEffect( pokemon, move.rate ) === false ) break;

      target.stateChange.flinch.isTrue = true;
    }
  }

  // その他の追加効果
  anchorShot:
  if ( pokemon.move.selected.name === 'アンカーショット' || pokemon.move.selected.name === 'かげぬい' ) {
    if ( isValidToTargetAdditionalEffect( pokemon, target, damage ) === false ) break anchorShot;
    if ( getPokemonType( target ).includes( 'GHOST' ) === true ) break anchorShot;
    if ( target.stateChange.cannotEscape.isTrue === true ) break anchorShot;

    giveCannotEscape( pokemon, target, pokemon.move.selected.name );
  }

  saltCure:
  if ( pokemon.move.selected.name === 'しおづけ' ) {
    if ( isValidToTargetAdditionalEffect( pokemon, target, damage ) === false ) break saltCure;
    if ( target.stateChange.saltCure.isTrue === true ) break saltCure;

    target.stateChange.saltCure.isTrue = true;
    writeLog( `${getArticle( target )}は しおづけに なった!` );
  }

  throatChop:
  if ( pokemon.move.selected.name === 'じごくづき' ) {
    if ( isValidToTargetAdditionalEffect( pokemon, target, damage ) === false ) break throatChop;
    if ( target.stateChange.throatChop.isTrue === true ) break throatChop;

    target.stateChange.throatChop.isTrue = true;
    target.stateChange.throatChop.turn = 2;
  }

  triAttack:
  if ( pokemon.move.selected.name === 'トライアタック' ) {
    if ( isValidToTargetAdditionalEffect( pokemon, target, damage ) === false ) break triAttack;
    if ( isValidProbabilityAdditionalEffect( pokemon, 20 ) === false ) break triAttack;

    const rate: number = getRandom();
    if ( rate < 100 / 3 ) {
      giveAilment( pokemon, target, 'PARALYSIS' );
    } else if ( rate < 200 / 3 ) {
      giveAilment( pokemon, target, 'BURNED' );
    } else {
      giveAilment( pokemon, target, 'FROZEN' );
    }
  }

  fling:
  if ( pokemon.move.selected.name === 'なげつける' ) {
    if ( isValidToTargetAdditionalEffect( pokemon, target, damage ) === false ) {
      pokemon.stateChange.fling.reset();
      break fling;
    }

    if ( pokemon.stateChange.fling.text === 'でんきだま' ) {
      giveAilment( pokemon, target, 'PARALYSIS' );
    }
    if ( pokemon.stateChange.fling.text === 'かえんだま' ) {
      giveAilment( pokemon, target, 'BURNED' );
    }
    if ( pokemon.stateChange.fling.text === 'どくバリ' ) {
      giveAilment( pokemon, target, 'POISONED' );
    }
    /*
    if ( pokemon.stateChange.fling.text === 'どくどくだま' ) {
      giveAilment( pokemon, target, 'sp-poisoned' );
    }
    */
    if ( pokemon.stateChange.fling.text === 'おうじゃのしるし' || pokemon.stateChange.fling.text === 'するどいキバ' ) {
      target.stateChange.flinch.isTrue = true;
    }
    if ( pokemon.stateChange.fling.text === 'しろいハーブ' ) {
      let isTrue = false;
      /*
      for ( const parameter of Object.keys( target.rank ) ) {
        if ( target.rank[parameter].isMinus() ) {
          isTrue = true;
          target.rank[parameter].toZero();
        }
      }
      if ( isTrue === true ) {
        writeLog( `${getArticle( target )}は しろいハーブで ステータスを 元に戻した!` );
      }
      */
    }
    for ( const berry of berryTable ) {
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
    }

    // なげつけたアイテムのデータを削除
    pokemon.stateChange.fling.reset();
  }

  direClaw:
  if ( pokemon.move.selected.name === 'フェイタルクロー' ) {
    if ( isValidToTargetAdditionalEffect( pokemon, target, damage ) === false ) break direClaw;
    if ( isValidProbabilityAdditionalEffect( pokemon, 50 ) === false ) break direClaw;

    const rate: number = getRandom();
    if ( rate < 100 / 3 ) {
      giveAilment( pokemon, target, 'POISONED' );
    } else if ( rate < 200 / 3 ) {
      giveAilment( pokemon, target, 'PARALYSIS' );
    } else {
      giveAilment( pokemon, target, 'ASLEEP' );
    }
  }

  // 自分のランクが下がる技の効果
  for ( const move of moveEffectMyRank ) {
    if ( move.name === pokemon.move.selected.name ) {
      let isTrue: boolean = false;
      for ( const parameter of Object.keys( move.change ) ) {
        if ( getRankVariation( pokemon, parameter, move.change[parameter] ) !== 0 ) {
          isTrue = true;
        }
      }
      if ( isTrue === true ) {
        for ( const parameter of Object.keys( move.change ) ) {
          if ( move.change[parameter] === 0 ) continue;
          changeMyRank( pokemon, parameter, move.change[parameter] );
        }
      }
    }
  }
  // HP吸収技
  for ( const move of absorbingMoveList ) {
    if ( move.name === pokemon.move.selected.name ) {
      const value = Math.round( damage.damage * move.rate )
      changeHPByMove( pokemon, target, value );
    }
  }
}

// ダメージが発生したときの効果
function effectsWhenDamageOccurs( pokemon: Pokemon, target: Pokemon, damage: Damage ) {

  rage:
  if ( target.stateChange.rage.isTrue === true ) {
    if ( damage.substitute === true ) break rage;
    if ( getRankVariation( target, 'attack', 1 ) === 0 ) break rage;
    changeMyRankByRage( target, 'attack', 1 );
  }

  clearSmog:
  if ( pokemon.move.selected.name === 'クリアスモッグ' ) {
    if ( damage.substitute === true ) break clearSmog;
    /*
    for ( const parameter of Object.keys( target.rank ) ) {
      target.rank[parameter].toZero();
    }
    */
    writeLog( `全ての ステータスが 元に 戻った!` );
  }

  grudge:
  if ( target.stateChange.grudge.isTrue === true ) {
    if ( !target.status.hp.value.isZero() ) break grudge;
    if ( pokemon.move.learned[pokemon.move.selected.slot].powerPoint.isZero() ) break grudge;
    pokemon.move.learned[pokemon.move.selected.slot].powerPoint.toZero();
    writeLog( `${getArticle( pokemon )}の ${pokemon.move.learned[pokemon.move.selected.slot].name}は おんねんで PPが0になった!` );
  }

  beakBlast:
  if ( target.stateChange.beakBlast.isTrue === true ) {
    if ( !pokemon.isContact() ) break beakBlast;
    if ( pokemon.move.selected.name === 'フリーフォール' ) break beakBlast;
    if ( damage.substitute === true ) break beakBlast;
    giveAilmentByBeakBlast( target, pokemon );
  }

  poisonTouch:
  if ( pokemon.ability.isName( 'どくしゅ' ) ) {
    if ( !pokemon.isContact() ) break poisonTouch;
    if ( damage.substitute === true ) break poisonTouch;
    if ( target.ability.isName( 'りんぷん' ) ) break poisonTouch;
    if ( getRandom() >= 30 ) break poisonTouch;
    if ( giveAilment( pokemon, target, 'POISONED', true ) ) {
      pokemon.declareAbility();
      writeLog( `${getArticle( target )}に 毒を あびせた!` );
    }
  }

  /*
  synchronize:
  if ( target.ability.isName( 'シンクロ' ) ) {
    if ( target.stateChange.synchronize.isTrue === false ) break synchronize;
    const ailment = target.stateChange.synchronize.name;
    if ( ailment === 'POISONED' || ailment === 'sp-poisoned' || ailment === 'BURNED' || ailment === 'PARALYSIS' ) {
      target.declareAbility();
      giveAilment( target, pokemon, ailment );
    }
    target.stateChange.synchronize.reset();
  }
  */

  // 直接攻撃を受けた時
  if ( pokemon.isContact() && damage.substitute === false ) {

    roughSkin:
    if ( target.ability.isName( 'さめはだ' ) || target.ability.isName( 'てつのトゲ' ) ) {
      target.declareAbility();

      if ( pokemon.item.isName( 'ぼうごパット' ) === true ) {
        writeLog( `${getArticle( pokemon )}は ぼうごパットで 防いだ!` );
        break roughSkin;
      }
      if ( pokemon.ability.isName( 'マジックガード' ) ) break roughSkin;

      const value = Math.max( 1, Math.floor( pokemon.status.hp.av / 8 ) );
      changeHPByAbility( pokemon, value, '-' );
      writeLog( `${getArticle( pokemon )}は 傷ついた!` );
    }

    effectSpore:
    if ( target.ability.isName( 'ほうし' ) ) {
      if ( getPokemonType( pokemon ).includes( 'GRASS' ) ) break effectSpore;
      if ( pokemon.ability.isName( 'ぼうじん' ) ) break effectSpore;
      if ( pokemon.item.isName( 'ぼうじんゴーグル' ) === true ) break effectSpore;
      if ( pokemon.item.isName( 'ぼうごパット' ) === true ) break effectSpore;
      if ( getRandom() >= 30 ) break effectSpore;

      target.declareAbility();

      const random: number = Math.floor( getRandom() * 0.3 );
      if ( random < 9  ) {
        giveAilment( target, pokemon, 'POISONED' );
      } else if ( random < 19 ) {
        giveAilment( target, pokemon, 'PARALYSIS' );
      } else {
        giveAilment( target, pokemon, 'ASLEEP' );
      }
    }

    poisonPoint:
    if ( target.ability.isName( 'どくのトゲ' ) ) {
      if ( pokemon.item.isName( 'ぼうごパット' ) === true ) break poisonPoint;
      if ( getRandom() > 30 ) break poisonPoint;

      target.declareAbility();
      giveAilment( target, pokemon, 'POISONED' );
    }

    staticElectricity:
    if ( target.ability.isName( 'せいでんき' ) ) {
      if ( pokemon.item.isName( 'ぼうごパット' ) === true ) break staticElectricity;
      if ( getRandom() > 30 ) break staticElectricity;

      target.declareAbility();
      giveAilment( target, pokemon, 'PARALYSIS' );
    }

    flameBody:
    if ( target.ability.isName( 'ほのおのからだ' ) ) {
      if ( pokemon.item.isName( 'ぼうごパット' ) === true ) break flameBody;
      if ( getRandom() > 30 ) break flameBody;

      target.declareAbility();
      giveAilment( target, pokemon, 'BURNED' );
    }

    atract:
    if ( target.ability.isName( 'メロメロボディ' ) ) {
      if ( pokemon.item.isName( 'ぼうごパット' ) === true ) break atract;
      if ( getRandom() >= 30 ) break atract;

      attractTarget( target, pokemon, 'メロメロボディ' );
    }

    mummy:
    if ( target.ability.isName( 'ミイラ' ) || target.ability.isName( 'とれないにおい' ) ) {
      for ( const ability of changeAbilityTable ) {
        if ( ability.name === pokemon.ability.name ) {
          if ( ability.noAbility === 0 || ability.noAbility === 2 ) {
            break mummy;
          }
        }
      }

      if ( pokemon.item.isName( 'ぼうごパット' ) === true ) {
        writeLog( `${getArticle( pokemon )}は ぼうごパットで 防いだ!` );
        break mummy;
      }

      target.declareAbility();
      pokemon.ability.name = target.ability.name;

      if ( target.ability.isName( 'ミイラ' ) ) {
        writeLog( `${getArticle( pokemon )}は とくせいが ミイラになっちゃった!` );
      }
      if ( target.ability.isName( 'とれないにおい' ) ) {
        writeLog( `${getArticle( pokemon )}は においが うつって とれなくなっちゃった!` );
      }
    }

    gooey:
    if ( target.ability.isName( 'ぬめぬめ' ) || target.ability.isName( 'カーリーヘアー' ) ) {
      if ( getRankVariation( pokemon, 'speed', -1 ) === 0 ) {
        writeLog( `${getArticle( pokemon )}の 素早さは もう 下がらない!` )
        break gooey;
      }

      target.declareAbility();

      if ( pokemon.item.isName( 'ぼうごパット' ) === true ) {
        writeLog( `${getArticle( pokemon )}は ぼうごパットで 防いだ!` );
        break gooey;
      }

      changeTargetRank( target, pokemon, 'speed', -1 );
    }

    wanderingSpirit:
    if ( target.ability.isName( 'さまようたましい' ) ) {
      if ( pokemon.item.isName( 'ぼうごパット' ) === true ) break wanderingSpirit;
      if ( pokemon.stateChange.dynamax.isTrue === true ) break wanderingSpirit;
      if ( target.stateChange.dynamax.isTrue === true ) break wanderingSpirit;

      for ( const ability of changeAbilityTable ) {
        if ( ability.name === pokemon.ability.name ) {
          if ( ability.exchange === 0 || ability.exchange === 2 ) {
            break wanderingSpirit;
          }
        }
      }

      target.declareAbility();
      //[ pokemon.ability, target.ability ] = [ target.ability, pokemon.ability ];
      writeLog( `${getArticle( target )}は おたがいの とくせいを 入れ替えた!` );

      if ( pokemon.isMe !== target.isMe ) {
        pokemon.declareAbility();
        target.declareAbility();
      }
    }

    perishBody:
    if ( target.ability.isName( 'ほろびのボディ' ) ) {
      if ( pokemon.status.hp.value.isZero() ) break perishBody;
      if ( pokemon.item.isName( 'ぼうごパット' ) === true ) break perishBody;
      if ( pokemon.stateChange.perishSong.isTrue === true && target.stateChange.perishSong.isTrue === true ) break perishBody;

      target.declareAbility();

      if ( pokemon.stateChange.perishSong.isTrue === true ) {
        writeLog( `${getArticle( target )}は 3ターン後に 滅びてしまう!` );
      } else if ( target.stateChange.perishSong.isTrue === true ) {
        writeLog( `${getArticle( pokemon )}は 3ターン後に 滅びてしまう!` );
      } else {
        writeLog( `おたがいは 3ターン後に 滅びてしまう!` );
      }

      if ( pokemon.stateChange.perishSong.isTrue === false ) {
        pokemon.stateChange.perishSong.isTrue = true;
        pokemon.stateChange.perishSong.count = 3;
      }
      if ( target.stateChange.perishSong.isTrue === false ) {
        target.stateChange.perishSong.isTrue = true;
        target.stateChange.perishSong.count = 3;
      }
    }
  }

  // 攻撃技を受けた時
  if ( damage.substitute === false ) {

    cursedBody:
    if ( target.ability.isName( 'のろわれボディ' ) ) {
      if ( pokemon.stateChange.disable.isTrue === true ) break cursedBody;
      if ( pokemon.stateChange.dynamax.isTrue === true ) break cursedBody;
      if ( isExistAbilityOneSide( pokemon.isMe, 'アロマベール' ) !== false ) break cursedBody;
      if ( getRandom() >= 30 ) break cursedBody;

      target.declareAbility();

      pokemon.stateChange.disable.isTrue = true;
      pokemon.stateChange.disable.turn = 4;
      pokemon.stateChange.disable.text = pokemon.move.selected.name;

      writeLog( `${getArticle( pokemon )}の ${pokemon.stateChange.disable.text}を 封じこめた!` );
    }

    stamina:
    if ( target.ability.isName( 'じきゅうりょく' ) ) {
      if ( getRankVariation( target, 'defense', 1 ) === 0 ) break stamina;

      target.declareAbility();
      changeMyRank( target, 'defense', 1 );
    }

    sandSpit:
    if ( target.ability.isName( 'すなはき' ) ) {
      if ( !fieldStatus.weather.isGetSandy() ) break sandSpit;

      target.declareAbility();
      fieldStatus.weather.getSandy( target );
    }

    cottonDown:
    if ( target.ability.isName( 'わたげ' ) ) {
      target.stateChange.memo.isTrue = true;
      target.stateChange.memo.text = 'わたげ';
      //target.stateChange.memo.target.isMe = pokemon.isMe;
      target.stateChange.memo.target.battle = pokemon.order.battle;

      const valid: Pokemon[] = []
      for ( const _pokemon of pokemonForCottonDown( pokemon ) ) {
        if ( _pokemon.stateChange.substitute.isTrue === true ) continue;
        if ( isHide( _pokemon ) === true ) continue;
        valid.push( _pokemon );
      }

      if ( valid.length > 0 ) {
        target.declareAbility();
        for ( const _pokemon of valid ) {
          changeTargetRank( target, _pokemon, 'speed', -1 );
        }
      }

      target.stateChange.memo.reset();
    }

    gulpMissile:
    if ( target.ability.isName( 'うのミサイル' ) ) {
      if ( target.name === 'ウッウ' ) break gulpMissile;
      if ( isHide( target ) === true ) break gulpMissile;
      if ( pokemon.status.hp.value.isZero() ) break gulpMissile;

      target.declareAbility()

      if ( pokemon.ability.isName( 'マジックガード' )  ) {
        const dynamax: number = ( pokemon.stateChange.dynamax.isTrue )? 0.5 : 1;
        const value: number = Math.max( 1, Math.floor( pokemon.status.hp.av * dynamax / 4 ) );
        changeHPByAbility( pokemon, value, '-' );
      }

      if ( target.name === 'ウッウ(鵜呑み)' ) {
        changeTargetRank( target, pokemon, 'defense', -1 )
      }
      if ( target.name === 'ウッウ(丸呑み)' ) {
        giveAilment( target, pokemon, 'PARALYSIS' )
      }

      formChange( pokemon );
    }

    seedSower:
    if ( target.ability.isName( 'こぼれダネ' ) ) {
      if ( fieldStatus.terrain.isGrassy() ) break seedSower;

      target.declareAbility();
      fieldStatus.terrain.getGrassy( target );
    }

    electromorphosis:
    if ( target.ability.isName( 'でんきにかえる' ) ) {
      if ( target.status.hp.value.isZero() ) break electromorphosis;

      target.declareAbility();
      activateCharge( target, pokemon.move.selected.name );
    }
  }

  // 物理技を受けた時
  if ( pokemon.move.selected.isPhysical() && damage.substitute === false ) {

    weakArmor:
    if ( target.ability.isName( 'くだけるよろい' ) ) {
      if ( getRankVariation( target, 'defense', -1 ) === 0 && getRankVariation( target, 'speed', 2 ) === 0 ) break weakArmor;

      target.declareAbility();
      changeMyRank( target, 'defense', -1 );
      changeMyRank( target, 'speed', 2 );
    }

    toxicDebris:
    if ( target.ability.isName( 'どくげしょう' ) ) {
      if ( fieldStatus.getSide( getOpponentTrainer( target.isMe ) ).toxicSpikes.count === 2 ) break toxicDebris;

      target.declareAbility();
      changeOpponentField( getOpponentTrainer( target.isMe ), 'どくびし', '+' );
    }
  }

  // 特定のタイプの攻撃技を受けた時
  if ( damage.substitute === false ) {

    waterCompaction:
    if ( target.ability.isName( 'みずがため' ) ) {
      if ( pokemon.move.selected.type !== 'WATER' ) break waterCompaction;
      if ( getRankVariation( target, 'defense', 2 ) === 0 ) break waterCompaction;

      target.declareAbility();
      changeMyRank( target, 'defense', 2 );
    }

    justified:
    if ( target.ability.isName( 'せいぎのこころ' ) ) {
      if ( pokemon.move.selected.type !== 'DARK' ) break justified;
      if ( getRankVariation( target, 'attack', 1 ) === 0 ) break justified;

      target.declareAbility();
      changeMyRank( target, 'attack', 1 );
    }

    rattled:
    if ( target.ability.isName( 'びびり' ) ) {
      if ( pokemon.move.selected.type !== 'DARK' && pokemon.move.selected.type !== 'GHOST' && pokemon.move.selected.type !== 'BUG' ) break rattled;
      if ( getRankVariation( target, 'speed', 1 ) === 0 ) break rattled;

      target.declareAbility();
      changeMyRank( target, 'speed', 1 );
    }

    steamEngine:
    if ( target.ability.isName( 'じょうききかん' ) ) {
      if ( pokemon.move.selected.type !== 'WATER' && pokemon.move.selected.type !== 'FIRE' ) break steamEngine;
      if ( getRankVariation( target, 'speed', 6 ) === 0 ) break steamEngine;

      target.declareAbility()
      changeMyRank( target, 'speed', 6 );
    }
  }

  // 風技を受けた時
  if ( windMoveList.includes( pokemon.move.selected.name ) === true && damage.substitute === false ) {

    windPower:
    if ( target.ability.isName( 'ふうりょくでんき' ) ) {
      target.declareAbility();
      activateCharge( target, pokemon.move.selected.name );
    }
  }

  // 急所に当たった時
  if ( damage.critical === true && damage.substitute === false ) {

    angerPoint:
    if ( target.ability.isName( 'いかりのつぼ' ) ) {
      target.declareAbility();
      target.status.atk.rank.add( 12 );
      writeLog( `${getArticle( target )}は 攻撃が 最大まで 上がった!` );
    }
  }

  // 防御側の持ち物の効果（その１）
  if ( target.stateChange.halfBerry.isTrue === true ) {
    writeLog( `${getArticle( target )}への ダメージを ${target.stateChange.halfBerry.text}が 弱めた!` );
    target.stateChange.halfBerry.reset();

    activateCheekPouch( target );
  }

  // 効果バツグンの技を受けた時
  effective:
  if ( damage.effective > 1 ) {
    if ( target.status.hp.value.isZero() ) break effective;
    if ( damage.substitute === true ) break effective;
    if ( damage.damage === 0 ) break effective;

    if ( target.item.isName( 'ナゾのみ' ) === true ) {
      eatBerry( target, 'ナゾのみ' );
    }

    if ( target.item.isName( 'じゃくてんほけん' ) === true ) {
      let isTrue: boolean = false;
      if ( getRankVariation( target, 'attack', 2 ) !== 0 ) isTrue = true;
      if ( getRankVariation( target, 'specialAttack', 2 ) !== 0 ) isTrue = true;

      if ( isTrue === true ) {
        changeMyRankByItem( target, 'attack', 2, 'じゃくてんほけん' );
        changeMyRankByItem( target, 'specialAttack', 2, 'じゃくてんほけん' );
        recycleAvailable( target );
      }
    }
  }

  // 特定のタイプの技を受けた時
  cellBattery:
  if ( target.item.isName( 'じゅうでんち' ) === true ) {
    if ( damage.substitute === true ) break cellBattery;
    if ( pokemon.move.selected.type !== 'ELECTRIC' ) break cellBattery;
    if ( getRankVariation( target, 'attack', 1 ) === 0 ) break cellBattery;

    changeMyRankByItem( target, 'attack', 1, 'じゅうでんち' );
    recycleAvailable( target );
  }

  snowball:
  if ( target.item.isName( 'ゆきだま' ) === true ) {
    if ( damage.substitute === true ) break snowball;
    if ( pokemon.move.selected.type !== 'ICE' ) break snowball;
    if ( getRankVariation( target, 'attack', 1 ) === 0 ) break snowball;

    changeMyRankByItem( target, 'attack', 1, 'ゆきだま' );
    recycleAvailable( target );
  }

  absorbBulb:
  if ( target.item.isName( 'きゅうこん' ) === true ) {
    if ( damage.substitute === true ) break absorbBulb;
    if ( pokemon.move.selected.type !== 'WATER' ) break absorbBulb;
    if ( getRankVariation( target, 'specialAttack', 1 ) === 0 ) break absorbBulb;

    changeMyRankByItem( target, 'specialAttack', 1, 'きゅうこん' );
    recycleAvailable( target );
  }

  luminousMoss:
  if ( target.item.isName( 'ひかりごけ' ) === true ) {
    if ( damage.substitute === true ) break luminousMoss;
    if ( pokemon.move.selected.type !== 'WATER' ) break luminousMoss;
    if ( getRankVariation( target, 'specialDefense', 1 ) === 0 ) break luminousMoss;

    changeMyRankByItem( target, 'specialDefense', 1, 'ひかりごけ' );
    recycleAvailable( target );
  }

  rockyHelmet:
  if ( target.item.isName( 'ゴツゴツメット' ) === true ) {
    if ( !pokemon.isContact() ) break rockyHelmet;
    if ( damage.substitute === true ) break rockyHelmet;
    if ( pokemon.item.isName( 'ぼうごパット' ) === true ) break rockyHelmet;
    if ( pokemon.ability.isName( 'マジックガード' ) ) break rockyHelmet;

    const dynamax: number = ( pokemon.stateChange.dynamax.isTrue )? 0.5 : 1;
    const value: number = Math.floor( pokemon.status.hp.av * dynamax / 8 );
    pokemon.status.hp.value.add( -1 * value );
    writeLog( `${getArticle( pokemon )}は ゴツゴツメットで ダメージを受けた!` );
  }

  stickyBarb:
  if ( target.item.isName( 'くっつきバリ' ) === true ) {
    if ( !pokemon.isContact() ) break stickyBarb;
    if ( damage.substitute === true ) break stickyBarb;
    if ( pokemon.item !== null ) break stickyBarb;

    [ pokemon.item, target.item ] = [ target.item, pokemon.item ];
  }

  airBalloon:
  if ( target.item.isName( 'ふうせん' ) === true ) {
    target.item.name = null;
    writeLog( `${getArticle( target )}の ふうせんが 割れた!` );
  }

  incinerate:
  if ( pokemon.move.selected.name === 'やきつくす' ) {
    if ( damage.substitute === true ) break incinerate;
    if ( target.ability.isName( 'ねんちゃく' ) ) break incinerate;

    let item: null | string = null;
    for ( const berry of berryTable ) {
      if ( berry.name === target.item.name ) {
        item = berry.name;
      }
    }
    for ( const gem of gemTable ) {
      if ( gem.name === target.item.name ) {
        item = gem.name;
      }
    }

    if ( item !== null ) {
      target.item.name = null;
      writeLog( `${getArticle( target )}の ${item}は 焼けてなくなった!` );
    }
  }

  // 防御側の持ち物の効果（その２）
  jabocaBerry:
  if ( target.item.isName( 'ジャポのみ' ) === true ) {
    if ( damage.substitute === true ) break jabocaBerry;
    if ( !pokemon.move.selected.isPhysical() ) break jabocaBerry;
    if ( pokemon.ability.isName( 'マジックガード' ) ) break jabocaBerry;
    if ( pokemon.status.hp.value.isZero() ) break jabocaBerry;

    const dynamax: number = ( pokemon.stateChange.dynamax.isTrue )? 0.5 : 1;
    const value: number = Math.floor( pokemon.status.hp.av * dynamax / 8 );
    pokemon.status.hp.value.add( -1 * value );
    writeLog( `${getArticle( target )}は ${getArticle( pokemon )}の ジャポのみで ダメージを 受けた!` );
  }

  rowapBerry:
  if ( target.item.isName( 'レンブのみ' ) === true ) {
    if ( damage.substitute === true ) break rowapBerry;
    if ( !pokemon.move.selected.isSpecial() ) break rowapBerry;
    if ( pokemon.ability.isName( 'マジックガード' ) ) break rowapBerry;
    if ( pokemon.status.hp.value.isZero() ) break rowapBerry;

    const dynamax: number = ( pokemon.stateChange.dynamax.isTrue )? 0.5 : 1;
    const value: number = Math.floor( pokemon.status.hp.av * dynamax / 8 );
    pokemon.status.hp.value.add( -1 * value );
    writeLog( `${getArticle( target )}は ${getArticle( pokemon )}の レンブのみで ダメージを 受けた!` );
  }

  // 防御側のばけのかわ/アイスフェイス
  if ( target.stateChange.disguise.isTrue === true ) {
    target.stateChange.disguise.reset();
    target.declareAbility();
    formChange( target );
    writeLog( `${getArticle( target )}の ばけのかわが はがれた!` );

    const dynamax: number = ( pokemon.stateChange.dynamax.isTrue )? 0.5 : 1;
    const value: number = Math.floor( pokemon.status.hp.av * dynamax / 8 );
    pokemon.status.hp.value.add( -1 * value );
  }
  if ( target.stateChange.iceFace.isTrue === true ) {
    target.stateChange.iceFace.reset();
    target.declareAbility();
    formChange( target );
    writeLog( `${getArticle( target )}の 姿が 変化した!` );
  }
}

// ひんし判定
function faintingJudgment( pokemon: Pokemon, target: Pokemon, number: number ): void {

  if ( number === 1 ) {
    if ( pokemon.move.selected.name === 'いのちがけ' ) {
      pokemon.status.hp.value.add( -1 * pokemon.status.hp.value.value );
      toReserve( pokemon );
    }
  }

  if ( number === 2 ) {
    if ( target.status.hp.value.isZero() ) {
      toReserve( target );
    }
  }

  if ( number === 3 ) {
    if ( pokemon.status.hp.value.isZero() ) {
      toReserve( pokemon );
    }
  }

  if ( number === 4 ) {
    destinyBond:
    if ( target.stateChange.destinyBond.isTrue === true ) {
      if ( target.status.hp.value.isZero() === false ) break destinyBond;
      if ( isFriend( pokemon, target ) === true ) break destinyBond;
      if ( pokemon.stateChange.dynamax.isTrue === true ) break destinyBond;

      writeLog( `${getArticle( target )}は 相手を 道連れに した!` );
      // writeLog( `${getArticle( target )}は 相手を 道連れに しようとしている!` );

      pokemon.status.hp.value.add( -1 * pokemon.status.hp.value.value );
      toReserve( pokemon );
    }
  }
}

// ひんしできんちょうかん/かがくへんかガスが解除されたことによる封じられていた効果の発動
function activateSealedEffects( pokemon: Pokemon ): void {

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

  const targetList: TargetDataType[] = getTargetList( pokemon );
  const one: TargetDataType = targetList[0];

  fire:
  if ( pokemon.move.selected.type === 'FIRE' ) {
    if ( pokemon.move.selected.isStatus() ) break fire;
    for ( const data of targetList ) {
      if ( data.target.status.hp.value.isZero() ) continue;
      cureAilment( data.target, 'FROZEN' );
    }
  }

  if ( pokemon.order.battle === null ) return;

  // 反動技による反動ダメージ
  recoil:
  if ( true ) {
    if ( pokemon.move.selected.name !== 'わるあがき' ) {
      if ( pokemon.ability.isName( 'マジックガード' ) ) break recoil;
      if ( pokemon.ability.isName( 'いしあたま' ) ) break recoil;
    }

    // 与ダメージ依存の反動技
    for ( const move of dependentRecoilMoveList ) {
      if ( move.name === pokemon.move.selected.name ) {
        if ( one.damage.damage === 0 ) break recoil;

        const value: number = Math.max( 1, Math.round( one.damage.damage * move.rate ) );
        pokemon.status.hp.value.add( -1 * value )
        writeLog( `${getArticle( pokemon )}は 反動による ダメージを 受けた!` );
      }
    }
    // 与ダメージ非依存の反動技
    for ( const move of independentRecoilMoveList ) {
      if ( move.name === pokemon.move.selected.name ) {
        const damage: number = Math.max( 1, Math.round( pokemon.status.hp.av * move.rate ) );
        pokemon.status.hp.value.add( -1 * damage );
        writeLog( `${getArticle( pokemon )}は 反動による ダメージを 受けた!` );
      }
    }

    if ( pokemon.status.hp.value.isZero() ) {
      toReserve( pokemon );
      activateSealedEffects( pokemon );
    }
  }

  // バインド状態
  bind:
  if ( bindMoveList.includes( pokemon.move.selected.name ) ) {
    let turn: number = 4;
    if ( getRandom() < 50 ) turn = 5;
    if ( pokemon.item.isName( 'ねばりのかぎづめ' ) === true ) turn = 7;

    for ( const data of targetList ) {
      if ( data.target.status.hp.value.isZero() ) continue;

      substitute:
      if ( data.damage.substitute === true ) {
        if ( pokemon.move.selected.name === 'キョダイサジン' ) break substitute;
        if ( pokemon.move.selected.name === 'キョダイヒャッカ' ) break substitute;
        continue;
      }

      if ( data.target.stateChange.bind.isTrue === true ) continue;

      data.target.stateChange.bind.isTrue = true;
      data.target.stateChange.bind.turn = turn;
      if ( pokemon.item.isName( 'しめつけバンド' ) === true ) {
        data.target.stateChange.bind.text = 'しめつけバンド';
      }

      if ( pokemon.move.selected.name === 'うずしお' ) {
        writeLog( `${getArticle( data.target )}は 渦の中に 閉じこめられた!` );
      }
      if ( pokemon.move.selected.name === 'からではさむ' ) {
        writeLog( `${getArticle( data.target )}は ${getArticle( pokemon )}の からに はさまれた!` );
      }
      if ( pokemon.move.selected.name === 'サンダープリズン' ) {
        writeLog( `${getArticle( data.target )}は ${getArticle( pokemon )}に 閉じこめられた!` );
      }
      if ( pokemon.move.selected.name === 'しめつける' ) {
        writeLog( `${getArticle( data.target )}は ${getArticle( pokemon )}に しめつけられた!` );
      }
      if ( pokemon.move.selected.name === 'すなじごく' ) {
        writeLog( `${getArticle( data.target )}は 砂じごくに 捕らわれた!` );
      }
      if ( pokemon.move.selected.name === 'トラバサミ' ) {
        writeLog( `${getArticle( data.target )}は トラバサミに 捕らわれた!` );
      }
      if ( pokemon.move.selected.name === 'ほのおのうず' ) {
        writeLog( `${getArticle( data.target )}は 炎の渦に 閉じこめられた!` );
      }
      if ( pokemon.move.selected.name === 'まきつく' ) {
        writeLog( `${getArticle( data.target )}は ${getArticle( pokemon )}に 巻きつかれた!` );
      }
      if ( pokemon.move.selected.name === 'マグマストーム' ) {
        writeLog( `${getArticle( data.target )}は マグマの渦に 閉じこめられた!` );
      }
      if ( pokemon.move.selected.name === 'まとわりつく' ) {
        writeLog( `${getArticle( data.target )}は ${getArticle( pokemon )}に まとわりつかれた!` );
      }
      // キョダイサジン・キョダイヒャッカのテキストは表示されない
    }
  }

  // ひみつのちからの追加効果
  secretPower:
  if ( pokemon.move.selected.name === 'ひみつのちから' ) {
    if ( one.target.status.hp.value.isZero() ) break secretPower;
    if ( isValidToTargetAdditionalEffect( pokemon, one.target, one.damage ) === false ) break secretPower;
    if ( isValidProbabilityAdditionalEffect( pokemon, 30 ) === false ) break secretPower;

    if ( fieldStatus.terrain.isElectric() ) {
      giveAilment( pokemon, one.target, 'PARALYSIS' );
    }
    if ( fieldStatus.terrain.isGrassy() ) {
      giveAilment( pokemon, one.target, 'ASLEEP' );
    }
    if ( fieldStatus.terrain.isPsychic() ) {
      if ( getRankVariation( one.target, 'speed', -1 ) !== 0 ) {
        changeTargetRank( one.target, pokemon, 'speed', -1 );
      }
    }
    if ( fieldStatus.terrain.isMisty() ) {
      if ( getRankVariation( one.target, 'specialAttack', -1 ) !== 0 ) {
        changeTargetRank( one.target, pokemon, 'specialAttack', -1 );
      }
    }
    if ( fieldStatus.terrain.isPlain() ) {
      giveAilment( pokemon, one.target, 'PARALYSIS' );
    }
  }

  fellStinger:
  if ( pokemon.move.selected.name === 'とどめばり' ) {
    if ( one.target.status.hp.value.isZero() === false ) break fellStinger;
    if ( getRankVariation( pokemon, 'attack', 3 ) === 0 ) break fellStinger;

    pokemon.declareAbility();
    changeMyRank( pokemon, 'attack', 3 );
  }

  knockOff:
  if ( pokemon.move.selected.name === 'はたきおとす' ) {
    if ( one.target.item === null ) break knockOff;
    if ( one.target.ability.isName( 'ねんちゃく' ) ) break knockOff;
    if ( one.damage.substitute === true ) break knockOff;

    writeLog( `${getArticle( pokemon )}は ${getArticle( one.target )}の ${one.target.item}を はたき落とした!` );
    one.target.item.name = null;
  }

  thief:
  if ( pokemon.move.selected.name === 'どろぼう' || pokemon.move.selected.name === 'ほしがる' ) {
    if ( pokemon.item !== null ) break thief;
    if ( one.target.item === null ) break thief;
    if ( one.damage.substitute === true ) break thief;
    if ( one.target.ability.isName( 'ねんちゃく' ) ) {
      one.target.declareAbility();
      writeLog( `${getArticle( one.target )}の 道具を 奪えない!` );
      break thief;
    }

    [ pokemon.item, one.target.item ] = [ one.target.item, pokemon.item ];
    writeLog( `${getArticle( pokemon )}は ${getArticle( one.target )}から ${pokemon.item}を 奪い取った!` );

    if ( isEnableEatBerry( pokemon ) === true ) {
      eatBerry( pokemon, pokemon.item.name );
    }
  }

  bugBite:
  if ( pokemon.move.selected.name === 'むしくい' || pokemon.move.selected.name === 'ついばむ' ) {
    if ( pokemon.item !== null ) break bugBite;
    if ( one.target.item === null ) break bugBite;
    if ( one.damage.substitute === true ) break bugBite;
    if ( one.target.ability.isName( 'ねんちゃく' ) ) break bugBite;

    for ( const berry of berryTable ) {
      if ( berry.name === one.target.item.name ) {
        pokemon.stateChange.memo.isTrue = true;
        pokemon.stateChange.memo.text = 'むしくい';
        one.target.item.name = null;
        writeLog( `${getArticle( pokemon )}は ${berry.name}を 奪って 食べた!` );
        eatBerry( pokemon, berry.name );
        // ゲップ
        pokemon.stateChange.belch.isTrue = true;
        // ほおぶくろ
        if ( pokemon.stateChange.memo.count > 0 ) {
          activateCheekPouch( pokemon );
        }
        pokemon.stateChange.memo.reset();
      }
    }
  }

  smackDown:
  if ( pokemon.move.selected.name === 'うちおとす' || pokemon.move.selected.name === 'サウザンアロー' ) {
    for ( const data of targetList ) {
      if ( data.target.status.hp.value.isZero() ) continue;
      if ( data.damage.substitute === true ) continue;
      if ( isGrounded( data.target ) === true ) continue;

      one.target.stateChange.magnetRise.reset();
      one.target.stateChange.telekinesis.reset();
      writeLog( `${getArticle( one.target )}は 撃ち落とされて 地面に 落ちた!` );
      one.target.stateChange.smackDown.isTrue = true;
    }
  }

  thousandWaves:
  if ( pokemon.move.selected.name === 'サウザンウェーブ' ) {
    for ( const data of targetList ) {
      if ( data.target.status.hp.value.isZero() ) continue;
      if ( getPokemonType( data.target ).includes( 'GHOST' ) === true ) continue;
      if ( data.target.stateChange.cannotEscape.isTrue === true ) continue;

      giveCannotEscape( pokemon, data.target, pokemon.move.selected.name );
    }
  }

  jawLock:
  if ( pokemon.move.selected.name === 'くらいつく' ) {
    if ( one.target.status.hp.value.isZero() ) break jawLock;
    if ( one.damage.substitute === true ) break jawLock;
    if ( pokemon.stateChange.cannotEscape.isTrue === true ) break jawLock;
    if ( one.target.stateChange.cannotEscape.isTrue === true ) break jawLock;
    if ( getPokemonType( pokemon ).includes( 'GHOST' ) === true ) break jawLock;
    if ( getPokemonType( one.target ).includes( 'GHOST' ) === true ) break jawLock;

    giveCannotEscape( pokemon, one.target, pokemon.move.selected.name );
  }

  plasmaFists:
  if ( pokemon.move.selected.name === 'プラズマフィスト' ) {
    if ( pokemon.status.hp.value.isZero() ) break plasmaFists;

    fieldStatus.whole.ionDeluge.isTrue = true;
    writeLog( `電子のシャワーが 降りそそいだ!` );
  }

  genesisSupernova:
  if ( pokemon.move.selected.name === 'オリジンズスーパーノヴァ' ) {
    if ( pokemon.stateChange.shadowForce.isTrue === true ) break genesisSupernova;
    if ( fieldStatus.terrain.isPsychic() ) break genesisSupernova;

    fieldStatus.terrain.getPsychic( pokemon );
  }

  rapidSpin:
  if ( pokemon.move.selected.name === 'こうそくスピン' || pokemon.move.selected.name === 'キラースピン' ) {
    if ( pokemon.stateChange.shadowForce.isTrue === true ) break rapidSpin;

    if ( pokemon.stateChange.ingrain.isTrue === true ) {
      pokemon.stateChange.ingrain.reset();
      writeLog( `` );
    }

    changeOpponentField( pokemon.isMe, 'まきびし', '-' );
    changeOpponentField( pokemon.isMe, 'どくびし', '-' );
    changeOpponentField( pokemon.isMe, 'ステルスロック', '-' );
    changeOpponentField( pokemon.isMe, 'ねばねばネット', '-' );
  }

  splinteredStormshards:
  if ( pokemon.move.selected.name === 'ラジアルエッジストーム' ) {
    fieldStatus.terrain.resetWithMessage();
  }

  scald:
  if ( pokemon.move.selected.name === 'ねっとう' || pokemon.move.selected.name === 'スチームバースト' ) {
    if ( one.damage.substitute === true ) break scald;
    if ( pokemon.stateChange.sheerForce.isTrue === true ) break scald;

    cureAilment( one.target, 'FROZEN' );
  }

  hydroSteam:
  if ( pokemon.move.selected.name === 'ハイドロスチーム' ) {
    if ( one.damage.substitute === true ) break hydroSteam;

    cureAilment( one.target, 'FROZEN' );
  }

  smellingSalts:
  if ( pokemon.move.selected.name === 'きつけ' ) {
    if ( one.damage.substitute === true ) break smellingSalts;

    cureAilment( one.target, 'PARALYSIS' );
  }

  wakeUpSlap:
  if ( pokemon.move.selected.name === 'めざましビンタ' ) {
    if ( one.damage.substitute === true ) break wakeUpSlap;

    cureAilment( one.target, 'ASLEEP' );
  }

  sparklingAria:
  if ( pokemon.move.selected.name === 'うたかたのアリア' ) {
    if ( pokemon.stateChange.sheerForce.isTrue === true ) break sparklingAria;

    for ( const data of targetList ) {
      if ( data.target.item.isName( 'おんみつマント' ) === true ) continue;
      if ( data.target.ability.isName( 'りんぷん' ) && targetList.length === 1 ) continue;

      cureAilment( data.target, 'ASLEEP' );
    }
  }

	eerieSpell:
  if ( pokemon.move.selected.name === 'ぶきみなじゅもん' ) {

    if ( isValidToTargetAdditionalEffect( pokemon, one.target, one.damage ) === false ) break eerieSpell;

    // writeLog( `${getArticle( one.target)}の ${}を ${}削った!` );
  }
}

// 特性の効果（その1）
function activateAbilityEffectPart1( pokemon: Pokemon ): void {

  const targetList: TargetDataType[] = getTargetList( pokemon );
  const allPokemon: TargetDataType[] = getTargetList( pokemon );
  allPokemon.push( { target: pokemon, damage: new Damage } );
  allPokemon.sort( ( a, b ) => {
    // 素早さ
    //if ( getSpeedValue( b.target, 'e' ) > getSpeedValue( a.target, 'e' ) ) return 1;
    //if ( getSpeedValue( b.target, 'e' ) < getSpeedValue( a.target, 'e' ) ) return -1;
    // 乱数
    if ( getRandom() > 50 ) return 1;
    else return -1;
  });

  for ( const data of allPokemon ) {
    // 攻撃側
    if ( isSame( data.target, pokemon ) === true ) {

      magician:
      if ( pokemon.ability.isName( 'マジシャン' ) ) {
        if ( pokemon.item !== null ) break magician;
        if ( pokemon.move.selected.isStatus() ) break magician;
        if ( pokemon.move.selected.name === 'なげつける' ) break magician;
        if ( pokemon.move.selected.name === 'しぜんのめぐみ' ) break magician;
        if ( pokemon.move.selected.name === 'みらいよち' ) break magician;
        if ( pokemon.move.selected.name === 'はめつのねがい' ) break magician;

        for ( const _data of targetList ) {
          if ( _data.damage.substitute === true ) continue;
          if ( isReleasableItem( pokemon, _data.target ) === false ) continue;

          let isZcrystal: boolean = false;
          for ( const zCrystal of zCrystalTable ) {
            if ( zCrystal.name === _data.target.item.name ) {
              isZcrystal = true;
            }
          }
          if ( isZcrystal === true ) continue;

          if ( _data.target.ability.isName( 'ねんちゃく' ) && _data.target.order.battle !== null ) continue;
        }
      }

      moxie:
      if ( pokemon.ability.isName( 'じしんかじょう' ) ) {
        const count: number = targetList.filter( data => data.target.status.hp.value.isZero() ).length;
        if ( getRankVariation( pokemon, 'attack', count ) === 0 ) break moxie;

        pokemon.declareAbility();
        changeMyRank( pokemon, 'attack', count );
      }

      beastBoost:
      if ( pokemon.ability.isName( 'ビーストブースト' ) ) {
        const count: number = targetList.filter( data => data.target.status.hp.value.isZero() ).length;

        /*
        let record = { parameter: 'attack', value: 0 };
        for ( const parameter of Object.keys( pokemon.avValue ) ) {
          if ( parameter === 'hitPoint' ) continue;
          if ( pokemon.avValue[parameter] > record.value ) {
            record.parameter = parameter;
            record.value = pokemon.avValue[parameter];
          }
        }

        if ( getRankVariation( pokemon, record.parameter, count ) === 0 ) break beastBoost;

        pokemon.declareAbility();
        changeMyRank( pokemon, record.parameter, count );
        */
      }

      grimNeigh:
      if ( pokemon.ability.isName( 'くろのいななき' ) ) {
        const count: number = targetList.filter( data => data.target.status.hp.value.isZero() ).length;
        if ( getRankVariation( pokemon, 'specialAttack', count ) === 0 ) break grimNeigh;

        pokemon.declareAbility();
        changeMyRank( pokemon, 'specialAttack', count );
      }

      chillingNeigh:
      if ( pokemon.ability.isName( 'しろのいななき' ) ) {
        const count: number = targetList.filter( data => data.target.status.hp.value.isZero() ).length;
        if ( getRankVariation( pokemon, 'attack', count ) === 0 ) break chillingNeigh;

        pokemon.declareAbility();
        changeMyRank( pokemon, 'attack', count );
      }
    }

    // 防御側
    if ( isSame( data.target, pokemon ) === false ) {

      colorChange:
      if ( data.target.ability.isName( 'へんしょく' ) ) {
        if ( pokemon.move.selected.isStatus() ) break colorChange;
        if ( getPokemonType( data.target ).includes( pokemon.move.selected.type ) ) break colorChange;
        if ( pokemon.move.selected.name === 'わるあがき' ) break colorChange;
        if ( pokemon.move.selected.type === null ) break colorChange;
        if ( pokemon.stateChange.sheerForce.isTrue === true ) break colorChange;


        data.target.declareAbility();
        writeLog( `${getArticle( data.target )}は ${pokemon.move.selected.type}タイプに なった!` );
      }

      berserk:
      if ( data.target.ability.isName( 'ぎゃくじょう' ) ) {

      }

      angerShell:
      if ( data.target.ability.isName( 'いかりのこうら' ) ) {

      }
    }
  }


}

// 防御側の持ち物の効果 (その4)
function targetItemEffectPart3( pokemon: Pokemon ): void {

  const targetList: TargetDataType[] = getTargetList( pokemon ).sort( ( a, b ) => {
    // 素早さ
    //if ( getSpeedValue( b.target, 'e' ) > getSpeedValue( a.target, 'e' ) ) return 1;
    //if ( getSpeedValue( b.target, 'e' ) < getSpeedValue( a.target, 'e' ) ) return -1;
    // 乱数
    if ( getRandom() > 50 ) return 1;
    else return -1;
  });

  for ( const data of targetList ) {
    keeBerry:
    if ( data.target.item.isName( 'アッキのみ' ) === true ) {
      if ( !pokemon.move.selected.isPhysical() ) break keeBerry;
      if ( data.damage.substitute === true ) break keeBerry;
      if ( getRankVariation( data.target, 'defense', 1 ) === 0 ) break keeBerry;
      if ( pokemon.stateChange.sheerForce.isTrue === true ) break keeBerry;

      eatBerry( data.target, 'アッキのみ' );
    }

    marangaBerry:
    if ( data.target.item.isName( 'タラプのみ' ) === true ) {
      if ( !pokemon.move.selected.isSpecial() ) break marangaBerry;
      if ( data.damage.substitute === true ) break marangaBerry;
      if ( getRankVariation( data.target, 'specialDefense', 1 ) === 0 ) break marangaBerry;
      if ( pokemon.stateChange.sheerForce.isTrue === true ) break marangaBerry;

      eatBerry( data.target, 'タラプのみ' );
    }

    ejectButton:
    if ( data.target.item.isName( 'だっしゅつボタン' ) === true ) {

    }
  }
}

// いにしえのうた/きずなへんげによるフォルムチェンジ
function formChangeByMove( pokemon: Pokemon ): void {

  const targetList: TargetDataType[] = getTargetList( pokemon );

  relicSong:
  if ( pokemon.move.selected.name === 'いにしえのうた' ) {
    if ( pokemon.name !== 'メロエッタ(ボイス)' && pokemon.name !== 'メロエッタ(ステップ)' ) break relicSong;
    if ( pokemon.stateChange.sheerForce.isTrue === true ) break relicSong;
    if ( pokemon.status.hp.value.isZero() ) break relicSong;

    formChange( pokemon );
    writeLog( `${getArticle( pokemon )}の 姿が 変化した!` );
  }

  battleBond:
  if ( pokemon.ability.isName( 'きずなへんげ' ) ) {
    if ( pokemon.name !== 'サトシゲッコウガ' ) break battleBond;

    let isChange: boolean = false;
    if ( getRankVariation( pokemon, 'attack', 1 ) !== 0 ) isChange = true;
    if ( getRankVariation( pokemon, 'specialAttack', 1 ) !== 0 ) isChange = true;
    if ( getRankVariation( pokemon, 'speed', 1 ) !== 0 ) isChange = true;
    if ( isChange === false ) break battleBond;

    let isFaint: boolean = false;
    for ( const data of targetList ) {
      if ( data.target.status.hp.value.isZero() ) {
        isFaint = true;
      }
    }
    if ( isFaint === false ) break battleBond;

    changeMyRank( pokemon, 'attack', 1 );
    changeMyRank( pokemon, 'specialAttack', 1 );
    changeMyRank( pokemon, 'speed', 1 );
    pokemon.declareAbility();
    writeLog( `${getArticle( pokemon )}に きずなの 力が みなぎった!` );
  }
}

// いのちのたまの反動/かいがらのすずの回復
function lifeOrbShellBell( pokemon: Pokemon ): void {

  const targetList: TargetDataType[] = getTargetList( pokemon );

  lifeOrb:
  if ( pokemon.item.isName( 'いのちのたま' ) ) {
    if ( pokemon.status.hp.value.isZero() ) break lifeOrb;
    if ( pokemon.move.selected.isStatus() ) break lifeOrb;
    if ( pokemon.order.battle === null ) break lifeOrb;
    if ( pokemon.ability.isName( 'マジックガード' ) ) break lifeOrb;
    if ( pokemon.stateChange.sheerForce.isTrue === true ) break lifeOrb;

    const dynamax: number = ( pokemon.stateChange.dynamax.isTrue )? 0.5 : 1;
    const damage: number = Math.max( 1, Math.floor( pokemon.status.hp.av * dynamax / 10 ) );
    changeHPByItem( pokemon, 'いのちのたま', damage );
  }

  shellBell:
  if ( pokemon.item.isName( 'かいがらのすず' ) === true ) {
    if ( pokemon.status.hp.value.isZero() ) break shellBell;
    if ( pokemon.order.battle === null ) break shellBell;
    if ( pokemon.stateChange.sheerForce.isTrue === true ) break shellBell;

    let value: number = 0;
    for ( const data of targetList ) {
      value += data.damage.damage;
    }
    if ( value === 0 ) break shellBell;

    const damage: number = Math.max( 1, Math.floor( value / 8 ) );
    changeHPByItem( pokemon, 'かいがらのすず', damage );
  }
}

// 防御側の持ち物の効果 (その4)
function targetItemEffectPart4( pokemon: Pokemon ): void {

  const targetList: TargetDataType[] = getTargetList( pokemon ).sort( ( a, b ) => {
    // 素早さ
    //if ( getSpeedValue( b.target, 'e' ) > getSpeedValue( a.target, 'e' ) ) return 1;
    //if ( getSpeedValue( b.target, 'e' ) < getSpeedValue( a.target, 'e' ) ) return -1;
    // 乱数
    if ( getRandom() > 50 ) return 1;
    else return -1;
  });

  for ( const data of targetList ) {

    if ( data.target.status.hp.value.isZero() ) continue;

    const gluttony: number = ( data.target.ability.isName( 'くいしんぼう' ) )? 2 : 1;

    sitrusBerry:
    if ( data.target.item.isName( 'オボンのみ' ) === true || data.target.item.isName( 'オレンのみ' ) === true ) {
      if ( data.target.status.hp.value.isGreaterThan( 2 ) ) break sitrusBerry;
      if ( pokemon.stateChange.healBlock.isTrue === true ) break sitrusBerry;

      eatBerry( data.target, data.target.item.name );
    }

    confuseBerry:
    if ( data.target.item.isName( 'フィラのみ' ) === true
      || data.target.item.isName( 'ウイのみ' ) === true
      || data.target.item.isName( 'マゴのみ' ) === true
      || data.target.item.isName( 'バンジのみ' ) === true
      || data.target.item.isName( 'イアのみ' ) === true ) {
        if ( data.target.status.hp.value.isGreaterThan( 4 / gluttony ) ) break confuseBerry;
        if ( pokemon.stateChange.healBlock.isTrue === true ) break confuseBerry;

        eatBerry( data.target, data.target.item.name );
    }

    const rankBerryTable: {
      name: string;
      parameter: ParameterStringType;
    }[] = [
      { name: 'チイラのみ', parameter: 'attack' },
      { name: 'リュガのみ', parameter: 'defense' },
      { name: 'ヤタピのみ', parameter: 'specialAttack' },
      { name: 'ズアのみ', parameter: 'specialDefense' },
      { name: 'カムラのみ', parameter: 'speed' },
    ]

    for ( const berry of rankBerryTable ) {
      if ( data.target.item.isName( berry.name ) === true ) {
        if ( data.target.status.hp.value.isGreaterThan( 4 / gluttony ) ) continue;
        if ( getRankVariation( data.target, berry.parameter, 1 ) === 0 ) continue;

        eatBerry( data.target, data.target.item.name );
      }
    }

    lansatBerry:
    if ( data.target.item.isName( 'サンのみ' ) === true ) {
      if ( data.target.status.hp.value.isGreaterThan( 4 / gluttony ) ) break lansatBerry;
      if ( data.target.stateChange.focusEnergy.isTrue === true ) break lansatBerry;

      eatBerry( data.target, data.target.item.name );
    }

    starfBerry:
    if ( data.target.item.isName( 'スターのみ' ) === true ) {
      if ( data.target.status.hp.value.isGreaterThan( 4 / gluttony ) ) break starfBerry;

      let isTrue: boolean = false;
      const parameterList: string[] = [];
      for ( const parameter of parameterFive ) {
        if ( getRankVariation( data.target, parameter, 2 ) !== 0 ) {
          isTrue = true;
          parameterList.push( parameter );
        }
      }
      parameterList.sort( ( a, b ) => 50 - getRandom() );

      eatBerry( data.target, data.target.item.name );
    }

    micleBerry:
    if ( data.target.item.isName( 'ミクルのみ' ) === true ) {
      if ( data.target.status.hp.value.isGreaterThan( 4 / gluttony ) ) break micleBerry;

      eatBerry( data.target, data.target.item.name );
    }

    berryJuice:
    if ( data.target.item.isName( 'きのみジュース' ) === true ) {
      if ( data.target.status.hp.value.isGreaterThan( 2 ) ) break berryJuice;
      if ( pokemon.stateChange.healBlock.isTrue === true ) break berryJuice;

      changeHPByItem( data.target, 'きのみジュース', 10 );
    }

    if ( data.damage.damage > 0 ) {
      activateSeed( data.target );
      activateRoomService( data.target );
    }
  }
}

// わるいてぐせ
function activatePickpocket( pokemon: Pokemon ): void {

  const targetList: TargetDataType[] = getTargetList( pokemon ).sort( ( a, b ) => {
    // 素早さ
    //if ( getSpeedValue( b.target, 'e' ) > getSpeedValue( a.target, 'e' ) ) return 1;
    //if ( getSpeedValue( b.target, 'e' ) < getSpeedValue( a.target, 'e' ) ) return -1;
    // 乱数
    if ( getRandom() > 50 ) return 1;
    else return -1;
  });

  for ( const data of targetList ) {
    if ( data.target.ability.isName( 'わるいてぐせ' )  ) continue;
    if ( !pokemon.isContact() ) continue;
    if ( data.target.item !== null ) continue;
    if ( pokemon.item === null ) continue;
    if ( isReleasableItem( pokemon, data.target ) === false ) continue;
    if ( pokemon.stateChange.sheerForce.isTrue === true ) continue;
    if ( pokemon.ability.isName( 'ねんちゃく' ) ) continue;
    if ( data.damage.substitute === true ) continue;

    [ pokemon.item, data.target.item ] = [ data.target.item, pokemon.item ];

    data.target.declareAbility();
    writeLog( `${getArticle( pokemon )}の ${data.target.item}を 奪った!` );
  }
}

// 技の効果
function otherEffect( pokemon: Pokemon ): void {

  if ( pokemon.move.selected.name === 'もえつきる' ) {
    // if ( pokemon.type1 === 'FIRE' ) pokemon.type1 = null;
    // if ( pokemon.type2 === 'FIRE' ) pokemon.type2 = null;

    writeLog( `${getArticle( pokemon )}の 炎は 燃え尽きた!` );
  }

  naturalGift:
  if ( pokemon.move.selected.name === 'しぜんのめぐみ' ) {
    if ( pokemon.order.battle === null ) break naturalGift;

    recycleAvailable( pokemon );
  }

  if ( pokemon.move.selected.name === 'アイアンローラー' ) {
    fieldStatus.terrain.resetWithMessage();
  }

  iceSpinner:
  if ( pokemon.move.selected.name === 'アイススピナー' ) {
    if ( pokemon.order.battle === null ) break iceSpinner;

    fieldStatus.terrain.resetWithMessage();
  }
}

// 攻撃側の持ち物の効果
function myItemEffect( pokemon: Pokemon ): void {

  leppaBerry:
  if ( pokemon.item.isName( 'ヒメリのみ' ) === true ) {
    if ( pokemon.move.learned[pokemon.move.selected.slot].powerPoint.isPlus() ) break leppaBerry;

    pokemon.stateChange.memo.isTrue = true;
    pokemon.stateChange.memo.text = 'ヒメリのみ';
    eatBerry( pokemon, 'ヒメリのみ' );
    pokemon.stateChange.memo.reset();
  }

  throatSpray:
  if ( pokemon.item.isName( 'のどスプレー' ) === true ) {
    if ( getRankVariation( pokemon, 's@ecialAttack', 1 ) === 0 ) break throatSpray;
    if ( pokemon.damage.filter( damage => damage.success === true ).length === 0 ) break throatSpray;
    if ( pokemon.order.battle === null ) break throatSpray;

    changeMyRankByItem( pokemon, 'specialAttack', 1, 'のどスプレー' );
    recycleAvailable( pokemon );
  }
}
