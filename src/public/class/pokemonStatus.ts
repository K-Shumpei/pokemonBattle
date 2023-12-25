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
    value = Math.min( this._max, this._value + value );
    value = Math.max( this._min, this._value + value );
    this._value = value;
  }

  sub( value: number ): void {
    value = Math.min( this._max, this._value - value );
    value = Math.max( this._min, this._value - value );
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
  _av: number;
  _bs: number;
  _iv: number;
  _ev: number;

  constructor() {
    this._av = 0;
    this._bs = 0;
    this._iv = 0;
    this._ev = 0;
  }

  set bs( bs: number ) {
    this._bs = bs;
  }

  get av(): number {
    return this._av;
  }
  get bs(): number {
    return this._bs;
  }
  get iv(): number {
    return this._iv;
  }
  get ev(): number {
    return this._ev;
  }

  register( stat: RegisterFiveStatus ): void {
    this._av = stat.av;
    this._bs = stat.bs;
    this._iv = stat.iv;
    this._ev = stat.ev;
  }

  edit( parameter: string ): void {
    getHTMLInputElement( 'register_' + parameter + 'IndividualValue' ).value = String( this._iv );
    getHTMLInputElement( 'register_' + parameter + 'EffortValue' ).value = String( this._ev );
  }

  showAcrual( name: string, parameter: string, handOrder: number ): void {
    getHTMLInputElement( 'party' + handOrder + '_' + parameter ).textContent = ( name === '' )? '' : String( this._av );
  }

  copy( status: ActualWithThreeValue ): void {
    this._av = status._av;
    this._bs = status._bs;
    this._iv = status._iv;
    this._ev = status._ev;
  }
}





// -------------------------
// 各ステータス
// -------------------------
class Status {
  _hp: HitPoint;
  _atk: MainStatus;
  _def: MainStatus;
  _spA: MainStatus;
  _spD: MainStatus;
  _spe: Speed;
  _acc: Rank;
  _eva: Rank;

  constructor() {
    this._hp = new HitPoint();
    this._atk = new MainStatus( '攻撃' );
    this._def = new MainStatus( '防御' );
    this._spA = new MainStatus( '特攻' );
    this._spD = new MainStatus( '特防' );
    this._spe = new Speed( '素早さ' );
    this._acc = new Rank( '命中率' );
    this._eva = new Rank( '回避率' );
  }

  get hp(): HitPoint {
    return this._hp;
  }
  get atk(): MainStatus {
    return this._atk;
  }
  get def(): MainStatus {
    return this._def;
  }
  get spA(): MainStatus {
    return this._spA;
  }
  get spD(): MainStatus {
    return this._spD;
  }
  get spe(): Speed {
    return this._spe;
  }
  get acc(): Rank {
    return this._acc;
  }
  get eva(): Rank {
    return this._eva;
  }

  register( stat: RegisterStatus ): void {
    this._hp.register( stat.hp );
    this._atk.register( stat.atk );
    this._def.register( stat.def );
    this._spA.register( stat.spA );
    this._spD.register( stat.spD );
    this._spe.register( stat.spe );
    this._hp.value.setActualValue( stat.hp.av );
  }

  edit(): void {
    this._hp.edit( 'hitPoint' );
    this._atk.edit( 'attack' );
    this._def.edit( 'defense' );
    this._spA.edit( 'specialAttack' );
    this._spD.edit( 'specialDefense' );
    this._spe.edit( 'speed' );
  }

  getAllEffort(): number {
    let allEffort: number = 0;
    allEffort += this._hp.ev;
    allEffort += this._atk.ev;
    allEffort += this._def.ev;
    allEffort += this._spA.ev;
    allEffort += this._spD.ev;
    allEffort += this._spe.ev;

    return allEffort;
  }

  show( name: string, handOrder: number ): void {
    this._hp.showAcrual( name, 'hitPoint', handOrder );
    this._atk.showAcrual( name, 'attack', handOrder );
    this._def.showAcrual( name, 'defense', handOrder );
    this._spA.showAcrual( name, 'specialAttack', handOrder );
    this._spD.showAcrual( name, 'specialDefense', handOrder );
    this._spe.showAcrual( name, 'speed', handOrder );
  }

