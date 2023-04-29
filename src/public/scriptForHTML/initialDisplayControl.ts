const registrationField = <HTMLInputElement>document.getElementById( 'registrationField' );
// registrationField.style.display = 'none';

// 性格の攻撃にチェックをつける
getHTMLInputElement( 'register_attackNaturePlus' ).checked = true;
getHTMLInputElement( 'register_attackNatureMinus' ).checked = true;

// 性格リスト
const registerPokemonNature = getHTMLInputElement( 'register_nature' );
for ( const nature of natureData ) {
  const option = document.createElement( 'option' );
  option.value = nature.name;
  option.textContent = nature.name;
  registerPokemonNature.appendChild( option );
}

// ポケモンの名前候補
document.write( '<datalist id="registerPokemonNameList">' );
for ( const pokemon of pokemonData ) {
  document.write( '<option value="' + pokemon.name + '">');
}
document.write( '</datalist>');

// 選出完了ボタン
getHTMLInputElement( 'decideOrderField' ).style.display = 'none';

// 選出・取消ボタン
for ( let i = 0; i < 6; i++ ) {
  getHTMLInputElement( 'electPokemon' + i ).style.display = 'none';
  getHTMLInputElement( 'quitElection' + i ).style.display = 'none';
}
