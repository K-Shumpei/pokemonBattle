"use strict";
for (let i = 0; i < 4; i++) {
    document.write('<tr align="center">');
    document.write('<td><select id="registerMoveName' + i + '" onchange="reflectMoveNatureInHTML(' + i + ')"></select></td>');
    document.write('<td =align="center" width="80"><span id="registerMoveType' + i + '"></span></td>');
    document.write('<td =align="center" width="35"><span id="registerMovePower' + i + '"></span></td>');
    document.write('<td =align="center" width="35"><span id="registerMoveAccuracy' + i + '"></span></td>');
    document.write('<td =align="center" width="35"><span id="registerMovePowerPoint' + i + '"></span></td>');
    document.write('<td =align="center"><input type="button" value="▲" onclick="changePowerPoint(' + i + ', value)"></td>');
    document.write('<td =align="center"><input type="button" value="▼" onclick="changePowerPoint(' + i + ', value)"></td>');
    document.write('</tr>');
}
