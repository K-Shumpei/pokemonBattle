for ( let i = 0; i < 6; i++ ) {
  document.write( '<td><table>' );

  // 登録・編集ボタン
  document.write( '<tr>' );
  document.write( '<td><input type="button" value="登録" onclick="registerParty(' + i + ')"></td>');
  document.write( '<td><input type="button" value="編集" onclick="editParty(' + i + ')"></td>');
  document.write( '</tr>' );
  // 名前・性別・レベル
  document.write( '<tr>' );
  document.write( '<td><span id="party' + i + '_name">名前</span></td>' );
  document.write( '<td><span id="party' + i + '_gender">性別</span>' );
  document.write( 'Lv.<span id="party' + i + '_level"></span></td>' );
  document.write( '</tr>' );
  // タイプ・状態異常
  document.write( '<tr>' );
  document.write( '<td><span id="party' + i + '_type1">タイプ</span><span id="party' + i + '_type2"></span></td>' );
  document.write( '<td><span id="party' + i + '_statusAilment"></span></td>' );
  document.write( '</tr>' );
  // 特性
  document.write( '<tr>' );
  document.write( '<td colspan="2"><span id="party' + i + '_ability">特性</span></td>' );
  document.write( '</tr>' );
  // 持ち物
  document.write( '<tr>' );
  document.write( '<td colspan="2"><span id="party' + i + '_item">持ち物</span></td>' );
  document.write( '</tr>' );
  // 実数値(H/A)
  document.write( '<tr>' );
  document.write( '<td>HP:<span id="party' + i + '_remainingHP"></span>/<span id="party' + i + '_hitPoint"></span></td>' );
  document.write( '<td>攻撃:<span id="party' + i + '_attack"></span></td>' );
  document.write( '</tr>' );
  // 実数値(B/C)
  document.write( '<tr>' );
  document.write( '<td>防御:<span id="party' + i + '_defense"></span></td>' );
  document.write( '<td>特攻:<span id="party' + i + '_specialAttack"></span></td>' );
  document.write( '</tr>' );
  // 実数値(D/S)
  document.write( '<tr>' );
  document.write( '<td>特防:<span id="party' + i + '_specialDefense"></span></td>' );
  document.write( '<td>素早さ:<span id="party' + i + '_speed"></span></td>' );
  document.write( '</tr>' );
  // 技
  for ( let j = 0; j < 4; j++ ) {
    document.write( '<tr>' );
    document.write( '<td><span id="party' + i + '_move' + j + '">技</span></td>' );
    document.write( '<td align="right"><span id="party' + i + '_remainingPP' + j + '"></span>/<span id="party' + i + '_powerPoint' + j + '">PP</span></td>' );
    document.write( '</tr>' );
  }

  document.write( '</table></td>' );
}
