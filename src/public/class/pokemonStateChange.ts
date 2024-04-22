class StateChangeStatus {
  isTrue = false;
  turn = new ValueWithRange();
  count = 0;
  move: MoveText = null;
  order = new Order( true, 0 );
  hp = new ValueWithRange();
  protect: MoveText = null; // まもる系統
  strong: boolean = false; // しめつけバンド

  reset(): void {
    this.isTrue = false;
    this.turn.value = this.turn.max;
    this.count = 0;
    this.move = null;
    this.order = new Order( true, 0 );
    this.hp = new ValueWithRange();
    this.protect = null;
    this.strong = false;
  }
}

class AquaRing extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は 水のリングを まとった!` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( pokemon.status.hp.value.isMax() ) return;
    const heal: number = Math.floor( pokemon.getOrgHP() / 16 );
    pokemon.status.hp.value.add( Math.max( 1, heal ) );
    writeLog( `${pokemon.getArticle()}は 水のリングで 体力を回復!` );
  }
}

class Autotomize extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は 身軽になった!` );
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
        writeLog( `${target.getArticle()}は 渦の中に 閉じこめられた!` );
        break;

      case 'Clamp': // 技「からではさむ」
        writeLog( `${target.getArticle()}は ${pokemon.getArticle()}の からに はさまれた!` );
        break;

      case 'Thunder Cage': // 技「サンダープリズン」
        writeLog( `${target.getArticle()}は ${pokemon.getArticle()}に 閉じこめられた!` );
        break;

      case 'Bind': // 技「しめつける」
        writeLog( `${target.getArticle()}は ${pokemon.getArticle()}に しめつけられた!` );
        break;

      case 'Sand Tomb': // 技「すなじごく」
        writeLog( `${target.getArticle()}は 砂じごくに 捕らわれた!` );
        break;

      case 'Snap Trap': // 技「トラバサミ」
        writeLog( `${target.getArticle()}は トラバサミに 捕らわれた!` );
        break;

      case 'Fire Spin': // 技「ほのおのうず」
        writeLog( `${target.getArticle()}は 炎の渦に 閉じこめられた!` );
        break;

      case 'Wrap': // 技「まきつく」
        writeLog( `${target.getArticle()}は ${pokemon.getArticle()}に 巻きつかれた!` );
        break;

      case 'Magma Storm': // 技「マグマストーム」
        writeLog( `${target.getArticle()}は マグマの渦に 閉じこめられた!` );
        break;

      case 'Infestation': // 技「まとわりつく」
        writeLog( `${target.getArticle()}は ${pokemon.getArticle()}に まとわりつかれた!` );
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
      writeLog( `${pokemon.getArticle()}は ${this.move}から 解放された!` );
      this.reset();
      return;
    }

    pokemon.status.hp.value.sub( Math.max( 1, getDamage() ) );
    writeLog( `${pokemon.getArticle()}は ${this.move}の ダメージを 受けている` );
  }
}

class CannotEscape extends StateChangeStatus {

  octolock: boolean = false;
  noRetreat: boolean = false;

  onActivate( pokemon: Pokemon, target: Pokemon ): void {
    this.isTrue = true;
    this.order = new Order( pokemon.order.isMe, pokemon.order.hand );
    writeLog( `${target.getArticle()}は もう 逃げられない!` );
  }

  onActivateNoMessage( pokemon: Pokemon ): void {
    this.isTrue = true;
    this.order = new Order( pokemon.order.isMe, pokemon.order.hand );
  }

  onActivateNoRetreat( pokemon: Pokemon, target: Pokemon ): void {
    this.isTrue = true;
    this.order = new Order( pokemon.order.isMe, pokemon.order.hand );
    this.noRetreat = true;
    writeLog( `${target.getArticle()}は はいすいのじんで 逃げることが できなくなった!` )
  }
}

