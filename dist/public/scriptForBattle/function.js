"use strict";
// ポケモン検索
function getPokemonDataByName(name) {
    const result = pokemonMaster.filter(pokemon => pokemon.nameJA === name);
    return result[0];
}
// 技検索
function getMoveDataByName(name) {
    const result = moveMaster.filter(move => move.nameJA === name);
    return result[0];
}
// 性格検索
function getNatureDataByName(name) {
    for (const nature of natureData) {
        if (nature.name === name) {
            return nature;
        }
    }
    return natureData[0];
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
        hitPoint: pokemon.baseStatus.hitPoint,
        attack: pokemon.baseStatus.attack,
        defense: pokemon.baseStatus.defense,
        specialAttack: pokemon.baseStatus.specialAttack,
        specialDefense: pokemon.baseStatus.specialDefense,
        speed: pokemon.baseStatus.speed
    };
    return baseStatusList;
}
