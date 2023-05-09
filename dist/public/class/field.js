"use strict";
class Weather {
    constructor() {
        this._name = false;
    }
    set name(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
}
class Terrain {
    constructor() {
        this._name = false;
    }
    set name(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
}
class Field {
    constructor() {
        this._battleStyle = 1;
        this._numberOfPokemon = 3;
        this._weather = new Weather;
        this._terrain = new Terrain;
    }
    set weather(weather) {
        this._weather = weather;
    }
    set terrain(terrain) {
        this._terrain = terrain;
    }
    get battleStyle() {
        return this._battleStyle;
    }
    get numberOfPokemon() {
        return this._numberOfPokemon;
    }
    get weather() {
        return this._weather;
    }
    get terrain() {
        return this._terrain;
    }
    setNumberOfPokemon(battleStyle) {
        this._battleStyle = battleStyle;
        if (battleStyle === 1) {
            this._numberOfPokemon = 3;
        }
        else if (battleStyle === 2) {
            this._numberOfPokemon = 4;
        }
        else if (battleStyle === 3) {
            this._numberOfPokemon = 6;
        }
    }
}