class Charge extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は 充電を 始めた!` );
  }
}

class Curse extends StateChangeStatus {

  onActivate( pokemon: Pokemon, target: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は 自分の体力を 削って ${target.getArticle()}に のろいを かけた!` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;

    const damage: number = Math.floor( pokemon.getOrgHP() / 4 );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    writeLog( `${pokemon.getArticle()}は のろわれている! ` );
  }
}

class DestinyBond extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は 相手を 道連れに しようとしている!` );
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
    // writeLog( `${pokemon.getArticle()}の ${pokemon.move.selected.translate()}を 封じこめた! ` );
  }

  onElapse( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      writeLog( `${pokemon.getArticle()}の かなしばりが 解けた! ` );
    }
  }
}

class Electrify extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は そうでんで 技が でんきタイプになった! ` );
  }
}

class Embargo extends StateChangeStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は 道具が 使えなくなった! ` );
  }

  onElapse( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      writeLog( `${pokemon.getArticle()}は 道具が 使えるようになった! ` );
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
    writeLog( `${pokemon.getArticle()}は アンコールを受けた! ` );
  }

  onElapse( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      writeLog( `${pokemon.getArticle()}の アンコール状態が 解けた! ` );
    }
  }
}

class Endure extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は こらえる 体勢に 入った!` );
  }

}

class FocusEnergy extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は 張り切っている!` );
  }
}

class Grudge extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は 相手に おんねんを かけようとしている!` );
  }
}

class HealBlock extends StateChangeStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は 回復動作を 封じられた!` );
  }

  onElapse( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      writeLog( `${pokemon.getArticle()}の かいふくふうじの 効果が切れた! ` );
    }
  }
}

class HelpingHand extends StateChangeStatus {

  onActivate( pokemon: Pokemon, target: Pokemon ): void {
    this.isTrue = true;
    this.count += 1;
    writeLog( `${pokemon.getArticle()}は ${target.getArticle()}を 手助けする 体勢に入った!` );
  }
}

class Imprison extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は 相手の技を 封印した!` );
  }
}

class Ingrain extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は 根を はった!` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( pokemon.status.hp.value.isMax() ) return;
    const heal: number = Math.floor( pokemon.getOrgHP() / 16 );
    pokemon.status.hp.value.add( Math.max( 1, heal ) );
    writeLog( `${pokemon.getArticle()}は 根から 養分を 吸い取った!` );
  }
}

class LaserFocus extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は 精神を 研ぎ澄ました!` );
  }
}

class LeechSeed extends StateChangeStatus {

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
    writeLog( `やどりぎが ${pokemon.getArticle()}の 体力を奪う!` );
  }
}

class LockOn extends StateChangeStatus {

  onActivate( pokemon: Pokemon, target: Pokemon ): void {
    this.isTrue = true;
    this.order.setInfo( target.order );
    writeLog( `${pokemon.getArticle()}は ${target.getArticle()}に ねらいを さだめた!` );
  }
}

class MagicCoat extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は マジックコートに つつまれた!` );
  }
}

class MagnetRise extends StateChangeStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は 電磁力で 浮かびあがった!` );
  }

  onElapse( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      writeLog( `${pokemon.getArticle()}の 電磁力が なくなった! ` );
    }
  }
}

class Nightmare extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は あくむを 見始めた!` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    const damage: number = Math.floor( pokemon.getOrgHP() / 4 );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    writeLog( `${pokemon.getArticle()}は あくむに うなされている!` );
  }
}

class NoAbility extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は 特性が 効かなくなった!` );
  }
}

class Octolock extends StateChangeStatus {

  onActivate( pokemon: Pokemon, target: Pokemon ): void {
    this.isTrue = true;
    this.order = new Order( pokemon.order.isMe, pokemon.order.hand );
    writeLog( `${target.getArticle()}は たこがためで 逃げられなくなった!` );

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

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    writeLog( `${pokemon.getArticle()}の 滅びのカウントが ${this.turn.value}になった!` );
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
    writeLog( `${pokemon.getArticle()}に ふんじんを あびせた!` );
  }
}

