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

    case "user-or-ally": // 自分か味方
      statusMoveToUserOrAlly( pokemon );
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

    case "user": // 自分
      statusMoveToUser( pokemon );
      break;

    case "random-opponent":
    case "all-allies":
    case "fainting-pokemon":
      break;

    default:
      break;
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
      master.stat.changes.map( stat => target.changeRankByOther( stat.stat, stat.change, pokemon ));
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

function statusMoveToUserOrAlly( pokemon: Pokemon ): void {

  const attack: Attack = pokemon.attack.getTargetToPokemon()[0];
  const target: Pokemon = main.getPokemonByBattle( attack );

  switch ( pokemon.move.selected.name ) {
    case 'Acupressure': // 技「つぼをつく」
      const lineUp: RankStrings[] = [];
      if ( !target.status.atk.rank.isMax() ) lineUp.push( 'atk' );
      if ( !target.status.def.rank.isMax() ) lineUp.push( 'def' );
      if ( !target.status.spA.rank.isMax() ) lineUp.push( 'spA' );
      if ( !target.status.spD.rank.isMax() ) lineUp.push( 'spD' );
      if ( !target.status.spe.rank.isMax() ) lineUp.push( 'spe' );
      if ( !target.status.acc.isMax() ) lineUp.push( 'acc' );
      if ( !target.status.eva.isMax() ) lineUp.push( 'eva' );

      const stat: RankStrings = getOneAtRandom( lineUp );
      target.changeRankByOther( stat, 2, pokemon );
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
        master.stat.changes.map( stat => target.changeRankByOther( stat.stat, stat.change, pokemon ));
      });
      break;

    case 'Flower Shield': // 技「フラワーガード」
      pokemon.attack.getTargetToPokemon().map( tgt => {
        const target: Pokemon = main.getPokemonByBattle( tgt );
        master.stat.changes.map( stat => target.changeRankByOther( stat.stat, stat.change, pokemon ));
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
  const myField: SideField = main.field.getSide( pokemon.isMine() );
  const tgtField: SideField = main.field.getSide( target.isMine() );

  switch ( master.category ) {
    case 'ailment': // 状態異常付与
      target.getAilmentByStatusMove( master.ailment.name );
      break;

    case 'net-good-stats': // ランク変化
      master.stat.changes.map( stat => target.changeRankByOther( stat.stat, stat.change, pokemon ) );
      break;

    case 'force-switch': // 強制交代　ふきとばし、ほえる
      break;

    case 'swagger': // ランク変化＋状態異常付与
      master.stat.changes.map( stat => target.changeRankByOther( stat.stat, stat.change, pokemon ) );
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

    case 'unique': // 特殊処理
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

        case 'Worry Seed': // 技「なやみのタネ」
          target.ability.onChangeWithMsg( 'Insomnia' ); // 特性「ふみん」
          break;

        case 'Heart Swap': // 技「ハートスワップ」
          pokemon.status.swapRank( target );
          writeLog( `${pokemon.getArticle()}は 相手と自分の 能力変化を 入れ替えた!` );
          break;

        case 'Switcheroo': // 技「すりかえ」
          [ pokemon.item.name, target.item.name ] = [ target.item.name, pokemon.item.name ];
          writeLog( `${pokemon.getArticle()}は おたがいの 道具を入れ替えた!` );
          if ( target.item.name !== null ) writeLog( `${target.getArticle()}は ${target.item.translate()}を 手に入れた!` );
          if ( pokemon.item.name !== null ) writeLog( `${pokemon.getArticle()}は ${pokemon.item.translate()}を 手に入れた!` );
          break;

        case 'Defog': // 技「きりばらい」
          master.stat.changes.map( stat => target.changeRankByOther( stat.stat, stat.change, pokemon ) );
          tgtField.reflect.onRemove();
          tgtField.lightScreen.onRemove();
          tgtField.auroraVeil.onRemove();
          tgtField.mist.onRemove();
          tgtField.safeguard.onRemove();

          myField.spikes.onRemove();
          myField.toxicSpikes.onRemove();
          myField.stealthRock.onRemove();
          myField.stickyWeb.onRemove();
          myField.steelsurge.onRemove();

          tgtField.spikes.onRemove();
          tgtField.toxicSpikes.onRemove();
          tgtField.stealthRock.onRemove();
          tgtField.stickyWeb.onRemove();
          tgtField.steelsurge.onRemove();

          main.field.terrain.resetWithMessage();

          break;

        case 'Guard Split': // 技「ガードシェア」
          const guardSplitDef: number = Math.floor( ( pokemon.status.def.av + target.status.def.av ) / 2 );
          const guardSplitSpD: number = Math.floor( ( pokemon.status.spD.av + target.status.spD.av ) / 2 );
          pokemon.status.def.av = guardSplitDef;
          pokemon.status.spD.av = guardSplitSpD;
          target.status.def.av = guardSplitDef;
          target.status.spD.av = guardSplitSpD;
          writeLog( `${pokemon.getArticle()}は おたがいのガードを シェアした!` );
          break;

        case 'Power Split': // 技「ガードシェア」
          const powerSplitAtk: number = Math.floor( ( pokemon.status.atk.av + target.status.atk.av ) / 2 );
          const powerSplitSpA: number = Math.floor( ( pokemon.status.spA.av + target.status.spA.av ) / 2 );
          pokemon.status.atk.av = powerSplitAtk;
          pokemon.status.spA.av = powerSplitSpA;
          target.status.atk.av = powerSplitAtk;
          target.status.spA.av = powerSplitSpA;
          writeLog( `${pokemon.getArticle()}は おたがいのパワーを シェアした!` );
          break;

        case 'Soak': // 技「みずびたし」
          target.type.toType( 'Water' );
          break;

        case 'Simple Beam': // 技「シンプルビーム」
          target.ability.onChangeWithMsg( 'Simple' ); // 特性「たんじゅん」
          break;

        case 'Entrainment': // 技「なかまづくり」
          target.ability.onChangeWithMsg( pokemon.ability.name );
          break;

        case 'After You': // 技「おさきにどうぞ」
          break;

        case 'Quash': // 技「さきおくり」
          break;

        case 'Reflect Type': // 技「ミラータイプ」
          pokemon.type.copyFromOpp( target.type.list );
          writeLog( `${pokemon.getArticle()}は ${target.getArticle()}と 同じタイプに なった!` );
          break;

        case 'Bestow': // 技「ギフトパス」
          break;

        case 'Trick-or-Treat': // 技「ハロウィン」
          target.type.trickOrTreat.onActivate( target );
          break;

        case 'Forest’s Curse': // 技「もりののろい」
          target.type.forestCurse.onActivate( target );
          break;

        case 'Topsy-Turvy': // 技「ひっくりかえす」
          target.status.reverseRank();
          writeLog( `${target.getArticle()}は 能力変化が ひっくりかえった!` );
          break;

        case 'Electrify': // 技「そうでん」
          target.stateChange.electrify.onActivate( target );
          break;

        case 'Powder': // 技「ふんじん」
          target.stateChange.powder.onActivate( target );
          break;

        case 'Strength Sap': // 技「ちからをすいとる」
          const strengthSapValue: number = target.status.atk.value;
          master.stat.changes.map( stat => target.changeRankByOther( stat.stat, stat.change, pokemon ) );
          pokemon.status.hp.value.add( strengthSapValue );
          writeLog( `${pokemon.getArticle()}の 体力が 回復した!` );
          break;

        case 'Spotlight': // 技「スポットライト」
          target.stateChange.spotlight.onActivate( target );
          break;

        case 'Speed Swap': // 技「スピードスワップ」
          [ pokemon.status.spe.av, target.status.spe.av ] = [ target.status.spe.av, pokemon.status.spe.av ];
          writeLog( `${pokemon.getArticle()}は おたがいの スピードを 入れ替えた!` );
          break;

        case 'Purify': // 技「じょうか」
          target.statusAilment.getHealth();
          pokemon.status.hp.value.add( Math.floor( pokemon.getOrgHP() / 2 ) );
          break;

        case 'Instruct': // 技「さいはい」
          break;

        case 'Magic Powder': // 技「まほうのこな」
          target.type.toType( 'Psychic' );
          break;

        case 'Octolock': // 技「たこがため」
          target.stateChange.cannotEscape.onActivateOctolock( pokemon, target );
          break;

        default:
          break;
      }
      break;

    default:
      break;
  }
}

