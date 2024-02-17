class Order {
  _team: boolean;
  _party: number;
  _hand: number;
  _battle: number | null;

  constructor( team: boolean, slot: number ) {
    this._team = team;
    this._party = slot;
    this._hand = slot;
    this._battle = null;
  }

  set team( team: boolean ) {
    this._team = team;
  }
  set party( party: number ) {
    this._party = party;
  }
  set hand( hand: number ) {
    this._hand = hand;
  }
  set battle( battle: number | null ) {
    this._battle = battle;
  }

  get team(): boolean {
    return this._team;
  }
  get party(): number {
    return this._party;
  }
  get hand(): number {
    return this._hand
  }
  get battle(): number | null {
    return this._battle;
  }
}



class ParameterSix {
  [key: string]: number;

  _hitPoint: number;
  _attack: number;
  _defense: number;
  _specialAttack: number;
  _specialDefense: number;
  _speed: number;

  constructor() {
    this._hitPoint = 0;
    this._attack = 0;
    this._defense = 0;
    this._specialAttack = 0;
    this._specialDefense = 0;
    this._speed = 0;
  }

  set hitPoint( hitPoint: number ) {
    this._hitPoint = hitPoint;
  }
  set attack( attack: number ) {
    this._attack = attack;
  }
  set defense( defense: number ) {
    this._defense = defense;
  }
  set specialAttack( specialAttack: number ) {
    this._specialAttack = specialAttack;
  }
  set specialDefense( specialDefense: number ) {
    this._specialDefense = specialDefense;
  }
  set speed( speed: number ) {
    this._speed = speed;
  }

  get hitPoint(): number {
    return this._hitPoint;
  }
  get attack(): number {
    return this._attack;
  }
  get defense(): number {
    return this._defense;
  }
  get specialAttack(): number {
    return this._specialAttack;
  }
  get specialDefense(): number {
    return this._specialDefense;
  }
  get speed(): number {
    return this._speed;
  }
}


class Attack {
  _field: boolean;
  _isMe: boolean;
  _battle: number;
  _party: number;
  _success: boolean;
  _damage: number;
  _effective: number;
  _critical: boolean;
  _substitute: boolean;

  constructor( field: boolean, isMe: boolean, battle: number ) {
    this._field = field;
    this._isMe = isMe;
    this._battle = battle;
    this._party = 0;
    this._success = true;
    this._damage = 0;
    this._effective = 0;
    this._critical = false;
    this._substitute = false;
  }

  set success( success: boolean ) {
    this._success = success;
  }
  set damage( damage: number ) {
    this._damage = damage;
  }
  set critical( critical: boolean ) {
    this._critical = critical;
  }
  set substitute( substitute: boolean ) {
    this._substitute = substitute;
  }

  get isMe(): boolean {
    return this._isMe;
  }
  get battle(): number {
    return this._battle;
  }
  get party(): number {
    return this._party;
  }
  get success(): boolean {
    return this._success;
  }
  get damage(): number {
    return this._damage;
  }
  get effective(): number {
    return this._effective;
  }
  get critical(): boolean {
    return this._critical;
  }
  get substitute(): boolean {
    return this._substitute;
  }

  failure(): void {
    this._success === false;
    writeLog( `しかし うまく決まらなかった...` );
  }

  isField(): boolean {
    return this._field;
  }

  calcEffective( move: SelectedMove, target: Pokemon ): void {

    const rate = ( comp: TypeCompatibilityType, defType: PokemonType ): number => {
      const rate = comp.rate.filter( r => r.defType === defType )[0].rate;

      if ( rate === 0.0 && target.item.isName( 'ねらいのまと' ) ) {
        return 1.0;
      }
      if ( move.isName( 'フリーズドライ' ) && defType === 'Water' ) {
        return 2.0;
      }

      return rate;
    }

    const calcRate = ( move: SelectedMove, target: Pokemon ): number => {
      let result: number = 1.0;
      const comp: TypeCompatibilityType = typeCompatibility.filter( t => t.atkType === move.type )[0];

      for ( const defType of target.type.get() ) {
        if ( defType === null ) continue;

        result = result * rate( comp, defType );
      }

      if ( target.stateChange.tarShot.isTrue && move.type === 'Fire' ) {
        result = result * 2.0;
      }

      return result;
    }

    if ( move.type === null ) return;
    this._effective = calcRate( move, target );
  }

  isNotEffective(): boolean {
    return this._effective === 0;
  }

}

class AttackList {
  _list: Attack[];

  constructor() {
    this._list = [];
  }

  reset(): void {
    this._list = [];
  }
  setField(): void {
    const attack = new Attack( true, false, 0 );
    this._list.push( attack );
  }
  setPokemon( isMe: boolean, battle: number ): void {
    if ( !main.isExistByBattle( isMe, battle ) ) return;
    const attack = new Attack( false, isMe, battle );
    this._list.push( attack );
  }
  getTarget(): Attack[] {
    return this._list;
  }
  getValidTarget(): Attack[] {
    return this._list.filter( l => l.success );
  }
  getTargetToPokemon(): Attack[] {
    return this._list.filter( l => l.success && !l.isField() );
  }
  getTargetToField(): Attack[] {
    return this._list.filter( l => l.success && l.isField() );
  }
  isFailure(): boolean {
    return !this._list.some( t => t.success );
  }
}

class Command {
  _move: number | null;
  _reserve: number | null;
  _myTarget: number | null;
  _opponentTarget: number | null;

  constructor() {
    this._move = null;
    this._reserve = null;
    this._myTarget = null;
    this._opponentTarget = null;
  }

  set move( move: number | null ) {
    this._move = move;
  }
  set reserve( reserve: number | null ) {
    this._reserve = reserve;
  }
  set myTarget( myTarget: number | null ) {
    this._myTarget = myTarget;
  }
  set opponentTarget( opponentTarget: number | null ) {
    this._opponentTarget = opponentTarget;
  }

  get move(): number | null {
    return this._move;
  }
  get reserve(): number | null {
    return this._reserve;
  }
  get myTarget(): number | null {
    return this._myTarget;
  }
  get opponentTarget(): number | null {
    return this._opponentTarget;
  }

  isAttack(): boolean {
    return this._move !== null;
  }
  isExchange(): boolean {
    return this._reserve !== null;
  }
}

class StateChange {
  _name: string | null;
  _isTrue: boolean;
  _turn: number;
  _count: number;
  _text: string;

  constructor( name: string | null ) {
    this._name = name;
    this._isTrue = false;
    this._turn = 0;
    this._count = 0;
    this._text = '';
  }

  set name( name: string | null ) {
    this._name = name;
  }
  set isTrue( isTrue: boolean ) {
    this._isTrue = isTrue;
  }
  set turn( turn: number ) {
    this._turn = turn;
  }
  set count( count: number ) {
    this._count = count;
  }
  set text( text: string ) {
    this._text = text;
  }

  get name(): string | null {
    return this._name;
  }
  get isTrue(): boolean {
    return this._isTrue;
  }
  get turn(): number {
    return this._turn;
  }
  get count(): number {
    return this._count;
  }
  get text(): string {
    return this._text;
  }

  reset(): void {
    this._isTrue = false;
    this._turn = 0;
    this._count = 0;
    this._text = '';
  }


}

class Transform extends StateChange {
  isTransform( name: PokemonText ): boolean {
    return this._isTrue && this._name === name;
  }
}

class CannotEscape extends StateChange {
  _order: Order;

  constructor( name: string | null ) {
    super( name );
    this._order = new Order( true, 0 );
  }

  beTrue( order: Order ): void {
    this._isTrue = true;
    this._order.team = order.team;
    this._order.party = order.party;
  }
}

class Attract extends StateChange {
  _order: Order;

  constructor( name: string | null ) {
    super( name );
    this._order = new Order( true, 0 );
  }

  beTrue( order: Order ): void {
    this._isTrue = true;
    this._order.team = order.team;
    this._order.party = order.party;
  }
}


