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
  _remainingHP: number;
  _statusAilment: string;

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
    this._remainingHP = 0;
    this._statusAilment = '';
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
  set remainingHP( remainingHP: number ) {
    this._remainingHP = remainingHP;
  }
  set statusAilment( statusAilment: string ) {
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
  get remainingHP(): number {
    return this._remainingHP;
  }
  get statusAilment(): string {
    return this._statusAilment;
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
}


class Pokemon {
  _partyNumber: number;

  status: Status;

  actualValue: ParameterSix;
  baseStatus: ParameterSix;
  individualValue: ParameterSix;
  effortValue: ParameterSix;

  move: AvailableMove[];

  constructor() {
    this._partyNumber = 0;

    this.status = new Status;

    this.actualValue = new ParameterSix;
    this.baseStatus = new ParameterSix;
    this.individualValue = new ParameterSix;
    this.effortValue = new ParameterSix;

    this.move = [
      new AvailableMove,
      new AvailableMove,
      new AvailableMove,
      new AvailableMove
    ]
  }

  get partyNumber(): number {
    return this._partyNumber;
  }

  set partyNumber( number: number ) {
    this._partyNumber = number;
  }

}


class Field {
  _battleStyle: number;
  _numberOfPokemon: number;

  constructor() {
    this._battleStyle = 1;
    this._numberOfPokemon = 3;
  }

  get battleStyle(): number {
    return this._battleStyle;
  }
  get numberOfPokemon(): number {
    return this._numberOfPokemon;
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
