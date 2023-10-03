// -------------------------
// 範囲のある値
// -------------------------
class ValueWithRange {
  _value: number;
  _max: number;
  _min: number;

  constructor( max: number, min: number ) {
    this._value = 0;
    this._max = max;
    this._min = min;
  }

  get value(): number {
    return this._value;
  }
  get max(): number {
    return this._max;
  }

  add( value: number ): void {
    value = Math.min( 6, this._value + value );
    value = Math.max( -6, this._value + value );
    this._value = value;
  }

  sub( value: number ): void {
    value = Math.min( 6, this._value - value );
    value = Math.max( -6, this._value - value );
    this._value = value;
  }

  toZero(): void {
    this._value = 0;
  }

  isMax(): boolean {
    return this._value === this._max;
  }

  isMin(): boolean {
    return this._value === this._min;
  }

  isZero(): boolean {
    return this._value === 0;
  }

  isPlus(): boolean {
    return this._value > 0;
  }

  isMinus(): boolean {
    return this._value < 0;
  }

}

// -------------------------
// 実数値・種族値・個体値・努力値
// -------------------------
class ActualWithThreeValue {
  _actual: number;
  _base: number;
  _individual: number;
  _effort: number;

  constructor() {
    this._actual = 0;
    this._base = 0;
    this._individual = 0;
    this._effort = 0;
  }

  get actual(): number {
    return this._actual;
  }
  get base(): number {
    return this._base;
  }
  get individual(): number {
    return this._individual;
  }
  get effort(): number {
    return this._effort;
  }

  register( parameter: string ): void {
    this.setActual( Number( getHTMLInputElement( 'register_' + parameter + 'ActualValue' ).value ) );
    this.setBase( Number( getHTMLInputElement( 'register_' + parameter + 'BaseStatus' ).value ) );
    this.setIndividual( Number( getHTMLInputElement( 'register_' + parameter + 'IndividualValue' ).value ) );
    this.setEffort( Number( getHTMLInputElement( 'register_' + parameter + 'EffortValue' ).value ) );
  }

  edit( parameter: string ): void {
    getHTMLInputElement( 'register_' + parameter + 'IndividualValue' ).value = String( this._individual );
    getHTMLInputElement( 'register_' + parameter + 'EffortValue' ).value = String( this._effort );
  }

  showAcrual( parameter: string, handOrder: number ): void {
    getHTMLInputElement( 'party' + handOrder + '_' + parameter ).textContent = String( this._actual );
  }

  copy( status: ActualWithThreeValue ): void {
    this.setActual( status._actual );
    this.setBase( status._base );
    this.setIndividual( status._individual );
    this.setEffort( status._effort );
  }

  setActual( value: number ): void {
    this._actual = value;
  }
  setBase( value: number): void {
    this._base = value;
  }
  setIndividual( value: number ): void {
    this._individual = value;
  }
  setEffort( value: number ): void {
    this._effort = value;
  }
}





// -------------------------
// 各ステータス
// -------------------------
class Status {
  _hitPoint: HitPoint;
  _attack: MainStatus;
  _defense: MainStatus;
  _specialAttack: MainStatus;
  _specialDefense: MainStatus;
  _speed: MainStatus;
  _accuracy: Rank;
  _evasion: Rank;

  constructor() {
    this._hitPoint = new HitPoint();
    this._attack = new MainStatus();
    this._defense = new MainStatus();
    this._specialAttack = new MainStatus();
    this._specialDefense = new MainStatus();
    this._speed = new MainStatus();
    this._accuracy = new Rank();
    this._evasion = new Rank();
  }

  get hitPoint(): HitPoint {
    return this._hitPoint;
  }
  get attack(): MainStatus {
    return this._attack;
  }
  get defense(): MainStatus {
    return this._defense;
  }
  get specialAttack(): MainStatus {
    return this._specialAttack;
  }
  get specialDefense(): MainStatus {
    return this._specialDefense;
  }
  get speed(): MainStatus {
    return this._speed;
  }
  get accuracy(): Rank {
    return this._accuracy;
  }
  get evasion(): Rank {
    return this._evasion;
  }

  register(): void {
    this._hitPoint.register( 'hitPoint' );
    this._attack.register( 'attack' );
    this._defense.register( 'defense' );
    this._specialAttack.register( 'specialAttack' );
    this._specialDefense.register( 'specialDefense' );
    this._speed.register( 'speed' );
  }

  edit(): void {
    this._hitPoint.edit( 'hitPoint' );
    this._attack.edit( 'attack' );
    this._defense.edit( 'defense' );
    this._specialAttack.edit( 'specialAttack' );
    this._specialDefense.edit( 'specialDefense' );
    this._speed.edit( 'speed' );
  }

  getAllEffort(): number {
    let allEffort: number = 0;
    allEffort += this._hitPoint.effort;
    allEffort += this._attack.effort;
    allEffort += this._defense.effort;
    allEffort += this._specialAttack.effort;
    allEffort += this._specialDefense.effort;
    allEffort += this._speed.effort;

    return allEffort;
  }

  showActual( handOrder: number ): void {
    this._hitPoint.showAcrual( 'hitPoint', handOrder );
    this._attack.showAcrual( 'attack', handOrder );
    this._defense.showAcrual( 'defense', handOrder );
    this._specialAttack.showAcrual( 'specialAttack', handOrder );
    this._specialDefense.showAcrual( 'specialDefense', handOrder );
    this._speed.showAcrual( 'speed', handOrder );
  }

  resetRank(): void {
    this._attack.rank.toZero();
    this._defense.rank.toZero();
    this._specialAttack.rank.toZero();
    this._specialDefense.rank.toZero();
    this._speed.rank.toZero();
    this._accuracy.toZero();
    this._evasion.toZero();
  }

  copy( status: Status ): void {
    this._hitPoint.copy( status._hitPoint );
    this._attack.copy( status._attack );
    this._defense.copy( status._defense );
    this._specialAttack.copy( status._specialAttack );
    this._specialDefense.copy( status._specialDefense );
    this._speed.copy( status._speed );
  }
}




// -------------------------
// HP
// -------------------------
class HitPoint extends ActualWithThreeValue {
  _value: HitPointValue;

  constructor() {
    super()
    this._value = new HitPointValue();
  }

  get value(): HitPointValue {
    return this._value;
  }
}

class HitPointValue extends ValueWithRange {

  constructor() {
    super( 175, 0 );
  }


  setActualValue( value: number ) {
    this._value = value;
    this._max = value;
  }

  rate(): number {
    return this._value / this._max;
  }

  isGreaterThan( denominator: number ): boolean {
    return this._value > this._max / denominator;
  }

  isGreaterEqual( denominator: number ): boolean {
    return this._value >= this._max / denominator;
  }

  isLessThan( denominator: number ): boolean {
    return this._value < this._max / denominator;
  }

  isLessEqual( denominator: number ): boolean {
    return this._value <= this._max / denominator;
  }
}

// -------------------------
// 攻撃・防御・特攻・特防・素早さ
// -------------------------
class MainStatus extends ActualWithThreeValue {
  _rank: Rank;

  constructor() {
    super();
    this._rank = new Rank();
  }

  get rank(): Rank {
    return this._rank;
  }
}


// -------------------------
// 命中率・回避率
// -------------------------
class Rank extends ValueWithRange {

  constructor() {
    super( 6, -6 )
  }

}
