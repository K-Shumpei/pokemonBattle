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

  const cannotMove = ( pokemon: Pokemon ): boolean => {
    if ( !pokemon.stateChange.cannotMove.isTrue ) return false;

    pokemon.stateChange.cannotMove.reset();
    pokemon.msgCannotMove();

    if ( pokemon.ability.isName( 'Truant' ) ) { // 特性「なまけ」
      pokemon.stateChange.truant.count += 1;
    }

    return true;
  }

  const sleep = ( pokemon: Pokemon ): boolean => {
    if ( !pokemon.statusAilment.isAsleep() ) return false;

    const turn: number = ( pokemon.ability.isName( 'Early Bird' ) )? 2 : 1; // 特性「はやおき」
    pokemon.statusAilment.turn -= turn;

    if ( pokemon.statusAilment.turn <= 0 ) {
      pokemon.statusAilment.getHealth();
      return false;
    } else {
      //if ( sleepingMoveList.includes( pokemon.move.selected.name ) ) break sleep;
      pokemon.msgStillAsleep();
      return true;
    }
  }

  const frozen = ( pokemon: Pokemon ): boolean => {
    if ( !pokemon.statusAilment.isFrozen() ) return false;
    if ( getRandom() < 20 ) {
      pokemon.statusAilment.getHealth();
      return false;
    }
    if ( pokemon.move.selected.getMaster().defrost ) {
      if ( pokemon.move.selected.name !== 'Burn Up' ) return false; // 技「もえつきる」
      if ( pokemon.type.has( 'Fire' ) ) return false;
    }

    pokemon.msgStillFrozen();
    return true;
  }

  const remainingPP = ( pokemon: Pokemon ): boolean => {
    if ( !pokemon.move.learned[pokemon.move.selected.slot].powerPoint.isZero() ) return false;

    pokemon.msgDeclareMove();
    pokemon.msgNoPowerPoint();
    return true;
  }

  const truant = ( pokemon: Pokemon ): boolean => {
    if ( !pokemon.ability.isName( 'Truant' ) ) return false; // 特性「なまけ」
    pokemon.stateChange.truant.count += 1;
    if ( pokemon.stateChange.truant.count % 2 === 1 ) return false;

    pokemon.msgDeclareAbility();
    pokemon.msgTruant();
    return true;
  }

  const focusPunch = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Focus Punch' ) return false; // 技「きあいパンチ」
    if ( !pokemon.stateChange.focusPunch.isTrue ) return false;

    const judge = pokemon.stateChange.focusPunch.text;
    pokemon.stateChange.focusPunch.reset();
    if ( judge === '集中' ) return false;

    pokemon.msgFocusPunch();
    return true;
  }

  const flinch = ( pokemon: Pokemon ): boolean => {
    if ( !pokemon.stateChange.flinch.isTrue ) return false;

    pokemon.msgFlinch();

    if ( !pokemon.ability.isName( 'Steadfast' ) ) return true; // 特性「ふくつのこころ」
    if ( !pokemon.isChangeRank( 'spe', 1 ) ) return true;

    pokemon.msgDeclareAbility();
    pokemon.changeRank( 'spe', 1 );
    return true;
  }

  const disable = ( pokemon: Pokemon ): boolean => {
    if ( !pokemon.stateChange.disable.isTrue ) return false;
    // if ( !pokemon.move.selected.isName( pokemon.stateChange.disable.text ) ) return false;

    pokemon.msgDisable();
    return true;
  }

  const gravity = ( pokemon: Pokemon ): boolean => {
    if ( !main.field.whole.gravity.isTrue ) return false;
    if ( !pokemon.move.selected.getMaster().gravity ) return false;

    pokemon.msgGravity();
    return true;
  }

  const healBlock = ( pokemon: Pokemon ): boolean => {
    if ( !pokemon.stateChange.healBlock.isTrue ) return false;
    if ( !pokemon.move.selected.getMaster().heal ) return false;
    if ( pokemon.move.selected.name === 'Pollen Puff' // 技「かふんだんご」
      && pokemon.attack.getValidTarget()[0].isMe !== pokemon.isMine() ) {
        return false;
    }

    pokemon.msgHealBlock();
    return true;
  }

  const throatChop = ( pokemon: Pokemon ): boolean => {
    if ( !pokemon.stateChange.throatChop.isTrue ) return false;
    if ( !pokemon.move.selected.getMaster().sound ) return false;

    pokemon.msgThroatChop();
    return true;
  }

  const taunt = ( pokemon: Pokemon ): boolean => {
    if ( !pokemon.stateChange.taunt.isTrue ) return false;
    if ( pokemon.move.selected.name === 'Me First' ) return false; // 技「さきどり」
    if ( !pokemon.move.selected.isStatus() ) return false;

    pokemon.msgTaunt();
    return true;
  }

  const imprison = ( pokemon: Pokemon ): boolean => {

    return false;

    for ( const target of main.getPokemonInSide( !pokemon.isMine() ) ) {
      if ( !target.stateChange.imprison.isTrue ) continue;
      for ( const move of target.move.learned ) {
        if ( !move.name ) continue;
        if ( pokemon.move.selected.name === move.name ) {
          pokemon.msgImprison();
          return true;
        }
      }
    }
  }

  const confuse = ( pokemon: Pokemon ): boolean => {
    if ( !pokemon.stateChange.confuse.isTrue ) return false;

    pokemon.stateChange.confuse.count -= 1;

    if ( pokemon.stateChange.confuse.count === 0 ) {
      pokemon.msgCureConfuse();
      pokemon.stateChange.confuse.reset()
      return false;
    }

    pokemon.msgStillConfuse();
    if ( getRandom() < 2/3 * 100 ) return false;

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

  const paralusis = ( pokemon: Pokemon ): boolean => {
    if ( !pokemon.statusAilment.isParalysis() ) return false;
    if ( getRandom() < 3/4 * 100 ) return false;

    pokemon.msgParalysis();
    return true;
  }

  const attract = ( pokemon: Pokemon ): boolean => {

    return false;

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
  }


  if ( cannotMove( pokemon ) ) return true; // 反動で動けない
  if ( sleep( pokemon ) ) return true; // ねむり状態
  if ( frozen( pokemon ) ) return true; // こおり状態
  if ( remainingPP( pokemon ) ) return true; // 残りPP
  if ( truant( pokemon ) ) return true; // 特性「なまけ」
  if ( focusPunch( pokemon ) ) return true; // 技「きあいパンチ」
  if ( flinch( pokemon ) ) return true; // ひるみ状態
  if ( disable( pokemon ) ) return true; // かなしばり状態
  if ( gravity( pokemon ) ) return true; // じゅうりょく状態
  if ( healBlock( pokemon ) ) return true; // かいふくふうじ状態
  if ( throatChop( pokemon ) ) return true; // じごくづき状態
  if ( taunt( pokemon ) ) return true; // ちょうはつ状態
  if ( imprison( pokemon ) ) return true; // ふういん状態
  if ( confuse( pokemon ) ) return true; // こんらん状態
  if ( paralusis( pokemon ) ) return true; // まひ状態
  if ( attract( pokemon ) ) return true; // メロメロ状態

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

  if ( pokemon.name === 'Aegislash Shield' // ギルガルド(盾)
    && !pokemon.move.selected.isStatus() ) {
      pokemon.msgDeclareAbility();
      pokemon.formChange();
      pokemon.msgAegislashSchild();
      return;
  }

  if ( pokemon.name === 'Aegislash Blade' // ギルガルド(剣)
    && pokemon.move.selected.name === 'King’s Shield' ) { // 技「キングシールド」
      pokemon.msgDeclareAbility();
      pokemon.formChange();
      pokemon.msgAegislashBlade();
      return;
  }
}

// 「<ポケモン>の <技>!」のメッセージ。PPが減少することが確約される
function moveDeclareMessage( pokemon: Pokemon ): void {
  pokemon.msgDeclareMove();
}

