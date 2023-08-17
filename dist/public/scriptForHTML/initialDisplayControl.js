"use strict";
const registrationField = document.getElementById('registrationField');
// registrationField.style.display = 'none';
// 性格の攻撃にチェックをつける
getHTMLInputElement('register_attackNaturePlus').checked = true;
getHTMLInputElement('register_attackNatureMinus').checked = true;
// 性格リスト
const registerPokemonNature = getHTMLInputElement('register_nature');
for (const nature of natureData) {
    const option = document.createElement('option');
    option.value = nature.name;
    option.textContent = nature.name;
    registerPokemonNature.appendChild(option);
}
// ポケモンの名前候補
document.write('<datalist id="registerPokemonNameList">');
for (const pokemon of pokemonMaster) {
    document.write('<option value="' + pokemon.nameJA + '">');
}
document.write('</datalist>');
// 選出完了ボタン
getHTMLInputElement('decideOrderField').style.display = 'none';
// 選出・取消ボタン
for (let i = 0; i < 6; i++) {
    getHTMLInputElement('electPokemon' + i).style.display = 'none';
    getHTMLInputElement('quitElection' + i).style.display = 'none';
}
// バトルフィールド
for (let i = 0; i < 3; i++) {
    getHTMLInputElement('battleRow_' + i).style.visibility = 'collapse';
    // 技・控え
    getHTMLInputElement('command1st_' + i).style.visibility = 'collapse';
    // 攻撃対象
    getHTMLInputElement('command2nd_' + i).style.visibility = 'collapse';
}
