class Order {
  _party: number;
  _hand: number | null;
  _battle: number | null;

  constructor() {
    this._party = 0;
    this._hand = null;
    this._battle = null;
  }

  set party( party: number ) {
    this._party = party;
  }
  set hand( hand: number | null ) {
    this._hand = hand;
  }
  set battle( battle: number | null ) {
    this._battle = battle;
  }

  get party(): number {
    return this._party;
  }
  get hand(): number | null {
    return this._hand
  }
  get battle(): number | null {
    return this._battle;
  }
}

class Status {
  _number: string;
  _name: string;
  _type1: string;
  _type2: string;
  _gender: string;
  _ability: string;
  _level: number;
  _item: string;
  _nature: string;
  _height: number;
  _weight: number;
  _happiness: number;
  _remainingHP: number;
  _statusAilment: StateChange;

  constructor() {
    this._number = '';
    this._name = '';
    this._type1 = '';
    this._type2 = '';
    this._gender = '';
    this._ability = '';
    this._level = 50;
    this._item = '';
    this._nature = '';
    this._height = 1.0;
    this._weight = 1.0;
    this._happiness = 255;
    this._remainingHP = 0;
    this._statusAilment = new StateChange( '' );
  }

  set number( number: string ) {
    this._number = number;
  }
  set name( name: string ) {
    this._name = name;
  }
  set type1( type: string ) {
    this._type1 = type;
  }
  set type2( type: string ) {
    this._type2 = type;
  }
  set gender( gender: string ) {
    this._gender = gender;
  }
  set ability( ability: string ) {
    this._ability = ability;
  }
  set level( level: number ) {
    this._level = level;
  }
  set item( item: string ) {
    this._item = item;
  }
  set nature( nature: string ) {
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
  set statusAilment( statusAilment: StateChange ) {
    this._statusAilment = statusAilment;
  }

  get number(): string {
    return this._number;
  }
  get name(): string {
    return this._name;
  }
  get type1(): string {
    return this._type1;
  }
  get type2(): string {
    return this._type2;
  }
  get gender(): string {
    return this._gender;
  }
  get ability(): string {
    return this._ability;
  }
  get level(): number {
    return this._level;
  }
  get item(): string {
    return this._item;
  }
  get nature(): string {
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
  get statusAilment(): StateChange {
    return this._statusAilment;
  }

  declareAbility(): void {
    writeLog( `${this._name} の ${this._ability}` );
  }

  declareInvalid( info: Target ): void {
    info.success = false;
    writeLog( `${this._name}には 効果がないようだ...` );
  }

  declareNotHit( info: Target ): void {
    info.success = false;
    writeLog( `${this._name}には 当たらなかった!` );
  }

  declareCannotMove(): void {
    writeLog( `${this._name}は 攻撃の 反動で 動けない!` );
  }

  declareSleeping(): void {
    writeLog( `${this._name}は ぐうぐう 眠っている` );
  }

  declareFleezed(): void {
    writeLog( `${this._name}は 凍って 動けない!` );
  }

  cureAilment(): void {

    if ( this._statusAilment.name === 'ねむり' ) {
      writeLog( `${this._name}は 目を 覚ました!` );
    }
    if ( this._statusAilment.name === 'こおり' ) {
      writeLog( `${this._name}の こおりが 溶けた!` );
    }

    this._statusAilment = new StateChange( '' );
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

class AvailableMove {
  _name: string;
  _type: string;
  _category: string;
  _power: number;
  _accuracy: number;
  _remainingPP: number;
  _powerPoint: number;
  _isDirect: boolean;
  _isProtect: boolean;
  _target: string;
  _number: number;
  _priority: number;

  constructor() {
    this._name = '';
    this._type = '';
    this._category = '';
    this._power = 0;
    this._accuracy = 0;
    this._remainingPP = 0;
    this._powerPoint = 0;
    this._isDirect = true;
    this._isProtect = true;
    this._target = '';
    this._number = 0;
    this._priority = 0;
  }

  set name( name: string ) {
    this._name = name;
  }
  set type( type: string ) {
    this._type = type;
  }
  set category( category: string ) {
    this._category = category;
  }
  set power( power: number ) {
    this._power = power;
  }
  set accuracy( accuracy: number ) {
    this._accuracy = accuracy;
  }
  set remainingPP( remainingPP: number ) {
    this._remainingPP = remainingPP;
  }
  set powerPoint( powerPoint: number ) {
    this._powerPoint = powerPoint;
  }
  set isDirect( isDirect: boolean ) {
    this._isDirect = isDirect;
  }
  set isProtect( isProtect: boolean ) {
    this._isProtect = isProtect;
  }
  set target( target: string ) {
    this._target = target;
  }
  set number( number: number ) {
    this._number = number;
  }
  set priority( priority: number ) {
    this._priority = priority;
  }

  get name(): string {
    return this._name;
  }
  get type(): string {
    return this._type;
  }
  get category(): string {
    return this._category;
  }
  get power(): number {
    return this._power;
  }
  get accuracy(): number {
    return this._accuracy;
  }
  get remainingPP(): number {
    return this._remainingPP;
  }
  get powerPoint(): number {
    return this._powerPoint;
  }
  get isDirect(): boolean {
    return this._isDirect;
  }
  get isProtect(): boolean {
    return this._isProtect;
  }
  get target(): string {
    return this._target;
  }
  get number(): number {
    return this._number;
  }
  get priority(): number {
    return this._priority;
  }

  failure(): false {
    writeLog( `しかし うまく決まらなかった...` );
    return false;
  }

  runOutPP(): void {
    writeLog( `しかし 技の ポイントが なかった!` );
  }
}



class Damage {
  _damage: number;
  _effective: number;
  _critical: boolean;

  constructor() {
    this._damage = 0;
    this._effective = 0;
    this._critical = false;
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

  get damage(): number {
    return this._damage;
  }
  get effective(): number {
    return this._effective;
  }
  get critical(): boolean {
    return this._critical;
  }
}

class Target {
  _trainer: string;
  _battleNumber: number | null;
  _success: boolean;

  constructor() {
    this._trainer = '';
    this._battleNumber = null;
    this._success = true;
  }

  set trainer( trainer: string ) {
    this._trainer = trainer;
  }
  set battleNumber( battleNumber: number | null ) {
    this._battleNumber = battleNumber;
  }
  set success( success: boolean ) {
    this._success = success;
  }

  get trainer(): string {
    return this._trainer;
  }
  get battleNumber(): number | null {
    return this._battleNumber;
  }
  get success(): boolean {
    return this._success;
  }

  failure(): void {
    this._success === false;
    writeLog( `しかし うまく決まらなかった...` );
  }
}

class Command {
  _move: number | false;
  _reserve: number | false;
  _myTarget: number | false;
  _opponentTarget: number | false;

  constructor() {
    this._move = false;
    this._reserve = false;
    this._myTarget = false;
    this._opponentTarget = false;
  }

  set move( move: number | false ) {
    this._move = move;
  }
  set reserve( reserve: number | false ) {
    this._reserve = reserve;
  }
  set myTarget( myTarget: number | false ) {
    this._myTarget = myTarget;
  }
  set opponentTarget( opponentTarget: number | false ) {
    this._opponentTarget = opponentTarget;
  }

  get move(): number | false {
    return this._move;
  }
  get reserve(): number | false {
    return this._reserve;
  }
  get myTarget(): number | false {
    return this._myTarget;
  }
  get opponentTarget(): number | false {
    return this._opponentTarget;
  }
}

class StateChange {
  _name: string;
  _isTrue: boolean;
  _turn: number;
  _count: number;

  constructor( name: string) {
    this._name = name;
    this._isTrue = false;
    this._turn = 0;
    this._count = 0;
  }

  set name ( name: string ) {
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

  get name(): string {
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
}


class StateChangeSummary {
  /*
  わざを使われたポケモンに発生
  もうどく (第二世代まで。第三世代以降は状態異常に)
  こんらん
  ひるみ
  バインド
  */
  _curse: StateChange; // のろい
  // あくむ


  _attract: StateChange; // メロメロ
  _leechSeed: StateChange; // やどりぎのタネ


  _yawn: StateChange; // ねむけ
  _perishSong: StateChange; // ほろびのうた


  _noAbility: StateChange; // とくせいなし
  // かいふくふうじ

  _embargo: StateChange; //さしおさえ
  _encore: StateChange; // アンコール
  _torment: StateChange; // いちゃもん
  _taunt: StateChange; // ちょうはつ
  _disable: StateChange; // かなしばり
  _foresight: StateChange; // みやぶられている
  _miracleEye: StateChange; // ミラクルアイ

  // てだすけ

  _smackDown: StateChange; // うちおとす
  _telekinesis: StateChange; // テレキネシス

  /*
  にげられない
  そうでん
  */

  _powder: StateChange; // ふんじん

  /*
  じごくづき
  ハロウィン
  もりののろい
  ちゅうもくのまと
  */

  _tarShot: StateChange; // タールショット


  // たこがため

  // わざを使ったポケモンに発生

  _focusEnergy: StateChange; // きゅうしょアップ


  // ちゅうもくのまと
  _substitute: StateChange; // みがわり
  // まもる

  _lockOn: StateChange; //ロックオン (第五世代以降)

  /*
  キングシールド
  トーチカ
  ブロッキング
  しろいきり (第二世代まで。第三世代以降は場の状態に)
  */
  _minimize: StateChange; //ちいさくなる

  /*
  まるくなる
  みちづれ
  おんねん
  さわぐ
  あばれる
  ふういん
  どろあそび (第五世代まで。第六世代以降は場の状態に)
  みずあそび (第五世代まで。第六世代以降は場の状態に)
  いかり
  マジックコート
  */

  _ingrain: StateChange; // ねをはる

  _aquaRing: StateChange; //アクアリング
  // じゅうでん

  _stockpile: StateChange; // たくわえる
  _magnetRise: StateChange; // でんじふゆう

  /*
  がまん
  パワートリック
  */
  _transform: StateChange; // へんしん

  /*
  そらをとぶ
  あなをほる
  ダイビング
  シャドーダイブ
  ボディパージ
  ほろびのうた
  */
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


  _cannotMove: StateChange; // 反動で動けない（状態変化ではない）
  _dynamax: StateChange; // ダイマックス（状態変化ではない）

  constructor() {
    this._curse = new StateChange( 'のろい' );
    this._attract = new StateChange( 'メロメロ' );
    this._leechSeed = new StateChange( 'やどりぎのタネ' );
    this._yawn = new StateChange( 'ねむけ' );
    this._perishSong = new StateChange( 'ほろびのうた' );
    this._noAbility = new StateChange( 'とくせいなし' );
    this._embargo = new StateChange( 'さしおさえ' );
    this._encore = new StateChange( 'アンコール' );
    this._torment = new StateChange( 'いちゃもん' );
    this._taunt = new StateChange( 'ちょうはつ' );
    this._disable = new StateChange( 'かなしばり' );
    this._foresight = new StateChange( 'みやぶられている' );
    this._miracleEye = new StateChange( 'ミラクルアイ' );
    this._smackDown = new StateChange( 'うちおとす' );
    this._telekinesis = new StateChange( 'テレキネシス' );
    this._powder = new StateChange( 'ふんじん' );
    this._tarShot = new StateChange( 'タールショット' );

    this._focusEnergy = new StateChange( 'きゅうしょアップ' );
    this._substitute = new StateChange( 'みがわり' );
    this._lockOn = new StateChange( 'ロックオン' );
    this._minimize = new StateChange( 'ちいさくなる' );
    this._ingrain = new StateChange( 'ねをはる' );
    this._aquaRing = new StateChange( 'アクアリング' );
    this._stockpile = new StateChange( 'たくわえる' );
    this._magnetRise = new StateChange( 'でんじふゆう' );
    this._transform = new StateChange( 'へんしん' );
    this._confuse = new StateChange( 'こんらん' );

    this._cannotMove = new StateChange( '反動で動けない' );
    this._dynamax = new StateChange( 'ダイマックス' );
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
  set smackDown( smackDown: StateChange ) {
    this._smackDown = smackDown;
  }
  set telekinesis( telekinesis: StateChange ) {
    this._telekinesis = telekinesis;
  }
  set powder( powder: StateChange ) {
    this._powder = powder;
  }
  set tarShot( tarShot: StateChange ) {
    this._tarShot = tarShot;
  }
  set focusEnergy( focusEnergy: StateChange ) {
    this._focusEnergy = focusEnergy;
  }
  set substitute( substitute: StateChange ) {
    this._substitute = substitute;
  }
  set lockOn( lockOn: StateChange ) {
    this._lockOn = lockOn;
  }
  set minimize( minimize: StateChange ) {
    this._minimize = minimize;
  }
  set ingrain( ingrain: StateChange ) {
    this._ingrain = ingrain;
  }
  set aquaRing( aquaRing: StateChange ) {
    this._aquaRing = aquaRing;
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
  set confuse( confuse: StateChange ) {
    this._confuse = confuse;
  }
  set cannotMove( cannotMove: StateChange ) {
    this._cannotMove = cannotMove;
  }
  set dynamax( dynamax: StateChange ) {
    this._dynamax = dynamax;
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
  get smackDown(): StateChange {
    return this._smackDown;
  }
  get telekinesis(): StateChange {
    return this._telekinesis;
  }
  get powder(): StateChange {
    return this._powder;
  }
  get tarShot(): StateChange {
    return this._tarShot;
  }
  get focusEnergy(): StateChange {
    return this._focusEnergy;
  }
  get substitute(): StateChange {
    return this._substitute;
  }
  get lockOn(): StateChange {
    return this._lockOn;
  }
  get minimize(): StateChange {
    return this._minimize;
  }
  get ingrain(): StateChange {
    return this._ingrain;
  }
  get aquaRing(): StateChange {
    return this._aquaRing;
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
  get confuse(): StateChange {
    return this._confuse;
  }
  get cannotMove(): StateChange {
    return this._cannotMove;
  }
  get dynamax(): StateChange {
    return this._dynamax;
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
  _move: AvailableMove[];
  _moveUsed: AvailableMove;
  _damage: Damage;
  _target: Target[];
  _command: Command;
  _statusChange: StateChangeSummary;

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
    this._move = [
      new AvailableMove,
      new AvailableMove,
      new AvailableMove,
      new AvailableMove
    ]
    this._moveUsed = new AvailableMove;
    this._damage = new Damage;
    this._target = [];
    this._command = new Command;
    this._statusChange = new StateChangeSummary;
  }

  set trainer( trainer: 'me' | 'opp' ) {
    this._trainer = trainer;
  }
  set status( status: Status ) {
    this._status = status;
  }
  set rank( rank: ParameterRank ) {
    this._rank = rank;
  }
  set moveUsed( moveUsed: AvailableMove ) {
    this._moveUsed = moveUsed;
  }
  set damage( damage: Damage ) {
    this._damage = damage;
  }
  set target( target: Target[] ) {
    this._target = target;
  }
  set command( command: Command ) {
    this._command = command;
  }
  set statusChange( statusChange: StateChangeSummary ) {
    this._statusChange = statusChange;
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
  get move(): AvailableMove[] {
    return this._move;
  }
  get moveUsed(): AvailableMove {
    return this._moveUsed;
  }
  get damage(): Damage {
    return this._damage;
  }
  get target(): Target[] {
    return this._target;
  }
  get command(): Command {
    return this._command;
  }
  get statusChange(): StateChangeSummary {
    return this._statusChange;
  }

  declareMove(): void {
    writeLog( `${this._status.name}の ${this._moveUsed.name}!` );
  }

}






