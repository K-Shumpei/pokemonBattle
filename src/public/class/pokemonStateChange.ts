class StateChangeStatus {
  isTrue = false;
  turn = new ValueWithRange();
  count = 0;
  move: MoveText = null;
  order = new Order( true, 0 );

  reset(): void {
    this.isTrue = false;
    this.turn.value = this.turn.max;
    this.count = 0;
    this.move = null;
    this.order = new Order( true, 0 );
  }
}

class CannotEscape extends StateChangeStatus {

  onActivate( pokemon: Pokemon, target: Pokemon ): void {
    this.isTrue = true;
    this.order = new Order( pokemon.order.isMe, pokemon.order.hand );
    writeLog( `${target.getArticle()}は もう 逃げられない!` );
  }
}

class Curse extends StateChangeStatus {

  onActivate( pokemon: Pokemon, target: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は 自分の体力を 削って ${target.getArticle()}に のろいを かけた!` );
  }

  onElapse( pokemon: Pokemon ): void {
    writeLog( `${pokemon.getArticle()}は のろわれている! ` );
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
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      writeLog( `${pokemon.getArticle()}の かなしばりが 解けた! ` );
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
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      // writeLog( `${pokemon.getArticle()}の アンコールが 解けた! ` );
    }
  }
}

class FocusEnergy extends StateChangeStatus {

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
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      writeLog( `${pokemon.getArticle()}の かいふくふうじの 効果が切れた! ` );
    }
  }
}

class HelpingHand extends StateChangeStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate( pokemon: Pokemon, target: Pokemon ): void {
    this.isTrue = true;
    this.count += 1;
    writeLog( `${pokemon.getArticle()}は ${target.getArticle()}を 手助けする 体勢に入った!` );
  }
}

class LockOn extends StateChangeStatus {

  onActivate( pokemon: Pokemon, target: Pokemon ): void {
    this.isTrue = true;
    this.order.setInfo( target.order );
    writeLog( `${pokemon.getArticle()}は ${target.getArticle()}に ねらいを さだめた!` );
  }
}

class NoAbility extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は 特性が 効かなくなった!` );
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
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      writeLog( `${pokemon.getArticle()}は 挑発の効果が 解けた! ` );
    }
  }
}


class StateChangeSummary {

  cannotEscape = new CannotEscape(); // にげられない
  curse        = new Curse();        // のろい
  disable      = new Disable();      // かなしばり
  encore       = new Encore();       // アンコール
  focusEnergy  = new FocusEnergy();  // きゅうしょアップ
  healBlock    = new HealBlock();    // かいふくふうじ
  helpingHand  = new HelpingHand();  // てだすけ
  lockOn       = new LockOn();       // ロックオン
  noAbility    = new NoAbility();    // とくせいなし
  perishSong   = new PerishSong();   // ほろびのうた
  tarShot      = new TarShot();      // タールショット
  taunt        = new Taunt();        // ちょうはつ

  _flinch: StateChange; // ひるみ
  _bind: StateChange; // バインド

  // あくむ
  _attract: Attract; // メロメロ
  _leechSeed: StateChange; // やどりぎのタネ
  _yawn: StateChange; // ねむけ

  _embargo: StateChange; //さしおさえ

  _torment: StateChange; // いちゃもん


  _foresight: StateChange; // みやぶられている
  _miracleEye: StateChange; // ミラクルアイ
  _smackDown: StateChange; // うちおとす
  _telekinesis: StateChange; // テレキネシス



  _electrify: StateChange; // そうでん

  _powder: StateChange; // ふんじん
  _throatChop: StateChange; // じごくづき
  /*
  ハロウィン
  もりののろい
  ちゅうもくのまと
  */




  // たこがため
  _saltCure: StateChange; // しおづけ

  // わざを使ったポケモンに発生
  // ちゅうもくのまと
  _substitute: StateChange; // みがわり
  _protect: StateChange; // まもる


  /*
  キングシールド
  トーチカ
  ブロッキング
  */
  _minimize: StateChange; //ちいさくなる


  // まるくなる
  _destinyBond: StateChange; // みちづれ
  _grudge: StateChange; // おんねん

  _uproar: StateChange; // さわぐ
  // あばれる
  _imprison: StateChange;// ふういん
  _rage: StateChange; // いかり
  // マジックコート

  _ingrain: StateChange; // ねをはる
  _aquaRing: StateChange; //アクアリング
  _charge: StateChange; // じゅうでん
  _stockpile: StateChange; // たくわえる
  _magnetRise: StateChange; // でんじふゆう

  /*
  がまん
  パワートリック
  */
  _transform: Transform; // へんしん
  _fly: StateChange; // そらをとぶ
  _dig: StateChange; // あなをほる
  _dive: StateChange; // ダイビング
  _shadowForce: StateChange;// シャドーダイブ


  // ボディパージ
  // ほろびのうた

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
  _endure: StateChange; // こらえる
  _beakBlast: StateChange; // くちばしキャノン
  _focusPunch: StateChange; // きあいパンチ
  _noRetreat: StateChange; // はいすいのじん
  _someProtect: StateChange // まもる連続使用
  _endureMsg: StateChange; // HP1で耐える効果の保存
  _fling: StateChange; // なげつける
  _dynamax: StateChange; // ダイマックス
  _rangeCorr: StateChange; // 範囲補正
  _memo: StateChange; // メモ

