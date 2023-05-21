"use strict";
// ポケモン検索
function getPokemonDataByName(name) {
    for (const pokemon of pokemonData) {
        if (pokemon.name === name) {
            return pokemon;
        }
    }
    return false;
}
// 技検索
function getMoveDataByName(name) {
    for (const move of moveData) {
        if (move.name === name) {
            return move;
        }
    }
    return false;
}
// 性格検索
function getNatureDataByName(name) {
    for (const nature of natureData) {
        if (nature.name === name) {
            return nature;
        }
    }
    const sample = { name: '', plus: '', minus: '', isOK: false };
    return sample;
}
// タイプ検索
function getTypeColorByName(name) {
    for (const type of typeColor) {
        if (type.name === name) {
            return type;
        }
    }
    const sample = { name: '', light: '', normal: '', dark: '', isOK: false };
    return sample;
}
// 翻訳
function translateENintoJP(string) {
    for (const dictionary of translationDictionary) {
        if (dictionary.EN === string) {
            return dictionary.JP;
        }
    }
    return '';
}
function translateJPintoEN(string) {
    for (const dictionary of translationDictionary) {
        if (dictionary.JP === string) {
            return dictionary.EN;
        }
    }
    return '';
}
function getBaseStatusList(pokemon) {
    const baseStatusList = {
        hitPoint: pokemon.hitPoint,
        attack: pokemon.attack,
        defense: pokemon.defense,
        specialAttack: pokemon.specialAttack,
        specialDefense: pokemon.specialDefense,
        speed: pokemon.speed
    };
    return baseStatusList;
}
