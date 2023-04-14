"use strict";
// HTMLElementの取得
function getHTMLInputElement(id) {
    const HTMLElement = document.getElementById(id);
    return HTMLElement;
}
function registrationPokemon() {
    const name = getHTMLInputElement('register_name').value;
    const pokemon = getPokemonDataByName(name);
    const typeHTML = getHTMLInputElement('register_type');
    const genderHTML = getHTMLInputElement('register_gender');
    const abilityHTML = getHTMLInputElement('register_ability');
    let type = '';
    // 存在しないポケモンの場合、処理を終了
    if (pokemon.isOK === false) {
        return;
    }
    // タイプ表示
    if (pokemon.type2 === '') {
        type = pokemon.type1;
    }
    else {
        type = pokemon.type1 + '、' + pokemon.type2;
    }
    typeHTML.textContent = type;
    // 性別表示
    genderHTML.innerHTML = '';
    for (const gender of [pokemon.gender1, pokemon.gender2]) {
        if (gender === '') {
            continue;
        }
        const option = document.createElement('option');
        option.value = pokemon.gender1;
        option.textContent = pokemon.gender1;
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
function reflectMoveNatureInHTML() {
    for (let i = 0; i < 4; i++) {
        const name = getHTMLInputElement('registerMoveName' + i).value;
        const move = getMoveDataByName(name);
        if (move.isOK === false) {
            continue;
        }
        getHTMLInputElement('registerMoveType' + i).textContent = move.type;
        getHTMLInputElement('registerMovePower' + i).textContent = String(move.power);
        getHTMLInputElement('registerMoveAccuracy' + i).textContent = String(move.accuracy);
        getHTMLInputElement('registerMovePowerPoint' + i).textContent = String(move.powerPoint);
    }
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
    powerPoint.textContent = String(result);
}