// 技のタイプが変わる。
function changeMoveType( pokemon: Pokemon ): void {

  if ( pokemon.ability.isName( 'Liquid Voice' ) ) { // 特性「うるおいボイス」
    if ( pokemon.move.selected.getMaster().sound ) {
      pokemon.move.selected.type = 'Water';
    }
  }

  galvanize:
  if ( pokemon.ability.isName( 'Galvanize' ) ) { // 特性「エレキスキン」
    pokemon.move.selected.activateSkin( 'Electric' );
  }

  aerilate:
  if ( pokemon.ability.isName( 'Aerilate' ) ) { // 特性「スカイスキン」
    pokemon.move.selected.activateSkin( 'Flying' );
  }

  normalize:
  if ( pokemon.ability.isName( 'Normalize' ) ) { // 特性「ノーマルスキン」
    pokemon.move.selected.activateSkin( 'Normal' );
  }

  pixilate:
  if ( pokemon.ability.isName( 'Pixilate' ) ) { // 特性「フェアリースキン」
    pokemon.move.selected.activateSkin( 'Fairy' );
  }

  refrigerate:
  if ( pokemon.ability.isName( 'Refrigerate' ) ) { // 特性「フリーズスキン」
    pokemon.move.selected.activateSkin( 'Ice' );
  }

  if ( pokemon.move.selected.name === 'Weather Ball' ) { // 技「ウェザーボール」
    if ( main.field.weather.isSunny( pokemon ) ) pokemon.move.selected.type = 'Fire';
    if ( main.field.weather.isRainy( pokemon ) ) pokemon.move.selected.type = 'Water';
    if ( main.field.weather.isSandy() ) pokemon.move.selected.type = 'Rock';
    if ( main.field.weather.isSnowy() ) pokemon.move.selected.type = 'Ice';
  }

  if ( pokemon.move.selected.name === 'Aura Wheel' // 技「オーラぐるま」
    && pokemon.name === 'Morpeko Hangry' ) { // モルペコ(空腹)
      pokemon.move.selected.type = 'Dark';
  }

  if ( pokemon.move.selected.name === 'Judgment' ) { // 技「さばきのつぶて」
    for ( const plate of plateTable ) {
      if ( pokemon.item.isName( plate.name ) ) {
        pokemon.move.selected.type = plate.type;
      }
    }
  }

  if ( pokemon.move.selected.name === 'Natural Gift' ) { // 技「しぜんのめぐみ」
    for ( const berry of berryTable ) {
      if ( pokemon.item.isName( berry.name ) ) {
        pokemon.move.selected.type = berry.naturalGift.type;
      }
    }
  }

  if ( pokemon.move.selected.name === 'Terrain Pulse' ) { // 技「だいちのはどう」
    if ( pokemon.isGround() && main.field.terrain.isElectric() ) {
      pokemon.move.selected.type = 'Electric';
    }
    if ( pokemon.isGround() && main.field.terrain.isGrassy() ) {
      pokemon.move.selected.type = 'Grass';
    }
    if ( pokemon.isGround() && main.field.terrain.isPsychic() ) {
      pokemon.move.selected.type = 'Psychic';
    }
    if ( pokemon.isGround() && main.field.terrain.isMisty() ) {
      pokemon.move.selected.type = 'Fairy';
    }
  }

  if ( pokemon.move.selected.name === 'Techno Blast' ) { // 技「テクノバスター」
    for ( const drive of driveTable ) {
      if ( pokemon.item.isName( drive.name ) === true ) {
        pokemon.move.selected.type = drive.type;
      }
    }
  }

  if ( pokemon.move.selected.name === 'Multi-Attack' ) { // 技「マルチアタック」
    for ( const memory of memoryTable ) {
      if ( pokemon.item.isName( memory.name ) === true ) {
        pokemon.move.selected.type = memory.type;
      }
    }
  }

  if ( pokemon.move.selected.name === 'Revelation Dance' ) { // 技「めざめるダンス」
    pokemon.move.selected.type = pokemon.type.get()[0];
  }

  if ( pokemon.stateChange.electrify.isTrue
    && pokemon.move.selected.name !== 'Struggle' ) { // 技「わるあがき」
      pokemon.move.selected.type = 'Electric';
  }

  if ( main.field.whole.ionDeluge.isTrue
    && pokemon.move.selected.name !== 'Struggle' // 技「わるあがき」
    && pokemon.move.selected.type === 'Normal' ) {
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
  const pressureSide: number = main.getPokemonInSide( !pokemon.isMine() )?.filter( p => p.ability.isName( 'Pressure' ) ).length;
  let pressureTarget: number = 0;

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    if ( attack.isField() ) break;
    if ( attack.isMe === pokemon.isMine() ) continue;
    if ( main.getPokemonByBattle( attack ).ability.isName( 'Pressure' ) ) { // 特性「プレッシャー」
      pressureTarget += 1;
    }
  }

  switch ( pokemon.move.selected.target ) {
    case 'users-field':
      sub.value = 1;
      break;

    case 'opponents-field':
      if ( pokemon.move.selected.name === 'Sticky Web' ) sub.value = 1 // 技「ねばねばネット」
      else sub.value = pressureSide;
      break;

    case 'entire-field':
      sub.value = pressureSide;
      break;

    default:
      if ( pokemon.move.selected.name === 'Imprison' || pokemon.move.selected.name === 'Tera Blast' ) {
        sub.value = pressureSide;
      } else {
        sub.value = pressureTarget;
      }

  }

  pokemon.move.learned[sub.slot].powerPoint.sub( Math.max( 1, sub.value )  );
}

// ほのおタイプではないことによるもえつきるの失敗
function burnUpFailure( pokemon: Pokemon ): boolean {

  if ( pokemon.move.selected.name !== 'Burn Up' ) return false;
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

  if ( pokemon.ability.isName( 'Magic Guard' ) ) return true; // 特性「マジックガード」

  const damage: number = Math.floor( pokemon.getOrgHP() / 4 );
  pokemon.status.hp.value.sub( damage );

  return true;
}

// ミクルのみによる命中補正効果が消費される
function hitCorrConsumance( pokemon: Pokemon ): void {

}

