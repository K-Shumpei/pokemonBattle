function endProcess(): void {

  main.calcRankCorrectionValue();

  main.me.pokemon.map( poke => poke.attack.reset() );
  main.opp.pokemon.map( poke => poke.attack.reset() );

  endProcessWeatherEffect(); // てんきの効果
  // ききかいひ/にげごしによる交代先の選択・繰り出し (1)
  // なかよし度による状態異常の回復
  // みらいよち/はめつのねがい: 技が使用された順に発動する。
  // ねがいごと
  endProcessEventBlock1st(); // イベントブロック (その1)
  // ききかいひ/にげごしによる交代先の選択・繰り出し (2)

  // アクアリング
  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    pokemon.stateChange.aquaRing.onEffective( pokemon );
  }

  // ねをはる
  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    pokemon.stateChange.ingrain.onEffective( pokemon );
  }

  // やどりぎのタネ
  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    pokemon.stateChange.leechSeed.onEffective( pokemon );
  }

  // どく/もうどく/ポイズンヒール
  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    pokemon.statusAilment.onEffectivePoisoned( pokemon );
  }

  // やけど
  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    pokemon.statusAilment.onEffectiveBurned( pokemon );
  }

  // あくむ
  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    pokemon.stateChange.nightmare.onEffective( pokemon );
  }

  // のろい
  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    pokemon.stateChange.curse.onEffective( pokemon );
  }

  // バインド
  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    pokemon.stateChange.bind.onEffective( pokemon );
  }

  // たこがため
  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    pokemon.stateChange.octolock.onEffective( pokemon );
  }

  // しおづけ
  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    pokemon.stateChange.saltCure.onEffective( pokemon );
  }

  // ちょうはつの終了
  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    pokemon.stateChange.taunt.onElapse( pokemon );
  }

  // いちゃもんの終了: キョダイユウゲキによるいちゃもん状態のみターン経過で解除される
  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    pokemon.stateChange.torment.onElapse( pokemon );
  }

  // アンコールの終了
  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    pokemon.stateChange.encore.onElapse( pokemon );
  }

  // かなしばりの終了
  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    pokemon.stateChange.disable.onElapse( pokemon );
  }

  // でんじふゆうの終了
  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    pokemon.stateChange.magnetRise.onElapse( pokemon );
  }

  // テレキネシスの終了
  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    pokemon.stateChange.telekinesis.onElapse( pokemon );
  }

  // かいふくふうじの終了
  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    pokemon.stateChange.healBlock.onElapse( pokemon );
  }

  // さしおさえの終了
  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    pokemon.stateChange.embargo.onElapse( pokemon );
  }

  // ねむけ

  // ほろびのうた
  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    pokemon.stateChange.perishSong.onEffective( pokemon );
  }
  // はねやすめを使用していたひこうタイプは地面から離れる
  // ききかいひ/にげごしによる交代先の選択・繰り出し (3)
  endProcessElapseSideField(); // 片側の場の状態の継続/終了
  endProcessElapseWholeField(); // 全体の場の状態の継続/終了
  endProcessEventBlock2nd(); // イベントブロック (その2）
  // ききかいひ/にげごしによる交代先の選択・繰り出し (4)
  // ダルマモード/リミットシールド/スワームチェンジ/ぎょぐんによるフォルムチェンジ: すばやさ補正を考慮しない。ボールから出た直後のフォルムのすばやさ実数値が発動順に影響する。
  // イベントブロック (その3)
  // だっしゅつパックによる交代先の選択・繰り出し
  // 仲間呼び
  // ひんしになったポケモンの代わりのポケモンを繰り出す
  // ダイマックスの終了判定
  // 2.行動選択に戻る
}

