class Move {
  _selected: SelectedMove;
  _learned: LearnedMove[];

  constructor() {
    this._selected = new SelectedMove()
    this._learned = [
      new LearnedMove(0),
      new LearnedMove(1),
      new LearnedMove(2),
      new LearnedMove(3),
    ]
  }

  get selected(): SelectedMove {
    return this._selected;
  }

  get learned(): LearnedMove[] {
    return this._learned;
  }


  register( move: RegisterMoveList ): void {
    this._learned[0].register( move.slot[0] );
    this._learned[1].register( move.slot[1] );
    this._learned[2].register( move.slot[2] );
    this._learned[3].register( move.slot[3] );
  }

  copyFromOpp( move: LearnedMove[] ): void {
    this._learned[0].copyFromOpp( move[0] );
    this._learned[1].copyFromOpp( move[1] );
    this._learned[2].copyFromOpp( move[2] );
    this._learned[3].copyFromOpp( move[3] );
  }

  show( handOrder: number ): void {
    this._learned[0].show( handOrder );
    this._learned[1].show( handOrder );
    this._learned[2].show( handOrder );
    this._learned[3].show( handOrder );
  }

  setSelcted( slot: number | null ): void {
    if ( slot === null ) return;
    this._selected.setSelected( this._learned[slot] );
  }

  showCommand1st( battleOrder: number ): void {
    this._learned[0].showCommand1st( battleOrder );
    this._learned[1].showCommand1st( battleOrder );
    this._learned[2].showCommand1st( battleOrder );
    this._learned[3].showCommand1st( battleOrder );
  }
}


// -------------------------
// 覚えている技
// -------------------------
class LearnedMove {
  _slot: number
  _name: MoveText;
  _powerPoint: PowerPoint;

  constructor( slot: number ) {
    this._slot = slot;
    this._name = null;
    this._powerPoint = new PowerPoint();
  }


  set name( name: MoveText ) {
    this._name = name
  }

  get slot(): number {
    return this._slot;
  }
  get name(): MoveText {
    return this._name;
  }
  get powerPoint(): PowerPoint {
    return this._powerPoint;
  }

  register( move: RegisterMove ): void {
    this._name = move._name;
    this._powerPoint.setMaxPP( move.powerPoint );
  }


  show( handOrder: number ): void {
    getHTMLInputElement( 'party' + handOrder + '_move' + this._slot ).textContent = ( this._name === null )? '技' : this.translate();
    getHTMLInputElement( 'party' + handOrder + '_remainingPP' + this._slot ).textContent = ( this._name === null )? '' : String( this._powerPoint.value );
    getHTMLInputElement( 'party' + handOrder + '_powerPoint' + this._slot ).textContent = ( this._name === null )? 'PP' : String( this._powerPoint.max );
  }

  translate(): string {
    return moveMaster.filter( m => m.nameEN === this._name )[0].nameJA;
  }

  copyFromOpp( move: LearnedMove ): void {
    this._name = move._name;
    this._powerPoint.setMaxPP( move._powerPoint._value );
  }

  showCommand1st( battleOrder: number ): void {
    if ( this._name === null ) return;
    getHTMLInputElement( 'moveText_' + battleOrder + '_' + this._slot ).textContent = this.translate();
    getHTMLInputElement( 'moveRadio_' + battleOrder + '_' + this._slot ).disabled = false;
  }
}

class PowerPoint extends ValueWithRange {
  constructor() {
    super( 0, 0 );
  }

  setMaxPP( PP: number ): void {
    this._max = PP;
    this._value = PP;
  }

  /*
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
  */
}


// -------------------------
// 使用する技
// -------------------------
class SelectedMove {
  _slot: number;
  _name: string;
  _type: PokemonType;
  _class: MoveClass;
  _target: MoveTarget;
  _power: number | null;
  _accuracy: number | null;
  _priority: number;
  _critical: number;
  _skin: StateChange;
  _store: string;

