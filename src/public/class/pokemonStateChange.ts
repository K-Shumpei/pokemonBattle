class StateChangeStatus {
  isTrue = false;
  turn = new ValueWithRange();
  count = 0;
  move: MoveText = null;
  order = new Order( true, 0 );
  hp = new ValueWithRange();
  protect: MoveText = null; // まもる系統
  strong: boolean = false; // しめつけバンド
  flag: boolean = false; // なまけ、きあいパンチ
  item: string | null = null;

  reset(): void {
    this.isTrue = false;
    this.turn.value = this.turn.max;
    this.count = 0;
    this.move = null;
    this.order = new Order( true, 0 );
    this.hp = new ValueWithRange();
    this.protect = null;
    this.strong = false;
    this.flag = false;
    this.item = null;
  }
}

class Attract extends StateChangeStatus {

  // pokemon → メロメロになる方
  // target → メロメロにする方
  isActivate( pokemon: Pokemon, target: Pokemon ): boolean {
    if ( this.isTrue ) return false;
    if ( pokemon.gender === 'genderless' ) return false;
    if ( target.gender === 'genderless' ) return false;
    if ( pokemon.gender === target.gender ) return false;
    if ( pokemon.isMine() === target.isMine() ) return false;
    if ( pokemon.isAbility( 'Oblivious' ) ) return false; // 特性「どんかん」
    if ( !main.isExistAbilityInSide( pokemon.isMine(), 'Aroma Veil' ) ) return false; // 特性「アロマベール」

    return true;
  }

  onActivate( pokemon: Pokemon, target: Pokemon ): void {
    if ( !this.isActivate( pokemon, target ) ) return;

    this.isTrue = true;
    this.order.setInfo( target.order );
    battleLog.write( `${pokemon.getArticle()}は メロメロに なった!` );

    if ( pokemon.isItem( 'あかいいと' ) ) {
      target.stateChange.attract.onActivate( target, pokemon );
    }
  }

  // pokemon → メロメロボディ
  // target → 攻撃側
  onActivateByCuteCharm( pokemon: Pokemon, target: Pokemon, attack: Attack ): void {
    if ( attack.substitute ) return;
    if ( !target.isContact() ) return;
    if ( !pokemon.isAbility( 'Cute Charm' ) ) return; // 特性「メロメロボディ」
    if ( target.isItem( 'ぼうごパット' ) ) return;
    if ( getRandom() >= 30 ) return;
    if ( !this.isActivate( pokemon, target ) ) return;

    pokemon.msgDeclareAbility();
    this.onActivate( target, pokemon );
  }

  isEffective( pokemon: Pokemon ): boolean {
    if ( !this.isTrue ) return false;

    const target: Pokemon = main.getPokemonByOrder( this.order );
    battleLog.write( `${pokemon.getArticle()}は ${target.getArticle()}に メロメロだ!` );

    if ( getRandom() < 50 ) return false;
    battleLog.write( `${pokemon.getArticle()}は メロメロで 技が だせなかった!` );
    return true;
  }
}

class AquaRing extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は 水のリングを まとった!` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( pokemon.status.hp.value.isMax() ) return;
    const heal: number = Math.floor( pokemon.getOrgHP() / 16 );
    pokemon.status.hp.value.add( Math.max( 1, heal ) );
    battleLog.write( `${pokemon.getArticle()}は 水のリングで 体力を回復!` );
  }
}

class Autotomize extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は 身軽になった!` );
  }
}

class BeakBlast extends StateChangeStatus {

  onEffective( pokemon: Pokemon, target: Pokemon, attack: Attack ): void {
    if ( attack.substitute ) return;
    if ( !target.isContact() ) return;
    if ( !this.isTrue ) return;
    if ( target.move.selected.name === 'Sky Drop' ) return; // 技「フリーフォール」
    if ( !target.isGetAilmentByOther( 'Burned', pokemon ) ) return;

    target.statusAilment.getBurned();
  }
}

class Bind extends StateChangeStatus {