class StateChangeSummary {

  _flinch: StateChange; // ひるみ
  _bind: StateChange; // バインド
  _curse: StateChange; // のろい
  // あくむ
  _attract: Attract; // メロメロ
  _leechSeed: StateChange; // やどりぎのタネ
  _yawn: StateChange; // ねむけ
  _perishSong: StateChange; // ほろびのうた
  _noAbility: StateChange; // とくせいなし
  _healBlock: StateChange; // かいふくふうじ
  _embargo: StateChange; //さしおさえ
  _encore: StateChange; // アンコール
  _torment: StateChange; // いちゃもん
  _taunt: StateChange; // ちょうはつ
  _disable: StateChange; // かなしばり
  _foresight: StateChange; // みやぶられている
  _miracleEye: StateChange; // ミラクルアイ
  _helpingHand: StateChange; // てだすけ
  _smackDown: StateChange; // うちおとす
  _telekinesis: StateChange; // テレキネシス


  _cannotEscape: CannotEscape; // にげられない
  _electrify: StateChange; // そうでん

  _powder: StateChange; // ふんじん
  _throatChop: StateChange; // じごくづき
  /*
  ハロウィン
  もりののろい
  ちゅうもくのまと
  */

  _tarShot: StateChange; // タールショット


  // たこがため
  _saltCure: StateChange; // しおづけ

  // わざを使ったポケモンに発生
  _focusEnergy: StateChange; // きゅうしょアップ
  // ちゅうもくのまと
  _substitute: StateChange; // みがわり
  _protect: StateChange; // まもる
  _lockOn: StateChange; //ロックオン (第五世代以降)

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
    this._flinch = new StateChange( 'ひるみ');
    this._bind = new StateChange( 'バインド' );
    this._curse = new StateChange( 'のろい' );
    this._attract = new Attract( 'メロメロ' );
    this._leechSeed = new StateChange( 'やどりぎのタネ' );
    this._yawn = new StateChange( 'ねむけ' );
    this._perishSong = new StateChange( 'ほろびのうた' );
    this._noAbility = new StateChange( 'とくせいなし' );
    this._healBlock = new StateChange( 'かいふくふうじ' );
    this._embargo = new StateChange( 'さしおさえ' );
    this._encore = new StateChange( 'アンコール' );
    this._torment = new StateChange( 'いちゃもん' );
    this._taunt = new StateChange( 'ちょうはつ' );
    this._disable = new StateChange( 'かなしばり' );
    this._foresight = new StateChange( 'みやぶられている' );
    this._miracleEye = new StateChange( 'ミラクルアイ' );
    this._helpingHand = new StateChange( 'てだすけ' );
    this._smackDown = new StateChange( 'うちおとす' );
    this._telekinesis = new StateChange( 'テレキネシス' );
    this._cannotEscape = new CannotEscape( 'にげられない' ) ;
    this._electrify = new StateChange( 'そうでん' );
    this._powder = new StateChange( 'ふんじん' );
    this._throatChop = new StateChange( 'じごくづき' );
    this._tarShot = new StateChange( 'タールショット' );
    this._saltCure = new StateChange( 'しおづけ' );

    this._focusEnergy = new StateChange( 'きゅうしょアップ' );
    this._substitute = new StateChange( 'みがわり' );
    this._protect = new StateChange( 'まもる' );
    this._lockOn = new StateChange( 'ロックオン' );
    this._minimize = new StateChange( 'ちいさくなる' );
    this._destinyBond = new StateChange( 'みちづれ' );
    this._grudge = new StateChange( 'おんねん' );
    this._uproar = new StateChange( 'さわぐ' );
    this._imprison = new StateChange( 'ふういん' );
    this._rage = new StateChange( 'いかり' );
    this._ingrain = new StateChange( 'ねをはる' );
    this._aquaRing = new StateChange( 'アクアリング' );
    this._charge = new StateChange( 'じゅうでん' );
    this._stockpile = new StateChange( 'たくわえる' );
    this._magnetRise = new StateChange( 'でんじふゆう' );
    this._transform = new Transform( 'へんしん' );
    this._fly = new StateChange( 'そらを飛ぶ' );
    this._dig = new StateChange( 'あなをほる' );
    this._dive = new StateChange( 'ダイビング' );
    this._shadowForce = new StateChange( 'シャドーダイブ' );
    this._confuse = new StateChange( 'こんらん' );

