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
    const nameEN = regPokemon.isValidName();
    if (nameEN.length === 0)
        return;
    regPokemon.setName(nameEN[0]);
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
    const nameEN = regPokemon.ability.isValidName();
    if (nameEN.length === 0)
        return;
    regPokemon.ability.set(nameEN[0]);
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
    const nameEN = regPokemon.move.slot[slot].isValidName(slot);
    if (nameEN.length === 0)
        return;
    regPokemon.move.slot[slot].select(nameEN[0]);
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
    // 登録情報をコピー
    main.me.party[number].register(regPokemon);
    // 画面に表示
    main.me.party[number].showHandInfo();
    main.me.party[number].showPartyImage();
    // 登録画面リセット
    regPokemon.reset();
    regPokemon.showOnScreen();
}
// パーティ編集
function editParty(number) {
    if (main.me.party[number].name === null)
        return;
    regPokemon.copy(main.me.party[number]);
    regPokemon.showOnScreen();
    main.me.party[number].reset();
    main.me.party[number].showHandInfo();
}
// パーティランダムセット
function registerAllRandom() {
    for (let i = 0; i < 6; i++) {
        // 登録欄
        const selectable = pokemonSelectableMaster.filter(poke => poke.selectable);
        const nameEN = selectable[Math.floor(Math.random() * selectable.length)].nameEN;
        const pokemon = pokemonMaster.filter(poke => poke.nameEN === nameEN)[0];
        const name = pokemon.nameJA;
        getHTMLInputElement('register_name').value = name;
        registrationPokemon();
        for (let j = 0; j < 4; j++) {
            if (!moveLearnedByPokemon.some(_move => _move.nameEN === pokemon.nameEN))
                continue;
            const learned = moveLearnedByPokemon.filter(_move => _move.nameEN === pokemon.nameEN)[0].move;
            const move = learned[Math.floor(Math.random() * learned.length)];
            if (!moveMaster.some(_move => _move.nameEN === move))
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
    // 既に選択済みなら処理なし
    if (electedOrder.isElected(number))
        return;
    // 既に規定数選出済みなら処理なし
    if (electedOrder.isAllElected())
        return;
    // 選出に加える
    electedOrder.elsect(number);
    // 画面表示
    electedOrder.show();
}
// 選出取消
function quitElection(number) {
    // 選択していないなら処理なし
    if (!electedOrder.isElected(number))
        return;
    // 選出から除愛
    electedOrder.quit(number);
    // 画面表示
    electedOrder.show();
}