  resetRank(): void {
    this._atk.rank.toZero();
    this._def.rank.toZero();
    this._spA.rank.toZero();
    this._spD.rank.toZero();
    this._spe.rank.toZero();
    this._acc.toZero();
    this._eva.toZero();
  }

  copyFromOpp( status: Status ): void {
    this._hp.copy( status._hp );
    this._atk.copy( status._atk );
    this._def.copy( status._def );
    this._spA.copy( status._spA );
    this._spD.copy( status._spD );
    this._spe.copy( status._spe );
  }

  calcRankCorrValue( critical: boolean ): void {
    this._atk.calcRankCorrValue( critical );
    this._def.calcRankCorrValue( critical );
    this._spA.calcRankCorrValue( critical );
    this._spD.calcRankCorrValue( critical );
  }

  formChange( bs: { hp: number, atk: number, def: number, spA: number, spD: number, spe: number }, level: number, nature: NatureData ): void {
    this._hp.bs = bs.hp;
    this._atk.bs = bs.atk;
    this._def.bs = bs.def;
    this._spA.bs = bs.spA;
    this._spD.bs = bs.spD;
    this._spe.bs = bs.spe;

    this._hp.calcAct( level );
    this._atk.calcAct( level, nature.atk );
    this._def.calcAct( level, nature.def );
    this._spA.calcAct( level, nature.spA );
    this._spD.calcAct( level, nature.spD );
    this._spe.calcAct( level, nature.spe );
  }

  changeRank( para: RankStrings, real: number, setting: number, name: string, item?: string ): void {
    switch ( para ) {
      case 'atk':
        this._atk.rank.change( name, real, setting, item );
        break;
      case 'def':
        this._def.rank.change( name, real, setting, item );
        break;
      case 'spA':
        this._spA.rank.change( name, real, setting, item );
        break;
      case 'spD':
        this._spD.rank.change( name, real, setting, item );
        break;
      case 'spe':
        this._spe.rank.change( name, real, setting, item );
        break;
      case 'acc':
        this._acc.change( name, real, setting, item );
        break;
      case 'eva':
        this._eva.change( name, real, setting, item );
        break;
      default:
        break;
    }
  }

  countRank(): number {
    let count: number = 0;
    count += this._atk.rank.value;
    count += this._def.rank.value;
    count += this._spA.rank.value;
    count += this._spD.rank.value;
    count += this._spe.rank.value;
    count += this._acc.value;
    count += this._eva.value;

    return count;
  }

  useWhiteHerb(): boolean {
    let result: boolean = false;
    result = this._atk.rank.useWhiteHerb();
    result = this._def.rank.useWhiteHerb();
    result = this._spA.rank.useWhiteHerb();
    result = this._spD.rank.useWhiteHerb();
    result = this._spe.rank.useWhiteHerb();
    result = this._acc.useWhiteHerb();
    result = this._eva.useWhiteHerb();

    return result;
  }

