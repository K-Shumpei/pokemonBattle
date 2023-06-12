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
  // 対象のランク変化
  for ( const move of additionalEffectTargetRank ) {
    if ( move.name === pokemon.moveUsed.name ) {
      if ( pokemon.stateChange.sheerForce.isTrue === true ) break;
      if ( isValidToTargetAdditionalEffect( pokemon, target ) === false ) break;
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
    if ( move.name === pokemon.moveUsed.name ) {
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
    if ( getRankVariation( target, 'attack', 1 ) === 0 ) break rage;
    changeMyRankByRage( target, 'attack', 1 );
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
      if ( getRankVariation( pokemon, 'speed', -1 ) === 0 ) {
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
      if ( getRankVariation( target, 'defense', 1 ) === 0 ) break stamina;

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
      activateCharge( target, pokemon.moveUsed.name );
    }
  }

  // 物理技を受けた時
  if ( pokemon.moveUsed.category === '物理' && target.damage.substitute === false ) {

    weakArmor:
    if ( isAbility( target, 'くだけるよろい' ) === true ) {
      if ( getRankVariation( target, 'defense', -1 ) === 0 && getRankVariation( target, 'speed', 2 ) === 0 ) break weakArmor;

      target.status.declareAbility();
      changeMyRank( target, 'defense', -1 );
      changeMyRank( target, 'speed', 2 );
    }

    toxicDebris:
    if ( isAbility( target, 'どくげしょう' ) === true ) {
      if ( fieldStatus.getSide( getOpponentTrainer( target.trainer ) ).toxicSpikes.count === 2 ) break toxicDebris;

      target.status.declareAbility();
      changeOpponentField( target, 'どくびし' );
    }
  }

  // 特定のタイプの攻撃技を受けた時
  if ( target.damage.substitute === false ) {

    waterCompaction:
    if ( isAbility( target, 'みずがため' ) === true ) {
      if ( pokemon.moveUsed.type !== 'みず' ) break waterCompaction;
      if ( getRankVariation( target, 'defense', 2 ) === 0 ) break waterCompaction;

      target.status.declareAbility();
      changeMyRank( target, 'defense', 2 );
    }

    justified:
    if ( isAbility( target, 'せいぎのこころ' ) === true ) {
      if ( pokemon.moveUsed.type !== 'あく' ) break justified;
      if ( getRankVariation( target, 'attack', 1 ) === 0 ) break justified;

      target.status.declareAbility();
      changeMyRank( target, 'attack', 1 );
    }

    rattled:
    if ( isAbility( target, 'びびり' ) === true ) {
      if ( pokemon.moveUsed.type !== 'あく' && pokemon.moveUsed.type !== 'ゴースト' && pokemon.moveUsed.type !== 'むし' ) break rattled;
      if ( getRankVariation( target, 'speed', 1 ) === 0 ) break rattled;

      target.status.declareAbility();
      changeMyRank( target, 'speed', 1 );
    }

    steamEngine:
    if ( isAbility( target, 'じょうききかん' ) === true ) {
      if ( pokemon.moveUsed.type !== 'みず' && pokemon.moveUsed.type !== 'ほのお' ) break steamEngine;
      if ( getRankVariation( target, 'speed', 6 ) === 0 ) break steamEngine;

      target.status.declareAbility()
      changeMyRank( target, 'speed', 6 );
    }
  }

  // 風技を受けた時
  if ( windMoveList.includes( pokemon.moveUsed.name ) === true && target.damage.substitute === false ) {

    windPower:
    if ( isAbility( target, 'ふうりょくでんき' ) === true ) {
      target.status.declareAbility();
      activateCharge( target, pokemon.moveUsed.name );
    }
  }

  // 急所に当たった時
  if ( target.damage.critical === true && target.damage.substitute === false ) {

    angerPoint:
    if ( isAbility( target, 'いかりのつぼ' ) === true ) {
      target.status.declareAbility();
      target.rank.attack = 6;
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
  if ( target.damage.effective > 1 ) {
    if ( target.status.remainingHP === 0 ) break effective;
    if ( target.damage.substitute === true ) break effective;
    if ( target.damage.damage === 0 ) break effective;

    if ( isItem( target, 'ナゾのみ' ) === true ) {
      eatBerry( target, 'ナゾのみ' );
    }

    if ( isItem( target, 'じゃくてんほけん' ) === true ) {
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
  if ( isItem( target, 'じゅうでんち' ) === true ) {
    if ( target.damage.substitute === true ) break cellBattery;
    if ( pokemon.moveUsed.type !== 'でんき' ) break cellBattery;
    if ( getRankVariation( target, 'attack', 1 ) === 0 ) break cellBattery;

    changeMyRankByItem( target, 'attack', 1, 'じゅうでんち' );
    recycleAvailable( target );
  }

  snowball:
  if ( isItem( target, 'ゆきだま' ) === true ) {
    if ( target.damage.substitute === true ) break snowball;
    if ( pokemon.moveUsed.type !== 'こおり' ) break snowball;
    if ( getRankVariation( target, 'attack', 1 ) === 0 ) break snowball;

    changeMyRankByItem( target, 'attack', 1, 'ゆきだま' );
    recycleAvailable( target );
  }

  absorbBulb:
  if ( isItem( target, 'きゅうこん' ) === true ) {
    if ( target.damage.substitute === true ) break absorbBulb;
    if ( pokemon.moveUsed.type !== 'みず' ) break absorbBulb;
    if ( getRankVariation( target, 'specialAttack', 1 ) === 0 ) break absorbBulb;

    changeMyRankByItem( target, 'specialAttack', 1, 'きゅうこん' );
    recycleAvailable( target );
  }

  luminousMoss:
  if ( isItem( target, 'ひかりごけ' ) === true ) {
    if ( target.damage.substitute === true ) break luminousMoss;
    if ( pokemon.moveUsed.type !== 'みず' ) break luminousMoss;
    if ( getRankVariation( target, 'specialDefense', 1 ) === 0 ) break luminousMoss;

    changeMyRankByItem( target, 'specialDefense', 1, 'ひかりごけ' );
    recycleAvailable( target );
  }

  rockyHelmet:
  if ( isItem( target, 'ゴツゴツメット' ) === true ) {
    if ( isDirect( pokemon ) === false ) break rockyHelmet;
    if ( target.damage.substitute === true ) break rockyHelmet;
    if ( isItem( pokemon, 'ぼうごパット' ) === true ) break rockyHelmet;
    if ( isAbility( pokemon, 'マジックガード' ) === true ) break rockyHelmet;

    const dynamax: number = ( pokemon.stateChange.dynamax.isTrue )? 0.5 : 1;
    const value: number = Math.floor( pokemon.actualValue.hitPoint * dynamax / 8 );
    pokemon.status.remainingHP = Math.max( pokemon.status.remainingHP - value, 0 );
    writeLog( `${getArticle( pokemon )}は ゴツゴツメットで ダメージを受けた!` );
  }

  stickyBarb:
  if ( isItem( target, 'くっつきバリ' ) === true ) {
    if ( isDirect( pokemon ) === false ) break stickyBarb;
    if ( target.damage.substitute === true ) break stickyBarb;
    if ( pokemon.status.item !== null ) break stickyBarb;

    [ pokemon.status.item, target.status.item ] = [ target.status.item, pokemon.status.item ];
  }

  airBalloon:
  if ( isItem( target, 'ふうせん' ) === true ) {
    target.status.item = null;
    writeLog( `${getArticle( target )}の ふうせんが 割れた!` );
  }

  incinerate:
  if ( pokemon.moveUsed.name === 'やきつくす' ) {
    if ( target.damage.substitute === true ) break incinerate;
    if ( isAbility( target, 'ねんちゃく' ) === true ) break incinerate;

    let item: null | string = null;
    for ( const berry of berryTable ) {
      if ( berry.name === target.status.item ) {
        item = berry.name;
      }
    }
    for ( const gem of gemTable ) {
      if ( gem.name === target.status.item ) {
        item = gem.name;
      }
    }

    if ( item !== null ) {
      target.status.item = null;
      writeLog( `${getArticle( target )}の ${item}は 焼けてなくなった!` );
    }
  }

  // 防御側の持ち物の効果（その２）
  jabocaBerry:
  if ( isItem( target, 'ジャポのみ' ) === true ) {
    if ( target.damage.substitute === true ) break jabocaBerry;
    if ( pokemon.moveUsed.category !== '物理' ) break jabocaBerry;
    if ( isAbility( pokemon, 'マジックガード' ) === true ) break jabocaBerry;
    if ( pokemon.status.remainingHP === 0 ) break jabocaBerry;

    const dynamax: number = ( pokemon.stateChange.dynamax.isTrue )? 0.5 : 1;
    const value: number = Math.floor( pokemon.actualValue.hitPoint * dynamax / 8 );
    pokemon.status.remainingHP = Math.max( pokemon.status.remainingHP - value, 0 );
    writeLog( `${getArticle( target )}は ${getArticle( pokemon )}の ジャポのみで ダメージを 受けた!` );
  }

  rowapBerry:
  if ( isItem( target, 'レンブのみ' ) === true ) {
    if ( target.damage.substitute === true ) break rowapBerry;
    if ( pokemon.moveUsed.category !== '特殊' ) break rowapBerry;
    if ( isAbility( pokemon, 'マジックガード' ) === true ) break rowapBerry;
    if ( pokemon.status.remainingHP === 0 ) break rowapBerry;

    const dynamax: number = ( pokemon.stateChange.dynamax.isTrue )? 0.5 : 1;
    const value: number = Math.floor( pokemon.actualValue.hitPoint * dynamax / 8 );
    pokemon.status.remainingHP = Math.max( pokemon.status.remainingHP - value, 0 );
    writeLog( `${getArticle( target )}は ${getArticle( pokemon )}の レンブのみで ダメージを 受けた!` );
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
      if ( berry.name === pokemon.stateChange.fling.text && berry.fling === true ) {
        target.stateChange.memo.isTrue = true;
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
