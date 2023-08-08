class Weather {
  _name: WeatherType;
  _turn: number;
  _extend: boolean;

  constructor() {
    this._name = null;
    this._turn = 0;
    this._extend = false;
  }

  set name( name: WeatherType ) {
    this._name = name;
  }
  set turn( turn: number ) {
    this._turn = turn;
  }
  set extend( extend: boolean ) {
    this._extend = extend;
  }

  get name(): WeatherType {
    return this._name;
  }
  get turn(): number {
    return this._turn;
  }
  get extend(): boolean {
    return this._extend;
  }

  reset(): void {
    this._name = null;
    this._turn = 0;
    this._extend = false;
  }
}

class Terrain {
  _name: TerrainType;
  _turn: number;
  _extend: boolean;

  constructor() {
    this._name = null;
    this._turn = 0;
    this._extend = false;
  }

  set name( name: TerrainType ) {
    this._name = name;
  }
  set turn( turn: number ) {
    this._turn = turn;
  }
  set extend( extend: boolean ) {
    this._extend = extend;
  }

  get name(): TerrainType {
    return this._name;
  }
  get turn(): number {
    return this._turn;
  }
  get extend(): boolean {
    return this._extend;
  }

  reset(): void {
    this._name = null;
    this._turn = 0;
    this._extend = false;
  }
}

class WholeField {

  _trickRoom: StateChange; // トリックルーム
  _magicRoom: StateChange; // マジックルーム
  _wonderRoom: StateChange; // ワンダールーム
  _gravity: StateChange; // じゅうりょく
  _mudSport: StateChange; // どろあそび (第六世代以降。以前は状態変化)
  _fairyLock: StateChange; // フェアリーロック
  _ionDeluge: StateChange; // プラズマシャワー
  _waterSport: StateChange; // みずあそび (第六世代以降。以前は状態変化)
  _futureSight: StateChange[];

  constructor() {
    this._trickRoom = new StateChange( 'トリックルーム' );
    this._magicRoom = new StateChange( 'マジックルーム' );
    this._wonderRoom = new StateChange( 'ワンダールーム' );
    this._gravity = new StateChange( 'じゅうりょく' );
    this._mudSport = new StateChange( 'どろあそび' );
    this._fairyLock = new StateChange( 'フェアリーロック' );
    this._ionDeluge = new StateChange( 'プラズマシャワー' );
    this._waterSport = new StateChange( 'みずあそび' );
    this._futureSight = [];
  }

  set trickRoom( trickRoom: StateChange ) {
    this._trickRoom = trickRoom;
  }
  set magicRoom( magicRoom: StateChange ) {
    this._magicRoom = magicRoom;
  }
  set wonderRoom( wonderRoom: StateChange ) {
    this._wonderRoom = wonderRoom;
  }
  set gravity( gravity: StateChange ) {
    this._gravity = gravity;
  }
  set mudSport( mudSport: StateChange ) {
    this._mudSport = mudSport;
  }
  set fairyLock( fairyLock: StateChange ) {
    this._fairyLock = fairyLock;
  }
  set ionDeluge( ionDeluge: StateChange ) {
    this._ionDeluge = ionDeluge;
  }
  set waterSport( waterSport: StateChange ) {
    this._waterSport = waterSport;
  }
  set futureSight( futureSight: StateChange[] ) {
    this._futureSight = futureSight;
  }

  get trickRoom(): StateChange {
    return this._trickRoom;
  }
  get magicRoom(): StateChange {
    return this._magicRoom;
  }
  get wonderRoom(): StateChange {
    return this._wonderRoom;
  }
  get gravity(): StateChange {
    return this._gravity;
  }
  get mudSport(): StateChange {
    return this._mudSport;
  }
  get fairyLock(): StateChange {
    return this._fairyLock;
  }
  get ionDeluge(): StateChange {
    return this._ionDeluge;
  }
  get waterSport(): StateChange {
    return this._waterSport;
  }
  get futureSight(): StateChange[] {
    return this._futureSight;
  }
}

class SideField {