function statusMoveToUser( pokemon: Pokemon ): void {

  const master: MoveData = pokemon.move.selected.getMaster();
  const attack: Attack = pokemon.attack.getTargetToPokemon()[0];
  const target: Pokemon = main.getPokemonByBattle( attack );

  switch ( master.category ) {
    case 'ailment': // 状態異常付与
      target.getAilmentByStatusMove( master.ailment.name );
      break;

    case 'net-good-stats': // ランク変化
      master.stat.changes.map( stat => target.changeRankByOther( stat.stat, stat.change, pokemon ) );

      switch( pokemon.move.selected.name ) {
        case 'Charge': // 技「じゅうでん」
          target.stateChange.charge.onActivate( target );
          break;

        case 'Autotomize': // 技「ボディパージ」
          target.stateChange.autotomize.onActivate( target );
          break;

        case 'Stuff Cheeks': // 技「ほおばる」
          break;

        case 'No Retreat': // 技「はいすいのじん」
          target.stateChange.cannotEscape.onActivateNoRetreat( pokemon, target );
          break;

        case 'Clangorous Soul': // 技「ソウルビート」
          target.status.hp.value.sub( Math.floor( target.getOrgHP() / 3 ) );
          break;

        default:
          break;
      }
      break;

    case 'heal':
      const ceil: number = Math.ceil( target.getOrgHP() * master.healing / 100 );
      const weatherS: number = fiveRoundEntry( target.getOrgHP() / 4 );
      const weatherM: number = fiveRoundEntry( target.getOrgHP() * master.healing / 100 );
      const weatherL: number = fiveRoundEntry( target.getOrgHP() * 2732 / 4096 );

      switch( pokemon.move.selected.name ) {
        case 'Recover':     // 技「じこさいせい」
        case 'Soft-Boiled': // 技「タマゴうみ」
        case 'Milk Drink':  // 技「ミルクのみ」
        case 'Slack Off':   // 技「なまける」
        case 'Heal Order':  // 技「かいふくしれい」
          target.status.hp.value.add( ceil );
          break;

        case 'Morning Sun': // 技「あさのひざし」
        case 'Synthesis':   // 技「こうごうせい」
        case 'Moonlight':   // 技「つきのひかり」
          if ( main.field.weather.isSunny( target ) ) {
            target.status.hp.value.add( weatherL );
          } else if ( main.field.weather.isRainy( target ) || main.field.weather.isSandy() || main.field.weather.isSnowy() ) {
            target.status.hp.value.add( weatherS );
          } else {
            target.status.hp.value.add( weatherM );
          }
          break;

        case 'Swallow': // 技「のみこむ」
          target.status.hp.value.add( ceil );
          break;

        case 'Roost': // 技「はねやすめ」
          target.status.hp.value.add( ceil );
          break;

        case 'Shore Up': // 技「すなあつめ」
          if ( main.field.weather.isSandy() ) {
            target.status.hp.value.add( weatherL );
          } else {
            target.status.hp.value.add( weatherM );
          }
          break;

        default:
          break;
      }
      break;

    case 'unique':
      switch ( pokemon.move.selected.name ) {
        case 'Teleport': // 技「テレポート」
          break;

        case 'Focus Energy': // 技「きあいだめ」
          target.stateChange.focusEnergy.onActivate( target );
          break;

        case 'Metronome': // 技「ゆびをふる」
          break;

        case 'Splash': // 技「はねる」
          writeLog( `しかし なにも起こらない!` );
          break;

        case 'Rest': // 技「ねむる」
          target.status.hp.value.toMax();
          target.statusAilment.reset();
          target.statusAilment.onRest();
          break;

        case 'Conversion': // 技「テクスチャー」
          const firstType: PokemonType = getMoveDataByName( String(target.move.learned[0].name) ).type;
          target.type.toType( firstType );
          break;

        case 'Substitute': // 技「みがわり」
          const substituteHP: number = Math.floor( target.getOrgHP() / 4 )
          target.status.hp.value.sub( substituteHP );
          target.stateChange.substitute.onActivate( target, substituteHP );
          break;

        case 'Protect':        // 技「まもる」
        case 'Detect':         // 技「みきり」
        case 'King’s Shield':  // 技「キングシールド」
        case 'Spiky Shield':   // 技「ニードルガード」
        case 'Baneful Bunker': // 技「トーチカ」
        case 'Max Guard':      // 技「ダイウォール」
        case 'Obstruct':       // 技「ブロッキング」
          target.stateChange.protect.onActivate( target, target.move.selected.name );
          break;

        case 'Belly Drum': // 技「はらだいこ」
          target.status.hp.value.sub( Math.floor( target.getOrgHP() / 2 ) );
          target.status.atk.rank.toMax();
          writeLog( `${target.getArticle()}は 体力を削って パワー全開!` );
          break;

        case 'Destiny Bond': // 技「みちづれ」
          target.stateChange.destinyBond.onActivate( target );
          break;

        case 'Endure': // 技「こらえる」
          target.stateChange.endure.onActivate( target );
          break;

        case 'Sleep Talk': // 技「ねごと」
          break;

        case 'Baton Pass': // 技「バトンタッチ」
          break;

        case 'Stockpile': // 技「たくわえる」
          target.stateChange.stockpile.onActivate( target );
          break;

        case 'Follow Me': // 技「このゆびとまれ」
        case 'Rage Powder': // 技「いかりのこな」
          target.stateChange.spotlight.onActivate( target );
          break;

        case 'Wish': // 技「ねがいごと」
          break;

        case 'Assist': // 技「ねこのて」
          break;

        case 'Magic Coat': // 技「マジックコート」
          target.stateChange.magicCoat.onActivate( target );
          break;

        case 'Recycle': // 技「リサイクル」
          target.item.name = target.item.recycle;
          target.item.recycle = null;
          writeLog( `${target.getArticle()}は ${target.item.translate()}を 拾ってきた!` );
          break;

        case 'Imprison': // 技「ふういん」
          target.stateChange.imprison.onActivate( target );
          break;

        case 'Refresh': // 技「リフレッシュ」
          target.statusAilment.getHealth();
          break;

        case 'Grudge': // 技「おんねん」
          target.stateChange.grudge.onActivate( target );
          break;

        case 'Snatch': // 技「スナッチ」
          break;

        case 'Camouflage': // 技「ほごしょく」
          if ( main.field.terrain.isElectric() ) target.type.toType( 'Electric' );
          else if ( main.field.terrain.isGrassy() ) target.type.toType( 'Grass' );
          else if ( main.field.terrain.isMisty() ) target.type.toType( 'Fairy' );
          else if ( main.field.terrain.isPsychic() ) target.type.toType( 'Psychic' );
          else target.type.toType( 'Normal' );
          break;

        case 'Healing Wish': // 技「みかづきのまい」
          break;

        case 'Power Trick': // 技「パワートリック」
          [ target.status.atk.value, target.status.def.value ] = [ target.status.def.value, target.status.atk.value ];
          writeLog( `${target.getArticle()}は 攻撃と 防御を 入れ替えた!` );
          break;

        case 'Copycat': // 技「まねっこ」
          break;

        case 'Aqua Ring': // 技「アクアリング」
          target.stateChange.aquaRing.onActivate( target );
          break;

        case 'Magnet Rise': // 技「でんじふゆう」
          target.stateChange.magnetRise.onActivate( target );
          break;

        case 'Lunar Dance': // 技「みかづきのまい」
          break;

        case 'Ally Switch': // 技「サイドチェンジ」
          break;

        case 'Shell Smash': // 技「からをやぶる」
          master.stat.changes.map( stat => target.changeRank( stat.stat, stat.change ) );
          break;

        case 'Celebrate': // 技「おいわい」
          break;

        case 'Laser Focus': // 技「とぎすます」
          target.stateChange.laserFocus.onActivate( target );
          break;
      }
      break;

    default:
      break;
  }
}
