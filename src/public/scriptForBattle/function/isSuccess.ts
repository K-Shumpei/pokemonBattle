function isSuccess( pokemon: Pokemon ): boolean {

  // フリーフォールで行動順を飛ばされる
  skipBySkyDrop();
  // 自身のおんねん/いかり状態の解除
  liftingMyStatus();
  // 行動の失敗
  if ( isActionFailure( pokemon ) ) return false;
  // ねごと/いびき使用時「ぐうぐう 眠っている」メッセージ
  sleepyMessage( pokemon );
  // 自分のこおりを回復するわざにより自身のこおり状態が治る
  meltMeByMove( pokemon );
  // 特性バトルスイッチによるフォルムチェンジ
  stanceChange( pokemon );
  // 「<ポケモン>の <技>!」のメッセージ。PPが減少することが確約される
  moveDeclareMessage( pokemon );
  // 技のタイプが変わる。
  changeMoveType( pokemon );
  // 技の対象が決まる。若い番号の対象が優先される。
  decideTarget( pokemon );
  // PPが適切な量引かれる
  deductPowerPoint( pokemon );
  // ほのおタイプではないことによるもえつきるの失敗
  if ( burnUpFailure( pokemon ) ) return false;
  // おおあめ/おおひでりによるほのお/みず技の失敗
  if ( failureByWeather( pokemon ) ) return false;
  // ふんじんによるほのお技の失敗とダメージ
  if ( failureByPowder( pokemon ) ) return false;
  // ミクルのみによる命中補正効果が消費される
  hitCorrConsumance( pokemon );
  // 技の仕様による失敗
  if ( failureByMoveSpec( pokemon ) ) return false;
  // マックスレイドバトルでの失敗
  // 特性による失敗
  if ( failureByAbility( pokemon ) ) return false;
  // 中断されても効果が発動する技
  if ( effectAlwaysActivate( pokemon ) ) return false;
  // へんげんじざい/リベロの発動
  abilityChangeType( pokemon );
  // 溜め技の溜めターンでの動作
  preliminaryAction( pokemon );
  // マグニチュードの大きさ(威力)が決定
  dicideMagnitudePower( pokemon );
  // 待機中のよこどりで技が盗まれる。技を奪ったポケモンは3-9~11の行程を繰り返す
  // だいばくはつ/じばく/ミストバースト使用によるHP消費が確約される
  // 対象のポケモンが全員すでにひんしになっていて場にいないことによる失敗
  // ビックリヘッド/てっていこうせん使用によるHP消費が確約される
  // 姿を隠していることによる無効化
  if ( disableByConcealment( pokemon ) ) return false;
  // サイコフィールドによる無効化
  if ( disableByPsychofield( pokemon ) ) return false;
  // ファストガード/ワイドガード/トリックガードによる無効化
  if ( disableByOtherProtect( pokemon ) ) return false;
  // まもる/キングシールド/ブロッキング/ニードルガード/トーチカによる無効化
  if ( disableByProtect( pokemon ) ) return false;
  // たたみがえしによる無効化
  if ( disableByMatBlock( pokemon ) ) return false;
  // ダイウォールによる無効化
  if ( disableByMaxGuard( pokemon ) ) return false;
  // テレキネシスの、対象がディグダ/ダグトリオ/スナバァ/シロデスナ/メガゲンガー/うちおとす状態/ねをはる状態であることによる失敗
  if ( failureByTelekinesis( pokemon ) ) return false;
  // 特性による無効化(その1)
  if ( disableByAbility1st( pokemon ) ) return false;
  // 相性による無効化
  if ( disableByCompatibility( pokemon ) ) return false;
  // ふゆうによるじめん技の無効化
  if ( disableGroundMove1st( pokemon ) ) return false;
  // でんじふゆう/テレキネシス/ふうせんによるじめん技の無効化
  if ( disableGroundMove2nd( pokemon ) ) return false;
  // ぼうじんゴーグルによる粉技の無効化
  if ( disablePowder( pokemon ) ) return false;
  // 特性による無効化(その2)
  if ( disableByAbility2nd( pokemon ) ) return false;
  // タイプによる技の無効化(その1)
  if ( disableByType1st( pokemon ) ) return false;
  // 技の仕様による無効化(その1)
  if ( disableByMoveSpec1st( pokemon ) ) return false;
  // 技の仕様による無効化(その2)
  if ( disableByMoveSpec2nd( pokemon ) ) return false;
  // みがわり状態によるランク補正を下げる技/デコレーションの無効化
  if ( disableBySubstitute( pokemon ) ) return false;
  // 命中判定による技の無効化
  if ( disableByHitJudgment( pokemon ) ) return false;
  // 技の仕様による無効化(その3)
  if ( disableByMoveSpec3rd( pokemon ) ) return false;

  return true;
}




// フリーフォールで行動順を飛ばされる
function skipBySkyDrop(): void {

}

// 自身のおんねん/いかり状態の解除
function liftingMyStatus(): void {

}

// 行動の失敗
function isActionFailure( pokemon: Pokemon ): boolean {

  // 反動で動けない
  if ( pokemon.stateChange.cannotMove.isTrue ) {
    pokemon.stateChange.cannotMove.reset();

    // なまけ
    if ( pokemon.ability.isName( 'Truant' ) ) {
      pokemon.stateChange.truant.count += 1;
    }

    pokemon.msgCannotMove();

    return true;
  }

  // ねむり状態
  sleep:
  if ( pokemon.statusAilment.isAsleep() ) {
    const turn: number = ( pokemon.ability.isName( 'はやおき' ) )? 2 : 1;
    pokemon.statusAilment.turn -= turn;

    if ( pokemon.statusAilment.turn <= 0 ) {
      pokemon.statusAilment.getHealth();
    } else {
      //if ( sleepingMoveList.includes( pokemon.move.selected.name ) ) break sleep;
      pokemon.msgStillAsleep();
      return true;
    }
  }

  frozen:
  if ( pokemon.statusAilment.isFrozen() ) {
    if ( getRandom() < 20 ) {
      pokemon.statusAilment.getHealth();
      break frozen;
    }

    if ( pokemon.move.selected.getFlag().defrost ) {
      if ( !pokemon.move.selected.isName( 'もえつきる' ) ) break frozen;
      if ( pokemon.type.has( 'Fire' ) ) break frozen;
    }
    pokemon.msgStillFrozen();
    return true;
  }

  remainingPP:
  if ( pokemon.move.learned[pokemon.move.selected.slot].powerPoint.isZero() ) {
    pokemon.msgDeclareMove();
    pokemon.msgNoPowerPoint();
    return true;
  }

  truant:
  if ( pokemon.ability.isName( 'なまけ' ) ) {
    pokemon.stateChange.truant.count += 1;
    if ( pokemon.stateChange.truant.count % 2 === 1 ) break truant;

    pokemon.msgDeclareAbility();
    pokemon.msgTruant();
    return true;
  }

  focusPunch:
  if ( pokemon.move.selected.isName( 'きあいパンチ' ) ) {
    if ( pokemon.stateChange.focusPunch.isTrue === false ) break focusPunch;

    const judge: boolean = ( pokemon.stateChange.focusPunch.text === '集中' )? true : false;
    pokemon.stateChange.focusPunch.reset();

    if ( judge === false ) {
      pokemon.msgFocusPunch();
      return true;
    }
  }

  flinch:
  if ( pokemon.stateChange.flinch.isTrue ) {
    pokemon.msgFlinch();

    steadfast:
    if ( pokemon.ability.isName( 'ふくつのこころ' ) ) {
      if ( !pokemon.isChangeRank( 'spe', 1 ) ) break steadfast;

      pokemon.msgDeclareAbility();
      pokemon.changeRank( 'spe', 1 );
    }

    return true;
  }

  disable:
  if ( pokemon.stateChange.disable.isTrue ) {
    if ( !pokemon.move.selected.isName( pokemon.stateChange.disable.text ) ) break disable;

    pokemon.msgDisable();
    return true;
  }

  gravity:
  if ( main.field.whole.gravity.isTrue ) {
    if ( !pokemon.move.selected.getFlag().gravity ) break gravity;

    pokemon.msgGravity();
    return true;
  }

  healBlock:
  if ( pokemon.stateChange.healBlock.isTrue ) {
    if ( !pokemon.move.selected.getFlag().heal ) break healBlock;
    if ( pokemon.move.selected.isName( 'かふんだんご' ) && pokemon.attack.getValidTarget()[0].isMe !== pokemon.isMine() ) break healBlock;

    pokemon.msgHealBlock();
    return true;
  }

  throatChop:
  if ( pokemon.stateChange.throatChop.isTrue ) {
    if ( !pokemon.move.selected.getFlag().sound ) break throatChop;

    pokemon.msgThroatChop();
    return true;
  }

  taunt:
  if ( pokemon.stateChange.taunt.isTrue ) {
    if ( pokemon.move.selected.isName( 'さきどり' ) ) break taunt;
    if ( !pokemon.move.selected.isStatus() ) break taunt;

    pokemon.msgTaunt();
    return true;
  }

  imprison:
  /*
  for ( const target of main.getPokemonInSide( !pokemon.isMine() ) ) {
    if ( !target.stateChange.imprison.isTrue ) continue;
    for ( const move of target.move.learned ) {
      if ( !move.name ) continue;
      if ( pokemon.move.selected.isName( move.name ) ) {
        pokemon.msgImprison();
        return true;
      }
    }
  }
  */

  confuse:
  if ( pokemon.stateChange.confuse.isTrue ) {
    pokemon.stateChange.confuse.count -= 1;

    if ( pokemon.stateChange.confuse.count === 0 ) {
      pokemon.msgCureConfuse();
      pokemon.stateChange.confuse.reset()
      break confuse;
    }

    pokemon.msgStillConfuse();
    if ( getRandom() < 1/3 * 100 ) {
      pokemon.msgAttackMyself();

      const power: number = 40;
      const attack: number = getValueWithRankCorrection( pokemon.status.atk.av, pokemon.status.atk.rank.value, false );
      const defense: number = getValueWithRankCorrection( pokemon.status.def.av, pokemon.status.def.rank.value, false );

      // 最終ダメージ
      const damage = Math.floor( Math.floor( Math.floor( pokemon.level * 2 / 5 + 2 ) * power * attack / defense ) / 50 + 2 );
      // 乱数補正
      const randomCorrection = Math.floor( getRandom() * 16 ) + 8500;
      const finalDamage: number = Math.floor( damage * randomCorrection / 10000 );

      // 本体にダメージを与える
      /*
      const damageType = new Attack;
      damageType.damage = processAfterCalculation( pokemon, pokemon, finalDamage, damageType );
      damageToBody( pokemon, damageType );
      // ダメージをHP1で耐える効果のメッセージなど
      enduringEffectsMessage( pokemon );
      */
      return true;
    }
  }

  paralusis:
  if ( pokemon.statusAilment.isParalysis() ) {
    if ( getRandom() < 1/4 * 100 ) {
      pokemon.msgParalysis();
      return true;
    }
  }

  attract:
  /*
  if ( pokemon.stateChange.attract.isTrue ) {
    const target: Target = pokemon.stateChange.attract.target;
    const attractTarget: Pokemon | false = getPokemonByBattle( target.isMe, target.battle );
    if ( attractTarget === false ) break attract

    writeLog( `${getArticle( pokemon )}は ${getArticle( attractTarget )}に メロメロだ!` );

    if ( getRandom() < 50 ) break attract;

    writeLog( `${getArticle( pokemon )}は メロメロで 技が だせなかった!` );
    return true;
  }
  */

  return false;
}