  onActivate( pokemon: Pokemon, target: Pokemon ): void {

    const getTurn = (): number => {
      if ( pokemon.isItem( 'ねばりのかぎづめ' ) ) return 7;
      if ( getRandom() < 50 ) return 5;
      return 4;
    }

    this.isTrue = true;
    this.turn.setInitial( getTurn() );
    this.move = pokemon.move.selected.name;

    if ( pokemon.isItem( 'しめつけバンド' ) ) {
      this.strong = true;
    }


    switch ( pokemon.move.selected.name ) {
      case 'Whirlpool': // 技「うずしお」
        battleLog.write( `${target.getArticle()}は 渦の中に 閉じこめられた!` );
        break;

      case 'Clamp': // 技「からではさむ」
        battleLog.write( `${target.getArticle()}は ${pokemon.getArticle()}の からに はさまれた!` );
        break;

      case 'Thunder Cage': // 技「サンダープリズン」
        battleLog.write( `${target.getArticle()}は ${pokemon.getArticle()}に 閉じこめられた!` );
        break;

      case 'Bind': // 技「しめつける」
        battleLog.write( `${target.getArticle()}は ${pokemon.getArticle()}に しめつけられた!` );
        break;

      case 'Sand Tomb': // 技「すなじごく」
        battleLog.write( `${target.getArticle()}は 砂じごくに 捕らわれた!` );
        break;

      case 'Snap Trap': // 技「トラバサミ」
        battleLog.write( `${target.getArticle()}は トラバサミに 捕らわれた!` );
        break;

      case 'Fire Spin': // 技「ほのおのうず」
        battleLog.write( `${target.getArticle()}は 炎の渦に 閉じこめられた!` );
        break;

      case 'Wrap': // 技「まきつく」
        battleLog.write( `${target.getArticle()}は ${pokemon.getArticle()}に 巻きつかれた!` );
        break;

      case 'Magma Storm': // 技「マグマストーム」
        battleLog.write( `${target.getArticle()}は マグマの渦に 閉じこめられた!` );
        break;

      case 'Infestation': // 技「まとわりつく」
        battleLog.write( `${target.getArticle()}は ${pokemon.getArticle()}に まとわりつかれた!` );
        break;

      default:
        break;
    }
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;

    const getDamage = (): number => {
      if ( this.strong ) {
        return Math.floor( pokemon.getOrgHP() / 6 );
      } else {
        return Math.floor( pokemon.getOrgHP() / 8 );
      }
    }

    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      battleLog.write( `${pokemon.getArticle()}は ${this.move}から 解放された!` );
      this.reset();
      return;
    }

    pokemon.status.hp.value.sub( Math.max( 1, getDamage() ) );
    battleLog.write( `${pokemon.getArticle()}は ${this.move}の ダメージを 受けている` );
  }
}

class CannotEscape extends StateChangeStatus {

  octolock: boolean = false;
  noRetreat: boolean = false;

  onActivateNoMessage( serve: Pokemon ): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    this.order.setInfo( serve.order );
  }

  onActivate( serve: Pokemon, receive: Pokemon ): void {
    this.onActivateNoMessage( serve );
    battleLog.write( `${receive.getArticle()}は もう 逃げられない!` );
  }

  onActivateNoRetreat( serve: Pokemon, receive: Pokemon ): void {
    this.onActivateNoMessage( serve );
    this.noRetreat = true;
    battleLog.write( `${receive.getArticle()}は はいすいのじんで 逃げることが できなくなった!` )
  }

  onActivateJawLock( serve: Pokemon, receive: Pokemon ): void {
    this.onActivateNoMessage( serve );
    serve.stateChange.cannotEscape.onActivateNoMessage( receive );
    battleLog.write( `おたがいの ポケモンは 逃げることが できなくなった!` );
  }
}

class CannotMove extends StateChangeStatus {

  isEffective( pokemon: Pokemon ): boolean {
    if ( !this.isTrue ) return false;
    battleLog.write( `${pokemon.getArticle()}は 攻撃の 反動で 動けない!` );
    this.reset();

    pokemon.stateChange.truant.onElapse();

    return true;
  }
}

