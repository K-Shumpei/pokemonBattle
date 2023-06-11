function moveEffect( pokemon: Pokemon ): void {

  if ( pokemon.moveUsed.category !== '変化' ) {
    // シングルバトルの場合
    if ( fieldStatus.battleStyle === 1 ) {
      const info: Target = pokemon.target[0];
      const target: Pokemon | false = getPokemonByBattle( info.trainer, info.battle );
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
      effectsWhenDamageOccurs( pokemon, target );
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
    target.damage.damage = Math.min( target.damage.damage, target.stateChange.substitute._count );
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
    pokemon.stateChange.fling.isTrue = true;
    const item: string | null = pokemon.status.item;
    if ( item !== null ) {
      pokemon.stateChange.flinch.text = item;
    }
    recycleAvailable( pokemon );
  }

  // 追加効果
  for ( const move of additionalEffectTargetRank ) {
    if ( move.name === pokemon.moveUsed.name ) {
      if ( pokemon.stateChange.sheerForce.isTrue === true ) break;
      if ( isValidToTargetAdditionalEffect( pokemon, target ) === false ) break;
      if ( isValidProbabilityAdditionalEffect( pokemon, move.rate ) === false ) break;

      for ( const parameter of Object.keys( move.change ) ) {
        changeTargetRank( pokemon, target, parameter, move.change[parameter] );
      }
    }
  }
  for ( const move of additionalEffectMyRank ) {
    if ( move.name === pokemon.moveUsed.name ) {
      if ( pokemon.stateChange.sheerForce.isTrue === true ) break;
      if ( isValidProbabilityAdditionalEffect( pokemon, move.rate ) === false ) break;

      for ( const parameter of Object.keys( move.change ) ) {
        changeMyRank( pokemon, parameter, move.change[parameter] );
      }
    }
  }
  for ( const move of additionalEffectAilment ) {
    if ( move.name === pokemon.moveUsed.name ) {
      if ( pokemon.stateChange.sheerForce.isTrue === true ) break;
      if ( isValidToTargetAdditionalEffect( pokemon, target ) === false ) break;
      if ( isValidProbabilityAdditionalEffect( pokemon, move.rate ) === false ) break;

      giveAilment( pokemon, target, move.ailment );
    }
  }
  for ( const move of additionalEffectConfuse ) {
    if ( move.name === pokemon.moveUsed.name ) {
      if ( pokemon.stateChange.sheerForce.isTrue === true ) break;
      if ( isValidToTargetAdditionalEffect( pokemon, target ) === false ) break;
      if ( isValidProbabilityAdditionalEffect( pokemon, move.rate ) === false ) break;

      giveConfuse( pokemon, target, 'additional' );
    }
  }
  for ( const move of additionalEffectFlinch ) {
    if ( move.name === pokemon.moveUsed.name ) {
      if ( pokemon.stateChange.sheerForce.isTrue === true ) break;
      if ( isValidToTargetAdditionalEffect( pokemon, target ) === false ) break;
      if ( isValidProbabilityAdditionalEffect( pokemon, move.rate ) === false ) break;

      target.stateChange.flinch.isTrue = true;
    }
  }
  activateOtherAdditionalEffect( pokemon, target );

  // 自分のランクが下がる技の効果
  for ( const move of moveEffectMyRank ) {
    if ( move.name === pokemon.moveUsed.name ) {
      for ( const parameter of Object.keys( move.change ) ) {
        changeMyRank( pokemon, parameter, move.change[parameter] );
      }
    }
  }
  // HP吸収技
  for ( const move of absorbingMoveList ) {
    if ( move.name === pokemon.moveUsed.name ) {
      const value = Math.round( target.damage.damage * move.rate )
      changeHPByMove( pokemon, target, value );
    }
  }
}

// ダメージが発生したときの効果
function effectsWhenDamageOccurs( pokemon: Pokemon, target: Pokemon ) {

  rage:
  if ( target.stateChange.rage.isTrue === true ) {
    if ( target.damage.substitute === true ) break rage;
    changeMyRankByRage( target, 'attack', 1  );
  }

  clearSmog:
  if ( pokemon.moveUsed.name === 'クリアスモッグ' ) {
    if ( target.damage.substitute === true ) break clearSmog;
    for ( const parameter of Object.keys( target.rank ) ) {
      target.rank[parameter] = 0;
    }
    writeLog( `全ての ステータスが 元に 戻った!` );
  }

  grudge:
  if ( target.stateChange.grudge.isTrue === true ) {
    if ( target.status.remainingHP > 0 ) break grudge;
    if ( pokemon.moveUsed.remainingPP === 0 ) break grudge;
    pokemon.moveUsed.remainingPP = 0;
    pokemon.move[pokemon.moveUsed.number].remainingPP = 0;
    writeLog( `${getArticle( pokemon )}の ${pokemon.move[pokemon.moveUsed.number].name}は おんねんで PPが0になった!` );
  }

  beakBlast:
  if ( target.stateChange.beakBlast.isTrue === true ) {
    if ( isDirect( pokemon ) === false ) break beakBlast;
    if ( pokemon.moveUsed.name === 'フリーフォール' ) break beakBlast;
    if ( target.damage.substitute === true ) break beakBlast;
    giveAilmentByBeakBlast( target, pokemon );
  }

  poisonTouch:
  if ( isAbility( pokemon, 'どくしゅ' ) === true ) {
    if ( isDirect( pokemon ) === false ) break poisonTouch;
    if ( target.damage.substitute === true ) break poisonTouch;
    if ( isAbility( target, 'りんぷん' ) === true ) break poisonTouch;
    if ( getRandom() >= 30 ) break poisonTouch;
    if ( giveAilment( pokemon, target, 'どく', true ) ) {
      pokemon.status.declareAbility();
      writeLog( `${getArticle( target )}に 毒を あびせた!` );
    }
  }

  synchronize:
  if ( isAbility( target, 'シンクロ' ) === true ) {
    if ( target.stateChange.synchronize.isTrue === false ) break synchronize;
    const ailment = target.stateChange.synchronize.name;
    if ( ailment === 'どく' || ailment === 'もうどく' || ailment === 'やけど' || ailment === 'まひ' ) {
      target.status.declareAbility();
      giveAilment( target, pokemon, ailment );
    }
    target.stateChange.synchronize.reset();
  }

  // 直接攻撃を受けた時
  if ( isDirect( pokemon ) === true && target.damage.substitute === false ) {

    roughSkin:
    if ( isAbility( target, 'さめはだ' ) === true || isAbility( target, 'てつのトゲ' ) === true ) {


      target.status.declareAbility();

      if ( isItem( pokemon, 'ぼうごパット' ) === true ) {
        writeLog( `${getArticle( pokemon )}は ぼうごパットで 防いだ!` );
        break roughSkin;
      }
      if ( isAbility( pokemon, 'マジックガード' ) === true ) break roughSkin;

      const value = Math.max( 1, Math.floor( pokemon.actualValue.hitPoint / 8 ) );
      changeHPByAbility( pokemon, value, '-' );
      writeLog( `${getArticle( pokemon )}は 傷ついた!` );
    }

    effectSpore:
    if ( isAbility( target, 'ほうし' ) === true ) {
      if ( getPokemonType( pokemon ).includes( 'くさ' ) ) break effectSpore;
      if ( isAbility( pokemon, 'ぼうじん' ) === true ) break effectSpore;
      if ( isItem( pokemon, 'ぼうじんゴーグル' ) === true ) break effectSpore;
      if ( isItem( pokemon, 'ぼうごパット' ) === true ) break effectSpore;
      if ( getRandom() >= 30 ) break effectSpore;

      target.status.declareAbility();

      const random: number = Math.floor( getRandom() * 0.3 );
      if ( random < 9  ) {
        giveAilment( target, pokemon, 'どく' );
      } else if ( random < 19 ) {
        giveAilment( target, pokemon, 'まひ' );
      } else {
        giveAilment( target, pokemon, 'ねむり' );
      }
    }

    poisonPoint:
    if ( isAbility( target, 'どくのトゲ' ) === true ) {
      if ( isItem( pokemon, 'ぼうごパット' ) === true ) break poisonPoint;
      if ( getRandom() > 30 ) break poisonPoint;

      target.status.declareAbility();
      giveAilment( target, pokemon, 'どく' );
    }

    staticElectricity:
    if ( isAbility( target, 'せいでんき' ) === true ) {
      if ( isItem( pokemon, 'ぼうごパット' ) === true ) break staticElectricity;
      if ( getRandom() > 30 ) break staticElectricity;

      target.status.declareAbility();
      giveAilment( target, pokemon, 'まひ' );
    }

    flameBody:
    if ( isAbility( target, 'ほのおのからだ' ) === true ) {
      if ( isItem( pokemon, 'ぼうごパット' ) === true ) break flameBody;
      if ( getRandom() > 30 ) break flameBody;

      target.status.declareAbility();
      giveAilment( target, pokemon, 'やけど' );
    }

    atract:
    if ( isAbility( target, 'メロメロボディ' ) === true ) {
      if ( isItem( pokemon, 'ぼうごパット' ) === true ) break atract;
      if ( getRandom() >= 30 ) break atract;

      attractTarget( target, pokemon, 'メロメロボディ' );
    }

    mummy:
    if ( isAbility( target, 'ミイラ' ) === true || isAbility( target, 'とれないにおい' ) === true ) {
      for ( const ability of changeAbilityTable ) {
        if ( ability.name === pokemon.status.ability ) {
          if ( ability.noAbility === 0 || ability.noAbility === 2 ) {
            break mummy;
          }
        }
      }

      if ( isItem( pokemon, 'ぼうごパット' ) === true ) {
        writeLog( `${getArticle( pokemon )}は ぼうごパットで 防いだ!` );
        break mummy;
      }

      target.status.declareAbility();
      pokemon.status.ability = target.status.ability;

      if ( isAbility( target, 'ミイラ' ) === true ) {
        writeLog( `${getArticle( pokemon )}は とくせいが ミイラになっちゃった!` );
      }
      if ( isAbility( target, 'とれないにおい' ) === true ) {
        writeLog( `${getArticle( pokemon )}は においが うつって とれなくなっちゃった!` );
      }
    }

    gooey:
    if ( isAbility( target, 'ぬめぬめ' ) === true || isAbility( target, 'カーリーヘアー' ) === true ) {
      if ( pokemon.rank.speed === -6 ) {
        writeLog( `${getArticle( pokemon )}の 素早さは もう 下がらない!` )
        break gooey;
      }

      target.status.declareAbility();

      if ( isItem( pokemon, 'ぼうごパット' ) === true ) {
        writeLog( `${getArticle( pokemon )}は ぼうごパットで 防いだ!` );
        break gooey;
      }

      changeTargetRank( target, pokemon, 'speed', -1 );
    }

    wanderingSpirit:
    if ( isAbility( target, 'さまようたましい' ) === true ) {
      if ( isItem( pokemon, 'ぼうごパット' ) === true ) break wanderingSpirit;
      if ( pokemon.stateChange.dynamax.isTrue === true ) break wanderingSpirit;
      if ( target.stateChange.dynamax.isTrue === true ) break wanderingSpirit;

      for ( const ability of changeAbilityTable ) {
        if ( ability.name === pokemon.status.ability ) {
          if ( ability.exchange === 0 || ability.exchange === 2 ) {
            break wanderingSpirit;
          }
        }
      }

      target.status.declareAbility();
      [ pokemon.status.ability, target.status.ability ] = [ target.status.ability, pokemon.status.ability ];
      writeLog( `${getArticle( target )}は おたがいの とくせいを 入れ替えた!` );

      if ( pokemon.trainer !== target.trainer ) {
        pokemon.status.declareAbility();
        target.status.declareAbility();
      }
    }

    perishBody:
    if ( isAbility( target, 'ほろびのボディ' ) === true ) {
      if ( pokemon.status.remainingHP === 0 ) break perishBody;
      if ( isItem( pokemon, 'ぼうごパット' ) === true ) break perishBody;
      if ( pokemon.stateChange.perishSong.isTrue === true && target.stateChange.perishSong.isTrue === true ) break perishBody;

      target.status.declareAbility();

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
  if ( target.damage.substitute === false ) {

    cursedBody:
    if ( isAbility( target, 'のろわれボディ' ) === true ) {
      if ( pokemon.stateChange.disable.isTrue === true ) break cursedBody;
      if ( pokemon.stateChange.dynamax.isTrue === true ) break cursedBody;
      if ( isExistAbilityOneSide( pokemon.trainer, 'アロマベール' ) === true ) break cursedBody;
      if ( getRandom() >= 30 ) break cursedBody;

      target.status.declareAbility();

      pokemon.stateChange.disable.isTrue = true;
      pokemon.stateChange.disable.turn = 4;
      pokemon.stateChange.disable.text = pokemon.moveUsed.name;

      writeLog( `${getArticle( pokemon )}の ${pokemon.stateChange.disable.text}を 封じこめた!` );
    }

    stamina:
    if ( isAbility( target, 'じきゅうりょく' ) === true ) {
      target.status.declareAbility();
      changeMyRank( target, 'defense', 1 );
    }

    sandSpit:
    if ( isAbility( target, 'すなはき' ) === true ) {
      if ( isChangableWeather( 'すなあらし' ) === false ) break sandSpit;

      target.status.declareAbility();
      changeWeather( target, 'すなあらし' );
    }

    cottonDown:
    if ( isAbility( target, 'わたげ' ) === true ) {
      target.stateChange.memo.isTrue = true;
      target.stateChange.memo.text = 'わたげ';
      target.stateChange.memo.target.trainer = pokemon.trainer;
      target.stateChange.memo.target.battle = pokemon.order.battle;

      const valid: Pokemon[] = []
      for ( const _pokemon of pokemonForCottonDown( pokemon ) ) {
        if ( _pokemon.stateChange.substitute.isTrue === true ) continue;
        if ( isHide( _pokemon ) === true ) continue;
        valid.push( _pokemon );
      }

      if ( valid.length > 0 ) {
        target.status.declareAbility();
        for ( const _pokemon of valid ) {
          changeTargetRank( target, _pokemon, 'speed', -1 );
        }
      }

      target.stateChange.memo.reset();
    }

    gulpMissile:
    if ( isAbility( target, 'うのミサイル' ) === true ) {
      if ( target.status.name === 'ウッウ' ) break gulpMissile;
      if ( isHide( target ) === true ) break gulpMissile;
      if ( pokemon.status.remainingHP === 0 ) break gulpMissile;

      target.status.declareAbility()

      if ( isAbility( pokemon, 'マジックガード' ) === false ) {
        const dynamax: number = ( pokemon.stateChange.dynamax.isTrue )? 0.5 : 1;
        const value: number = Math.max( 1, Math.floor( pokemon.actualValue.hitPoint * dynamax / 4 ) );
        changeHPByAbility( pokemon, value, '-' );
      }

      if ( target.status.name === 'ウッウ(鵜呑み)' ) {
        changeTargetRank( target, pokemon, 'defense', -1 )
      }
      if ( target.status.name === 'ウッウ(丸呑み)' ) {
        giveAilment( target, pokemon, 'まひ' )
      }

      formChange( pokemon );
    }

    seedSower:
    if ( isAbility( target, 'こぼれダネ' ) === true ) {
      if ( isChangableTerrain( 'グラスフィールド' ) === false ) break seedSower;

      target.status.declareAbility();
      changeTerrain( target, 'グラスフィールド' );
    }

    electromorphosis:
    if ( isAbility( target, 'でんきにかえる' ) === true ) {
      if ( target.status.remainingHP === 0 ) break electromorphosis;

      target.status.declareAbility();
      target.stateChange.charge.isTrue = true;
      writeLog( `${getArticle( target )}は ${pokemon.moveUsed.name}を 受けて 充電した!` );
    }

  }
}

function isValidProbabilityAdditionalEffect( pokemon: Pokemon, moveRate: number ): boolean {

  let rate: number = moveRate;

  if ( isAbility( pokemon, 'てんのめぐみ' ) ) {
    rate = rate * 2;
  }
  if ( fieldStatus.getSide( pokemon.trainer ).rainbow.isTrue === true ) {
    if ( pokemon.moveUsed.name !== 'ひみつのちから' ) {
      rate = rate * 2;
    }
  }
  for ( const move of additionalEffectFlinch ) {
    if ( move.name === pokemon.moveUsed.name ) {
      rate = Math.min( rate, moveRate * 2 );
    }
  }

  if ( getRandom() >= rate ) return false;

  return true;
}

function isValidToTargetAdditionalEffect( pokemon: Pokemon, target: Pokemon ): boolean {

  if ( target.status.remainingHP === 0 ) return false;
  if ( target.damage.substitute === true ) return false ;
  if ( isAbility( target, 'りんぷん' ) ) return false;
  if ( isItem( target, 'おんみつマント' ) ) return false;

  return true;
}

function activateOtherAdditionalEffect( pokemon: Pokemon, target: Pokemon ): void {

  if ( pokemon.moveUsed.name === 'アンカーショット' || pokemon.moveUsed.name === 'かげぬい' ) {
    if ( pokemon.stateChange.sheerForce.isTrue === true ) return;
    if ( isValidToTargetAdditionalEffect( pokemon, target ) === false ) return;
    if ( getPokemonType( target ).includes( 'ゴースト' ) === false ) return;
    if ( target.stateChange.cannotEscape.isTrue === false ) return;

    target.stateChange.cannotEscape.isTrue = true;
    target.stateChange.cannotEscape.target.trainer = pokemon.trainer;
    target.stateChange.cannotEscape.target.party = pokemon.order.party;
    writeLog( `${getArticle( target )}は もう 逃げられない!` );

    return;
  }

  if ( pokemon.moveUsed.name === 'うたかたのアリア' ) {
    if ( pokemon.stateChange.sheerForce.isTrue === true ) return;
    if ( isValidToTargetAdditionalEffect( pokemon, target ) === false ) return;
    if ( target.status.statusAilment.name !== 'やけど' ) return;

    target.status.statusAilment = new StatusAilment( null );
    writeLog( `${getArticle( target )}の やけどが 治った!` );

    return;
  }

  if ( pokemon.moveUsed.name === 'しおづけ' ) {
    if ( pokemon.stateChange.sheerForce.isTrue === true ) return;
    if ( isValidToTargetAdditionalEffect( pokemon, target ) === false ) return;
    if ( target.stateChange.saltCure.isTrue === true ) return;

    target.stateChange.saltCure.isTrue = true;
    writeLog( `${getArticle( target )}は しおづけに なった!` );

    return;
  }

  if ( pokemon.moveUsed.name === 'じごくづき' ) {
    if ( pokemon.stateChange.sheerForce.isTrue === true ) return;
    if ( isValidToTargetAdditionalEffect( pokemon, target ) === false ) return;
    if ( target.stateChange.throatChop.isTrue === true ) return;

    target.stateChange.throatChop.isTrue = true;
    target.stateChange.throatChop.turn = 2;

    return;
  }

  if ( pokemon.moveUsed.name === 'トライアタック' ) {
    if ( pokemon.stateChange.sheerForce.isTrue === true ) return;
    if ( isValidToTargetAdditionalEffect( pokemon, target ) === false ) return;
    if ( isValidProbabilityAdditionalEffect( pokemon, 20 ) === false ) return;

    const rate: number = getRandom();
    if ( rate < 100 / 3 ) {
      giveAilment( pokemon, target, 'まひ' );
    } else if ( rate < 200 / 3 ) {
      giveAilment( pokemon, target, 'やけど');
    } else {
      giveAilment( pokemon, target, 'こおり' );
    }

    return;
  }

  if ( pokemon.moveUsed.name === 'なげつける' ) {
    if ( isValidToTargetAdditionalEffect( pokemon, target ) === false ) {
      pokemon.stateChange.fling.reset();
      return;
    }

    if ( pokemon.stateChange.fling.text === 'でんきだま' ) {
      giveAilment( pokemon, target, 'まひ' );
    }
    if ( pokemon.stateChange.fling.text === 'かえんだま' ) {
      giveAilment( pokemon, target, 'やけど' );
    }
    if ( pokemon.stateChange.fling.text === 'どくバリ' ) {
      giveAilment( pokemon, target, 'どく' );
    }
    if ( pokemon.stateChange.fling.text === 'どくどくだま' ) {
      giveAilment( pokemon, target, 'もうどく' );
    }
    if ( pokemon.stateChange.fling.text === 'おうじゃのしるし' || pokemon.stateChange.fling.text === 'するどいキバ' ) {
      target.stateChange.flinch.isTrue = true;
    }
    if ( pokemon.stateChange.fling.text === 'しろいハーブ' ) {
      let isTrue = false;
      for ( const parameter of Object.keys( target.rank ) ) {
        if ( target.rank[parameter] < 0 ) {
          isTrue = true;
          target.rank[parameter] = 0;
        }
      }
      if ( isTrue === true ) {
        writeLog( `${getArticle( target )}は しろいハーブで ステータスを 元に戻した!` );
      }
    }
    for ( const berry of berryTable ) {
      if ( berry.name === pokemon.stateChange.fling.text ) {
        eatBerry( target, pokemon.stateChange.fling.text );
      }
    }

    // なげつけたアイテムのデータを削除
    pokemon.stateChange.fling.reset();

    return;
  }

  if ( pokemon.moveUsed.name === 'フェイタルクロー' ) {
    if ( pokemon.stateChange.sheerForce.isTrue === true ) return;
    if ( isValidToTargetAdditionalEffect( pokemon, target ) === false ) return;
    if ( isValidProbabilityAdditionalEffect( pokemon, 50 ) === false ) return;

    const rate: number = getRandom();
    if ( rate < 100 / 3 ) {
      giveAilment( pokemon, target, 'どく' );
    } else if ( rate < 200 / 3 ) {
      giveAilment( pokemon, target, 'まひ' );
    } else {
      giveAilment( pokemon, target, 'ねむり' );
    }

    return;
  }
}
