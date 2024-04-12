function statusMoveEffect( pokemon: Pokemon ): void {
  switch ( pokemon.move.selected.getMaster().target ) {
    case 'users-field': // 味方の場
      statusMoveToUsersField( pokemon );
      break;

    case "opponents-field": // 相手の場
      statusMoveToOpponentsField( pokemon );
      break;

    case "entire-field": // 全体の場
      statusMoveToEntireField( pokemon );
      break;

    case "user-and-allies": // 味方全体
      statusMoveToUserAndAllies( pokemon );
      break;

    case "all-opponents": // 相手全体
      statusMoveToAllOpponents( pokemon );
      break;

    case "ally": // 味方1体
      statusMoveToAlly( pokemon );
      break;

    case "all-pokemon": // 全体
      statusMoveToAllPokemon( pokemon );
      break;

    case "specific-move": // 技「のろい」
      statusMoveToSpecificMove( pokemon );
      break;

    case "selected-pokemon-me-first": // 技「さきどり」
      statusMoveToSelectedPokemonMeFirst( pokemon );
      break;

    case "all-other-pokemon": // 自分以外
      statusMoveToAllOtherPokemon( pokemon );
      break;

    case "selected-pokemon": // 1体選択
      statusMoveToSelectedPokemon( pokemon );
      break;


    case "user-or-ally":
    case "user":
    case "random-opponent":



    case "all-allies":



    case "fainting-pokemon":
  }
}

function statusMoveToUsersField( pokemon: Pokemon ): void {

  const usersField: SideField = main.field.getSide( pokemon.isMine() );
  const isLightClay: boolean = pokemon.item.isName( 'ひかりのねんど' );

  switch ( pokemon.move.selected.name ) {
    case 'Aurora Veil': // 技「オーロラベール」
      usersField.auroraVeil.onActivate( isLightClay );
      break;

    case 'Light Screen': // 技「ひかりのかべ」
      usersField.lightScreen.onActivate( isLightClay );
      break;

    case 'Reflect': // 技「リフレクター」
      usersField.reflect.onActivate( isLightClay );
      break;

    case 'Tailwind': // 技「おいかぜ」
      usersField.tailwind.onActivate();
      break;

    case 'Lucky Chant': // 技「おまじない」
      usersField.luckyChant.onActivate();
      break;

    case 'Mist': // 技「しろいきり」
      usersField.mist.onActivate();
      break;

    case 'Safeguard': // 技「しんぴのまもり」
      usersField.safeguard.onActivate();
      break;

    case 'Mat Block': // 技「たたみがえし」
      usersField.matBlock.onActivate( pokemon );
      break;

    case 'Crafty Shield': // 技「トリックガード」
      usersField.craftyShield.onActivate();
      break;

    case 'Quick Guard': // 技「ファストガード」
      usersField.quickGuard.onActivate();
      break;

    case 'Wide Guard': // 技「ワイドガード」
      usersField.wideGuard.onActivate();
      break;

    default:
      break;
  }
}

function statusMoveToOpponentsField( pokemon: Pokemon ): void {

  const opponentsField: SideField = main.field.getSide( !pokemon.isMine() );

  switch ( pokemon.move.selected.name ) {
    case 'Stealth Rock': // 技「ステルスロック」
      opponentsField.stealthRock.onActivate();
      break;

    case 'Toxic Spikes': // 技「どくびし」
      opponentsField.toxicSpikes.onActivate();
      break;

    case 'Sticky Web': // 技「ねばねばネット」
      opponentsField.stickyWeb.onActivate();
      break;

    case 'Spikes': // 技「まきびし」
      opponentsField.spikes.onActivate();
      break;

    default:
      break;
  }
}

