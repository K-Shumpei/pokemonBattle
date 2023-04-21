"use strict";
// HTMLElementの取得
function getHTMLInputElement(id) {
    const HTMLElement = document.getElementById(id);
    return HTMLElement;
}
// 入力リセット
function resetInputRegister() {
    const name = getHTMLInputElement('register_name').value;
    getHTMLInputElement('register_name').value = '';
    getHTMLInputElement('register_level').value = '50';
    getHTMLInputElement('register_type1').value = '';
    getHTMLInputElement('register_type1').textContent = '';
    getHTMLInputElement('register_type2').value = '';
    getHTMLInputElement('register_type2').textContent = '';
    getHTMLInputElement('register_gender').innerHTML = '';
    getHTMLInputElement('register_ability').innerHTML = '';
    getHTMLInputElement('register_item').textContent = '';
    getHTMLInputElement('register_nature').value = 'てれや';
    natureTextToRadio();
    for (const parameter of parameterSix) {
        getHTMLInputElement('register_' + parameter + 'ActualValue').value = '120';
        getHTMLInputElement('register_' + parameter + 'BaseStatus').textContent = '100';
        getHTMLInputElement('register_' + parameter + 'IndividualValue').value = '31';
        getHTMLInputElement('register_' + parameter + 'EffortValue').value = '0';
        if (parameter === 'hitPoint') {
            getHTMLInputElement('register_' + parameter + 'ActualValue').value = '175';
        }
    }
    getHTMLInputElement('remainingEffortValue').textContent = '510';
    for (let i = 0; i < 4; i++) {
        getHTMLInputElement('registerMoveName' + i).value = '';
        getHTMLInputElement('registerMoveType' + i).textContent = '';
        getHTMLInputElement('registerMovePower' + i).textContent = '';
        getHTMLInputElement('registerMoveAccuracy' + i).textContent = '';
        getHTMLInputElement('registerMovePowerPoint' + i).textContent = '';
        getHTMLInputElement('registerMovePowerPoint' + i).value = '';
    }
    getHTMLInputElement('register_name').value = name;
}
// ポケモン名を入力した時に各パラメータを表示
function registrationPokemon() {
    const name = getHTMLInputElement('register_name').value;
    const pokemon = getPokemonDataByName(name);
    const type1HTML = getHTMLInputElement('register_type1');
    const type2HTML = getHTMLInputElement('register_type2');
    const genderHTML = getHTMLInputElement('register_gender');
    const abilityHTML = getHTMLInputElement('register_ability');
    // 存在しないポケモンの場合、処理を終了
    if (pokemon.isOK === false) {
        return;
    }
    resetInputRegister();
    // タイプ表示
    type1HTML.textContent = pokemon.type1;
    type2HTML.textContent = pokemon.type2;
    type1HTML.value = pokemon.type1;
    type2HTML.value = pokemon.type2;
    // 性別表示
    genderHTML.innerHTML = '';
    for (const gender of [pokemon.gender1, pokemon.gender2]) {
        if (gender === '') {
            continue;
        }
        const option = document.createElement('option');
        option.value = gender;
        option.textContent = gender;
        genderHTML.appendChild(option);
    }
    // 特性表示
    abilityHTML.innerHTML = '';
    for (const ability of [pokemon.ability1, pokemon.ability2, pokemon.ability3]) {
        if (ability === '') {
            continue;
        }
        const option = document.createElement('option');
        option.value = ability;
        option.textContent = ability;
        abilityHTML.appendChild(option);
    }
    // 種族値表示
    const baseStatusList = getBaseStatusList(pokemon);
    for (const parameter of Object.keys(baseStatusList)) {
        getHTMLInputElement('register_' + parameter + 'BaseStatus').textContent = String(baseStatusList[parameter]);
    }
    // 実数値表示
    reflectActualValueInHTML();
    // 技表示
    for (let i = 0; i < 4; i++) {
        const moveHTML = getHTMLInputElement('registerMoveName' + i);
        moveHTML.innerHTML = '';
        // ブランクの選択肢
        const blunk = document.createElement('option');
        blunk.value = '';
        blunk.textContent = '';
        moveHTML.appendChild(blunk);
        // ポケモンが覚える技
        for (const move of moveData) {
            const option = document.createElement('option');
            option.value = move.name;
            option.textContent = move.name;
            moveHTML.appendChild(option);
        }
    }
}
// 実数値表示
function reflectActualValueInHTML() {
    const name = getHTMLInputElement('register_name').value;
    const level = Number(getHTMLInputElement('register_level').value);
    const pokemon = getPokemonDataByName(name);
    // 存在しないポケモンの場合、処理を終了
    if (pokemon.isOK === false) {
        return;
    }
    const nature = getHTMLInputElement('register_nature').value;
    const actualValueList = calculateActualValue(pokemon, level, nature);
    for (const parameter of Object.keys(actualValueList)) {
        getHTMLInputElement('register_' + parameter + 'ActualValue').value = String(actualValueList[parameter]);
    }
}
// 実数値計算
function calculateActualValue(pokemon, level, natureString) {
    const baseStatusList = getBaseStatusList(pokemon);
    const nature = getNatureDataByName(natureString);
    for (const parameter of Object.keys(baseStatusList)) {
        const baseStatus = baseStatusList[parameter];
        const individualValue = Number(getHTMLInputElement('register_' + parameter + 'IndividualValue').value);
        const effortValue = Number(getHTMLInputElement('register_' + parameter + 'EffortValue').value);
        let actualValue = 0;
        const step1 = baseStatus * 2 + individualValue + Math.floor(effortValue / 4);
        const step2 = step1 * level;
        actualValue = Math.floor(step2 / 100);
        if (parameter === 'hitPoint') {
            if (pokemon.name === 'ヌケニン') {
                actualValue = 1;
            }
            else {
                actualValue += level + 10;
            }
        }
        else {
            let natureRate = 1.0;
            if (nature.plus === nature.minus) {
                natureRate = 1.0;
            }
            else if (nature.plus === parameter) {
                natureRate = 1.1;
            }
            else if (nature.minus === parameter) {
                natureRate = 0.9;
            }
            actualValue = Math.floor((actualValue + 5) * natureRate);
        }
        baseStatusList[parameter] = actualValue;
    }
    return baseStatusList;
}
// 技表示
function reflectMoveNatureInHTML(number) {
    const name = getHTMLInputElement('registerMoveName' + number).value;
    const move = getMoveDataByName(name);
    // 存在しない技の場合、処理を終了
    if (move.isOK === false) {
        return;
    }
    getHTMLInputElement('registerMoveType' + number).textContent = move.type;
    getHTMLInputElement('registerMovePower' + number).textContent = String(move.power);
    getHTMLInputElement('registerMoveAccuracy' + number).textContent = String(move.accuracy);
    getHTMLInputElement('registerMovePowerPoint' + number).textContent = String(move.powerPoint);
    getHTMLInputElement('registerMovePowerPoint' + number).value = String(move.powerPoint);
}
// 努力値：入力欄
function reflectRemainingEffortValueInHTML(targetParameter) {
    const remainingHTML = getHTMLInputElement('remainingEffortValue');
    const targetHTML = getHTMLInputElement('register_' + targetParameter + 'EffortValue');
    let sumEffortValue = 0;
    // 努力値の上限は252
    if (Number(targetHTML.value) > 252) {
        targetHTML.value = '252';
    }
    // 努力値の下限は0
    if (Number(targetHTML.value) < 0) {
        targetHTML.value = '0';
    }
    // 努力値の総和を計算
    for (const parameter of parameterSix) {
        const effortValue = getHTMLInputElement('register_' + parameter + 'EffortValue');
        sumEffortValue += Number(effortValue.value);
    }
    // 努力値の総和の上限は510
    if (sumEffortValue > 510) {
        const availableValue = 510 - sumEffortValue + Number(targetHTML.value);
        targetHTML.value = String(availableValue);
        remainingHTML.textContent = '0';
    }
    else {
        remainingHTML.textContent = String(510 - sumEffortValue);
    }
}
// 努力値：0/252ボタン
function setEffortValue(parameter, number) {
    const effortValue = getHTMLInputElement('register_' + parameter + 'EffortValue');
    effortValue.value = String(number);
    reflectRemainingEffortValueInHTML(parameter);
}
// 努力値：実数値からの逆算
function reflectEffortValueInHTML(parameter) {
    const name = getHTMLInputElement('register_name').value;
    const pokemon = getPokemonDataByName(name);
    const level = Number(getHTMLInputElement('register_level').value);
    const nature = getNatureDataByName(parameter);
    const baseStatusList = getBaseStatusList(pokemon);
    const individualValue = Number(getHTMLInputElement('register_' + parameter + 'IndividualValue').value);
    const actualValue = Number(getHTMLInputElement('register_' + parameter + 'ActualValue').value);
    const effortValueHTML = getHTMLInputElement('register_' + parameter + 'EffortValue');
    let effortValue = 0;
    let natureRate = 1.0;
    // 存在しないポケモンの場合、処理を終了
    if (pokemon.isOK === false) {
        return;
    }
    // ヌケニンのHP実数値は変更できない
    if (pokemon.name === 'ヌケニン' && parameter === 'hitPoint') {
        reflectActualValueInHTML();
        return;
    }
    // 性格補正計算
    if (nature.plus === nature.minus) {
        natureRate = 1.0;
    }
    else if (nature.plus === parameter) {
        natureRate = 1.1;
    }
    else if (nature.minus === parameter) {
        natureRate = 0.9;
    }
    // 努力値計算
    for (const targetParameter of Object.keys(baseStatusList)) {
        if (targetParameter !== parameter) {
            continue;
        }
        let step3 = 0;
        if (parameter === 'hitPoint') {
            step3 = actualValue - level - 10;
        }
        else {
            step3 = Math.ceil(actualValue / natureRate - 5);
        }
        const step2 = 100 * step3 / level;
        const step1 = Math.ceil(step2 - 2 * baseStatusList[targetParameter] - individualValue);
        effortValue = 4 * step1;
    }
    // 努力値表示
    effortValueHTML.value = String(effortValue);
    reflectRemainingEffortValueInHTML(parameter);
    // 実数値再計算
    reflectActualValueInHTML();
}
// 性格：テキスト->ラジオボタン
function natureTextToRadio() {
    const natureString = getHTMLInputElement('register_nature').value;
    const nature = getNatureDataByName(natureString);
    if (nature.isOK === false) {
        return;
    }
    getHTMLInputElement('register_' + nature.plus + 'NaturePlus').checked = true;
    getHTMLInputElement('register_' + nature.minus + 'NatureMinus').checked = true;
}
// 性格：ラジオボタンー>テキスト
function natureRadioToText() {
    for (const nature of natureData) {
        const plus = getHTMLInputElement('register_' + nature.plus + 'NaturePlus');
        const minus = getHTMLInputElement('register_' + nature.minus + 'NatureMinus');
        const natureString = getHTMLInputElement('register_nature');
        if (plus.checked === true && minus.checked === true) {
            natureString.value = nature.name;
        }
    }
}
// PP変更
function changePowerPoint(number, direction) {
    const name = getHTMLInputElement('registerMoveName' + number).value;
    const move = getMoveDataByName(name);
    const powerPoint = getHTMLInputElement('registerMovePowerPoint' + number);
    const step = move.powerPoint / 5;
    const max = move.powerPoint + step * 3;
    let result = Number(powerPoint.textContent);
    // 存在しない技の場合、処理を終了
    if (move.isOK === false) {
        return;
    }
    // PPが1の技はPPを変更できない
    if (move.powerPoint === 1) {
        return;
    }
    if (direction === '▲') {
        result += step;
    }
    else if (direction === '▼') {
        result -= step;
    }
    if (result > max || result < move.powerPoint) {
        return;
    }
    powerPoint.value = String(result);
    powerPoint.textContent = String(result);
}
// パーティ登録
function registerParty(number) {
    const name = getHTMLInputElement('register_name').value;
    const pokemon = getPokemonDataByName(name);
    const type1HTML = getHTMLInputElement('register_type1');
    const type2HTML = getHTMLInputElement('register_type2');
    const genderHTML = getHTMLInputElement('register_gender');
    const abilityHTML = getHTMLInputElement('register_ability');
    const levelHTML = getHTMLInputElement('register_level');
    const itemHTML = getHTMLInputElement('register_item');
    const natureHTML = getHTMLInputElement('register_nature');
    const actualValue_hitPoint = getHTMLInputElement('register_hitPointActualValue');
    // 存在しないポケモンの場合、処理を終了
    if (pokemon.isOK === false) {
        return;
    }
    // 登録済みのポケモンを削除
    resetPartyPokemon(number);
    // 並び順
    myParty[number].partyNumber = number;
    // 基本ステータス
    myParty[number].status.number = pokemon.number;
    myParty[number].status.name = pokemon.name;
    myParty[number].status.type1 = type1HTML.value;
    myParty[number].status.type2 = type2HTML.value;
    myParty[number].status.gender = genderHTML.value;
    myParty[number].status.ability = abilityHTML.value;
    myParty[number].status.level = Number(levelHTML.value);
    myParty[number].status.item = itemHTML.value;
    myParty[number].status.nature = natureHTML.value;
    myParty[number].status.height = pokemon.height;
    myParty[number].status.weight = pokemon.weight;
    myParty[number].status.remainingHP = Number(actualValue_hitPoint.value);
    // 実数値・種族値・個体値・努力値
    for (const parameter of Object.keys(myParty[number].actualValue)) {
        const actualValue = getHTMLInputElement('register' + parameter + 'ActualValue');
        const baseStatus = getHTMLInputElement('register' + parameter + 'BaseStatus');
        const individualValue = getHTMLInputElement('register' + parameter + 'IndividualValue');
        const effortValue = getHTMLInputElement('register' + parameter + 'EffortValue');
        myParty[number].actualValue[parameter] = Number(actualValue.value);
        myParty[number].baseStatus[parameter] = Number(baseStatus.value);
        myParty[number].individualValue[parameter] = Number(individualValue.value);
        myParty[number].effortValue[parameter] = Number(effortValue.value);
    }
    // 技
    for (let i = 0; i < 4; i++) {
        const moveName = getHTMLInputElement('registerMoveName' + i).value;
        const move = getMoveDataByName(moveName);
        const powerPoint = getHTMLInputElement('registerMovePowerPoint' + i);
        // 存在しない技の場合、処理を終了
        if (move.isOK === false) {
            continue;
        }
        myParty[number].move[i].name = move.name;
        myParty[number].move[i].type = move.type;
        myParty[number].move[i].nature = move.nature;
        myParty[number].move[i].power = move.power;
        myParty[number].move[i].accuracy = move.accuracy;
        myParty[number].move[i].remainingPP = Number(powerPoint.value);
        myParty[number].move[i].powerPoint = Number(powerPoint.value);
        myParty[number].move[i].isDirect = move.isDirect;
        myParty[number].move[i].isProtect = move.isProtect;
        myParty[number].move[i].target = move.target;
    }
    // 画面に表示
    showPartyPokemon(number, myParty[number]);
    // 登録画面リセット
    getHTMLInputElement('register_name').value = '';
    resetInputRegister();
}
// パーティ編集
function editParty(number) {
    if (myParty[number].status.name === '') {
        return;
    }
    getHTMLInputElement('register_name').value = myParty[number].status.name;
    // 基本ステータス表示
    registrationPokemon();
    getHTMLInputElement('register_level').value = String(myParty[number].status.level);
    getHTMLInputElement('register_type1').value = myParty[number].status.type1;
    getHTMLInputElement('register_type1').textContent = myParty[number].status.type1;
    getHTMLInputElement('register_type2').value = myParty[number].status.type2;
    getHTMLInputElement('register_type2').textContent = myParty[number].status.type2;
    getHTMLInputElement('register_gender').value = myParty[number].status.gender;
    getHTMLInputElement('register_ability').value = myParty[number].status.ability;
    getHTMLInputElement('register_item').value = myParty[number].status.item;
    getHTMLInputElement('register_nature').value = myParty[number].status.nature;
    // 性格　ラジオボタン
    natureTextToRadio();
    // 個体値・努力値
    let remainingEffortValue = 510;
    for (const parameter of Object.keys(myParty[number].actualValue)) {
        getHTMLInputElement('register' + parameter + 'IndividualValue').value = String(myParty[number].individualValue[parameter]);
        getHTMLInputElement('register' + parameter + 'EffortValue').value = String(myParty[number].effortValue[parameter]);
        remainingEffortValue -= myParty[number].effortValue[parameter];
    }
    getHTMLInputElement('remainingEffortValue').textContent = String(remainingEffortValue);
    // 実数値計算
    reflectActualValueInHTML();
    // 技
    for (let i = 0; i < 4; i++) {
        if (myParty[number].move[i].name === '') {
            continue;
        }
        getHTMLInputElement('registerMoveName' + i).value = myParty[number].move[i].name;
        reflectMoveNatureInHTML(i);
        getHTMLInputElement('registerMovePowerPoint' + i).textContent = String(myParty[number].move[i].powerPoint);
        getHTMLInputElement('registerMovePowerPoint' + i).value = String(myParty[number].move[i].powerPoint);
    }
    // パーティ情報削除
    resetPartyPokemon(number);
}
function showPartyPokemon(number, pokemon) {
    getHTMLInputElement('party' + number + '_name').textContent = pokemon.status.name;
    getHTMLInputElement('party' + number + '_gender').textContent = pokemon.status.gender;
    getHTMLInputElement('party' + number + '_level').textContent = String(pokemon.status.level);
    getHTMLInputElement('party' + number + '_type1').textContent = pokemon.status.type1;
    getHTMLInputElement('party' + number + '_type2').textContent = pokemon.status.type2;
    getHTMLInputElement('party' + number + '_statusAilment').textContent = pokemon.status.statusAilment;
    getHTMLInputElement('party' + number + '_ability').textContent = pokemon.status.ability;
    getHTMLInputElement('party' + number + '_remainingHP').textContent = String(pokemon.status.remainingHP);
    let item = '持ち物なし';
    if (pokemon.status.item !== '') {
        item = pokemon.status.item;
    }
    getHTMLInputElement('party' + number + '_item').textContent = item;
    for (const parameter of Object.keys(pokemon.actualValue)) {
        getHTMLInputElement('party' + number + parameter).textContent = String(pokemon.actualValue[parameter]);
    }
    for (let i = 0; i < 4; i++) {
        getHTMLInputElement('party' + number + '_move' + i).textContent = pokemon.move[i].name;
        getHTMLInputElement('party' + number + '_remainingPP' + i).textContent = String(pokemon.move[i].remainingPP);
        getHTMLInputElement('party' + number + '_powerPoint' + i).textContent = String(pokemon.move[i].powerPoint);
    }
}
function resetPartyPokemon(number) {
    // 表示のリセット
    getHTMLInputElement('party' + number + '_name').textContent = '名前';
    getHTMLInputElement('party' + number + '_gender').textContent = '性別';
    getHTMLInputElement('party' + number + '_level').textContent = '';
    getHTMLInputElement('party' + number + '_type1').textContent = 'タイプ';
    getHTMLInputElement('party' + number + '_type2').textContent = '';
    getHTMLInputElement('party' + number + '_statusAilment').textContent = '';
    getHTMLInputElement('party' + number + '_ability').textContent = '特性';
    getHTMLInputElement('party' + number + '_remainingHP').textContent = '';
    getHTMLInputElement('party' + number + '_item').textContent = '持ち物';
    for (const parameter of parameterSix) {
        getHTMLInputElement('party' + number + '_' + parameter).textContent = '';
    }
    getHTMLInputElement('party' + number + '_remainingHP').textContent = '';
    for (let i = 0; i < 4; i++) {
        getHTMLInputElement('party' + number + '_move' + i).textContent = '技';
        getHTMLInputElement('party' + number + '_remainingPP' + i).textContent = '';
        getHTMLInputElement('party' + number + '_powerPoint' + i).textContent = 'PP';
    }
    // 内部情報リセット
    myParty[number] = new Pokemon;
}