  // 味方の場に発生
  _auroraVeil: StateChange; // オーロラベール
  _lightScreen: StateChange; // ひかりのかべ
  _reflect: StateChange; // リフレクター
  _matBlock: StateChange; // たたみがえし
  _craftyShield: StateChange; // トリックガード
  _quickGuard: StateChange;// ファストガード
  _wideGuard: StateChange; // ワイドガード
  _tailwind: StateChange; // おいかぜ
  _luckyChant: StateChange; // おまじない
  _mist: StateChange; // しろいきり
  _safeguard: StateChange; // しんぴのまもり
  _rainbow: StateChange; // にじ

  // 相手の場に発生
  _stealthRock: StateChange; // ステルスロック
  _toxicSpikes: StateChange; // どくびし
  _stickyWeb: StateChange; // ねばねばネット
  _spikes: StateChange; // まきびし
  _steelsurge: StateChange; // キョダイコウジン
  _wildfire: StateChange // キョダイゴクエン
  _volcalith: StateChange; // キョダイフンセキ
  _vineLash: StateChange; // キョダイベンタツ
  _cannonade: StateChange; // キョダイホウゲキ
  _wetlands: StateChange; // しつげん
  _seaOfFire: StateChange; // ひのうみ

  constructor() {
    this._auroraVeil = new StateChange( 'オーロラベール' );
    this._lightScreen = new StateChange( 'ひかりのかべ' );
    this._reflect = new StateChange( 'リフレクター' );
    this._matBlock = new StateChange( 'たたみがえし' );
    this._craftyShield = new StateChange( 'トリックガード' );
    this._quickGuard = new StateChange( 'ファストガード' );
    this._wideGuard = new StateChange( 'ワイドガード' );
    this._tailwind = new StateChange( 'おいかぜ' );
    this._luckyChant = new StateChange( 'おまじない' );
    this._mist = new StateChange( 'しろいきり' );
    this._safeguard = new StateChange( 'しんぴのまもり' );
    this._rainbow = new StateChange( 'にじ' );

    this._stealthRock = new StateChange( 'ステルスロック' );
    this._toxicSpikes = new StateChange( 'どくびし' );
    this._stickyWeb = new StateChange( 'ねばねばネット' );
    this._spikes = new StateChange( 'まきびし' );
    this._steelsurge = new StateChange( 'キョダイコウジン' );
    this._wildfire = new StateChange( 'キョダイゴクエン' );
    this._volcalith = new StateChange( 'キョダイフンセキ' );
    this._vineLash = new StateChange( 'キョダイベンタツ' );
    this._cannonade = new StateChange( 'キョダイホウゲキ' );
    this._wetlands = new StateChange( 'しつげん' );
    this._seaOfFire = new StateChange( 'ひのうみ' );
  }

  set auroraVeil( auroraVeil: StateChange ) {
    this._auroraVeil = auroraVeil;
  }
  set lightScreen( lightScreen: StateChange ) {
    this._lightScreen = lightScreen;
  }
  set reflect( reflect: StateChange ) {
    this._reflect = reflect;
  }
  set matBlock( matBlock: StateChange ) {
    this._matBlock = matBlock;
  }
  set craftyShield( craftyShield: StateChange ) {
    this._craftyShield = craftyShield;
  }
  set quickGuard( quickGuard: StateChange ) {
    this._quickGuard = quickGuard;
  }
  set wideGuard( wideGuard: StateChange ) {
    this._wideGuard = wideGuard;
  }
  set tailwind( tailwind: StateChange ) {
    this._tailwind = tailwind;
  }
  set luckyChant( luckyChant: StateChange ) {
    this._luckyChant = luckyChant;
  }
  set mist( mist: StateChange ) {
    this._mist = mist;
  }
  set safeguard( safeguard: StateChange ) {
    this._safeguard = safeguard;
  }
  set rainbow( rainbow: StateChange ) {
    this._rainbow = rainbow;
  }
  set stealthRock( stealthRock: StateChange ) {
    this._stealthRock = stealthRock;
  }
  set toxicSpikes( toxicSpikes: StateChange ) {
    this._toxicSpikes = toxicSpikes;
  }
  set stickyWeb( stickyWeb: StateChange ) {
    this._stickyWeb = stickyWeb;
  }
  set spikes( spikes: StateChange ) {
    this._spikes = spikes;
  }
  set steelsurge( steelsurge: StateChange ) {
    this._steelsurge = steelsurge;
  }
  set wildfire( wildfire: StateChange ) {
    this._wildfire = wildfire;
  }
  set volcalith( volcalith: StateChange ) {
    this._volcalith = volcalith;
  }
  set vineLash( vineLash: StateChange ) {
    this._vineLash = vineLash;
  }
  set cannonade( cannonade: StateChange ) {
    this._cannonade = cannonade;
  }
  set wetlands( wetlands: StateChange ) {
    this._wetlands = wetlands;
  }
  set seaOfFire( seaOfFire: StateChange ) {
    this._seaOfFire = seaOfFire;
  }