// 技の仕様による失敗
function failureByMoveSpec( pokemon: Pokemon ): boolean {

  const steelRoller = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Steel Roller' ) return false;
    if ( !main.field.terrain.isPlain() ) return false;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  const hyperspaceFury = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Hyperspace Fury' ) return false;
    if ( pokemon.name === 'Hoopa Unbound' ) return false;
    if ( pokemon.stateChange.transform.isTransform( 'Hoopa Unbound' ) ) return false;

    pokemon.attack.reset();
    pokemon.msgInvalidUser();
    return true;
  }

  const darkVoid = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Dark Void' ) return false;
    if ( pokemon.name === 'Darkrai' ) return false;
    if ( pokemon.stateChange.transform.isTransform( 'Darkrai' ) ) return false;

    pokemon.attack.reset();
    pokemon.msgInvalidUser();
    return true;
  }

  const auraWheel = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Aura Wheel' ) return false;
    if ( pokemon.name === 'Morpeko Full Belly' ) return false;
    if ( pokemon.name === 'Morpeko Hangry' ) return false;
    if ( pokemon.stateChange.transform.isTransform( 'Morpeko Full Belly' ) ) return false;
    if ( pokemon.stateChange.transform.isTransform( 'Morpeko Hangry' ) ) return false;

    pokemon.attack.reset();
    pokemon.msgInvalidUser();
    return true;
  }

  const auroraVeil = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Aurora Veil' ) return false;
    if ( !main.field.weather.isSnowy() ) return false;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  const clangorousSoul = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Clangorous Soul' ) return false;
    if ( pokemon.status.hp.value.isGreaterEqual( 3 ) ) return false;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  const stockpile = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Stockpile' ) return false;
    if ( pokemon.stateChange.stockpile.count !== 3 ) return false;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  const teleport = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Teleport' ) return false;
    if ( main.getPlayer( pokemon.isMine() ).isExcangable() ) return false;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  const lastResort = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Last Resort' ) return false;
    let isFailure: boolean = false;
    // 「とっておき」を覚えていない
    //if ( pokemon.learnedMove.filter( move => move.name === 'とっておき' ).length === 0 ) isFailure = true;
    // 「とっておき以外の技」を覚えていない
    //if ( pokemon.learnedMove.filter( move => move.name !== 'とっておき' && move.name !== null ).length === 0 ) isFailure = true;
    // 使用していない「とっておき以外の技」がある
    //if ( pokemon.learnedMove.filter( move => move.name !== 'とっておき' && move.name !== null && move.isUsed === false ).length > 0 ) isFailure = true;

    if ( isFailure === false ) return false;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  const spitUp = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Spit Up'
      && pokemon.move.selected.name !== 'Swallow' ) return false;
    if ( pokemon.stateChange.stockpile.count > 0 ) return false;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  const stuffCheeks = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Stuff Cheeks' ) return false;
    if ( pokemon.item.isBerry() ) return false;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  const fling = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Fling' ) return false;
    // 条件分岐がおかしい
    // 持ち物がない
    if ( pokemon.item.isNull() ) return false;
    if ( !pokemon.item.isValid() ) return false;
    // 不適格な持ち物である
    if ( pokemon.item.isName( 'べにいろのたま' ) ) return false;
    if ( pokemon.item.isName( 'あいいろのたま' ) ) return false;
    if ( pokemon.item.isName( 'くちたけん' ) ) return false;
    if ( pokemon.item.isName( 'くちたたて' ) ) return false;
    if ( pokemon.item.isName( 'だいこんごうだま' ) ) return false;
    if ( pokemon.item.isName( 'だいしらたま' ) ) return false;
    if ( pokemon.item.isName( 'だいはっきんだま' ) ) return false;
    if ( pokemon.name === 'Giratina Altered' && pokemon.item.isName( 'はっきんだま' ) ) return false;
    if ( pokemon.name === 'Giratina Origin' && pokemon.item.isName( 'はっきんだま' ) ) return false;
    if ( pokemon.name === 'Arceus' && plateTable.filter( plate => plate.name === pokemon.name ).length === 1 ) return false;
    if ( pokemon.name === 'Genesect' && driveTable.filter( drive => drive.name === pokemon.item.name ).length === 1 ) return false;
    if ( gemTable.filter( gem => gem.name === pokemon.item.name ).length === 1 ) return false;
    if ( zCrystalTable.filter( zCrystal => zCrystal.name === pokemon.item.name ).length === 1 ) return false;
    if ( megaStoneTable.filter( mega => mega.name === pokemon.item.name && mega.name === pokemon.name ).length === 1 ) return false;
    //if ( paradoxPokemonList.includes( pokemon.name ) && pokemon.item.isName( 'ブーストエナジー' ) ) return false;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  const naturalGift = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Natural Gift' ) return false;
    if ( pokemon.item.isBerry() ) return false;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  const fakeOut = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Fake Out'
      && pokemon.move.selected.name !== 'First Impression'
      && pokemon.move.selected.name !== 'Mat Block' ) return false;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  const noRetreat = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'No Retreat' ) return false;
    if ( !pokemon.stateChange.noRetreat.isTrue ) return false;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  const suckerPunch = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Sucker Punch' ) return false;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  const poltergeist = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Poltergeist' ) return false;
    const attack: Attack[] = pokemon.attack.getValidTarget();
    if ( attack.length === 0 ) return false;

    const target: Pokemon = main.getPokemonByBattle( attack[0] );
    if ( !target.item.isNull() ) return false;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  const protect = ( pokemon: Pokemon ): boolean => {
    return false;
    //if ( protectMoveList.includes( pokemon.move.selected.name ) ) return false;
    if ( pokemon.stateChange.someProtect.isTrue === false ) return false;
    if ( getRandom() < Math.pow( 1 / 3, pokemon.stateChange.someProtect.count ) ) return false;

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  const snore = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Snore'
      && pokemon.move.selected.name !== 'Sleep Talk' ) return false;
    if ( pokemon.statusAilment.isAsleep() ) return false;
    if ( pokemon.ability.isName( 'Comatose' ) ) return false; // 特性「ぜったいねむり」

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  const rest = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Rest' ) return false;
    if ( pokemon.status.hp.value.isMax() ) return false;
    if ( pokemon.statusAilment.isAsleep() ) return false;
    if ( pokemon.ability.isName( 'Insomnia' ) ) return false; // 特性「ふみん」
    if ( pokemon.ability.isName( 'Vital Spirit' ) ) return false; // 特性「やるき」
    if ( pokemon.ability.isName( 'Comatose' ) ) return false; // 特性「ぜったいねむり」

    pokemon.attack.reset();
    pokemon.msgDeclareFailure();
    return true;
  }

  const lowKick = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Low Kick'
      && pokemon.move.selected.name !== 'Grass Knot'
      && pokemon.move.selected.name !== 'Heavy Slam'
      && pokemon.move.selected.name !== 'Heat Crash' ) return false;
    const attack: Attack[] = pokemon.attack.getValidTarget();
    if ( attack.length === 0 ) return false;

    const target: Pokemon = main.getPokemonByBattle( attack[0] );
    if ( !target.stateChange.dynamax.isTrue ) return false;

    pokemon.attack.reset();
    pokemon.msgRefWeight();
    return true;
  }

  if ( steelRoller( pokemon ) ) return true;    // アイアンローラー
  if ( hyperspaceFury( pokemon ) ) return true; // いじげんラッシュ
  if ( darkVoid( pokemon ) ) return true;       // ダークホール
  if ( auraWheel( pokemon ) ) return true;      // オーラぐるま
  if ( auroraVeil( pokemon ) ) return true;     // オーロラベール
  if ( clangorousSoul( pokemon ) ) return true; // ソウルビート
  if ( stockpile( pokemon ) ) return true;      // たくわえる
  if ( teleport( pokemon ) ) return true;       // テレポート
  if ( lastResort( pokemon ) ) return true;     // とっておき
  if ( spitUp( pokemon ) ) return true;         // はきだす、のみこむ
  if ( stuffCheeks( pokemon ) ) return true;    // ほおばる
  if ( fling( pokemon ) ) return true;          // なげつける
  if ( naturalGift( pokemon ) ) return true;    // しぜんのめぐみ
  if ( fakeOut( pokemon ) ) return true;        // ねこだまし、であいがしら、たたみがえし
  if ( noRetreat( pokemon ) ) return true;      // はいすいのじん
  if ( suckerPunch( pokemon ) ) return true;    // ふいうち
  if ( poltergeist( pokemon ) ) return true;    // ポルターガイスト
  if ( protect( pokemon ) ) return true;        // まもる
  if ( snore( pokemon ) ) return true;          // いびき、ねごと
  if ( rest( pokemon ) ) return true;           // ねむる
  if ( lowKick( pokemon ) ) return true;        // けたぐり、くさむすび、ヘビーボンバー。ヒートスタンプ

  return false;
}