class Charge extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は 充電を 始めた!` );
  }
}

class Confuse extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    const turn: number = Math.floor( getRandom() * 0.04 ) + 2; // 2,3,4,5のいずれか
    this.turn.setInitial( turn );

    battleLog.write( `${pokemon.getArticle()}は 混乱した!` );
  }

  isEffective( pokemon: Pokemon ): boolean {
    if ( !this.isTrue ) return false;

    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      battleLog.write( `${pokemon.getArticle()}の 混乱が 解けた!` );
      this.reset();
      return false;
    }

    battleLog.write( `${pokemon.getArticle()}は 混乱している!` );
    if ( getRandom() < 2/3 * 100 ) return false;

    battleLog.write( `わけも わからず 自分を 攻撃した!` );

    const power: number = 40;
    const attack: number = pokemon.status.atk.rankCorrVal;
    const defense: number = pokemon.status.def.rankCorrVal;

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

class Curse extends StateChangeStatus {

  onActivate( pokemon: Pokemon, target: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は 自分の体力を 削って ${target.getArticle()}に のろいを かけた!` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;

    const damage: number = Math.floor( pokemon.getOrgHP() / 4 );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    battleLog.write( `${pokemon.getArticle()}は のろわれている! ` );
  }
}

class DestinyBond extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は 相手を 道連れに しようとしている!` );
  }
}

class Disable extends StateChangeStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 4, 0 );
  }

  onActivate( pokemon: Pokemon ): void { // 対象の技の特定
    this.isTrue = true;
    // this.move = pokemon.move.selected.name;
    // battleLog.write( `${pokemon.getArticle()}の ${pokemon.move.selected.translate()}を 封じこめた! ` );
  }

  onElapse( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      battleLog.write( `${pokemon.getArticle()}の かなしばりが 解けた! ` );
    }
  }

  isEffective( pokemon: Pokemon ): boolean {
    if ( !this.isTrue ) return false;
    // if ( !pokemon.move.selected.isName( pokemon.stateChange.disable.text ) ) return false;
    battleLog.write( `${pokemon.getArticle()}は かなしばりで 技が 出せない!` );
    return true;
  }
}

class Electrify extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は そうでんで 技が でんきタイプになった! ` );
  }
}

class Embargo extends StateChangeStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は 道具が 使えなくなった! ` );
  }

  onElapse( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      battleLog.write( `${pokemon.getArticle()}は 道具が 使えるようになった! ` );
    }
  }
}

class Encore extends StateChangeStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 3, 0 );
  }

  onActivate( pokemon: Pokemon ): void { // 対象の技の特定
    this.isTrue = true;
    // this.move = pokemon.move.selected.name;
    battleLog.write( `${pokemon.getArticle()}は アンコールを受けた! ` );
  }

  onElapse( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      battleLog.write( `${pokemon.getArticle()}の アンコール状態が 解けた! ` );
    }
  }
}

class Endure extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は こらえる 体勢に 入った!` );
  }

}

class Flinch extends StateChangeStatus {

  onActivate(): void {
    this.isTrue = true;
  }

  isEffective( pokemon: Pokemon ): boolean {
    if ( !this.isTrue ) return false;
    battleLog.write( `${pokemon.getArticle()}は ひるんで 技が 出せない!` );

    if ( pokemon.isAbility( 'Steadfast' ) && pokemon.isChangeRank( 'spe', 1 ) ) { // 特性「ふくつのこころ」
      pokemon.msgDeclareAbility();
      pokemon.changeRank( 'spe', 1 );
    }

    return true;
  }

}

class Fling extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    this.item = pokemon.item.name;
    pokemon.item.recyclable();
  }
}

class FocusEnergy extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は 張り切っている!` );
  }
}

class FocusPunch extends StateChangeStatus {

  isEffective( pokemon: Pokemon ): boolean {
    if ( !this.isTrue ) return false;
    if ( this.flag ) {
      this.reset();
      return false;
    } else {
      battleLog.write( `${pokemon.getArticle()}は 集中が 途切れて 技が 出せない!` );
      this.reset();
      return true;
    }
  }
}

class Grudge extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は 相手に おんねんを かけようとしている!` );
  }

  onEffective( pokemon: Pokemon, target: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( !pokemon.status.hp.value.isZero() ) return;
    if ( target.move.learned[target.move.selected.slot].powerPoint.isZero() ) return;

    target.move.learned[target.move.selected.slot].powerPoint.toZero();
    battleLog.write( `${target.getArticle()}の ${target.move.learned[target.move.selected.slot].translate()}は おんねんで PPが0になった!` );
  }
}