class Protect extends StateChangeStatus {

  onActivate( pokemon: Pokemon, move: MoveText ): void {
    this.isTrue = true;
    this.protect = move;
    writeLog( `${pokemon.getArticle()}は 守りの 体勢に 入った!` );
  }
}

class SaltCure extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は しおづけに なった!` );
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
    writeLog( `${pokemon.getArticle()}は しおづけの ダメージを 受けている` );
  }
}

class Spotlight extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は 注目の的に なった!` );
  }
}

class Stockpile extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    this.count += 1;
    writeLog( `${pokemon.getArticle()}は ${this.count}つ たくわえた!` );

    pokemon.changeRank( 'def', 1 );
    pokemon.changeRank( 'spD', 1 );
  }
}

class Substitute extends StateChangeStatus {

  onActivate( pokemon: Pokemon, hp: number ): void {
    this.isTrue = true;
    this.hp = new ValueWithRange( hp, 0 );
    writeLog( `${pokemon.getArticle()}の 身代わりが 現れた!` );
  }
}

class TarShot extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は ほのおに 弱くなった!` );
  }
}

class Taunt extends StateChangeStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 3, 0 );
  }

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は 挑発に 乗ってしまった!` );
  }

  onElapse( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      writeLog( `${pokemon.getArticle()}は 挑発の効果が 解けた! ` );
    }
  }
}