// 特性による失敗
function failureByAbility( pokemon: Pokemon ): boolean {

  damp:
  if ( pokemon.move.selected.getAddOn().explosion ) {
    if ( !main.isExistAbility( 'Damp' ) ) break damp; // 特性「しめりけ」
    const poke = main.getExistAbility( 'Damp' );
    poke.msgDeclareAbility();

    pokemon.msgCannotUse();
    pokemon.attack.reset();
    return true;
  }

  queenlyMajesty:
  if ( pokemon.move.selected.priority > 0 ) {
    if ( pokemon.attack.getValidTarget().filter( p => p.isMe !== pokemon.isMine() ).length === 0 ) break queenlyMajesty;

    if ( main.isExistAbilityInSide( !pokemon.isMine(), 'Queenly Majesty' ) ) { // 特性「じょおうのいげん」
      const poke = main.getExistAbilityInSide( !pokemon.isMine(), 'Queenly Majesty' );
      poke.msgDeclareAbility();

      pokemon.msgCannotUse();
      pokemon.attack.reset();
      return true;
    }

    if ( main.isExistAbilityInSide( !pokemon.isMine(), 'Dazzling' ) ) { // 特性「ビビッドボディ」
      const poke = main.getExistAbilityInSide( !pokemon.isMine(), 'Dazzling' );
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

  const futureSight = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Future Sight'
      && pokemon.move.selected.name !== 'Doom Desire' ) return false;

    const futureSight = new StateChange();
    futureSight.isTrue = true;
    //futureSight.target.isMine() = one.target.isMe;
    //futureSight.target.battle = one.target.order.battle;
    // main.field.whole.futureSight.push( futureSight );

    if ( pokemon.move.selected.name === 'Future Sight' ) {
      pokemon.msgFutureSight();
    }
    if ( pokemon.move.selected.name === 'Doom Desire' ) {
      pokemon.msgDoomDesire();
    }

    return true;
  }

  const rage = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name !== 'Rage' ) return false;
    if ( pokemon.stateChange.rage.isTrue ) return false;

    pokemon.stateChange.rage.isTrue = true;
    return true;
  }

  if ( futureSight( pokemon ) ) return true; // みらいよち、はめつのねがい
  if ( rage( pokemon ) ) return true;        // いかり

  return false;
}

// へんげんじざい/リベロの発動
function abilityChangeType( pokemon : Pokemon ): void {

  if ( !pokemon.ability.isName( 'Protean' ) // 特性「へんげんじざい」
    && !pokemon.ability.isName( 'Libero' ) ) return; // 特性「リベロ」

  if ( pokemon.type.isOnly( pokemon.move.selected.type ) ) return;
  if ( pokemon.stateChange.protean.isTrue ) return;
  if ( pokemon.move.selected.name === 'Struggle' ) return; // 技「わるあがき」
  if ( pokemon.move.selected.name === 'Future Sight' ) return; // 技「みらいよち」
  if ( pokemon.move.selected.name === 'Doom Desire' ) return; // 技「はめつのねがい」

  pokemon.msgDeclareAbility();
  pokemon.type.toType( pokemon.move.selected.type );
  pokemon.stateChange.protean.isTrue = true;
  pokemon.msgProtean();
}

