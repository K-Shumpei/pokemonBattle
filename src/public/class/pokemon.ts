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
  _type1: MoveTypeType;
  _type2: MoveTypeType;
  _gender: string;
  _ability: string;
  _level: number;
  _item: string | null;
  _nature: string;
  _height: number;
  _weight: number;
  _happiness: number;
  _remainingHP: number;
  _statusAilment: StateChange;

  constructor() {
    this._number = '';
    this._name = '';
    this._type1 = null;
    this._type2 = null;
    this._gender = '';
    this._ability = '';
    this._level = 50;
    this._item = null;
    this._nature = '';
    this._height = 1.0;
    this._weight = 1.0;
    this._happiness = 255;
    this._remainingHP = 0;
    this._statusAilment = new StateChange( null );
  }

  set number( number: string ) {
    this._number = number;
  }
  set name( name: string ) {
    this._name = name;
  }
  set type1( type: MoveTypeType ) {
    this._type1 = type;
  }
  set type2( type: MoveTypeType ) {
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
  set item( item: string | null ) {
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
  get type1(): MoveTypeType {
    return this._type1;
  }
  get type2(): MoveTypeType {
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
  get item(): string | null {
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
    writeLog( `${this._name}の ${this._ability}` );
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

  declareTruant(): void {
    writeLog( `${this._name}は なまけている` );
  }

  declareFlinch(): void {
    writeLog( `${this._name}は ひるんで 技が 出せない!`);
  }

  declareDisable(): void {
    writeLog( `${this._name}は かなしばりで 技が 出せない!` );
  }

  declareGravity( move: string ): void {
    writeLog( `${this._name}は じゅうりょくが 強くて ${move}が 出せない!` );
  }

  declareHealBlock(): void {
    writeLog( `${this._name}は かいふくふうじで 技が 出せない!` );
  }

  declareThroatChop(): void {
    writeLog( `${this._name}は じごくづきの 効果で 技が 出せない!` );
  }

  declareTaunt(): void {
    writeLog( `${this._name}は ちょうはつされて 技が 出せない!` );
  }

  declareImprison( move: string ): void {
    writeLog( `${this._name}は ふういんで ${move}が だせない!` );
  }

  declareConfuse( confuse: StateChange, random: number ): void {

    if ( confuse.count === 0 ) {
      writeLog( `混乱が 解けた!` );
    } else {
      writeLog( `${this._name}は 混乱している!` );
      if ( random < 1/3 * 100 ) {
        writeLog( `わけも わからず 自分を 攻撃した!` );
      }
    }
  }

  declareParalysis(): void {
    writeLog( `${this._name}は 体がしびれて 動けない!` );
  }

  declareAttract( name: string, random: number ): void {
    writeLog( `${this._name}は ${name}に メロメロだ!` );
    if ( random < 50 ) {
      writeLog( `${this._name}は メロメロで 技が だせなかった!` );
    }
  }

  cureAilment(): void {

    if ( this._statusAilment.name === 'ねむり' ) {
      writeLog( `${this._name}は 目を 覚ました!` );
    }
    if ( this._statusAilment.name === 'こおり' ) {
      writeLog( `${this._name}の こおりが 溶けた!` );
    }

    this._statusAilment = new StateChange( null );
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
  _type: MoveTypeType;
  _category: MoveCategoryType;
  _power: number;
  _accuracy: number;
  _remainingPP: number;
  _powerPoint: number;
  _isDirect: boolean;
  _isProtect: boolean;
  _target: MoveTargetType;
  _number: number;
  _priority: number;

  constructor() {
    this._name = '';
    this._type = null;
    this._category = '物理';
    this._power = 0;
    this._accuracy = 0;
    this._remainingPP = 0;
    this._powerPoint = 0;
    this._isDirect = true;
    this._isProtect = true;
    this._target = '自分';
    this._number = 0;
    this._priority = 0;
  }

  set name( name: string ) {
    this._name = name;
  }
  set type( type: MoveTypeType ) {
    this._type = type;
  }
  set category( category: MoveCategoryType ) {
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
  set target( target: MoveTargetType ) {
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
  get type(): MoveTypeType {
    return this._type;
  }
  get category(): MoveCategoryType {
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
  get target(): MoveTargetType {
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
  _trainer: 'me' | 'opp' | 'field';
  _battleNumber: number | null;
  _success: boolean;

  constructor() {
    this._trainer = 'field';
    this._battleNumber = null;
    this._success = true;
  }

  set trainer( trainer: 'me' | 'opp' | 'field' ) {
    this._trainer = trainer;
  }
  set battleNumber( battleNumber: number | null ) {
    this._battleNumber = battleNumber;
  }
  set success( success: boolean ) {
    this._success = success;
  }

  get trainer(): 'me' | 'opp' | 'field' {
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
  _name: string | null;
  _isTrue: boolean;
  _turn: number;
  _count: number;
  _number: number;
  _text: string;
  _target: Target;

  constructor( name: string | null ) {
    this._name = name;
    this._isTrue = false;
    this._turn = 0;
    this._count = 0;
    this._number = 0;
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
  set number( number: number ) {
    this._number = number;
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
  get number(): number {
    return this._number;
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
    this._number = 0;
    this._text = '';
    this._target = new Target;
  }
}


class StateChangeSummary {

  _flinch: StateChange; // ひるみ
  // バインド
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

  /*
  にげられない
  そうでん
  */

  _powder: StateChange; // ふんじん
  _throatChop: StateChange; // じごくづき
  /*
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
  */
  _uproar: StateChange; // さわぐ
  // あばれる
  _imprison: StateChange;// ふういん
  /*
  いかり
  マジックコート
  */

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
  _quarkDrive: StateChange; // クォークチャージ
  _protosynthesis: StateChange; // こだいかっせい
  _flashFire: StateChange; // もらいび
  _skin: StateChange; // スキン系特性
  _gem: StateChange; // ジュエル
  _cannotMove: StateChange; // 反動で動けない
  _endure: StateChange; // こらえる
  _endureMsg: StateChange; // HP1で耐える効果の保存
  _recycle: StateChange; // リサイクル
  _dynamax: StateChange; // ダイマックス

  constructor() {
    this._flinch = new StateChange( 'ひるみ');
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
    this._powder = new StateChange( 'ふんじん' );
    this._throatChop = new StateChange( 'じごくづき' );
    this._tarShot = new StateChange( 'タールショット' );

    this._focusEnergy = new StateChange( 'きゅうしょアップ' );
    this._substitute = new StateChange( 'みがわり' );
    this._lockOn = new StateChange( 'ロックオン' );
    this._minimize = new StateChange( 'ちいさくなる' );
    this._uproar = new StateChange( 'さわぐ' );
    this._imprison = new StateChange( 'ふういん' );
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
    this._quarkDrive = new StateChange( 'クォークチャージ' );
    this._protosynthesis = new StateChange( 'こだいかっせい' );
    this._flashFire = new StateChange( 'もらいび' );
    this._skin = new StateChange( 'スキン系特性' );
    this._gem = new StateChange( 'ジュエル' );
    this._cannotMove = new StateChange( '反動で動けない' );
    this._endure = new StateChange( 'こらえる' );
    this._endureMsg = new StateChange( 'HP1で耐える効果' );
    this._recycle = new StateChange( 'リサイクル' );
    this._dynamax = new StateChange( 'ダイマックス' );
  }

  set flinch( flinch: StateChange ) {
    this._flinch = flinch;
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
  set powder( powder: StateChange ) {
    this._powder = powder;
  }
  set throatChop( throatChop: StateChange ) {
    this._throatChop = throatChop;
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
  set uproar( uproar: StateChange ) {
    this._uproar = uproar;
  }
  set imprison( imprison: StateChange ) {
    this._imprison = imprison;
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
  set quarkDrive( quarkDrive: StateChange ) {
    this._quarkDrive = quarkDrive;
  }
  set protosynthesis( protosynthesis: StateChange ) {
    this._protosynthesis = protosynthesis;
  }
  set flashFire( flashFire: StateChange ) {
    this._flashFire = flashFire;
  }
  set skin( skin: StateChange ) {
    this._skin = skin;
  }
  set gem( gem: StateChange ) {
    this._gem = gem;
  }
  set cannotMove( cannotMove: StateChange ) {
    this._cannotMove = cannotMove;
  }
  set endure( endure: StateChange ) {
    this._endure = endure;
  }
  set endureMsg( endureMsg: StateChange ) {
    this._endureMsg = endureMsg;
  }
  set recycle( recycle: StateChange ) {
    this._recycle = recycle;
  }
  set dynamax( dynamax: StateChange ) {
    this._dynamax = dynamax;
  }

  get flinch(): StateChange {
    return this._flinch;
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
  get powder(): StateChange {
    return this._powder;
  }
  get throatChop(): StateChange {
    return this._throatChop;
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
  get uproar(): StateChange {
    return this._uproar;
  }
  get imprison(): StateChange {
    return this._imprison;
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
  get quarkDrive(): StateChange {
    return this._quarkDrive;
  }
  get protosynthesis(): StateChange {
    return this._protosynthesis;
  }
  get flashFire(): StateChange {
    return this._flashFire;
  }
  get skin(): StateChange {
    return this._skin;
  }
  get gem(): StateChange {
    return this._gem;
  }
  get cannotMove(): StateChange {
    return this._cannotMove;
  }
  get endure(): StateChange {
    return this._endure;
  }
  get endureMsg(): StateChange {
    return this._endureMsg;
  }
  get recycle(): StateChange {
    return this._recycle;
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
    this._stateChange = new StateChangeSummary;
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
  get stateChange(): StateChangeSummary {
    return this._stateChange;
  }

  declareMove(): void {
    writeLog( `${this._status.name}の ${this._moveUsed.name}!` );
  }

}