  constructor() {
    this._flinch = new StateChange();
    this._bind = new StateChange();
    this._attract = new Attract();
    this._leechSeed = new StateChange();
    this._yawn = new StateChange();
    this._embargo = new StateChange();
    this._torment = new StateChange();
    this._foresight = new StateChange();
    this._miracleEye = new StateChange();
    this._smackDown = new StateChange();
    this._telekinesis = new StateChange();
    this._electrify = new StateChange();
    this._powder = new StateChange();
    this._throatChop = new StateChange();
    this._saltCure = new StateChange();

    this._substitute = new StateChange();
    this._protect = new StateChange();
    this._minimize = new StateChange();
    this._destinyBond = new StateChange();
    this._grudge = new StateChange();
    this._uproar = new StateChange();
    this._imprison = new StateChange();
    this._rage = new StateChange();
    this._ingrain = new StateChange();
    this._aquaRing = new StateChange();
    this._charge = new StateChange();
    this._stockpile = new StateChange();
    this._magnetRise = new StateChange();
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
    this._endure = new StateChange();
    this._beakBlast = new StateChange();
    this._focusPunch = new StateChange();
    this._noRetreat = new StateChange();
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
  set bind( bind: StateChange ) {
    this._bind = bind;
  }
  set attract( attract: Attract ) {
    this._attract = attract;
  }
  set leechSeed( leechSeed: StateChange ) {
    this._leechSeed = leechSeed;
  }
  set yawn( yawn: StateChange ) {
    this._yawn = yawn;
  }
  set embargo( embargo: StateChange ) {
    this._embargo = embargo;
  }
  set torment( torment: StateChange ) {
    this._torment = torment;
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
  set telekinesis( telekinesis: StateChange ) {
    this._telekinesis = telekinesis;
  }
  set electrify( electrify: StateChange ) {
    this._electrify = electrify;
  }
  set powder( powder: StateChange ) {
    this._powder = powder;
  }
  set throatChop( throatChop: StateChange ) {
    this._throatChop = throatChop;
  }
  set saltCure( saltCure: StateChange ) {
    this._saltCure = saltCure;
  }
  set substitute( substitute: StateChange ) {
    this._substitute = substitute;
  }
  set protect( protect: StateChange ) {
    this._protect = protect;
  }
  set minimize( minimize: StateChange ) {
    this._minimize = minimize;
  }
  set destinyBond( destinyBond: StateChange ) {
    this._destinyBond = destinyBond;
  }
  set grudge( grudge: StateChange ) {
    this._grudge = grudge;
  }
  set uproar( uproar: StateChange ) {
    this._uproar = uproar;
  }
  set imprison( imprison: StateChange ) {
    this._imprison = imprison;
  }
  set rage( rage: StateChange ) {
    this._rage = rage;
  }
  set ingrain( ingrain: StateChange ) {
    this._ingrain = ingrain;
  }
  set aquaRing( aquaRing: StateChange ) {
    this._aquaRing = aquaRing;
  }
  set charge( charge: StateChange ) {
    this._charge = charge;
  }
  set stockpile( stockpile: StateChange ) {
    this._stockpile = stockpile;
  }
  set magnetRise( magnetRise: StateChange ) {
    this._magnetRise = magnetRise;
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
  set endure( endure: StateChange ) {
    this._endure = endure;
  }
  set beakBlast( beakBlast: StateChange ) {
    this._beakBlast = beakBlast;
  }
  set focusPunch( focusPunch: StateChange ) {
    this._focusPunch = focusPunch;
  }
  set noRetreat( noRetreat: StateChange ) {
    this._noRetreat = noRetreat;
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
  get bind(): StateChange {
    return this._bind;
  }
  get attract(): Attract {
    return this._attract;
  }
  get leechSeed(): StateChange {
    return this._leechSeed;
  }
  get yawn(): StateChange {
    return this._yawn;
  }
  get embargo(): StateChange {
    return this._embargo;
  }
  get torment(): StateChange {
    return this._torment;
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
  get telekinesis(): StateChange {
    return this._telekinesis;
  }
  get electrify(): StateChange {
    return this._electrify;
  }
  get powder(): StateChange {
    return this._powder;
  }
  get throatChop(): StateChange {
    return this._throatChop;
  }
  get saltCure(): StateChange {
    return this._saltCure;
  }

  get substitute(): StateChange {
    return this._substitute;
  }
  get protect(): StateChange {
    return this._protect;
  }
  get minimize(): StateChange {
    return this._minimize;
  }
  get destinyBond(): StateChange {
    return this._destinyBond;
  }
  get grudge(): StateChange {
    return this._grudge;
  }
  get uproar(): StateChange {
    return this._uproar;
  }
  get imprison(): StateChange {
    return this._imprison;
  }
  get rage(): StateChange {
    return this._rage;
  }
  get ingrain(): StateChange {
    return this._ingrain;
  }
  get aquaRing(): StateChange {
    return this._aquaRing;
  }
  get charge(): StateChange {
    return this._charge;
  }
  get stockpile(): StateChange {
    return this._stockpile;
  }
  get magnetRise(): StateChange {
    return this._magnetRise;
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
  get endure(): StateChange {
    return this._endure;
  }
  get beakBlast(): StateChange {
    return this._beakBlast;
  }
  get focusPunch(): StateChange {
    return this._focusPunch;
  }
  get noRetreat(): StateChange {
    return this._noRetreat;
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
