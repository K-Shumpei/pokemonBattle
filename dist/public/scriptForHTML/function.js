"use strict";
// HTMLElementの取得
function getHTMLInputElement(id) {
    const HTMLElement = document.getElementById(id);
    return HTMLElement;
}
// バトル形式の選択
function decideBattleStyle(value) {
    fieldStatus.setNumberOfPokemon(Number(value));
    for (let i = 0; i < 6; i++) {
        getHTMLInputElement('electedOrder' + i).textContent = '';
    }
}
// ポケモン名を入力した時に各パラメータを表示
function registrationPokemon() {
    // 適切な名前でなければ処理なし
    if (!regPokemon.isValidName())
        return;
    regPokemon.setName();
    regPokemon.showOnScreen();
}
// レベル変更
function registerLevel() {
    // 適切な名前でなければ処理なし
    if (regPokemon.isUnreg())
        return;
    regPokemon.setLevel();
    regPokemon.calculateActualValue();
    regPokemon.showOnScreen();
}
// 性別変更
function registerGender() {
    // 適切な名前でなければ処理なし
    if (regPokemon.isUnreg())
        return;
    regPokemon.setGender();
    regPokemon.calculateActualValue();
    regPokemon.showOnScreen();
}
// 特性変更
function registerAbility() {
    // 適切な名前でなければ処理なし
    if (regPokemon.isUnreg())
        return;
    regPokemon.ability.set();
    regPokemon.calculateActualValue();
    regPokemon.showOnScreen();
}
// 性格変更リスト
function registerNatureList() {
    // 適切な名前でなければ処理なし
    if (regPokemon.isUnreg())
        return;
    regPokemon.setNatureList();
    regPokemon.calculateActualValue();
    regPokemon.showOnScreen();
}
// 性格変更ボタン
function registerNatureButton() {
    // 適切な名前でなければ処理なし
    if (regPokemon.isUnreg())
        return;
    regPokemon.setNatureButton();
    regPokemon.calculateActualValue();
    regPokemon.showOnScreen();
}
// 技表示
function reflectMoveNatureInHTML(slot) {
    // 適切な名前でなければ処理なし
    if (regPokemon.isUnreg())
        return;
    regPokemon.move.slot[slot].select(slot);
    regPokemon.showOnScreen();
}
// 実数値変更
function registerActualValue() {
    // 適切な名前でなければ処理なし
    if (regPokemon.isUnreg())
        return;
    regPokemon.setAVs();
    regPokemon.calculateActualValue();
    regPokemon.showOnScreen();
}
// 個体値変更
function registerIndividualValue() {
    // 適切な名前でなければ処理なし
    if (regPokemon.isUnreg())
        return;
    regPokemon.stat.setIVs();
    regPokemon.calculateActualValue();
    regPokemon.showOnScreen();
}
// 努力値変更
function registerEffortValue() {
    // 適切な名前でなければ処理なし
    if (regPokemon.isUnreg())
        return;
    regPokemon.stat.setEVs();
    regPokemon.calculateActualValue();
    regPokemon.showOnScreen();
}
function addPowerPoint(slot) {
    // 適切な名前でなければ処理なし
    if (regPokemon.isUnreg())
        return;
    regPokemon.move.slot[slot].addPP();
    regPokemon.calculateActualValue();
    regPokemon.showOnScreen();
}
function subPowerPoint(slot) {
    // 適切な名前でなければ処理なし
    if (regPokemon.isUnreg())
        return;
    regPokemon.move.slot[slot].subPP();
    regPokemon.calculateActualValue();
    regPokemon.showOnScreen();
}
// パーティ登録
function registerParty(number) {
    // 適切な名前でなければ処理なし
    if (regPokemon.isUnreg())
        return;
    const name = getHTMLInputElement('register_name').value;
    const pokemon = getPokemonDataByName(name);
    // トレーナーネーム
    myAllParty[number].trainer = 'me';
    // 並び順
    myAllParty[number].order.party = number;
    myAllParty[number].order.hand = number;
    // 基本ステータス
    myAllParty[number].id.id = pokemon.id;
    myAllParty[number].id.order = pokemon.order;
    myAllParty[number].id.index = pokemon.index;
    // 登録情報をコピー
    myAllParty[number].register(regPokemon);
    // 画面に表示
    myAllParty[number].showOnScreen();
    // 登録画面リセット
    regPokemon.reset();
    regPokemon.showOnScreen();
}
// パーティ編集
function editParty(number) {
    if (myAllParty[number].name === '') {
        return;
    }
    // 登録画面リセット
    getHTMLInputElement('register_name').value = '';
    //resetInputRegister();
    // 編集するポケモンの名前をセット
    //getHTMLInputElement( 'register_name' ).value = translatePokemonName(myAllParty[number].name);
    // 基本ステータス表示
    registrationPokemon();
    getHTMLInputElement('register_level').value = String(myAllParty[number].level);
    //getHTMLInputElement( 'register_gender' ).value = translateGender(myAllParty[number].gender);
    //getHTMLInputElement( 'register_type1' ).value = translateTypeIntoJapanese( myAllParty[number].type1 );
    //getHTMLInputElement( 'register_type1' ).textContent = translateTypeIntoJapanese( myAllParty[number].type1 );
    //getHTMLInputElement( 'register_type2' ).value = translateTypeIntoJapanese( myAllParty[number].type2 );
    //getHTMLInputElement( 'register_type2' ).textContent = translateTypeIntoJapanese( myAllParty[number].type2 );
    //getHTMLInputElement( 'register_ability' ).value = translateAbility( myAllParty[number].ability.name );
    getHTMLInputElement('register_nature').value = myAllParty[number].nature;
    if (myAllParty[number].item === null) {
        getHTMLInputElement('register_item').value = '';
    }
    else {
        getHTMLInputElement('register_item').value = String(myAllParty[number].item);
    }
    // 性格　ラジオボタン
    //natureTextToRadio()
    // 個体値・努力値
    myAllParty[number].status.edit();
    getHTMLInputElement('remainingEffortValue').textContent = String(510 - myAllParty[number].status.getAllEffort());
    // 実数値計算
    //reflectActualValueInHTML()
    // 技
    for (let i = 0; i < 4; i++) {
        const moveName = myAllParty[number].move.learned[i].name;
        if (moveName === null)
            continue;
        //getHTMLInputElement( 'registerMoveName' + i ).value = translateMove( moveName );
        reflectMoveNatureInHTML(i);
        getHTMLInputElement('registerMovePowerPoint' + i).textContent = String(myAllParty[number].move.learned[i].powerPoint.value);
        getHTMLInputElement('registerMovePowerPoint' + i).value = String(myAllParty[number].move.learned[i].powerPoint.value);
    }
    // パーティ情報削除
    resetPartyPokemon(number);
}
function resetPartyPokemon(number) {
    const partyOrder = myAllParty[number].order.party;
    const handOrder = myAllParty[number].order.hand;
    const imageHTML = getHTMLInputElement('myParty_image' + partyOrder);
    if (handOrder === null) {
        return;
    }
    // 表示のリセット
    getHTMLInputElement('party' + handOrder + '_name').textContent = '名前';
    getHTMLInputElement('party' + handOrder + '_gender').textContent = '性別';
    getHTMLInputElement('party' + handOrder + '_level').textContent = '';
    getHTMLInputElement('party' + handOrder + '_type1').textContent = 'タイプ';
    getHTMLInputElement('party' + handOrder + '_type2').textContent = '';
    getHTMLInputElement('party' + handOrder + '_statusAilment').textContent = '';
    getHTMLInputElement('party' + handOrder + '_ability').textContent = '特性';
    getHTMLInputElement('party' + handOrder + '_remainingHP').textContent = '';
    getHTMLInputElement('party' + handOrder + '_item').textContent = '持ち物';
    for (const parameter of parameterSix) {
        getHTMLInputElement('party' + handOrder + '_' + parameter).textContent = '';
    }
    getHTMLInputElement('party' + handOrder + '_remainingHP').textContent = '';
    for (const parameter of parameterFive) {
        getHTMLInputElement('party' + handOrder + '_' + parameter).style.color = 'black';
    }
    for (let i = 0; i < 4; i++) {
        getHTMLInputElement('party' + handOrder + '_move' + i).textContent = '技';
        getHTMLInputElement('party' + handOrder + '_remainingPP' + i).textContent = '';
        getHTMLInputElement('party' + handOrder + '_powerPoint' + i).textContent = 'PP';
    }
    // パーティ画像
    if (myAllParty[number].name !== '') {
        imageHTML.src = './image/pokeBall.png';
    }
    // 内部情報リセット
    myAllParty[number] = new Pokemon;
}
// パーティランダムセット
function registerAllRandom() {
    for (let i = 0; i < 6; i++) {
        // 登録欄
        const pokemon = pokemonMaster[Math.floor(Math.random() * pokemonMaster.length)];
        const name = pokemon.nameJA;
        getHTMLInputElement('register_name').value = name;
        registrationPokemon();
        for (let j = 0; j < 4; j++) {
            if (moveLearnedByPokemon.some(_move => _move.nameEN === pokemon.nameEN) === false)
                continue;
            const learned = moveLearnedByPokemon.filter(_move => _move.nameEN === pokemon.nameEN)[0].move;
            const move = learned[Math.floor(Math.random() * learned.length)];
            if (moveMaster.some(_move => _move.nameEN === move) == false)
                continue;
            getHTMLInputElement('registerMoveName' + j).value = moveMaster.filter(_move => _move.nameEN === move)[0].nameJA;
            reflectMoveNatureInHTML(j);
        }
        // パーティ登録
        registerParty(i);
    }
}
// 選出
function electPokemon(number) {
    const targetText = getHTMLInputElement('electedOrder' + number);
    let electedCount = 0;
    // 既に選択済みなら処理なし
    if (targetText.textContent !== '') {
        return;
    }
    // 選出済の数を数える
    for (let i = 0; i < 6; i++) {
        const elect = getHTMLInputElement('electedOrder' + i);
        if (elect.textContent !== '') {
            electedCount += 1;
        }
    }
    // 既に規定数選出済みなら処理なし
    if (electedCount === fieldStatus.numberOfPokemon) {
        return;
    }
    targetText.value = String(electedCount);
    targetText.textContent = String(electedCount + 1) + '番目';
}
// 選出取消
function quitElection(number) {
    var _a, _b;
    const targetText = getHTMLInputElement('electedOrder' + number);
    const targetOrder = Number((_a = targetText.textContent) === null || _a === void 0 ? void 0 : _a.charAt(0));
    // 選択していないなら処理なし
    if (targetText.textContent === '') {
        return;
    }
    targetText.textContent = '';
    for (let i = 0; i < 6; i++) {
        const otherText = getHTMLInputElement('electedOrder' + i);
        if (otherText.textContent === '') {
            continue;
        }
        const otherOrder = Number((_b = otherText.textContent) === null || _b === void 0 ? void 0 : _b.charAt(0));
        if (otherOrder > targetOrder) {
            otherText.textContent = String(otherOrder - 1) + '番目';
        }
    }
}
// コマンド欄の表示
function showCommand1stField() {
    // 送信ボタンの非活性化
    getHTMLInputElement('sendCommandButton').disabled = false;
    for (let i = 0; i < fieldStatus.battleStyle; i++) {
        if (myParty.filter(poke => poke.order.battle === i).length === 0)
            continue;
        const pokemon = myParty.filter(poke => poke.order.battle === i)[0];
        // 技・控え
        getHTMLInputElement('command1st_' + i).style.visibility = 'visible';
        // 技
        for (let j = 0; j < 4; j++) {
            const moveName = pokemon.move.learned[j].name;
            if (moveName === null)
                continue;
            //getHTMLInputElement( 'moveText_' + i + '_' + j ).textContent = translateMove( moveName );
            getHTMLInputElement('moveRadio_' + i + '_' + j).disabled = false;
        }
        // 控え
        const reserve = myParty.filter(poke => poke.order.battle === null && poke.hitPoint.value.isZero() === false);
        for (let j = 0; j < reserve.length; j++) {
            getHTMLInputElement('reserveRadio_' + i + '_' + j).disabled = false;
            getHTMLInputElement('reserveText_' + i + '_' + j).textContent = reserve[j].name;
            getHTMLInputElement('reserveText_' + i + '_' + j).value = String(reserve[j].order.party);
        }
    }
}