    this._truant = new StateChange( 'なまけ' );
    this._slowStart = new StateChange( 'スロースタート' );
    this._disguise = new StateChange( 'ばけのかわ' );
    this._iceFace = new StateChange( 'アイスフェイス' );
    this._protean = new StateChange( 'へんげんじざい' );
    this._quarkDrive = new StateChange( 'クォークチャージ' );
    this._protosynthesis = new StateChange( 'こだいかっせい' );
    this._flashFire = new StateChange( 'もらいび' );
    this._sheerForce = new StateChange( 'ちからずく' );
    this._synchronize = new StateChange( 'シンクロ' );
    this._gulpMissile = new StateChange( 'うのミサイル' );
    this._gem = new StateChange( 'ジュエル' );
    this._micleBerry = new StateChange( 'ミクルのみ' );
    this._halfBerry = new StateChange( '半減きのみ' );
    this._cannotMove = new StateChange( '反動で動けない' );
    this._endure = new StateChange( 'こらえる' );
    this._beakBlast = new StateChange( 'くちばしキャノン' );
    this._focusPunch = new StateChange( 'きあいパンチ' );
    this._noRetreat = new StateChange( 'はいすいのじん' );
    this._someProtect = new StateChange( 'まもる連続使用' );
    this._endureMsg = new StateChange( 'HP1で耐える効果' );
    this._fling = new StateChange( 'なげつける' );
    this._dynamax = new StateChange( 'ダイマックス' );
    this._rangeCorr = new StateChange( '範囲補正' );
    this._memo = new StateChange( 'メモ' );
  }

  set flinch( flinch: StateChange ) {
    this._flinch = flinch;
  }
  set bind( bind: StateChange ) {
    this._bind = bind;
  }
  set curse( curse: StateChange ) {
    this._curse = curse;
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
  set perishSong( perishSong: StateChange ) {
    this._perishSong = perishSong;
  }
  set noAbility( noAbility: StateChange ) {
    this._noAbility = noAbility;
  }
  set healBlock( healBlock: StateChange ) {
    this._healBlock = healBlock;
  }
  set embargo( embargo: StateChange ) {
    this._embargo = embargo;
  }
  set encore( encore: StateChange ) {
    this._encore = encore;
  }
  set torment( torment: StateChange ) {
    this._torment = torment;
  }
  set taunt( taunt: StateChange ) {
    this._taunt = taunt;
  }
  set disable( disable: StateChange ) {
    this._disable = disable;
  }
  set foresight( foresight: StateChange ) {
    this._foresight = foresight;
  }
  set miracleEye( miracleEye: StateChange ) {
    this._miracleEye = miracleEye;
  }
  set helpingHand( helpingHand: StateChange ) {
    this._helpingHand = helpingHand;
  }
  set smackDown( smackDown: StateChange ) {
    this._smackDown = smackDown;
  }
  set telekinesis( telekinesis: StateChange ) {
    this._telekinesis = telekinesis;
  }
  set cannotEscape( cannotEscape: CannotEscape ) {
    this._cannotEscape = cannotEscape;
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
  set tarShot( tarShot: StateChange ) {
    this._tarShot = tarShot;
  }
  set saltCure( saltCure: StateChange ) {
    this._saltCure = saltCure;
  }
  set focusEnergy( focusEnergy: StateChange ) {
    this._focusEnergy = focusEnergy;
  }
  set substitute( substitute: StateChange ) {
    this._substitute = substitute;
  }
  set protect( protect: StateChange ) {
    this._protect = protect;
  }
  set lockOn( lockOn: StateChange ) {
    this._lockOn = lockOn;
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
  get curse(): StateChange {
    return this._curse;
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
  get perishSong(): StateChange {
    return this._perishSong;
  }
  get noAbility(): StateChange {
    return this._noAbility;
  }
  get healBlock(): StateChange {
    return this._healBlock;
  }
  get embargo(): StateChange {
    return this._embargo;
  }
  get encore(): StateChange {
    return this._encore;
  }
  get torment(): StateChange {
    return this._torment;
  }
  get taunt(): StateChange {
    return this._taunt;
  }
  get disable(): StateChange {
    return this._disable;
  }
  get foresight(): StateChange {
    return this._foresight;
  }
  get miracleEye(): StateChange {
    return this._miracleEye;
  }
  get helpingHand(): StateChange {
    return this._helpingHand;
  }
  get smackDown(): StateChange {
    return this._smackDown;
  }
  get telekinesis(): StateChange {
    return this._telekinesis;
  }
  get cannotEscape(): CannotEscape {
    return this._cannotEscape;
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
  get tarShot(): StateChange {
    return this._tarShot;
  }
  get saltCure(): StateChange {
    return this._saltCure;
  }
  get focusEnergy(): StateChange {
    return this._focusEnergy;
  }
  get substitute(): StateChange {
    return this._substitute;
  }
  get protect(): StateChange {
    return this._protect;
  }
  get lockOn(): StateChange {
    return this._lockOn;
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




class Ability {
  _name: string;
  _org: string;

  constructor() {
    this._name = '';
    this._org = '';
  }

  set name( name: string ) {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  isName( ability: string ): boolean {
    return this.isValid() && this._name === ability;
  }

  isValid(): boolean {
    return true;
  }

  setOrg( ability: string ): void {
    this._name = ability;
    this._org = ability;
  }

  changeMaster(): changeAbilityType {

    for ( const info of changeAbilityTable ) {
      if ( info.name === this._name ) {
        return info;
      }
    }

    const sample = {
      name: '',
      exchange: 4,
      overwrite: 4,
      noAbility: 4,
      neutral: 4,
      copy: 4,
      copied: 4,
      transform: 4 };

    return sample;
  }
}

class Item {
  _name: string | null;
  _recycle: string | null;
  _belch: boolean;
  _pokeName: string;

  constructor() {
    this._name = null;
    this._recycle = null;
    this._belch = false;
    this._pokeName = '';
  }

  set name( name: string | null ) {
    this._name = name;
  }
  set belch( belch: boolean ) {
    this._belch = belch;
  }

  get name(): string | null {
    return this._name;
  }
  get belch(): boolean {
    return this._belch;
  }

  copyFromOpp( name: string | null, pokeName: string ): void {
    this._name = name;
    this._pokeName = pokeName;
  }

  isNull(): boolean {
    return this._name === null;
  }
  isValid(): boolean {
    return true;
  }
  isName( name: string ): boolean {
    return this.isValid() && this._name === name;
  }
  isBerry(): boolean {
    // return this._name ===
    return false;
  }
  recyclable(): void {
    if ( this._recycle === null ) this._recycle = this._name;
    this._name = null;
  }
  getMaster(): ItemData {
    return itemMaster.filter( i => i.nameEN === this._name )[0];
  }
  getCategory() {
    return categoryList.filter( c => c.name === this.getMaster().category )[0];
  }

  isReleasable( name: PokemonText, ability: string ): boolean {
    if ( this.isNull() ) return false;
    const master: ItemData = this.getMaster();
    const category = this.getCategory();

    if ( this.isName( 'はっきんだま' ) && name === 'Giratina Origin' ) return false;
    if ( master.category === 'plates' && name === 'Arceus' ) return false;
    if ( master.category === 'species-specific' && master.nameEN.includes( 'Drive' ) && name === 'Genesect' ) return false;
    if ( master.category === 'memories' && name === 'Silvally' ) return false;
    if ( this.isName( 'くちたけん' ) && name === 'Zacian Crowned' ) return false;
    if ( this.isName( 'くちたたて' ) && name === 'Zamazenta Crowned' ) return false;
    if ( master.category === 'mega-stones' ) return false;
    if ( this.isName( 'あいいろのたま' ) && name === 'Kyogre Primal' ) return false;
    if ( this.isName( 'べにいろのたま' ) && name === 'Groudon Primal' ) return false;
    if ( this.isName( 'ブーストエナジー' ) && ability === 'こだいかっせい' ) return false;
    if ( this.isName( 'ブーストエナジー' ) && ability === 'クォークチャージ' ) return false;
    if ( master.category === 'z-crystals' ) return false;

    return true;
  }
}


class Type {
  _list: PokemonType[];

  constructor() {
    this._list = [];
  }

  set list( list: PokemonType[] ) {
    this._list = list;
  }

  copyFromOpp( list: PokemonType[] ): void {
    this._list = list;
  }
  get(): PokemonType[] {
    return this._list;
  }
  has( type: PokemonType ): boolean {
    return this._list.includes( type );
  }
  isOnly( type: PokemonType ): boolean {
    return this.get().length === 1 && this.get()[0] === type;
  }
  toType( type: PokemonType ): void {
    this._list = [ type ];
  }
}




class Pokemon {
  _host: boolean;
  _id: number;
  _order: Order;

  _name: PokemonText;
  _level: number;
  _type: Type;
  _gender: Gender;
  _ability: Ability;
  _item: Item;
  _nature: NatureText;
  _status: Status;
  _move: Move;

  _happiness: number;
  _statusAilment: StatusAilment;

  _attack: AttackList;
  _command: Command;
  _stateChange: StateChangeSummary;
  _actionOrder: ActionOrder;

  constructor( slot: number, isMe: boolean ) {
    this._host = true;
    this._id = 0;
    this._order = new Order( isMe, slot );

    this._name = null;
    this._level = 50;
    this._type = new Type();
    this._gender = 'genderless';
    this._ability = new Ability();
    this._item = new Item();
    this._nature = 'Bashful';
    this._status = new Status();
    this._move = new Move();

    this._happiness = 255;
    this._statusAilment = new StatusAilment();

    this._attack = new AttackList();
    this._command = new Command;
    this._stateChange = new StateChangeSummary();
    this._actionOrder = new ActionOrder();
  }

  set id( id: number ) {
    this._id = id;
  }
  set command( command: Command ) {
    this._command = command;
  }
  set stateChange( stateChange: StateChangeSummary ) {
    this._stateChange = stateChange;
  }

  set name( name: PokemonText ) {
    this._name = name;
  }
  set type( type: Type ) {
    this._type = type;
  }
  set gender( gender: Gender ) {
    this._gender = gender;
  }

  set level( level: number ) {
    this._level = level;
  }
  set item( item: Item ) {
    this._item = item;
  }
  set nature( nature: NatureText ) {
    this._nature = nature;
  }
  set happiness( happiness: number ) {
    this._happiness = happiness;
  }
  set statusAilment( statusAilment: StatusAilment ) {
    this._statusAilment = statusAilment;
  }


  get host(): boolean {
    return this._host;
  }
  get id(): number {
    return this._id;
  }
  get order(): Order {
    return this._order;
  }

  get status(): Status {
    return this._status;
  }

  get move(): Move {
    return this._move;
  }
  get attack(): AttackList {
    return this._attack;
  }
  get command(): Command {
    return this._command;
  }
  get stateChange(): StateChangeSummary {
    return this._stateChange;
  }

  get type(): Type {
    return this._type;
  }
  get gender(): Gender {
    return this._gender;
  }
  get ability(): Ability {
    return this._ability;
  }
  get level(): number {
    return this._level;
  }
  get item(): Item {
    return this._item;
  }
  get nature(): NatureText {
    return this._nature;
  }
  get happiness(): number {
    return this._happiness;
  }
  get statusAilment(): StatusAilment {
    return this._statusAilment;
  }
  get actionOrder(): ActionOrder {
    return this._actionOrder;
  }

  reset(): void {
    const isMe: boolean = this.isMine();
    const partyOrder: number = this._order.party;
    const imageHTML = getHTMLInputElement( 'myParty_image' + partyOrder );
    imageHTML.src = '';

    this._order = new Order( isMe, partyOrder );

    this._name = null;
    this._level = 50;
    this._type = new Type();
    this._gender = 'genderless';
    this._ability = new Ability();
    this._item = new Item();
    this._nature = 'Bashful';
    this._status = new Status();
    this._move = new Move();

    this._happiness = 255;
    this._statusAilment = new StatusAilment();

    this._attack = new AttackList();
    this._command = new Command();
    this._stateChange = new StateChangeSummary();
  }


  register( reg: Register ): void {
    this._id = reg.id;
    this._name = reg.name;
    this._level = reg.level;
    this._type.list = reg.type;
    this._gender = reg.gender.value;
    this._ability.setOrg( reg.ability.value );
    this._item.name = reg.item;
    this._nature = reg.nature;
    this._status.register( reg.stat );
    this._move.register( reg.move );
  }

  copyFromOpp( opp: Pokemon ): void {
    this._id = opp._id;
    this._name = opp._name;
    this._type.copyFromOpp( opp._type._list );
    this._gender = opp._gender;
    this._ability.setOrg( opp._ability._name );
    this._level = opp._level;
    this._item.copyFromOpp( opp._item._name, opp._item._pokeName );
    this._nature = opp._nature;
    this._status.copyFromOpp( opp._status );
    this._move.copyFromOpp( opp._move._learned );
  }

  showHandInfo(): void {
    getHTMLInputElement( 'party' + this._order.hand + '_name' ).textContent = ( this._name === null )? '名前' : this.translateName( this._name );
    getHTMLInputElement( 'party' + this._order.hand + '_gender' ).textContent = ( this._name === null )? '性別' : this.translateGender();
    getHTMLInputElement( 'party' + this._order.hand + '_level' ).textContent = ( this._name === null )? '' : String( this._level );
    getHTMLInputElement( 'party' + this._order.hand + '_ability' ).textContent = ( this._name === null )? '特性' : this.translateAbility( this._ability.name );
    getHTMLInputElement( 'party' + this._order.hand + '_remainingHP' ).textContent = ( this._name === null )? '' : String( this._status.hp.value.value );
    getHTMLInputElement( 'party' + this._order.hand + '_item' ).textContent = ( this._name === null )? '持ち物' : String( this._item.name );

    if ( this._type.get().length === 0 ) {
      getHTMLInputElement( 'party' + this._order.hand + '_type1' ).textContent = 'タイプ';
      getHTMLInputElement( 'party' + this._order.hand + '_type2' ).textContent = '';
    } else if ( this._type.get().length === 1 ) {
      getHTMLInputElement( 'party' + this._order.hand + '_type1' ).textContent = this.translateType( String( this._type.get()[0] ) );
      getHTMLInputElement( 'party' + this._order.hand + '_type2' ).textContent = '';
    } else if ( this._type.get().length === 2 ) {
      getHTMLInputElement( 'party' + this._order.hand + '_type1' ).textContent = this.translateType( String( this._type.get()[0] ) );
      getHTMLInputElement( 'party' + this._order.hand + '_type2' ).textContent = this.translateType( String( this._type.get()[1] ) );
    }

    this._status.show( this._name, this._order.hand );
    this._move.show( this._order.hand );
  }

  showPartyImage(): void {
    const partyOrder: number = this._order.party;
    const imageHTML = getHTMLInputElement( 'myParty_image' + partyOrder );

    imageHTML.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + this._id + '.png';
  }

  translateName( name: string ): string {

    for ( const data of pokemonMaster ) {
      if ( data.nameEN === name ) return data.nameJA;
      if ( data.nameJA === name ) return data.nameEN;
    }
    return '';
  }

  translateType( name: string ): string {
    for ( const data of typeTextMaster ) {
      if ( data.nameEN === name ) return data.nameJA;
      if ( data.nameJA === name ) return String( data.nameEN );
    }
    return name;
  }

  translateGender(): string {
    if ( this._gender === 'male' ) return '♂';
    if ( this._gender === 'female' ) return '♀';
    if ( this._gender === 'genderless' ) return '-';

    return '-'
  }

  translateAbility( name: string ): string {
    for ( const data of abilityMaster ) {
      if ( data.nameEN === name ) return data.nameJA;
      if ( data.nameJA === name ) return data.nameEN;
    }
    return name;
  }

  isName( name: string ): boolean {
    return this._name === name;
  }

  isMine(): boolean {
    return this._order.team;
  }

  //----------
  // メッセージ
  //----------
  isMeToStr(): string {
    if ( this.isMine() ) return '自分';
    else return '相手';
  }
  msgToBattleField(): void {
    writeLog( `${this.isMeToStr()}は ${this.translateName( String(this._name) )}を くりだした!` );
  }
  getArticle(): string {
    if ( this._name === null ) return ''
    if ( this.isMine() ) return this.translateName( this._name );
    else return '相手の' + this.translateName( this._name );
  }

  msgQuickDraw(): void {
    writeLog( `${this.getArticle()}は クイックドロウで 行動が はやくなった!` );
  }
  msgQuickClaw(): void {
    writeLog( `${this.getArticle()}は せんせいのつめで 行動が はやくなった!` );
  }
  msgCustapBerry(): void {
    writeLog( `${this.getArticle()}は イバンのみで 行動が はやくなった!` );
  }
  msgCannotMove(): void {
    writeLog( `${this.getArticle()}は 攻撃の 反動で 動けない!` );
  }
  msgStillAsleep(): void {
    writeLog( `${this.getArticle()}は ぐうぐう 眠っている` );
  }
  msgStillFrozen(): void {
    writeLog( `${this.getArticle()}は 凍ってしまって 動けない!` );
  }
  msgNoPowerPoint(): void {
    writeLog( `しかし 技の 残りポイントが なかった!` );
  }
  msgTruant(): void {
    writeLog( `${this.getArticle()}は なまけている` );
  }
  msgFocusPunch(): void {
    writeLog( `${this.getArticle()}は 集中が 途切れて 技が 出せない!` );
  }
  msgFlinch(): void {
    writeLog( `${this.getArticle()}は ひるんで 技が 出せない!` );
  }
  msgDisable(): void {
    writeLog( `${this.getArticle()}は かなしばりで 技が 出せない!` );
  }
  msgGravity(): void {
    writeLog( `${this.getArticle()}は じゅうりょくが 強くて ${this._move.selected.translate()}が 出せない!` );
  }
  msgHealBlock(): void {
    writeLog( `${this.getArticle()}は かいふくふうじで 技が 出せない!` );
  }
  msgThroatChop(): void {
    writeLog( `${this.getArticle()}は じごくづきの効果で 技が 出せない!` );
  }
  msgTaunt(): void {
    writeLog( `${this.getArticle()}は ちょうはつされて 技が 出せない!` );
  }
  msgImprison(): void {
    writeLog( `${this.getArticle()}は ふういんで 技が 出せない!` );
  }
  msgStillConfuse(): void {
    writeLog( `${this.getArticle()}は 混乱している!` );
  }
  msgAttackMyself(): void {
    writeLog( `わけも わからず 自分を 攻撃した!` );
  }
  msgParalysis(): void {
    writeLog( `${this.getArticle()}は 体がしびれて 動かない!` );
  }
  msgMeltByMove(): void {
    writeLog( `${this.getArticle()}の ${this._move.selected.translate()}で こおりがとけた!` );
  }
  msgDeclareMove(): void {
    writeLog( `${this.getArticle()}の ${this._move.selected.translate()}!` );
  }
  msgDeclareAbility(): void {
    writeLog( `${this.translateName( String(this._name) )}の ${this.translateAbility( this._ability.name )}` );
  }
  msgDeclareFailure(): void {
    writeLog( `しかし うまく決まらなかった....` );
  }
  msgBadRainy(): void {
    writeLog( `強い雨の 影響で ほのおタイプの 攻撃が 消失した!` );
  }
  msgBadSunny(): void {
    writeLog( `強い日差しの 影響で みずタイプの 攻撃が 蒸発した!` );
  }
  msgPowder(): void {
    writeLog( `${this._move.selected.translate()}に 反応して ふんじんが 爆発した!` );
  }
  msgInvalidUser(): void {
    writeLog( `しかし ${this.getArticle()}には 使うことが できなかった!` );
  }
  msgRefWeight(): void {
    writeLog( `${this.getArticle()}は 首を 横に振った` );
    writeLog( `この技を しかけることが できないようだ......` );
  }
  msgCannotUse(): void {
    writeLog( `${this.getArticle()}は ${this._move.selected.translate()}が 使えない!` );
  }
  msgFutureSight(): void {
    writeLog( `${this.getArticle()}は 未来に 攻撃を予知した!` );
  }
  msgDoomDesire(): void {
    writeLog( `${this.getArticle()}は はめつのねがいを 未来に託した!` );
  }
  msgProtean(): void {
    writeLog( `${this.getArticle()}は ${this._type.get()[0]}タイプに なった!` );
  }
  msgPowerHerb(): void {
    writeLog( `${this.getArticle()}は パワフルハーブで 力が みなぎった!` );
  }
  msgNotHit(): void {
    writeLog( `${this.getArticle()}には 当たらなかった!` );
  }
  msgPsychicTerrain(): void {
    writeLog( `${this.getArticle()}は サイコフィールドに 守られている!` );
  }
  msgQuickGuard(): void {
    writeLog( `${this.getArticle()}は ファストガードで 守られた!` );
  }
  msgWideGuard(): void {
    writeLog( `${this.getArticle()}は ワイドガードで 守られた!` );
  }
  msgCraftyShield(): void {
    writeLog( `${this.getArticle()}は トリックガードで 守られた!` );
  }
  msgProtect(): void {
    writeLog( `${this.getArticle()}は 攻撃から 身を守った!` );
  }
  msgHurt(): void {
    writeLog( `${this.getArticle()}は 傷ついた!` );
  }
  msgMatBlock(): void {
    writeLog( `${this._move.selected.translate()}は たたみがえしで 防がれた!` );
  }
  msgInvalid(): void {
    writeLog( `${this.getArticle()}には 効果がないようだ...` );
  }
  msgSafetyGoggles( move: string ): void {
    writeLog( `${this.getArticle()}は ぼうじんゴーグルで ${move}を 受けない!` );
  }

  msgDamage( damage: number ): void {
    writeLog( `${damage}の ダメージ!` );
  }
  msgSuperEffective( targetName: string ): void {
    if ( this._attack.getTarget().length === 1 ) {
      writeLog( `効果は バツグンだ!` );
    } else {
      writeLog( `${targetName}に 効果は バツグンだ!` );
    }
  }
  msgNotEffective( targetName: string ): void {
    if ( this._attack.getTarget().length === 1 ) {
      writeLog( `${targetName}に 効果は 今ひとつのようだ......` );
    } else {
      writeLog( `${targetName}に 効果は いまひとつだ` );
    }
  }
  msgCritical( targetName: string ): void {
    if ( this._attack.getTarget().length === 1 ) {
      writeLog( `急所に 当たった!` );
    } else {
      writeLog( `${targetName}に 急所に 当たった!` );
    }
  }
  msgEndure(): void {
    writeLog( `${this.getArticle()}は 攻撃を こらえた!` );
  }
  msgFocusSash(): void {
    writeLog( `${this.getArticle()}は きあいのタスキで 持ちこたえた!` );
  }
  msgFocusBand(): void {
    writeLog( `${this.getArticle()}は きあいのハチマキで 持ちこたえた!` );
  }
  msgCannotEscape(): void {
    writeLog( `${this.getArticle()}は もう 逃げられない!` );
  }
  msgSaltCure(): void {
    writeLog( `${this.getArticle()}は しおづけに なった!` );
  }
  msgWhiteHerb(): void {
    writeLog( `${this.getArticle()}は しろいハーブで ステータスを 元に戻した!` );
  }
  msgLiquidOoze(): void {
    writeLog( `${this.getArticle()}は ヘドロえきを 吸い取った!` );
  }
  msgDrain( targetName: string ): void {
    writeLog( `${targetName}から 体力を 吸い取った!` );
  }
  msgRage(): void {
    writeLog( `${this.getArticle()}の いかりのボルテージが 上がっていく!` );
  }
  msgClearSmog(): void {
    writeLog( `全ての ステータスが 元に 戻った!` );
  }
  msgGrudge(): void {
    writeLog( `${this.getArticle()}の ${this._move.learned[this._move.selected.slot].translate()}は おんねんで PPが0になった!` );
  }
  msgProtectivePads(): void {
    writeLog( `${this.getArticle()}は ぼうごパットで 防いだ!` );
  }
  msgRoughSkin(): void {
    writeLog( `${this.getArticle()}は 傷ついた!` );
  }
  msgAttract(): void {
    writeLog( `${this.getArticle()}は メロメロに なった!` );
  }
  msgMummy(): void {
    writeLog( `${this.getArticle()}は とくせいが ミイラになっちゃった!` );
  }
  msgLingeringAroma(): void {
    writeLog( `${this.getArticle()}は においが うつって とれなくなっちゃった!` );
  }
  msgExchangeAbility(): void {
    writeLog( `${this.getArticle()}は おたがいの とくせいを 入れ替えた!` );
  }
  msgPerishBodySide(): void {
    writeLog( `${this.getArticle()}は 3ターン後に 滅びてしまう!` );
  }
  msgPerishBodyAll(): void {
    writeLog( `おたがいは 3ターン後に 滅びてしまう!` );
  }
  msgCursedBody(): void {
    writeLog( `${this.getArticle()}の ${this._stateChange.disable.text}を 封じこめた!` );
  }
  msgElectromorphosis( moveName: string ): void {
    writeLog( `${this.getArticle()}は ${moveName}を 受けて 充電した!` );
  }
  msgAngerPoint(): void {
    writeLog( `${this.getArticle()}は 攻撃が 最大まで 上がった!` );
  }
  msgHalfBerry(): void {
    writeLog( `${this.getArticle()}への ダメージを ${this._stateChange.halfBerry.text}が 弱めた!` );
  }
  msgRockyHelmet(): void {
    writeLog( `${this.getArticle()}は ゴツゴツメットで ダメージを受けた!` );
  }
  msgAirBalloon(): void {
    writeLog( `${this.getArticle()}の ふうせんが 割れた!` );
  }
  msgIncinerate(): void {
    writeLog( `${this.getArticle()}の ${this._item.name}は 焼けてなくなった!` );
  }
  msgJabocaBerry( targetName: string ): void {
    writeLog( `${this.getArticle()}は ${targetName}の ジャポのみで ダメージを 受けた!` );
  }
  msgRowapBerry( targetName: string ): void {
    writeLog( `${this.getArticle()}は ${targetName}の レンブのみで ダメージを 受けた!` );
  }
  msgFainted(): void {
    writeLog( `${this.getArticle()}は たおれた!` );
  }
  msgDestinyBond(): void {
    writeLog( `${this.getArticle()}は 相手を 道連れに した!` );
  }
  msgRecoil(): void {
    writeLog( `${this.getArticle()}は 反動による ダメージを 受けた!` );
  }
  msgBind( targetName: string ): void {
    if ( this._move.selected.isName( 'うずしお' ) ) {
      writeLog( `${this.getArticle()}は 渦の中に 閉じこめられた!` );
    }
    if ( this._move.selected.isName( 'からではさむ' ) ) {
      writeLog( `${this.getArticle()}は ${targetName}の からに はさまれた!` );
    }
    if ( this._move.selected.isName( 'サンダープリズン' ) ) {
      writeLog( `${this.getArticle()}は ${targetName}に 閉じこめられた!` );
    }
    if ( this._move.selected.isName( 'しめつける' ) ) {
      writeLog( `${this.getArticle()}は ${targetName}に しめつけられた!` );
    }
    if ( this._move.selected.isName( 'すなじごく' ) ) {
      writeLog( `${this.getArticle()}は 砂じごくに 捕らわれた!` );
    }
    if ( this._move.selected.isName( 'トラバサミ' ) ) {
      writeLog( `${this.getArticle()}は トラバサミに 捕らわれた!` );
    }
    if ( this._move.selected.isName( 'ほのおのうず' ) ) {
      writeLog( `${this.getArticle()}は 炎の渦に 閉じこめられた!` );
    }
    if ( this._move.selected.isName( 'まきつく' ) ) {
      writeLog( `${this.getArticle()}は ${targetName}に 巻きつかれた!` );
    }
    if ( this._move.selected.isName( 'マグマストーム' ) ) {
      writeLog( `${this.getArticle()}は マグマの渦に 閉じこめられた!` );
    }
    if ( this._move.selected.isName( 'まとわりつく' ) ) {
      writeLog( `${this.getArticle()}は ${targetName}に まとわりつかれた!` );
    }
  }
  msgKnockOff( targetName: string, targetItem: string ): void {
    writeLog( `${this.getArticle()}は ${targetName}の ${targetItem}を はたき落とした!` );
  }
  msgNotThief( targetName: string ): void {
    writeLog( `${targetName}の 道具を 奪えない!` );
  }
  msgThief( targetName: string, targetItem: string ): void {
    writeLog( `${this.getArticle()}は ${targetName}から ${targetItem}を 奪い取った!` );
  }
  msgBugBote( berryName: string ): void {
    writeLog( `${this.getArticle()}は ${berryName}を 奪って 食べた!` );
  }
  msgSmackDown(): void {
    writeLog( `${this.getArticle()}は 撃ち落とされて 地面に 落ちた!` );
  }
  msgThousandWaves(): void {
    writeLog( `${this.getArticle()}は もう 逃げられない!` );
  }
  msgJawLock(): void {
    writeLog( `おたがいの ポケモンは 逃げることが できなくなった!` );
  }
  msgColorChange( type: string ): void {
    writeLog( `${this.getArticle()}は ${type}タイプに なった!` );
  }
  msgBattleBond(): void {
    writeLog( `${this.getArticle()}に きずなの 力が みなぎった!` );
  }
  msgLifeOrb(): void {
    writeLog( `${this.getArticle()}は 命が 少し削られた!` );
  }
  msgShellBell(): void {
    writeLog( `${this.getArticle()}は かいがらのすずで 少し 回復` );
  }
  msgPickpocket(): void {
    writeLog( `${this.getArticle()}の ${this._item.name}を 奪った!` );
  }

  msgAddHPByAbility(): void {
    writeLog( `${this.getArticle()}の 体力が 回復した!` );
  }
  msgAddHPByItem( item: string ): void {
    writeLog( `${this.getArticle()}は ${item}で 体力を 回復した!` );
  }


  msgCureConfuse(): void {
    writeLog( `${this.getArticle()}の 混乱が 解けた!` );
  }


  //------------------
  // 特性による優先度変更
  //------------------
  changeMovePriority(): void {
    if ( this._ability.isName( 'いたずらごころ' ) && this._move.selected.isStatus() ) {
      this._move.selected.priority += 1;
    }
    if ( this._ability.isName( 'はやてのつばさ' ) && this._status.hp.value.isMax() ) {
      this._move.selected.priority += 1;
    }
    if ( this._ability.isName( 'ヒーリングシフト' ) && this._move.selected.getFlag().heal ) {
      this._move.selected.priority += 3;
    }
  }

  //-------------------------
  // 残りHPによるきのみの発動判定
  //-------------------------
  isActivateBerryByHP( denominator: 2 | 4 ): boolean {
    const gluttony: number = ( this._ability.isName( 'くいしんぼう' ) )? 2 : 1;
    if ( denominator === 2 ) {
      return this._status.hp.value.isLessEqual( denominator );
    } else {
      return this._status.hp.value.isLessEqual( denominator / gluttony );
    }
  }

  //-----------
  // 持ち物の消費
  //-----------
  consumeItem(): void {
    if ( this._item.isNull() ) return;

    if ( this._item.isBerry() ) {
      this._item.belch = true;
      this.activateCheekPouch();
    }

    this._item.recyclable();
  }

  //-------------
  // ほおぶくろ発動
  //-------------
  activateCheekPouch(): void {
    if ( !this._ability.isName( 'ほおぶくろ' ) ) return;
    if ( this._status.hp.value.isZero() )return;
    if ( this._status.hp.value.isMax() ) return;
    if ( this._stateChange.healBlock.isTrue ) return;

    const value: number = Math.floor( this.getOrgHP() / 3 );
    this._status.hp.value.add( value );

    this.msgDeclareAbility();
    this.msgAddHPByAbility();
  }

  //-----------
  // 実質HP
  //-----------
  getOrgHP(): number {
    const dynamax: number = ( this._stateChange.dynamax.isTrue )? 0.5 : 1;
    return this._status.hp.av * dynamax;
  }

  //--------------
  // ランク変化可能量
  //--------------
  getRankVariableOrg( value: number ): number {
    value = ( this._ability.isName( 'たんじゅん' ) )? value * 2 : value;
    value = ( this._ability.isName( 'あまのじゃく' ) )? value * -1 : value;
    return value;
  }
  getRankVariable( para: RankStrings, value: number ): number {
    switch ( para ) {
      case 'atk':
        return this._status.atk.rank.getVariable( value );
      case 'def':
        return this._status.def.rank.getVariable( value );
      case 'spA':
        return this._status.spA.rank.getVariable( value );
      case 'spD':
        return this._status.spD.rank.getVariable( value );
      case 'spe':
        return this._status.spe.rank.getVariable( value );
      case 'acc':
        return this._status.acc.getVariable( value );
      case 'eva':
        return this._status.eva.getVariable( value );
      default:
        return 0;
    }
  }

  isChangeRankByOther( para: RankStrings, value: number, other: Pokemon ): boolean {
    const setting: number = this.getRankVariableOrg( value );
    const real: number = this.getRankVariable( para, setting );

    const abilityCheck = ( para: RankStrings, real: number ): boolean => {
      if ( real >= 0 ) return true;

      if ( this._ability.isName( 'しろいけむり' ) ) return false;
      if ( this._ability.isName( 'クリアボディ' ) ) return false;
      if ( this._ability.isName( 'メタルプロテクト' ) ) return false;
      if ( main.isExistAbilityInSide( this.isMine(), 'フラワーベール' ) && this._type.has( 'Grass' ) ) return false;
      if ( this._ability.isName( 'ミラーアーマー' ) ) {
        //changeTargetRank( target, pokemon, parameter, change );
        // return;
      }
      if ( this._ability.isName( 'かいりきバサミ' ) && para === 'atk' ) return false;
      if ( this._ability.isName( 'はとむね' ) && para === 'def' ) return false;
      if ( this._ability.isName( 'するどいめ' ) && para === 'acc' ) return false;

      return true;
    }

    const mistCheck = ( real: number, other: Pokemon ): boolean => {
      if ( real >= 0 ) return true;
      if ( !main.field.getSide( this.isMine() ).mist.isTrue ) return true;
      if ( !other.ability.isName( 'すりぬけ' ) ) return true;
      return false;
    }

    return real !== 0 && mistCheck( real, other ) && abilityCheck( para, real );
  }

  isChangeRank( para: RankStrings, value: number ): boolean {
    const setting: number = this.getRankVariableOrg( value );
    const real: number = this.getRankVariable( para, setting );

    return real !== 0;
  }

  changeRank( para: RankStrings, value: number, item?: string ): void {
    const setting: number = this.getRankVariableOrg( value );
    const real: number = this.getRankVariable( para, setting );

    this._status.changeRank( para, real, setting, this.getArticle(), item );
  }

  changeRankByOther( para: RankStrings, value: number, other: Pokemon ): void {
    this.changeRank( para, value );

    const setting: number = this.getRankVariableOrg( value );
    const real: number = this.getRankVariable( para, setting );

    if ( real >= 0 ) return;

    if ( this._ability.isName( 'まけんき' ) && this.isMine() !== other.isMine() ) {
      this.msgDeclareAbility();
      this.changeRank( 'atk', 2 );
    }
    if ( this.ability.isName( 'かちき' ) && this.isMine() !== other.isMine() ) {
      this.msgDeclareAbility();
      this.changeRank( 'spA', 2 );
    }
  }

  changeRankByRage(): void {
    const setting: number = this.getRankVariableOrg( 1 );
    const real: number = this.getRankVariable( 'atk', setting );

    this.status.atk.rank.add( real );
  }

  safeGuardCheck( other: Pokemon ): boolean {
    if ( !main.field.getSide( this.isMine() ).safeguard.isTrue ) return true;
    if ( other.ability.isName( 'すりぬけ' ) && this.isMine() !== other.isMine() ) return true;

    return false;
  }

  mistTerrainCheck(): boolean {
    if ( !main.field.terrain.isMisty() ) return true;
    if ( !this.isGround() ) return true;
    return false;
  }

  //-----------
  // 状態異常付与
  //-----------
  isGetAilmentByOther( ailment: StatusAilmentText, other: Pokemon ): boolean {
    if ( ailment === null ) return false;
    if ( !this._statusAilment.isHealth() ) return false;

    const abilityCheck = (): boolean => {
      if ( this._ability.isName( 'りんぷん' ) ) return false;
      if ( this._ability.isName( 'きよめのしお' ) ) return false;
      if ( this._ability.isName( 'ぜったいねむり' ) ) return false;
      if ( this._ability.isName( 'リーフガード' )  && main.field.weather.isSunny( this ) ) return false;
      //if ( this._ability.isName( 'リミットシールド' ) && this._name === 'メテノ(流星)' ) return false;
      if ( main.isExistAbilityInSide( this.isMine(), 'フラワーベール' ) && this._type.has( 'Grass' ) ) return false;

      return true;
    }

    const eachCheck = ( ailment: StatusAilmentText ): boolean => {
      switch ( ailment ) {
        case 'Paralysis':
          if ( this._type.has( 'Electric' ) ) return false;
          break;

        case 'Frozen':
          if ( this._type.has( 'Ice' ) ) return false;
          if ( main.field.weather.isSunny( this ) ) return false;
          if ( this._ability.isName( 'マグマのよろい' ) ) return false;
          break;

        case 'Burned':
          if ( this._type.has( 'Fire' ) ) return false;
          if ( this._ability.isName( 'みずのベール' ) ) return false;
          if ( this._ability.isName( 'すいほう' ) ) return false;
          break;

        case 'Poisoned':
          if ( this._ability.isName( 'めんえき' ) ) return false;
          if ( main.isExistAbilityInSide( this.isMine(), 'パステルベール' ) ) return false;
          if ( this._type.has( 'Poison' ) ) return false;
          if ( this._type.has( 'Steel' ) ) return false;
          break;

        case 'Asleep':
          if ( this._ability.isName( 'やるき' ) ) return false;
          if ( this._ability.isName( 'ふみん' ) ) return false;
          if ( main.isExistAbilityInSide( this.isMine(), 'スイートベール' ) ) return false;
          if ( main.field.terrain.isElectric() && this.isGround() ) return false;
          if ( main.isUproar() ) return false;
          break;

        default:
          break;
      }

      return true;
    }

    return this.safeGuardCheck( other ) && this.mistTerrainCheck() && abilityCheck() && eachCheck( ailment );
  }

  getAilmentByAdditionalEffect( ailmentName: string, other: Pokemon ): void {

    switch ( ailmentName ) {
      case 'paralysis':
        if ( !this.isGetAilmentByOther( 'Paralysis', other ) ) return;
        this._statusAilment.getParalysis();
        break;

      case 'burn':
        if ( !this.isGetAilmentByOther( 'Burned', other ) ) return;
        this._statusAilment.getBurned( );
        break;

      case 'freeze':
        if ( !this.isGetAilmentByOther( 'Frozen', other ) ) return;
        this._statusAilment.getFrozen();
        break;

      case 'sleep':
        if ( !this.isGetAilmentByOther( 'Asleep', other ) ) return;
        this._statusAilment.getAsleep();
        break;

      case 'poison':
        if ( !this.isGetAilmentByOther( 'Poisoned', other ) ) return;
        if ( other.move.selected.isName( 'Poison Fang' ) ) {
          this._statusAilment.getBadPoisoned();
        } else {
          this._statusAilment.getPoisoned();
        }
        break;

      default:
        break;
    }
  }




  //--------
  // こんらん
  //--------
  isGetConfusionByAdditionalEffect( other: Pokemon ): boolean {

    if ( this._stateChange.confuse.isTrue ) return false;
    if ( this._ability.isName( 'マイペース' ) ) return false;

    return this.safeGuardCheck( other ) && this.mistTerrainCheck();
  }

  getConfusion(): void {
    this._stateChange.getConfusion( this.getArticle() );
  }



  //--------
  // メロメロ
  //--------
  isGetAttract( other: Pokemon ): boolean {
    if ( this._gender === 'genderless' ) return false;
    if ( other.gender === 'genderless' ) return false;
    if ( this._gender === other.gender ) return false;
    if ( this.isMine() === other.isMine() ) return false;
    if ( this._stateChange.attract.isTrue ) return false;
    if ( this._ability.isName( 'どんかん' ) ) return false;
    if ( !isExistAbilityOneSide( this.isMine(), 'アロマベール' ) ) return false;

    return true;
  }

  getAttract( other: Pokemon ): void {
    this._stateChange.attract.beTrue( other.order );
    this.msgAttract();

    if ( !this._item.isName( 'あかいいと' ) ) return;
    if ( !other.isGetAttract( this ) ) return;

    other.getAttract( this );
  }


  //--------------
  // フォルムチェンジ
  //--------------
  getNextForm(): PokemonText {
    if ( this._name === 'Aegislash Shield' )   return 'Aegislash Blade';
    if ( this._name === 'Aegislash Blade' )    return 'Aegislash Shield';
    if ( this._name === 'Meloetta Aria' )      return 'Meloetta Pirouette';
    if ( this._name === 'Meloetta Pirouette' ) return 'Meloetta Aria';
    if ( this._name === 'Mimikyu Disguised' )  return 'Mimikyu Busted'
    if ( this._name === 'Cramorant Gulping' )  return 'Cramorant';
    if ( this._name === 'Cramorant Gorging' )  return 'Cramorant';
    if ( this._name === 'Eiscue Ice' )         return 'Eiscue Noice';
    if ( this._name === 'Eiscue Noice' )       return 'Eiscue Ice';

    return this._name;
  }

  formChange(): void {
    const nextForm: PokemonText = this.getNextForm();
    if ( nextForm === this._name ) return;

    this._name = nextForm;
    const pokemon: PokemonData = this.getMaster();
    this._type.list = pokemon.type;
    this._ability.setOrg( pokemon.ability[0] );
    this._status.formChange( pokemon.baseStatus, this._level, this.getNatureMaster() );
  }

  msgAegislashSchild(): void {
    writeLog( `ブレードフォルム チェンジ!` );
  }
  msgAegislashBlade(): void {
    writeLog( `シールドフォルム チェンジ!` );
  }
  msgRelicSong(): void {
    writeLog( `${this.getArticle()}の 姿が 変化した!` );
  }
  msgDisguise(): void {
    writeLog( `${this.getArticle()}の ばけのかわが はがれた!` );
  }
  msgIceFace(): void {
    writeLog( `${this.getArticle()}の 姿が 変化した!` );
  }


  //-------------
  // きのみを食べる
  //-------------
  getRipen(): number {
    return ( this._ability.isName( 'じゅくせい' ) )? 2 : 1;
  }
  getChangeValueByBerry( denominator: number ): number {
    const value: number = Math.floor( this.getOrgHP() / denominator ) * this.getRipen();
    return value;
  }

  eatBerryJuice(): void {
    this._status.hp.value.add( 10 );
    this.msgAddHPByItem( 'きのみジュース' );
  }
  eatCheriBerry(): void {
    this._statusAilment.getHealth( 'クラボのみ' );
  }
  eatChestoBerry(): void {
    this._statusAilment.getHealth( 'カゴのみ' );
  }
  eatPechaBerry(): void {
    if ( !this._statusAilment.isPoisoned() && !this._statusAilment.isBadPoisoned() ) return;
    this._statusAilment.getHealth( 'モモンのみ' );
  }
  eatRawstBerry(): void {
    this._statusAilment.getHealth( 'チーゴのみ' );
  }
  eatAspearBerry(): void {
    this._statusAilment.getHealth( 'ナナシのみ' );
  }
  eatLeppaBerry(): void {
    // ヒメリのみ
  }
  eatOranBerry(): void {
    this._status.hp.value.add( 10 * this.getRipen() );
    this.msgAddHPByItem( 'オレンのみ' );
  }
  eatPersimBerry(): void {
    // キーのみ
  }
  eatLumBerry(): void {
    this._statusAilment.getHealth( 'ラムのみ' );
    // 混乱を治す
  }
  eatSitrusBerry(): void {
    const value: number = this.getChangeValueByBerry( 4 );
    this._status.hp.value.add( value );
    this.msgAddHPByItem( 'オボンのみ' );
  }
  eatFigyBerry(): void {
    const value: number = this.getChangeValueByBerry( 3 );
    this._status.hp.value.add( value );
    this.msgAddHPByItem( 'フィラのみ' );
  }
  eatWikiBerry(): void {
    const value: number = this.getChangeValueByBerry( 3 );
    this._status.hp.value.add( value );
    this.msgAddHPByItem( 'ウイのみ' );
  }
  eatMagoBerry(): void {
    const value: number = this.getChangeValueByBerry( 3 );
    this._status.hp.value.add( value );
    this.msgAddHPByItem( 'マゴのみ' );
  }
  eatAguavBerry(): void {
    const value: number = this.getChangeValueByBerry( 3 );
    this._status.hp.value.add( value );
    this.msgAddHPByItem( 'バンジのみ' );
  }
  eatIapapaBerry(): void {
    const value: number = this.getChangeValueByBerry( 3 );
    this._status.hp.value.add( value );
    this.msgAddHPByItem( 'イアのみ' );
  }
  eatLiechiBerry(): void {
    this.changeRank( 'atk', this.getRipen() , 'チイラのみ' );
  }
  eatGanlonBerry(): void {
    this.changeRank( 'def', this.getRipen() , 'リュガのみ' );
  }
  eatSalacBerry(): void {
    this.changeRank( 'spe', this.getRipen() , 'カムラのみ' );
  }
  eatPetayaBerry(): void {
    this.changeRank( 'spA', this.getRipen() , 'ヤタピのみ' );
  }
  eatApicotBerry(): void {
    this.changeRank( 'spD', this.getRipen() , 'ズアのみ' );
  }
  eatLansatBerry(): void {
    // サンのみ
  }
  eatStarfBerry(): void {
    // スターのみ
  }
  eatEnigmaBerry(): void {
    const value: number = this.getChangeValueByBerry( 4 );
    this._status.hp.value.add( value );
    this.msgAddHPByItem( 'ナゾのみ' );
  }
  eatMicleBerry(): void {
    // ミクルのみ
  }
  eatKeeBerry(): void {
    this.changeRank( 'def', this.getRipen() , 'アッキのみ' );
  }
  eatMarangaBerry(): void {
    this.changeRank( 'spD', this.getRipen() , 'タラプのみ' );
  }



  //-----------
  // 手持ちに戻る
  //-----------
  isFainted(): boolean {
    if ( !this._status.hp.value.isZero() ) return false;

    this.msgFainted();
    return true;
  }

  toHand(): void {
    const naturalCure = (): void => {
      if ( !this._ability.isName( 'しぜんかいふく' ) ) return;
      this._statusAilment.getHealth();
    }

    const regenerator = (): void => {
      if ( !this._ability.isName( 'さいせいりょく' ) ) return;
      const value: number = Math.floor( this.getOrgHP() / 3 );
      this._status.hp.value.add( value );
    }

    if ( !this._status.hp.value.isZero() ) {
      naturalCure(); // しぜんかいふく
      regenerator(); // さいせいりょく
    }

    // 情報のリセット
    // pokemon.ability = pokemon.statusOrg.ability;
    // pokemon.type1 = pokemon.statusOrg.type1;
    // pokemon.type2 = pokemon.statusOrg.type2;
    // pokemon.command = new Command;
    // pokemon.damage = [];
    // pokemon.moveUsed = new AvailableMove;
    this._status.resetRank();

    this._order.battle = null;
    const hand: number = this._order.hand;
    this._order.hand = main.field.numberOfPokemon;
    main.getPlayer( this.isMine() ).cycleHand( hand );
  }

  //--------------
  // 追加効果発動判定
  //--------------
  isAdditionalEffect = ( target: Pokemon, attack: Attack ): boolean => {
    if ( this._stateChange.sheerForce.isTrue ) return false;
    if ( target.status.hp.value.isZero() ) return false;
    if ( attack.substitute ) return false ;
    if ( target.ability.isName( 'りんぷん' ) ) return false;
    if ( target.item.isName( 'おんみつマント' ) ) return false;

    return true;
  }

  sereneGrace = (): number => {
    if ( this._ability.isName( 'てんのべぐみ' ) ) return 2;
    else return 1;
  }

  rainbow = (): number => {
    if ( this._move.selected.isName( 'ひみつのちから' ) ) return 1;
    if ( main.field.getSide( this.isMine() ).rainbow.isTrue ) return 2;
    else return 1;
  }

  isAdditionalRate = ( moveRate: number ): boolean => {
    const base: number = moveRate * this.sereneGrace() * this.rainbow();

    return getRandom() < base;
  }

  isAdditionalFlinch = ( moveRate: number ): boolean => {
    const base: number = moveRate * this.sereneGrace() * this.rainbow();
    const flinchBase: number = Math.min( base, moveRate * 2 );

    return getRandom() < flinchBase;
  }








  getMaster(): PokemonData {
    return pokemonMaster.filter( p => p.nameEN === this._name )[0];
  }
  getNatureMaster(): NatureData {
    return natureMaster.filter( n => n.nameEN === this._nature )[0];
  }

  getWeight(): number {
    const master = this.getMaster();
    let weight = master.weight;

    // ボディパージ
    if ( this._ability.isName( 'ライトメタル' ) ) {
      weight = weight / 2;
    }
    if ( this._ability.isName( 'ヘヴィメタル' ) ) {
      weight = weight * 2;
    }
    if ( this._item.isName( 'かるいし' ) ) {
      weight = weight - 100;
    }

    return Math.max( 0.1, weight );
  }


  isContact(): boolean {
    const flag = this._move.selected.getFlag();
    return flag.contact && !this._ability.isName( 'えんかく' );
  }

  isGround(): boolean {
    if ( this._stateChange.ingrain.isTrue === true ) return true;
    if ( this._stateChange.smackDown.isTrue === true ) return true;
    if ( main.field.whole.gravity.isTrue === true ) return true;
    if ( this._item.isName( 'くろいてっきゅう' ) ) return true;

    if ( this._type.has( 'Flying' ) ) return false;
    if ( this._ability.isName( 'ふゆう' ) ) return false;
    if ( this._item.isName( 'ふうせん' ) ) return false;
    if ( this._stateChange.magnetRise.isTrue ) return false;
    if ( this._stateChange.telekinesis.isTrue ) return false;

    return true;
  }
}






