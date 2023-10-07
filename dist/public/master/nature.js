"use strict";
const natureMaster = [
    // 攻撃上昇補正
    { nameEN: 'Bashful', nameJA: 'てれや', atk: 1.0, def: 1.0, spA: 1.0, spD: 1.0, spe: 1.0, plus: 'atk', minus: 'atk' },
    { nameEN: 'Lonely', nameJA: 'さみしがり', atk: 1.1, def: 0.9, spA: 1.0, spD: 1.0, spe: 1.0, plus: 'atk', minus: 'def' },
    { nameEN: 'Adamant', nameJA: 'いじっぱり', atk: 1.1, def: 1.0, spA: 0.9, spD: 1.0, spe: 1.0, plus: 'atk', minus: 'spA' },
    { nameEN: 'Naughty', nameJA: 'やんちゃ', atk: 1.1, def: 1.0, spA: 1.0, spD: 0.9, spe: 1.0, plus: 'atk', minus: 'spD' },
    { nameEN: 'Brave', nameJA: 'ゆうかん', atk: 1.1, def: 1.0, spA: 1.0, spD: 1.0, spe: 0.9, plus: 'atk', minus: 'spe' },
    // 防御上昇補正
    { nameEN: 'Bold', nameJA: 'ずぶとい', atk: 0.9, def: 1.1, spA: 1.0, spD: 1.0, spe: 1.0, plus: 'def', minus: 'atk' },
    { nameEN: 'Hardy', nameJA: 'がんばりや', atk: 1.0, def: 1.0, spA: 1.0, spD: 1.0, spe: 1.0, plus: 'def', minus: 'def' },
    { nameEN: 'Impish', nameJA: 'わんぱく', atk: 1.0, def: 1.1, spA: 0.9, spD: 1.0, spe: 1.0, plus: 'def', minus: 'spA' },
    { nameEN: 'Lax', nameJA: 'のうてんき', atk: 1.0, def: 1.1, spA: 1.0, spD: 0.9, spe: 1.0, plus: 'def', minus: 'spD' },
    { nameEN: 'Relaxed', nameJA: 'のんき', atk: 1.0, def: 1.1, spA: 1.0, spD: 1.0, spe: 0.9, plus: 'def', minus: 'spe' },
    // 特攻上昇補正
    { nameEN: 'Modest', nameJA: 'ひかえめ', atk: 0.9, def: 1.0, spA: 1.1, spD: 1.0, spe: 1.0, plus: 'spA', minus: 'atk' },
    { nameEN: 'Mild', nameJA: 'おっとり', atk: 1.0, def: 0.9, spA: 1.1, spD: 1.0, spe: 1.0, plus: 'spA', minus: 'def' },
    { nameEN: 'Docile', nameJA: 'すなお', atk: 1.0, def: 1.0, spA: 1.0, spD: 1.0, spe: 1.0, plus: 'spA', minus: 'spA' },
    { nameEN: 'Rash', nameJA: 'うっかりや', atk: 1.0, def: 1.0, spA: 1.1, spD: 0.9, spe: 1.0, plus: 'spA', minus: 'spD' },
    { nameEN: 'Quiet', nameJA: 'れいせい', atk: 1.0, def: 1.0, spA: 1.1, spD: 1.0, spe: 0.9, plus: 'spA', minus: 'spe' },
    // 特防上昇補正
    { nameEN: 'Calm ', nameJA: 'おだやか', atk: 0.9, def: 1.0, spA: 1.0, spD: 1.1, spe: 1.0, plus: 'spD', minus: 'atk' },
    { nameEN: 'Gentle', nameJA: 'おとなしい', atk: 1.0, def: 0.9, spA: 1.0, spD: 1.1, spe: 1.0, plus: 'spD', minus: 'def' },
    { nameEN: 'Careful ', nameJA: 'しんちょう', atk: 1.0, def: 1.0, spA: 0.9, spD: 1.1, spe: 1.0, plus: 'spD', minus: 'spA' },
    { nameEN: 'Quirky', nameJA: 'きまぐれ', atk: 1.0, def: 1.0, spA: 1.0, spD: 1.0, spe: 1.0, plus: 'spD', minus: 'spD' },
    { nameEN: 'Sassy', nameJA: 'なまいき', atk: 1.0, def: 1.0, spA: 1.0, spD: 1.1, spe: 0.9, plus: 'spD', minus: 'spe' },
    // 素早さ上昇補正
    { nameEN: 'Timid', nameJA: 'おくびょう', atk: 0.9, def: 1.0, spA: 1.0, spD: 1.0, spe: 1.1, plus: 'spe', minus: 'atk' },
    { nameEN: 'Hasty', nameJA: 'せっかち', atk: 1.0, def: 0.9, spA: 1.0, spD: 1.0, spe: 1.1, plus: 'spe', minus: 'def' },
    { nameEN: 'Jolly', nameJA: 'ようき', atk: 1.0, def: 1.0, spA: 0.9, spD: 1.0, spe: 1.1, plus: 'spe', minus: 'spA' },
    { nameEN: 'Naive', nameJA: 'むじゃき', atk: 1.0, def: 1.0, spA: 1.0, spD: 0.9, spe: 1.1, plus: 'spe', minus: 'spD' },
    { nameEN: 'Serious', nameJA: 'まじめ', atk: 1.0, def: 1.0, spA: 1.0, spD: 1.0, spe: 1.0, plus: 'spe', minus: 'spe' },
];