  toZeroAllRank(): void {
    this._atk.rank.toZero();
    this._def.rank.toZero();
    this._spA.rank.toZero();
    this._spD.rank.toZero();
    this._spe.rank.toZero();
    this._acc.toZero();
    this._eva.toZero();
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

  calcAct( level: number ): void {
    const step1: number = this._bs * 2 + this._iv + Math.floor( this._ev / 4 );
    const step2: number = step1 * level;
    this._av = Math.floor( step2 / 100 ) + level + 10;
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
  _value: number;

  constructor( text: string ) {
    super();
    this._rank = new Rank( text );
    this._value = 0;
  }

  get rank(): Rank {
    return this._rank;
  }
  get value(): number {
    return this._value;
  }

  calcRankCorrValue( critical: boolean ): void {
    const rank: number = ( critical )? Math.max( this._rank.value, 0 ) : this._rank.value;
    const corr: number = ( rank > 0 )? ( 2 + rank ) / 2 : 2 / ( 2 - rank );
    this._value = Math.floor( this._av * corr );
  }

  calcAct( level: number, corr: number ): void {
    const step1: number = this._bs * 2 + this._iv + Math.floor( this._ev / 4 );
    const step2: number = step1 * level;
    const step3: number = Math.floor( step2 / 100 );
    this._av = Math.floor( ( step3 + 5 ) * corr );
  }

}

class Speed extends MainStatus {
  _actionOrder: number; // 行動順に影響のある値
  _forPowerCalc: number; // ジャイロボール・エレキボールの威力計算に関わる値
  _random: number; // 乱数

  constructor( text: string ) {
    super( text );
    this._actionOrder = 0;
    this._forPowerCalc = 0;
    this._random = 0;
  }

  get actionOrder(): number {
    return this._actionOrder;
  }
  get forPowerCalc(): number {
    return this._forPowerCalc;
  }
  get random(): number {
    return this._random;
  }

  calcSpeed( corr: number, paralysis: number, trickRoom: boolean ): void {
    // ランク補正値の計算
    const rank: number = this._rank.value;
    const rankCorr: number = ( rank > 0 )? ( 2 + rank ) / 2 : 2 / ( 2 - rank );
    this._value = Math.floor( this._av * rankCorr );

    // 各種補正
    const corr1: number = fiveRoundEntry( this._value * corr / 4096 )
    const corr2: number = Math.floor( corr1 * paralysis )
    this._forPowerCalc = Math.min( 10000, corr2 );

    // トリックルーム
    const corr3: number = ( trickRoom )? 10000 - this._forPowerCalc : this._forPowerCalc;
    this._actionOrder = corr3 % 8192;

    // 乱数
    this._random = getRandom();
  }
}


// -------------------------
// 命中率・回避率
// -------------------------
class Rank extends ValueWithRange {
  _text: string;

  constructor( text: string ) {
    super( 6, -6 );
    this._text = text;
  }

  getVariable( value: number ): number {
    if ( value > 0 ) return Math.min( value, this._max - this._value );
    if ( value < 0 ) return Math.max( value, this._min + this._value );
    return value;
  }

  change( name: string, real: number, setting: number, item?: string ): void {
    this.add( real );
    if ( real === 0 && setting > 0 ) this.msgNoUp( name );
    if ( real === 0 && setting < 0 ) this.msgNoDown( name );
    if ( real === 1 ) this.msgUp( name, item );
    if ( real === -1 ) this.msgDown( name, item );
    if ( real === 2 ) this.msgSuperUp( name, item );
    if ( real === -2 ) this.msgSuperDown( name, item );
    if ( real >= 3 ) this.msgHyperUp( name, item );
    if ( real <= -3 ) this.msgHyperDown( name, item );
  }

  msgNoUp( name: string ): void {
    writeLog( `${name}の ${this._text}は もう上がらない!` );
  }
  msgNoDown( name: string ): void {
    writeLog( `${name}の ${this._text}は もう下がらない!` );
  }
  msgUp( name: string, item?: string ): void {
    if ( item ) writeLog( `${name}は ${item}で ${this._text}が 上がった!` );
    else writeLog( `${name}の ${this._text}が 上がった!` );
  }
  msgDown( name: string, item?: string ): void {
    if ( item ) writeLog( `${name}は ${item}で ${this._text}が 下がった!` );
    else writeLog( `${name}の ${this._text}が 下がった!` );
  }
  msgSuperUp( name: string, item?: string ): void {
    if ( item ) writeLog( `${name}は ${item}で ${this._text}が ぐーんと上がった!` );
    else writeLog( `${name}の ${this._text}が ぐーんと上がった!` );
  }
  msgSuperDown( name: string, item?: string ): void {
    if ( item ) writeLog( `${name}は ${item}で ${this._text}が がくっと下がった!` );
    else writeLog( `${name}の ${this._text}が がくっと下がった!` );
  }
  msgHyperUp( name: string, item?: string ): void {
    if ( item ) writeLog( `${name}は ${item}で ${this._text}が ぐぐーんと上がった!` );
    else writeLog( `${name}の ${this._text}が ぐぐーんと上がった!` );
  }
  msgHyperDown( name: string, item?: string ): void {
    if ( item ) writeLog( `${name}は ${item}で ${this._text}が がくーんと下がった!` );
    else writeLog( `${name}の ${this._text}が がくーんと下がった!` );
  }

  useWhiteHerb(): boolean {
    if ( this._value < 0 ) {
      this.toZero();
      return true;
    }

    return false;
  }

}