class Telekinesis extends StateChangeStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 3, 0 );
  }

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}を 宙に 浮かせた!` );
  }

  onElapse( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      writeLog( `${pokemon.getArticle()}は テレキネシスから 解放された! ` );
    }
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
    writeLog( `${pokemon.getArticle()}は いちゃもんを つけられた!` );
  }

  onElapse( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    // if ( pokemon.move.selected.name !== 'G-Max Meltdown' ) return; // 技「キョダイユウゲキ」

    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      writeLog( `${pokemon.getArticle()}の いちゃもんの 効果が切れた! ` );
    }
  }
}




class StateChangeSummary {

  aquaRing     = new AquaRing();     // アクアリング
  autotomize   = new Autotomize();   // ボディパージ
  bind         = new Bind();         // バインド
  cannotEscape = new CannotEscape(); // にげられない
  charge       = new Charge();       // じゅうでん
  curse        = new Curse();        // のろい
  destinyBond  = new DestinyBond();  // みちづれ
  disable      = new Disable();      // かなしばり
  electrify    = new Electrify();    // そうでん
  embargo      = new Embargo();      // さしおさえ
  encore       = new Encore();       // アンコール
  endure       = new Endure();       // こらえる
  focusEnergy  = new FocusEnergy();  // きゅうしょアップ
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
  saltCure     = new SaltCure();     // しおづけ
  spotlight    = new Spotlight();    // ちゅうもくのまと
  stockpile    = new Stockpile();    // たくわえる
  substitute   = new Substitute();   // みがわり
  tarShot      = new TarShot();      // タールショット
  taunt        = new Taunt();        // ちょうはつ
  telekinesis  = new Telekinesis();  // テレキネシス
  torment      = new Torment();      // いちゃもん

  _flinch: StateChange; // ひるみ

  _attract: Attract; // メロメロ
  _yawn: StateChange; // ねむけ


  _foresight: StateChange; // みやぶられている
  _miracleEye: StateChange; // ミラクルアイ
  _smackDown: StateChange; // うちおとす

  _throatChop: StateChange; // じごくづき
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
  _rage: StateChange; // いかり
  /*
  がまん
  パワートリック
  */
  _transform: Transform; // へんしん
  _fly: StateChange; // そらをとぶ
  _dig: StateChange; // あなをほる
  _dive: StateChange; // ダイビング
  _shadowForce: StateChange;// シャドーダイブ
  _confuse: StateChange; // こんらん
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
  _truant: StateChange; // なまけ
  _slowStart: StateChange; // スロースタート
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
  _cannotMove: StateChange; // 反動で動けない
  _beakBlast: StateChange; // くちばしキャノン
  _focusPunch: StateChange; // きあいパンチ
  _someProtect: StateChange // まもる連続使用
  _endureMsg: StateChange; // HP1で耐える効果の保存
  _fling: StateChange; // なげつける
  _dynamax: StateChange; // ダイマックス
  _rangeCorr: StateChange; // 範囲補正
  _memo: StateChange; // メモ

  constructor() {
    this._flinch = new StateChange();
    this._attract = new Attract();
    this._yawn = new StateChange();
    this._foresight = new StateChange();
    this._miracleEye = new StateChange();
    this._smackDown = new StateChange();
    this._throatChop = new StateChange();
    this._saltCure = new StateChange();

    this._minimize = new StateChange();
    this._uproar = new StateChange();
    this._rage = new StateChange();
    this._transform = new Transform();
    this._fly = new StateChange();
    this._dig = new StateChange();
    this._dive = new StateChange();
    this._shadowForce = new StateChange();
    this._confuse = new StateChange();

    this._truant = new StateChange();
    this._slowStart = new StateChange();
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
    this._cannotMove = new StateChange();
    this._beakBlast = new StateChange();
    this._focusPunch = new StateChange();
    this._someProtect = new StateChange();
    this._endureMsg = new StateChange();
    this._fling = new StateChange();
    this._dynamax = new StateChange();
    this._rangeCorr = new StateChange();
    this._memo = new StateChange();
  }

  set flinch( flinch: StateChange ) {
    this._flinch = flinch;
  }
  set attract( attract: Attract ) {
    this._attract = attract;
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
  set throatChop( throatChop: StateChange ) {
    this._throatChop = throatChop;
  }
  set minimize( minimize: StateChange ) {
    this._minimize = minimize;
  }
  set uproar( uproar: StateChange ) {
    this._uproar = uproar;
  }
  set rage( rage: StateChange ) {
    this._rage = rage;
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
  set confuse( confuse: StateChange ) {
    this._confuse = confuse;
  }
  set truant( truant: StateChange ) {
    this._truant = truant;
  }
  set slowStart( slowStart: StateChange ) {
    this._slowStart = slowStart;
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
  set cannotMove( cannotMove: StateChange ) {
    this._cannotMove = cannotMove;
  }
  set beakBlast( beakBlast: StateChange ) {
    this._beakBlast = beakBlast;
  }
  set focusPunch( focusPunch: StateChange ) {
    this._focusPunch = focusPunch;
  }
  set someProtect( someProtect: StateChange ) {
    this._someProtect = someProtect;
  }
  set endureMsg( endureMsg: StateChange ) {
    this._endureMsg = endureMsg;
  }
  set fling( fling: StateChange ) {
    this._fling = fling;
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

  get flinch(): StateChange {
    return this._flinch;
  }
  get attract(): Attract {
    return this._attract;
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
  get throatChop(): StateChange {
    return this._throatChop;
  }
  get minimize(): StateChange {
    return this._minimize;
  }
  get uproar(): StateChange {
    return this._uproar;
  }
  get rage(): StateChange {
    return this._rage;
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
  get confuse(): StateChange {
    return this._confuse;
  }
  get truant(): StateChange {
    return this._truant;
  }
  get slowStart(): StateChange {
    return this._slowStart;
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
  get cannotMove(): StateChange {
    return this._cannotMove;
  }
  get beakBlast(): StateChange {
    return this._beakBlast;
  }
  get focusPunch(): StateChange {
    return this._focusPunch;
  }
  get someProtect(): StateChange {
    return this._someProtect;
  }
  get endureMsg(): StateChange {
    return this._endureMsg;
  }
  get fling(): StateChange {
    return this._fling;
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
  getConfusion( name: string ): void {
    const turn: number = Math.floor( getRandom() * 0.04 ) + 2; // 2,3,4,5のいずれか
    this._confuse.isTrue = true;
    this._confuse.turn = turn;

    writeLog( `${name}は 混乱した!` );
  }
}
