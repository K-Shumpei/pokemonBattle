"use strict";
document.write('<table>');
for (let i = 0; i < 3; i++) {
    document.write('<tr id="battleRow_' + i + '">');
    // 技・控え
    document.write('<td id="command1st_' + i + '" width="250">');
    document.write('<table>');
    for (let j = 0; j < 4; j++) {
        document.write('<tr id="moveRow_' + i + '_' + j + '"><td>技' + (j + 1) + '</td>');
        document.write('<td><input id="moveRadio_' + i + '_' + j + '" type="radio" name="command_1st_' + i + '"></td>');
        document.write('<td width="170"><span id="moveText_' + i + '_' + j + '"></span></td></tr>');
    }
    for (let j = 0; j < 3; j++) {
        document.write('<tr id="reserveRow_' + i + '_' + j + '"><td>控' + (j + 1) + '</td>');
        document.write('<td><input id="reserveRadio_' + i + '_' + j + '" type="radio" name="command_1st_' + i + '"></td>');
        document.write('<td width="170"><span id="reserveTExt_' + i + '_' + j + '"></span></td></tr>');
    }
    document.write('</table>');
    document.write('</td>');
    // 攻撃対象
    document.write('<td id="command2nd_' + i + '" width="250">');
    document.write('<table>');
    for (let j = 0; j < 3; j++) {
        document.write('<tr id="opponentTargetRow_' + i + '_' + j + '"><td>相手</td>');
        document.write('<td><input id="opponentTargetRadio_' + i + '_' + j + '" type="radio" name="command_2nd_' + i + '"></td>');
        document.write('<td width="170"><span id="opponentTargetText' + i + '_' + j + '"></span></td></tr>');
    }
    for (let j = 0; j < 2; j++) {
        document.write('<tr id="myTargetRow_' + i + '_' + j + '"><td>自分</td>');
        document.write('<td><input id="myTargetRadio_' + i + '_' + j + '" type="radio" name="command_2nd_' + i + '"></td>');
        document.write('<td width="170"><span id="myTargetText_' + i + '_' + j + '"></span></td>');
    }
    document.write('</table>');
    document.write('</td>');
    // 自分のポケモン
    document.write('<td><img id="battleMyImage_' + i + '" src="./image/pokeBall.png" class="battle_image_CSS"></td>');
    // 空欄
    document.write('<td>VS</td>');
    // 相手のポケモン
    document.write('<td><img id="battleOpponentImage_' + i + '" src="./image/pokeBall.png" class="battle_image_CSS"></td>');
    document.write('</tr>');
}
document.write('</table>');