class HealBlock extends StateChangeStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は 回復動作を 封じられた!` );
  }

  onElapse( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      battleLog.write( `${pokemon.getArticle()}の かいふくふうじの 効果が切れた! ` );
    }
  }

  isEffective( pokemon: Pokemon ): boolean {
    if ( !this.isTrue ) return false;
    if ( !pokemon.move.selected.getMaster().heal ) return false;
    if ( pokemon.move.selected.name === 'Pollen Puff' // 技「かふんだんご」
      && pokemon.attack.getValidTarget()[0].isMe !== pokemon.isMine() ) {
        return false;
    }

    battleLog.write( `${pokemon.getArticle()}は かいふくふうじで 技が 出せない!` );
    return true;
  }
}

class HelpingHand extends StateChangeStatus {

  onActivate( pokemon: Pokemon, target: Pokemon ): void {
    this.isTrue = true;
    this.count += 1;
    battleLog.write( `${pokemon.getArticle()}は ${target.getArticle()}を 手助けする 体勢に入った!` );
  }
}

class Imprison extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は 相手の技を 封印した!` );
  }

  isEffective( pokemon: Pokemon, atkPokemon: Pokemon ): boolean {
    if ( !this.isTrue ) return false;

    for ( const move of pokemon.move.learned ) {
      if ( move.name === atkPokemon.move.selected.name ) {
        battleLog.write( `${atkPokemon.getArticle()}は ふういんで 技が 出せない!` );
        return true;
      }
    }
    return false;
  }
}

class Ingrain extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は 根を はった!` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( pokemon.status.hp.value.isMax() ) return;
    const heal: number = Math.floor( pokemon.getOrgHP() / 16 );
    pokemon.status.hp.value.add( Math.max( 1, heal ) );
    battleLog.write( `${pokemon.getArticle()}は 根から 養分を 吸い取った!` );
  }
}

class LaserFocus extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は 精神を 研ぎ澄ました!` );
  }
}

class LeechSeed extends StateChangeStatus {

  onActivate( pokemon: Pokemon, target: Pokemon ): void {
    this.isTrue = true;
    this.order.setInfo( pokemon.order );
    battleLog.write( `${target.getArticle()}に 種を 植えつけた!` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;

    const calcDamage = (): number => {
      let base: number = Math.floor( pokemon.getOrgHP() / 16 );
      let rest: number = pokemon.status.hp.value.value;
      if ( rest < base ) {
        return rest;
      } else {
        return Math.max( 1, base );
      }
    }

    const damage = calcDamage();
    const target: Pokemon = main.getPokemonByOrder( this.order );
    if ( !target ) return;

    pokemon.status.hp.value.sub( damage );
    target.status.hp.value.add( damage );
    battleLog.write( `やどりぎが ${pokemon.getArticle()}の 体力を奪う!` );
  }
}

class LockOn extends StateChangeStatus {

  onActivate( pokemon: Pokemon, target: Pokemon ): void {
    this.isTrue = true;
    this.order.setInfo( target.order );
    battleLog.write( `${pokemon.getArticle()}は ${target.getArticle()}に ねらいを さだめた!` );
  }
}

class MagicCoat extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は マジックコートに つつまれた!` );
  }
}

class MagnetRise extends StateChangeStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は 電磁力で 浮かびあがった!` );
  }

  onElapse( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      battleLog.write( `${pokemon.getArticle()}の 電磁力が なくなった! ` );
    }
  }
}

class Nightmare extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は あくむを 見始めた!` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    const damage: number = Math.floor( pokemon.getOrgHP() / 4 );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    battleLog.write( `${pokemon.getArticle()}は あくむに うなされている!` );
  }
}

class NoAbility extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は 特性が 効かなくなった!` );
  }
}

class Octolock extends StateChangeStatus {

  onActivate( pokemon: Pokemon, target: Pokemon ): void {
    this.isTrue = true;
    this.order = new Order( pokemon.order.isMe, pokemon.order.hand );
    battleLog.write( `${target.getArticle()}は たこがためで 逃げられなくなった!` );

    target.stateChange.cannotEscape.onActivateNoMessage( pokemon );
  }

  onEffective( pokemon: Pokemon ):void {
    if ( !this.isTrue ) return;
    const target: Pokemon = main.getPokemonByOrder( this.order );
    pokemon.changeRankByOther( 'def', -1, target );
    pokemon.changeRankByOther( 'spD', -1, target );
  }
}

