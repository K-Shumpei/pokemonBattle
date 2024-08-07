class Move {
  selected = new SelectedMove();
  learned = [
    new LearnedMove(0),
    new LearnedMove(1),
    new LearnedMove(2),
    new LearnedMove(3),
  ];

  register( move: RegisterMoveList ): void {
    this.learned[0].register( move.slot[0] );
    this.learned[1].register( move.slot[1] );
    this.learned[2].register( move.slot[2] );
    this.learned[3].register( move.slot[3] );
  }

  copyFromOpp( move: LearnedMove[] ): void {
    this.learned[0].copyFromOpp( move[0] );
    this.learned[1].copyFromOpp( move[1] );
    this.learned[2].copyFromOpp( move[2] );
    this.learned[3].copyFromOpp( move[3] );
  }

  show( handOrder: number ): void {
    this.learned[0].show( handOrder );
    this.learned[1].show( handOrder );
    this.learned[2].show( handOrder );
    this.learned[3].show( handOrder );
  }

  setSelcted( slot: number | null ): void {
    if ( slot === null ) return;
    this.selected.setSelected( this.learned[slot], slot );
  }

  showCommand1st( battleOrder: number ): void {
    this.learned[0].showCommand1st( battleOrder );
    this.learned[1].showCommand1st( battleOrder );
    this.learned[2].showCommand1st( battleOrder );
    this.learned[3].showCommand1st( battleOrder );
  }

  isNoPPLeft(): boolean {
    if ( !this.learned[this.selected.slot].powerPoint.isZero() ) return false;
    //battleLog.write( `${this.pokeName}の ${this.selected.translate()}!` );
    battleLog.write( `しかし 技の 残りポイントが なかった!` );
    return true;
  }

  onSpendPP( pokemon: Pokemon ): void {
    const slot: number = this.selected.slot;
    this.learned[slot].powerPoint.onSpend( pokemon );
  }
}


// -------------------------
// 覚えている技
// -------------------------
class LearnedMove {
  slot: number
  name: MoveText = null;
  powerPoint = new PowerPoint();

  constructor( slot: number ) {
    this.slot = slot;
  }

  register( move: RegisterMove ): void {
    this.name = move._name;
    this.powerPoint.setInitial( move.powerPoint );
  }


  show( handOrder: number ): void {
    getHTMLInputElement( 'party' + handOrder + '_move' + this.slot ).textContent = ( this.name === null )? '技' : this.translate();
    getHTMLInputElement( 'party' + handOrder + '_remainingPP' + this.slot ).textContent = ( this.name === null )? '' : String( this.powerPoint.value );
    getHTMLInputElement( 'party' + handOrder + '_powerPoint' + this.slot ).textContent = ( this.name === null )? 'PP' : String( this.powerPoint.max );
  }

  translate(): string {
    return moveMaster.filter( m => m.nameEN === this.name )[0].nameJA;
  }

  copyFromOpp( move: LearnedMove ): void {
    this.name = move.name;
    this.powerPoint.setInitial( move.powerPoint.value );
  }

  showCommand1st( battleOrder: number ): void {
    if ( this.name === null ) return;
    getHTMLInputElement( 'moveText_' + battleOrder + '_' + this.slot ).textContent = this.translate();
    getHTMLInputElement( 'moveRadio_' + battleOrder + '_' + this.slot ).disabled = false;
  }

  getMaster(): MoveData {
    return moveMaster.filter( m => m.nameEN === this.name )[0];
  }
}

class PowerPoint extends ValueWithRange {