// ねごと/いびき使用時「ぐうぐう 眠っている」メッセージ
function sleepyMessage( pokemon: Pokemon ): void {

  /*
  if ( sleepingMoveList.includes( pokemon.move.selected.name ) ) {
    pokemon.msgStillAsleep();
  }
  */
}

// 自分のこおりを回復するわざにより自身のこおり状態が治る
function meltMeByMove( pokemon: Pokemon ): void {

  if ( pokemon.statusAilment.isFrozen() ) {
    pokemon.statusAilment.getHealth();
    pokemon.msgMeltByMove();
  }
}

// 特性バトルスイッチによるフォルムチェンジ
function stanceChange( pokemon: Pokemon ): void {

  if ( pokemon.name === 'ギルガルド(盾)' ) {
    if ( !pokemon.move.selected.isStatus() ) {
      pokemon.msgDeclareAbility();
      pokemon.formChange();
      pokemon.msgAegislashSchild();
      return;
    }
  }

  if ( pokemon.name === 'ギルガルド(剣)' ) {
    if ( pokemon.move.selected.isName( 'キングシールド' ) ) {
      pokemon.msgDeclareAbility();
      pokemon.formChange();
      pokemon.msgAegislashBlade();
      return;
    }
  }
}

// 「<ポケモン>の <技>!」のメッセージ。PPが減少することが確約される
function moveDeclareMessage( pokemon: Pokemon ): void {
  pokemon.msgDeclareMove();
}

// 技のタイプが変わる。
function changeMoveType( pokemon: Pokemon ): void {

  if ( pokemon.ability.isName( 'うるおいボイス' ) ) {
    if ( pokemon.move.selected.getFlag().sound ) {
      pokemon.move.selected.type = 'Water';
    }
  }

  galvanize:
  if ( pokemon.ability.isName( 'エレキスキン' ) ) {
    pokemon.move.selected.activateSkin( 'Electric' );
  }

  aerilate:
  if ( pokemon.ability.isName( 'スカイスキン' ) ) {
    pokemon.move.selected.activateSkin( 'Flying' );
  }

  normalize:
  if ( pokemon.ability.isName( 'ノーマルスキン' ) ) {
    pokemon.move.selected.activateSkin( 'Normal' );
  }

  pixilate:
  if ( pokemon.ability.isName( 'フェアリースキン' ) ) {
    pokemon.move.selected.activateSkin( 'Fairy' );
  }

  refrigerate:
  if ( pokemon.ability.isName( 'フリーズスキン' ) ) {
    pokemon.move.selected.activateSkin( 'Ice' );
  }

  if ( pokemon.move.selected.isName( 'ウェザーボール' ) ) {
    if ( main.field.weather.isSunny( pokemon ) ) pokemon.move.selected.type = 'Fire';
    if ( main.field.weather.isRainy( pokemon ) ) pokemon.move.selected.type = 'Water';
    if ( main.field.weather.isSandy() ) pokemon.move.selected.type = 'Rock';
    if ( main.field.weather.isSnowy() ) pokemon.move.selected.type = 'Ice';
  }

  if ( pokemon.move.selected.isName( 'オーラぐるま' ) ) {
    if ( pokemon.name === 'モルペコ(空腹)' ) {
      pokemon.move.selected.type = 'Dark';
    }
  }

  if ( pokemon.move.selected.isName( 'さばきのつぶて' ) ) {
    for ( const plate of plateTable ) {
      if ( pokemon.item.isName( plate.name ) ) {
        pokemon.move.selected.type = plate.type;
      }
    }
  }

  if ( pokemon.move.selected.isName( 'しぜんのめぐみ' ) ) {
    for ( const berry of berryTable ) {
      if ( pokemon.item.isName( berry.name ) ) {
        pokemon.move.selected.type = berry.naturalGift.type;
      }
    }
  }

  if ( pokemon.move.selected.isName( 'だいちのはどう' ) ) {
    if ( pokemon.isGround() && main.field.terrain.isElectric() ) pokemon.move.selected.type = 'Electric';
    if ( pokemon.isGround() && main.field.terrain.isGrassy() ) pokemon.move.selected.type = 'Grass';
    if ( pokemon.isGround() && main.field.terrain.isPsychic() ) pokemon.move.selected.type = 'Psychic';
    if ( pokemon.isGround() && main.field.terrain.isMisty() ) pokemon.move.selected.type = 'Fairy';
  }

  if ( pokemon.move.selected.isName( 'テクノバスター' ) ) {
    for ( const drive of driveTable ) {
      if ( pokemon.item.isName( drive.name ) === true ) {
        pokemon.move.selected.type = drive.type;
      }
    }
  }

  if ( pokemon.move.selected.isName( 'マルチアタック' ) ) {
    for ( const memory of memoryTable ) {
      if ( pokemon.item.isName( memory.name ) === true ) {
        pokemon.move.selected.type = memory.type;
      }
    }
  }

  if ( pokemon.move.selected.isName( 'めざめるダンス' ) ) {
    pokemon.move.selected.type = pokemon.type.get()[0];
  }

  electrify:
  if ( pokemon.stateChange.electrify.isTrue ) {
    if ( pokemon.move.selected.isName( 'わるあがき' ) ) break electrify;

    pokemon.move.selected.type = 'Electric';
  }

  ionDeluge:
  if ( main.field.whole.ionDeluge.isTrue ) {
    if ( pokemon.move.selected.isName( 'わるあがき' ) ) break ionDeluge;
    if ( pokemon.move.selected.type !== 'Normal' ) break ionDeluge;

    pokemon.move.selected.type = 'Electric';
  }
}

// 技の対象が決まる。若い番号の対象が優先される。
function decideTarget( pokemon: Pokemon ): void {

  // フリーフォールによる対象

  // ちゅうもくのまと状態の敵

  // ひらいしん/よびみずのポケモン

  // カウンター/ミラーコート/メタルバーストの反射対象

  // ランダム1体が対象の技の対象

  // 技を選択した対象
  if ( main.field.battleStyle === 1 ) {
    switch ( pokemon.move.selected.target ) {
      case 'users-field':
      case 'opponents-field':
      case 'entire-field':
        pokemon.attack.setField();
        break;

      case 'user':
      case 'ally':
      case 'user-or-ally':
      case 'user-and-allies':
        pokemon.attack.setPokemon( pokemon.isMine(), 0 );
        break;

      case 'selected-pokemon':
      case 'random-opponent':
      case 'all-opponents':
      case 'all-other-pokemon':
        pokemon.attack.setPokemon( !pokemon.isMine(), 0 );
        break;

      case 'all-pokemon':
        pokemon.attack.setPokemon( pokemon.isMine(), 0 );
        pokemon.attack.setPokemon( !pokemon.isMine(), 0 );
        break;

      case 'specific-move':
      case 'selected-pokemon-me-first':
        break;

      default:
        break;
    }
  }

  /*
  if ( pokemon.attack.getValidTarget().length >= 2 ) {
    pokemon.stateChange.rangeCorr.isTrue = true;
  }
  */
}

// PPが適切な量引かれる
function deductPowerPoint( pokemon: Pokemon ): void {

  const sub = { value: 0, slot: pokemon.move.selected.slot };
  const pressureSide: number = main.getPokemonInSide( !pokemon.isMine() )?.filter( p => p.ability.isName( 'プレッシャー' ) ).length;
  let pressureTarget: number = 0;

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    if ( attack.isField() ) break;
    if ( attack.isMe === pokemon.isMine() ) continue;
    if ( main.getPokemonByBattle( attack ).ability.isName( 'プレッシャー' ) ) {
      pressureTarget += 1;
    }
  }

  switch ( pokemon.move.selected.target ) {
    case 'users-field':
      sub.value = 1;
      break;

    case 'opponents-field':
      if ( pokemon.move.selected.isName( 'ねばねばネット' ) ) sub.value = 1
      else sub.value = pressureSide;
      break;

    case 'entire-field':
      sub.value = pressureSide;
      break;

    default:
      if ( pokemon.move.selected.isName( 'ふういん' ) || pokemon.move.selected.isName( 'テラバースト' ) ) {
        sub.value = pressureSide;
      } else {
        sub.value = pressureTarget;
      }

  }

  pokemon.move.learned[sub.slot].powerPoint.sub( Math.max( 1, sub.value )  );
}

// ほのおタイプではないことによるもえつきるの失敗
function burnUpFailure( pokemon: Pokemon ): boolean {

  if ( !pokemon.move.selected.isName( 'もえつきる' ) ) return false;
  if ( pokemon.type.has( 'Fire' ) ) return false;

  pokemon.attack.reset();
  pokemon.msgDeclareFailure();

  return true;
}

// おおあめ/おおひでりによるほのお/みず技の失敗
function failureByWeather( pokemon: Pokemon ): boolean {

  if ( pokemon.move.selected.isStatus() ) return false;

  if ( main.field.weather.isBadRainy( pokemon ) ) {
    if ( pokemon.move.selected.type === 'Fire' ) {
      pokemon.attack.reset();
      pokemon.msgBadRainy();
      return true;
    }
  }

  if ( main.field.weather.isBadSunny( pokemon ) ) {
    if ( pokemon.move.selected.type === 'Water' ) {
      pokemon.attack.reset();
      pokemon.msgBadSunny();
      return true;
    }
  }

  return false;
}

