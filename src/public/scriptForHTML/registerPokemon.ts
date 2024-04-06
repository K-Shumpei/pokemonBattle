class RegisterValue {
  _av: number; // 実数値
  _bs: number; // 種族値
  _iv: number; // 個体値
  _ev: number; // 努力値

  constructor() {
    this._av = 0;
    this._bs = 0;
    this._iv = 31;
    this._ev = 0;
  }

  set av( val: number ) {
    this._av = val;
  }
  set bs( val: number ) {
    this._bs = val;
  }
  set iv( val: number ) {
    this._iv = val;
  }
  set ev( val: number ) {
    this._ev = val;
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

  show( para: string ): void {
    getHTMLInputElement( 'register_' + para + 'ActualValue' ).value = String( this._av );
    getHTMLInputElement( 'register_' + para + 'BaseStatus' ).textContent = String( this._bs );
    getHTMLInputElement( 'register_' + para + 'IndividualValue' ).value = String( this._iv );
    getHTMLInputElement( 'register_' + para + 'EffortValue' ).value = String( this._ev );
  }

  getAV( para: string ): number {
    return Number( getHTMLInputElement( 'register_' + para + 'ActualValue' ).value )
  }

  copy( stat: ActualWithThreeValue ): void {
    this._av = stat.av;
    this._bs = stat.bs;
    this._iv = stat.iv;
    this._ev = stat.ev;
  }
}

class RegisterHitPoint extends RegisterValue {
  constructor() {
    super()
  }

  calcAct( level: number ): void {
    const step1: number = this._bs * 2 + this._iv + Math.floor( this._ev / 4 );
    const step2: number = step1 * level;
    this._av = Math.floor( step2 / 100 ) + level + 10;
  }

  calcEffort( para: string, level: number ): number {
    const step3: number = this.getAV( para ) - level - 10;
    const step2: number = 100 * step3 / level;
    const step1: number = Math.ceil( step2 - 2 * this._bs - this._iv );
    let result: number = Math.max( 0, 4 * step1 );
    return Math.min( 252, result );
  }
}

class RegisterFiveStatus extends RegisterValue {
  constructor() {
    super()
  }

  calcAct( level: number, corr: number ): void {
    const step1: number = this._bs * 2 + this._iv + Math.floor( this._ev / 4 );
    const step2: number = step1 * level;
    const step3: number = Math.floor( step2 / 100 );
    this._av = Math.floor( ( step3 + 5 ) * corr );
  }

  calcEffort( para: string, level: number, corr: number ): number {
    const step3: number = Math.ceil( this.getAV( para ) / corr - 5 );
    const step2: number = 100 * step3 / level;
    const step1: number = Math.ceil( step2 - 2 * this._bs - this._iv );
    let result: number = Math.max( 0, 4 * step1 );
    return Math.min( 252, result );
  }
}

class RegisterStatus {
  _hp: RegisterHitPoint;
  _atk: RegisterFiveStatus;
  _def: RegisterFiveStatus;
  _spA: RegisterFiveStatus;
  _spD: RegisterFiveStatus;
  _spe: RegisterFiveStatus;

  constructor() {
    this._hp = new RegisterHitPoint();
    this._atk = new RegisterFiveStatus();
    this._def = new RegisterFiveStatus();
    this._spA = new RegisterFiveStatus();
    this._spD = new RegisterFiveStatus();
    this._spe = new RegisterFiveStatus();
  }

  get hp(): RegisterHitPoint {
    return this._hp;
  }
  get atk(): RegisterFiveStatus {
    return this._atk;
  }
  get def(): RegisterFiveStatus {
    return this._def;
  }
  get spA(): RegisterFiveStatus {
    return this._spA;
  }
  get spD(): RegisterFiveStatus {
    return this._spD;
  }
  get spe(): RegisterFiveStatus {
    return this._spe;
  }

  setMaster( master: PokemonData ): void {
    this._hp.bs = master.baseStatus.hp;
    this._atk.bs = master.baseStatus.atk;
    this._def.bs = master.baseStatus.def;
    this._spA.bs = master.baseStatus.spA;
    this._spD.bs = master.baseStatus.spD;
    this._spe.bs = master.baseStatus.spe;
  }

  show(): void {
    this._hp.show( 'hitPoint' );
    this._atk.show( 'attack' );
    this._def.show( 'defense' );
    this._spA.show( 'specialAttack' );
    this._spD.show( 'specialDefense' );
    this._spe.show( 'speed' );
  }

  setIVs(): void {
    this._hp.iv = Number( getHTMLInputElement( 'register_hitPointIndividualValue' ).value );
    this._atk.iv = Number( getHTMLInputElement( 'register_attackIndividualValue' ).value );
    this._def.iv = Number( getHTMLInputElement( 'register_defenseIndividualValue' ).value );
    this._spA.iv = Number( getHTMLInputElement( 'register_specialAttackIndividualValue' ).value );
    this._spD.iv = Number( getHTMLInputElement( 'register_specialDefenseIndividualValue' ).value );
    this._spe.iv = Number( getHTMLInputElement( 'register_speedIndividualValue' ).value );
  }

  isChangableAV( level: number, nature: NatureData ): boolean {
    const hp = this._hp.calcEffort( 'hitPoint', level );
    const atk = this._atk.calcEffort( 'attack', level, nature.atk );
    const def = this._def.calcEffort( 'defense', level, nature.def );
    const spA = this._spA.calcEffort( 'specialAttack', level, nature.spA );
    const spD = this._spD.calcEffort( 'specialDefense', level, nature.spD );
    const spe = this._spe.calcEffort( 'speed', level, nature.spe );

    return hp + atk + def + spA + spD + spe <= 510;
  }

  isChangableEV(): boolean {
    const hp = Number( getHTMLInputElement( 'register_hitPointEffortValue' ).value );
    const atk = Number( getHTMLInputElement( 'register_attackEffortValue' ).value );
    const def = Number( getHTMLInputElement( 'register_defenseEffortValue' ).value );
    const spA = Number( getHTMLInputElement( 'register_specialAttackEffortValue' ).value );
    const spD = Number( getHTMLInputElement( 'register_specialDefenseEffortValue' ).value );
    const spe = Number( getHTMLInputElement( 'register_speedEffortValue' ).value );

    return hp + atk + def + spA + spD + spe <= 510;
  }

  setEVs(): void {
    if ( !this.isChangableEV() ) return;
    this._hp.ev = Number( getHTMLInputElement( 'register_hitPointEffortValue' ).value );
    this._atk.ev = Number( getHTMLInputElement( 'register_attackEffortValue' ).value );
    this._def.ev = Number( getHTMLInputElement( 'register_defenseEffortValue' ).value );
    this._spA.ev = Number( getHTMLInputElement( 'register_specialAttackEffortValue' ).value );
    this._spD.ev = Number( getHTMLInputElement( 'register_specialDefenseEffortValue' ).value );
    this._spe.ev = Number( getHTMLInputElement( 'register_speedEffortValue' ).value );
  }

  setAVs( level: number, nature: NatureData ): void {
    if ( !this.isChangableAV( level, nature ) ) return;
    this._hp.ev = this._hp.calcEffort( 'hitPoint', level );
    this._atk.ev = this._atk.calcEffort( 'attack', level, nature.atk );
    this._def.ev = this._def.calcEffort( 'defense', level, nature.def );
    this._spA.ev = this._spA.calcEffort( 'specialAttack', level, nature.spA );
    this._spD.ev = this._spD.calcEffort( 'specialDefense', level, nature.spD );
    this._spe.ev = this._spe.calcEffort( 'speed', level, nature.spe );
  }

  copy( stat: Status ): void {
    this._hp.copy( stat.hp );
    this._atk.copy( stat.atk );
    this._def.copy( stat.def );
    this._spA.copy( stat.spA );
    this._spD.copy( stat.spD );
    this._spe.copy( stat.spe );
  }
}

class RegisterMove {
  _slot: number;
  _name: MoveText;
  _type: PokemonType;
  _power: number | null;
  _accuracy: number | null;
  _powerPoint: number;
  _basePP: number;

  constructor( slot: number ) {
    this._slot = slot;
    this._name = null;
    this._type = null;
    this._power = null;
    this._accuracy = null;
    this._powerPoint = 0;
    this._basePP = 0;
  }

  get name(): string | null {
    return this._name;
  }
  get powerPoint(): number {
    return this._powerPoint;
  }

  getMoveMaster( name: MoveText ): MoveData {
    return moveMaster.filter( m => m.nameEN === name )[0];
  }

  translate( move: string ): string {
    for ( const data of moveMaster ) {
      if ( data.nameEN === move ) return data.nameJA;
      if ( data.nameJA === move ) return data.nameEN;
    }
    return move;
  }

  isValidName( slot: number ): MoveText[] {
    // 適切な名前でなければ処理なし
    const nameEN: string = this.translate( getHTMLInputElement( 'registerMoveName' + slot ).value );
    return moveTextList.filter( name => name === nameEN );
  }

  select( nameEN: MoveText ): void {
    const master: MoveData = this.getMoveMaster( nameEN );
    this._name = nameEN;
    this._type = master.type;
    this._power = master.power;
    this._accuracy = master.accuracy;
    this._powerPoint = master.powerPoint;
    this._basePP = master.powerPoint;
  }

  addPP(): void {
    if ( this._name === null ) return;
    if ( this._powerPoint === 1 ) return;
    const step: number = this._basePP / 5;
    const max: number = this._basePP + step * 3;
    this._powerPoint = Math.min( max, this._powerPoint + step );
  }

  subPP(): void {
    if ( this._name === null ) return;
    if ( this._powerPoint === 1 ) return;
    const step: number = this._basePP / 5;
    this._powerPoint = Math.max( this._basePP, this._powerPoint - step );
  }

  copy( move: LearnedMove ): void {
    if ( move.name === null ) return;
    const master = this.getMoveMaster( move.name );
    this._name = move.name;
    this._type = master.type;
    this._power = master.power;
    this._accuracy = master.accuracy;
    this._powerPoint = move.powerPoint.value;
    this._basePP = master.powerPoint;

    getHTMLInputElement( 'registerMoveName' + this._slot ).value = this.translate( this._name );
  }

}

class RegisterMoveList {
  _slot: RegisterMove[];

  constructor() {
    this._slot = [
      new RegisterMove( 0 ),
      new RegisterMove( 1 ),
      new RegisterMove( 2 ),
      new RegisterMove( 3 ),
    ];
  }

  get slot(): RegisterMove[] {
    return this._slot;
  }

  translate( move: string ): string {
    for ( const data of moveMaster ) {
      if ( data.nameEN === move ) return data.nameJA;
      if ( data.nameJA === move ) return data.nameEN;
    }
    return move;
  }

  setHTML( master: MoveLearned ): void {
    for ( let i = 0; i < 4; i++ ) {
      const moveHTML = getHTMLInputElement( 'registerMoveName' + i );
      moveHTML.innerHTML = '';

      // ブランクの選択肢
      const blunk = document.createElement( 'option' );
      blunk.value = '';
      blunk.textContent = '';
      moveHTML.appendChild(blunk);

      // ポケモンが覚える技
      for ( const move of master.move ) {
        const option = document.createElement( 'option' );
        option.value = this.translate( move );
        option.textContent = this.translate( move );
        moveHTML.appendChild(option);
      }
    }
  }

  show(): void {
    for ( let i = 0; i < 4; i++ ) {
      getHTMLInputElement( 'registerMoveType' + i ).textContent = String( this._slot[i]._type );
      getHTMLInputElement( 'registerMovePower' + i ).textContent = String( this._slot[i]._power );
      getHTMLInputElement( 'registerMoveAccuracy' + i ).textContent = String( this._slot[i]._accuracy );
      getHTMLInputElement( 'registerMovePowerPoint' + i ).textContent = String( this._slot[i]._powerPoint );
      getHTMLInputElement( 'registerMovePowerPoint' + i ).value = String( this._slot[i]._powerPoint );
    }
  }

  copy( move: LearnedMove[] ): void {
    for ( let i = 0; i < 4; i++ ) {
      this._slot[i].copy( move[i] );
    }
  }
}

class RegisterGender {
  _value: Gender;
  _type: Gender;

  constructor() {
    this._value = 'genderless';
    this._type = 'genderless';
  }

  get value(): Gender {
    return this._value;
  }
  set value( gender: Gender ) {
    this._value = gender;
  }

  translate(): string {
    if ( this._value === 'male' ) return '♂';
    if ( this._value === 'female' ) return '♀';
    if ( this._value === 'genderless' ) return '-';

    return '-'
  }

  setMaster( master: PokemonData ): void {
    this._type = master.gender;
    this._value = master.gender;
    if ( this._value === 'both' ) this._value = 'male';
  }

  setHTML(): void {
    const genderHTML = getHTMLInputElement( 'register_gender' );
    genderHTML.innerHTML = '';

    const optionMale = document.createElement( 'option' );
    optionMale.value = '♂';
    optionMale.textContent = '♂';

    const optionFemale = document.createElement( 'option' );
    optionFemale.value = '♀';
    optionFemale.textContent = '♀';

    const optionLess = document.createElement( 'option' );
    optionLess.value = '-';
    optionLess.textContent = '-';

    switch ( this._type ) {
      case 'both':
        genderHTML.appendChild( optionMale );
        genderHTML.appendChild( optionFemale );
        break;

      case 'male':
        genderHTML.appendChild( optionMale );
        break;

      case 'female':
        genderHTML.appendChild( optionFemale );
        break;

      case 'genderless':
        genderHTML.appendChild( optionLess );
        break;
    }
  }

  set(): void {
    const gender = getHTMLInputElement( 'register_gender' ).value;
    if ( gender === '♂' ) this._value = 'male';
    if ( gender === '♀' ) this._value = 'female';
    if ( gender === '-' ) this._value = 'genderless';
  }

  show(): void {
    const genderHTML = getHTMLInputElement( 'register_gender' );
    genderHTML.value = this.translate();
  }
}

class RegisterAbility {
  _value: AbilityText;
  _list: AbilityText[];

  constructor() {
    this._value = null;
    this._list = [];
  }

  get value(): AbilityText {
    return this._value;
  }
  set value( ability: AbilityText ) {
    this._value = ability;
  }

  isValidName(): AbilityText[] {
    // 適切な名前でなければ処理なし
    const nameEN: string = this.translate( getHTMLInputElement( 'register_name' ).value );
    return abilityTextList.filter( name => name === nameEN );
  }

  translate( name: string ): string {
    for ( const data of abilityMaster ) {
      if ( data.nameEN === name ) return data.nameJA;
      if ( data.nameJA === name ) return data.nameEN;
    }
    return name;
  }

  setMaster( master: PokemonData ): void {
    const abilityList: AbilityText[] = []
    for ( const ability of master.ability ) {
      const nameEN = abilityTextList.filter( name => name === ability );
      if ( nameEN.length === 0 ) continue;
      abilityList.push( nameEN[0])
    }
    this._list = abilityList;
    this._value = abilityList[0];
  }

  setHTML(): void {
    const abilityHTML = getHTMLInputElement( 'register_ability' );
    abilityHTML.innerHTML = '';
    for ( const ability of this._list ) {
      const option = document.createElement( 'option' );
      option.value = this.translate( String( ability ) );
      option.textContent = this.translate( String( ability ) );
      abilityHTML.appendChild( option );
    }
  }

  set( ability: AbilityText ): void {
    this._value = ability;
  }

  show(): void {
    const abilityHTML = getHTMLInputElement( 'register_ability' );
    abilityHTML.value = this.translate( String( this._value ) );
  }
}

class Register {
  _id: number;
  _name: PokemonText;
  _level: number;
  _type: PokemonType[];
  _gender: RegisterGender;
  _ability: RegisterAbility;
  _item: string | null;
  _nature: NatureText;
  _stat: RegisterStatus;
  _move: RegisterMoveList;

  constructor() {
    this._id = 0;
    this._name = null;
    this._level = 0;
    this._type = [];
    this._gender = new RegisterGender();
    this._ability = new RegisterAbility();
    this._item = null;
    this._nature = 'Bashful';
    this._stat = new RegisterStatus();
    this._move = new RegisterMoveList();
  }

  reset(): void {
    this._id = 0;
    this._name = null;
    this._level = 50;
    this._type = [];
    this._gender = new RegisterGender();
    this._ability = new RegisterAbility();
    this._item = null;
    this._nature = 'Bashful';
    this._stat = new RegisterStatus();
    this._move = new RegisterMoveList();

    for ( let i = 0; i < 4; i++ ) {
      const moveHTML = getHTMLInputElement( 'registerMoveName' + i );
      moveHTML.innerHTML = '';
    }
  }

  get id(): number {
    return this._id;
  }
  get name(): PokemonText {
    return this._name;
  }
  get level(): number {
    return this._level;
  }
  get type(): PokemonType[] {
    return this._type;
  }
  get gender(): RegisterGender {
    return this._gender;
  }
  get ability(): RegisterAbility {
    return this._ability;
  }
  get item(): string | null {
    return this._item;
  }
  get nature(): NatureText {
    return this._nature;
  }
  get stat(): RegisterStatus {
    return this._stat;
  }
  get move(): RegisterMoveList {
    return this._move;
  }

  getPokemonMaster( name: PokemonText ): PokemonData {
    return pokemonMaster.filter( m => m.nameEN === name )[0];
  }

  getMoveLearnedMaster( name: PokemonText ): MoveLearned {
    return moveLearnedByPokemon.filter( m => m.nameEN === name )[0];
  }

  getNatureMaster( nature: NatureText ) {
    return natureMaster.filter( m => m.nameEN === nature )[0];
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

  translateNatureToJA( name: string ): string {
    return natureMaster.filter( m => m.nameEN === name )[0].nameJA;
  }
  translateNatureToEN( name: string ): NatureText {
    return natureMaster.filter( m => m.nameJA === name )[0].nameEN;
  }

  isValidName(): PokemonText[] {
    // 適切な名前でなければ処理なし
    const nameEN: string = this.translateName( getHTMLInputElement( 'register_name' ).value );
    return pokemonTextList.filter( name => name === nameEN );
  }

  setName( nameEN: PokemonText ): void {
    this.reset();
    this.setMaster( nameEN );
    this.calculateActualValue();
    this.setHTML();
  }

  setMaster( name: PokemonText ): void {
    const pokemon = this.getPokemonMaster( name );
    this._id = pokemon.id;
    this._name = name;
    this._type = pokemon.type;
    this._gender.setMaster( pokemon );
    this._ability.setMaster( pokemon );
    this._stat.setMaster( pokemon );
  }

  setHTML(): void {
    const move = this.getMoveLearnedMaster( this._name );
    this._gender.setHTML();
    this._ability.setHTML();
    this._move.setHTML( move );
  }

  setLevel(): void {
    const level: number = Number( getHTMLInputElement( 'register_level' ).value );
    this._level = level;
  }

  setGender(): void {
    this._gender.set();
  }

  setNatureList(): void {
    const nature = getHTMLInputElement( 'register_nature' ).value;
    this._nature = this.translateNatureToEN( nature );
    this.setNatureListToButton();
  }
  setNatureButton(): void {
    let plus = '';
    let minus = '';
    if ( getHTMLInputElement( 'register_attackNaturePlus' ).checked ) plus = 'atk';
    if ( getHTMLInputElement( 'register_attackNatureMinus' ).checked ) minus = 'atk';
    if ( getHTMLInputElement( 'register_defenseNaturePlus' ).checked ) plus = 'def';
    if ( getHTMLInputElement( 'register_defenseNatureMinus' ).checked ) minus = 'def';
    if ( getHTMLInputElement( 'register_specialAttackNaturePlus' ).checked ) plus = 'spA';
    if ( getHTMLInputElement( 'register_specialAttackNatureMinus' ).checked ) minus = 'spA';
    if ( getHTMLInputElement( 'register_specialDefenseNaturePlus' ).checked ) plus = 'spD';
    if ( getHTMLInputElement( 'register_specialDefenseNatureMinus' ).checked ) minus = 'spD';
    if ( getHTMLInputElement( 'register_speedNaturePlus' ).checked ) plus = 'spe';
    if ( getHTMLInputElement( 'register_speedNatureMinus' ).checked ) minus = 'spe';

    const nature: NatureData = natureMaster.filter( m => m.plus === plus && m.minus === minus )[0];
    this._nature = nature.nameEN;
  }

  isUnreg(): boolean {
    return this._name === null;
  }

  calculateActualValue(): void {
    const nature: NatureData = this.getNatureMaster( this._nature );
    this._stat.hp.calcAct( this._level );
    this._stat.atk.calcAct( this._level, nature.atk );
    this._stat.def.calcAct( this._level, nature.def );
    this._stat.spA.calcAct( this._level, nature.spA );
    this._stat.spD.calcAct( this._level, nature.spD );
    this._stat.spe.calcAct( this._level, nature.spe );

    if ( this._name === 'Shedinja' ) {
      this._stat.hp.av = 1;
    }
  }

  setAVs(): void {
    const nature: NatureData = this.getNatureMaster( this._nature );
    this._stat.setAVs( this._level, nature );
  }



  showOnScreen(): void {

    getHTMLInputElement( 'register_name' ).value = this.translateName( String(this._name) );
    getHTMLInputElement( 'register_level' ).value = String( this._level );

    if ( this._type.length === 0 ) {
      getHTMLInputElement( 'register_type1' ).value = '';
      getHTMLInputElement( 'register_type1' ).textContent = '';
      getHTMLInputElement( 'register_type2' ).value = '';
      getHTMLInputElement( 'register_type2' ).textContent = '';
    } else if ( this._type.length === 1 ) {
      getHTMLInputElement( 'register_type1' ).value = this.translateType( String( this._type[0] ) );
      getHTMLInputElement( 'register_type1' ).textContent = this.translateType( String( this._type[0] ) );
      getHTMLInputElement( 'register_type2' ).value = '';
      getHTMLInputElement( 'register_type2' ).textContent = '';
    } else if ( this._type.length === 2 ) {
      getHTMLInputElement( 'register_type1' ).value = this.translateType( String( this._type[0] ) );
      getHTMLInputElement( 'register_type1' ).textContent = this.translateType( String( this._type[0] ) );
      getHTMLInputElement( 'register_type2' ).value = this.translateType( String( this._type[1] ) );
      getHTMLInputElement( 'register_type2' ).textContent = this.translateType( String( this._type[1] ) );
    }

    getHTMLInputElement( 'register_item' ).textContent = this._item;

    this.setNatureListToButton();

    /*
    getHTMLInputElement( 'remainingEffortValue' ).textContent = '510';
    */

    this._gender.show();
    this._ability.show();
    this._stat.show();
    this._move.show();
  }

  setNatureListToButton(): void {
    getHTMLInputElement( 'register_nature' ).value = this.translateNatureToJA( this._nature );
    const nature = this.getNatureMaster( this._nature );
    if ( nature.atk === 1.1 ) getHTMLInputElement( 'register_attackNaturePlus' ).checked = true;
    if ( nature.atk === 0.9 ) getHTMLInputElement( 'register_attackNatureMinus' ).checked = true;
    if ( nature.def === 1.1 ) getHTMLInputElement( 'register_defenseNaturePlus' ).checked = true;
    if ( nature.def === 0.9 ) getHTMLInputElement( 'register_defenseNatureMinus' ).checked = true;
    if ( nature.spA === 1.1 ) getHTMLInputElement( 'register_specialAttackNaturePlus' ).checked = true;
    if ( nature.spA === 0.9 ) getHTMLInputElement( 'register_specialAttackNatureMinus' ).checked = true;
    if ( nature.spD === 1.1 ) getHTMLInputElement( 'register_specialDefenseNaturePlus' ).checked = true;
    if ( nature.spD === 0.9 ) getHTMLInputElement( 'register_specialDefenseNatureMinus' ).checked = true;
    if ( nature.spe === 1.1 ) getHTMLInputElement( 'register_speedNaturePlus' ).checked = true;
    if ( nature.spe === 0.9 ) getHTMLInputElement( 'register_speedNatureMinus' ).checked = true;
  }

  copy( pokemon: Pokemon ): void {
    this.reset();
    this.setMaster( pokemon.name );
    this.setHTML();

    this._level = pokemon.level;
    this._type = pokemon.type.get();
    this._gender.value = pokemon.gender;
    this._ability.value = pokemon.ability.name;
    this._item = pokemon.item.name;
    this._nature = pokemon.nature;

    this._stat.copy( pokemon.status );
    this._move.copy( pokemon.move.learned );

    this.calculateActualValue();
  }

}
