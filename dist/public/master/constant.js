"use strict";
const parameterSix = [
    'hitPoint',
    'attack',
    'defense',
    'specialAttack',
    'specialDefense',
    'speed'
];
const parameterFive = [
    'attack',
    'defense',
    'specialAttack',
    'specialDefense',
    'speed'
];
const natureData = [
    // 攻撃上昇補正
    { name: 'てれや', plus: 'attack', minus: 'attack', isOK: true },
    { name: 'さみしがり', plus: 'attack', minus: 'defense', isOK: true },
    { name: 'いじっぱり', plus: 'attack', minus: 'specialAttack', isOK: true },
    { name: 'やんちゃ', plus: 'attack', minus: 'specialDefense', isOK: true },
    { name: 'ゆうかん', plus: 'attack', minus: 'speed', isOK: true },
    // 防御上昇補正
    { name: 'ずぶとい', plus: 'defense', minus: 'attack', isOK: true },
    { name: 'がんばりや', plus: 'defense', minus: 'defense', isOK: true },
    { name: 'わんぱく', plus: 'defense', minus: 'specialAttack', isOK: true },
    { name: 'のうてんき', plus: 'defense', minus: 'specialDefense', isOK: true },
    { name: 'のんき', plus: 'defense', minus: 'speed', isOK: true },
    // 特攻上昇補正
    { name: 'ひかえめ', plus: 'specialAttack', minus: 'attack', isOK: true },
    { name: 'おっとり', plus: 'specialAttack', minus: 'defense', isOK: true },
    { name: 'すなお', plus: 'specialAttack', minus: 'specialAttack', isOK: true },
    { name: 'うっかりや', plus: 'specialAttack', minus: 'specialDefense', isOK: true },
    { name: 'れいせい', plus: 'specialAttack', minus: 'speed', isOK: true },
    // 特防上昇補正
    { name: 'おだやか', plus: 'specialDefense', minus: 'attack', isOK: true },
    { name: 'おとなしい', plus: 'specialDefense', minus: 'defense', isOK: true },
    { name: 'しんちょう', plus: 'specialDefense', minus: 'specialAttack', isOK: true },
    { name: 'きまぐれ', plus: 'specialDefense', minus: 'specialDefense', isOK: true },
    { name: 'なまいき', plus: 'specialDefense', minus: 'speed', isOK: true },
    // 素早さ上昇補正
    { name: 'おくびょう', plus: 'speed', minus: 'attack', isOK: true },
    { name: 'せっかち', plus: 'speed', minus: 'defense', isOK: true },
    { name: 'ようき', plus: 'speed', minus: 'specialAttack', isOK: true },
    { name: 'むじゃき', plus: 'speed', minus: 'specialDefense', isOK: true },
    { name: 'まじめ', plus: 'speed', minus: 'speed', isOK: true },
];