function statusMoveToEntireField( pokemon: Pokemon ): void {

  switch ( pokemon.move.selected.name ) {
    case 'Sunny Day': // 技「にほんばれ」
      main.field.weather.getSunny( pokemon );
      break;

    case 'Rain Dance': // 技「あまごい」
      main.field.weather.getRainy( pokemon );
      break;

    case 'Sandstorm': // 技「すなあらし」
      main.field.weather.getSunny( pokemon );
      break;

    case 'Hail': // 技「あられ」
      main.field.weather.getSnowy( pokemon );
      break;

    case 'Snowscape': // 技「ゆきふらし」
      main.field.weather.getSnowy( pokemon );
      break;

    case 'Electric Terrain': // 技「エレキフィールド」
      main.field.terrain.getElectric( pokemon );
      break;

    case 'Grassy Terrain': // 技「グラスフィールド」
      main.field.terrain.getGrassy( pokemon );
      break;

    case 'Misty Terrain': // 技「ミストフィールド」
      main.field.terrain.getMisty( pokemon );
      break;

    case 'Psychic Terrain': // 技「サイコフィールド」
      main.field.terrain.getPsychic( pokemon );
      break;

    case 'Trick Room': // 技「トリックルーム」
      main.field.whole.trickRoom.onActivate( pokemon );
      break;

    case 'Magic Room': // 技「マジックルーム」
      main.field.whole.magicRoom.onActivate();
      break;

    case 'Wonder Room': // 技「ワンダールーム」
      main.field.whole.wonderRoom.onActivate();
      break;

    case 'Mud Sport': // 技「どろあそび」
      main.field.whole.mudSport.onActivate();
      break;

    case 'Water Sport': // 技「みずあそび」
      main.field.whole.waterSport.onActivate();
      break;

    case 'Fairy Lock': // 技「フェアリーロック」
      main.field.whole.fairyLock.onActivate();
      break;

    case 'Ion Deluge': // 技「プラズマシャワー」
      main.field.whole.ionDeluge.onActivate();
      break;

    case 'Haze': // 技「くろいきり」
      main.getPokemonInBattle().map( poke => poke.status.resetRank() );
      writeLog( `全ての ステータスが 元に 戻った!` );
      break;

    case 'Court Change': // 技「コートチェンジ」
      break;

    case 'Gravity': // 技「じゅうりょく」
      main.field.whole.gravity.onActivate();
      break;

    default:
      break;
  }
}

function statusMoveToUserAndAllies( pokemon: Pokemon ): void {

  const master: MoveData = pokemon.move.selected.getMaster();

  switch ( pokemon.move.selected.name ) {
    case 'Heal Bell': // 技「いやしのすず」
      break;

    case 'Aromatherapy': // 技「アロマセラピー」
      break;

    case 'Howl': // 技「とおぼえ」
      break;

    case 'Magnetic Flux': // 技「じばそうさ」
      break;

    case 'Gear Up': // 技「アシストギア」
      pokemon.attack.getTargetToPokemon().map( p => {
        const poke: Pokemon = main.getPokemonByBattle( p );
        master.stat.changes.map( stat => poke.changeRank( stat.stat, stat.change ));
      });
      break;

    case 'Life Dew': // 技「いのちのしずく」
      break;

    case 'Coaching': // 技「コーチング」
      break;

    case 'Jungle Healing': // 技「ジャングルヒール」
      break;

    default:
      break;
  }
}

function statusMoveToAllOpponents( pokemon: Pokemon ): void {

  const master: MoveData = pokemon.move.selected.getMaster();

  if ( master.category === 'net-good-stats' ) { // ランク変化
    pokemon.attack.getTargetToPokemon().map( tgt => {
      const target: Pokemon = main.getPokemonByBattle( tgt );
      master.stat.changes.map( stat => target.changeRank( stat.stat, stat.change ));
    });
  }

  if ( master.category === 'ailment' ) { // 状態異常付与
    pokemon.attack.getTargetToPokemon().map( tgt => {
      const target: Pokemon = main.getPokemonByBattle( tgt );
      target.getAilmentByStatusMove( master.ailment.name );
    });
  }

  if ( pokemon.move.selected.name === 'Heal Block' ) { // 技「かいふくふうじ」
    pokemon.attack.getTargetToPokemon().map( tgt => {
      const target: Pokemon = main.getPokemonByBattle( tgt );
      target.stateChange.healBlock.onActivate( target );
    });
  }
}

function statusMoveToAlly( pokemon: Pokemon ): void {

  const master: MoveData = pokemon.move.selected.getMaster();
  const attack: Attack = pokemon.attack.getTargetToPokemon()[0];
  const target: Pokemon = main.getPokemonByBattle( attack );

  switch ( pokemon.move.selected.name ) {
    case 'Helping Hand': // 技「てだすけ」
      target.stateChange.helpingHand.onActivate( pokemon, target );
      break;

    case 'Aromatic Mist': // 技「アロマミスト」
      master.stat.changes.map( stat => target.changeRank( stat.stat, stat.change ));
      break;

    case 'Hold Hands': // 技「てをつなぐ」
      break;

    default:
      break;
  }
}

