class Weather {
  _name: string | false;

  constructor() {
    this._name = false;
  }

  set name( name: string | false ) {
    this._name = name;
  }

  get name(): string | false {
    return this._name;
  }
}


class Field {
  _battleStyle: number;
  _numberOfPokemon: number;
  _weather: Weather

  constructor() {
    this._battleStyle = 1;
    this._numberOfPokemon = 3;
    this._weather = new Weather;
  }

  set weather( weather: Weather ) {
    this._weather = new Weather;
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