class PerishSong extends StateChangeStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 3, 0 );
  }

  onActivate(): void {
    this.isTrue = true;
  }

  // pokemon → ほろびのボディ
  // target → 攻撃側
  onActivateByPerishBody( pokemon: Pokemon, target: Pokemon, attack: Attack ): void {
    if ( attack.substitute ) return;
    if ( target.isContact() ) return;
    if ( !pokemon.ability.isName( 'Perish Body' ) ) return; // 特性「ほろびのボディ」
    if ( target.status.hp.value.isZero() ) return;
    if ( target.isItem( 'ぼうごパット' ) ) return;
    if ( this.isTrue && target.stateChange.perishSong.isTrue ) return;

    pokemon.msgDeclareAbility();

    if ( !this.isTrue && !target.stateChange.perishSong.isTrue ) {
      battleLog.write( `おたがいは 3ターン後に 滅びてしまう!` );
    } else {
      if ( !this.isTrue ) {
        battleLog.write( `${pokemon.getArticle()}は 3ターン後に 滅びてしまう!` );
      } else {
        battleLog.write( `${target.getArticle()}は 3ターン後に 滅びてしまう!` );
      }
    }

    this.onActivate();
    target.stateChange.perishSong.onActivate();
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    battleLog.write( `${pokemon.getArticle()}の 滅びのカウントが ${this.turn.value}になった!` );
    this.turn.sub( 1 );

    if ( this.turn.isZero() ) {
      this.reset();
      pokemon.status.hp.value.toZero();
    }
  }
}

class Powder extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}に ふんじんを あびせた!` );
  }

  isEffective( pokemon: Pokemon ): boolean {
    if ( !this.isTrue ) return false;
    if ( pokemon.move.selected.type !== 'Fire' ) return false;

    pokemon.attack.reset();
    battleLog.write( `${pokemon.move.selected.translate()}に 反応して ふんじんが 爆発した!` );

    if ( pokemon.ability.isName( 'Magic Guard' ) ) return true; // 特性「マジックガード」

    const damage: number = Math.floor( pokemon.getOrgHP() / 4 );
    pokemon.status.hp.value.sub( damage );

    return true;
  }
}

class Protect extends StateChangeStatus {

  onActivate( pokemon: Pokemon, move: MoveText ): void {
    this.isTrue = true;
    this.protect = move;
    battleLog.write( `${pokemon.getArticle()}は 守りの 体勢に 入った!` );
  }
}

class Rage extends StateChangeStatus {

  onEffective( pokemon: Pokemon, attack: Attack ): void {
    if ( pokemon.status.hp.value.isZero() ) return;
    if ( attack.substitute ) return;
    if ( !this.isTrue ) return;
    if ( !pokemon.isChangeRank( 'atk', 1 ) ) return;

    const setting: number = pokemon.getRankVariableOrg( 1 );
    const real: number = pokemon.getRankVariable( 'atk', setting );

    pokemon.status.atk.rank.add( real );
    battleLog.write( `${pokemon.getArticle()}の いかりのボルテージが 上がっていく!` );
  }
}

class SaltCure extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は しおづけに なった!` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;

    const damage = (): number => {
      if ( pokemon.type.has( 'Water' ) || pokemon.type.has( 'Steel' ) ) {
        return Math.floor( pokemon.getOrgHP() / 4 );
      } else {
        return Math.floor( pokemon.getOrgHP() / 8 );
      }
    }

    pokemon.status.hp.value.sub( Math.max( 1, damage() ) );
    battleLog.write( `${pokemon.getArticle()}は しおづけの ダメージを 受けている` );
  }
}

class SlowStart extends StateChangeStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は 調子が 上がらない!` );
  }

  onElapse( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      battleLog.write( `${pokemon.getArticle()}は 調子を 取り戻した! ` );
    }
  }
}

class Spotlight extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は 注目の的に なった!` );
  }
}

class Stockpile extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    this.count += 1;
    battleLog.write( `${pokemon.getArticle()}は ${this.count}つ たくわえた!` );

    pokemon.changeRank( 'def', 1 );
    pokemon.changeRank( 'spD', 1 );
  }
}

class Substitute extends StateChangeStatus {

