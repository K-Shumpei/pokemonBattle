function endProcess(): void {

  main.calcSpeed();

  endProcessWeatherEffect(); // てんきの効果
  // ききかいひ/にげごしによる交代先の選択・繰り出し (1)
  // なかよし度による状態異常の回復
  // みらいよち/はめつのねがい: 技が使用された順に発動する。
  // ねがいごと
  endProcessEventBlock1st(); // イベントブロック (その1)
  // ききかいひ/にげごしによる交代先の選択・繰り出し (2)
  endProcessAquaRing(); // アクアリング
  endProcessIngrain(); // ねをはる
  endProcessLeechSeed(); // やどりぎのタネ
  endProcessPoisoned(); // どく/もうどく/ポイズンヒール
  endProcessBurned(); // やけど
  endProcessNightmare(); // あくむ
  endProcessCurse(); // のろい
  // バインド
  // たこがため
  // しおづけ
  // ちょうはつの終了
  // いちゃもんの終了: キョダイユウゲキによるいちゃもん状態のみターン経過で解除される
  // アンコールの終了
  // かなしばりの終了
  // でんじふゆうの終了
  // テレキネシスの終了
  // かいふくふうじの終了
  // さしおさえの終了
  // ねむけ
  // ほろびのうた
}

function endProcessWeatherEffect(): void {

  const weatherDamage = ( pokemon: Pokemon ): void => {
    if ( !main.field.weather.isSandy() ) return;
    if ( pokemon.ability.isName( 'Overcoat' ) ) return; // 特性「ぼうじん」
    if ( pokemon.item.isName( 'ぼうじんゴーグル' ) ) return;
    if ( pokemon.stateChange.dig.isTrue ) return;
    if ( pokemon.stateChange.dive.isTrue ) return;
    if ( pokemon.type.has( 'Rock' ) ) return;
    if ( pokemon.type.has( 'Ground' ) ) return;
    if ( pokemon.type.has( 'Steel' ) ) return;
    if ( pokemon.ability.isName( 'Sand Veil' ) ) return; // 特性「すながくれ」
    if ( pokemon.ability.isName( 'Sand Rush' ) ) return; // 特性「すなかき」
    if ( pokemon.ability.isName( 'Sand Force' ) ) return; // 特性「すなのちから」

    pokemon.msgSandstorm();
    pokemon.status.hp.value.sub( Math.max( Math.floor( pokemon.getOrgHP() / 16 ), 1 ) )
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

  for ( const pokemon of sortByActionOrder( main.getPokemonInBattle() ) ) {
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
      if ( getRandom() < 0.3 && !pokemon.statusAilment.isHealth() ) {
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

    if ( pokemon.item.isName( 'たべのこし' ) ) {
      pokemon.status.hp.value.add( Math.max( 1, HP_16 ) );
      writeLog( `${pokemon.getArticle()}は たべのこしで 少し 回復` );
    }

    if ( pokemon.item.isName( 'くろいヘドロ' ) ) {
      if ( pokemon.type.has( 'Poison' ) ) {
        pokemon.status.hp.value.add( Math.max( 1, HP_8 ) );
      } else {
        pokemon.status.hp.value.sub( Math.max( 1, HP_16 ) );
      }
    }
  }




  for ( const pokemon of sortByActionOrder( main.getPokemonInBattle() ) ) {
    damage( pokemon );  // a. ひのうみ/キョダイベンタツ/キョダイゴクエン/キョダイホウゲキ/キョダイフンセキ(ダメージ): 状態が発生した順にダメージが発動する。
    heal( pokemon );    // b. グラスフィールド(回復)
    ability( pokemon ); // c. うるおいボディ/だっぴ/いやしのこころ
    item( pokemon );    // b. たべのこし/くろいヘドロ
  }
}

function endProcessAquaRing(): void {
  for ( const pokemon of sortByActionOrder( main.getPokemonInBattle() ) ) {
    pokemon.stateChange.aquaRing.onEffective( pokemon );
  }
}

function endProcessIngrain(): void {
  for ( const pokemon of sortByActionOrder( main.getPokemonInBattle() ) ) {
    pokemon.stateChange.ingrain.onEffective( pokemon );
  }
}

function endProcessLeechSeed(): void {
  for ( const pokemon of sortByActionOrder( main.getPokemonInBattle() ) ) {
    pokemon.stateChange.leechSeed.onEffective( pokemon );
  }
}

function endProcessPoisoned(): void {
  for ( const pokemon of sortByActionOrder( main.getPokemonInBattle() ) ) {
    pokemon.statusAilment.onEffectivePoisoned( pokemon );
  }
}

function endProcessBurned(): void {
  for ( const pokemon of sortByActionOrder( main.getPokemonInBattle() ) ) {
    pokemon.statusAilment.onEffectiveBurned( pokemon );
  }
}

function endProcessNightmare(): void {
  for ( const pokemon of sortByActionOrder( main.getPokemonInBattle() ) ) {
    pokemon.stateChange.nightmare.onEffective( pokemon );
  }
}

function endProcessCurse(): void {
  for ( const pokemon of sortByActionOrder( main.getPokemonInBattle() ) ) {
    pokemon.stateChange.curse.onEffective( pokemon );
  }
}
