"use strict";
for (const parameter of parameterSix) {
    const actualValue = 'register_' + parameter + 'ActualValue';
    const baseStatus = 'register_' + parameter + 'BaseStatus';
    const individualValue = 'register_' + parameter + 'IndividualValue';
    const effortValue = 'register_' + parameter + 'EffortValue';
    document.write('<tr align="center">');
    // 目次
    document.write('<td>' + translateENintoJP(parameter) + '</td>');
    // 実数値
    document.write('<td><input id="' + actualValue + '" type="number" value="0" min="1" max="999" step"1" onchange="registerActualValue()"></td>');
    // 種族値
    document.write('<td><span id="' + baseStatus + '">0</span></td>');
    // 個体値
    document.write('<td><input id="' + individualValue + '" type="number" value="31" min="0" max="31" step="1" onchange="registerIndividualValue()"></td>');
    // 努力値
    document.write('<td><input id="' + effortValue + '" type="number" value="0" min="0" max="252" step="4" onchange="registerEffortValue()">');
    document.write('<input type="button" value="0" onclick="setEffortValue(`' + parameter + '`, 0)">');
    document.write('<input type="button" value="252" onclick="setEffortValue(`' + parameter + '`, 252)"></td>');
    // 性格
    if (parameter === 'hitPoint') {
        document.write('<td>+</td><td>-</td>');
    }
    else {
        document.write('<td><input id="register_' + parameter + 'NaturePlus" type="radio" name="register_naturePlus" onclick="registerNatureButton()"></td>');
        document.write('<td><input id="register_' + parameter + 'NatureMinus" type="radio" name="register_natureMinus" onclick="registerNatureButton()"></td>');
    }
    document.write('</tr>');
}