function statusMoveToAllPokemon( pokemon: Pokemon ): void {

  const master: MoveData = pokemon.move.selected.getMaster();

  switch ( pokemon.move.selected.name ) {
    case 'Perish Song': // 技「ほろびのうた」
      pokemon.attack.getTargetToPokemon().map( tgt => {
        const target: Pokemon = main.getPokemonByBattle( tgt );
        target.stateChange.perishSong.onActivate();
      });
      writeLog( `ほろびのうたを 聴いたポケモンは 3ターン後に 滅びてしまう!` );
      break;

    case 'Rototiller': // 技「たがやす」
      pokemon.attack.getTargetToPokemon().map( tgt => {
        const target: Pokemon = main.getPokemonByBattle( tgt );
        master.stat.changes.map( stat => target.changeRank( stat.stat, stat.change ));
      });
      break;

    case 'Flower Shield': // 技「フラワーガード」
      pokemon.attack.getTargetToPokemon().map( tgt => {
        const target: Pokemon = main.getPokemonByBattle( tgt );
        master.stat.changes.map( stat => target.changeRank( stat.stat, stat.change ));
      });
      break;

    case 'Teatime': // 技「おちゃかい」
      break;

    default:
      break;
  }
}

function statusMoveToSpecificMove( pokemon: Pokemon ): void {

  const attack: Attack = pokemon.attack.getTargetToPokemon()[0];
  const target: Pokemon = main.getPokemonByBattle( attack );

  if ( pokemon.move.selected.name === 'Curse' ) { // 技「のろい」
    if ( pokemon.type.has( 'Ghost' ) ) {
      target.stateChange.curse.onActivate( pokemon, target );
    } else {
      target.changeRank( 'atk', 1 );
      target.changeRank( 'def', 1 );
      target.changeRank( 'spe', 1 );
    }
  }
}

function statusMoveToSelectedPokemonMeFirst( pokemon: Pokemon ): void {

  if ( pokemon.move.selected.name === 'Me First' ) { // 技「さきどり」

  }
}

function statusMoveToAllOtherPokemon( pokemon: Pokemon ): void {

  const master: MoveData = pokemon.move.selected.getMaster();

  if ( pokemon.move.selected.name === 'Teeter Dance' ) { // 技「フラフラダンス」
    pokemon.attack.getTargetToPokemon().map( tgt => {
      const target: Pokemon = main.getPokemonByBattle( tgt );
      target.getAilmentByStatusMove( master.ailment.name );
    });
  }

  if ( pokemon.move.selected.name === 'Corrosive Gas' ) { // 技「ふしょくガス」

  }
}