  onActivate( pokemon: Pokemon, hp: number ): void {
    this.isTrue = true;
    this.hp = new ValueWithRange( hp, 0 );
    battleLog.write( `${pokemon.getArticle()}の 身代わりが 現れた!` );
  }
}

class TarShot extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は ほのおに 弱くなった!` );
  }
}

class Taunt extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    this.turn.setInitial( 3 );
    battleLog.write( `${pokemon.getArticle()}は 挑発に 乗ってしまった!` );
  }

  onElapse( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      battleLog.write( `${pokemon.getArticle()}は 挑発の効果が 解けた! ` );
    }
  }

  isEffective( pokemon: Pokemon ): boolean {
    if ( !this.isTrue ) return false;
    if ( pokemon.move.selected.name === 'Me First' ) return false; // 技「さきどり」
    if ( !pokemon.move.selected.isStatus() ) return false;

    battleLog.write( `${pokemon.getArticle()}は ちょうはつされて 技が 出せない!` );
    return true;
  }
}

class Telekinesis extends StateChangeStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 3, 0 );
  }

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}を 宙に 浮かせた!` );
  }

  onElapse( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      battleLog.write( `${pokemon.getArticle()}は テレキネシスから 解放された! ` );
    }
  }
}

class ThroatChop extends StateChangeStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 2, 0 );
  }

  onActivate(): void {
    this.isTrue = true;
  }

  isEffective( pokemon: Pokemon ): boolean {
    if ( !this.isTrue ) return false;
    if ( !pokemon.move.selected.getMaster().sound ) return false;

    battleLog.write( `${pokemon.getArticle()}は じごくづきの効果で 技が 出せない!` );
    return true;
  }
}

class Torment extends StateChangeStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 3, 0 );
  }

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    this.move = pokemon.move.selected.name;
    battleLog.write( `${pokemon.getArticle()}は いちゃもんを つけられた!` );
  }

  onElapse( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    // if ( pokemon.move.selected.name !== 'G-Max Meltdown' ) return; // 技「キョダイユウゲキ」

    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      battleLog.write( `${pokemon.getArticle()}の いちゃもんの 効果が切れた! ` );
    }
  }
}

class Truant extends StateChangeStatus {

  onElapse(): void {
    if ( !this.isTrue ) return;
    this.flag = !this.flag;
  }

  isEffective( pokemon: Pokemon ): boolean {
    if ( !this.isTrue ) return false;

    if ( this.flag ) {
      pokemon.msgDeclareAbility();
      battleLog.write( `${pokemon.getArticle()}は なまけている` );
      this.onElapse();
      return true;
    } else {
      this.onElapse();
      return false;
    }
  }
}




class StateChangeSummary {

  attract      = new Attract();      // メロメロ
  aquaRing     = new AquaRing();     // アクアリング
  autotomize   = new Autotomize();   // ボディパージ
  beakBlast    = new BeakBlast(); // くちばしキャノン
  bind         = new Bind();         // バインド
  cannotEscape = new CannotEscape(); // にげられない
  cannotMove   = new CannotMove();   // 反動で動けない
  charge       = new Charge();       // じゅうでん
  confuse      = new Confuse();      // こんらん
  curse        = new Curse();        // のろい
  destinyBond  = new DestinyBond();  // みちづれ
  disable      = new Disable();      // かなしばり
  electrify    = new Electrify();    // そうでん
  embargo      = new Embargo();      // さしおさえ
  encore       = new Encore();       // アンコール
  endure       = new Endure();       // こらえる
  flinch       = new Flinch();       // ひるみ
  fling        = new Fling();        // なげつける
  focusEnergy  = new FocusEnergy();  // きゅうしょアップ
  focusPunch   = new FocusPunch();   // きあいパンチ
  grudge       = new Grudge();       // おんねん
  healBlock    = new HealBlock();    // かいふくふうじ
  helpingHand  = new HelpingHand();  // てだすけ
  imprison     = new Imprison();     // ふういん
  ingrain      = new Ingrain();      // ねをはる
  laserFocus   = new LaserFocus();   // とぎすます
  leechSeed    = new LeechSeed();    // やどりぎのタネ
  lockOn       = new LockOn();       // ロックオン
  magicCoat    = new MagicCoat();    // マジックコート
  magnetRise   = new MagnetRise();   // でんじふゆう
  nightmare    = new Nightmare();    // あくむ
  noAbility    = new NoAbility();    // とくせいなし
  octolock     = new Octolock();     // たこがため
  perishSong   = new PerishSong();   // ほろびのうた
  powder       = new Powder();       // ふんじん
  protect      = new Protect();      // まもる
  rage         = new Rage();         // いかり
  saltCure     = new SaltCure();     // しおづけ
  slowStart    = new SlowStart();    // スロースタート
  spotlight    = new Spotlight();    // ちゅうもくのまと
  stockpile    = new Stockpile();    // たくわえる
  substitute   = new Substitute();   // みがわり
  tarShot      = new TarShot();      // タールショット
  taunt        = new Taunt();        // ちょうはつ
  telekinesis  = new Telekinesis();  // テレキネシス
  throatChop   = new ThroatChop();   // じごくづき
  torment      = new Torment();      // いちゃもん
  truant       = new Truant();       // なまけ