// 溜め技の溜めターンでの動作
function preliminaryAction( pokemon: Pokemon ): boolean {

  if ( !pokemon.move.selected.getMaster().charge ) return false;
  if ( pokemon.move.selected.isStore() ) return false;

  pokemon.msgPreliminary();

  if ( pokemon.move.selected.name === 'Solar Beam' // 技「ソーラービーム」
    || pokemon.move.selected.name === 'Solar Blade' ) { // 技「ソーラーブレード」
      if ( main.field.weather.isSunny( pokemon ) ) {
        moveDeclareMessage( pokemon );
        return false;
      }
  }
  if ( pokemon.move.selected.name === 'Meteor Beam' ) { // 技「メテオビーム」
    changeMyRank( pokemon, 'specialAttack', 1 );
  }
  if ( pokemon.move.selected.name === 'Skull Bash' ) { // 技「ロケットずつき」
    changeMyRank( pokemon, 'defense', 1 );
  }
  if ( pokemon.move.selected.name === 'Dig' ) { // 技「あなをほる」
    pokemon.stateChange.dig.isTrue = true;
  }
  if ( pokemon.move.selected.name === 'Fly' // 技「そらをとぶ」
    || pokemon.move.selected.name === 'Bounce' ) { // 技「とびはねる」
    pokemon.stateChange.fly.isTrue = true;
  }
  /*
  if ( pokemon.move.selected.name === 'フリーフォール) ) {
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
  if ( pokemon.move.selected.name === 'Dive' ) { // 技「ダイビング」
    pokemon.stateChange.dive.isTrue = true;

    if ( pokemon.name === 'Cramorant' ) {
      pokemon.formChange();
    }
  }
  if ( pokemon.move.selected.name === 'Phantom Force' // 技「ゴーストダイブ」
    || pokemon.move.selected.name === 'Shadow Force' ) { // 技「シャドーダイブ」
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
    if ( pokemon.ability.isName( 'No Guard' ) ) continue; // 特性「ノーガード」
    if ( target.ability.isName( 'No Guard' ) ) continue; // 特性「ノーガード」
    if ( pokemon.move.selected.name === 'Toxic' && pokemon.type.has( 'Poison' ) ) continue; // 技「どくどく」
    if ( pokemon.move.selected.name === 'Aromatherapy' ) continue; // 技「アロマセラピー」
    if ( pokemon.move.selected.name === 'Heal Bell' ) continue; // 技「いやしのすず」
    if ( pokemon.move.selected.name === 'Helping Hand' ) continue; // 技「てだすけ」


    let isValid: boolean = true;

    if ( target.stateChange.dig.isTrue ) {
      if ( pokemon.move.selected.name === 'Earthquake' ) isValid = true; // 技「じしん」
      if ( pokemon.move.selected.name === 'Magnitude' ) isValid = true; // 技「マグニチュード」
    }
    if ( target.stateChange.fly.isTrue ) {
      if ( pokemon.move.selected.name === 'Gust' ) isValid = true; // 技「かぜおこし」
      if ( pokemon.move.selected.name === 'Twister' ) isValid = true; // 技「たつまき」
      if ( pokemon.move.selected.name === 'Thunder' ) isValid = true; // 技「かみなり」
      if ( pokemon.move.selected.name === 'Sky Uppercut' ) isValid = true; // 技「スカイアッパー」
      if ( pokemon.move.selected.name === 'Smack Down' ) isValid = true; // 技「うちおとす」
      if ( pokemon.move.selected.name === 'Hurricane' ) isValid = true; // 技「ぼうふう」
      if ( pokemon.move.selected.name === 'Thousand Arrows' ) isValid = true; // 技「サウザンアロー」
    }
    if ( target.stateChange.dive.isTrue ) {
      if ( pokemon.move.selected.name === 'Surf' ) isValid = true; // 技「なみのり」
      if ( pokemon.move.selected.name === 'Whirlpool' ) isValid = true; // 技「うずしお」
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
      if ( pokemon.ability.isName( 'Unseen Fist' ) // 特性「ふかしのこぶし」
        && pokemon.move.selected.getMaster().contact ) break quickGuard;

      attack.success = false;
      target.msgQuickGuard();
      continue;
    }

    wideGuard:
    if ( main.field.getSide( target.isMine() ).wideGuard.isTrue ) {
      if ( pokemon.move.selected.target !== 'all-opponents' && pokemon.move.selected.target !== 'all-other-pokemon' ) break wideGuard;
      if ( pokemon.ability.isName( 'Unseen Fist' ) // 特性「ふかしのこぶし」
        && pokemon.move.selected.getMaster().contact ) break wideGuard;

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
      if ( pokemon.move.selected.name === 'Coaching' ) break craftyShield; // 技「コーチング」
      if ( pokemon.move.selected.name === 'Mirror Move' ) break craftyShield; // 技「オウムがえし」
      if ( pokemon.move.selected.name === 'Me First' ) break craftyShield; // 技「さきどり」

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
    if ( !pokemon.move.selected.getMaster().protect ) continue;
    if ( pokemon.ability.isName( 'Unseen Fist' ) // 特性「ふかしのこぶし」
      && pokemon.move.selected.getMaster().contact ) continue;
    if ( target.stateChange.protect.text === 'キングシールド' && pokemon.move.selected.isStatus() ) continue;
    if ( target.stateChange.protect.text === 'ブロッキング' && pokemon.move.selected.isStatus() ) continue;

    attack.success = false;
    target.msgProtect();

    spikyShield:
    if ( target.stateChange.protect.text === 'ニードルガード' ) {
      if ( !pokemon.move.selected.getMaster().contact ) break spikyShield;
      if ( pokemon.move.selected.name === 'Sky Drop' ) break spikyShield; // 技「フリーフォール」
      if ( pokemon.ability.isName( 'Magic Guard' ) ) break spikyShield; // 特性「マジックガード」
      if ( target.item.isName( 'ぼうごパット' ) ) break spikyShield;

      const damage: number = Math.max( 1, Math.floor( pokemon.getOrgHP() / 8 ) )
      pokemon.status.hp.value.sub( damage );
      pokemon.msgHurt();
    }

    banefulBunker:
    if ( target.stateChange.protect.text === 'トーチカ' ) {
      if ( !pokemon.move.selected.getMaster().contact ) break banefulBunker;
      if ( pokemon.move.selected.name === 'Sky Drop' ) break banefulBunker; // 技「フリーフォール」
      if ( !pokemon.isGetAilmentByOther( 'Poisoned', target ) ) break banefulBunker;

      pokemon.statusAilment.getPoisoned();
    }

    kingsShield:
    if ( target.stateChange.protect.text === 'キングシールド' ) {
      if ( !pokemon.move.selected.getMaster().contact ) break kingsShield;
      if ( !pokemon.isChangeRankByOther( 'atk', -1, target ) ) break kingsShield;

      pokemon.changeRankByOther( 'atk', -1, target );
    }

    obstruct:
    if ( target.stateChange.protect.text === 'ブロッキング' ) {
      if ( pokemon.move.selected.getMaster().contact === false ) break obstruct;
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
    if ( pokemon.ability.isName( 'Unseen Fist' ) // 特性「ふかしのこぶし」
      && pokemon.move.selected.getMaster().contact ) continue;

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
    //if ( notMaxGuardMoveList.includes( pokemon.move.selected.name ) === false && pokemon.move.selected.getMaster().protect === false ) continue;

    attack.success = false;
    target.msgProtect();
  }

  return pokemon.attack.isFailure();
}

// テレキネシスの、対象がディグダ/ダグトリオ/スナバァ/シロデスナ/メガゲンガー/うちおとす状態/ねをはる状態であることによる失敗
function failureByTelekinesis( pokemon: Pokemon ): boolean {

  if ( pokemon.move.selected.name !== 'Telekinesis' ) return false; // 技「テレキネシス」

  for ( const attack of pokemon.attack.getTargetToPokemon() ) {
    const target: Pokemon = main.getPokemonByBattle( attack );

    const check = ( target: Pokemon ): boolean => {
      if ( target.name === 'Diglett' ) return false; // ディグダ
      if ( target.name === 'Dugtrio' ) return false; // ダグトリオ
      if ( target.name === 'Sandygast' ) return false; // スナバァ
      if ( target.name === 'Palossand' ) return false; // シロデスナ
      if ( target.name === 'Gengar Mega' ) return false; // メガゲンガー
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
    if ( target.ability.isName( 'Sap Sipper' ) ) { // 特性「そうしょく」
      if ( pokemon.move.selected.type === 'Grass' ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    // もらいび: ほのおタイプ
    if ( target.ability.isName( 'Flash Fire' ) ) { // 特性「もらいび」
      if ( pokemon.move.selected.type === 'Fire' ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    // かんそうはだ/よびみず/ちょすい: みずタイプ
    if ( target.ability.isName( 'Dry Skin' ) ) { // 特性「かんそうはだ」
      if ( pokemon.move.selected.type === 'Water' ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    if ( target.ability.isName( 'Storm Drain' ) ) { // 特性「よびみず」
      if ( pokemon.move.selected.type === 'Water' ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    if ( target.ability.isName( 'Water Absorb' ) ) { // 特性「よびみず」
      if ( pokemon.move.selected.type === 'Water' ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    // ひらいしん/でんきエンジン/ちくでん: でんきタイプ
    if ( target.ability.isName( 'Lightning Rod' ) ) { // 特性「ひらいしん」
      if ( pokemon.move.selected.type === 'Electric' ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    if ( target.ability.isName( 'Motor Drive' ) ) { // 特性「でんきエンジン」
      if ( pokemon.move.selected.type === 'Electric' ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    if ( target.ability.isName( 'Volt Absorb' ) ) { // 特性「ちくでん」
      if ( pokemon.move.selected.type === 'Electric' ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    // ぼうおん: 音技
    if ( target.ability.isName( 'Soundproof' ) ) { // 特性「ぼうおん」
      if ( pokemon.move.selected.getMaster().sound ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    // テレパシー:　味方による攻撃技
    // ふしぎなまもり: 効果抜群でない技
    // ぼうじん: 粉技
    if ( target.ability.isName( 'Overcoat' ) ) { // 特性「ぼうじん」
      if ( pokemon.move.selected.getMaster().powder ) {
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

    if ( pokemon.move.selected.isStatus() && pokemon.move.selected.name !== 'Thunder Wave' ) continue; // 技「でんじは」

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

    if ( !target.ability.isName( 'Levitate' ) ) continue; // 特性「ふゆう」
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

    if ( !pokemon.move.selected.getMaster().powder ) continue;
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
    if ( target.ability.isName( 'Bulletproof' ) ) { // 特性「ぼうだん」
      if ( pokemon.move.selected.getMaster().ballistics ) {
        target.msgDeclareAbility();
        attack.success = false;
        target.msgInvalid();
      }
    }
    // ねんちゃく: トリック/すりかえ/ふしょくガス
    if ( target.ability.isName( 'Sticky Hold' ) ) { // 特性「ねんちゃく」
      if ( pokemon.move.selected.name === 'Trick' // 技「トリック」
        || pokemon.move.selected.name === 'Switcheroo' // 技「すりかえ」
        || pokemon.move.selected.name === 'Corrosive Gas' ) { // 技「ふしょくガス」
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
      if ( pokemon.move.selected.getMaster().powder ) {
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
      if ( pokemon.move.selected.name === 'Sheer Cold' ) { // 技「ぜったいれいど」
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // ひこうタイプ: フリーフォールの無効化
    if ( target.type.get().includes( 'Flying' ) ) {
      if ( pokemon.move.selected.name === 'Sky Drop' ) { // 技「フリーフォール」
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
    if ( pokemon.move.selected.name === 'Attract' ) { // 技「メロメロ」
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
    if ( pokemon.move.selected.name === 'Venom Drench' ) { // 技「ベノムトラップ」
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
    if ( pokemon.move.selected.name === 'Yawn' ) { // 技「あくび」
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
    if ( pokemon.move.selected.name === 'Torment' ) { // 技「いちゃもん」
      if ( target.stateChange.torment.isTrue ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // さしおさえ: 対象がすでにさしおさえ状態である
    if ( pokemon.move.selected.name === 'Embargo' ) { // 技「さしおさえ」
      if ( target.stateChange.embargo.isTrue ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // テレキネシス: 対象がすでにテレキネシス状態である
    if ( pokemon.move.selected.name === 'Telekinesis' ) { // 技「テレキネシス」
      if ( target.stateChange.telekinesis.isTrue ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // なやみのタネ: 対象の特性がふみん/なまけである
    if ( pokemon.move.selected.name === 'Worry Seed' ) { // 技「なやみのタネ」
      if ( target.ability.isName( 'Insomnia' ) ) { // 特性「ふみん」
        attack.success = false;
        target.msgInvalid();
        continue;
      }
      if ( target.ability.isName( 'Truant' ) ) { // 特性「なまけ」
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // ねをはる: 自身がすでにねをはる状態である
    if ( pokemon.move.selected.name === 'Ingrain' ) { // 技「ねをはる」
      if ( pokemon.stateChange.ingrain.isTrue ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // ほろびのうた: 対象がすでにほろびのうた状態である
    if ( pokemon.move.selected.name === 'Perish Song' ) { // 技「ほろびのうた」
      if ( target.stateChange.perishSong.isTrue ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // みやぶる/かぎわける/ミラクルアイ: 対象がすでにみやぶられている/ミラクルアイ状態である
    if ( pokemon.move.selected.name === 'Foresight' // 技「みやぶる」
      || pokemon.move.selected.name === 'Odor Sleuth' // 技「かぎわける」
      || pokemon.move.selected.name === 'Miracle Eye' ) { // 技「ミラクルアイ」
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
    if ( pokemon.move.selected.name === 'Attract' ) { // 技「メロメロ」
      if ( target.stateChange.attract.isTrue ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // やどりぎのタネ: 対象がすでにやどりぎのタネ状態である
    if ( pokemon.move.selected.name === 'Leech Seed' ) { // 技「やどりぎのタネ」
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
    if ( pokemon.move.selected.name === 'Coaching' ) { // 技「コーチング」
      if ( main.field.battleStyle === 1 ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // ソウルビート/はいすいのじん: 全能力が最大まで上がっている
    if ( pokemon.move.selected.name === 'Clangorous Soul' // 技「ソウルビート」
      || pokemon.move.selected.name === 'No Retreat' ) { // 技「はいすいのじん」
        if ( pokemon.status.atk.rank.isMax()
          && pokemon.status.def.rank.isMax()
          && pokemon.status.spA.rank.isMax()
          && pokemon.status.spD.rank.isMax()
          && pokemon.status.spe.rank.isMax() ) {
            attack.success = false;
            target.msgInvalid();
            continue;
        }
    }
    // ほおばる: ぼうぎょランクがすでに最大である
    if ( pokemon.move.selected.name === 'Stuff Cheeks' ) { // 技「ほおばる」
      if ( pokemon.status.def.rank.isMax() ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // その他
    // がむしゃら: 対象のHPが使用者以下
    if ( pokemon.move.selected.name === 'Endeavor' ) { // 技「がむしゃら」
      if ( pokemon.status.hp.value.value >= target.status.hp.value.value ) {
        attack.success = false;
        target.msgInvalid();
        continue;
      }
    }
    // シンクロノイズ: タイプが合致していない
    if ( pokemon.move.selected.name === 'Synchronoise' ) { // 技「シンクロノイズ」
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
    if ( pokemon.move.selected.name === 'Dream Eater' // 技「ゆめくい」
      || pokemon.move.selected.name === 'Nightmare' ) { // 技「あくむ」
        if ( !target.statusAilment.isAsleep() ) {
          attack.success = false;
          target.msgInvalid();
          continue;
        }
    }
    // 一撃必殺技: 対象が使用者よりレベルが高い/対象がダイマックスしている
    if ( pokemon.move.selected.getMaster().category === 'ohko' ) {
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
    if ( pokemon.move.selected.name === 'Hyperspace Hole' ) return false; // 技「いじげんホール」
    if ( pokemon.move.selected.name === 'Hyperspace Fury' ) return false; // 技「いじげんラッシュ」
    if ( pokemon.move.selected.name === 'Spectral Thief' ) return false; // 技「シャドースチール」
    if ( pokemon.move.selected.isStatus() ) {
      if ( pokemon.move.selected.target === 'users-field' ) return false;
      if ( pokemon.move.selected.target === 'opponents-field' ) return false;
      if ( pokemon.move.selected.target === 'entire-field' ) return false;
    }
    if ( isSame( pokemon, target ) ) return false;
    if ( pokemon.ability.isName( 'Infiltrator' ) ) { // 特性「すりぬけ」
      if ( pokemon.move.selected.name === 'Transform' // 技「へんしん」
        || pokemon.move.selected.name === 'Sky Drop' ) { // 技「フリーフォール」
        ;
      } else {
        return false;
      }
    }
    if ( pokemon.move.selected.getMaster().sound ) {
      if ( pokemon.move.selected.name === 'Howl' && isFriend( pokemon, target ) ) { // 技「とおぼえ」
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
      if ( pokemon.move.selected.name === 'Thunder' ) return true; // 技「かみなり」
      if ( pokemon.move.selected.name === 'Hurricane' ) return true; // 技「ぼうふう」
    }
    if ( main.field.weather.isSnowy() ) {
      if ( pokemon.move.selected.name === 'Blizzard' ) return true; // 技「ふぶき」
    }
    if ( pokemon.move.selected.getAddOn().stomp ) {
      if ( target.stateChange.minimize.isTrue ) return true;
    }
    if ( target.stateChange.telekinesis.isTrue ) {
      if ( pokemon.move.selected.class !== 'ohko' ) return true;
    }
    if ( pokemon.stateChange.lockOn.isTrue ) return true;
    if ( pokemon.ability.isName( 'No Guard' ) ) return true; // 特性「ノーガード」
    if ( target.ability.isName( 'No Guard' ) ) return true; // 特性「ノーガード」
    if ( pokemon.move.selected.name === 'Toxic' ) { // 技「どくどく」
      if ( pokemon.type.has( 'Poison' ) ) return true;
    }

    return false;
  }

  // 技の命中率
  const getAccuracy = ( pokemon: Pokemon, target: Pokemon ): number => {

    if ( pokemon.move.selected.accuracy === null ) return 0;

    let accuracy: number = pokemon.move.selected.accuracy;

    if ( main.field.weather.isSunny( pokemon ) ) {
      if ( pokemon.move.selected.name === 'Thunder' ) accuracy = 50; // 技「かみなり」
      if ( pokemon.move.selected.name === 'Hurricane' ) accuracy = 50; // 技「ぼうふう」
    }
    if ( target.ability.isName( 'Wonder Skin' ) ) { // 特性「ミラクルスキン」
      if ( pokemon.move.selected.isStatus() ) {
        accuracy = Math.min( accuracy, 50 );
      }
    }
    if ( pokemon.move.selected.class === 'ohko' ) {
      accuracy = accuracy + pokemon.level - target.level;
    }
    if ( pokemon.move.selected.name === 'Sheer Cold' && !pokemon.type.has( 'Ice' ) ) { // 技「ぜったいれいど」
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
        if ( tgt.ability.isName( 'Hustle' ) && tgt.move.selected.isPhysical() ) { // 特性「はりきり」
          corrM = Math.round( corrM * 3277 / 4096 );
        }
        if ( tgt.ability.isName( 'Compound Eyes' ) ) { // 特性「ふくがん」
          corrM = Math.round( corrM * 5325 / 4096 );
        }
      }

      if ( isSame( tgt, target ) ) {
        if ( tgt.ability.isName( 'Tangled Feet' ) && tgt.stateChange.confuse.isTrue ) { // 特性「ちどりあし」
          corrM = Math.round( corrM * 2048 / 4096 );
        }
        if ( tgt.ability.isName( 'Sand Veil' ) && main.field.weather.isSandy() ) { // 特性「すながくれ」
          corrM = Math.round( corrM * 3277 / 4096 );
        }
        if ( tgt.ability.isName( 'Snow Cloak' ) && main.field.weather.isSnowy() ) { // 特性「ゆきがくれ」
          corrM = Math.round( corrM * 3277 / 4096 );
        }
      }

      if ( tgt.isMine() === pokemon.isMine() ) {
        if ( tgt.ability.isName( 'Victory Star' ) ) { // 特性「しょうりのほし」
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
    if ( pokemon.ability.isName( 'Unaware' ) // 特性「てんねん」
      || pokemon.ability.isName( 'Keen Eye' ) ) { // 特性「するどいめ」
      defRank = 0;
    }
    if ( target.ability.isName( 'Unaware' ) ) { // 特性「てんねん」
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
    if ( pokemon.move.selected.name === 'Entrainment' ) { // 技「なかまづくり」
      if ( pokemon.ability === target.ability ) return true;
      if ( pokemon.ability.changeMaster().copy === 1 ) return true;
      if ( target.ability.changeMaster().copied === 1 ) return true;
    }
    if ( pokemon.move.selected.name === 'Gastro Acid' ) { // 技「いえき」
      if ( target.stateChange.noAbility.isTrue ) return true;
      if ( target.ability.changeMaster().noAbility === 1 ) return true;
    }
    if ( pokemon.move.selected.name === 'Role Play' ) { // 技「なりきり」
      if ( pokemon.ability === target.ability ) return true;
      if ( pokemon.ability.changeMaster().noAbility === 1 ) return true;
      if ( target.ability.changeMaster().copied === 1 ) return true;
    }
    if ( pokemon.move.selected.name === 'Simple Beam' ) { // 技「シンプルビーム」
      if ( target.ability.isName( 'Simple' ) ) return true; // 特性「たんじゅん」
      if ( target.ability.changeMaster().overwrite === 1 ) return true;
    }
    if ( pokemon.move.selected.name === 'Worry Seed' ) { // 技「なやみのタネ」
      if ( target.ability.changeMaster().overwrite === 1 ) return true;
    }
    if ( pokemon.move.selected.name === 'Skill Swap' ) { // 技「スキルスワップ」
      if ( pokemon.ability.changeMaster().exchange === 1 ) return true;
      if ( target.ability.changeMaster().exchange === 1 ) return true;
    }

    return false;
  }

  const isDisableForItem = ( pokemon: Pokemon, target: Pokemon ): boolean => {
    if ( pokemon.move.selected.name === 'Trick' // 技「トリック」
      || pokemon.move.selected.name === 'Switcheroo' ) { // 技「すりかえ」
      if ( pokemon.item === null && target.item === null ) return true;
    }
    if ( pokemon.move.selected.name === 'Corrosive Gas' ) { // 技「ふしょくガス」
      if ( target.name === 'Giratina Origin' && target.item.isName( 'はっきんだま' ) ) return true; // ギラティナ(オリジン)
      if ( target.name === 'Giratina Altered' && target.item.isName( 'はっきんだま' ) ) return true; // ギラティナ(アナザー)
      if ( target.name === 'Genesect' ) { // ゲノセクト
        for ( const drive of driveTable ) {
          if ( drive.name === target.item.name ) return true;
        }
      }
      if ( target.name === 'Silvally' ) { // シルヴァディ
        for ( const memory of memoryTable ) {
          if ( memory.name === target.item.name ) return true;
        }
      }
      if ( target.name === 'Zacian' && target.item.isName( 'くちたけん' ) ) return true; // ザシアン
      if ( target.name === 'Zacian Crowned' && target.item.isName( 'くちたけん' ) ) return true; // ザシアン(王)
      if ( target.name === 'Zamazenta' && target.item.isName( 'くちたたて' ) ) return true; // ザマゼンタ
      if ( target.name === 'Zamazenta Crowned' && target.item.isName( 'くちたたて' ) ) return true; // ザマゼンタ(王)
    }
    if ( pokemon.move.selected.name === 'Recycle' ) { // 技「リサイクル」
      if ( pokemon.item !== null ) return true;
    }
    if ( pokemon.move.selected.name === 'Bestow' ) { // 技「ギフトパス」
      if ( pokemon.item === null ) return true;
      if ( target.item !== null ) return true;
    }

    return false;
  }

  const isDisableForFullHP = ( pokemon: Pokemon, target: Pokemon ): boolean => {
    if ( pokemon.move.selected.name === 'Heal Pulse' // 技「いやしのはどう」
      || pokemon.move.selected.name === 'Floral Healing' ) { // 技「フラワーヒール」
      if ( target.status.hp.value.isMax() ) return true;
    }
    if ( pokemon.move.selected.name === 'Life Dew' ) { // 技「いのちのしずく」
      if ( target.status.hp.value.isMax() ) return true;
    }
    if ( pokemon.move.selected.name === 'Jungle Healing' ) { // 技「ジャングルヒール」
      if ( target.status.hp.value.isMax() && target.statusAilment === null ) return true;
    }
    if ( pokemon.move.selected.name === 'Pollen Puff' ) { // 技「かふんだんご」
      if ( target.status.hp.value.isMax() && pokemon.isMine() === target.isMine() ) return true;
    }
    if ( pokemon.move.selected.name === 'Morning Sun' // 技「あさのひざし」
      || pokemon.move.selected.name === 'Heal Order' // 技「かいふくしれい」
      || pokemon.move.selected.name === 'Synthesis' // 技「こうごうせい」
      || pokemon.move.selected.name === 'Recover' // 技「じこさいせい」
      || pokemon.move.selected.name === 'Shore Up' // 技「すなあつめ」
      || pokemon.move.selected.name === 'Soft-Boiled' // 技「タマゴうみ」
      || pokemon.move.selected.name === 'Moonlight' // 技「つきのひかり」
      || pokemon.move.selected.name === 'Slack Off' // 技「なまける」
      || pokemon.move.selected.name === 'Roost' // 技「はねやすめ」
      || pokemon.move.selected.name === 'Milk Drink' ) { // 技「ミルクのみ」
      if ( pokemon.status.hp.value.isMax() ) return true;
    }

    return false;
  }

  const isDisableForStatus = ( pokemon: Pokemon, target: Pokemon ): boolean => {
    if ( pokemon.move.selected.name === 'Belly Drum' ) { // 技「はらだいこ」
      if ( pokemon.status.hp.value.isLessEqual( 2 ) ) return true;
      if ( pokemon.status.atk.rank.isMax() ) return true;
    }
    if ( pokemon.move.selected.name === 'Flower Shield' // 技「フラワーガード」
      || pokemon.move.selected.name === 'Rototiller' ) { // 技「たがやす」
      if ( !target.type.get().includes( 'Grass' ) ) return true;
    }
    if ( pokemon.move.selected.name === 'Magnetic Flux' // 技「じばそうさ」
      || pokemon.move.selected.name === 'Gear Up' ) { // 技「アシストギア」
      if ( !target.ability.isName( 'Plus' ) // 特性「プラス」
        && !target.ability.isName( 'Minus' ) ) return true; // 特性「マイナス」
    }
    if ( pokemon.move.selected.name === 'Strength Sap' ) { // 技「ちからをすいとる」
      if ( target.status.atk.rank.isMin() ) return true;
    }
    if ( pokemon.move.selected.name === 'Swagger' ) { // 技「いばる」
      if ( target.status.atk.rank.isMax() && target.stateChange.confuse.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Flatter' ) { // 技「おだてる」
      if ( target.status.spA.rank.isMax() && target.stateChange.confuse.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Topsy-Turvy' ) { // 技「ひっくりかえす」
      if ( target.status.atk.rank.isZero()
        && target.status.def.rank.isZero()
        && target.status.spA.rank.isZero()
        && target.status.spD.rank.isZero()
        && target.status.spe.rank.isZero()
        && target.status.eva.isZero()
        && target.status.acc.isZero() ) return true;
    }
    if ( pokemon.move.selected.name === 'Tar Shot' ) { // 技「タールショット」
      if ( target.status.spe.rank.isMin() && target.stateChange.tarShot.isTrue ) return true;
    }

    return false;
  }

  const isDisableForType = ( pokemon: Pokemon, target: Pokemon ): boolean => {
    if ( pokemon.move.selected.name === 'Conversion' ) { // 技「テクスチャー」
      if ( pokemon.type.has( pokemon.move.selected.type ) ) return true;
    }
    if ( pokemon.move.selected.name === 'Camouflage' ) { // 技「ほごしょく」
      if ( main.field.terrain.isElectric() && pokemon.type.has( 'Electric' ) ) return true;
      if ( main.field.terrain.isGrassy() && pokemon.type.has( 'Grass' ) ) return true;
      if ( main.field.terrain.isPsychic() && pokemon.type.has( 'Psychic' ) ) return true;
      if ( main.field.terrain.isMisty() && pokemon.type.has( 'Fairy' ) ) return true;
      if ( main.field.terrain.isPlain() && pokemon.type.has( 'Normal' ) ) return true;
    }
    if ( pokemon.move.selected.name === 'Soak' ) { // 技「みずびたし」
      const type = target.type.get();
      if ( type.length === 1 && type[0] === 'Water' ) return true;
      if ( target.name === 'Arceus' ) return true; // アルセウス
      if ( target.name === 'Silvally' ) return true; // シルヴァディ
    }
    if ( pokemon.move.selected.name === 'Magic Powder' ) { // 技「まほうのこな」
      const type = target.type.get();
      if ( type.length === 1 && type[0] === 'Psychic' ) return true;
      if ( target.name === 'Arceus' ) return true; // アルセウス
      if ( target.name === 'Silvally' ) return true; // シルヴァディ
    }
    if ( pokemon.move.selected.name === 'Trick-or-Treat' ) { // 技「ハロウィン」
      if ( target.type.get().includes( 'Ghost' ) ) return true;
    }
    if ( pokemon.move.selected.name === 'Forest’s Curse' ) { // 技「もりののろい」
      if ( target.type.get().includes( 'Grass' ) ) return true;
    }

    return false;
  }

  const isDisableForDuplicateWholeFileld = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name === 'Sunny Day' ) { // 技「にほんばれ」
      if ( main.field.weather.name === 'HarshSunlight' ) return true;
    }
    if ( pokemon.move.selected.name === 'Rain Dance' ) { // 技「あまごい」
      if ( main.field.weather.name === 'Rain' ) return true;
    }
    if ( pokemon.move.selected.name === 'Sandstorm' ) { // 技「すなあらし」
      if ( main.field.weather.name === 'Sandstorm' ) return true;
    }
    if ( pokemon.move.selected.name === 'Hail' ) { // 技「あられ」
      if ( main.field.weather.name === 'Hail' ) return true;
    }
    if ( pokemon.move.selected.name === 'Snowscape' ) { // 技「ゆきげしき」
      if ( main.field.weather.name === 'Hail' ) return true;
    }
    if ( pokemon.move.selected.name === 'Electric Terrain' ) { // 技「エレキフィールド」
      if ( main.field.terrain.isElectric() ) return true;
    }
    if ( pokemon.move.selected.name === 'Grassy Terrain' ) { // 技「グラスフィールド」
      if ( main.field.terrain.isGrassy() ) return true;
    }
    if ( pokemon.move.selected.name === 'Psychic Terrain' ) { // 技「サイコフィールド」
      if ( main.field.terrain.isPsychic() ) return true;
    }
    if ( pokemon.move.selected.name === 'Misty Terrain' ) { // 技「ミストフィールド」
      if ( main.field.terrain.isMisty() ) return true;
    }
    if ( pokemon.move.selected.name === 'Gravity' ) { // 技「じゅうりょく」
      if ( main.field.whole.gravity.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Mud Sport' ) { // 技「どろあそび」
      if ( main.field.whole.mudSport.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Fairy Lock' ) { // 技「フェアリーロック」
      if ( main.field.whole.fairyLock.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Ion Deluge' ) { // 技「プラズマシャワー」
      if ( main.field.whole.ionDeluge.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Water Sport' ) { // 技「みずあそび」
      if ( main.field.whole.waterSport.isTrue ) return true;
    }

    return false;
  }

  const isDisableForDuplicateOneFileld = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name === 'Aurora Veil' ) { // 技「オーロラベール」
      if ( main.field.getSide( pokemon.isMine() ).auroraVeil.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Light Screen' ) { // 技「ひかりのかべ」
      if ( main.field.getSide( pokemon.isMine() ).lightScreen.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Reflect' ) { // 技「リフレクター」
      if ( main.field.getSide( pokemon.isMine() ).reflect.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Mat Block' ) { // 技「たたみがえし」
      if ( main.field.getSide( pokemon.isMine() ).matBlock.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Crafty Shield' ) { // 技「トリックガード」
      if ( main.field.getSide( pokemon.isMine() ).craftyShield.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Quick Guard' ) { // 技「ファストガード」
      if ( main.field.getSide( pokemon.isMine() ).quickGuard.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Wide Guard' ) { // 技「ワイドガード」
      if ( main.field.getSide( pokemon.isMine() ).wideGuard.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Tailwind' ) { // 技「おいかぜ」
      if ( main.field.getSide( pokemon.isMine() ).tailwind.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Lucky Chant' ) { // 技「おまじない」
      if ( main.field.getSide( pokemon.isMine() ).luckyChant.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Mist' ) { // 技「しろいきり」
      if ( main.field.getSide( pokemon.isMine() ).mist.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Safeguard' ) { // 技「しんぴのまもり」
      if ( main.field.getSide( pokemon.isMine() ).safeguard.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Stealth Rock' ) { // 技「ステルスロック」
      if ( main.field.getSide( getOpponentTrainer( pokemon.isMine() ) ).stealthRock.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Toxic Spikes' ) { // 技「どくびし」
      if ( main.field.getSide( getOpponentTrainer( pokemon.isMine() ) ).toxicSpikes.count === 2 ) return true;
    }
    if ( pokemon.move.selected.name === 'Sticky Web' ) { // 技「ねばねばネット」
      if ( main.field.getSide( getOpponentTrainer( pokemon.isMine() ) ).stickyWeb.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Spikes' ) { // 技「まきびし」
      if ( main.field.getSide( getOpponentTrainer( pokemon.isMine() ) ).spikes.count === 3 ) return true;
    }

    return false;
  }

  const isDisableForDuplicateMyCond = ( pokemon: Pokemon, target: Pokemon ): boolean => {
    if ( pokemon.move.selected.name === 'Aqua Ring' ) { // 技「アクアリング」
      if ( pokemon.stateChange.aquaRing.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Focus Energy' ) { // 技「きあいだめ」
      if ( pokemon.stateChange.focusEnergy.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Taunt' ) { // 技「ちょうはつ」
      if ( target.stateChange.taunt.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Magnet Rise' ) { // 技「でんじふゆう」
      if ( pokemon.stateChange.magnetRise.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Curse' && pokemon.type.has( 'Ghost' ) ) { // 技「のろい」
      if ( target.stateChange.curse.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Lock-On' // 技「ロックオン」
      || pokemon.move.selected.name === 'Mind Reader' ) { // 技「こころのめ」
      if ( pokemon.stateChange.lockOn.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Substitute' ) { // 技「みがわり」
      if ( pokemon.stateChange.substitute.isTrue ) return true;
      if ( pokemon.status.hp.value.isLessEqual( 4 ) ) return true;
    }
    if ( pokemon.move.selected.name === 'Transform' ) { // 技「へんしん」
      if ( pokemon.stateChange.transform.isTrue ) return true;
      if ( target.stateChange.transform.isTrue ) return true;
    }

    return false;
  }

  const isDisableForDuplicateAction = ( pokemon: Pokemon, target: Pokemon ): boolean => {
    if ( pokemon.move.selected.name === 'Encore' ) { // 技「アンコール」
      if ( target.stateChange.dynamax.isTrue ) return true;
      if ( target.stateChange.encore.isTrue ) return true;
    }
    if ( pokemon.move.selected.name === 'Disable' ) { // 技「かなしばり」
      if ( target.stateChange.disable.isTrue ) return true;
    }

    return false;
  }

  const isDisableForDuplicateCondition = ( pokemon: Pokemon, target: Pokemon ): boolean => {
    if ( pokemon.move.selected.name === 'Psycho Shift' ) { // 技「サイコシフト」
      if ( pokemon.statusAilment.isHealth() ) return true;
      if ( target.statusAilment !== null ) return true;
    }
    if ( pokemon.move.selected.name === 'Purify' ) { // 技「じょうか」
      if ( target.statusAilment === null ) return true;
    }
    if ( pokemon.move.selected.name === 'Refresh' ) { // 技「リフレッシュ」
      if ( pokemon.statusAilment.isHealth() ) return true;
    }

    return false;
  }

  const isDisableForDuplicateFileldCondition = ( pokemon: Pokemon ): boolean => {
    if ( pokemon.move.selected.name === 'Sunny Day' // 技「にほんばれ」
      || pokemon.move.selected.name === 'Rain Dance' // 技「あまごい」
      || pokemon.move.selected.name === 'Sandstorm' // 技「すなあらし」
      || pokemon.move.selected.name === 'Hail' // 技「あられ」
      || pokemon.move.selected.name === 'Snowscape' ) { // 技「ゆきげしき」
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

