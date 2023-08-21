class Order {
  _party: number;
  _hand: number;
  _battle: number | null;

  constructor() {
    this._party = 0;
    this._hand = 0;
    this._battle = null;
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

class Status {
  _id: number;
  _order: number;
  _index: number;
  _name: string;
  _type1: Type | null;
  _type2: Type | null;
  _gender: GenderType;
  _ability: string;
  _level: number;
  _item: string | null;
  _nature: NatureType;
  _height: number;
  _weight: number;
  _happiness: number;
  _remainingHP: number;
  _statusAilment: StatusAilment;

  constructor() {
    this._id = 0;
    this._order = 0;
    this._index = 0;
    this._name = '';
    this._type1 = null;
    this._type2 = null;
    this._gender = '-';
    this._ability = '';
    this._level = 50;
    this._item = null;
    this._nature = 'てれや';
    this._height = 1.0;
    this._weight = 1.0;
    this._happiness = 255;
    this._remainingHP = 0;
    this._statusAilment = new StatusAilment( null );
  }

  set id( id: number ) {
    this._id = id;
  }
  set order( order: number ) {
    this._order = order;
  }
  set index( index: number ) {
    this._index = index;
  }
  set name( name: string ) {
    this._name = name;
  }
  set type1( type: Type | null ) {
    this._type1 = type;
  }
  set type2( type: Type | null ) {
    this._type2 = type;
  }
  set gender( gender: GenderType ) {
    this._gender = gender;
  }
  set ability( ability: string ) {
    this._ability = ability;
  }
  set level( level: number ) {
    this._level = level;
  }
  set item( item: string | null ) {
    this._item = item;
  }
  set nature( nature: NatureType) {
    this._nature = nature;
  }
  set height( height: number ) {
    this._height = height;
  }
  set weight( weight: number) {
    this._weight = weight;
  }
  set happiness( happiness: number ) {
    this._happiness = happiness;
  }
  set remainingHP( remainingHP: number ) {
    this._remainingHP = remainingHP;
  }
  set statusAilment( statusAilment: StatusAilment ) {
    this._statusAilment = statusAilment;
  }

  get id(): number {
    return this._id;
  }
  get order(): number {
    return this._order;
  }
  get index(): number {
    return this._index;
  }
  get name(): string {
    return this._name;
  }
  get type1(): Type | null {
    return this._type1;
  }
  get type2(): Type | null {
    return this._type2;
  }
  get gender(): GenderType {
    return this._gender;
  }
  get ability(): string {
    return this._ability;
  }
  get level(): number {
    return this._level;
  }
  get item(): string | null {
    return this._item;
  }
  get nature(): NatureType {
    return this._nature;
  }
  get height(): number {
    return this._height;
  }
  get weight(): number {
    return this._weight;
  }
  get happiness(): number {
    return this._happiness;
  }
  get remainingHP(): number {
    return this._remainingHP;
  }
  get statusAilment(): StatusAilment {
    return this._statusAilment;
  }

  declareAbility(): void {
    writeLog( `${this._name}の ${this._ability}` );
  }

  declareFailure(): void {
    writeLog( `しかし うまく決まらなかった....` );
  }

  declareInvalid( info: Damage ): void {
    info.success = false;
    writeLog( `${this._name}には 効果がないようだ...` );
  }

  declareNotHit( info: Damage ): void {
    info.success = false;
    writeLog( `${this._name}には 当たらなかった!` );
  }

  abilityInfo(): changeAbilityType {
    for ( const info of changeAbilityTable ) {
      if ( info.name === this._ability ) {
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

class StatusAilment {
  _name: StatusAilmentType;
  _turn: number;

  constructor( name: StatusAilmentType ) {
    this._name = name;
    this._turn = 0;
  }

  set name( name: StatusAilmentType ) {
    this._name = name;
  }
  set turn( turn: number ) {
    this._turn = turn;
  }

  get name(): StatusAilmentType {
    return this._name;
  }
  get turn(): number {
    return this._turn;
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

class ParameterRank {
  [key: string]: number;

  _attack: number;
  _defense: number;
  _specialAttack: number;
  _specialDefense: number;
  _speed: number;
  _evasion: number;
  _accuracy: number;

  constructor() {
    this._attack = 0;
    this._defense = 0;
    this._specialAttack = 0;
    this._specialDefense = 0;
    this._speed = 0;
    this._evasion = 0;
    this._accuracy = 0;
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
  set evasion( evasion: number ) {
    this._evasion = evasion;
  }
  set accuracy( accuracy: number ) {
    this._accuracy = accuracy;
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
  get evasion(): number {
    return this._evasion;
  }
  get accuracy(): number {
    return this._accuracy;
  }
}


/*
class Damage {
  _damage: number;
  _effective: number;
  _critical: boolean;
  _substitute: boolean;

  constructor() {
    this._damage = 0;
    this._effective = 0;
    this._critical = false;
    this._substitute = false;
  }

  set damage( damage: number ) {
    this._damage = damage;
  }
  set effective( effective: number ) {
    this._effective = effective;
  }
  set critical( critical: boolean ) {
    this._critical = critical;
  }
  set substitute( substitute: boolean ) {
    this._substitute = substitute;
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
}
*/

class Target {
  _trainer: 'me' | 'opp' | 'field';
  _battle: number | null;
  _party: number;

  constructor() {
    this._trainer = 'field';
    this._battle = null;
    this._party = 0;
  }

  set trainer( trainer: 'me' | 'opp' | 'field' ) {
    this._trainer = trainer;
  }
  set battle( battle: number | null ) {
    this._battle = battle;
  }
  set party( party: number ) {
    this._party = party;
  }

  get trainer(): 'me' | 'opp' | 'field' {
    return this._trainer;
  }
  get battle(): number | null {
    return this._battle;
  }
  get party(): number {
    return this._party;
  }
}

class Damage {
  _trainer: 'me' | 'opp' | 'field';
  _battle: number | null;
  _party: number;
  _success: boolean;
  _damage: number;
  _effective: number;
  _critical: boolean;
  _substitute: boolean;

  constructor() {
    this._trainer = 'field';
    this._battle = null;
    this._party = 0;
    this._success = true;
    this._damage = 0;
    this._effective = 0;
    this._critical = false;
    this._substitute = false;
  }

  set trainer( trainer: 'me' | 'opp' | 'field' ) {
    this._trainer = trainer;
  }
  set battle( battle: number | null ) {
    this._battle = battle;
  }
  set party( party: number ) {
    this._party = party;
  }
  set success( success: boolean ) {
    this._success = success;
  }
  set damage( damage: number ) {
    this._damage = damage;
  }
  set effective( effective: number ) {
    this._effective = effective;
  }
  set critical( critical: boolean ) {
    this._critical = critical;
  }
  set substitute( substitute: boolean ) {
    this._substitute = substitute;
  }

  get trainer(): 'me' | 'opp' | 'field' {
    return this._trainer;
  }
  get battle(): number | null {
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
}

class StateChange {
  _name: string | null;
  _isTrue: boolean;
  _turn: number;
  _count: number;
  _text: string;
  _target: Target;

  constructor( name: string | null ) {
    this._name = name;
    this._isTrue = false;
    this._turn = 0;
    this._count = 0;
    this._text = '';
    this._target = new Target;
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
  set target( target: Target ) {
    this._target = target;
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
  get target(): Target {
    return this._target;
  }

  reset(): void {
    this._isTrue = false;
    this._turn = 0;
    this._count = 0;
    this._text = '';
    this._target = new Target;
  }
}


class StateChangeSummary {

  _flinch: StateChange; // ひるみ
  _bind: StateChange; // バインド
  _curse: StateChange; // のろい
  // あくむ
  _attract: StateChange; // メロメロ
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


  _cannotEscape: StateChange; // にげられない
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
  _transform: StateChange; // へんしん
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
  _orderRaise: StateChange; // 行動順繰り上げ
  _skin: StateChange; // スキン系特性
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
  _recycle: StateChange; // リサイクル
  _fling: StateChange; // なげつける
  _store: StateChange; // ため技
  _belch: StateChange; // ゲップ
  _dynamax: StateChange; // ダイマックス
  _rangeCorr: StateChange; // 範囲補正
  _memo: StateChange; // メモ

  constructor() {
    this._flinch = new StateChange( 'ひるみ');
    this._bind = new StateChange( 'バインド' );
    this._curse = new StateChange( 'のろい' );
    this._attract = new StateChange( 'メロメロ' );
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
    this._cannotEscape = new StateChange( 'にげられない' ) ;
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
    this._transform = new StateChange( 'へんしん' );
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
    this._orderRaise = new StateChange( '行動順繰り上げ' );
    this._skin = new StateChange( 'スキン系特性' );
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
    this._recycle = new StateChange( 'リサイクル' );
    this._fling = new StateChange( 'なげつける' );
    this._store = new StateChange( 'ため技' );
    this._belch = new StateChange( 'ゲップ' );
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
  set attract( attract: StateChange ) {
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
  set cannotEscape( cannotEscape: StateChange ) {
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
  set transform( transform: StateChange ) {
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
  set orderRaise( orderRaise: StateChange ) {
    this._orderRaise = orderRaise;
  }
  set skin( skin: StateChange ) {
    this._skin = skin;
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
  set recycle( recycle: StateChange ) {
    this._recycle = recycle;
  }
  set fling( fling: StateChange ) {
    this._fling = fling;
  }
  set store( store: StateChange ) {
    this._store = store;
  }
  set belch( belch: StateChange ) {
    this._belch = belch;
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
  get attract(): StateChange {
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
  get cannotEscape(): StateChange {
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
  get transform(): StateChange {
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
  get orderRaise(): StateChange {
    return this._orderRaise;
  }
  get skin(): StateChange {
    return this._skin;
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
  get recycle(): StateChange {
    return this._recycle;
  }
  get fling(): StateChange {
    return this._fling;
  }
  get store(): StateChange {
    return this._store;
  }
  get belch(): StateChange {
    return this._belch;
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

}


class LearnedMove {
  _slot: number
  _name: string | null;
  _powerPoint: number;
  _remainingPP: number;

  constructor() {
    this._slot = 0
    this._name = null;
    this._powerPoint = 0;
    this._remainingPP = 0;
  }

  set slot( slot: number ) {
    this._slot = slot;
  }
  set name( name: string | null ) {
    this._name = name
  }
  set powerPoint( powerPoint: number ) {
    this._powerPoint = powerPoint
  }
  set remainingPP( remainingPP: number ) {
    this._remainingPP = remainingPP
  }

  get slot(): number {
    return this._slot;
  }
  get name(): string | null {
    return this._name;
  }
  get powerPoint(): number {
    return this._powerPoint;
  }
  get remainingPP(): number {
    return this._remainingPP;
  }

  curePPByLeppaBerry( pokemon: Pokemon, value: number ): void {
    // PP回復
    this._remainingPP = Math.min( this._remainingPP + value, this._powerPoint );
    // メッセージ
    writeLog( `${getArticle( pokemon )}は ヒメリのみで ${this._name}のPPを 回復した!` );
    // なげつける・むしくい・ついばむ
    if ( pokemon.stateChange.memo.isTrue === true ) {
      pokemon.stateChange.memo.count += 1;
    }
  }
}

class MoveFlag {
  _contact: boolean; // 接触攻撃
  _charge: boolean; // ため技、パワフルハーブで溜めをスキップできる
  _recharge: boolean; // 次のターン反動で動けない
  _protect: boolean; // 「まもる」「みきり」 で防ぐことができる
  _reflectable: boolean; // マジックコート・マジックミラーで跳ね返すことができる
  _snatch: boolean; // 「よこどり」で奪うことができる
  _mirror: boolean; // 「オウムがえし」でコピーすることができる
  _punch: boolean; // 「てつのこぶし」の場合威力が1.2倍になる
  _sound: boolean; // 「ぼうおん」で無効化される
  _gravity: boolean; // 「じゅうりょく」下では使用できない
  _defrost: boolean; // 自身のこおり状態を治すことができる
  _distance: boolean; // トリプルバトルでは対角の相手にも攻撃できる
  _heal: boolean; // 「かいふくふうじ」状態では使用できない
  _authentic: boolean; // 「みがわり」を無視して攻撃できる
  _powder: boolean; // 「ぼうじん」「くさタイプ」には無効
  _bite: boolean; // 「がんじょうあご」の場合威力が1.5倍
  _pulse: boolean; // 「メガランチャー」の場合、威力が1.5倍
  _ballistics: boolean; // 「ぼうだん」には無効
  _mental: boolean; // 「アロマベール」には無効、「メンタルハーブ」で治る
  _nonSkyBattle: boolean; // スカイバトルでは使えない
  _dance: boolean; // 「おどりこ」の対象

  constructor() {
    this._contact = false;
    this._charge = false;
    this._recharge = false;
    this._protect = false;
    this._reflectable = false;
    this._snatch = false;
    this._mirror = false;
    this._punch = false;
    this._sound = false;
    this._gravity = false;
    this._defrost = false;
    this._distance = false;
    this._heal = false;
    this._authentic = false;
    this._powder = false;
    this._bite = false;
    this._pulse = false;
    this._ballistics = false;
    this._mental = false;
    this._nonSkyBattle = false;
    this._dance = false;
  }

  set contact( contact: boolean ) {
    this._contact = contact;
  }
  set charge( charge: boolean ) {
    this._charge = charge;
  }
  set recharge( recharge: boolean ) {
    this._recharge = recharge;
  }
  set protect( protect: boolean ) {
    this._protect = protect;
  }
  set reflectable( reflectable: boolean ) {
    this._reflectable = reflectable;
  }
  set snatch( snatch: boolean ) {
    this._snatch = snatch;
  }
  set mirror( mirror: boolean ) {
    this._mirror = mirror;
  }
  set punch( punch: boolean ) {
    this._punch = punch;
  }
  set sound( sound: boolean ) {
    this._sound = sound;
  }
  set gravity( gravity: boolean ) {
    this._gravity = gravity;
  }
  set defrost( defrost: boolean ) {
    this._defrost = defrost;
  }
  set distance( distance: boolean ) {
    this._distance = distance;
  }
  set heal( heal: boolean ) {
    this._heal = heal;
  }
  set authentic( authentic: boolean ) {
    this._authentic = authentic;
  }
  set powder( powder: boolean ) {
    this._powder = powder;
  }
  set bite( bite: boolean ) {
    this._bite = bite;
  }
  set pulse( pulse: boolean ) {
    this._pulse = pulse;
  }
  set ballistics( ballistics: boolean ) {
    this._ballistics = ballistics;
  }
  set mental( mental: boolean ) {
    this._mental = mental;
  }
  set nonSkyBattle( nonSkyBattle: boolean ) {
    this._nonSkyBattle = nonSkyBattle;
  }
  set dance( dance: boolean ) {
    this._dance = dance;
  }

  get contact() {
    return this._contact;
  }
  get charge() {
    return this._charge;
  }
  get recharge() {
    return this._recharge;
  }
  get protect() {
    return this._protect;
  }
  get reflectable() {
    return this._reflectable;
  }
  get snatch() {
    return this._snatch;
  }
  get mirror() {
    return this._mirror;
  }
  get punch() {
    return this._punch;
  }
  get sound() {
    return this._sound;
  }
  get gravity() {
    return this._gravity;
  }
  get defrost() {
    return this._defrost;
  }
  get distance() {
    return this._distance;
  }
  get heal() {
    return this._heal;
  }
  get authentic() {
    return this._authentic;
  }
  get powder() {
    return this._powder;
  }
  get bite() {
    return this._bite;
  }
  get pulse() {
    return this._pulse;
  }
  get ballistics() {
    return this._ballistics;
  }
  get mental() {
    return this._mental;
  }
  get nonSkyBattle() {
    return this._nonSkyBattle;
  }
  get dance() {
    return this._dance;
  }
}


class SelectedMove {
  _slot: number;
  _name: string;
  _type: Type;
  _damageClass: string;
  _target: string;
  _category: string;
  _power: number | null;
  _accuracy: number | null;
  _priority: number;
  _critical: number;
  _drain: number;
  _flinch: number;
  _healing: number;
  _hits: { max: number | null, min: number | null };
  _turns: { max: number | null, min: number | null };
  _ailment: { chance: number, name: string };
  _stat: { chance: number, changes: { stat: string, change: number }[] };
  _flag: MoveFlag;

  constructor() {
    this._slot = 0;
    this._name = '';
    this._type = null;
    this._damageClass = '';
    this._target = '';
    this._category = '';
    this._power = 0;
    this._accuracy = 0;
    this._priority = 0;
    this._critical = 0;
    this._drain = 0;
    this._flinch = 0;
    this._healing = 0;
    this._hits = { max: null, min: null };
    this._turns = { max: null, min: null };
    this._ailment = { chance: 0, name: '' };
    this._stat = { chance: 0, changes: [] };
    this._flag = new MoveFlag;
  }

  set slot( slot: number ) {
    this._slot = slot;
  }
  set name( name: string ) {
    this._name = name;
  }
  set type( type: Type ) {
    this._type = type;
  }
  set damageClass( damageClass: string ) {
    this._damageClass = damageClass;
  }
  set target( target: string ) {
    this._target = target;
  }
  set category( category: string ) {
    this._category = category;
  }
  set power( power: number | null ) {
    this._power = power;
  }
  set accuracy( accuracy: number | null ) {
    this._accuracy = accuracy;
  }
  set priority( priority: number ) {
    this._priority = priority;
  }
  set critical( critical: number ) {
    this._critical = critical;
  }
  set drain( drain: number ) {
    this._drain = drain;
  }
  set flinch( flinch: number ) {
    this._flinch = flinch;
  }
  set healing( healing: number ) {
    this._healing = healing;
  }
  set hits( hits: { max: number | null, min: number | null } ) {
    this._hits = hits;
  }
  set turns( turns: { max: number | null, min: number | null } ) {
    this._turns = turns;
  }
  set ailment( ailment: { chance: number, name: string } ) {
    this._ailment = ailment;
  }
  set stat( stat: { chance: number, changes: { stat: string, change: number }[] } ) {
    this._stat = stat;
  }
  set flag( flag: MoveFlag ) {
    this._flag = flag;
  }

  get slot(): number {
    return this._slot;
   }
   get name(): string {
    return this._name;
   }
   get type(): Type {
    return this._type;
   }
   get damageClass(): string {
    return this._damageClass;
   }
   get target(): string {
    return this._target;
   }
   get category(): string {
    return this._category;
   }
   get power(): number | null {
    return this._power;
   }
   get accuracy(): number | null {
    return this._accuracy;
   }
   get priority(): number {
    return this._priority;
   }
   get critical(): number {
    return this._critical;
   }
   get drain(): number {
    return this._drain;
   }
   get flinch(): number {
    return this._flinch;
   }
   get healing(): number {
    return this._healing;
   }
   get hits(): { max: number | null, min: number | null } {
    return this._hits;
   }
   get turns(): { max: number | null, min: number | null } {
    return this._turns;
   }
   get ailment(): { chance: number, name: string } {
    return this._ailment;
   }
   get stat(): { chance: number, changes: { stat: string, change: number }[] } {
    return this._stat;
   }
   get flag(): MoveFlag {
    return this._flag;
   }

}



class Pokemon {
  _trainer: 'me' | 'opp';
  _order: Order;
  _status: Status;
  _statusOrg: Status;
  _actualValue: ParameterSix;
  _baseStatus: ParameterSix;
  _individualValue: ParameterSix;
  _effortValue: ParameterSix;
  _rank: ParameterRank;
  _learnedMove: LearnedMove[];
  _selectedMove: SelectedMove;
  _damage: Damage[];
  _command: Command;
  _stateChange: StateChangeSummary;

  constructor() {
    this._trainer = 'me';
    this._order = new Order;
    this._status = new Status;
    this._statusOrg = new Status;
    this._actualValue = new ParameterSix;
    this._baseStatus = new ParameterSix;
    this._individualValue = new ParameterSix;
    this._effortValue = new ParameterSix;
    this._rank = new ParameterRank;
    this._learnedMove = [
      new LearnedMove,
      new LearnedMove,
      new LearnedMove,
      new LearnedMove,
    ]
    this._selectedMove = new SelectedMove;
    this._damage = [];
    this._command = new Command;
    this._stateChange = new StateChangeSummary;
  }

  set trainer( trainer: 'me' | 'opp' ) {
    this._trainer = trainer;
  }
  set status( status: Status ) {
    this._status = status;
  }
  set statusOrg( statusOrg: Status ) {
    this._statusOrg = statusOrg;
  }
  set rank( rank: ParameterRank ) {
    this._rank = rank;
  }
  set learnedMove( learnedMove: LearnedMove[] ) {
    this._learnedMove = learnedMove;
  }
  set selectedMove( selectedMove: SelectedMove ) {
    this._selectedMove = selectedMove;
  }
  set damage( damage: Damage[] ) {
    this._damage = damage;
  }
  set command( command: Command ) {
    this._command = command;
  }
  set stateChange( stateChange: StateChangeSummary ) {
    this._stateChange = stateChange;
  }


  get trainer(): 'me' | 'opp' {
    return this._trainer;
  }
  get order(): Order {
    return this._order;
  }
  get status(): Status {
    return this._status
  }
  get statusOrg(): Status {
    return this._statusOrg;
  }
  get actualValue(): ParameterSix {
    return this._actualValue;
  }
  get baseStatus(): ParameterSix {
    return this._baseStatus;
  }
  get individualValue(): ParameterSix {
    return this._individualValue;
  }
  get effortValue(): ParameterSix {
    return this._effortValue;
  }
  get rank(): ParameterRank {
    return this._rank;
  }
  get learnedMove(): LearnedMove[] {
    return this._learnedMove;
  }
  get selectedMove(): SelectedMove {
    return this._selectedMove;
  }
  get damage(): Damage[] {
    return this._damage;
  }
  get command(): Command {
    return this._command;
  }
  get stateChange(): StateChangeSummary {
    return this._stateChange;
  }
}