  _yawn: StateChange; // ねむけ


  _foresight: StateChange; // みやぶられている
  _miracleEye: StateChange; // ミラクルアイ
  _smackDown: StateChange; // うちおとす


  /*
  ハロウィン
  もりののろい
  ちゅうもくのまと
  */
  // たこがため
  _saltCure: StateChange; // しおづけ

  // わざを使ったポケモンに発生
  _minimize: StateChange; //ちいさくなる
  // まるくなる
  _uproar: StateChange; // さわぐ
  // あばれる

  /*
  がまん
  パワートリック
  */
  _transform: Transform; // へんしん
  _fly: StateChange; // そらをとぶ
  _dig: StateChange; // あなをほる
  _dive: StateChange; // ダイビング
  _shadowForce: StateChange;// シャドーダイブ

  /*
  にげられない

  とくせいの効果で発生
  メロメロ (メロメロボディ)
  かなしばり (のろわれボディ)
  へんしん (かわりもの)
  マジックコート (マジックミラー)
  ほろびのうた (ほろびのボディ)
  */


  // 以下、状態変化ではない


  _disguise: StateChange; // ばけのかわ
  _iceFace: StateChange; // アイスフェイス
  _protean: StateChange; // へんげんじざい
  _quarkDrive: StateChange; // クォークチャージ
  _protosynthesis: StateChange; // こだいかっせい
  _flashFire: StateChange; // もらいび
  _sheerForce: StateChange; // ちからずく
  _synchronize: StateChange; // シンクロ
  _gulpMissile: StateChange; // うのミサイル
  _gem: StateChange; // ジュエル
  _micleBerry: StateChange; // ミクルのみ
  _halfBerry: StateChange; // 半減きのみ


  _someProtect: StateChange // まもる連続使用
  _endureMsg: StateChange; // HP1で耐える効果の保存

  _dynamax: StateChange; // ダイマックス
  _rangeCorr: StateChange; // 範囲補正
  _memo: StateChange; // メモ

  constructor() {
    this._yawn = new StateChange();
    this._foresight = new StateChange();
    this._miracleEye = new StateChange();
    this._smackDown = new StateChange();
    this._saltCure = new StateChange();

    this._minimize = new StateChange();
    this._uproar = new StateChange();
    this._transform = new Transform();
    this._fly = new StateChange();
    this._dig = new StateChange();
    this._dive = new StateChange();
    this._shadowForce = new StateChange();

    this._disguise = new StateChange();
    this._iceFace = new StateChange();
    this._protean = new StateChange();
    this._quarkDrive = new StateChange();
    this._protosynthesis = new StateChange();
    this._flashFire = new StateChange();
    this._sheerForce = new StateChange();
    this._synchronize = new StateChange();
    this._gulpMissile = new StateChange();
    this._gem = new StateChange();
    this._micleBerry = new StateChange();
    this._halfBerry = new StateChange();
    this._someProtect = new StateChange();
    this._endureMsg = new StateChange();
    this._dynamax = new StateChange();
    this._rangeCorr = new StateChange();
    this._memo = new StateChange();
  }

