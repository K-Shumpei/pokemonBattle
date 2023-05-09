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

class Terrain {
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
  _weather: Weather;
  _terrain: Terrain;

  constructor() {
    this._battleStyle = 1;
    this._numberOfPokemon = 3;
    this._weather = new Weather;
    this._terrain = new Terrain;
  }

  set weather( weather: Weather ) {
    this._weather = weather;
  }
  set terrain( terrain: Terrain ) {
    this._terrain = terrain;
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
  get terrain(): Terrain {
    return this._terrain;
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