function endProcessWeatherEffect(): void {

  const weatherDamage = ( pokemon: Pokemon ): void => {
    main.field.weather.onActivateSandstorm( pokemon );
  }

  const activateAbility = ( pokemon: Pokemon ): void => {
    if ( pokemon.stateChange.dig.isTrue ) return;
    if ( pokemon.stateChange.dive.isTrue ) return;

    const HP_8: number = Math.floor( pokemon.getOrgHP() / 8 );
    const HP_16: number = Math.floor( pokemon.getOrgHP() / 16 );

    if ( pokemon.ability.isName( 'Dry Skin' ) ) { // 特性「かんそうはだ」
      if ( main.field.weather.isSunny( pokemon ) ) {
        pokemon.msgDeclareAbility();
        pokemon.status.hp.value.sub( Math.max( HP_8, 1 ) );
      }

      if ( main.field.weather.isRainy( pokemon ) ) {
        pokemon.msgDeclareAbility();
        pokemon.status.hp.value.add( Math.max( HP_8, 1 ) );
      }
    }

    if ( pokemon.ability.isName( 'Solar Power' ) ) { // 特性「サンパワー」
      if ( main.field.weather.isSunny( pokemon ) ) {
        pokemon.msgDeclareAbility();
        pokemon.status.hp.value.sub( Math.max( HP_8, 1 ) );
      }
    }

    if ( pokemon.ability.isName( 'Rain Dish' ) ) { // 特性「あめうけざら」
      if ( main.field.weather.isRainy( pokemon ) ) {
        pokemon.msgDeclareAbility();
        pokemon.status.hp.value.add( Math.max( HP_16, 1 ) );
      }
    }

    if ( pokemon.ability.isName( 'Ice Body' ) ) { // 特性「アイスボディ」
      if ( main.field.weather.isSnowy() ) {
        pokemon.msgDeclareAbility();
        pokemon.status.hp.value.add( Math.max( HP_16, 1 ) );
      }
    }
  }


  main.field.weather.advance(); // a. にほんばれ/あめ/すなあらし/あられ/ゆきの終了

  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    weatherDamage( pokemon );   // b. すなあらし/あられのダメージ
    activateAbility( pokemon ); // c. かんそうはだ/サンパワー/あめうけざら/アイスボディ
  }
}

function endProcessEventBlock1st(): void {

  const damage = ( pokemon: Pokemon ): void => {
    main.field.getSide( pokemon.isMine() ).seaOfFire.onEffective( pokemon );
    main.field.getSide( pokemon.isMine() ).vineLash.onEffective( pokemon );
    main.field.getSide( pokemon.isMine() ).wildfire.onEffective( pokemon );
    main.field.getSide( pokemon.isMine() ).cannonade.onEffective( pokemon );
    main.field.getSide( pokemon.isMine() ).volcalith.onEffective( pokemon );
  }

  const heal = ( pokemon: Pokemon ): void => {
    main.field.terrain.onActivateGrassy( pokemon );
  }

  const ability = ( pokemon: Pokemon ): void => {
    if ( pokemon.ability.isName( 'Hydration' ) ) { // 特性「うるおいボディ」
      if ( main.field.weather.isRainy( pokemon ) && !pokemon.statusAilment.isHealth() ) {
        pokemon.msgDeclareAbility();
        pokemon.statusAilment.getHealth();
      }
    }

    if ( pokemon.ability.isName( 'Shed Skin' ) ) { // 特性「だっぴ」
      if ( getRandom() < 30 && !pokemon.statusAilment.isHealth() ) {
        pokemon.msgDeclareAbility();
        pokemon.statusAilment.getHealth();
      }
    }

    if ( pokemon.ability.isName( 'Healer' ) ) { // 特性「いやしのこころ」

    }
  }

  const item = ( pokemon: Pokemon ): void => {
    const HP_8: number = Math.floor( pokemon.getOrgHP() / 8 );
    const HP_16: number = Math.floor( pokemon.getOrgHP() / 16 );

    if ( pokemon.isItem( 'たべのこし' ) ) {
      pokemon.status.hp.value.add( Math.max( 1, HP_16 ) );
      battleLog.write( `${pokemon.getArticle()}は たべのこしで 少し 回復` );
    }

    if ( pokemon.isItem( 'くろいヘドロ' ) ) {
      if ( pokemon.type.has( 'Poison' ) ) {
        pokemon.status.hp.value.add( Math.max( 1, HP_8 ) );
      } else {
        pokemon.status.hp.value.sub( Math.max( 1, HP_16 ) );
      }
    }
  }




  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {
    damage( pokemon );  // a. ひのうみ/キョダイベンタツ/キョダイゴクエン/キョダイホウゲキ/キョダイフンセキ(ダメージ): 状態が発生した順にダメージが発動する。
    heal( pokemon );    // b. グラスフィールド(回復)
    ability( pokemon ); // c. うるおいボディ/だっぴ/いやしのこころ
    item( pokemon );    // b. たべのこし/くろいヘドロ
  }
}




