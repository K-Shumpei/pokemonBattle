
class StatusAilment {
  _name: StatusAilmentText;
  _turn: number;
  _pokeName: string;

  constructor() {
    this._name = null;
    this._turn = 0;
    this._pokeName = '';
  }

  get turn(): number {
    return this._turn;
  }

  set turn( turn: number ) {
    this._turn = turn;
  }

  isHealth(): boolean {
    return this._name === null;
  }

  isParalysis(): boolean {
    return this._name === 'Paralysis';
  }

  isFrozen(): boolean {
    return this._name === 'Frozen';
  }

  isBurned(): boolean {
    return this._name === 'Burned';
  }

  isPoisoned(): boolean {
    return this._name === 'Poisoned';
  }

  isBadPoisoned(): boolean {
    return this._name === 'Poisoned' && this._turn > 0;
  }

  isAsleep(): boolean {
    return this._name === 'Asleep';
  }

  getHealth( item?: string ): void {
    switch ( this._name ) {
      case 'Paralysis':
        if ( item ) writeLog( `${this._pokeName}は ${item}で まひが 治った!` );
        else writeLog( `${this._pokeName}は まひが 治った!` );
        break;

      case 'Frozen':
        if ( item ) writeLog( `${this._pokeName}は ${item}で こおり状態が 治った!` );
        else writeLog( `${this._pokeName}は こおり状態が 治った!` );
        break;

      case 'Burned':
        if ( item ) writeLog( `${this._pokeName}は ${item}で やけどが 治った!` );
        else writeLog( `${this._pokeName}は やけどが 治った!` );
        break;

      case 'Poisoned':
        if ( item ) writeLog( `${this._pokeName}は ${item}で 毒が 治った!` );
        else writeLog( `${this._pokeName}は 毒が 治った!` );
        break;

      case 'Asleep':
        if ( item )
        writeLog( `${this._pokeName}は 目を 覚ました!` );
        break;

      default:
        break;
    }

    this._name = null;
    this._turn = 0;
  }

  getParalysis(): void {
    this._name = 'Paralysis';
    writeLog( `${this._pokeName}は まひして 技が でにくくなった!` );
  }

  getFrozen(): void {
    this._name = 'Frozen';
    writeLog( `${this._pokeName}は 凍りついた!` );
  }

  getBurned(): void {
    this._name = 'Burned';
    writeLog( `${this._pokeName}は やけどを 負った!` );
  }

  getPoisoned(): void {
    this._name = 'Poisoned';
    writeLog( `${this._pokeName}は 毒を あびた!` );
  }

  getBadPoisoned(): void {
    this._name = 'Poisoned';
    this._turn = 1;
    writeLog( `${this._pokeName}は 猛毒を あびた!` );
  }

  getAsleep(): void {
    this._name = 'Asleep';
    writeLog( `${this._pokeName}は 眠ってしまった!` );
  }

  countPoisoned(): void {
    this._turn += 1;
  }
}
