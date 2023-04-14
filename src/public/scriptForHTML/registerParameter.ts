for ( const parameter of parameterSix ) {
  const actualValue:     string = 'register_' + parameter + 'ActualValue';
  const baseStatus:      string = 'register_' + parameter + 'BaseStatus';
  const individualValue: string = 'register_' + parameter + 'IndividualValue';
  const effortValue:     string = 'register_' + parameter + 'EffortValue';

  document.write( '<tr align="center">' )
  // 目次
  document.write( '<td>' +  translateENintoJP( parameter ) + '</td>' );
  // 実数値
  if ( parameter === 'hitPoint' ) {
    document.write( '<td><input id="' + actualValue + '" type="number" value="175" min="1" max="999" step"1" onchange="reflectEffortValueInHTML(`' + parameter + '`)"></td>' );
  } else {
    document.write( '<td><input id="' + actualValue + '" type="number" value="120" min="1" max="999" step"1" onchange="reflectEffortValueInHTML(`' + parameter + '`)"></td>' );
  }
  // 種族値
  document.write( '<td><span id="' + baseStatus + '">100</span></td>' );
  // 個体値
  document.write( '<td><input id="' + individualValue + '" type="number" value="31" min="0" max="31" step="1" onchange="reflectActualValueInHTML()"></td>' );
  // 努力値
  document.write( '<td><input id="' + effortValue + '" type="number" value="0" min="0" max="252" step="4" onchange="reflectRemainingEffortValueInHTML(`' + parameter +'`), reflectActualValueInHTML()">' );
  document.write( '<input type="button" value="0" onclick="setEffortValue(`' + parameter + '`, 0), reflectActualValueInHTML()">' );
  document.write( '<input type="button" value="252" onclick="setEffortValue(`' + parameter + '`, 252), reflectActualValueInHTML()"></td>' );
  // 性格
  if ( parameter === 'hitPoint' ) {
    document.write( '<td>+</td><td>-</td>' );
  } else {
    document.write( '<td><input id="register_' + parameter + 'NaturePlus" type="radio" name="register_naturePlus" onclick="natureRadioToText(), reflectActualValueInHTML()"></td>' );
    document.write( '<td><input id="register_' + parameter + 'NatureMinus" type="radio" name="register_natureMinus" onclick="natureRadioToText(), reflectActualValueInHTML()"></td>' );
  }


  document.write( '</tr>' )
}