  constructor() {
    this._slot = 0;
    this._name = '';
    this._type = null;
    this._class = 'physical';
    this._target = 'user';
    this._power = 0;
    this._accuracy = 0;
    this._priority = 0;
    this._critical = 0;
    this._skin = new StateChange( 'スキン' );
    this._store = ''
  }

  set type( type: PokemonType ) {
    this._type = type;
  }
  set power( power: number | null ) {
    this._power = power;
  }
  set priority( priority: number ) {
    this._priority = priority;
  }

  get name(): string {
    return this._name;
  }
  get slot(): number {
    return this._slot;
  }
  get type(): PokemonType {
    return this._type;
  }
  get class(): string {
    return this._class;
  }
  get target(): MoveTarget {
    return this._target;
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
  get skin(): StateChange {
    return this._skin;
  }

  translate(): string {
    return moveMaster.filter( m => m.nameEN === this._name )[0].nameJA;
  }

  getMaster(): MoveData {
    return moveMaster.filter( m => m.nameEN === this._name )[0];
  }

  getAddOn(): MoveAddOnData {
    return moveAddOnMaster.filter( add => add.nameEN === this._name )[0]
  }

  setSelected( move: LearnedMove ): void {
    const master = moveMaster.find( ( m ) => {
      return m.nameEN === move.name;
    })
    if ( !master ) return;

    this._name = master.nameEN;
    this._type = master.type;
    this._class = master.class;
    this._target = master.target;
    this._power = master.power;
    this._accuracy = master.accuracy;
    this._priority = master.priority;
    this._critical = master.priority;
  }



  isType( type: PokemonType ): boolean {
    return this._type === type;
  }

  isPhysical(): boolean {
    return this._class === 'physical';
  }
  isSpecial(): boolean {
    return this._class === 'special';
  }
  isStatus(): boolean {
    return this._class === 'status';
  }

  isName( name: MoveText ): boolean {
    return this._name === name;
  }

  isExplosion(): boolean {
    return explosionMoveList.includes( this._name );
  }

  //---------------------
  // スキン系特性が発動するか
  //---------------------
  isActivateSkin( type: PokemonType ): boolean {
    if ( changeTypeMoveList.includes( this._name ) ) return false;
    if ( this._name === 'わるあがき' ) return false;

    if ( type === 'Normal' && this._type === 'Normal' ) return false;
    if ( type !== 'Normal' && this._type !== 'Normal' ) return false;

    return true;
  }

  activateSkin( type: PokemonType ): void {
    if ( !this.isActivateSkin( type ) ) return;
    this._type = type;
    this._skin.isTrue = true;
    this._skin.text = String( this._type );
  }

  //-------
  // ため技
  //-------
  setStore(): void {
    this._store = this._name;
  }
  isStore(): boolean {
    return this._store !== '';
  }

  //-------------
  // マグニチュード
  //-------------
  fixMagnitudePower(): void {
    if ( !this.isName( 'Magnitude' ) ) return; // 技「マグニチュード」

    const random: number = getRandom();

    if ( random >= 95 ) {
      this._power = 150;
      writeLog( `マグニチュード10!`);
      return;
    }

    if ( random >= 85 ) {
      this._power = 110;
      writeLog( `マグニチュード9!`);
      return;
    }

    if ( random >= 65 ) {
      this._power = 90;
      writeLog( `マグニチュード8!`);
      return;
    }

    if ( random >= 35 ) {
      this._power = 70;
      writeLog( `マグニチュード7!`);
      return;
    }

    if ( random >= 15 ) {
      this._power = 50;
      writeLog( `マグニチュード6!`);
      return;
    }

    if ( random >= 5 ) {
      this._power = 30;
      writeLog( `マグニチュード5!`);
      return;
    }

    if ( random >= 0 ) {
      this._power = 10;
      writeLog( `マグニチュード4!`);
      return;
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
