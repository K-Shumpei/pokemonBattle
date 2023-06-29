class ActionOrderInfo {
  _trainer: 'me' | 'opp';
  _battleNumber: number | null;
  _party: number;
  _raise: number;
  _lower: number;
  _priority: number;
  _ahead: number;
  _later: number;
  _speed: number;
  _random: number;

  constructor() {
    this._trainer = 'me';
    this._battleNumber = 0;
    this._party = 0;
    this._raise = 0;
    this._lower = 0;
    this._priority = 0;
    this._ahead = 0;
    this._later = 0;
    this._speed = 0;
    this._random = 0;
  }

  set trainer( trainer: 'me' | 'opp' ) {
    this._trainer = trainer;
  }
  set battleNumber( battleNumber: number | null ) {
    this._battleNumber = battleNumber;
  }
  set party( party: number ) {
    this._party = party;
  }
  set raise( raise: number ) {
    this._raise = raise;
  }
  set lower( lower: number ) {
    this._lower = lower;
  }
  set priority( priority: number ) {
    this._priority = priority;
  }
  set ahead( ahead: number ) {
    this._ahead = ahead;
  }
  set later( later: number ) {
    this._later = later;
  }
  set speed( speed: number ) {
    this._speed = speed;
  }
  set random( random: number ) {
    this._random = random;
  }

  get trainer(): 'me' | 'opp' {
    return this._trainer;
  }
  get battleNumber(): number | null {
    return this._battleNumber;
  }
  get party(): number {
    return this._party;
  }
  get raise(): number {
    return this._raise;
  }
  get lower(): number {
    return this._lower;
  }
  get priority(): number {
    return this._priority;
  }
  get ahead(): number {
    return this._priority;
  }
  get later(): number {
    return this._later;
  }
  get speed(): number {
    return this._speed;
  }
  get random(): number {
    return this._random;
  }
}