  onSpend( pokemon: Pokemon ): void {
    const NumOfTarget: number = pokemon.attack.getTargetToPokemon().reduce( ( acc, val ) => {
      const target: Pokemon = main.getPokemonByBattle( val );
      if ( target.isAbility( 'Pressure' ) && target.isMine() !== pokemon.isMine() ) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 1 );

    const NumOfside: number = getPokemonInSide( !pokemon.isMine() ).reduce( ( acc, val ) => {
      if ( val.isAbility( 'Pressure' ) ) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 1 );

    const value = ( pokemon: Pokemon ): number => {
      switch ( pokemon.move.selected.target ) {
        case 'users-field':
          return 1;

        case 'opponents-field':
          if ( pokemon.move.selected.name === 'Sticky Web' ) { // 技「ねばねばネット」
            return 1;
          } else {
            return NumOfside;
          }

        case 'entire-field':
          return NumOfside;

        default:
          if ( pokemon.move.selected.name === 'Imprison' || pokemon.move.selected.name === 'Tera Blast' ) { // 技「ふういん」「テラバースト」
            return NumOfside;
          } else {
            return NumOfTarget;
          }
      }
    }

    this.sub( Math.max( 1, value( pokemon ) ) );
  }

  /*
  curePPByLeppaBerry( pokemon: Pokemon, value: number ): void {
    // PP回復
    this._remainingPP = Math.min( this._remainingPP + value, this._powerPoint );
    // メッセージ
    battleLog.write( `${getArticle( pokemon )}は ヒメリのみで ${this._name}のPPを 回復した!` );
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
  slot: number = 0;
  name: MoveText = null;
  type: PokemonType = null;
  class: MoveClass = 'physical';
  target: MoveTarget = 'user';
  power: number | null = null;
  accuracy: number | null = null;
  priority: number = 0;
  critical: number = 0;
  skin = new StateChange();
  store: MoveText = null;

  translate(): string {
    return moveMaster.filter( m => m.nameEN === this.name )[0].nameJA;
  }

  getMaster(): MoveData {
    return moveMaster.filter( m => m.nameEN === this.name )[0];
  }

  getAddOn(): MoveAddOnData {
    return moveAddOnMaster.filter( add => add.nameEN === this.name )[0]
  }

  setSelected( move: LearnedMove, slot: number ): void {
    const master = moveMaster.find( ( m ) => {
      return m.nameEN === move.name;
    })
    if ( !master ) return;

    this.name = move.name;
    this.type = master.type;
    this.class = master.class;
    this.target = master.target;
    this.power = master.power;
    this.accuracy = master.accuracy;
    this.priority = master.priority;
    this.critical = master.priority;
    this.slot = slot;
  }



  isType( type: PokemonType ): boolean {
    return this.type === type;
  }

  isPhysical(): boolean {
    return this.class === 'physical';
  }
  isSpecial(): boolean {
    return this.class === 'special';
  }
  isStatus(): boolean {
    return this.class === 'status';
  }

  //---------------------
  // スキン系特性が発動するか
  //---------------------
  isActivateSkin( type: PokemonType ): boolean {
    if ( this.getAddOn().changeType ) return false;
    if ( this.name === 'Struggle' ) return false; // 技「わるあがき」

    if ( type === 'Normal' && this.type === 'Normal' ) return false;
    if ( type !== 'Normal' && this.type !== 'Normal' ) return false;

    return true;
  }

  activateSkin( type: PokemonType ): void {
    if ( !this.isActivateSkin( type ) ) return;
    this.type = type;
    this.skin.isTrue = true;
    this.skin.text = String( this.type );
  }

  //-------
  // ため技
  //-------
  setStore(): void {
    this.store = this.name;
  }
  isStore(): boolean {
    return this.store !== null;
  }

  //-------------
  // マグニチュード
  //-------------
  fixMagnitudePower(): void {
    if ( this.name !=='Magnitude' ) return; // 技「マグニチュード」

    const random: number = getRandom();

    if ( random >= 95 ) {
      this.power = 150;
      battleLog.write( `マグニチュード10!`);
      return;
    }

    if ( random >= 85 ) {
      this.power = 110;
      battleLog.write( `マグニチュード9!`);
      return;
    }

    if ( random >= 65 ) {
      this.power = 90;
      battleLog.write( `マグニチュード8!`);
      return;
    }

    if ( random >= 35 ) {
      this.power = 70;
      battleLog.write( `マグニチュード7!`);
      return;
    }

    if ( random >= 15 ) {
      this.power = 50;
      battleLog.write( `マグニチュード6!`);
      return;
    }

    if ( random >= 5 ) {
      this.power = 30;
      battleLog.write( `マグニチュード5!`);
      return;
    }

    if ( random >= 0 ) {
      this.power = 10;
      battleLog.write( `マグニチュード4!`);
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