  get auroraVeil(): StateChange {
    return this._auroraVeil;
  }
  get lightScreen(): StateChange {
    return this._lightScreen;
  }
  get reflect(): StateChange {
    return this._reflect;
  }
  get matBlock(): StateChange {
    return this._matBlock;
  }
  get craftyShield(): StateChange {
    return this._craftyShield;
  }
  get quickGuard(): StateChange {
    return this._quickGuard;
  }
  get wideGuard(): StateChange {
    return this._wideGuard;
  }
  get tailwind(): StateChange {
    return this._tailwind;
  }
  get luckyChant(): StateChange {
    return this._luckyChant;
  }
  get mist(): StateChange {
    return this._mist;
  }
  get safeguard(): StateChange {
    return this._safeguard;
  }
  get rainbow(): StateChange {
    return this._rainbow;
  }
  get stealthRock(): StateChange {
    return this._stealthRock;
  }
  get toxicSpikes(): StateChange {
    return this._toxicSpikes;
  }
  get stickyWeb(): StateChange {
    return this._stickyWeb;
  }
  get spikes(): StateChange {
    return this._spikes;
  }
  get steelsurge(): StateChange {
    return this._steelsurge;
  }
  get wildfire(): StateChange {
    return this._wildfire;
  }
  get volcalith(): StateChange {
    return this._volcalith;
  }
  get vineLash(): StateChange {
    return this._vineLash;
  }
  get cannonade(): StateChange {
    return this._cannonade;
  }
  get wetlands(): StateChange {
    return this._wetlands;
  }
  get seaOfFire(): StateChange {
    return this._seaOfFire;
  }
}

class Field {
  _battleStyle: number;
  _numberOfPokemon: number;
  _weather: Weather;
  _terrain: Terrain;
  _whole: WholeField;
  _myField: SideField;
  _opponentField: SideField;

  constructor() {
    this._battleStyle = 1;
    this._numberOfPokemon = 3;
    this._weather = new Weather;
    this._terrain = new Terrain;
    this._whole = new WholeField;
    this._myField = new SideField;
    this._opponentField = new SideField;
  }

  set weather( weather: Weather ) {
    this._weather = weather;
  }
  set terrain( terrain: Terrain ) {
    this._terrain = terrain;
  }

  get battleStyle(): number {
    return this._battleStyle;
  }
  get numberOfPokemon(): number {
    return this._numberOfPokemon;
  }
  get weather(): Weather {
    return this._weather;
  }
  get terrain(): Terrain {
    return this._terrain;
  }
  get whole(): WholeField {
    return this._whole;
  }

  getSide( side: 'me' | 'opp' ): SideField {
    if ( side === 'me' ) {
      return this._myField;
    } else {
      return this._opponentField;
    }
  }

  setNumberOfPokemon( battleStyle: number ): void {
    this._battleStyle = battleStyle;
    if ( battleStyle === 1 ) {
      this._numberOfPokemon = 3;
    } else if ( battleStyle === 2 ) {
      this._numberOfPokemon = 4;
    } else if ( battleStyle === 3) {
      this._numberOfPokemon = 6;
    }
  }
}
