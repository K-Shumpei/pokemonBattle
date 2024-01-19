function calculateDamage( pokemon: Pokemon, target: Pokemon, attack: Attack ): number {

  /*
  // ダメージ固定技の時
    if ( fixedDamage.includes(poke.myMove.name) ) {
      tgt.damage    = isDamageByFixedDamageMove(poke, tgt)
      tgt.effective = 1     // タイプ相性
      tgt.critical  = false // 急所
      return
  }
  */

  // 最終威力
  const power = getPower( pokemon, target );
  // 攻撃と防御の実数値取得　A/D
  const status = getStatus( pokemon, target, attack );
  // 最終ダメージ
  const finalDamage = getDamage( pokemon, target, power, status, attack )

  return finalDamage;
}

// 威力計算
function getPower( pokemon: Pokemon, target: Pokemon ): number {

  const getBasicPawer = ( pokemon: Pokemon, target: Pokemon ): number => {

    const move: SelectedMove = pokemon.move.selected;

    if ( move.isName( 'きしかいせい' ) || move.isName( 'じたばた' ) ) {
      if ( pokemon.status.hp.value.rate() >= 0 )     return 200;
      if ( pokemon.status.hp.value.rate() >= 2/48 )  return 150;
      if ( pokemon.status.hp.value.rate() >= 5/48 )  return 100;
      if ( pokemon.status.hp.value.rate() >= 10/48 ) return 80;
      if ( pokemon.status.hp.value.rate() >= 17/48 ) return 40;
      if ( pokemon.status.hp.value.rate() >= 33/48 ) return 20;
    }

    if ( move.isName( 'しおふき' ) || move.isName( 'ふんか' ) || move.isName( 'ドラゴンエナジー' ) ) {
      const base: number = Math.floor( 150 * pokemon.status.hp.value.rate() );
      return Math.max( base, 1 );
    }

    if ( move.isName( 'しぼりとる' ) || move.isName( 'にぎりつぶす' ) ) {
      const base: number = Math.floor( 150 * target.status.hp.value.rate() );
      return Math.max( base, 1 );
    }

    if ( move.isName( 'アシストパワー' ) || move.isName( 'つけあがる' ) ) {
      return 20 * ( pokemon.status.countRank() + 1 );
    }

    if ( move.isName( 'おしおき' ) ) {
      const base: number = 20 * ( pokemon.status.countRank() + 3 );
      return Math.min( base, 200 );
    }

    if ( move.isName( 'エレキボール' ) ) {
      if ( target.status.spe.forPowerCalc === 0 ) return 1; // 相手の値が0なら威力は40
      const parameter: number = pokemon.status.spe.forPowerCalc / target.status.spe.forPowerCalc;
      if ( parameter >= 4 ) return 150;
      if ( parameter >= 3 ) return 120;
      if ( parameter >= 2 ) return 80;
      if ( parameter >= 1 ) return 60;
      if ( parameter >= 0 ) return 40;
    }

    if ( move.isName( 'ジャイロボール' ) ) {
      if ( pokemon.status.spe.forPowerCalc === 0 ) return 1; // 自分の値が0なら威力は1
      return Math.floor( 25 * target.status.spe.forPowerCalc / pokemon.status.spe.forPowerCalc ) + 1;
    }

    if ( move.isName( 'おんがえし' ) ) {
      const base: number = Math.floor( pokemon.happiness * 10 / 25 );
      return Math.max( base, 1 );
    }

    if ( move.isName( 'やつあたり' ) ) {
      const base: number = Math.floor( ( 255 - pokemon.happiness ) * 10 / 25 );
      return Math.max( base, 1 );
    }

    if ( move.isName( 'きりふだ' ) ) {
      const parameter: number = pokemon.move.learned[pokemon.move.selected.slot].powerPoint.value;
      if ( parameter === 0 ) return 200;
      if ( parameter === 1 ) return 80;
      if ( parameter === 2 ) return 60;
      if ( parameter === 3 ) return 50;
      if ( parameter >= 4 )  return 40;
    }

    if ( move.isName( 'くさむすび' ) || move.isName( 'けたぐり' ) ) {
      const parameter: number = target.getWeight();
      if ( parameter >= 120 ) return 120;
      if ( parameter >= 100 ) return 100;
      if ( parameter >= 50 )  return 80;
      if ( parameter >= 25 )  return 60;
      if ( parameter >= 10 )  return 40;
      return 20;
    }

    if ( move.isName( 'ヒートスタンプ' ) || move.isName( 'ヘビーボンバー' ) ) {
      const parameter: number = target.getWeight() / pokemon.getWeight();
      if ( parameter <= 1/5 ) return 120;
      if ( parameter <= 1/4 ) return 100;
      if ( parameter <= 1/3 ) return 80;
      if ( parameter <= 1/2 ) return 60;
      return 40;
    }

    if ( move.isName( 'きつけ' ) ) {
      if ( target.statusAilment.isParalysis() ) {
        return 140;
      }
    }

    if ( move.isName( 'めざましビンタ' ) ) {
      if ( target.statusAilment.isAsleep() ) {
        return 140;
      }
    }

    if ( move.isName( 'たたりめ' ) ) {
      if ( !target.statusAilment.isHealth() ) {
        return 130;
      }
    }

    if ( move.isName( 'ウェザーボール' ) ) {
      if ( fieldStatus.weather.isSunny( pokemon ) ) return 100;
      if ( fieldStatus.weather.isRainy( pokemon ) ) return 100;
      if ( fieldStatus.weather.isSandy() ) return 100;
      if ( fieldStatus.weather.isSnowy() ) return 100;
    }

    if ( move.isName( 'だいちのはどう' ) ) {
      if ( pokemon.isGround() ) {
        if ( !fieldStatus.terrain.isPlain() ) return 100;
      }
    }

    if ( move.isName( 'ライジングボルト' ) ) {
      if ( target.isGround() && fieldStatus.terrain.isElectric() ) {
        return 140;
      }
    }

    if ( move.isName( 'かぜおこし' ) || move.isName( 'たつまき' ) ) {
      ;
    }

    if ( move.isName( 'アクロバット' ) ) {
      if ( pokemon.item === null ) {
        return 110;
      }
    }

    if ( move.isName( 'しぜんのめぐみ' ) ) {
      for ( const berry of berryTable ) {
        if ( pokemon.item.isName( berry.name ) === true ) {
          return berry.naturalGift.power;
        }
      }
    }

    if ( move.isName( 'なげつける' ) ) {
      ;
    }

    if ( move.isName( 'アイスボール' ) || move.isName( 'ころがる' ) ) {
      ;
    }

    if ( move.isName( 'エコーボイス' ) ) {
      ;
    }

    if ( move.isName( 'じだんだ' ) ) {
      ;
    }

    if ( move.isName( 'トリプルキック' ) ) {
      ;
    }

    if ( move.isName( 'トリプルアクセル' ) ) {
      ;
    }

    if ( move.isName( 'はきだす' ) ) {
      ;
    }

    if ( move.isName( 'りんしょう' ) ) {

    }

    if ( move.isName( 'れんぞくぎり' ) ) {
      ;
    }

    if ( move.isName( 'くさのちかい' ) || move.isName( 'ほのおのちかい' ) || move.isName( 'みずのちかい' ) ) {
      ;
    }

    if ( move.isName( 'エラがみ' ) || move.isName( 'でんげきくちばし' ) ) {
      ;
    }

    if ( move.isName( 'おいうち' ) ) {
      ;
    }

    if ( move.isName( 'しっぺがえし' ) ) {
      ;
    }

    if ( move.isName( 'ダメおし' ) ) {
      ;
    }

    if ( move.isName( 'ゆきなだれ' ) || move.isName( 'リベンジ' ) ) {
      ;
    }

    if ( move.isName( 'プレゼント' ) ) {
      const random: number = getRandom();
      if ( random >= 0  ) return 40;
      if ( random >= 40 ) return 80;
      if ( random >= 70 ) return 120;
      if ( random >= 88 ) return 0;
    }

    if ( move.isName( 'マグニチュード' ) ) {
      ;
    }

    if ( move.isName( 'みずしゅりけん' ) ) {
      ;
    }

    // 基礎威力が定義されていない場合、1を返す
    if ( move.power == null ) return 1;
    else return move.power;
  }

  const getCorrection = ( pokemon: Pokemon, target: Pokemon, basicPower: number ): number => {

    const move: SelectedMove = pokemon.move.selected;
    let correction: number = 4096;

    if ( main.isExistAbility( 'オーラブレイク' ) ) {
      if ( main.isExistAbility( 'フェアリーオーラ' ) && move.type === 'Fairy' ) {
        correction = Math.round( correction * 3072 / 4096 );
      }
      if ( main.isExistAbility( 'ダークオーラ' ) && move.type === 'Dark' ) {
        correction = Math.round( correction * 3072 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'とうそうしん' ) ) {
      if ( pokemon.gender !== target.gender && pokemon.gender !== 'genderless' && target.gender !== 'genderless' ) {
          correction = Math.round( correction * 3072 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'エレキスキン' ) || pokemon.ability.isName( 'スカイスキン' ) || pokemon.ability.isName( 'ノーマルスキン' ) || pokemon.ability.isName( 'フェアリースキン' ) || pokemon.ability.isName( 'フリーズスキン' ) ) {
      if ( pokemon.move.selected.skin.text === move.type ) {
        correction = Math.round( correction * 4915 / 4096 );
        pokemon.move.selected.skin.reset();
      }
    }

    if ( pokemon.ability.isName( 'すてみ' ) ) {
      if ( recklessMoveList.includes( move.name ) ) {
        correction = Math.round( correction * 4915 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'てつのこぶし' ) ) {
      if ( ironFistMoveList.includes( move.name ) ) {
        correction = Math.round( correction * 4915 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'とうそうしん' ) ) {
      if ( pokemon.gender === target.gender && pokemon.gender !== 'genderless' && target.gender !== 'genderless' ) {
          correction = Math.round( correction * 5120 / 4096 );
      }
    }

    for ( const poke of main.getPokemonInBattle() ) {
      if ( !move.isPhysical() ) continue;
      if ( poke.isMine() !== pokemon.isMine() ) continue;
      if ( poke.order.battle === pokemon.order.battle ) continue;
      if ( poke.ability.isName( 'バッテリー' ) ) {
        correction = Math.round( correction * 5325 / 4096 );
      }
    }

    for ( const poke of main.getPokemonInBattle() ) {
      if ( poke.isMine() !== pokemon.isMine() ) continue;
      if ( poke.order.battle === pokemon.order.battle ) continue;
      if ( poke.ability.isName( 'パワースポット' ) ) {
        correction = Math.round( correction * 5325 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'かたいツメ' ) ) {
      if ( pokemon.isContact() ) {
        correction = Math.round( correction * 5325 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'すなのちから' ) ) {
      if ( fieldStatus.weather.isSandy() && ( move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel' ) ) {
        correction = Math.round( correction * 5325 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'ちからずく' ) ) {
      let isTrue = false;
      for ( const move of additionalEffectTargetRank ) {
        if ( move.name === pokemon.move.selected.name ) {
          isTrue = true;
        }
      }
      for ( const move of additionalEffectMyRank ) {
        if ( move.name === pokemon.move.selected.name ) {
          isTrue = true;
        }
      }
      for ( const move of additionalEffectAilment ) {
        if ( move.name === pokemon.move.selected.name ) {
          isTrue = true;
        }
      }
      for ( const move of additionalEffectConfuse ) {
        if ( move.name === pokemon.move.selected.name ) {
          isTrue = true;
        }
      }
      for ( const move of additionalEffectFlinch ) {
        if ( move.name === pokemon.move.selected.name ) {
          isTrue = true;
        }
      }
      if ( additionalEffectOthers.includes( pokemon.move.selected.name ) ) {
        isTrue = true;
      }

      if ( isTrue === true ) {
        pokemon.stateChange.sheerForce.isTrue = true;
        correction = Math.round( correction * 5325 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'パンクロック' ) ) {
      if ( soundMoveList.includes( move.name ) ) {
        correction = Math.round( correction * 5325 / 4096 );
      }
    }

    if ( main.isExistAbility( 'ダークオーラ' ) ) {
      if ( move.type === 'Dark' && !isExistAbility( 'オーラブレイク' ) ) {
        correction = Math.round( correction * 5448 / 4096 );
      }
    }

    if ( main.isExistAbility( 'フェアリーオーラ' ) ) {
      if ( move.type === 'Fairy' && !isExistAbility( 'オーラブレイク' ) ) {
        correction = Math.round( correction * 5448 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'がんじょうあご' ) ) {
      if ( biteMoveList.includes( move.name ) ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'テクニシャン' ) ) {
      if ( basicPower !== null && basicPower <= 60 ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'どくぼうそう' ) ) {
      if ( pokemon.statusAilment.isPoisoned() && move.isPhysical() ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'ねつぼうそう' ) ) {
      if ( pokemon.statusAilment.isBurned() && move.isSpecial() ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    for ( const poke of main.getPokemonInBattle() ) {
      if ( poke.isMine() !== pokemon.isMine() ) continue;
      if ( poke.ability.isName( 'はがねのせいしん' ) ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'メガランチャー' ) ) {
      if ( waveMoveList.includes( move.name ) ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( target.ability.isName( 'たいねつ' ) ) {
      if ( move.type === 'Fire' ) {
        correction = Math.round( correction * 2048 / 4096 );
      }
    }

    if ( target.ability.isName( 'かんそうはだ' ) ) {
      if ( move.type === 'Fire' ) {
        correction = Math.round( correction * 5120 / 4096 );
      }
    }

    if ( pokemon.item.isName( 'ちからのハチマキ' ) ) {
      if ( move.isPhysical() ) {
        correction = Math.round( correction * 4505 / 4096 );
      }
    }

    if ( pokemon.item.isName( 'ものしりメガネ' ) ) {
      if ( move.isSpecial() ) {
        correction = Math.round( correction * 4505 / 4096 );
      }
    }

    for ( const plate of plateTable ) {
      if ( pokemon.item.isName( plate.name ) && move.type === plate.type ) {
        correction = Math.round( correction * 4915 / 4096 );
      }
    }

    for ( const incense of incenseTable ) {
      if ( pokemon.item.isName( incense.name ) && move.type === incense.type ) {
        correction = Math.round( correction * 4915 / 4096 );
      }
    }

    if ( pokemon.item.isName( 'こころのしずく' ) ) {
      if ( ( pokemon.name === 'ラティオス' || pokemon.name === 'ラティアス' ) && ( move.type === 'Dragon' || move.type === 'Psychic' ) && !pokemon.stateChange.transform.isTrue ) {
        correction = Math.round( correction * 4915 / 4096 );
      }
    }

    if ( pokemon.item.isName( 'こんごうだま' ) ) {
      if ( pokemon.name === 'ディアルガ' && ( move.type === 'Steel' || move.type === 'Dragon' ) && !pokemon.stateChange.transform.isTrue ) {
        correction = Math.round( correction * 4915 / 4096 );
      }
    }

    if ( pokemon.item.isName( 'しらたま' ) ) {
      if ( pokemon.name === 'パルキア' && ( move.type === 'Water' || move.type === 'Dragon' ) && !pokemon.stateChange.transform.isTrue ) {
        correction = Math.round( correction * 4915 / 4096 );
      }
    }

    if ( pokemon.item.isName( 'はっきんだま' ) ) {
      if ( ( pokemon.name === 'ギラティナ(オリジン)' || pokemon.name === 'ギラティナ(アナザー)' ) && ( move.type === 'Steel' || move.type === 'Dragon' ) && !pokemon.stateChange.transform.isTrue ) {
        correction = Math.round( correction * 4915 / 4096 );
      }
    }

    if ( pokemon.stateChange.gem.text === move.type ) {
      correction = Math.round( correction * 5325 / 4096 );
      pokemon.stateChange.gem.reset();
    }

    if ( move.isName( 'ソーラービーム' ) || move.isName( 'ソーラーブレード' ) ) {
      if ( fieldStatus.weather.isRainy( pokemon ) || fieldStatus.weather.isSandy() || fieldStatus.weather.isSnowy() ) {
        correction = Math.round( correction * 2048 / 4096 );
      }
    }

    if ( move.isName( 'Gのちから' ) ) {
      if ( fieldStatus.whole.gravity.isTrue ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( move.isName( 'はたきおとす' ) ) {
      if ( isReleasableItem( pokemon, target ) ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( move.isName( 'ミストバースト' ) ) {
      if ( fieldStatus.terrain.isMisty() && pokemon.isGround() ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( move.isName( 'ワイドフォース' ) ) {
      if ( fieldStatus.terrain.isPsychic() && pokemon.isGround() ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.stateChange.helpingHand.isTrue ) {
      for ( let i = 0; i < pokemon.stateChange.helpingHand.count; i++ ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.stateChange.charge.isTrue ) {
      if ( move.type === 'Electric' ) {
        correction = Math.round( correction * 8192 / 4096 );
        pokemon.stateChange.charge.reset();
      }
    }

    if ( move.isName( 'からげんき' ) ) {
      if ( pokemon.statusAilment.isPoisoned() || pokemon.statusAilment.isBurned() || pokemon.statusAilment.isParalysis() ) {
        correction = Math.round( correction * 8192 / 4096 );
      }
    }

    if ( move.isName( 'しおみず' ) ) {
      if ( target.status.hp.value.isLessEqual( 2 ) ) {
        correction = Math.round( correction * 8192 / 4096 );
      }
    }

    if ( move.isName( 'ベノムショック' ) ) {
      if ( pokemon.statusAilment.isPoisoned() ) {
        correction = Math.round( correction * 8192 / 4096 );
      }
    }

    if ( fieldStatus.terrain.isGrassy() && target.isGround() ) {
      if ( move.isName( 'じしん' ) || move.isName( 'じならし' ) || move.isName( 'マグニチュード' ) ) {
        correction = Math.round( correction * 2048 / 4096 );
      }
    }

    if ( fieldStatus.terrain.isMisty() && target.isGround() ) {
      if ( move.type === 'Dragon' ) {
        correction = Math.round( correction * 2048 / 4096 );
      }
    }

    if ( fieldStatus.terrain.isElectric() ) {
      if ( pokemon.isGround() && move.type === 'Electric' ) {
        correction = Math.round( correction * 5325 / 4096 );
      }
    }

    if ( fieldStatus.terrain.isGrassy() ) {
      if ( pokemon.isGround() && move.type === 'Grass' ) {
        correction = Math.round( correction * 5325 / 4096 );
      }
    }

    if ( fieldStatus.terrain.isPsychic() ) {
      if ( pokemon.isGround() && move.type === 'Psychic' ) {
        correction = Math.round( correction * 5325 / 4096 );
      }
    }

    if ( fieldStatus.whole.mudSport.isTrue === true ) {
      if ( move.type === 'Electric' ) {
        correction = Math.round( correction * 1352 / 4096 );
      }
    }

    if ( fieldStatus.whole.waterSport.isTrue === true ) {
      if ( move.type === 'Fire' ) {
        correction = Math.round( correction * 1352 / 4096 );
      }
    }

    return correction;
  }


  // 威力 = 基礎威力 * 威力補正 / 4096
  const basicPower: number = getBasicPawer( pokemon, target );
  const correction: number = getCorrection( pokemon, target, basicPower );
  const result: number = fiveRoundEntry( basicPower * correction / 4096 );

  return Math.max( result, 1 );
}

// 急所判定
function getStatus( pokemon: Pokemon, target: Pokemon, attack: Attack ): number {

  const getCritical = ( pokemon: Pokemon ): boolean => {
    return false;
  }

  const getFinalAttack = ( pokemon: Pokemon, target: Pokemon ): number => {

    let attack: number = ( pokemon.move.selected.isPhysical() )? pokemon.status.atk.value : pokemon.status.spA.value;

    // はりきり
    if ( pokemon.ability.isName( 'はりきり' ) ) {
      if ( pokemon.move.selected.isPhysical() ) {
        attack = Math.floor( attack * 6144 / 4096 );
      }
    }

    // 攻撃補正
    let correction = 4096;

    if ( pokemon.ability.isName( 'スロースタート' ) ) {
      if ( pokemon.stateChange.slowStart.isTrue && pokemon.move.selected.isPhysical() ) {
        correction = Math.round( correction * 2048 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'よわき' ) ) {
      if ( pokemon.status.hp.value.isLessEqual( 2 ) ) {
        correction = Math.round( correction * 2048 / 4096 );
      }
    }

    if ( main.isExistAbility( 'わざわいのうつわ' ) && !pokemon.ability.isName( 'わざわいのうつわ' ) ) {
      if ( pokemon.move.selected.isSpecial() ) {
        correction = Math.round( correction * 3072 / 4096 );
      }
    }

    if ( main.isExistAbility( 'わざわいのおふだ' ) && !pokemon.ability.isName( 'わざわいのおふだ' ) ) {
      if ( pokemon.move.selected.isPhysical() ) {
        correction = Math.round( correction * 3072 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'クォークチャージ' ) ) {
      const parameter: string = pokemon.stateChange.quarkDrive.text;
      if ( parameter === 'attack' && pokemon.move.selected.isPhysical() ) {
        correction = Math.round( correction * 5325 / 4096 );
      }
      if ( parameter === 'specialAttack' && pokemon.move.selected.isSpecial() ) {
        correction = Math.round( correction * 5325 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'こだいかっせい' ) ) {
      const parameter: string = pokemon.stateChange.protosynthesis.text;
      if ( parameter === 'attack' && pokemon.move.selected.isPhysical() ) {
        correction = Math.round( correction * 5325 / 4096 );
      }
      if ( parameter === 'specialAttack' && pokemon.move.selected.isSpecial() ) {
        correction = Math.round( correction * 5325 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'ハドロンエンジン' ) ) {
      if ( fieldStatus.terrain.isElectric() && pokemon.move.selected.isSpecial() ) {
        correction = Math.round( correction * 5461 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'ハドロンエンジン' ) ) {
      if ( fieldStatus.terrain.isElectric() && pokemon.move.selected.isSpecial() ) {
        correction = Math.round( correction * 5461 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'ひひいろのこどう' ) ) {
      if ( fieldStatus.weather.isSunny( pokemon ) && pokemon.move.selected.isPhysical() ) {
        correction = Math.round( correction * 5461 / 4096 );
      }
    }

    for ( const _pokemon of main.getPokemonInSide( pokemon.isMine() ) ) {
      if ( _pokemon.name !== 'チェリム(ポジ)' ) continue;
      if ( !fieldStatus.weather.isSunny( _pokemon ) ) continue;
      if ( !_pokemon.ability.isName( 'フラワーギフト' ) ) continue;
      if ( !pokemon.move.selected.isPhysical() ) continue;
      correction = Math.round( correction * 6144 / 4096 );
    }

    if ( pokemon.ability.isName( 'こんじょう' ) ) {
      if ( !pokemon.statusAilment.isHealth() && pokemon.move.selected.isPhysical() ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'しんりょく' ) ) {
      if ( pokemon.status.hp.value.isLessThan( 3 ) && pokemon.move.selected.type === 'Grass' ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'もうか' ) ) {
      if ( pokemon.status.hp.value.isLessThan( 3 ) && pokemon.move.selected.type === 'Fire' ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'げきりゅう' ) ) {
      if ( pokemon.status.hp.value.isLessThan( 3 ) && pokemon.move.selected.type === 'Water' ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'むしのしらせ' ) ) {
      if ( pokemon.status.hp.value.isLessThan( 3 ) && pokemon.move.selected.type === 'Bug' ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'もらいび' ) ) {
      if ( pokemon.stateChange.flashFire.isTrue === true && pokemon.move.selected.type === 'Fire' ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'サンパワー' ) ) {
      if ( fieldStatus.weather.isSunny( pokemon ) && pokemon.move.selected.isSpecial() ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'プラス' ) || pokemon.ability.isName( 'マイナス' ) ) {
      for ( const _pokemon of main.getPokemonInSide( pokemon.isMine() ) ) {
        if ( isSame( pokemon, _pokemon ) ) continue;
        if ( !_pokemon.ability.isName( 'プラス' ) && !_pokemon.ability.isName( 'マイナス' ) ) continue;
        if ( !pokemon.move.selected.isSpecial() ) continue;
        correction = Math.round( correction * 6144 / 4096 );
        break;
      }
    }

    if ( pokemon.ability.isName( 'いわはこび' ) ) {
      if ( pokemon.move.selected.type === 'Rock' ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'はがねつかい' ) ) {
      if ( pokemon.move.selected.type === 'Steel' ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'ごりむちゅう' ) ) {
      if ( pokemon.move.selected.isPhysical() ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'トランジスタ' ) ) {
      if ( pokemon.move.selected.type === 'Electric' ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'りゅうのあぎと' ) ) {
      if ( pokemon.move.selected.type === 'Dragon' ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'ちからもち' ) || pokemon.ability.isName( 'ヨガパワー' ) ) {
      if ( pokemon.move.selected.isPhysical() ) {
        correction = Math.round( correction * 8192 / 4096 );
      }
    }

    if ( pokemon.ability.isName( 'すいほう' ) ) {
      if ( pokemon.move.selected.type === 'Water' ) {
        correction = Math.round( correction * 8192 / 4096 );
      }
    }

    if ( target.ability.isName( 'あついしぼう' ) ) {
      if ( pokemon.move.selected.type === 'Fire' || pokemon.move.selected.type === 'Ice' ) {
        correction = Math.round( correction * 2048 / 4096 );
      }
    }

    if ( target.ability.isName( 'すいほう' ) ) {
      if ( pokemon.move.selected.type === 'Fire' ) {
        correction = Math.round( correction * 2048 / 4096 );
      }
    }

    if ( target.ability.isName( 'きよめのしお' ) ) {
      if ( pokemon.move.selected.type === 'Ghost' ) {
        correction = Math.round( correction * 2048 / 4096 );
      }
    }

    if ( pokemon.item.isName( 'こだわりハチマキ' ) ) {
      if ( pokemon.move.selected.isPhysical() ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.item.isName( 'こだわりメガネ' ) ) {
      if ( pokemon.move.selected.isSpecial() ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( pokemon.item.isName( 'ふといホネ' ) ) {
      if ( ( pokemon.name === 'カラカラ' || pokemon.name.includes( 'ガラガラ' ) ) && pokemon.move.selected.isPhysical() ) {
        correction = Math.round( correction * 8192 / 4096 );
      }
    }

    if ( pokemon.item.isName( 'しんかいのキバ' ) ) {
      if ( pokemon.name === 'パールル' && pokemon.move.selected.isSpecial() ) {
        correction = Math.round( correction * 8192 / 4096 );
      }
    }

    if ( pokemon.item.isName( 'でんきだま' ) ) {
      if ( pokemon.name === 'ピカチュウ' ) {
        correction = Math.round( correction * 8192 / 4096 );
      }
    }

    // 最終攻撃
    attack = fiveRoundEntry( attack * correction / 4096 );
    return Math.max( attack, 1 );

  }

  const getFinalDefense = ( pokemon: Pokemon, target: Pokemon ): number => {

    let defense: number = ( pokemon.move.selected.isPhysical() )? target.status.def.value : target.status.spD.value;

    // すなあらし
    if ( fieldStatus.weather.isSandy() ) {
      if ( target.type.has( 'Rock' ) && pokemon.move.selected.isSpecial() ) {
        defense = Math.floor( defense * 6144 / 4096 );
      }
    }

    // ゆき
    if ( fieldStatus.weather.isSnowy() ) {
      if ( target.type.has( 'Ice' ) && pokemon.move.selected.isPhysical() ) {
        defense = Math.floor( defense * 6144 / 4096 );
      }
    }

    // 攻撃補正
    let correction = 4096;

    if ( isExistAbility( 'わざわいのたま' ) && !target.ability.isName( 'わざわいのたま' ) ) {
      if ( pokemon.move.selected.isSpecial() ) {
        correction = Math.round( correction * 3072 / 4096 );
      }
    }

    if ( isExistAbility( 'わざわいのつるぎ' ) && !target.ability.isName( 'わざわいのつるぎ' ) ) {
      if ( pokemon.move.selected.isPhysical() ) {
        correction = Math.round( correction * 3072 / 4096 );
      }
    }

    if ( target.ability.isName( 'クォークチャージ' ) ) {
      const parameter: string = target.stateChange.quarkDrive.text;
      if ( parameter === 'defense' && pokemon.move.selected.isPhysical() ) {
        correction = Math.round( correction * 5325 / 4096 );
      }
      if ( parameter === 'specialDefense' && pokemon.move.selected.isSpecial() ) {
        correction = Math.round( correction * 5325 / 4096 );
      }
    }

    if ( target.ability.isName( 'こだいかっせい' ) ) {
      const parameter: string = target.stateChange.protosynthesis.text;
      if ( parameter === 'defense' && pokemon.move.selected.isPhysical() ) {
        correction = Math.round( correction * 5325 / 4096 );
      }
      if ( parameter === 'specialDefense' && pokemon.move.selected.isSpecial() ) {
        correction = Math.round( correction * 5325 / 4096 );
      }
    }

    for ( const _pokemon of main.getPokemonInSide( target.isMine() ) ) {
      if ( !_pokemon.isName( 'チェリム(ポジ)' ) ) continue;
      if ( !fieldStatus.weather.isSunny( _pokemon ) ) continue;
      if ( !_pokemon.ability.isName( 'フラワーギフト' ) ) continue;
      if ( !pokemon.move.selected.isSpecial() ) continue;
      correction = Math.round( correction * 6144 / 4096 );
    }

    if ( target.ability.isName( 'ふしぎなうろこ' ) ) {
      if ( !target.statusAilment.isHealth() && pokemon.move.selected.isPhysical() ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( target.ability.isName( 'くさのけがわ' ) ) {
      if ( fieldStatus.terrain.isGrassy() && pokemon.move.selected.isPhysical() ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( target.ability.isName( 'ファーコート' ) ) {
      if ( pokemon.move.selected.isPhysical() ) {
        correction = Math.round( correction * 8192 / 4096 );
      }
    }

    if ( target.item.isName( 'とつげきチョッキ' ) ) {
      if ( pokemon.move.selected.isSpecial() ) {
        correction = Math.round( correction * 6144 / 4096 );
      }
    }

    if ( target.item.isName( 'しんかいのウロコ' ) ) {
      if ( target.name === 'パールル' && pokemon.move.selected.isSpecial() ) {
        correction = Math.round( correction * 8192 / 4096 );
      }
    }

    if ( target.item.isName( 'メタルパウダー' ) ) {
      if ( target.name === 'メタモン' && pokemon.move.selected.isPhysical() ) {
        correction = Math.round( correction * 8192 / 4096 );
      }
    }

    // 最終防御
    defense = fiveRoundEntry( defense * correction / 4096 );
    return Math.max( defense, 1 );
  }


  // 急所判定
  const critical: boolean = getCritical( pokemon );
  attack.critical = critical;

  // 実数値・ランク
  pokemon.status.calcRankCorrValue( critical );
  target.status.calcRankCorrValue( critical );

  const finalAttack: number = getFinalAttack( pokemon, target );
  const finalDefense: number = getFinalDefense( pokemon, target );

  return finalAttack / finalDefense;
}



function getDamage( pokemon: Pokemon, target: Pokemon, power: number, status: number, attack: Attack ): number {

  // 最終ダメージ
  let damage = Math.floor( Math.floor( Math.floor( pokemon.level * 2 / 5 + 2 ) * power * status ) / 50 + 2 );

  // 範囲補正
  if ( pokemon.stateChange.rangeCorr.isTrue ) {
    damage = fiveRoundEntry( damage * 3072 / 4096 );
  }

  // 天気補正
  if ( fieldStatus.weather.isRainy( target ) ) {
    if ( pokemon.move.selected.type === 'Water' ) {
      damage = fiveRoundEntry( damage * 1.5 );
    }
    if ( pokemon.move.selected.type === 'Fire' ) {
      damage = fiveRoundEntry( damage * 0.5 );
    }
  }
  if ( fieldStatus.weather.isSunny( target ) ) {
    if ( pokemon.move.selected.type === 'Water' ) {
      damage = fiveRoundEntry( damage * 0.5 );
    }
    if ( pokemon.move.selected.type === 'Fire' ) {
      damage = fiveRoundEntry( damage * 1.5 );
    }
  }

  // 急所補正
  if ( attack.critical ) {
    damage = fiveRoundEntry( damage * 1.5 );
  }

  // 乱数補正
  const randomCorrection = Math.floor( getRandom() * 16 ) + 8500;
  damage = Math.floor( damage * randomCorrection / 10000 );

  // タイプ一致補正
  if ( pokemon.type.has( pokemon.move.selected.type ) ) {
    if ( pokemon.ability.isName( 'てきおうりょく' ) ) {
      damage = fiveRoundEntry( damage * 2.0 );
    } else {
      damage = fiveRoundEntry( damage * 1.5 );
    }
  }

  // 相性補正
  damage = Math.floor( damage * attack.effective );

  // やけど補正
  if ( pokemon.statusAilment.isBurned() ) {
    if ( !pokemon.move.selected.isName( 'からげんき' ) && pokemon.move.selected.isPhysical() ) {
      damage = fiveRoundEntry( damage * 0.5 );
    }
  }

  // M補正
  let corrM: number = 1.0;

  // 壁補正
  if ( pokemon.ability.isName( 'すりぬけ' ) && pokemon.isMine() !== target.isMine() ) {
    ;
  } else {
    let rate: number = 0.5;
    if ( fieldStatus.battleStyle === 2 || fieldStatus.battleStyle === 3 ) {
      rate = 2732 / 4096;
    }
    if ( fieldStatus.getSide( target.isMine() ).auroraVeil.isTrue ) {
      corrM = Math.round( corrM * rate );
    } else if ( fieldStatus.getSide( target.isMine() ).reflect.isTrue && pokemon.move.selected.isPhysical() ) {
      corrM = Math.round( corrM * rate );
    } else if ( fieldStatus.getSide( target.isMine() ).lightScreen.isTrue && pokemon.move.selected.isSpecial() ) {
      corrM = Math.round( corrM * rate );
    }
  }

  // ブレインフォース補正
  if ( pokemon.ability.isName( 'ブレインフォース' ) ) {
    if ( attack.effective > 1 ) {
      corrM = Math.round( corrM * 1.25 );
    }
  }

  // スナイパー補正
  if ( pokemon.ability.isName( 'スナイパー' ) ) {
    if ( attack.critical ) {
      corrM = Math.round( corrM * 1.5 );
    }
  }

  // いろめがね補正
  if ( pokemon.ability.isName( 'いろめがね' ) ) {
    if ( attack.effective < 1 ) {
      corrM = Math.round( corrM * 2 );
    }
  }

  // もふもふほのお補正
  if ( target.ability.isName( 'もふもふ' ) ) {
    if ( pokemon.move.selected.type === 'Fire' ) {
      corrM = Math.round( corrM * 2 );
    }
  }

  // Mhalf
  if ( target.ability.isName( 'こおりのりんぷん' ) ) {
    if ( pokemon.move.selected.isSpecial() ) {
      corrM = Math.round( corrM * 0.5 );
    }
  }
  if ( target.ability.isName( 'パンクロック' ) ) {
    if ( soundMoveList.includes( pokemon.move.selected.name ) ) {
      corrM = Math.round( corrM * 0.5 );
    }
  }
  if ( target.ability.isName( 'ファントムガード' ) || target.ability.isName( 'マルチスケイル' ) ) {
    if ( target.status.hp.value.isMax() ) {
      corrM = Math.round( corrM * 0.5 );
    }
  }
  if ( target.ability.isName( 'もふもふ' ) ) {
    if ( pokemon.isContact() ) {
      corrM = Math.round( corrM * 0.5 );
    }
  }

  // Mfikter
  if ( target.ability.isName( 'ハードロック' ) || target.ability.isName( 'フィルター' ) || target.ability.isName( 'プリズムアーマー' ) ) {
    if ( attack.effective > 1 ) {
      corrM = Math.round( corrM * 0.75 );
    }
  }

  // フレンドガード補正
  for ( const _pokemon of main.getPokemonInSide( target.isMine() ) ) {
    if ( isSame( target, _pokemon ) ) continue;
    if ( _pokemon.ability.isName( 'フレンドガード' ) ) {
      corrM = Math.round( corrM * 0.75 );
    }
  }

  // たつじんのおび補正
  if ( pokemon.item.isName( 'たつじんのおび' ) ) {
    if ( attack.effective > 1 ) {
      corrM = Math.round( corrM * 4915 / 4096 );
    }
  }

  // いのちのたま補正
  if ( pokemon.item.isName( 'いのちのたま' ) ) {
    corrM = Math.round( corrM * 5324 / 4096 );
  }

  // 半減の実補正
  let isHalfBerry: boolean = false;
  if ( target.item.isName( 'ホズのみ' ) && pokemon.move.selected.type === 'Normal' ) {
    isHalfBerry = true;
  }
  for ( const berry of berryTable ) {
    if ( target.item.isName( berry.name ) && berry.half === pokemon.move.selected.type && attack.effective > 1 ) {
      isHalfBerry = true;
    }
  }
  if ( isHalfBerry ) {
    const ripen: number = ( target.ability.isName( 'じゅくせい' ) )? 1 / 2 : 1;
    corrM = Math.round( corrM * 2048 * ripen / 4096 );
    //eatBerry( target, target.name );
  }

  // Mtwice
  if ( target.stateChange.dig.isTrue ) {
    if ( pokemon.move.selected.isName( 'じしん' ) || pokemon.move.selected.isName( 'マグニチュード' ) ) {
      corrM = Math.round( corrM *  2 );
    }
  }
  if ( target.stateChange.dive.isTrue ) {
    if ( pokemon.move.selected.isName( 'なみのり' ) ) {
      corrM = Math.round( corrM * 2 );
    }
  }
  if ( target.stateChange.minimize.isTrue ) {
    if ( stompMoveList.includes( pokemon.move.selected.name ) ) {
      corrM = Math.round( corrM * 2 );
    }
  }
  if ( target.stateChange.dynamax.isTrue ) {
    if ( pokemon.move.selected.isName( 'きょじゅうざん' ) || pokemon.move.selected.isName( 'きょじゅうだん' ) || pokemon.move.selected.isName( 'ダイマックスほう' ) ) {
      corrM = Math.round( corrM * 2 );
    }
  }

  damage = fiveRoundEntry( damage * corrM );


  // 最終ダメージ
  return damage;
}
