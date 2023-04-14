"use strict";
for (let i = 0; i < 6; i++) {
    document.write('<td><table>');
    // 登録・編集ボタン
    document.write('<tr align="center">');
    document.write('<td colspan="3"><input type="button" value="登録" onclick="registerParty(' + i + ')"></td>');
    document.write('<td colspan="3"><input type="button" value="編集" onclick="editParty(' + i + ')"></td>');
    document.write('</tr>');
    // 名前・性別・レベル
    document.write('<tr>');
    document.write('<td colspan="4"><span id="party' + i + '_name">名前</span></td>');
    document.write('<td colspan="1"><span id="party' + i + '_gender">性別</span></td>');
    document.write('<td colspan="1"><span id="party' + i + '_level">レベル</span></td>');
    document.write('</tr>');
    // 特性
    document.write('<tr>');
    document.write('<td colspan="6"><span id="party' + i + '_ability">特性</span></td>');
    document.write('</tr>');
    // 持ち物
    document.write('<tr>');
    document.write('<td colspan="6"><span id="party' + i + '_item">持ち物</span></td>');
    document.write('</tr>');
    // 状態異常
    document.write('<tr>');
    document.write('<td colspan="6"><span id="party' + i + '_statusAilment">状態異常</span></td>');
    document.write('</tr>');
    // 性格
    document.write('<tr>');
    document.write('<td colspan="6"><span id="party' + i + '_nature">性格</span></td>');
    document.write('</tr>');
    // 実数値(H/A)
    document.write('<tr>');
    document.write('<td colspan="3"><span id="party' + i + '_hitPoint">HP</span></td>');
    document.write('<td colspan="3"><span id="party' + i + '_attack">攻撃</span></td>');
    document.write('</tr>');
    // 実数値(B/C)
    document.write('<tr>');
    document.write('<td colspan="3"><span id="party' + i + '_defense">防御</span></td>');
    document.write('<td colspan="3"><span id="party' + i + '_specialAttack">特攻</span></td>');
    document.write('</tr>');
    // 実数値(D/S)
    document.write('<tr>');
    document.write('<td colspan="3"><span id="party' + i + '_specialDefense">特防</span></td>');
    document.write('<td colspan="3"><span id="party' + i + '_speed">素早さ</span></td>');
    document.write('</tr>');
    // 技
    for (let j = 0; j < 4; j++) {
        document.write('<tr>');
        document.write('<td colspan="4"><span id="party' + i + '_move' + j + '">技</span></td>');
        document.write('<td colspan="2"><span id="party' + i + '_powerPoint' + j + '">PP</span></td>');
        document.write('</tr>');
    }
    document.write('</table></td>');
}
