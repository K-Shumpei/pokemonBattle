function isSuccess( pokemon: Pokemon ): boolean {

  // フリーフォールで行動順を飛ばされる
  skipBySkyDrop();
  // 自身のおんねん/いかり状態の解除
  liftingMyStatus();
  // 行動の失敗
  if ( isActionFailure( pokemon ) === true ) return false;
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
  if ( burnUpFailure( pokemon ) === true ) return false;
  // おおあめ/おおひでりによるほのお/みず技の失敗
  if ( failureByWeather( pokemon ) === true ) return false;
  // ふんじんによるほのお技の失敗とダメージ
  if ( failureByPowder( pokemon ) === true ) return false;
  // ミクルのみによる命中補正効果が消費される
  hitCorrConsumance( pokemon );
  // 技の仕様による失敗
  if ( failureByMoveSpec( pokemon ) === true ) return false;
  // マックスレイドバトルでの失敗
  // 特性による失敗
  if ( failureByAbility( pokemon ) === true ) return false;
  // 中断されても効果が発動する技
  if ( effectAlwaysActivate( pokemon ) === true ) return false;
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
  if ( disableByConcealment( pokemon ) === true ) return false;
  // サイコフィールドによる無効化
  if ( disableByPsychofield( pokemon ) === true ) return false;
  // ファストガード/ワイドガード/トリックガードによる無効化
  if ( disableByOtherProtect( pokemon ) === true ) return false;
  // まもる/キングシールド/ブロッキング/ニードルガード/トーチカによる無効化
  if ( disableByProtect( pokemon ) === true ) return false;
  // たたみがえしによる無効化
  if ( disableByMatBlock( pokemon ) === true ) return false;
  // ダイウォールによる無効化
  if ( disableByMaxGuard( pokemon ) === true ) return false;
  // テレキネシスの、対象がディグダ/ダグトリオ/スナバァ/シロデスナ/メガゲンガー/うちおとす状態/ねをはる状態であることによる失敗
  if ( failureByTelekinesis( pokemon ) === true ) return false;
  // 特性による無効化(その1)
  if ( disableByAbility1st( pokemon ) === true ) return false;



  // 相性による無効化
  for ( const damage of pokemon.damage ) {
    const target: Pokemon | false = getPokemonByBattle( damage.trainer, damage.battle );
    if ( target === false ) continue;
    if ( target.item.isName( 'ねらいのまと' ) === true ) continue;
    if ( pokemon.move.selected.isStatus() && pokemon.move.selected.name === 'でんじは' ) continue;

    damage.effective = getCompatibility( pokemon, target );
    if ( damage.effective === 0 ) {
      target.declareInvalid( damage );
    }
  }
  if ( isInvalid( pokemon.damage ) === true ) {
    return false;
  }

  // ふゆうによるじめん技の無効化
  for ( const damage of pokemon.damage ) {
    const target: Pokemon | false = getPokemonByBattle( damage.trainer, damage.battle );
    if ( target === false ) continue;
    if ( !target.ability.isName( 'ふゆう' ) ) continue;
    if ( pokemon.move.selected.type === 'GROUND' ) {
      target.declareAbility();
      target.declareInvalid( damage );
    }
  }
  if ( isInvalid( pokemon.damage ) === true ) {
    return false;
  }

  // でんじふゆう/テレキネシス/ふうせんによるじめん技の無効化
  for ( const damage of pokemon.damage ) {
    const target: Pokemon | false = getPokemonByBattle( damage.trainer, damage.battle );
    if ( target === false ) continue;
    if ( pokemon.move.selected.type !== 'GROUND' ) continue;

    if ( target.stateChange.magnetRise.isTrue === true ) {
      target.declareInvalid( damage );
      continue;
    }
    if ( target.stateChange.telekinesis.isTrue === true ) {
      target.declareInvalid( damage );
      continue;
    }
    if ( target.item.isName( 'ふうせん' ) === true ) {
      target.declareInvalid( damage );
      continue;
    }
  }
  if ( isInvalid( pokemon.damage ) === true ) {
    return false;
  }

  // ぼうじんゴーグルによる粉技の無効化
  for ( const damage of pokemon.damage ) {
    const target: Pokemon | false = getPokemonByBattle( damage.trainer, damage.battle );
    if ( target === false ) continue;
    if ( pokemon.move.selected.getFlag().powder === false ) continue;

    if ( target.item.isName( 'ぼうじんゴーグル' ) === true ) {
      target.declareInvalid( damage );
    }
  }
  if ( isInvalid( pokemon.damage ) === true ) {
    return false;
  }


  // 特性による無効化(その2)
  for ( const damage of pokemon.damage ) {
    const target: Pokemon | false = getPokemonByBattle( damage.trainer, damage.battle );
    if ( target === false ) continue;

    // ぼうだん: 弾の技
    if ( target.ability.isName( 'ぼうだん' ) ) {
      if ( pokemon.move.selected.getFlag().ballistics === true ) {
        target.declareAbility();
        target.declareInvalid( damage );
      }
    }
    // ねんちゃく: トリック/すりかえ/ふしょくガス
    if ( target.ability.isName( 'ねんちゃく' ) ) {
      if ( pokemon.move.selected.name === 'トリック' || pokemon.move.selected.name === 'すりかえ' || pokemon.move.selected.name === 'ふしょくガス' ) {
        target.declareAbility();
        target.declareInvalid( damage );
      }
    }
  }
  if ( isInvalid( pokemon.damage ) === true ) {
    return false;
  }

  // タイプによる技の無効化(その1)
  for ( const damage of pokemon.damage ) {
    const target: Pokemon | false = getPokemonByBattle( damage.trainer, damage.battle );
    if ( target === false ) continue;

    // くさタイプ: 粉技の無効化
    if ( getPokemonType( target ).includes( 'GRASS' ) ) {
      if ( pokemon.move.selected.getFlag().powder === true ) {
        target.declareInvalid( damage );
      }
    }
    // ゴーストタイプ: にげられない状態にする変化技/たこがための無効化
    // あくタイプ: いたずらごころの効果が発動した技の無効化
    // こおりタイプ: ぜったいれいどの無効化
    if ( getPokemonType( target ).includes( 'ICE' ) ) {
      if ( pokemon.move.selected.name === 'ぜったいれいど' ) {
        target.declareInvalid( damage );
      }
    }
    // ひこうタイプ: フリーフォールの無効化
    if ( getPokemonType( target ).includes( 'FLYING' ) ) {
      if ( pokemon.move.selected.name === 'フリーフォール' ) {
        target.declareInvalid( damage );
      }
    }
  }
  if ( isInvalid( pokemon.damage ) === true ) {
    return false;
  }

  // 技の仕様による無効化(その1)
  for ( const damage of pokemon.damage ) {
    const target: Pokemon | false = getPokemonByBattle( damage.trainer, damage.battle );
    if ( target === false ) continue;

    // メロメロ: 対象と性別が同じ/対象が性別不明
    if ( pokemon.move.selected.name === 'メロメロ' ) {
      if ( pokemon.gender === target.gender ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.gender === 'genderless' ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    // いちゃもん: 対象がダイマックスしている
    // ベノムトラップ: 対象がどく/もうどく状態でない
    if ( pokemon.move.selected.name === 'ベノムトラップ' ) {
      if ( !target.statusAilment.isPoisoned() ) {
        target.declareInvalid( damage );
      }
    }
  }
  if ( isInvalid( pokemon.damage ) === true ) {
    return false;
  }

  // 技の仕様による無効化(その2
  for ( const damage of pokemon.damage ) {
    const target: Pokemon | false = getPokemonByBattle( damage.trainer, damage.battle );
    if ( target === false ) continue;

    // 重複による無効化
    // あくび: 対象がすでにねむけ状態/状態異常である
    if ( pokemon.move.selected.name === 'あくび' ) {
      if ( target.stateChange.yawn.isTrue === true ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( !target.statusAilment.isHealth() ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    // いちゃもん: 対象がすでにいちゃもん状態である
    if ( pokemon.move.selected.name === 'いちゃもん' ) {
      if ( target.stateChange.torment.isTrue === true ) {
        target.declareInvalid( damage );
      }
    }
    // さしおさえ: 対象がすでにさしおさえ状態である
    if ( pokemon.move.selected.name === 'さしおさえ' ) {
      if ( target.stateChange.embargo.isTrue === true ) {
        target.declareInvalid( damage );
      }
    }
    // テレキネシス: 対象がすでにテレキネシス状態である
    if ( pokemon.move.selected.name === 'テレキネシス' ) {
      if ( target.stateChange.telekinesis.isTrue === true ) {
        target.declareInvalid( damage );
      }
    }
    // なやみのタネ: 対象の特性がふみん/なまけである
    if ( pokemon.move.selected.name === 'なやみのタネ' ) {
      if ( target.ability.isName( 'ふみん' ) ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.ability.isName( 'なまけ' ) ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    // ねをはる: 自身がすでにねをはる状態である
    if ( pokemon.move.selected.name === 'ねをはる' ) {
      if ( pokemon.stateChange.ingrain.isTrue === true ) {
        target.declareInvalid( damage );
      }
    }
    // ほろびのうた: 対象がすでにほろびのうた状態である
    if ( pokemon.move.selected.name === 'ほろびのうた' ) {
      if ( target.stateChange.perishSong.isTrue === true ) {
        target.declareInvalid( damage );
      }
    }
    // みやぶる/かぎわける/ミラクルアイ: 対象がすでにみやぶられている/ミラクルアイ状態である
    if ( pokemon.move.selected.name === 'みやぶる' || pokemon.move.selected.name === 'かぎわける' || pokemon.move.selected.name === 'ミラクルアイ' ) {
      if ( target.stateChange.foresight.isTrue === true ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.stateChange.miracleEye.isTrue === true ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    // メロメロ: 対象がすでにメロメロ状態である
    if ( pokemon.move.selected.name === 'メロメロ' ) {
      if ( target.stateChange.attract.isTrue === true ) {
        target.declareInvalid( damage );
      }
    }
    // やどりぎのタネ: 対象がすでにやどりぎのタネ状態である
    if ( pokemon.move.selected.name === 'やどりぎのタネ' ) {
      if ( target.stateChange.leechSeed.isTrue === true ) {
        target.declareInvalid( damage );
      }
    }
    // 状態異常にする変化技: 対象がすでに同じ状態異常になっている
    // 状態異常にする変化技: 対象が別の状態異常になっている
    // ランク補正に関する無効化
    // ランク補正を上げる変化技: ランクがすでに最大である
    // ランク補正を下げる変化技: ランクがすでに最低である
    // コーチング: シングルバトルである/対象となる味方がいない
    if ( pokemon.move.selected.name === 'コーチング' ) {
      if ( fieldStatus.battleStyle === 1 ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    // ソウルビート/はいすいのじん: 全能力が最大まで上がっている
    if ( pokemon.move.selected.name === 'ソウルビート' || pokemon.move.selected.name === 'はいすいのじん' ) {
      if ( pokemon.status.attack.rank.isMax() &&
        pokemon.status.defense.rank.isMax() &&
        pokemon.status.specialAttack.rank.isMax() &&
        pokemon.status.specialDefense.rank.isMax() &&
        pokemon.status.speed.rank.isMax() ) {
          target.declareInvalid( damage );
      }
    }
    // ほおばる: ぼうぎょランクがすでに最大である
    if ( pokemon.move.selected.name === 'ほおばる' ) {
      if ( pokemon.status.defense.rank.isMax() ) {
        target.declareInvalid( damage );
      }
    }
    // その他
    // がむしゃら: 対象のHPが使用者以下
    if ( pokemon.move.selected.name === 'がむしゃら' ) {
      if ( pokemon.hitPoint.value >= target.hitPoint.value ) {
        target.declareInvalid( damage );
      }
    }
    // シンクロノイズ: タイプが合致していない
    if ( pokemon.move.selected.name === 'シンクロノイズ' ) {
      const atkType: PokemonType[] = getPokemonType( pokemon );
      const defType: PokemonType[] = getPokemonType( target );
      const compare: PokemonType[] = atkType.concat( defType );
      const set = new Set( compare );
      if ( atkType.length === 1 && atkType[0] === null ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( set.size === compare.length ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    // ゆめくい/あくむ: 対象がねむり状態でない
    if ( pokemon.move.selected.name === 'ゆめくい' || pokemon.move.selected.name === 'あくむ' ) {
      if ( !target.statusAilment.isAsleep() ) {
        target.declareInvalid( damage );
      }
    }
    // 一撃必殺技: 対象が使用者よりレベルが高い/対象がダイマックスしている
    if ( oneShotMoveList.includes( pokemon.move.selected.name ) ) {
      if ( pokemon.level < target.level ) {
        target.declareInvalid( damage );
        continue;
      }
    }
  }
  if ( isInvalid( pokemon.damage ) === true ) {
    return false;
  }

  // みがわり状態によるランク補正を下げる技/デコレーションの無効化
  for ( const damage of pokemon.damage ) {
    const target: Pokemon | false = getPokemonByBattle( damage.trainer, damage.battle );
    if ( target === false ) continue;

    if ( isSubstitute( pokemon, target ) === true ) {

    }
  }

  // 命中判定による技の無効化
  for ( const damage of pokemon.damage ) {
    const target: Pokemon | false = getPokemonByBattle( damage.trainer, damage.battle );
    if ( target === false ) continue;

    // 必中技は命中判定を行わない
    if ( pokemon.move.selected.accuracy === null ) continue;
    if ( fieldStatus.weather.isRainy( target ) ) {
      if ( pokemon.move.selected.name === 'かみなり' ) continue;
      if ( pokemon.move.selected.name === 'ぼうふう' ) continue;
    }
    if ( fieldStatus.weather.isSnowy() ) {
      if ( pokemon.move.selected.name === 'ふぶき' ) continue;
    }
    if ( stompMoveList.includes( pokemon.move.selected.name ) ) {
      if ( target.stateChange.minimize.isTrue === true ) continue;
    }
    if ( target.stateChange.telekinesis.isTrue === true ) {
      //if ( pokemon.move.selected.class === 'ohko' ) continue;
    }
    if ( pokemon.stateChange.lockOn.isTrue === true ) continue;
    if ( pokemon.ability.isName( 'ノーガード' ) ) continue;
    if ( target.ability.isName( 'ノーガード' ) ) continue;
    if ( pokemon.move.selected.name === 'どくどく' ) {
      if ( getPokemonType( pokemon ).includes( 'POISON' ) ) continue;
    }

    // A = 技の命中率 × 命中補正値M × ランク補正 × ミクルのみ - なかよし度効果
    // 乱数0~99がA未満なら命中

    const random: number = getRandom();
    let accuracy: number = pokemon.move.selected.accuracy;
    let corrM: number = 4096;
    let corrRank: number = 1;
    let diffRank: number = 0;
    let atkRank: number = pokemon.status.accuracy.value;
    let defRank: number = target.status.evasion.value;

    // 技の命中率
    if ( fieldStatus.weather.isSunny( pokemon ) ) {
      if ( pokemon.move.selected.name === 'かみなり' ) accuracy = 50;
      if ( pokemon.move.selected.name === 'ぼうふう' ) accuracy = 50;
    }
    if ( target.ability.isName( 'ミラクルスキン' ) ) {
      if ( pokemon.move.selected.isStatus() ) {
        accuracy = Math.min( accuracy, 50 );
      }
    }
    /*
    if ( pokemon.move.selected.class === 'ohko' ) {
      accuracy = accuracy + pokemon.level - target.level;
    }
    if ( pokemon.move.selected.name === 'ぜったいれいど' && getPokemonType( pokemon ).includes( 'ICE' ) === false ) {
      accuracy = 20 + pokemon.level - target.level;
    }

    // 一撃必殺技の場合、命中判定
    if ( pokemon.move.selected.class === 'ohko' ) {
      if ( random >= accuracy ) {
        target.declareNotHit( damage );
        continue;
      }
    }
    */

    // 命中補正値M
    if ( fieldStatus.whole.gravity.isTrue === true ) {
      corrM = Math.round( corrM * 6840 / 4096 );
    }
    for ( const order of getSpeedOrder() ) {
      if ( order.trainer === target.trainer && order.battleNumber === target.order.battle ) {
        if ( target.ability.isName( 'ちどりあし' ) && target.stateChange.confuse.isTrue ) {
          corrM = Math.round( corrM * 2048 / 4096 );
        }
        if ( target.ability.isName( 'すながくれ' ) && fieldStatus.weather.isSandy() ) {
          corrM = Math.round( corrM * 3277 / 4096 );
        }
        if ( target.ability.isName( 'ゆきがくれ' ) && fieldStatus.weather.isSnowy() ) {
          corrM = Math.round( corrM * 3277 / 4096 );
        }
      }
      if ( order.trainer === pokemon.trainer && order.battleNumber === pokemon.order.battle ) {
        if ( pokemon.ability.isName( 'はりきり' ) && pokemon.move.selected.isPhysical() ) {
          corrM = Math.round( corrM * 3277 / 4096 );
        }
        if ( pokemon.ability.isName( 'ふくがん' ) ) {
          corrM = Math.round( corrM * 5325 / 4096 );
        }
      }
      if ( order.trainer === pokemon.trainer ) {
        const one: Pokemon | false = getPokemonByBattle( order.trainer, order.battleNumber );
        if ( one !== false && one.ability.isName( 'しょうりのほし' ) ) {
          corrM = Math.round( corrM * 4506 / 4096 );
        }
      }
    }
    for ( const order of getSpeedOrder() ) {
      if ( order.trainer === target.trainer && order.battleNumber === target.order.battle ) {
        if ( target.item.isName( 'ひかりのこな' ) ) {
          corrM = Math.round( corrM * 3686 / 4096 );
        }
        if ( target.item.isName( 'のんきのおこう' ) ) {
          corrM = Math.round( corrM * 3686 / 4096 );
        }
      }
      if ( order.trainer === pokemon.trainer && order.battleNumber === pokemon.order.battle ) {
        if ( pokemon.item.isName( 'こうかくレンズ' ) ) {
          corrM = Math.round( corrM * 4505 / 4096 );
        }
        if ( pokemon.item.isName( 'フォーカスレンズ' ) ) {
          ;
        }
      }
    }
    accuracy = fiveRoundEntry( accuracy * corrM / 4096 );

    // ランク補正
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
      corrRank = 3 / ( 3 + Math.abs( diffRank ) );
    }
    if ( diffRank > 0 ) {
      corrRank = ( 3 + Math.abs( diffRank ) ) / 3;
    }
    accuracy = Math.floor( accuracy * corrRank );
    accuracy = Math.min( accuracy , 100 );

    // ミクルのみ
    if ( pokemon.stateChange.micleBerry.isTrue === true ) {
      accuracy = fiveRoundEntry( accuracy * 4915 / 4096 );
      accuracy = Math.min( accuracy , 100 );
    }

    // 命中判定
    if ( random >= accuracy ) {
      target.declareNotHit( damage );
    }
  }
  if ( isInvalid( pokemon.damage ) === true ) {
    return false;
  }

  // 技の仕様による無効化(その3)
  for ( const damage of pokemon.damage ) {
    const target: Pokemon | false = getPokemonByBattle( damage.trainer, damage.battle );
    if ( target === false ) continue;

    // 特性に関する無効化
    if ( pokemon.move.selected.name === 'なかまづくり' ) {
      if ( pokemon.ability === target.ability ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( pokemon.abilityInfo().copy === 1 ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.abilityInfo().copied === 1 ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'いえき' ) {
      if ( target.stateChange.noAbility.isTrue === true ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.abilityInfo().noAbility === 1 ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'なりきり' ) {
      if ( pokemon.ability === target.ability ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( pokemon.abilityInfo().noAbility === 1 ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.abilityInfo().copied === 1 ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'シンプルビーム' ) {
      if ( target.ability.isName( 'たんじゅん' ) ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.abilityInfo().overwrite === 1 ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'なやみのタネ' ) {
      if ( target.abilityInfo().overwrite === 1 ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'スキルスワップ' ) {
      if ( pokemon.abilityInfo().exchange === 1 ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.abilityInfo().exchange === 1 ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    // 持ち物による無効化
    if ( pokemon.move.selected.name === 'トリック' || pokemon.move.selected.name === 'すりかえ' ) {
      if ( pokemon.item === null && target.item === null ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'ふしょくガス' ) {
      if ( target.name === 'ギラティナ(オリジン)' && target.item.name === 'はっきんだま' ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.name === 'ギラティナ(アナザー)' && target.item.name === 'はっきんだま' ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.name === 'ゲノセクト' ) {
        for ( const drive of driveTable ) {
          if ( drive.name === target.item.name ) {
            target.declareInvalid( damage );
            continue;
          }
        }
      }

      if ( target.name === 'シルヴァディ' ) {
        for ( const memory of memoryTable ) {
          if ( memory.name === target.item.name ) {
            target.declareInvalid( damage );
            continue;
          }
        }
      }

      if ( target.name === 'ザシアン' && target.item.name === 'くちたけん' ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.name === 'ザシアン(王)' && target.item.name === 'くちたけん' ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.name === 'ザマゼンタ' && target.item.name === 'くちたたて' ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.name === 'ザマゼンタ(王)' && target.item.name === 'くちたたて' ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'リサイクル' ) {
      if ( pokemon.item !== null ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'ギフトパス' ) {
      if ( pokemon.item === null ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.item !== null ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    // HPが満タンだったことによる無効化
    if ( pokemon.move.selected.name === 'いやしのはどう' || pokemon.move.selected.name === 'フラワーヒール' ) {
      if ( target.hitPoint.value.isMax() ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'いのちのしずく' ) {
      if ( target.hitPoint.value.isMax() ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'ジャングルヒール' ) {
      if ( target.hitPoint.value.isMax() && target.statusAilment === null ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'かふんだんご' ) {
      if ( target.hitPoint.value.isMax() && pokemon.trainer === target.trainer ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'あさのひざし'
      || pokemon.move.selected.name === 'かいふくしれい'
      || pokemon.move.selected.name === 'こうごうせい'
      || pokemon.move.selected.name === 'じこさいせい'
      || pokemon.move.selected.name === 'すなあつめ'
      || pokemon.move.selected.name === 'タマゴうみ'
      || pokemon.move.selected.name === 'つきのひかり'
      || pokemon.move.selected.name === 'なまける'
      || pokemon.move.selected.name === 'はねやすめ'
      || pokemon.move.selected.name === 'ミルクのみ' ) {
      if ( pokemon.hitPoint.value.isMax() ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    // ステータスに関する無効化
    if ( pokemon.move.selected.name === 'はらだいこ' ) {
      if ( pokemon.hitPoint.value.isLessEqual( 2 ) ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( pokemon.status.attack.rank.isMax() ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'フラワーガード' || pokemon.move.selected.name === 'たがやす' ) {
      if ( getPokemonType( target ).includes( 'GRASS' ) === false ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'じばそうさ' || pokemon.move.selected.name === 'アシストギア' ) {
      if ( !target.ability.isName( 'プラス' ) && !target.ability.isName( 'マイナス' ) ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'ちからをすいとる' ) {
      if ( target.status.attack.rank.isMin() ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'いばる' ) {
      if ( target.status.attack.rank.isMax() && target.stateChange.confuse.isTrue === true ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'おだてる' ) {
      if ( target.status.specialAttack.rank.isMax() && target.stateChange.confuse.isTrue === true ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'ひっくりかえす' ) {
      if ( target.status.attack.rank.isZero()
        && target.status.defense.rank.isZero()
        && target.status.specialAttack.rank.isZero()
        && target.status.specialDefense.rank.isZero()
        && target.status.speed.rank.isZero()
        && target.status.evasion.isZero()
        && target.status.accuracy.isZero() ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'タールショット' ) {
      if ( target.status.speed.rank.isMin() && target.stateChange.tarShot.isTrue === true ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    // タイプによる無効化
    if ( pokemon.move.selected.name === 'テクスチャー' ) {
      if ( getPokemonType( pokemon ).includes( pokemon.move.selected.type ) === true ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'ほごしょく' ) {
      if ( fieldStatus.terrain.isElectric() && getPokemonType( pokemon ).includes( 'ELECTRIC' ) ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( fieldStatus.terrain.isGrassy() && getPokemonType( pokemon ).includes( 'GRASS' ) ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( fieldStatus.terrain.isPsychic() && getPokemonType( pokemon ).includes( 'PSYCHIC' ) ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( fieldStatus.terrain.isMisty() && getPokemonType( pokemon ).includes( 'FAIRY' ) ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( fieldStatus.terrain.isPlain() && getPokemonType( pokemon ).includes( 'NORMAL' ) ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'みずびたし' ) {
      const type = getPokemonType( target );
      if ( type.length === 1 && type[0] === 'WATER' ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.name === 'アルセウス' ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.name === 'シルヴァディ' ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'まほうのこな' ) {
      const type = getPokemonType( target );
      if ( type.length === 1 && type[0] === 'PSYCHIC' ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.name === 'アルセウス' ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.name === 'シルヴァディ' ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'ハロウィン' ) {
      if ( getPokemonType( target ).includes( 'GHOST' ) === true ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'もりののろい' ) {
      if ( getPokemonType( target ).includes( 'GRASS' ) === true ) {
        target.declareInvalid( damage );
        continue;
      }
    }
  }
  // 重複による無効化
  // 全体の場
  if ( pokemon.move.selected.name === 'にほんばれ' ) {
    if ( fieldStatus.weather.name === 'HarshSunlight' ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'あまごい' ) {
    if ( fieldStatus.weather.name === 'Rain' ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'すなあらし' ) {
    if ( fieldStatus.weather.name === 'Sandstorm' ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'あられ' ) {
    if ( fieldStatus.weather.name === 'Hail' ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'ゆきげしき' ) {
    if ( fieldStatus.weather.name === 'Hail' ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'エレキフィールド' ) {
    if ( fieldStatus.terrain.isElectric() ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'グラスフィールド' ) {
    if ( fieldStatus.terrain.isGrassy() ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'サイコフィールド' ) {
    if ( fieldStatus.terrain.isPsychic() ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'ミストフィールド' ) {
    if ( fieldStatus.terrain.isMisty() ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'じゅうりょく' ) {
    if ( fieldStatus.whole.gravity.isTrue === true ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'どろあそび' ) {
    if ( fieldStatus.whole.mudSport.isTrue === true ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'フェアリーロック' ) {
    if ( fieldStatus.whole.fairyLock.isTrue === true ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'プラズマシャワー' ) {
    if ( fieldStatus.whole.ionDeluge.isTrue === true ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'みずあそび' ) {
    if ( fieldStatus.whole.waterSport.isTrue === true ) {
      pokemon.damage[0].failure();
    }
  }
  // 片側の場
  if ( pokemon.move.selected.name === 'オーロラベール' ) {
    if ( fieldStatus.getSide( pokemon.trainer ).auroraVeil.isTrue === true ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'ひかりのかべ' ) {
    if ( fieldStatus.getSide( pokemon.trainer ).lightScreen.isTrue === true ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'リフレクター' ) {
    if ( fieldStatus.getSide( pokemon.trainer ).reflect.isTrue === true ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'たたみがえし' ) {
    if ( fieldStatus.getSide( pokemon.trainer ).matBlock.isTrue === true ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'トリックガード' ) {
    if ( fieldStatus.getSide( pokemon.trainer ).craftyShield.isTrue === true ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'ファストガード' ) {
    if ( fieldStatus.getSide( pokemon.trainer ).quickGuard.isTrue === true ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'ワイドガード' ) {
    if ( fieldStatus.getSide( pokemon.trainer ).wideGuard.isTrue === true ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'おいかぜ' ) {
    if ( fieldStatus.getSide( pokemon.trainer ).tailwind.isTrue === true ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'おまじない' ) {
    if ( fieldStatus.getSide( pokemon.trainer ).luckyChant.isTrue === true ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'しろいきり' ) {
    if ( fieldStatus.getSide( pokemon.trainer ).mist.isTrue === true ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'しんぴのまもり' ) {
    if ( fieldStatus.getSide( pokemon.trainer ).safeguard.isTrue === true ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'ステルスロック' ) {
    if ( fieldStatus.getSide( getOpponentTrainer( pokemon.trainer ) ).stealthRock.isTrue === true ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'どくびし' ) {
    if ( fieldStatus.getSide( getOpponentTrainer( pokemon.trainer ) ).toxicSpikes.count === 2 ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'ねばねばネット' ) {
    if ( fieldStatus.getSide( getOpponentTrainer( pokemon.trainer ) ).stickyWeb.isTrue === true ) {
      pokemon.damage[0].failure();
    }
  }
  if ( pokemon.move.selected.name === 'まきびし' ) {
    if ( fieldStatus.getSide( getOpponentTrainer( pokemon.trainer ) ).spikes.count === 3 ) {
      pokemon.damage[0].failure();
    }
  }

  for ( const damage of pokemon.damage ) {
    const target: Pokemon | false = getPokemonByBattle( damage.trainer, damage.battle );
    if ( target === false ) continue;

    if ( pokemon.move.selected.name === 'アクアリング' ) {
      if ( pokemon.stateChange.aquaRing.isTrue === true ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'きあいだめ' ) {
      if ( pokemon.stateChange.focusEnergy.isTrue === true ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'ちょうはつ' ) {
      if ( target.stateChange.taunt.isTrue === true ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'でんじふゆう' ) {
      if ( pokemon.stateChange.magnetRise.isTrue === true ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'のろい' && getPokemonType( pokemon ).includes( 'GHOST' ) ) {
      if ( target.stateChange.curse.isTrue === true ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'ロックオン' || pokemon.move.selected.name === 'こころのめ' ) {
      if ( pokemon.stateChange.lockOn.isTrue === true ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'みがわり' ) {
      if ( pokemon.stateChange.substitute.isTrue === true ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( pokemon.hitPoint.value.isLessEqual( 4 ) ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'へんしん' ) {
      if ( pokemon.stateChange.transform.isTrue === true ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.stateChange.transform.isTrue === true ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    // 行動に関する無効化
    if ( pokemon.move.selected.name === 'アンコール' ) {
      if ( target.stateChange.dynamax.isTrue === true ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.stateChange.encore.isTrue === true ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'かなしばり' ) {
      if ( target.stateChange.disable.isTrue === true ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    // 状態に関する無効化
    if ( pokemon.move.selected.name === 'にほんばれ'
      || pokemon.move.selected.name === 'あまごい'
      || pokemon.move.selected.name === 'すなあらし'
      || pokemon.move.selected.name === 'あられ'
      || pokemon.move.selected.name === 'ゆきげしき' ) {
      if ( fieldStatus.weather.name === 'HarshSunlight' && fieldStatus.weather.strong === true ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( fieldStatus.weather.name === 'Rain' && fieldStatus.weather.strong === true ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( fieldStatus.weather.name === 'Turbulence' ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'サイコシフト' ) {
      if ( pokemon.statusAilment.isHealth() ) {
        target.declareInvalid( damage );
        continue;
      }
      if ( target.statusAilment !== null ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'じょうか' ) {
      if ( target.statusAilment === null ) {
        target.declareInvalid( damage );
        continue;
      }
    }
    if ( pokemon.move.selected.name === 'リフレッシュ' ) {
      if ( pokemon.statusAilment.isHealth() ) {
        target.declareInvalid( damage );
        continue;
      }
    }
  }





  return true;
}


// 技の対象が決まる。若い番号の対象が優先される。
function decideTarget( pokemon: Pokemon ): void {

  // フリーフォールによる対象

  // ちゅうもくのまと状態の敵

  // ひらいしん/よびみずのポケモン

  // カウンター/ミラーコート/メタルバーストの反射対象

  // ランダム1体が対象の技の対象
  if ( pokemon.move.selected.target === 'ランダム1体' ) {
    // シングルバトルの時
    if ( fieldStatus.battleStyle === 1 ) {
      const target = new Damage;
      target.trainer = getOpponentTrainer( pokemon.trainer );
      target.battle = 0;
      pokemon.damage.push( target );
    }
  }

  if ( pokemon.damage.length !== 0 ) return;

  // 技を選択した対象
  if ( fieldStatus.battleStyle === 1 ) {
    switch ( pokemon.move.selected.target ) {
      case '全体の場':
      case '味方の場':
      case '相手の場':
        const damage1 = new Damage;
        pokemon.damage.push( damage1 );
        break;

      case '自分':
      case '味方1体':
      case '自分か味方':
      case '味方全体':
        const damage2 = setTargetInfo( pokemon.trainer, 0 );
        pokemon.damage.push( damage2 );
        break;

      case '1体選択':
      case 'ランダム1体':
      case '相手全体':
      case '自分以外':
        const damage3 = setTargetInfo( getOpponentTrainer( pokemon.trainer ), 0 );
        pokemon.damage.push( damage3 );
        break;

      case '全体':
        const damage4 = setTargetInfo( pokemon.trainer, 0 );
        pokemon.damage.push( damage4 );
        const damage5 = setTargetInfo( getOpponentTrainer( pokemon.trainer ), 0 );
        pokemon.damage.push( damage5 );
        break;

      case '不定':
        break;

      default:
        break;
    }
  }

  if ( pokemon.damage.length >= 2 ) {
    pokemon.stateChange.rangeCorr.isTrue = true;
  }
}

function setTargetInfo( trainer: 'me' | 'opp', battle: number | null ): Damage {

  const damage = new Damage;
  damage.trainer = trainer;
  damage.battle = battle;

  const pokemon = getPokemonByBattle( trainer, battle );
  if ( pokemon !== false ) {
    damage.party = pokemon.order.party;
  }

  return damage;
}

// 相性計算
function getCompatibility( pokemon: Pokemon, target: Pokemon ): number {

  const atkType: PokemonType = pokemon.move.selected.type;
  const defType: PokemonType[] = getPokemonType( target );
  let result: number = 1.0;

  for ( const record of typeCompatibility ) {
    if ( record.attackType === atkType ) {
      for ( const type of defType ) {
        if ( type === null ) continue;

        let rate: number = record.rate[type];
        if ( rate === 0.0 && target.item.isName( 'ねらいのまと' ) === true ) {
          rate = 1.0;
        }
        if ( pokemon.move.selected.name === 'フリーズドライ' && type === 'WATER' ) {
          rate = 2.0;
        }
        result = result * rate;
      }
    }
  }

  if ( pokemon.move.selected.name === 'フライングプレス' ) {
    for ( const record of typeCompatibility ) {
      if ( record.attackType === 'FLYING' ) {
        for ( const type of defType ) {
          if ( type === null ) continue;

          let rate: number = record.rate[type];
          if ( rate === 0.0 && target.item.isName( 'ねらいのまと' ) === true ) {
            rate = 1.0;
          }

          result = result * rate;
        }
      }
    }
  }

  if ( target.stateChange.tarShot.isTrue === true && atkType === 'FIRE' ) {
   result = result * 2.0
  }

  return result;
}

// 無効化判定
function isInvalid( damage: Damage[] ): boolean {

  for ( const info of damage ) {
    if ( info.success === true ) {
      return false;
    }
  }

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
  if ( pokemon.isCannotMove() ) {
    return true;
  }

  // ねむり状態
  sleep:
  if ( pokemon.statusAilment.isAsleep() ) {
    const turn: number = ( pokemon.ability.isName( 'はやおき' ) )? 2 : 1;
    pokemon.statusAilment.countAsleep( turn );

    if ( pokemon.statusAilment.turn > 0 ) {
      writeLog( `${getArticle( pokemon )}は ぐうぐう 眠っている` );
      if ( sleepingMoveList.includes( pokemon.move.selected.name ) === true ) break sleep;
      return true;
    } else {
      cureAilment( pokemon, 'ASLEEP' );
    }
  }

  frozen:
  if ( pokemon.statusAilment.isFrozen() ) {
    if ( getRandom() < 20 ) {
      cureAilment( pokemon, 'FROZEN' );
    } else {
      if ( pokemon.move.selected.getFlag().defrost === true ) {
        if ( pokemon.move.selected.name !== 'もえつきる' ) break frozen;
        if ( getPokemonType( pokemon ).includes( 'FIRE' ) === true ) break frozen;
      }
      writeLog( `${getArticle( pokemon )}は 凍ってしまって 動けない!` );
      return true;
    }
  }

  remainingPP:
  if ( pokemon.move.learned[pokemon.move.selected.slot].powerPoint.isZero() ) {
    writeLog( `${getArticle( pokemon )}の ${pokemon.move.selected.name}!` );
    writeLog( `しかし 技の 残りポイントが なかった!` );
    return true;
  }

  truant:
  if ( pokemon.ability.isName( 'なまけ' ) ) {
    pokemon.stateChange.truant.count += 1;
    if ( pokemon.stateChange.truant.count % 2 === 1 ) break truant;

    pokemon.declareAbility();
    writeLog( `${getArticle( pokemon )}は なまけている` );
    return true;
  }

  focusPunch:
  if ( pokemon.move.selected.name === 'きあいパンチ' ) {
    if ( pokemon.stateChange.focusPunch.isTrue === false ) break focusPunch;

    const judge: boolean = ( pokemon.stateChange.focusPunch.text === '集中' )? true : false;
    pokemon.stateChange.focusPunch.reset();

    if ( judge === false ) {
      writeLog( `${getArticle( pokemon )}は 集中が 途切れて 技が 出せない!` );
      return true;
    }
  }

  flinch:
  if ( pokemon.stateChange.flinch.isTrue === true ) {
    writeLog( `${getArticle( pokemon )}は ひるんで 技が 出せない!` );

    steadfast:
    if ( pokemon.ability.isName( 'ふくつのこころ' ) ) {
      if ( getRankVariation( pokemon, 'speed', 1 ) === 0 ) break steadfast;

      pokemon.declareAbility();
      changeMyRank( pokemon, 'speed', 1 );
    }

    return true;
  }

  disable:
  if ( pokemon.stateChange.disable.isTrue === true ) {
    if ( pokemon.stateChange.disable.text !== pokemon.move.selected.name ) break disable;

    writeLog( `${getArticle( pokemon )}は かなしばりで 技が 出せない!` );
    return true;
  }

  gravity:
  if ( fieldStatus.whole.gravity.isTrue === true ) {
    if ( pokemon.move.selected.getFlag().gravity === false ) break gravity;

    writeLog( `${getArticle( pokemon )}は じゅうりょくが 強くて ${pokemon.move.selected.name}が 出せない!` );
    return true;
  }

  healBlock:
  if ( pokemon.stateChange.healBlock.isTrue === true ) {
    if ( pokemon.move.selected.getFlag().heal === false ) break healBlock;
    if ( pokemon.move.selected.name === 'かふんだんご' && pokemon.damage[0].trainer !== pokemon.trainer ) break healBlock;

    writeLog( `${getArticle( pokemon )}は かいふくふうじで 技が 出せない!` );
    return true;
  }

  throatChop:
  if ( pokemon.stateChange.throatChop.isTrue === true ) {
    if ( pokemon.move.selected.getFlag().sound === false ) break throatChop;

    writeLog( `${getArticle( pokemon )}は じごくづきの効果で 技が 出せない!` );
    return true;
  }

  taunt:
  if ( pokemon.stateChange.taunt.isTrue === true ) {
    if ( pokemon.move.selected.name === 'さきどり' ) break taunt;
    if ( !pokemon.move.selected.isStatus() ) break taunt;

    writeLog( `${getArticle( pokemon )}は ちょうはつされて 技が 出せない!` );
    return true;
  }

  imprison:
  for ( const target of allPokemonInSide( getOpponentTrainer( pokemon.trainer ) ) ) {
    if ( target.stateChange.imprison.isTrue === false ) continue;
    for ( const move of target.move.learned ) {
      if ( move.name === pokemon.move.selected.name ) {
        writeLog( `${getArticle( pokemon )}は ふういんで 技が 出せない!` );
        return true;
      }
    }
  }

  confuse:
  if ( pokemon.stateChange.confuse.isTrue === true ) {
    pokemon.stateChange.confuse.count -= 1;

    if ( pokemon.stateChange.confuse.count === 0 ) {
      writeLog( `${getArticle( pokemon )}の 混乱が 解けた!` );
      pokemon.stateChange.confuse.reset()
      break confuse;
    }

    writeLog( `${getArticle( pokemon )}は 混乱している!` );
    if ( getRandom() < 1/3 * 100 ) {
      writeLog( `わけも わからず 自分を 攻撃した!` );

      const power: number = 40;
      const attack: number = getValueWithRankCorrection( pokemon.status.attack.actual, pokemon.status.attack.rank.value, false );
      const defense: number = getValueWithRankCorrection( pokemon.status.defense.actual, pokemon.status.defense.rank.value, false );

      // 最終ダメージ
      const damage = Math.floor( Math.floor( Math.floor( pokemon.level * 2 / 5 + 2 ) * power * attack / defense ) / 50 + 2 );
      // 乱数補正
      const randomCorrection = Math.floor( getRandom() * 16 ) + 8500;
      const finalDamage: number = Math.floor( damage * randomCorrection / 10000 );

      // 本体にダメージを与える
      const damageType = new Damage;
      damageType.damage = processAfterCalculation( pokemon, pokemon, finalDamage, damageType );
      damageToBody( pokemon, damageType );
      // ダメージをHP1で耐える効果のメッセージなど
      enduringEffectsMessage( pokemon );

      return true;
    }
  }

  paralusis:
  if ( pokemon.statusAilment.isParalysis() ) {
    if ( getRandom() < 1/4 * 100 ) {
      writeLog( `${getArticle( pokemon )}は 体がしびれて 動かない!` );
      return true;
    }
  }

  attract:
  if ( pokemon.stateChange.attract.isTrue === true ) {
    const target: Target = pokemon.stateChange.attract.target;
    const attractTarget: Pokemon | false = getPokemonByBattle( target.trainer, target.battle );
    if ( attractTarget === false ) break attract

    writeLog( `${getArticle( pokemon )}は ${getArticle( attractTarget )}に メロメロだ!` );

    if ( getRandom() < 50 ) break attract;

    writeLog( `${getArticle( pokemon )}は メロメロで 技が だせなかった!` );
    return true;
  }

  return false;
}

// ねごと/いびき使用時「ぐうぐう 眠っている」メッセージ
function sleepyMessage( pokemon: Pokemon ): void {

  if ( sleepingMoveList.includes( pokemon.move.selected.name ) ) {
    writeLog( `${getArticle( pokemon )}は ぐうぐう 眠っている` );
  }
}

// 自分のこおりを回復するわざにより自身のこおり状態が治る
function meltMeByMove( pokemon: Pokemon ): void {

  if ( pokemon.statusAilment.isFrozen() ) {
    pokemon.statusAilment.getHealth();
    writeLog( `${getArticle( pokemon )}の ${pokemon.move.selected.name}で こおりがとけた!` );
  }
}

// 特性バトルスイッチによるフォルムチェンジ
function stanceChange( pokemon: Pokemon ): void {

  if ( pokemon.name === 'ギルガルド(盾)' ) {
    if ( !pokemon.move.selected.isStatus() ) {
      pokemon.declareAbility();
      formChange( pokemon );
      writeLog( `ブレードフォルム チェンジ!` );
      return;
    }
  }

  if ( pokemon.name === 'ギルガルド(剣)' ) {
    if ( pokemon.move.selected.name === 'キングシールド' ) {
      pokemon.declareAbility();
      formChange( pokemon );
      writeLog( `シールドフォルム チェンジ!` );
      return;
    }
  }
}

// 「<ポケモン>の <技>!」のメッセージ。PPが減少することが確約される
function moveDeclareMessage( pokemon: Pokemon ): void {

  writeLog( `${getArticle( pokemon )}の ${translateMove( pokemon.move.selected.name )}!` );
}

// 技のタイプが変わる。
function changeMoveType( pokemon: Pokemon ): void {

  if ( pokemon.ability.isName( 'うるおいボイス' ) ) {
    if ( pokemon.move.selected.getFlag().sound === true ) {
      pokemon.move.selected.type = 'WATER';
    }
  }

  galvanize:
  if ( pokemon.ability.isName( 'エレキスキン' ) ) {
    if ( isActivateSkinAbikity( pokemon, 'ELECTRIC' ) === false ) break galvanize;
    if ( pokemon.move.selected.type !== 'NORMAL' ) break galvanize;

    activateSkin( pokemon, 'ELECTRIC' );
  }

  aerilate:
  if ( pokemon.ability.isName( 'スカイスキン' ) ) {
    if ( isActivateSkinAbikity( pokemon, 'FLYING' ) === false ) break aerilate;
    if ( pokemon.move.selected.type !== 'NORMAL' ) break aerilate;

    activateSkin( pokemon, 'FLYING' );
  }

  normalize:
  if ( pokemon.ability.isName( 'ノーマルスキン' ) ) {
    if ( isActivateSkinAbikity( pokemon, 'NORMAL' ) === false ) break normalize;

    activateSkin( pokemon, 'NORMAL' );
  }

  pixilate:
  if ( pokemon.ability.isName( 'フェアリースキン' ) ) {
    if ( isActivateSkinAbikity( pokemon, 'FAIRY' ) === false ) break pixilate;
    if ( pokemon.move.selected.type !== 'NORMAL' ) break pixilate;

    activateSkin( pokemon, 'FAIRY' );
  }

  refrigerate:
  if ( pokemon.ability.isName( 'フリーズスキン' ) ) {
    if ( isActivateSkinAbikity( pokemon, 'ICE' ) === false ) break refrigerate;
    if ( pokemon.move.selected.type !== 'NORMAL' ) break refrigerate;

    activateSkin( pokemon, 'ICE' );
  }

  if ( pokemon.move.selected.name === 'ウェザーボール' ) {
    if ( fieldStatus.weather.isSunny( pokemon ) ) pokemon.move.selected.type = 'FIRE';
    if ( fieldStatus.weather.isRainy( pokemon ) ) pokemon.move.selected.type = 'WATER';
    if ( fieldStatus.weather.isSandy() ) pokemon.move.selected.type = 'ROCK';
    if ( fieldStatus.weather.isSnowy() ) pokemon.move.selected.type = 'ICE';
  }

  if ( pokemon.move.selected.name === 'オーラぐるま' ) {
    if ( pokemon.name === 'モルペコ(空腹)' ) {
      pokemon.move.selected.type = 'DARK';
    }
  }

  if ( pokemon.move.selected.name === 'さばきのつぶて' ) {
    for ( const plate of plateTable ) {
      if ( pokemon.item.isName( plate.name ) === true ) {
        //pokemon.move.selected.type = plate.type;
      }
    }
  }

  if ( pokemon.move.selected.name === 'しぜんのめぐみ' ) {
    for ( const berry of berryTable ) {
      if ( pokemon.item.isName( berry.name ) === true ) {
        //pokemon.move.selected.type = berry.naturalGift.type;
      }
    }
  }

  if ( pokemon.move.selected.name === 'だいちのはどう' ) {
    if ( isGrounded( pokemon ) === true && fieldStatus.terrain.isElectric() ) pokemon.move.selected.type = 'ELECTRIC';
    if ( isGrounded( pokemon ) === true && fieldStatus.terrain.isGrassy() ) pokemon.move.selected.type = 'GRASS';
    if ( isGrounded( pokemon ) === true && fieldStatus.terrain.isPsychic() ) pokemon.move.selected.type = 'PSYCHIC';
    if ( isGrounded( pokemon ) === true && fieldStatus.terrain.isMisty() ) pokemon.move.selected.type = 'FAIRY';
  }

  if ( pokemon.move.selected.name === 'テクノバスター' ) {
    for ( const drive of driveTable ) {
      if ( pokemon.item.isName( drive.name ) === true ) {
        //pokemon.move.selected.type = drive.type;
      }
    }
  }

  if ( pokemon.move.selected.name === 'マルチアタック' ) {
    for ( const memory of memoryTable ) {
      if ( pokemon.item.isName( memory.name ) === true ) {
        //pokemon.move.selected.type = memory.type;
      }
    }
  }

  if ( pokemon.move.selected.name === 'めざめるダンス' ) {
    pokemon.move.selected.type = getPokemonType( pokemon )[0];
  }

  electrify:
  if ( pokemon.stateChange.electrify.isTrue === true ) {
    if ( pokemon.move.selected.name === 'わるあがき' ) break electrify;

    pokemon.move.selected.type = 'ELECTRIC';
  }

  ionDeluge:
  if ( fieldStatus.whole.ionDeluge.isTrue === true ) {
    if ( pokemon.move.selected.name === 'わるあがき' ) break ionDeluge;
    if ( pokemon.move.selected.type !== 'NORMAL' ) break ionDeluge;

    pokemon.move.selected.type = 'ELECTRIC';
  }
}

// PPが適切な量引かれる
function deductPowerPoint( pokemon: Pokemon ): void {

  let value: number = 1;

  if ( pokemon.move.selected.name === 'テラバースト' || pokemon.move.selected.name === 'ふういん' ) {
    for ( const target of allPokemonInSide( getOpponentTrainer( pokemon.trainer ) ) ) {
      if ( target.ability.isName( 'プレッシャー' ) ) {
        value += 1;
      }
    }
  } else {
    for ( const data of pokemon.damage ) {
      const target: Pokemon | false = getPokemonByBattle( data.trainer, data.battle );
      if ( target === false ) continue;
      if ( target.trainer === pokemon.trainer ) continue;
      if ( target.ability.isName( 'プレッシャー' ) ) {
        value += 1;
      }
    }
  }

  pokemon.move.learned[pokemon.move.selected.slot].powerPoint.sub( value );
}

// ほのおタイプではないことによるもえつきるの失敗
function burnUpFailure( pokemon: Pokemon ): boolean {

  if ( pokemon.move.selected.name !== 'もえつきる' ) return false;
  if ( getPokemonType( pokemon ).includes( 'FIRE' ) === true ) return false;

  pokemon.damage = [];
  pokemon.declareFailure();

  return true;
}

// おおあめ/おおひでりによるほのお/みず技の失敗
function failureByWeather( pokemon: Pokemon ): boolean {

  if ( pokemon.move.selected.isStatus() ) return false;

  if ( fieldStatus.weather.isBadRainy( pokemon ) ) {
    if ( pokemon.move.selected.type === 'FIRE' ) {
      pokemon.damage = [];
      writeLog( `強い雨の 影響で ほのおタイプの 攻撃が 消失した!` );
      return true;
    }
  }

  if ( fieldStatus.weather.isBadSunny( pokemon ) ) {
    if ( pokemon.move.selected.type === 'WATER' ) {
      pokemon.damage = [];
      writeLog( `強い日差しの 影響で みずタイプの 攻撃が 蒸発した!` );
      return true;
    }
  }

  return false;
}

// ふんじんによるほのお技の失敗とダメージ
function failureByPowder( pokemon: Pokemon ): boolean {

  if ( pokemon.stateChange.powder.isTrue === true ) {
    if ( pokemon.move.selected.type === 'FIRE' ) {
      pokemon.damage = [];
      writeLog( `${pokemon.move.selected.name}に 反応して ふんじんが 爆発した!` );

      if ( pokemon.ability.isName( 'マジックガード' ) ) {
        return true;
      }

      const dynamax: number = ( pokemon.stateChange.dynamax.isTrue === true )? 1/2 : 1;
      const damage: number = Math.floor( pokemon.status.hitPoint.actual * dynamax / 4 );
      pokemon.status.hitPoint.value.add( -1 * damage );

      return true;
    }
  }

  return false;
}

// ミクルのみによる命中補正効果が消費される
function hitCorrConsumance( pokemon: Pokemon ): void {

}

// 技の仕様による失敗
function failureByMoveSpec( pokemon: Pokemon ): boolean {

  const targetList: TargetDataType[] = getTargetList( pokemon );
  const one: TargetDataType = targetList[0];

  steelRoller:
  if ( pokemon.move.selected.name === 'アイアンローラー' ) {
    if ( !fieldStatus.terrain.isPlain() ) break steelRoller;

    pokemon.damage = [];
    pokemon.declareFailure();
    return true;
  }

  hyperspaceFury:
  if ( pokemon.move.selected.name === 'いじげんラッシュ' ) {
    if ( pokemon.name === 'フーパ(解放)' ) break hyperspaceFury;
    if ( pokemon.stateChange.transform.isTrue === true && pokemon.stateChange.transform.name === 'フーパ(解放)' ) break hyperspaceFury;

    pokemon.damage = [];
    writeLog( `しかし ${getArticle( pokemon )}には 使うことが できなかった!` );
    return true;
  }

  darkVoid:
  if ( pokemon.move.selected.name === 'ダークホール' ) {
    if ( pokemon.name === 'ダークライ' ) break darkVoid;
    if ( pokemon.stateChange.transform.isTrue === true && pokemon.stateChange.transform.name === 'ダークライ' ) break darkVoid;

    pokemon.damage = [];
    writeLog( `しかし ${getArticle( pokemon )}には 使うことが できなかった!` );
    return true;
  }

  auraWheel:
  if ( pokemon.move.selected.name === 'オーラぐるま' ) {
    if ( pokemon.name === 'モルペコ(満腹)'  ) break auraWheel;
    if ( pokemon.name === 'モルペコ(空腹)'  ) break auraWheel;
    if ( pokemon.stateChange.transform.isTrue === true && pokemon.stateChange.transform.name === 'モルペコ(満腹)' ) break auraWheel;
    if ( pokemon.stateChange.transform.isTrue === true && pokemon.stateChange.transform.name === 'モルペコ(満腹)' ) break auraWheel;

    pokemon.damage = [];
    writeLog( `しかし ${getArticle( pokemon )}には 使うことが できなかった!` );
    return true;
  }

  auroraVeil:
  if ( pokemon.move.selected.name === 'オーロラベール' ) {
    if ( !fieldStatus.weather.isSnowy() ) break auroraVeil;

    pokemon.damage = [];
    pokemon.declareFailure();
    return true;
  }

  clangorousSoul:
  if ( pokemon.move.selected.name === 'ソウルビート' ) {
    if ( pokemon.status.hitPoint.value.value > Math.floor( pokemon.status.hitPoint.actual / 3 ) ) break clangorousSoul;

    pokemon.damage = [];
    pokemon.declareFailure();
    return true;
  }

  stockpile:
  if ( pokemon.move.selected.name === 'たくわえる' ) {
    if ( pokemon.stateChange.stockpile.count !== 3 ) break stockpile;

    pokemon.damage = [];
    pokemon.declareFailure();
    return true;
  }

  teleport:
  if ( pokemon.move.selected.name === 'テレポート' ) {
    const bench: Pokemon[] = getParty( pokemon.trainer ).filter( poke => poke.order.battle === null && poke.status.hitPoint.value.isZero() === false );
    if ( bench.length > 0 ) break teleport;

    pokemon.damage = [];
    pokemon.declareFailure();
    return true;
  }

  lastResort:
  if ( pokemon.move.selected.name === 'とっておき' ) {
    let isFailure: boolean = false;
    // 「とっておき」を覚えていない
    //if ( pokemon.learnedMove.filter( move => move.name === 'とっておき' ).length === 0 ) isFailure = true;
    // 「とっておき以外の技」を覚えていない
    //if ( pokemon.learnedMove.filter( move => move.name !== 'とっておき' && move.name !== null ).length === 0 ) isFailure = true;
    // 使用していない「とっておき以外の技」がある
    //if ( pokemon.learnedMove.filter( move => move.name !== 'とっておき' && move.name !== null && move.isUsed === false ).length > 0 ) isFailure = true;

    if ( isFailure === false ) break lastResort;

    pokemon.damage = [];
    pokemon.declareFailure();
    return true;
  }

  spitUp:
  if ( pokemon.move.selected.name === 'はきだす' || pokemon.move.selected.name === 'のみこむ' ) {
    if ( pokemon.stateChange.stockpile.count > 0 ) break spitUp;

    pokemon.damage = [];
    pokemon.declareFailure();
    return true;
  }

  stuffCheeks:
  if ( pokemon.move.selected.name === 'ほおばる' ) {
    for ( const berry of berryTable ) {
      if ( berry.name === pokemon.item.name ) break stuffCheeks;
    }

    pokemon.damage = [];
    pokemon.declareFailure();
    return true;
  }

  fling:
  if ( pokemon.move.selected.name === 'なげつける' ) {
    // 持ち物がない
    if ( pokemon.item.name === null ) break fling;
    if ( pokemon.item.isName( pokemon.item.name ) === false ) break fling;
    // 不適格な持ち物である
    if ( pokemon.item.name === 'べにいろのたま' ) break fling;
    if ( pokemon.item.name === 'あいいろのたま' ) break fling;
    if ( pokemon.item.name === 'くちたけん' ) break fling;
    if ( pokemon.item.name === 'くちたたて' ) break fling;
    if ( pokemon.item.name === 'だいこんごうだま' ) break fling;
    if ( pokemon.item.name === 'だいしらたま' ) break fling;
    if ( pokemon.item.name === 'だいはっきんだま' ) break fling;
    if ( pokemon.name === 'ギラティナ(アナザー)' && pokemon.item.name === 'はっきんだま' ) break fling;
    if ( pokemon.name === 'ギラティナ(オリジン)' && pokemon.item.name === 'はっきんだま' ) break fling;
    if ( pokemon.name === 'アルセウス' && plateTable.filter( plate => plate.name === pokemon.name ).length === 1 ) break fling;
    if ( pokemon.name === 'ゲノセクト' && driveTable.filter( drive => drive.name === pokemon.item.name ).length === 1 ) break fling;
    if ( gemTable.filter( gem => gem.name === pokemon.item.name ).length === 1 ) break fling;
    if ( zCrystalTable.filter( zCrystal => zCrystal.name === pokemon.item.name ).length === 1 ) break fling;
    if ( megaStoneTable.filter( mega => mega.name === pokemon.item.name && mega.name === pokemon.name ).length === 1 ) break fling;
    if ( paradoxPokemonList.includes( pokemon.name ) && pokemon.item.name === 'ブーストエナジー' ) break fling;

    pokemon.damage = [];
    pokemon.declareFailure();
    return true;
  }

  naturalGift:
  if ( pokemon.move.selected.name === 'しぜんのめぐみ' ) {
    // 持ち物がない
    if ( pokemon.item.name === null ) break naturalGift;
    if ( pokemon.item.isName( pokemon.item.name ) === false ) break naturalGift;
    // 不適格な持ち物である
    if ( berryTable.filter( berry => berry.name === pokemon.item.name ).length !== 1 ) break naturalGift;

    pokemon.damage = [];
    pokemon.declareFailure();
    return true;
  }

  fakeOut:
  if ( pokemon.move.selected.name === 'ねこだまし' || pokemon.move.selected.name === 'であいがしら' || pokemon.move.selected.name === 'たたみがえし' ) {
    pokemon.damage = [];
    pokemon.declareFailure();
    return true;
  }

  noRetreat:
  if ( pokemon.move.selected.name === 'はいすいのじん' ) {
    if ( pokemon.stateChange.noRetreat.isTrue === false ) break noRetreat;

    pokemon.damage = [];
    pokemon.declareFailure();
    return true;
  }

  suckerPunch:
  if ( pokemon.move.selected.name === 'ふいうち' ) {
    pokemon.damage = [];
    pokemon.declareFailure();
    return true;
  }

  poltergeist:
  if ( pokemon.move.selected.name === 'ポルターガイスト' ) {
    if ( one.target.item !== null ) break poltergeist;

    pokemon.damage = [];
    pokemon.declareFailure();
    return true;
  }

  protect:
  if ( protectMoveList.includes( pokemon.move.selected.name ) ) {
    if ( pokemon.stateChange.someProtect.isTrue === false ) break protect;
    if ( getRandom() < Math.pow( 1 / 3, pokemon.stateChange.someProtect.count ) ) break protect;

    pokemon.damage = [];
    pokemon.declareFailure();
    return true;
  }

  snore:
  if ( pokemon.move.selected.name === 'いびき' || pokemon.move.selected.name === 'ねごと' ) {
    if ( pokemon.statusAilment.isAsleep() ) break snore;
    if ( pokemon.ability.isName( 'ぜったいねむり' ) ) break snore;

    pokemon.damage = [];
    pokemon.declareFailure();
    return true;
  }

  rest:
  if ( pokemon.move.selected.name === 'ねむる' ) {
    if ( pokemon.hitPoint.value.isMax() ) break rest;
    if ( pokemon.statusAilment.isAsleep() ) break rest;
    if ( pokemon.ability.isName( 'ふみん' ) ) break rest;
    if ( pokemon.ability.isName( 'やるき' ) ) break rest;
    if ( pokemon.ability.isName( 'ぜったいねむり' ) ) break rest;

    pokemon.damage = [];
    pokemon.declareFailure();
    return true;
  }

  lowKick:
  if ( pokemon.move.selected.name === 'けたぐり' || pokemon.move.selected.name === 'くさむすび' || pokemon.move.selected.name === 'ヘビーボンバー' || pokemon.move.selected.name === 'ヒートスタンプ' ) {
    if ( one.target.stateChange.dynamax.isTrue === false ) break lowKick;

    pokemon.damage = [];
    writeLog( `${getArticle( pokemon )}は 首を 横に振った` );
    writeLog( `この技を しかけることが できないようだ......` );
    return true;
  }

  return false;
}

// 特性による失敗
function failureByAbility( pokemon: Pokemon ): boolean {

  const targetList: TargetDataType[] = getTargetList( pokemon );
  const one: TargetDataType = targetList[0];

  damp:
  if ( explosionMoveList.includes( pokemon.move.selected.name ) === true ) {
    const dampPokemon: Pokemon | false = isExistAbility( 'しめりけ' );
    if ( dampPokemon === false ) break damp;

    dampPokemon.declareAbility();
    writeLog( `${getArticle( pokemon )}は ${pokemon.move.selected.name}が 使えない!` );
    pokemon.damage = [];
    return true;
  }

  queenlyMajesty:
  if ( pokemon.move.selected.priority > 0 ) {
    const queenlyMajestyPokemon: Pokemon | false = isExistAbilityOneSide( getOpponentTrainer( pokemon.trainer ), 'じょおうのいげん' );
    const dazzlingPokemon: Pokemon | false = isExistAbilityOneSide( getOpponentTrainer( pokemon.trainer ), 'ビビッドボディ' );

    if ( targetList.filter( target => target.target.trainer !== pokemon.trainer ).length === 0 ) break queenlyMajesty;

    if ( queenlyMajestyPokemon !== false ) {
      queenlyMajestyPokemon.declareAbility();
      writeLog( `${getArticle( pokemon )}は ${pokemon.move.selected.name}を 使えない!` );
      pokemon.damage = [];
      return true;
    }

    if ( dazzlingPokemon !== false ) {
      dazzlingPokemon.declareAbility();
      writeLog( `${getArticle( pokemon )}は ${pokemon.move.selected.name}を 使えない!` );
      pokemon.damage = [];
      return true;
    }
  }

  return false;
}

// 中断されても効果が発動する技
function effectAlwaysActivate( pokemon: Pokemon ): boolean {

  const targetList: TargetDataType[] = getTargetList( pokemon );
  const one: TargetDataType = targetList[0];

  if ( pokemon.move.selected.name === 'みらいよち' || pokemon.move.selected.name === 'はめつのねがい' ) {
    const futureSight = new StateChange( 'みらいにこうげき' );
    futureSight.isTrue = true;
    futureSight.target.trainer = one.target.trainer;
    futureSight.target.battle = one.target.order.battle;
    fieldStatus.whole.futureSight.push( futureSight );

    if ( pokemon.move.selected.name === 'みらいよち' ) {
      writeLog( `${getArticle( pokemon )}は 未来に 攻撃を予知した!` );
    }
    if ( pokemon.move.selected.name === 'はめつのねがい' ) {
      writeLog( `${getArticle( pokemon )}は はめつのねがいを 未来に託した!` );
    }

    return true;
  }

  rage:
  if ( pokemon.move.selected.name === 'いかり' ) {
    if ( pokemon.stateChange.rage.isTrue === true ) break rage;
    pokemon.stateChange.rage.isTrue = true;
  }

  return false;
}

// へんげんじざい/リベロの発動
function abilityChangeType( pokemon : Pokemon ): void {

  const myType: PokemonType[] = getPokemonType( pokemon );

  protean:
  if ( pokemon.ability.isName( 'へんげんじざい' ) || pokemon.ability.isName( 'リベロ' ) ) {

    if ( myType.length === 1 && myType[0] === pokemon.move.selected.type ) break protean;
    if ( pokemon.stateChange.protean.isTrue === true ) break protean;
    if ( pokemon.move.selected.name === 'わるあがき' ) break protean;
    if ( pokemon.move.selected.name === 'みらいよち' ) break protean;
    if ( pokemon.move.selected.name === 'はめつのねがい' ) break protean;

    pokemon.declareAbility();
    pokemon.type1 = pokemon.move.selected.type;
    pokemon.type2 = null;

    pokemon.stateChange.protean.isTrue = true;

    writeLog( `${getArticle( pokemon )}は ${pokemon.type1}タイプに なった!` );
  }
}

// 溜め技の溜めターンでの動作
function preliminaryAction( pokemon: Pokemon ): boolean {

  const targetList: TargetDataType[] = getTargetList( pokemon );
  const one: TargetDataType = targetList[0];

  if ( pokemon.move.selected.getFlag().charge === false ) return false;
  if ( pokemon.stateChange.store.isTrue === true ) return false;

  if ( pokemon.move.selected.name === 'かまいたち' ) {
    writeLog( `${getArticle( pokemon )}の 周りで 空気が 渦を巻く!` );
  }
  if ( pokemon.move.selected.name === 'コールドフレア' ) {
    writeLog( `${getArticle( pokemon )}は 凍える空気に 包まれた!` );
  }
  if ( pokemon.move.selected.name === 'ゴッドバード' ) {
    writeLog( `${getArticle( pokemon )}を 激しい光が 包む!` );
  }
  if ( pokemon.move.selected.name === 'ジオコントロール' ) {
    writeLog( `${getArticle( pokemon )}は パワーを ためこんでいる!` );
  }
  if ( pokemon.move.selected.name === 'ソーラービーム' || pokemon.move.selected.name === 'ソーラーブレード' ) {
    writeLog( `${getArticle( pokemon )}は 光を 吸収した!` );

    if ( fieldStatus.weather.isSunny( pokemon ) ) {
      moveDeclareMessage( pokemon );
      return false;
    }
  }
  if ( pokemon.move.selected.name === 'フリーズボルト' ) {
    writeLog( `${getArticle( pokemon )}は 冷たい光に 包まれた!` );
  }
  if ( pokemon.move.selected.name === 'メテオビーム' ) {
    writeLog( `${getArticle( pokemon )}に 宇宙の 力が あふれだす!` );
    changeMyRank( pokemon, 'specialAttack', 1 );
  }
  if ( pokemon.move.selected.name === 'ロケットずつき' ) {
    writeLog( `${getArticle( pokemon )}は 首を 引っ込めた!` );
    changeMyRank( pokemon, 'defense', 1 );
  }
  if ( pokemon.move.selected.name === 'あなをほる' ) {
    writeLog( `${getArticle( pokemon )}は 地面に 潜った!` );
    pokemon.stateChange.dig.isTrue = true;
  }
  if ( pokemon.move.selected.name === 'そらをとぶ' ) {
    writeLog( `${getArticle( pokemon )}は 空高く 飛び上がった!` );
    pokemon.stateChange.fly.isTrue = true;
  }
  if ( pokemon.move.selected.name === 'とびはねる' ) {
    writeLog( `${getArticle( pokemon )}は 高く 飛び跳ねた!` );
    pokemon.stateChange.fly.isTrue = true;
  }
  if ( pokemon.move.selected.name === 'フリーフォール' ) {
    let isFailure: boolean = false;
    if ( one.target.trainer === pokemon.trainer ) isFailure = true;
    if ( one.target.stateChange.substitute.isTrue === true ) isFailure = true;
    if ( isHide( one.target ) === true ) isFailure = true;
    if ( isFailure === true ) {
      pokemon.damage = [];
      pokemon.declareFailure();
      return true;
    }

    if ( one.target.getWeight() >= 200 ) {
      pokemon.damage = [];
      writeLog( `${getArticle( one.target )}は 重すぎて 持ち上げられない!` );
      return true;
    }

    writeLog( `${getArticle( pokemon )}は ${getArticle( one.target )}を 上空に 連れ去った!` );
    pokemon.stateChange.fly.isTrue = true;
    one.target.stateChange.fly.isTrue = true;

    return true;
  }
  if ( pokemon.move.selected.name === 'ダイビング' ) {
    writeLog( `${getArticle( pokemon )}は 水中に 身を潜めた!` );
    pokemon.stateChange.dive.isTrue = true;

    if ( pokemon.name === 'ウッウ' ) {
      formChange( pokemon );
    }
  }
  if ( pokemon.move.selected.name === 'ゴーストダイブ' ) {
    writeLog( `${getArticle( pokemon )}の姿が 一瞬にして 消えた!` );
    pokemon.stateChange.shadowForce.isTrue = true;
  }
  if ( pokemon.move.selected.name === 'シャドーダイブ' ) {
    writeLog( `${getArticle( pokemon )}の姿が 一瞬にして 消えた!` );
    pokemon.stateChange.shadowForce.isTrue = true;
  }

  if ( pokemon.item.isName( 'パワフルハーブ' ) === false ) {
    pokemon.stateChange.store.isTrue = true;
    pokemon.stateChange.store.name = pokemon.move.selected.name;
    return true;
  }

  writeLog( `${getArticle( pokemon )}は パワフルハーブで 力が みなぎった!` );
  recycleAvailable( pokemon );
  moveDeclareMessage( pokemon );

  return false;
}

// マグニチュードの大きさ(威力)が決定
function dicideMagnitudePower( pokemon: Pokemon ): void {

  if ( pokemon.move.selected.name !== 'マグニチュード' ) return;

  const random: number = getRandom();

  if ( random >= 95 ) {
    pokemon.move.selected.power = 150;
    writeLog( `マグニチュード10!`);
    return;
  }

  if ( random >= 85 ) {
    pokemon.move.selected.power = 110;
    writeLog( `マグニチュード9!`);
    return;
  }

  if ( random >= 65 ) {
    pokemon.move.selected.power = 90;
    writeLog( `マグニチュード8!`);
    return;
  }

  if ( random >= 35 ) {
    pokemon.move.selected.power = 70;
    writeLog( `マグニチュード7!`);
    return;
  }

  if ( random >= 15 ) {
    pokemon.move.selected.power = 50;
    writeLog( `マグニチュード6!`);
    return;
  }

  if ( random >= 5 ) {
    pokemon.move.selected.power = 30;
    writeLog( `マグニチュード5!`);
    return;
  }

  if ( random >= 0 ) {
    pokemon.move.selected.power = 10;
    writeLog( `マグニチュード4!`);
    return;
  }
}

// 姿を隠していることによる無効化
function disableByConcealment( pokemon: Pokemon ): boolean {

  const targetList: TargetDataType[] = getTargetList( pokemon );

  for ( const target of targetList ) {
    if ( isHide( target.target ) === false ) continue;
    if ( pokemon.stateChange.lockOn.isTrue === true ) continue;
    if ( pokemon.ability.isName( 'ノーガード' ) ) continue;
    if ( target.target.ability.isName( 'ノーガード' ) ) continue;
    if ( pokemon.move.selected.name === 'どくどく' && getPokemonType( pokemon ).includes( 'POISON' ) ) continue;
    if ( pokemon.move.selected.name === 'アロマセラピー' ) continue;
    if ( pokemon.move.selected.name === 'いやしのすず' ) continue;
    if ( pokemon.move.selected.name === 'てだすけ' ) continue;

    let isValid: boolean = true;

    if ( target.target.stateChange.dig.isTrue === true ) {
      if ( pokemon.move.selected.name === 'じしん' ) isValid = true;
      if ( pokemon.move.selected.name === 'マグニチュード' ) isValid = true;
    }
    if ( target.target.stateChange.fly.isTrue === true ) {
      if ( pokemon.move.selected.name === 'かぜおこし' ) isValid = true;
      if ( pokemon.move.selected.name === 'たつまき' ) isValid = true;
      if ( pokemon.move.selected.name === 'かみなり' ) isValid = true;
      if ( pokemon.move.selected.name === 'スカイアッパー' ) isValid = true;
      if ( pokemon.move.selected.name === 'うちおとす' ) isValid = true;
      if ( pokemon.move.selected.name === 'ぼうふう' ) isValid = true;
      if ( pokemon.move.selected.name === 'サウザンアロー' ) isValid = true;
    }
    if ( target.target.stateChange.dive.isTrue === true ) {
      if ( pokemon.move.selected.name === 'なみのり' ) isValid = true;
      if ( pokemon.move.selected.name === 'うずしお' ) isValid = true;
    }

    if ( isValid === true ) continue;

    target.damage.success = false;
    writeLog( `${getArticle( target.target )}には 当たらなかった!` );
  }

  return isMoveFailure( pokemon );
}

// サイコフィールドによる無効化
function disableByPsychofield( pokemon: Pokemon ): boolean {

  if ( fieldStatus.terrain.isPsychic() ) return false;
  if ( pokemon.move.selected.priority <= 0 ) return false;

  const targetList: TargetDataType[] = getTargetList( pokemon );

  for ( const target of targetList ) {
    if ( target.target.trainer === pokemon.trainer ) continue;
    if ( isGrounded( target.target ) === false ) continue;
    if ( isHide( target.target ) === true ) continue;

    target.damage.success = false;
    writeLog( `${getArticle( target.target )}は サイコフィールドに 守られている!` );
  }

  return isMoveFailure( pokemon );
}

// ファストガード/ワイドガード/トリックガードによる無効化
function disableByOtherProtect( pokemon: Pokemon ): boolean {

  const targetList: TargetDataType[] = getTargetList( pokemon );

  for ( const target of targetList ) {
    quickGuard:
    if ( fieldStatus.getSide( target.target.trainer ).quickGuard.isTrue === true ) {
      if ( pokemon.move.selected.priority <= 0 ) break quickGuard;
      if ( pokemon.ability.isName( 'ふかしのこぶし' ) && pokemon.move.selected.getFlag().contact === true ) break quickGuard;

      target.damage.success = false;
      writeLog( `${getArticle( target.target )}は ファストガードで 守られた!` );
      continue;
    }

    wideGuard:
    if ( fieldStatus.getSide( target.target.trainer ).wideGuard.isTrue === true ) {
      if ( pokemon.move.selected.target !== '相手全体' && pokemon.move.selected.target !== '自分以外' ) break wideGuard;
      if ( pokemon.ability.isName( 'ふかしのこぶし' ) && pokemon.move.selected.getFlag().contact === true ) break wideGuard;

      target.damage.success = false;
      writeLog( `${getArticle( target.target )}は ワイドガードで 守られた!` );
      continue;
    }

    craftyShield:
    if ( fieldStatus.getSide( target.target.trainer ).craftyShield.isTrue === true ) {
      if ( target.target.trainer === pokemon.trainer ) break craftyShield;
      if ( !pokemon.move.selected.isStatus() ) break craftyShield;
      if ( pokemon.move.selected.target === '全体' ) break craftyShield;
      if ( pokemon.move.selected.target === '味方全体' ) break craftyShield;
      if ( pokemon.move.selected.name === 'コーチング' ) break craftyShield;
      if ( pokemon.move.selected.name === 'オウムがえし' ) break craftyShield;
      if ( pokemon.move.selected.name === 'さきどり' ) break craftyShield;

      target.damage.success = false;
      writeLog( `${getArticle( target.target )}は トリックガードで 守られた!` );
      continue;
    }
  }

  return isMoveFailure( pokemon );
}

// まもる/キングシールド/ブロッキング/ニードルガード/トーチカによる無効化
function disableByProtect( pokemon: Pokemon ): boolean {

  const targetList: TargetDataType[] = getTargetList( pokemon );

  for ( const target of targetList ) {
    if ( target.target.stateChange.protect.isTrue === false ) continue;
    if ( pokemon.move.selected.getFlag().protect === false ) continue;
    if ( pokemon.ability.isName( 'ふかしのこぶし' ) && pokemon.move.selected.getFlag().contact === true ) continue;
    if ( target.target.stateChange.protect.text === 'キングシールド' && pokemon.move.selected.isStatus() ) continue;
    if ( target.target.stateChange.protect.text === 'ブロッキング' && pokemon.move.selected.isStatus() ) continue;

    target.damage.success = false;
    writeLog( `${getArticle( target.target )}は 攻撃から 身を守った!` );

    spikyShield:
    if ( target.target.stateChange.protect.text === 'ニードルガード' ) {
      if ( pokemon.move.selected.getFlag().contact === false ) break spikyShield;
      if ( pokemon.move.selected.name === 'フリーフォール' ) break spikyShield;
      if ( pokemon.ability.isName( 'マジックガード' ) ) break spikyShield;
      if ( target.target.item.isName( 'ぼうごパット' ) === true ) break spikyShield;

      const dynamax: number = ( pokemon.stateChange.dynamax.isTrue === true )? 0.5 : 1;
      const damage: number = Math.max( 1, Math.floor( pokemon.status.hitPoint.actual * dynamax / 8 ) )
      changeHPByAbility( pokemon, damage, '-' );
      writeLog( `${getArticle( pokemon )}は 傷ついた!` );
    }

    banefulBunker:
    if ( target.target.stateChange.protect.text === 'トーチカ' ) {
      if ( pokemon.move.selected.getFlag().contact === false ) break banefulBunker;
      if ( pokemon.move.selected.name === 'フリーフォール' ) break banefulBunker;

      giveAilment( target.target, pokemon, 'POISONED' )
    }

    kingsShield:
    if ( target.target.stateChange.protect.text === 'キングシールド' ) {
      if ( pokemon.move.selected.getFlag().contact === false ) break kingsShield;
      if ( getRankVariation( pokemon, 'attack', -1 ) === 0 ) break kingsShield;

      changeTargetRank( target.target, pokemon, 'attack', -1 );
    }

    obstruct:
    if ( target.target.stateChange.protect.text === 'ブロッキング' ) {
      if ( pokemon.move.selected.getFlag().contact === false ) break obstruct;
      if ( getRankVariation( pokemon, 'defense', -2 ) === 0 ) break obstruct;

      changeTargetRank( target.target, pokemon, 'defense', -2 );
    }
  }

  return isMoveFailure( pokemon );
}

// たたみがえしによる無効化
function disableByMatBlock( pokemon: Pokemon ): boolean {

  const targetList: TargetDataType[] = getTargetList( pokemon );

  for ( const target of targetList ) {
    if ( fieldStatus.getSide( target.target.trainer ).matBlock.isTrue === false ) continue;
    if ( pokemon.move.selected.isStatus() ) continue;
    if ( pokemon.ability.isName( 'ふかしのこぶし' ) && pokemon.move.selected.getFlag().contact === true ) continue;

    target.damage.success = false;
    writeLog( `${pokemon.move.selected.name}は たたみがえしで 防がれた!` );
  }

  return isMoveFailure( pokemon );
}

// ダイウォールによる無効化
function disableByMaxGuard( pokemon: Pokemon ): boolean {

  const targetList: TargetDataType[] = getTargetList( pokemon );

  for ( const target of targetList ) {
    if ( target.target.stateChange.protect.text !== 'ダイウォール' ) continue;
    if ( notMaxGuardMoveList.includes( pokemon.move.selected.name ) === false && pokemon.move.selected.getFlag().protect === false ) continue;

    target.damage.success = false;
    writeLog( `${getArticle( target.target )}は 攻撃から 身を守った!` );
  }

  return isMoveFailure( pokemon );
}

// テレキネシスの、対象がディグダ/ダグトリオ/スナバァ/シロデスナ/メガゲンガー/うちおとす状態/ねをはる状態であることによる失敗
function failureByTelekinesis( pokemon: Pokemon ): boolean {

  const targetList: TargetDataType[] = getTargetList( pokemon );
  const one: TargetDataType = targetList[0];
  let isFailure: boolean = false;

  if ( pokemon.move.selected.name !== 'テレキネシス' ) return false;

  if ( one.target.name === 'ディグダ' ) isFailure = true;
  if ( one.target.name === 'ダグトリオ' ) isFailure = true;
  if ( one.target.name === 'スナバァ' ) isFailure = true;
  if ( one.target.name === 'シロデスナ' ) isFailure = true;
  if ( one.target.name === 'メガゲンガー' ) isFailure = true;
  if ( one.target.stateChange.smackDown.isTrue === true ) isFailure = true;
  if ( one.target.stateChange.ingrain.isTrue === true ) isFailure = true;

  if ( isFailure === true ) {
    pokemon.damage = [];
    pokemon.declareFailure();
    return true;
  }

  return false;
}

// 特性による無効化(その1)
function disableByAbility1st( pokemon: Pokemon ): boolean {

  const targetList: TargetDataType[] = getTargetList( pokemon );
  const one: TargetDataType = targetList[0];

  for ( const damage of pokemon.damage ) {
    const target: Pokemon | false = getPokemonByBattle( damage.trainer, damage.battle );
    if ( target === false ) continue;
    // そうしょく: くさタイプ
    if ( target.ability.isName( 'そうしょく' ) ) {
      if ( pokemon.move.selected.type === 'GRASS' ) {
        target.declareAbility();
        target.declareInvalid( damage );
      }
    }
    // もらいび: ほのおタイプ
    if ( target.ability.isName( 'もらいび' ) ) {
      if ( pokemon.move.selected.type === 'FIRE' ) {
        target.declareAbility();
        target.declareInvalid( damage );
      }
    }
    // かんそうはだ/よびみず/ちょすい: みずタイプ
    if ( target.ability.isName( 'かんそうはだ' ) ) {
      if ( pokemon.move.selected.type === 'WATER' ) {
        target.declareAbility();
        target.declareInvalid( damage );
      }
    }
    if ( target.ability.isName( 'よびみず' ) ) {
      if ( pokemon.move.selected.type === 'WATER' ) {
        target.declareAbility();
        target.declareInvalid( damage );
      }
    }
    if ( target.ability.isName( 'ちょすい' ) ) {
      if ( pokemon.move.selected.type === 'WATER' ) {
        target.declareAbility();
        target.declareInvalid( damage );
      }
    }
    // ひらいしん/でんきエンジン/ちくでん: でんきタイプ
    if ( target.ability.isName( 'ひらいしん' ) ) {
      if ( pokemon.move.selected.type === 'ELECTRIC' ) {
        target.declareAbility();
        target.declareInvalid( damage );
      }
    }
    if ( target.ability.isName( 'でんきエンジン' ) ) {
      if ( pokemon.move.selected.type === 'ELECTRIC' ) {
        target.declareAbility();
        target.declareInvalid( damage );
      }
    }
    if ( target.ability.isName( 'ちくでん' ) ) {
      if ( pokemon.move.selected.type === 'ELECTRIC' ) {
        target.declareAbility();
        target.declareInvalid( damage );
      }
    }
    // ぼうおん: 音技
    if ( target.ability.isName( 'ぼうおん' ) ) {
      if ( pokemon.move.selected.getFlag().sound === true ) {
        target.declareAbility();
        target.declareInvalid( damage );
      }
    }
    // テレパシー:　味方による攻撃技
    // ふしぎなまもり: 効果抜群でない技
    // ぼうじん: 粉技
    if ( target.ability.isName( 'ぼうじん' ) ) {
      if ( pokemon.move.selected.getFlag().powder === true ) {
        target.declareAbility();
        target.declareInvalid( damage );
      }
    }
  }
  if ( isInvalid( pokemon.damage ) === true ) {
    return false;
  }


  return isMoveFailure( pokemon );
}