function statusMoveToSelectedPokemon( pokemon: Pokemon ): void {

  const master: MoveData = pokemon.move.selected.getMaster();
  const attack: Attack = pokemon.attack.getTargetToPokemon()[0];
  const target: Pokemon = main.getPokemonByBattle( attack );

  const unique = (): void => {
    switch ( pokemon.move.selected.name ) {
      case 'Disable': // 技「かなしばり」
        target.stateChange.disable.onActivate( target );
        break;

      case 'Mimic': // 技「ものまね」
        break;

      case 'Mirror Move': // 技「オウムがえし」
        break;

      case 'Transform': // 技「へんしん」
        break;

      case 'Sketch': // 技「スケッチ」
        break;

      case 'Spider Web': // 技「クモのす」
      case 'Mean Look': // 技「くろいまなざし」
      case 'Block': // 技「とおせんぼう」
        target.stateChange.cannotEscape.onActivate( pokemon, target );
        break;

      case 'Mind Reader': // 技「こころのめ」
      case 'Lock-On': // 技「ロックオン」
        pokemon.stateChange.lockOn.onActivate( pokemon, target );
        break;

      case 'Conversion 2': // 技「テクスチャー２」
        break;

      case 'Spite': // 技「うらみ」
        break;

      case 'Pain Split': // 技「いたみわけ」
        const base: number = Math.floor( ( pokemon.getOrgHP() + target.getOrgHP() ) / 2 );
        pokemon.status.hp.value.add( base - pokemon.getOrgHP() );
        target.status.hp.value.add( base - target.getOrgHP() );
        writeLog( `おたがいの体力を 分かちあった!` );
        break;

      case 'Encore': // 技「アンコール」
        target.stateChange.encore.onActivate( target );
        break;

      case 'Psych Up': // 技「じこあんじ」
        pokemon.status.copyRank( target.status );
        // きゅうしょアップ、キョダイシンゲキ、とぎすます　未実装
        writeLog( `${pokemon.getArticle()}は ${target.getArticle()}の 能力変化を コピーした!` );
        break;

      case 'Memento': // 技「おきみやげ」
        break;

      case 'Nature Power': // 技「しぜんのちから」
        break;

      case 'Taunt': // 技「ちょうはつ」
        target.stateChange.taunt.onActivate( target );
        break;

      case 'Trick': // 技「トリック」
        [ pokemon.item.name, target.item.name ] = [ target.item.name, pokemon.item.name ];
        writeLog( `${pokemon.getArticle()}は おたがいの 道具を入れ替えた!` );
        writeLog( `${target.getArticle()}は ${target.item.translate()}を 手に入れた!` );
        writeLog( `${pokemon.getArticle()}は ${pokemon.item.translate()}を 手に入れた!` );
        break;

      case 'Role Play': // 技「なりきり」
        pokemon.ability.name = target.ability.name;
        writeLog( `${pokemon.getArticle()}は ${target.getArticle()}の ${target.ability.translate()}を コピーした!` );
        pokemon.onActivateWhenLanding();
        break;

      case 'Skill Swap': // 技「スキルスワップ」
        [ pokemon.ability.name, target.ability.name ] = [ target.ability.name, pokemon.ability.name ];
        writeLog( `${pokemon.getArticle()}は おたがいの 特性を 入れ替えた!` );
        pokemon.onActivateWhenLanding();
        target.onActivateWhenLanding();
        break;

      case 'Psycho Shift': // 技「サイコシフト」
        target.statusAilment.copyAilment( pokemon.statusAilment );
        pokemon.statusAilment.getHealth();
        break;

      case 'Gastro Acid': // 技「いえき」
        target.stateChange.noAbility.onActivate( target );
        break;

      case 'Power Swap': // 技「パワースワップ」
        [ pokemon.status.atk.rank.value, target.status.atk.rank.value ] = [ pokemon.status.atk.rank.value, target.status.atk.rank.value ];
        [ pokemon.status.spA.rank.value, target.status.spA.rank.value ] = [ pokemon.status.spA.rank.value, target.status.spA.rank.value ];
        writeLog( `${pokemon.getArticle()}は 相手と自分の 攻撃と 特攻の 能力変化を 入れ替えた!` );
        break;

      case 'Guard Swap': // 技「ガードスワップ」
        [ pokemon.status.def.rank.value, target.status.def.rank.value ] = [ pokemon.status.def.rank.value, target.status.def.rank.value ];
        [ pokemon.status.spD.rank.value, target.status.spD.rank.value ] = [ pokemon.status.spD.rank.value, target.status.spD.rank.value ];
        writeLog( `${pokemon.getArticle()}は 相手と自分の 防御と 特防の 能力変化を 入れ替えた!` );
        break;
    }

  }

  switch ( master.category ) {
    case 'ailment': // 状態異常付与
      target.getAilmentByStatusMove( master.ailment.name );
      break;

    case 'net-good-stats': // ランク変化
      master.stat.changes.map( stat => target.changeRank( stat.stat, stat.change ) );
      break;

    case 'force-switch': // 強制交代　ふきとばし、ほえる
      break;

    case 'swagger': // ランク変化＋状態異常付与
      master.stat.changes.map( stat => target.changeRank( stat.stat, stat.change ) );
      target.getAilmentByStatusMove( master.ailment.name );
      break;

    case 'heal': // 回復
      if ( pokemon.move.selected.name === 'Heal Pulse' ) { // 技「いやしのはどう」
        const healing = (): number => {
          if ( pokemon.ability.isName( 'Mega Launcher' ) ) {
            return fiveRoundEntry( target.getOrgHP() * 75 / 100 );
          } else {
            return Math.ceil( target.getOrgHP() * master.healing / 100 );
          }
        }
        target.status.hp.value.add( healing() );
      }

      if ( pokemon.move.selected.name === 'Floral Healing' ) { // 技「フラワーヒール」
        const healing = (): number => {
          if ( main.field.terrain.isGrassy() ) {
            return fiveRoundEntry( target.getOrgHP() * 2732 / 4096 );
          } else {
            return Math.ceil( target.getOrgHP() * master.healing / 100 );
          }
        }
        target.status.hp.value.add( healing() );
      }
      break;

    default:
      unique();
      break;
  }
}
