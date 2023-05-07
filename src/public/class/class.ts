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
  _statusAilment: string | false;

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
    this._statusAilment = false;
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
  set statusAilment( statusAilment: string | false ) {
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
  get statusAilment(): string | false {
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

  get hitPoint(): number {
    return this.hitPoint;
  }
  get attack(): number {
    return this.attack;
  }
  get defense(): number {
    return this.defense;
  }
  get specialAttack(): number {
    return this.specialAttack;
  }
  get specialDefense(): number {
    return this.specialDefense;
  }
  get speed(): number {
    return this.speed;
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
    return this.attack;
  }
  get defense(): number {
    return this.defense;
  }
  get specialAttack(): number {
    return this.specialAttack;
  }
  get specialDefense(): number {
    return this.specialDefense;
  }
  get speed(): number {
    return this.speed;
  }
  get evasion(): number {
    return this.evasion;
  }
  get accuracy(): number {
    return this.accuracy;
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

class Order {
  _party: number;
  _hand: number | false;
  _battle: number | false;

  constructor() {
    this._party = 0;
    this._hand = false;
    this._battle = false;
  }

  set party( party: number ) {
    this._party = party;
  }
  set hand( hand: number | false ) {
    this._hand = hand;
  }
  set battle( battle: number | false ) {
    this._battle = battle;
  }

  get party(): number {
    return this._party;
  }
  get hand(): number | false {
    return this._hand
  }
  get battle(): number | false {
    return this._battle;
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
  _battleNumber: number | false;
  _success: boolean;

  constructor() {
    this._trainer = '';
    this._battleNumber = false;
    this._success = true;
  }

  set trainer( trainer: string ) {
    this._trainer = trainer;
  }
  set battleNumber( battleNumber: number | false ) {
    this._battleNumber = battleNumber;
  }
  set success( success: boolean ) {
    this._success = success;
  }

  get trainer(): string {
    return this._trainer;
  }
  get battleNumber(): number | false {
    return this._battleNumber;
  }
  get success(): boolean {
    return this._success;
  }
}





class Pokemon {
  _trainer: string;
  _order: Order;
  _status: Status;
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

  constructor() {
    this._trainer = '';
    this._order = new Order;
    this._status = new Status;
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
  }

  set trainer( trainer: string ) {
    this._trainer = trainer;
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


  get trainer(): string {
    return this._trainer;
  }
  get order(): Order {
    return this._order;
  }
  get status(): Status {
    return this._status
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