function endProcessElapseSideField(): void {
  // ホスト側の状態が先にすべて解除された後に、ホストでない側の状態が解除される。
  // コートチェンジされていても関係なくホスト側から消える。
  const hostField: SideField = main.field.getSideByHost( true );
  const guestField: SideField = main.field.getSideByHost( false );

  for ( const field of [ hostField, guestField ] ) {
    field.reflect.onElapse();     // a. リフレクター
    field.lightScreen.onElapse(); // b. ひかりのかべ
    field.auroraVeil.onElapse();  // c. しんぴのまもり
    field.mist.onElapse();        // d. しろいきり
    field.tailwind.onElapse();    // e. おいかぜ
    field.luckyChant.onElapse();  // f. おまじない
    field.rainbow.onElapse();     // g. にじ
    field.seaOfFire.onElapse();   // h. ひのうみ
    field.wetlands.onElapse();    // i. しつげん
    field.auroraVeil.onElapse();  // j. オーロラベール
  }
}

function endProcessElapseWholeField(): void {
  main.field.whole.trickRoom.onElapse();  // a. トリックルーム
  main.field.whole.gravity.onElapse();    // b. じゅうりょく
  main.field.whole.waterSport.onElapse(); // c. みずあそび
  main.field.whole.magicRoom.onElapse();  // d. どろあそび
  main.field.whole.wonderRoom.onElapse(); // e. ワンダールーム
  main.field.whole.magicRoom.onElapse();  // f. マジックルーム
  main.field.terrain.onElapse();          // g. エレキフィールド/グラスフィールド/ミストフィールド/サイコフィールド
}

function endProcessEventBlock2nd(): void {

  const ability1st = ( pokemon: Pokemon ): void => {
    if ( !pokemon.ability.isValid() ) return;

    switch ( pokemon.ability.name ) {
      case 'Speed Boost': // 特性「かそく」
        if ( !pokemon.isChangeRank( 'spe', 1 ) ) break;
        pokemon.msgDeclareAbility();
        pokemon.changeRank( 'spe', 1 );
        break;

      case 'Moody': // 特性「ムラっけ」
        const rankForUp: RankStrings[] = pokemon.status.getNotMaxRank();
        const rankForDown: RankStrings[] = pokemon.status.getNotMinRank();

        pokemon.msgDeclareAbility();

        if ( rankForUp.length > 0 ) {
          pokemon.changeRank( getOneAtRandom( rankForUp ), 2 );
        }

        if ( rankForDown.length > 0 ) {
          pokemon.changeRank( getOneAtRandom( rankForDown ), -1 );
        }
        break;

      case 'Slow Start': // 特性「スロースタート」
        pokemon.stateChange.slowStart.onElapse( pokemon );
        break;

      case 'Bad Dreams': // 特性「ナイトメア」
        // ダメージを受ける順番が間違っている
        for ( const poke of getPokemonInSide( !pokemon.isMine() ) ) {
          if ( !poke.statusAilment.isAsleep() ) continue;
          const damage: number = Math.floor( poke.getOrgHP() / 8 );
          poke.status.hp.value.sub( Math.max( 1, damage ) );
          battleLog.write( `${poke.getArticle()}は うなされている!` );
        }
        break;

      case 'Cud Chew': // 特性「はんすう」
        break;

      default:
        break;
    }
  }

  const item1st = ( pokemon: Pokemon ): void => {
    if ( pokemon.isItem( 'くっつきバリ' ) ) {
      const damage: number = Math.floor( pokemon.getOrgHP() / 8 );
      pokemon.status.hp.value.sub( Math.max( 1, damage ) );
      battleLog.write( `${pokemon.getArticle()}は くっつきバリで ダメージを 受けた!` );
    }

    if ( pokemon.isItem( 'どくどくだま' ) && pokemon.statusAilment.isHealth() ) {
      pokemon.statusAilment.getBadPoisoned( 'どくどくだま' );
    }

    if ( pokemon.isItem( 'かえんだま' ) && pokemon.statusAilment.isHealth() ) {
      pokemon.statusAilment.getBurned( 'かえんだま' );
    }
  }

  const ability2nd = ( pokemon: Pokemon ): void => {
    if ( !pokemon.ability.isValid() ) return;
  }

  const item2nd = ( pokemon: Pokemon ): void => {

  }


  for ( const pokemon of getPokemonInBattlefield( 'actionOrder' ) ) {

    // a. さわぐ
    // b. ねむりによるあばれるの中断
    ability1st( pokemon ); // c. かそく/ムラっけ/スロースタート/ナイトメア/はんすう
    item1st( pokemon );    // d. くっつきバリ/どくどくだま/かえんだま
    ability2nd( pokemon ); // e. ものひろい/しゅうかく/たまひろい
    item2nd( pokemon );    // f. しろいハーブ
  }
}