// ふんじんによるほのお技の失敗とダメージ
function failureByPowder( pokemon: Pokemon ): boolean {

  if ( !pokemon.stateChange.powder.isTrue ) return false;
  if ( pokemon.move.selected.type !== 'Fire' ) return false;

  pokemon.attack.reset();
  pokemon.msgPowder();

  if ( pokemon.ability.isName( 'マジックガード' ) ) return true;

  const damage: number = Math.floor( pokemon.getOrgHP() / 4 );
  pokemon.status.hp.value.sub( damage );

  return true;
}

// ミクルのみによる命中補正効果が消費される
function hitCorrConsumance( pokemon: Pokemon ): void {

}

// 技の仕様による失敗
function failureByMoveSpec( pokemon: Pokemon ): boolean {

  steelRoller:
  if ( pokemon.move.selected.isName( 'アイアンローラー' ) ) {
    if ( !main.field.terrain.isPlain() ) break steelRoller;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  hyperspaceFury:
  if ( pokemon.move.selected.isName( 'いじげんラッシュ' ) ) {
    if ( pokemon.name === 'フーパ(解放)' ) break hyperspaceFury;
    if ( pokemon.stateChange.transform.isTransform( 'フーパ(解放)' ) ) break hyperspaceFury;

    pokemon.attack.reset();
    pokemon.msgInvalidUser();
    return true;
  }

  darkVoid:
  if ( pokemon.move.selected.isName( 'ダークホール' ) ) {
    if ( pokemon.name === 'ダークライ' ) break darkVoid;
    if ( pokemon.stateChange.transform.isTransform( 'ダークライ' ) ) break darkVoid;

    pokemon.attack.reset();
    pokemon.msgInvalidUser();
    return true;
  }

  auraWheel:
  if ( pokemon.move.selected.isName( 'オーラぐるま' ) ) {
    if ( pokemon.name === 'モルペコ(満腹)'  ) break auraWheel;
    if ( pokemon.name === 'モルペコ(空腹)'  ) break auraWheel;
    if ( pokemon.stateChange.transform.isTransform( 'モルペコ(満腹)' ) ) break auraWheel;
    if ( pokemon.stateChange.transform.isTransform( 'モルペコ(満腹)' ) ) break auraWheel;

    pokemon.attack.reset();
    pokemon.msgInvalidUser();
    return true;
  }

  auroraVeil:
  if ( pokemon.move.selected.isName( 'オーロラベール' ) ) {
    if ( !main.field.weather.isSnowy() ) break auroraVeil;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  clangorousSoul:
  if ( pokemon.move.selected.isName( 'ソウルビート' ) ) {
    if ( pokemon.status.hp.value.isGreaterEqual( 3 ) ) break clangorousSoul;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  stockpile:
  if ( pokemon.move.selected.isName( 'たくわえる' ) ) {
    if ( pokemon.stateChange.stockpile.count !== 3 ) break stockpile;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  teleport:
  if ( pokemon.move.selected.isName( 'テレポート' ) ) {
    if ( main.getPlayer( pokemon.isMine() ).isExcangable() ) break teleport;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  lastResort:
  if ( pokemon.move.selected.isName( 'とっておき' ) ) {
    let isFailure: boolean = false;
    // 「とっておき」を覚えていない
    //if ( pokemon.learnedMove.filter( move => move.name === 'とっておき' ).length === 0 ) isFailure = true;
    // 「とっておき以外の技」を覚えていない
    //if ( pokemon.learnedMove.filter( move => move.name !== 'とっておき' && move.name !== null ).length === 0 ) isFailure = true;
    // 使用していない「とっておき以外の技」がある
    //if ( pokemon.learnedMove.filter( move => move.name !== 'とっておき' && move.name !== null && move.isUsed === false ).length > 0 ) isFailure = true;

    if ( isFailure === false ) break lastResort;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  spitUp:
  if ( pokemon.move.selected.isName( 'はきだす' ) || pokemon.move.selected.isName( 'のみこむ' ) ) {
    if ( pokemon.stateChange.stockpile.count > 0 ) break spitUp;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  stuffCheeks:
  if ( pokemon.move.selected.isName( 'ほおばる' ) ) {
    if ( pokemon.item.isBerry() ) break stuffCheeks;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  fling:
  if ( pokemon.move.selected.isName( 'なげつける' ) ) {
    // 条件分岐がおかしい
    // 持ち物がない
    if ( pokemon.item.isNull() ) break fling;
    if ( !pokemon.item.isValid() ) break fling;
    // 不適格な持ち物である
    if ( pokemon.item.isName( 'べにいろのたま' ) ) break fling;
    if ( pokemon.item.isName( 'あいいろのたま' ) ) break fling;
    if ( pokemon.item.isName( 'くちたけん' ) ) break fling;
    if ( pokemon.item.isName( 'くちたたて' ) ) break fling;
    if ( pokemon.item.isName( 'だいこんごうだま' ) ) break fling;
    if ( pokemon.item.isName( 'だいしらたま' ) ) break fling;
    if ( pokemon.item.isName( 'だいはっきんだま' ) ) break fling;
    if ( pokemon.name === 'ギラティナ(アナザー)' && pokemon.item.isName( 'はっきんだま' ) ) break fling;
    if ( pokemon.name === 'ギラティナ(オリジン)' && pokemon.item.isName( 'はっきんだま' ) ) break fling;
    if ( pokemon.name === 'アルセウス' && plateTable.filter( plate => plate.name === pokemon.name ).length === 1 ) break fling;
    if ( pokemon.name === 'ゲノセクト' && driveTable.filter( drive => drive.name === pokemon.item.name ).length === 1 ) break fling;
    if ( gemTable.filter( gem => gem.name === pokemon.item.name ).length === 1 ) break fling;
    if ( zCrystalTable.filter( zCrystal => zCrystal.name === pokemon.item.name ).length === 1 ) break fling;
    if ( megaStoneTable.filter( mega => mega.name === pokemon.item.name && mega.name === pokemon.name ).length === 1 ) break fling;
    if ( paradoxPokemonList.includes( pokemon.name ) && pokemon.item.isName( 'ブーストエナジー' ) ) break fling;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  naturalGift:
  if ( pokemon.move.selected.isName( 'しぜんのめぐみ' ) ) {
    if ( pokemon.item.isBerry() ) break naturalGift;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  fakeOut:
  if ( pokemon.move.selected.isName( 'ねこだまし' ) || pokemon.move.selected.isName( 'であいがしら' ) || pokemon.move.selected.isName( 'たたみがえし' ) ) {
    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  noRetreat:
  if ( pokemon.move.selected.isName( 'はいすいのじん' ) ) {
    if ( !pokemon.stateChange.noRetreat.isTrue ) break noRetreat;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  suckerPunch:
  if ( pokemon.move.selected.isName( 'ふいうち' ) ) {
    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  poltergeist:
  if ( pokemon.move.selected.isName( 'ポルターガイスト' ) ) {
    const attack: Attack[] = pokemon.attack.getValidTarget();
    if ( attack.length === 0 ) break poltergeist;

    const target: Pokemon = main.getPokemonByBattle( attack[0] );
    if ( !target.item.isNull() ) break poltergeist;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  protect:
  /*
  if ( protectMoveList.includes( pokemon.move.selected.name ) ) {
    if ( pokemon.stateChange.someProtect.isTrue === false ) break protect;
    if ( getRandom() < Math.pow( 1 / 3, pokemon.stateChange.someProtect.count ) ) break protect;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }
  */

  snore:
  if ( pokemon.move.selected.isName( 'いびき' ) || pokemon.move.selected.isName( 'ねごと' ) ) {
    if ( pokemon.statusAilment.isAsleep() ) break snore;
    if ( pokemon.ability.isName( 'ぜったいねむり' ) ) break snore;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  rest:
  if ( pokemon.move.selected.isName( 'ねむる' ) ) {
    if ( pokemon.status.hp.value.isMax() ) break rest;
    if ( pokemon.statusAilment.isAsleep() ) break rest;
    if ( pokemon.ability.isName( 'ふみん' ) ) break rest;
    if ( pokemon.ability.isName( 'やるき' ) ) break rest;
    if ( pokemon.ability.isName( 'ぜったいねむり' ) ) break rest;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  lowKick:
  if ( pokemon.move.selected.isName( 'けたぐり' ) || pokemon.move.selected.isName( 'くさむすび' ) || pokemon.move.selected.isName( 'ヘビーボンバー' ) || pokemon.move.selected.isName( 'ヒートスタンプ' ) ) {
    const attack: Attack[] = pokemon.attack.getValidTarget();
    if ( attack.length === 0 ) break lowKick;

    const target: Pokemon = main.getPokemonByBattle( attack[0] );
    if ( !target.stateChange.dynamax.isTrue ) break lowKick;

    pokemon.attack.reset();
    pokemon.msgRefWeight();
    return true;
  }

  return false;
}

// 特性による失敗
function failureByAbility( pokemon: Pokemon ): boolean {

  damp:
  if ( pokemon.move.selected.isExplosion() ) {
    if ( !main.isExistAbility( 'しめりけ' ) ) break damp;
    const poke = main.getExistAbility( 'しめりけ' );
    poke.msgDeclareAbility();

    pokemon.msgCannotUse();
    pokemon.attack.reset();
    return true;
  }

  queenlyMajesty:
  if ( pokemon.move.selected.priority > 0 ) {
    if ( pokemon.attack.getValidTarget().filter( p => p.isMe !== pokemon.isMine() ).length === 0 ) break queenlyMajesty;

    if ( main.isExistAbilityInSide( !pokemon.isMine(), 'じょおうのいげん' ) ) {
      const poke = main.getExistAbilityInSide( !pokemon.isMine(), 'じょおうのいげん' );
      poke.msgDeclareAbility();

      pokemon.msgCannotUse();
      pokemon.attack.reset();
      return true;
    }

    if ( main.isExistAbilityInSide( !pokemon.isMine(), 'ビビッドボディ' ) ) {
      const poke = main.getExistAbilityInSide( !pokemon.isMine(), 'ビビッドボディ' );
      poke.msgDeclareAbility();

      pokemon.msgCannotUse();
      pokemon.attack.reset();
      return true;
    }
  }

  return false;
}

// 中断されても効果が発動する技
function effectAlwaysActivate( pokemon: Pokemon ): boolean {

  if ( pokemon.move.selected.isName( 'みらいよち' ) || pokemon.move.selected.isName( 'はめつのねがい' ) ) {
    const futureSight = new StateChange( 'みらいにこうげき' );
    futureSight.isTrue = true;
    //futureSight.target.isMine() = one.target.isMe;
    //futureSight.target.battle = one.target.order.battle;
    main.field.whole.futureSight.push( futureSight );

    if ( pokemon.move.selected.isName( 'みらいよち' ) ) {
      pokemon.msgFutureSight();
    }
    if ( pokemon.move.selected.isName( 'はめつのねがい' ) ) {
      pokemon.msgDoomDesire();
    }

    return true;
  }

  rage:
  if ( pokemon.move.selected.isName( 'いかり' ) ) {
    if ( pokemon.stateChange.rage.isTrue ) break rage;
    pokemon.stateChange.rage.isTrue = true;
  }

  return false;
}

// へんげんじざい/リベロの発動
function abilityChangeType( pokemon : Pokemon ): void {

  const myType: PokemonType[] = pokemon.type.get();

  protean:
  if ( pokemon.ability.isName( 'へんげんじざい' ) || pokemon.ability.isName( 'リベロ' ) ) {

    if ( pokemon.type.isOnly( pokemon.move.selected.type ) ) break protean;
    if ( pokemon.stateChange.protean.isTrue ) break protean;
    if ( pokemon.move.selected.isName( 'わるあがき' ) ) break protean;
    if ( pokemon.move.selected.isName( 'みらいよち' ) ) break protean;
    if ( pokemon.move.selected.isName( 'はめつのねがい' ) ) break protean;

    pokemon.msgDeclareAbility();
    pokemon.type.toType( pokemon.move.selected.type );
    pokemon.stateChange.protean.isTrue = true;
    pokemon.msgProtean();
  }
}

// 溜め技の溜めターンでの動作
function preliminaryAction( pokemon: Pokemon ): boolean {

  if ( !pokemon.move.selected.getFlag().charge ) return false;
  if ( pokemon.move.selected.isStore() ) return false;

  if ( pokemon.move.selected.isName( 'かまいたち' ) ) {
    writeLog( `${getArticle( pokemon )}の 周りで 空気が 渦を巻く!` );
  }
  if ( pokemon.move.selected.isName( 'コールドフレア' ) ) {
    writeLog( `${getArticle( pokemon )}は 凍える空気に 包まれた!` );
  }
  if ( pokemon.move.selected.isName( 'ゴッドバード' ) ) {
    writeLog( `${getArticle( pokemon )}を 激しい光が 包む!` );
  }
  if ( pokemon.move.selected.isName( 'ジオコントロール' ) ) {
    writeLog( `${getArticle( pokemon )}は パワーを ためこんでいる!` );
  }
  if ( pokemon.move.selected.isName( 'ソーラービーム' ) || pokemon.move.selected.isName( 'ソーラーブレード' ) ) {
    writeLog( `${getArticle( pokemon )}は 光を 吸収した!` );

    if ( main.field.weather.isSunny( pokemon ) ) {
      moveDeclareMessage( pokemon );
      return false;
    }
  }
  if ( pokemon.move.selected.isName( 'フリーズボルト' ) ) {
    writeLog( `${getArticle( pokemon )}は 冷たい光に 包まれた!` );
  }
  if ( pokemon.move.selected.isName( 'メテオビーム' ) ) {
    writeLog( `${getArticle( pokemon )}に 宇宙の 力が あふれだす!` );
    changeMyRank( pokemon, 'specialAttack', 1 );
  }
  if ( pokemon.move.selected.isName( 'ロケットずつき' ) ) {
    writeLog( `${getArticle( pokemon )}は 首を 引っ込めた!` );
    changeMyRank( pokemon, 'defense', 1 );
  }
  if ( pokemon.move.selected.isName( 'あなをほる' ) ) {
    writeLog( `${getArticle( pokemon )}は 地面に 潜った!` );
    pokemon.stateChange.dig.isTrue = true;
  }
  if ( pokemon.move.selected.isName( 'そらをとぶ' ) ) {
    writeLog( `${getArticle( pokemon )}は 空高く 飛び上がった!` );
    pokemon.stateChange.fly.isTrue = true;
  }
  if ( pokemon.move.selected.isName( 'とびはねる' ) ) {
    writeLog( `${getArticle( pokemon )}は 高く 飛び跳ねた!` );
    pokemon.stateChange.fly.isTrue = true;
  }
  /*
  if ( pokemon.move.selected.isName( 'フリーフォール' ) ) {
    let isFailure: boolean = false;
    if ( one.target.isMine() === pokemon.isMine() ) isFailure = true;
    if ( one.target.stateChange.substitute.isTrue ) isFailure = true;
    if ( isHide( one.target ) === true ) isFailure = true;
    if ( isFailure === true ) {
      pokemon.attack.reset();
      pokemon.msgDeclareFailure();
      return true;
    }

    if ( one.target.getWeight() >= 200 ) {
      pokemon.attack.reset();
      writeLog( `${getArticle( one.target )}は 重すぎて 持ち上げられない!` );
      return true;
    }

    writeLog( `${getArticle( pokemon )}は ${getArticle( one.target )}を 上空に 連れ去った!` );
    pokemon.stateChange.fly.isTrue = true;
    one.target.stateChange.fly.isTrue = true;

    return true;
  }
  */
  if ( pokemon.move.selected.isName( 'ダイビング' ) ) {
    writeLog( `${getArticle( pokemon )}は 水中に 身を潜めた!` );
    pokemon.stateChange.dive.isTrue = true;

    if ( pokemon.name === 'ウッウ' ) {
      pokemon.formChange();
    }
  }
  if ( pokemon.move.selected.isName( 'ゴーストダイブ' ) ) {
    writeLog( `${getArticle( pokemon )}の姿が 一瞬にして 消えた!` );
    pokemon.stateChange.shadowForce.isTrue = true;
  }
  if ( pokemon.move.selected.isName( 'シャドーダイブ' ) ) {
    writeLog( `${getArticle( pokemon )}の姿が 一瞬にして 消えた!` );
    pokemon.stateChange.shadowForce.isTrue = true;
  }

  if ( !pokemon.item.isName( 'パワフルハーブ' ) ) {
    pokemon.move.selected.setStore();
    return true;
  }

  pokemon.msgPowerHerb();
  pokemon.consumeItem();
  pokemon.msgDeclareMove();

  return false;
}

// マグニチュードの大きさ(威力)が決定
function dicideMagnitudePower( pokemon: Pokemon ): void {

  pokemon.move.selected.fixMagnitudePower();
}

// 姿を隠していることによる無効化
function disableByConcealment( pokemon: Pokemon ): boolean {

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    if ( !target.stateChange.isHide() ) continue;
    if ( pokemon.stateChange.lockOn.isTrue ) continue;
    if ( pokemon.ability.isName( 'ノーガード' ) ) continue;
    if ( target.ability.isName( 'ノーガード' ) ) continue;
    if ( pokemon.move.selected.isName( 'どくどく' ) && pokemon.type.has( 'Poison' ) ) continue;
    if ( pokemon.move.selected.isName( 'アロマセラピー' ) ) continue;
    if ( pokemon.move.selected.isName( 'いやしのすず' ) ) continue;
    if ( pokemon.move.selected.isName( 'てだすけ' ) ) continue;


    let isValid: boolean = true;

    if ( target.stateChange.dig.isTrue ) {
      if ( pokemon.move.selected.isName( 'じしん' ) ) isValid = true;
      if ( pokemon.move.selected.isName( 'マグニチュード' ) ) isValid = true;
    }
    if ( target.stateChange.fly.isTrue ) {
      if ( pokemon.move.selected.isName( 'かぜおこし' ) ) isValid = true;
      if ( pokemon.move.selected.isName( 'たつまき' ) ) isValid = true;
      if ( pokemon.move.selected.isName( 'かみなり' ) ) isValid = true;
      if ( pokemon.move.selected.isName( 'スカイアッパー' ) ) isValid = true;
      if ( pokemon.move.selected.isName( 'うちおとす' ) ) isValid = true;
      if ( pokemon.move.selected.isName( 'ぼうふう' ) ) isValid = true;
      if ( pokemon.move.selected.isName( 'サウザンアロー' ) ) isValid = true;
    }
    if ( target.stateChange.dive.isTrue ) {
      if ( pokemon.move.selected.isName( 'なみのり' ) ) isValid = true;
      if ( pokemon.move.selected.isName( 'うずしお' ) ) isValid = true;
    }

    if ( isValid ) continue;

    attack.success = false;
    target.msgNotHit();
  }

  return pokemon.attack.isFailure();
}

// サイコフィールドによる無効化
function disableByPsychofield( pokemon: Pokemon ): boolean {

  if ( main.field.terrain.isPsychic() ) return false;
  if ( pokemon.move.selected.priority <= 0 ) return false;

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    if ( target.isMine() === pokemon.isMine() ) continue;
    if ( !target.isGround() ) continue;
    if ( target.stateChange.isHide() ) continue;

    attack.success = false;
    target.msgPsychicTerrain();
  }

  return pokemon.attack.isFailure();
}

// ファストガード/ワイドガード/トリックガードによる無効化
function disableByOtherProtect( pokemon: Pokemon ): boolean {

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    quickGuard:
    if ( main.field.getSide( target.isMine() ).quickGuard.isTrue ) {
      if ( pokemon.move.selected.priority <= 0 ) break quickGuard;
      if ( pokemon.ability.isName( 'ふかしのこぶし' ) && pokemon.move.selected.getFlag().contact ) break quickGuard;

      attack.success = false;
      target.msgQuickGuard();
      continue;
    }

    wideGuard:
    if ( main.field.getSide( target.isMine() ).wideGuard.isTrue ) {
      if ( pokemon.move.selected.target !== 'all-opponents' && pokemon.move.selected.target !== 'all-other-pokemon' ) break wideGuard;
      if ( pokemon.ability.isName( 'ふかしのこぶし' ) && pokemon.move.selected.getFlag().contact ) break wideGuard;

      attack.success = false;
      target.msgWideGuard();
      continue;
    }

    craftyShield:
    if ( main.field.getSide( target.isMine() ).craftyShield.isTrue ) {
      if ( target.isMine() === pokemon.isMine() ) break craftyShield;
      if ( !pokemon.move.selected.isStatus() ) break craftyShield;
      if ( pokemon.move.selected.target === 'all-pokemon' ) break craftyShield;
      if ( pokemon.move.selected.target === 'user-and-allies' ) break craftyShield;
      if ( pokemon.move.selected.isName( 'コーチング' ) ) break craftyShield;
      if ( pokemon.move.selected.isName( 'オウムがえし' ) ) break craftyShield;
      if ( pokemon.move.selected.isName( 'さきどり' ) ) break craftyShield;

      attack.success = false;
      target.msgCraftyShield();
      continue;
    }
  }

  return pokemon.attack.isFailure();
}

// まもる/キングシールド/ブロッキング/ニードルガード/トーチカによる無効化
function disableByProtect( pokemon: Pokemon ): boolean {

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    if ( !target.stateChange.protect.isTrue ) continue;
    if ( !pokemon.move.selected.getFlag().protect ) continue;
    if ( pokemon.ability.isName( 'ふかしのこぶし' ) && pokemon.move.selected.getFlag().contact ) continue;
    if ( target.stateChange.protect.text === 'キングシールド' && pokemon.move.selected.isStatus() ) continue;
    if ( target.stateChange.protect.text === 'ブロッキング' && pokemon.move.selected.isStatus() ) continue;

    attack.success = false;
    target.msgProtect();

    spikyShield:
    if ( target.stateChange.protect.text === 'ニードルガード' ) {
      if ( !pokemon.move.selected.getFlag().contact ) break spikyShield;
      if ( pokemon.move.selected.isName( 'フリーフォール' ) ) break spikyShield;
      if ( pokemon.ability.isName( 'マジックガード' ) ) break spikyShield;
      if ( target.item.isName( 'ぼうごパット' ) ) break spikyShield;

      const damage: number = Math.max( 1, Math.floor( pokemon.getOrgHP() / 8 ) )
      pokemon.status.hp.value.sub( damage );
      pokemon.msgHurt();
    }

    banefulBunker:
    if ( target.stateChange.protect.text === 'トーチカ' ) {
      if ( !pokemon.move.selected.getFlag().contact ) break banefulBunker;
      if ( pokemon.move.selected.isName( 'フリーフォール' ) ) break banefulBunker;
      if ( !pokemon.isGetAilmentByOther( 'Poisoned', target ) ) break banefulBunker;

      pokemon.statusAilment.getPoisoned();
    }

    kingsShield:
    if ( target.stateChange.protect.text === 'キングシールド' ) {
      if ( !pokemon.move.selected.getFlag().contact ) break kingsShield;
      if ( !pokemon.isChangeRankByOther( 'atk', -1, target ) ) break kingsShield;

      pokemon.changeRankByOther( 'atk', -1, target );
    }

    obstruct:
    if ( target.stateChange.protect.text === 'ブロッキング' ) {
      if ( pokemon.move.selected.getFlag().contact === false ) break obstruct;
      if ( !pokemon.isChangeRankByOther( 'def', -2, target ) ) break obstruct;

      pokemon.changeRankByOther( 'def', -2, target );
    }
  }

  return pokemon.attack.isFailure();
}

// たたみがえしによる無効化
function disableByMatBlock( pokemon: Pokemon ): boolean {

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    if ( !main.field.getSide( target.isMine() ).matBlock.isTrue ) continue;
    if ( pokemon.move.selected.isStatus() ) continue;
    if ( pokemon.ability.isName( 'ふかしのこぶし' ) && pokemon.move.selected.getFlag().contact ) continue;

    attack.success = false;
    pokemon.msgMatBlock();
  }

  return pokemon.attack.isFailure();
}

// ダイウォールによる無効化
function disableByMaxGuard( pokemon: Pokemon ): boolean {

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    if ( target.stateChange.protect.text !== 'ダイウォール' ) continue;
    //if ( notMaxGuardMoveList.includes( pokemon.move.selected.name ) === false && pokemon.move.selected.getFlag().protect === false ) continue;

    attack.success = false;
    target.msgProtect();
  }

  return pokemon.attack.isFailure();
}

// テレキネシスの、対象がディグダ/ダグトリオ/スナバァ/シロデスナ/メガゲンガー/うちおとす状態/ねをはる状態であることによる失敗
function failureByTelekinesis( pokemon: Pokemon ): boolean {

  if ( !pokemon.move.selected.isName( 'テレキネシス' ) ) return false;

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    const check = ( target: Pokemon ): boolean => {
      if ( target.isName( 'ディグダ' ) ) return false;
      if ( target.isName( 'ダグトリオ' ) ) return false;
      if ( target.isName( 'スナバァ' ) ) return false;
      if ( target.isName( 'シロデスナ' ) ) return false;
      if ( target.isName( 'メガゲンガー' ) ) return false;
      if ( target.stateChange.smackDown.isTrue ) return false;
      if ( target.stateChange.ingrain.isTrue ) return false;
      return true;
    }

    if ( check( target ) ) continue;

    attack.success = false;
    pokemon.msgDeclareFailure();
  }

  return pokemon.attack.isFailure();
}

// 特性による無効化(その1)
function disableByAbility1st( pokemon: Pokemon ): boolean {

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    // そうしょく: くさタイプ
    if ( target.ability.isName( 'そうしょく' ) ) {
      if ( pokemon.move.selected.type === 'Grass' ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    // もらいび: ほのおタイプ
    if ( target.ability.isName( 'もらいび' ) ) {
      if ( pokemon.move.selected.type === 'Fire' ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    // かんそうはだ/よびみず/ちょすい: みずタイプ
    if ( target.ability.isName( 'かんそうはだ' ) ) {
      if ( pokemon.move.selected.type === 'Water' ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    if ( target.ability.isName( 'よびみず' ) ) {
      if ( pokemon.move.selected.type === 'Water' ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    if ( target.ability.isName( 'ちょすい' ) ) {
      if ( pokemon.move.selected.type === 'Water' ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    // ひらいしん/でんきエンジン/ちくでん: でんきタイプ
    if ( target.ability.isName( 'ひらいしん' ) ) {
      if ( pokemon.move.selected.type === 'Electric' ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    if ( target.ability.isName( 'でんきエンジン' ) ) {
      if ( pokemon.move.selected.type === 'Electric' ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    if ( target.ability.isName( 'ちくでん' ) ) {
      if ( pokemon.move.selected.type === 'Electric' ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    // ぼうおん: 音技
    if ( target.ability.isName( 'ぼうおん' ) ) {
      if ( pokemon.move.selected.getFlag().sound ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    // テレパシー:　味方による攻撃技
    // ふしぎなまもり: 効果抜群でない技
    // ぼうじん: 粉技
    if ( target.ability.isName( 'ぼうじん' ) ) {
      if ( pokemon.move.selected.getFlag().powder ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
  }

  return pokemon.attack.isFailure();
}

// 相性による無効化
function disableByCompatibility( pokemon: Pokemon ): boolean {

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    if ( pokemon.move.selected.isStatus() && !pokemon.move.selected.isName( 'でんじは' ) ) continue;

    attack.calcEffective( pokemon.move.selected, target );

    if ( attack.effective > 0 ) continue;
    attack.success = false;
    target.msgInvalid();
  }

  return pokemon.attack.isFailure();
}

// ふゆうによるじめん技の無効化
function disableGroundMove1st( pokemon: Pokemon ): boolean {

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    if ( !target.ability.isName( 'ふゆう' ) ) continue;
    if ( pokemon.move.selected.type !== 'Ground' ) continue;

    target.msgDeclareAbility();
    attack.success = false;
    target.msgInvalid();
  }

  return pokemon.attack.isFailure();
}

// でんじふゆう/テレキネシス/ふうせんによるじめん技の無効化
function disableGroundMove2nd( pokemon: Pokemon ): boolean {

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    if ( pokemon.move.selected.type !== 'Ground' ) continue;

    if ( !target.stateChange.magnetRise.isTrue &&
      !target.stateChange.telekinesis.isTrue &&
      !target.item.isName( 'ふうせん' ) ) continue;

    attack.success = false;
    target.msgInvalid();
  }

  return pokemon.attack.isFailure();
}

// ぼうじんゴーグルによる粉技の無効化
function disablePowder( pokemon: Pokemon ): boolean {

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    if ( !pokemon.move.selected.getFlag().powder ) continue;
    if ( !target.item.isName( 'ぼうじんゴーグル' ) ) continue;

    target.msgSafetyGoggles( pokemon.move.selected.translate() );
    attack.success = false;
    target.msgInvalid();
  }

  return pokemon.attack.isFailure();
}

// 特性による無効化(その2)
function disableByAbility2nd( pokemon: Pokemon ): boolean {

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    // ぼうだん: 弾の技
    if ( target.ability.isName( 'ぼうだん' ) ) {
      if ( pokemon.move.selected.getFlag().ballistics ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    // ねんちゃく: トリック/すりかえ/ふしょくガス
    if ( target.ability.isName( 'ねんちゃく' ) ) {
      if ( pokemon.move.selected.isName( 'トリック' ) ||
        pokemon.move.selected.isName( 'すりかえ' ) ||
        pokemon.move.selected.isName( 'ふしょくガス' ) ) {
          target.msgDeclareAbility();
          attack.success = false;
          target.msgInvalid();
      }
    }
  }

  return pokemon.attack.isFailure();
}

// タイプによる技の無効化(その1)
function disableByType1st( pokemon: Pokemon ): boolean {

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    // くさタイプ: 粉技の無効化
    if ( target.type.get().includes( 'Grass' ) ) {
      if ( pokemon.move.selected.getFlag().powder ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // ゴーストタイプ: にげられない状態にする変化技/たこがための無効化
    // あくタイプ: いたずらごころの効果が発動した技の無効化
    // こおりタイプ: ぜったいれいどの無効化
    Ice:
    if ( target.type.get().includes( 'Ice' ) ) {
      if ( pokemon.move.selected.isName( 'ぜったいれいど' ) ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // ひこうタイプ: フリーフォールの無効化
    if ( target.type.get().includes( 'Flying' ) ) {
      if ( pokemon.move.selected.isName( 'フリーフォール' ) ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
  }

  return pokemon.attack.isFailure();
}

// 技の仕様による無効化(その1)
function disableByMoveSpec1st( pokemon: Pokemon ): boolean {

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    // メロメロ: 対象と性別が同じ/対象が性別不明
    if ( pokemon.move.selected.isName( 'メロメロ' ) ) {
      if ( pokemon.gender === target.gender ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
      if ( target.gender === 'genderless' ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // いちゃもん: 対象がダイマックスしている
    // ベノムトラップ: 対象がどく/もうどく状態でない
    if ( pokemon.move.selected.isName( 'ベノムトラップ' ) ) {
      if ( !target.statusAilment.isPoisoned() ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
  }

  return pokemon.attack.isFailure();
}

// 技の仕様による無効化(その2)
function disableByMoveSpec2nd( pokemon: Pokemon ): boolean {

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    // 重複による無効化
    // あくび: 対象がすでにねむけ状態/状態異常である
    if ( pokemon.move.selected.isName( 'あくび' ) ) {
      if ( target.stateChange.yawn.isTrue ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
      if ( !target.statusAilment.isHealth() ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // いちゃもん: 対象がすでにいちゃもん状態である
    if ( pokemon.move.selected.isName( 'いちゃもん' ) ) {
      if ( target.stateChange.torment.isTrue ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // さしおさえ: 対象がすでにさしおさえ状態である
    if ( pokemon.move.selected.isName( 'さしおさえ' ) ) {
      if ( target.stateChange.embargo.isTrue ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // テレキネシス: 対象がすでにテレキネシス状態である
    if ( pokemon.move.selected.isName( 'テレキネシス' ) ) {
      if ( target.stateChange.telekinesis.isTrue ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // なやみのタネ: 対象の特性がふみん/なまけである
    if ( pokemon.move.selected.isName( 'なやみのタネ' ) ) {
      if ( target.ability.isName( 'ふみん' ) ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
      if ( target.ability.isName( 'なまけ' ) ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // ねをはる: 自身がすでにねをはる状態である
    if ( pokemon.move.selected.isName( 'ねをはる' ) ) {
      if ( pokemon.stateChange.ingrain.isTrue ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // ほろびのうた: 対象がすでにほろびのうた状態である
    if ( pokemon.move.selected.isName( 'ほろびのうた' ) ) {
      if ( target.stateChange.perishSong.isTrue ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // みやぶる/かぎわける/ミラクルアイ: 対象がすでにみやぶられている/ミラクルアイ状態である
    if ( pokemon.move.selected.isName( 'みやぶる' ) || pokemon.move.selected.isName( 'かぎわける' ) || pokemon.move.selected.isName( 'ミラクルアイ' ) ) {
      if ( target.stateChange.foresight.isTrue ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
      if ( target.stateChange.miracleEye.isTrue ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // メロメロ: 対象がすでにメロメロ状態である
    if ( pokemon.move.selected.isName( 'メロメロ' ) ) {
      if ( target.stateChange.attract.isTrue ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // やどりぎのタネ: 対象がすでにやどりぎのタネ状態である
    if ( pokemon.move.selected.isName( 'やどりぎのタネ' ) ) {
      if ( target.stateChange.leechSeed.isTrue ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // 状態異常にする変化技: 対象がすでに同じ状態異常になっている
    // 状態異常にする変化技: 対象が別の状態異常になっている
    // ランク補正に関する無効化
    // ランク補正を上げる変化技: ランクがすでに最大である
    // ランク補正を下げる変化技: ランクがすでに最低である
    // コーチング: シングルバトルである/対象となる味方がいない
    if ( pokemon.move.selected.isName( 'コーチング' ) ) {
      if ( main.field.battleStyle === 1 ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // ソウルビート/はいすいのじん: 全能力が最大まで上がっている
    if ( pokemon.move.selected.isName( 'ソウルビート' ) || pokemon.move.selected.isName( 'はいすいのじん' ) ) {
      if ( pokemon.status.atk.rank.isMax() &&
        pokemon.status.def.rank.isMax() &&
        pokemon.status.spA.rank.isMax() &&
        pokemon.status.spD.rank.isMax() &&
        pokemon.status.spe.rank.isMax() ) {
          attack.success = false;
          target.msgInvalid();
          continue;
      }
    }
    // ほおばる: ぼうぎょランクがすでに最大である
    if ( pokemon.move.selected.isName( 'ほおばる' ) ) {
      if ( pokemon.status.def.rank.isMax() ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // その他
    // がむしゃら: 対象のHPが使用者以下
    if ( pokemon.move.selected.isName( 'がむしゃら' ) ) {
      if ( pokemon.status.hp.value.value >= target.status.hp.value.value ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // シンクロノイズ: タイプが合致していない
    if ( pokemon.move.selected.isName( 'シンクロノイズ' ) ) {
      const atkType: PokemonType[] = pokemon.type.get();
      const defType: PokemonType[] = target.type.get();
      const compare: PokemonType[] = atkType.concat( defType );
      const set = new Set( compare );
      if ( atkType.length === 1 && atkType[0] === null ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
      if ( set.size === compare.length ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // ゆめくい/あくむ: 対象がねむり状態でない
    if ( pokemon.move.selected.isName( 'ゆめくい' ) || pokemon.move.selected.isName( 'あくむ' ) ) {
      if ( !target.statusAilment.isAsleep() ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // 一撃必殺技: 対象が使用者よりレベルが高い/対象がダイマックスしている
    if ( oneShotMoveList.includes( pokemon.move.selected.name ) ) {
      if ( pokemon.level < target.level ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
  }

  return pokemon.attack.isFailure();
}

// みがわり状態によるランク補正を下げる技/デコレーションの無効化
function disableBySubstitute( pokemon: Pokemon ): boolean {

  const isSubstitute = ( pokemon: Pokemon, target: Pokemon ): boolean => {

    if ( !target.stateChange.substitute.isTrue ) return false;
    if ( pokemon.move.selected.name === 'いじげんホール' ) return false;
    if ( pokemon.move.selected.name === 'いじげんラッシュ' ) return false;
    if ( pokemon.move.selected.name === 'シャドースチール' ) return false;
    if ( pokemon.move.selected.isStatus() ) {
      if ( pokemon.move.selected.target === 'users-field' ) return false;
      if ( pokemon.move.selected.target === 'opponents-field' ) return false;
      if ( pokemon.move.selected.target === 'entire-field' ) return false;
    }
    if ( isSame( pokemon, target ) ) return false;
    if ( pokemon.ability.isName( 'すりぬけ' ) ) {
      if ( pokemon.move.selected.name === 'へんしん' || pokemon.move.selected.name === 'フリーフォール' ) {
        ;
      } else {
        return false;
      }
    }
    if ( soundMoveList.includes( pokemon.move.selected.name ) === true ) {
      if ( pokemon.move.selected.name === 'とおぼえ' && isFriend( pokemon, target ) ) {
        ;
      } else {
        return false;
      }
    }

    return true;
  }

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    attack.substitute = isSubstitute( pokemon, target );
    if ( !attack.substitute ) continue;

  }

  return pokemon.attack.isFailure();
}

// 命中判定による技の無効化
function disableByHitJudgment( pokemon: Pokemon ): boolean {

  // 必中技は命中判定を行わない
  const isHit = ( pokemon: Pokemon, target: Pokemon ): boolean => {

    if ( pokemon.move.selected.accuracy === null ) return true;
    if ( main.field.weather.isRainy( target ) ) {
      if ( pokemon.move.selected.isName( 'かみなり' ) ) return true;
      if ( pokemon.move.selected.isName( 'ぼうふう' ) ) return true;
    }
    if ( main.field.weather.isSnowy() ) {
      if ( pokemon.move.selected.isName( 'ふぶき' ) ) return true;
    }
    if ( stompMoveList.includes( pokemon.move.selected.name ) ) {
      if ( target.stateChange.minimize.isTrue ) return true;
    }
    if ( target.stateChange.telekinesis.isTrue ) {
      if ( pokemon.move.selected.class !== 'ohko' ) return true;
    }
    if ( pokemon.stateChange.lockOn.isTrue ) return true;
    if ( pokemon.ability.isName( 'ノーガード' ) ) return true;
    if ( target.ability.isName( 'ノーガード' ) ) return true;
    if ( pokemon.move.selected.isName( 'どくどく' ) ) {
      if ( pokemon.type.has( 'Poison' ) ) return true;
    }

    return false;
  }

  // 技の命中率
  const getAccuracy = ( pokemon: Pokemon, target: Pokemon ): number => {

    if ( pokemon.move.selected.accuracy === null ) return 0;

    let accuracy: number = pokemon.move.selected.accuracy;

    if ( main.field.weather.isSunny( pokemon ) ) {
      if ( pokemon.move.selected.isName( 'かみなり' ) ) accuracy = 50;
      if ( pokemon.move.selected.isName( 'ぼうふう' ) ) accuracy = 50;
    }
    if ( target.ability.isName( 'ミラクルスキン' ) ) {
      if ( pokemon.move.selected.isStatus() ) {
        accuracy = Math.min( accuracy, 50 );
      }
    }
    if ( pokemon.move.selected.class === 'ohko' ) {
      accuracy = accuracy + pokemon.level - target.level;
    }
    if ( pokemon.move.selected.isName( 'ぜったいれいど' ) && !pokemon.type.has( 'Ice' ) ) {
      accuracy = 20 + pokemon.level - target.level;
    }

    return accuracy;
  }

  const calcOrder = (): Pokemon[] => {

    const result: Pokemon[] = main.getPokemonInBattle();

    result.sort( (a, b) => {
      // 素早さ
      if ( a.status.spe.actionOrder > b.status.spe.actionOrder ) return -1;
      if ( a.status.spe.actionOrder < b.status.spe.actionOrder ) return 1;
      // 乱数
      if ( a.status.spe.random > b.status.spe.random ) return -1;
      else return 1;
    })

    return result;
  }

  // 命中補正値M
  const getCorrM = ( pokemon: Pokemon, target: Pokemon ): number => {

    let corrM: number = 4096;

    if ( main.field.whole.gravity.isTrue ) {
      corrM = Math.round( corrM * 6840 / 4096 );
    }

    for ( const tgt of calcOrder() ) {
      if ( isSame( tgt, pokemon ) ) {
        if ( tgt.ability.isName( 'はりきり' ) && tgt.move.selected.isPhysical() ) {
          corrM = Math.round( corrM * 3277 / 4096 );
        }
        if ( tgt.ability.isName( 'ふくがん' ) ) {
          corrM = Math.round( corrM * 5325 / 4096 );
        }
      }

      if ( isSame( tgt, target ) ) {
        if ( tgt.ability.isName( 'ちどりあし' ) && tgt.stateChange.confuse.isTrue ) {
          corrM = Math.round( corrM * 2048 / 4096 );
        }
        if ( tgt.ability.isName( 'すながくれ' ) && main.field.weather.isSandy() ) {
          corrM = Math.round( corrM * 3277 / 4096 );
        }
        if ( tgt.ability.isName( 'ゆきがくれ' ) && main.field.weather.isSnowy() ) {
          corrM = Math.round( corrM * 3277 / 4096 );
        }
      }

      if ( tgt.isMine() === pokemon.isMine() ) {
        if ( tgt.ability.isName( 'しょうりのほし' ) ) {
          corrM = Math.round( corrM * 4506 / 4096 );
        }
      }
    }

    for ( const tgt of calcOrder() ) {
      if ( isSame( tgt, target ) ) {
        if ( tgt.item.isName( 'ひかりのこな' ) ) {
          corrM = Math.round( corrM * 3686 / 4096 );
        }
        if ( tgt.item.isName( 'のんきのおこう' ) ) {
          corrM = Math.round( corrM * 3686 / 4096 );
        }
      }

      if ( isSame( tgt, pokemon )) {
        if ( tgt.item.isName( 'こうかくレンズ' ) ) {
          corrM = Math.round( corrM * 4505 / 4096 );
        }
        if ( tgt.item.isName( 'フォーカスレンズ' ) ) {
          ;
        }
      }
    }

    return corrM;
  }

  // ランク補正
  const getCorrRank = ( pokemon: Pokemon, target: Pokemon ): number => {

    let diffRank: number = 0;
    let atkRank: number = pokemon.status.acc.value;
    let defRank: number = target.status.eva.value;

    if ( target.stateChange.foresight.isTrue || target.stateChange.miracleEye.isTrue ) {
      defRank = Math.max( defRank, 0 );
    }
    if ( pokemon.ability.isName( 'てんねん' ) || pokemon.ability.isName( 'するどいめ' ) ) {
      defRank = 0;
    }
    if ( target.ability.isName( 'てんねん' ) ) {
      atkRank = 0;
    }

    diffRank = atkRank - defRank;
    if ( diffRank < -6 ) diffRank = -6;
    if ( diffRank > 6  ) diffRank = 6;

    if ( diffRank < 0 ) {
      return 3 / ( 3 + Math.abs( diffRank ) );
    } else {
      return ( 3 + Math.abs( diffRank ) ) / 3;
    }
  }


  // A = 技の命中率 × 命中補正値M × ランク補正 × ミクルのみ - なかよし度効果
  // 乱数0~99がA未満なら命中
  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    // 必中技は命中判定を行わない
    if ( isHit( pokemon, target ) ) continue;

    const random: number = getRandom();
    const accVal: number = getAccuracy( pokemon, target );

    // 一撃必殺技の場合、命中判定
    if ( pokemon.move.selected.class === 'ohko' ) {
      if ( random >= accVal ) {
        attack.success = false;
        target.msgNotHit();
      }
      continue;
    }

    const corrM: number = getCorrM( pokemon, target );
    const corrRank: number = getCorrRank( pokemon, target );

    let accuracy = fiveRoundEntry( accVal * corrM / 4096 );
    accuracy = Math.floor( accuracy * corrRank );
    accuracy = Math.min( accuracy , 100 );

    // ミクルのみ
    if ( pokemon.stateChange.micleBerry.isTrue ) {
      accuracy = fiveRoundEntry( accuracy * 4915 / 4096 );
      accuracy = Math.min( accuracy , 100 );
    }

    // 命中判定
    if ( random >= accuracy ) {
      attack.success = false;
      target.msgNotHit();
    }
  }

  return pokemon.attack.isFailure();
}

// 技の仕様による無効化(その3)
function disableByMoveSpec3rd( pokemon: Pokemon ): boolean {

  const isDisableForAbility = ( pokemon: Pokemon, target: Pokemon ): boolean => {
    if ( pokemon.move.selected.isName( 'なかまづくり' ) ) {
      if ( pokemon.ability === target.ability ) return true;
      if ( pokemon.ability.changeMaster().copy === 1 ) return true;
      if ( target.ability.changeMaster().copied === 1 ) return true;
    }
    if ( pokemon.move.selected.isName( 'いえき' ) ) {
      if ( target.stateChange.noAbility.isTrue ) return true;
      if ( target.ability.changeMaster().noAbility === 1 ) return true;
    }
    if ( pokemon.move.selected.isName( 'なりきり' ) ) {
      if ( pokemon.ability === target.ability ) return true;
      if ( pokemon.ability.changeMaster().noAbility === 1 ) return true;
      if ( target.ability.changeMaster().copied === 1 ) return true;
    }
    if ( pokemon.move.selected.isName( 'シンプルビーム' ) ) {
      if ( target.ability.isName( 'たんじゅん' ) ) return true;
      if ( target.ability.changeMaster().overwrite === 1 ) return true;
    }
    if ( pokemon.move.selected.isName( 'なやみのタネ' ) ) {
      if ( target.ability.changeMaster().overwrite === 1 ) return true;
    }
    if ( pokemon.move.selected.isName( 'スキルスワップ' ) ) {
      if ( pokemon.ability.changeMaster().exchange === 1 ) return true;
      if ( target.ability.changeMaster().exchange === 1 ) return true;
    }

    return false;
  }

  const isDisableForItem = ( pokemon: Pokemon, target: Pokemon ): boolean => {
    if ( pokemon.move.selected.isName( 'トリック' ) || pokemon.move.selected.isName( 'すりかえ' ) ) {
      if ( pokemon.item === null && target.item === null ) return true;
    }
    if ( pokemon.move.selected.isName( 'ふしょくガス' ) ) {
      if ( target.isName( 'ギラティナ(オリジン)' ) && target.item.isName( 'はっきんだま' ) ) return true;
      if ( target.isName( 'ギラティナ(アナザー)' ) && target.item.isName( 'はっきんだま' ) ) return true;
      if ( target.isName( 'ゲノセクト' ) ) {
        for ( const drive of driveTable ) {
          if ( drive.name === target.item.name ) return true;
        }
      }
      if ( target.isName( 'シルヴァディ' ) ) {
        for ( const memory of memoryTable ) {
          if ( memory.name === target.item.name ) return true;
        }
      }
      if ( target.isName( 'ザシアン' ) && target.item.isName( 'くちたけん' ) ) return true;
      if ( target.isName( 'ザシアン(王)' ) && target.item.isName( 'くちたけん' ) ) return true;
      if ( target.isName( 'ザマゼンタ' ) && target.item.isName( 'くちたたて' ) ) return true;
      if ( target.isName( 'ザマゼンタ(王)' ) && target.item.isName( 'くちたたて' ) ) return true;
    }
    if ( pokemon.move.selected.isName( 'リサイクル' ) ) {
      if ( pokemon.item !== null ) return true;
    }
    if ( pokemon.move.selected.isName( 'ギフトパス' ) ) {
      if ( pokemon.item === null ) return true;
      if ( target.item !== null ) return true;
    }

    return false;
  }

  const isDisableForFullHP = ( pokemon: Pokemon, target: Pokemon ): boolean => {
    if ( pokemon.move.selected.isName( 'いやしのはどう' ) || pokemon.move.selected.isName( 'フラワーヒール' ) ) {
      if ( target.status.hp.value.isMax() ) return true;
    }
    if ( pokemon.move.selected.isName( 'いのちのしずく' ) ) {
      if ( target.status.hp.value.isMax() ) return true;
    }
    if ( pokemon.move.selected.isName( 'ジャングルヒール' ) ) {
      if ( target.status.hp.value.isMax() && target.statusAilment === null ) return true;
    }
    if ( pokemon.move.selected.isName( 'かふんだんご' ) ) {
      if ( target.status.hp.value.isMax() && pokemon.isMine() === target.isMine() ) return true;
    }
    if ( pokemon.move.selected.isName( 'あさのひざし' )
      || pokemon.move.selected.isName( 'かいふくしれい' )
      || pokemon.move.selected.isName( 'こうごうせい' )
      || pokemon.move.selected.isName( 'じこさいせい' )
      || pokemon.move.selected.isName( 'すなあつめ' )
      || pokemon.move.selected.isName( 'タマゴうみ' )
      || pokemon.move.selected.isName( 'つきのひかり' )
      || pokemon.move.selected.isName( 'なまける' )
      || pokemon.move.selected.isName( 'はねやすめ' )
      || pokemon.move.selected.isName( 'ミルクのみ' ) ) {
      if ( pokemon.status.hp.value.isMax() ) return true;
    }

    return false;
  }

  const isDisableForStatus = ( pokemon: Pokemon, target: Pokemon ): boolean => {
    if ( pokemon.move.selected.isName( 'はらだいこ' ) ) {
      if ( pokemon.status.hp.value.isLessEqual( 2 ) ) return true;
      if ( pokemon.status.atk.rank.isMax() ) return true;
    }
    if ( pokemon.move.selected.isName( 'フラワーガード' ) || pokemon.move.selected.isName( 'たがやす' ) ) {
      if ( !target.type.get().includes( 'Grass' ) ) return true;
    }
    if ( pokemon.move.selected.isName( 'じばそうさ' ) || pokemon.move.selected.isName( 'アシストギア' ) ) {
      if ( !target.ability.isName( 'プラス' ) && !target.ability.isName( 'マイナス' ) ) return true;
    }
    if ( pokemon.move.selected.isName( 'ちからをすいとる' ) ) {
      if ( target.status.atk.rank.isMin() ) return true;
    }
    if ( pokemon.move.selected.isName( 'いばる' ) ) {
      if ( target.status.atk.rank.isMax() && target.stateChange.confuse.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'おだてる' ) ) {
      if ( target.status.spA.rank.isMax() && target.stateChange.confuse.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'ひっくりかえす' ) ) {
      if ( target.status.atk.rank.isZero()
        && target.status.def.rank.isZero()
        && target.status.spA.rank.isZero()
        && target.status.spD.rank.isZero()
        && target.status.spe.rank.isZero()
        && target.status.eva.isZero()
        && target.status.acc.isZero() ) return true;
    }
    if ( pokemon.move.selected.isName( 'タールショット' ) ) {
      if ( target.status.spe.rank.isMin() && target.stateChange.tarShot.isTrue ) return true;
    }

    return false;
  }

  const isDisableForType = ( pokemon: Pokemon, target: Pokemon ): boolean => {
    if ( pokemon.move.selected.isName( 'テクスチャー' ) ) {
      if ( pokemon.type.has( pokemon.move.selected.type ) ) return true;
    }
    if ( pokemon.move.selected.isName( 'ほごしょく' ) ) {
      if ( main.field.terrain.isElectric() && pokemon.type.has( 'Electric' ) ) return true;
      if ( main.field.terrain.isGrassy() && pokemon.type.has( 'Grass' ) ) return true;
      if ( main.field.terrain.isPsychic() && pokemon.type.has( 'Psychic' ) ) return true;
      if ( main.field.terrain.isMisty() && pokemon.type.has( 'Fairy' ) ) return true;
      if ( main.field.terrain.isPlain() && pokemon.type.has( 'Normal' ) ) return true;
    }
    if ( pokemon.move.selected.isName( 'みずびたし' ) ) {
      const type = target.type.get();
      if ( type.length === 1 && type[0] === 'Water' ) return true;
      if ( target.isName( 'アルセウス' ) ) return true;
      if ( target.isName( 'シルヴァディ' ) ) return true;
    }
    if ( pokemon.move.selected.isName( 'まほうのこな' ) ) {
      const type = target.type.get();
      if ( type.length === 1 && type[0] === 'Psychic' ) return true;
      if ( target.isName( 'アルセウス' ) ) return true;
      if ( target.isName( 'シルヴァディ' ) ) return true;
    }
    if ( pokemon.move.selected.isName( 'ハロウィン' ) ) {
      if ( target.type.get().includes( 'Ghost' ) ) return true;
    }
    if ( pokemon.move.selected.isName( 'もりののろい' ) ) {
      if ( target.type.get().includes( 'Grass' ) ) return true;
    }

    return false;
  }

  const isDisableForDuplicateWholeFileld = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.isName( 'にほんばれ' ) ) {
      if ( main.field.weather.name === 'HarshSunlight' ) return true;
    }
    if ( pokemon.move.selected.isName( 'あまごい' ) ) {
      if ( main.field.weather.name === 'Rain' ) return true;
    }
    if ( pokemon.move.selected.isName( 'すなあらし' ) ) {
      if ( main.field.weather.name === 'Sandstorm' ) return true;
    }
    if ( pokemon.move.selected.isName( 'あられ' ) ) {
      if ( main.field.weather.name === 'Hail' ) return true;
    }
    if ( pokemon.move.selected.isName( 'ゆきげしき' ) ) {
      if ( main.field.weather.name === 'Hail' ) return true;
    }
    if ( pokemon.move.selected.isName( 'エレキフィールド' ) ) {
      if ( main.field.terrain.isElectric() ) return true;
    }
    if ( pokemon.move.selected.isName( 'グラスフィールド' ) ) {
      if ( main.field.terrain.isGrassy() ) return true;
    }
    if ( pokemon.move.selected.isName( 'サイコフィールド' ) ) {
      if ( main.field.terrain.isPsychic() ) return true;
    }
    if ( pokemon.move.selected.isName( 'ミストフィールド' ) ) {
      if ( main.field.terrain.isMisty() ) return true;
    }
    if ( pokemon.move.selected.isName( 'じゅうりょく' ) ) {
      if ( main.field.whole.gravity.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'どろあそび' ) ) {
      if ( main.field.whole.mudSport.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'フェアリーロック' ) ) {
      if ( main.field.whole.fairyLock.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'プラズマシャワー' ) ) {
      if ( main.field.whole.ionDeluge.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'みずあそび' ) ) {
      if ( main.field.whole.waterSport.isTrue ) return true;
    }

    return false;
  }

  const isDisableForDuplicateOneFileld = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.isName( 'オーロラベール' ) ) {
      if ( main.field.getSide( pokemon.isMine() ).auroraVeil.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'ひかりのかべ' ) ) {
      if ( main.field.getSide( pokemon.isMine() ).lightScreen.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'リフレクター' ) ) {
      if ( main.field.getSide( pokemon.isMine() ).reflect.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'たたみがえし' ) ) {
      if ( main.field.getSide( pokemon.isMine() ).matBlock.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'トリックガード' ) ) {
      if ( main.field.getSide( pokemon.isMine() ).craftyShield.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'ファストガード' ) ) {
      if ( main.field.getSide( pokemon.isMine() ).quickGuard.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'ワイドガード' ) ) {
      if ( main.field.getSide( pokemon.isMine() ).wideGuard.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'おいかぜ' ) ) {
      if ( main.field.getSide( pokemon.isMine() ).tailwind.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'おまじない' ) ) {
      if ( main.field.getSide( pokemon.isMine() ).luckyChant.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'しろいきり' ) ) {
      if ( main.field.getSide( pokemon.isMine() ).mist.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'しんぴのまもり' ) ) {
      if ( main.field.getSide( pokemon.isMine() ).safeguard.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'ステルスロック' ) ) {
      if ( main.field.getSide( getOpponentTrainer( pokemon.isMine() ) ).stealthRock.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'どくびし' ) ) {
      if ( main.field.getSide( getOpponentTrainer( pokemon.isMine() ) ).toxicSpikes.count === 2 ) return true;
    }
    if ( pokemon.move.selected.isName( 'ねばねばネット' ) ) {
      if ( main.field.getSide( getOpponentTrainer( pokemon.isMine() ) ).stickyWeb.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'まきびし' ) ) {
      if ( main.field.getSide( getOpponentTrainer( pokemon.isMine() ) ).spikes.count === 3 ) return true;
    }

    return false;
  }

  const isDisableForDuplicateMyCond = ( pokemon: Pokemon, target: Pokemon ): boolean => {
    if ( pokemon.move.selected.isName( 'アクアリング' ) ) {
      if ( pokemon.stateChange.aquaRing.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'きあいだめ' ) ) {
      if ( pokemon.stateChange.focusEnergy.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'ちょうはつ' ) ) {
      if ( target.stateChange.taunt.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'でんじふゆう' ) ) {
      if ( pokemon.stateChange.magnetRise.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'のろい' ) && pokemon.type.has( 'Ghost' ) ) {
      if ( target.stateChange.curse.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'ロックオン' ) || pokemon.move.selected.isName( 'こころのめ' ) ) {
      if ( pokemon.stateChange.lockOn.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'みがわり' ) ) {
      if ( pokemon.stateChange.substitute.isTrue ) return true;
      if ( pokemon.status.hp.value.isLessEqual( 4 ) ) return true;
    }
    if ( pokemon.move.selected.isName( 'へんしん' ) ) {
      if ( pokemon.stateChange.transform.isTrue ) return true;
      if ( target.stateChange.transform.isTrue ) return true;
    }

    return false;
  }

  const isDisableForDuplicateAction = ( pokemon: Pokemon, target: Pokemon ): boolean => {
    if ( pokemon.move.selected.isName( 'アンコール' ) ) {
      if ( target.stateChange.dynamax.isTrue ) return true;
      if ( target.stateChange.encore.isTrue ) return true;
    }
    if ( pokemon.move.selected.isName( 'かなしばり' ) ) {
      if ( target.stateChange.disable.isTrue ) return true;
    }

    return false;
  }

  const isDisableForDuplicateCondition = ( pokemon: Pokemon, target: Pokemon ): boolean => {
    if ( pokemon.move.selected.isName( 'サイコシフト' ) ) {
      if ( pokemon.statusAilment.isHealth() ) return true;
      if ( target.statusAilment !== null ) return true;
    }
    if ( pokemon.move.selected.isName( 'じょうか' ) ) {
      if ( target.statusAilment === null ) return true;
    }
    if ( pokemon.move.selected.isName( 'リフレッシュ' ) ) {
      if ( pokemon.statusAilment.isHealth() ) return true;
    }

    return false;
  }

  const isDisableForDuplicateFileldCondition = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.isName( 'にほんばれ' )
    || pokemon.move.selected.isName( 'あまごい' )
    || pokemon.move.selected.isName( 'すなあらし' )
    || pokemon.move.selected.isName( 'あられ' )
    || pokemon.move.selected.isName( 'ゆきげしき' ) ) {
      if ( main.field.weather.name === 'HarshSunlight' && main.field.weather.strong ) return true;
      if ( main.field.weather.name === 'Rain' && main.field.weather.strong ) return true;
      if ( main.field.weather.name === 'Turbulence' ) return true;
    }

    return false;
  }


  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    // 特性に関する無効化
    if ( isDisableForAbility( pokemon, target ) ) {
      attack.success = false;
      target.msgInvalid();
      continue;
    }

    // 持ち物による無効化
    if ( isDisableForItem( pokemon, target ) ) {
      attack.success = false;
      target.msgInvalid();
      continue;
    }

    // HPが満タンだったことによる無効化
    if ( isDisableForFullHP( pokemon, target ) ) {
      attack.success = false;
      target.msgInvalid();
      continue;
    }

    // ステータスに関する無効化
    if ( isDisableForStatus( pokemon, target ) ) {
      attack.success = false;
      target.msgInvalid();
      continue;
    }

    // タイプによる無効化
    if ( isDisableForType( pokemon, target ) ) {
      attack.success = false;
      target.msgInvalid();
      continue;
    }

    // 自分対象の重複に関する無効化
    if ( isDisableForDuplicateMyCond( pokemon, target ) ) {
      attack.success = false;
      target.msgInvalid();
      continue;
    }

    // 行動の重複に関する無効化
    if ( isDisableForDuplicateAction( pokemon, target ) ) {
      attack.success = false;
      target.msgInvalid();
      continue;
    }

    // 状態の重複に関する無効化
    if ( isDisableForDuplicateCondition( pokemon, target ) ) {
      attack.success = false;
      target.msgInvalid();
      continue;
    }
  }

  for ( const attack of pokemon.attack.getTargetToField() ) {
    // 全体の場
    if ( isDisableForDuplicateWholeFileld( pokemon ) ) {
      attack.success = false;
      pokemon.msgDeclareFailure();
      continue;
    }

    // 片側の場
    if ( isDisableForDuplicateOneFileld( pokemon ) ) {
      attack.success = false;
      pokemon.msgDeclareFailure();
      continue;
    }

    // 状態に関する無効化
    if ( isDisableForDuplicateFileldCondition( pokemon ) ) {
      attack.success = false;
      pokemon.msgDeclareFailure();
      continue;
    }
  }

  return pokemon.attack.isFailure();
}