  set yawn( yawn: StateChange ) {
    this._yawn = yawn;
  }
  set foresight( foresight: StateChange ) {
    this._foresight = foresight;
  }
  set miracleEye( miracleEye: StateChange ) {
    this._miracleEye = miracleEye;
  }
  set smackDown( smackDown: StateChange ) {
    this._smackDown = smackDown;
  }
  set minimize( minimize: StateChange ) {
    this._minimize = minimize;
  }
  set uproar( uproar: StateChange ) {
    this._uproar = uproar;
  }
  set transform( transform: Transform ) {
    this._transform = transform;
  }
  set fly( fly: StateChange ) {
    this._fly = fly;
  }
  set dig( dig: StateChange ) {
    this._dig = dig;
  }
  set dive( dive: StateChange ) {
    this._dive = dive;
  }
  set shadowForce( shadowForce: StateChange ) {
    this._shadowForce = shadowForce;
  }
  set disguise( disguise: StateChange ) {
    this._disguise = disguise;
  }
  set iceFace( iceFace: StateChange ) {
    this._iceFace = iceFace;
  }
  set protean( protean: StateChange ) {
    this._protean = protean;
  }
  set quarkDrive( quarkDrive: StateChange ) {
    this._quarkDrive = quarkDrive;
  }
  set protosynthesis( protosynthesis: StateChange ) {
    this._protosynthesis = protosynthesis;
  }
  set flashFire( flashFire: StateChange ) {
    this._flashFire = flashFire;
  }
  set sheerForce( sheerForce: StateChange ) {
    this._sheerForce = sheerForce;
  }
  set synchronize( synchronize: StateChange ) {
    this._synchronize = synchronize;
  }
  set gulpMissile( gulpMissile: StateChange ) {
    this._gulpMissile = gulpMissile;
  }
  set gem( gem: StateChange ) {
    this._gem = gem;
  }
  set micleBerry( micleBerry: StateChange ) {
    this._micleBerry = micleBerry;
  }
  set halfBerry( halfBerry: StateChange ) {
    this._halfBerry = halfBerry;
  }
  set someProtect( someProtect: StateChange ) {
    this._someProtect = someProtect;
  }
  set endureMsg( endureMsg: StateChange ) {
    this._endureMsg = endureMsg;
  }
  set dynamax( dynamax: StateChange ) {
    this._dynamax = dynamax;
  }
  set rangeCorr( rangeCorr: StateChange ) {
    this._rangeCorr = rangeCorr;
  }
  set memo( memo: StateChange ) {
    this._memo = memo;
  }

  get yawn(): StateChange {
    return this._yawn;
  }
  get foresight(): StateChange {
    return this._foresight;
  }
  get miracleEye(): StateChange {
    return this._miracleEye;
  }
  get smackDown(): StateChange {
    return this._smackDown;
  }
  get minimize(): StateChange {
    return this._minimize;
  }
  get uproar(): StateChange {
    return this._uproar;
  }
  get transform(): Transform {
    return this._transform;
  }
  get fly(): StateChange {
    return this._fly;
  }
  get dig(): StateChange {
    return this._dig;
  }
  get dive(): StateChange {
    return this._dive;
  }
  get shadowForce(): StateChange {
    return this._shadowForce;
  }
  get disguise(): StateChange {
    return this._disguise;
  }
  get iceFace(): StateChange {
    return this._iceFace;
  }
  get protean(): StateChange {
    return this._protean;
  }
  get quarkDrive(): StateChange {
    return this._quarkDrive;
  }
  get protosynthesis(): StateChange {
    return this._protosynthesis;
  }
  get flashFire(): StateChange {
    return this._flashFire;
  }
  get sheerForce(): StateChange {
    return this._sheerForce;
  }
  get synchronize(): StateChange {
    return this._synchronize;
  }
  get gulpMissile(): StateChange {
    return this._gulpMissile;
  }
  get gem(): StateChange {
    return this._gem;
  }
  get micleBerry(): StateChange {
    return this._micleBerry;
  }
  get halfBerry(): StateChange {
    return this._halfBerry;
  }
  get someProtect(): StateChange {
    return this._someProtect;
  }
  get endureMsg(): StateChange {
    return this._endureMsg;
  }
  get dynamax(): StateChange {
    return this._dynamax;
  }
  get rangeCorr(): StateChange {
    return this._rangeCorr;
  }
  get memo(): StateChange {
    return this._memo;
  }


  isHide(): boolean {
    return this._fly.isTrue || this._dig.isTrue || this._dive.isTrue || this._shadowForce.isTrue;
  }

}
