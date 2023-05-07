// HTMLElementの取得
function getHTMLInputElement( id: string ): HTMLInputElement {
  const HTMLElement = <HTMLInputElement>document.getElementById( id );
  return HTMLElement;
}

// バトル形式の選択
function decideBattleStyle( value: string ): void {

  fieldStatus.setNumberOfPokemon( Number( value ) );

  for ( let i = 0; i < 6; i++ ) {
    getHTMLInputElement( 'electedOrder' + i ).textContent = '';
  }
}

// 入力リセット
function resetInputRegister(): void {

  const name: string = getHTMLInputElement( 'register_name' ).value;

  getHTMLInputElement( 'register_name' ).value = '';
  getHTMLInputElement( 'register_level' ).value = '50'
  getHTMLInputElement( 'register_type1' ).value = '';
  getHTMLInputElement( 'register_type1' ).textContent = '';
  getHTMLInputElement( 'register_type2' ).value = '';
  getHTMLInputElement( 'register_type2' ).textContent = '';
  getHTMLInputElement( 'register_gender' ).innerHTML = '';
  getHTMLInputElement( 'register_ability' ).innerHTML = '';
  getHTMLInputElement( 'register_item' ).textContent = '';
  getHTMLInputElement( 'register_nature' ).value = 'てれや';

  natureTextToRadio()

  for ( const parameter of parameterSix ) {
    getHTMLInputElement( 'register_' + parameter + 'ActualValue' ).value = '120';
    getHTMLInputElement( 'register_' + parameter + 'BaseStatus' ).textContent = '100';
    getHTMLInputElement( 'register_' + parameter + 'IndividualValue' ).value = '31';
    getHTMLInputElement( 'register_' + parameter + 'EffortValue' ).value = '0';

    if ( parameter === 'hitPoint' ) {
      getHTMLInputElement( 'register_' + parameter + 'ActualValue' ).value = '175';
    }
  }
  getHTMLInputElement( 'remainingEffortValue' ).textContent = '510';

  for ( let i = 0; i < 4; i++ ) {
    getHTMLInputElement( 'registerMoveName' + i ).value = '';
    getHTMLInputElement( 'registerMoveType' + i ).textContent = '';
    getHTMLInputElement( 'registerMovePower' + i ).textContent = '';
    getHTMLInputElement( 'registerMoveAccuracy' + i ).textContent = '';
    getHTMLInputElement( 'registerMovePowerPoint' + i ).textContent = '';
    getHTMLInputElement( 'registerMovePowerPoint' + i ).value = '';
  }

  getHTMLInputElement( 'register_name' ).value = name;
}

// ポケモン名を入力した時に各パラメータを表示
function registrationPokemon(): void {

  const name: string = getHTMLInputElement( 'register_name' ).value;
  const pokemon: PokemonDataType | false = getPokemonDataByName( name );

  const type1HTML = getHTMLInputElement( 'register_type1' );
  const type2HTML = getHTMLInputElement( 'register_type2' );
  const genderHTML = getHTMLInputElement( 'register_gender' );
  const abilityHTML = getHTMLInputElement( 'register_ability' );

  // 存在しないポケモンの場合、処理を終了
  if ( pokemon === false ) {
    return;
  }

  // 現在の表示をリセット
  resetInputRegister();

  // タイプ表示
  type1HTML.textContent = pokemon.type1;
  type2HTML.textContent = pokemon.type2;
  type1HTML.value = pokemon.type1;
  type2HTML.value = pokemon.type2;

  // 性別表示
  genderHTML.innerHTML = '';
  for ( const gender of [ pokemon.gender1, pokemon.gender2 ] ) {
    if ( gender === '' ) {
      continue;
    }
    const option = document.createElement( 'option' );
    option.value = gender;
    option.textContent = gender;
    genderHTML.appendChild( option );
  }

  // 特性表示
  abilityHTML.innerHTML = '';
  for ( const ability of [ pokemon.ability1, pokemon.ability2, pokemon.ability3 ] ) {
    if ( ability === '' ) {
      continue;
    }
    const option = document.createElement( 'option' );
    option.value = ability;
    option.textContent = ability;
    abilityHTML.appendChild( option );
  }

  // 種族値表示
  const baseStatusList = getBaseStatusList( pokemon );
  for ( const parameter of Object.keys( baseStatusList ) ) {
    getHTMLInputElement( 'register_' + parameter + 'BaseStatus' ).textContent = String( baseStatusList[parameter] );
  }

  // 実数値表示
  reflectActualValueInHTML();

  // 技表示
  for ( let i = 0; i < 4; i++ ) {
    const moveHTML = getHTMLInputElement( 'registerMoveName' + i );
    moveHTML.innerHTML = '';

    // ブランクの選択肢
    const blunk = document.createElement( 'option' );
    blunk.value = '';
    blunk.textContent = '';
    moveHTML.appendChild(blunk);

    // ポケモンが覚える技
    for ( const move of moveData ) {
      const option = document.createElement( 'option' );
      option.value = move.name;
      option.textContent = move.name;
      moveHTML.appendChild(option);
    }
  }
}


// 実数値表示
function reflectActualValueInHTML(): void {

  const name: string = getHTMLInputElement( 'register_name' ).value;
  const level: number = Number( getHTMLInputElement( 'register_level' ).value );
  const pokemon: PokemonDataType | false = getPokemonDataByName( name );

  // 存在しないポケモンの場合、処理を終了
  if ( pokemon === false ) {
    return;
  }

  const nature: string = getHTMLInputElement( 'register_nature' ).value;
  const actualValueList: ParameterSixType = calculateActualValue( pokemon, level, nature );

  for ( const parameter of Object.keys( actualValueList ) ) {
    getHTMLInputElement( 'register_' + parameter + 'ActualValue' ).value = String( actualValueList[parameter] );
  }
}


// 実数値計算
function calculateActualValue( pokemon: PokemonDataType, level: number, natureString: string ): ParameterSixType {

  const baseStatusList: ParameterSixType = getBaseStatusList( pokemon );
  const nature: NatureDataType = getNatureDataByName( natureString );

  for ( const parameter of Object.keys( baseStatusList ) ) {
    const baseStatus: number = baseStatusList[parameter];
    const individualValue: number = Number( getHTMLInputElement( 'register_' + parameter + 'IndividualValue' ).value );
    const effortValue: number = Number( getHTMLInputElement( 'register_' + parameter + 'EffortValue' ).value );

    let actualValue: number = 0;

    const step1: number = baseStatus * 2 + individualValue + Math.floor( effortValue / 4 );
    const step2: number = step1 * level;

    actualValue = Math.floor( step2 / 100 );

    if ( parameter === 'hitPoint' ) {
      if ( pokemon.name === 'ヌケニン' ) {
        actualValue = 1;
      } else {
        actualValue += level + 10;
      }
    } else {
      let natureRate: number = 1.0;
      if ( nature.plus === nature.minus ) {
        natureRate = 1.0;
      } else if ( nature.plus === parameter ) {
        natureRate = 1.1;
      } else if ( nature.minus === parameter ) {
        natureRate = 0.9;
      }

      actualValue = Math.floor( ( actualValue + 5 ) * natureRate );
    }

    baseStatusList[parameter] = actualValue;
  }

  return baseStatusList;
}


// 技表示
function reflectMoveNatureInHTML( number: number ): void {

  const name: string = getHTMLInputElement( 'registerMoveName' + number ).value
  const move: MoveDataType | false = getMoveDataByName( name )

  // 存在しない技の場合、処理を終了
  if ( move === false ) {
    return;
  }

  getHTMLInputElement( 'registerMoveType' + number ).textContent = move.type;
  getHTMLInputElement( 'registerMovePower' + number ).textContent = String( move.power );
  getHTMLInputElement( 'registerMoveAccuracy' + number ).textContent = String( move.accuracy );
  getHTMLInputElement( 'registerMovePowerPoint' + number ).textContent = String( move.powerPoint );
  getHTMLInputElement( 'registerMovePowerPoint' + number ).value = String( move.powerPoint );
}


// 努力値：入力欄
function reflectRemainingEffortValueInHTML( targetParameter: string ): void {

  const remainingHTML = getHTMLInputElement( 'remainingEffortValue' );
  const targetHTML = getHTMLInputElement( 'register_' + targetParameter + 'EffortValue' );

  let sumEffortValue: number = 0;

  // 努力値の上限は252
  if ( Number( targetHTML.value ) > 252 ) {
    targetHTML.value = '252';
  }

  // 努力値の下限は0
  if ( Number( targetHTML.value ) < 0 ) {
    targetHTML.value = '0';
  }

  // 努力値の総和を計算
  for ( const parameter of parameterSix ) {
    const effortValue = getHTMLInputElement( 'register_' + parameter + 'EffortValue' );
    sumEffortValue += Number( effortValue.value );
  }

  // 努力値の総和の上限は510
  if ( sumEffortValue > 510 ) {
    const availableValue = 510 - sumEffortValue + Number( targetHTML.value );
    targetHTML.value = String( availableValue )
    remainingHTML.textContent = '0';
  } else {
    remainingHTML.textContent = String( 510 - sumEffortValue );
  }
}

// 努力値：0/252ボタン
function setEffortValue( parameter: string, number: number ): void {

  const effortValue = getHTMLInputElement( 'register_' + parameter + 'EffortValue' );

  effortValue.value = String( number );

  reflectRemainingEffortValueInHTML( parameter );
}

// 努力値：実数値からの逆算
function reflectEffortValueInHTML( parameter: string ): void {

  const name: string = getHTMLInputElement( 'register_name' ).value;
  const pokemon: PokemonDataType | false = getPokemonDataByName( name );

  // 存在しないポケモンの場合、処理を終了
  if ( pokemon === false ) {
    return;
  }

  const level: number = Number( getHTMLInputElement( 'register_level' ).value );
  const nature: NatureDataType = getNatureDataByName( parameter );
  const baseStatusList: ParameterSixType = getBaseStatusList( pokemon );
  const individualValue: number = Number( getHTMLInputElement( 'register_' + parameter + 'IndividualValue' ).value );
  const actualValue: number = Number( getHTMLInputElement( 'register_' + parameter + 'ActualValue' ).value );
  const effortValueHTML = getHTMLInputElement( 'register_' + parameter + 'EffortValue' );

  let effortValue: number = 0;
  let natureRate: number = 1.0;



  // ヌケニンのHP実数値は変更できない
  if ( pokemon.name === 'ヌケニン' && parameter === 'hitPoint' ) {
    reflectActualValueInHTML();
    return;
  }

  // 性格補正計算
  if ( nature.plus === nature.minus ) {
    natureRate = 1.0;
  } else if ( nature.plus === parameter ) {
    natureRate = 1.1;
  } else if ( nature.minus === parameter ) {
    natureRate = 0.9;
  }

  // 努力値計算
  for ( const targetParameter of Object.keys( baseStatusList ) ) {
    if ( targetParameter !== parameter ) {
      continue;
    }

    let step3: number = 0;
    if ( parameter === 'hitPoint' ) {
      step3 = actualValue - level - 10;
    } else {
      step3 = Math.ceil( actualValue / natureRate - 5 );
    }

    const step2: number = 100 * step3 / level;
    const step1: number = Math.ceil( step2 - 2 * baseStatusList[targetParameter] - individualValue );

    effortValue = 4 * step1;
  }

  // 努力値表示
  effortValueHTML.value = String( effortValue );
  reflectRemainingEffortValueInHTML( parameter );

  // 実数値再計算
  reflectActualValueInHTML();
}


// 性格：テキスト->ラジオボタン
function natureTextToRadio(): void {

  const natureString: string = getHTMLInputElement( 'register_nature' ).value
  const nature: NatureDataType = getNatureDataByName( natureString )

  if ( nature.isOK === false ) {
    return;
  }

  getHTMLInputElement( 'register_' + nature.plus + 'NaturePlus' ).checked = true;
  getHTMLInputElement( 'register_' + nature.minus + 'NatureMinus' ).checked = true;
}


// 性格：ラジオボタンー>テキスト
function natureRadioToText(): void {

  for ( const nature of natureData ) {
    const plus = getHTMLInputElement( 'register_' + nature.plus + 'NaturePlus' );
    const minus = getHTMLInputElement( 'register_' + nature.minus + 'NatureMinus' );
    const natureString = getHTMLInputElement( 'register_nature' )

    if ( plus.checked === true && minus.checked === true ) {
      natureString.value = nature.name
    }
  }
}


// PP変更
function changePowerPoint( number: number, direction: string ): void {

  const name: string = getHTMLInputElement( 'registerMoveName' + number ).value;
  const move: MoveDataType | false = getMoveDataByName( name );

  // 存在しない技の場合、処理を終了
  if ( move === false ) {
    return;
  }

  const powerPoint = getHTMLInputElement( 'registerMovePowerPoint' + number );
  const step: number = move.powerPoint / 5;
  const max: number = move.powerPoint + step * 3;

  let result: number = Number( powerPoint.textContent );




  // PPが1の技はPPを変更できない
  if ( move.powerPoint === 1 ) {
    return;
  }

  if ( direction === '▲' ) {
    result += step;
  } else if ( direction === '▼' ) {
    result -= step;
  }

  if ( result > max || result < move.powerPoint ) {
    return;
  }

  powerPoint.value = String( result );
  powerPoint.textContent = String( result );
}

// パーティ登録
function registerParty( number: number ): void {

  const name: string = getHTMLInputElement( 'register_name' ).value;
  const pokemon: PokemonDataType | false = getPokemonDataByName( name );
  const type1HTML = getHTMLInputElement( 'register_type1' );
  const type2HTML = getHTMLInputElement( 'register_type2' );
  const genderHTML = getHTMLInputElement( 'register_gender' );
  const abilityHTML = getHTMLInputElement( 'register_ability' );
  const levelHTML = getHTMLInputElement( 'register_level' );
  const itemHTML = getHTMLInputElement( 'register_item' );
  const natureHTML = getHTMLInputElement( 'register_nature' );
  const actualValue_hitPoint = getHTMLInputElement( 'register_hitPointActualValue' );

  // 存在しないポケモンの場合、処理を終了
  if ( pokemon === false ) {
    return;
  }

  // トレーナーネーム
  myAllParty[number].trainer = 'me';

  // 並び順
  myAllParty[number].order.party = number;
  myAllParty[number].order.hand = number;

  // 基本ステータス
  myAllParty[number].status.number = pokemon.number;
  myAllParty[number].status.name = pokemon.name;
  myAllParty[number].status.type1 = type1HTML.value;
  myAllParty[number].status.type2 = type2HTML.value;
  myAllParty[number].status.gender = genderHTML.value;
  myAllParty[number].status.ability = abilityHTML.value;
  myAllParty[number].status.level = Number( levelHTML.value );
  myAllParty[number].status.item = itemHTML.value;
  myAllParty[number].status.nature = natureHTML.value;
  myAllParty[number].status.height = pokemon.height;
  myAllParty[number].status.weight = pokemon.weight;
  myAllParty[number].status.remainingHP = Number( actualValue_hitPoint.value );

  // 実数値・種族値・個体値・努力値
  for ( const parameter of Object.keys( myAllParty[number].actualValue ) ) {
    const actualValue = getHTMLInputElement( 'register' + parameter + 'ActualValue' );
    const baseStatus = getHTMLInputElement( 'register' + parameter + 'BaseStatus' );
    const individualValue = getHTMLInputElement( 'register' + parameter + 'IndividualValue' );
    const effortValue = getHTMLInputElement( 'register' + parameter + 'EffortValue' );

    myAllParty[number].actualValue[parameter] = Number( actualValue.value );
    myAllParty[number].baseStatus[parameter] = Number( baseStatus.textContent );
    myAllParty[number].individualValue[parameter] = Number( individualValue.value );
    myAllParty[number].effortValue[parameter] = Number( effortValue.value );
  }

  // 技
  for ( let i = 0; i < 4; i++ ) {
    const moveName: string = getHTMLInputElement( 'registerMoveName' + i ).value;
    const move: MoveDataType | false = getMoveDataByName( moveName );
    const powerPoint = getHTMLInputElement( 'registerMovePowerPoint' + i );

    // 存在しない技の場合、処理を終了
    if ( move === false ) {
      continue;
    }

    myAllParty[number].move[i].name = move.name;
    myAllParty[number].move[i].type = move.type;
    myAllParty[number].move[i].category = move.category;
    myAllParty[number].move[i].power = move.power;
    myAllParty[number].move[i].accuracy = move.accuracy;
    myAllParty[number].move[i].remainingPP = Number( powerPoint.value );
    myAllParty[number].move[i].powerPoint = Number( powerPoint.value );
    myAllParty[number].move[i].isDirect = move.isDirect;
    myAllParty[number].move[i].isProtect = move.isProtect;
    myAllParty[number].move[i].target = move.target;
  }

  // 画面に表示
  showPartyPokemon( myAllParty[number] );

  // 登録画面リセット
  getHTMLInputElement( 'register_name' ).value = '';
  resetInputRegister();
}



// パーティ編集
function editParty( number: number ): void {

  if ( myAllParty[number].status.name === '' ) {
    return;
  }

  // 登録画面リセット
  getHTMLInputElement( 'register_name' ).value = '';
  resetInputRegister();

  // 編集するポケモンの名前をセット
  getHTMLInputElement( 'register_name' ).value = myAllParty[number].status.name;

  // 基本ステータス表示
  registrationPokemon()

  getHTMLInputElement( 'register_level' ).value = String( myAllParty[number].status.level );
  getHTMLInputElement( 'register_type1' ).value = myAllParty[number].status.type1;
  getHTMLInputElement( 'register_type1' ).textContent = myAllParty[number].status.type1;
  getHTMLInputElement( 'register_type2' ).value = myAllParty[number].status.type2;
  getHTMLInputElement( 'register_type2' ).textContent = myAllParty[number].status.type2;
  getHTMLInputElement( 'register_gender' ).value = myAllParty[number].status.gender;
  getHTMLInputElement( 'register_ability' ).value = myAllParty[number].status.ability;
  getHTMLInputElement( 'register_item' ).value = myAllParty[number].status.item;
  getHTMLInputElement( 'register_nature' ).value = myAllParty[number].status.nature;

  // 性格　ラジオボタン
  natureTextToRadio()

  // 個体値・努力値
  let remainingEffortValue: number = 510;
  for ( const parameter of Object.keys( myAllParty[number].actualValue ) ) {
    getHTMLInputElement( 'register' + parameter + 'IndividualValue' ).value = String( myAllParty[number].individualValue[parameter] );
    getHTMLInputElement( 'register' + parameter + 'EffortValue' ).value = String( myAllParty[number].effortValue[parameter] );
    remainingEffortValue -= myAllParty[number].effortValue[parameter];
  }
  getHTMLInputElement( 'remainingEffortValue' ).textContent = String( remainingEffortValue );

  // 実数値計算
  reflectActualValueInHTML()

  // 技
  for ( let i = 0; i < 4; i++ ) {
    if ( myAllParty[number].move[i].name === '' ) {
      continue;
    }
    getHTMLInputElement( 'registerMoveName' + i ).value = myAllParty[number].move[i].name;
    reflectMoveNatureInHTML( i );
    getHTMLInputElement( 'registerMovePowerPoint' + i ).textContent = String( myAllParty[number].move[i].powerPoint );
    getHTMLInputElement( 'registerMovePowerPoint' + i ).value = String( myAllParty[number].move[i].powerPoint );
  }

  // パーティ情報削除
  resetPartyPokemon( number );
}


function showPartyPokemon( pokemon: Pokemon ): void {

  const partyOrder: number = pokemon.order.party;
  const handOrder: number | false = pokemon.order.hand;
  const imageHTML = getHTMLInputElement( 'myParty_image' + partyOrder );

  if ( handOrder === false ) {
    return;
  }

  getHTMLInputElement( 'party' + handOrder + '_name' ).textContent = pokemon.status.name;
  getHTMLInputElement( 'party' + handOrder + '_gender' ).textContent = pokemon.status.gender;
  getHTMLInputElement( 'party' + handOrder + '_level' ).textContent = String( pokemon.status.level );
  getHTMLInputElement( 'party' + handOrder + '_type1' ).textContent = pokemon.status.type1;
  getHTMLInputElement( 'party' + handOrder + '_type2' ).textContent = pokemon.status.type2;
  getHTMLInputElement( 'party' + handOrder + '_statusAilment' ).textContent = pokemon.status.statusAilment;
  getHTMLInputElement( 'party' + handOrder + '_ability' ).textContent = pokemon.status.ability;
  getHTMLInputElement( 'party' + handOrder + '_remainingHP' ).textContent = String( pokemon.status.remainingHP );

  let item: string = '持ち物なし';
  if ( pokemon.status.item !== '' ) {
    item = pokemon.status.item;
  }
  getHTMLInputElement( 'party' + handOrder + '_item' ).textContent = item;

  // 実数値
  for ( const parameter of Object.keys( pokemon.actualValue ) ) {
    getHTMLInputElement( 'party' + handOrder + parameter ).textContent = String( pokemon.actualValue[parameter] );
  }

  // 実数値の性格による色
  const nature = getNatureDataByName( pokemon.status.nature );
  if ( nature.plus !== nature.minus ) {
    getHTMLInputElement( 'party' + handOrder + '_' + nature.plus ).style.color = 'red';
    getHTMLInputElement( 'party' + handOrder + '_' + nature.minus ).style.color = 'blue';
  }

  // 技
  for ( let i = 0; i < 4; i++ ) {
    getHTMLInputElement( 'party' + handOrder + '_move' + i ).textContent = pokemon.move[i].name;
    getHTMLInputElement( 'party' + handOrder + '_remainingPP' + i ).textContent = String( pokemon.move[i].remainingPP );
    getHTMLInputElement( 'party' + handOrder + '_powerPoint' + i ).textContent = String( pokemon.move[i].powerPoint );
  }

  // パーティ画像
  imageHTML.src = './pokemonImage/' + pokemon.status.number + '.png';
}


function resetPartyPokemon( number: number ): void {

  const partyOrder: number = myAllParty[number].order.party;
  const handOrder: number | false = myAllParty[number].order.hand;
  const imageHTML = getHTMLInputElement( 'myParty_image' + partyOrder );

  if ( handOrder === false ) {
    return;
  }

  // 表示のリセット
  getHTMLInputElement( 'party' + handOrder + '_name' ).textContent = '名前';
  getHTMLInputElement( 'party' + handOrder + '_gender' ).textContent = '性別';
  getHTMLInputElement( 'party' + handOrder + '_level' ).textContent = '';
  getHTMLInputElement( 'party' + handOrder + '_type1' ).textContent = 'タイプ';
  getHTMLInputElement( 'party' + handOrder + '_type2' ).textContent = '';
  getHTMLInputElement( 'party' + handOrder + '_statusAilment' ).textContent = '';
  getHTMLInputElement( 'party' + handOrder + '_ability' ).textContent = '特性';
  getHTMLInputElement( 'party' + handOrder + '_remainingHP' ).textContent = '';
  getHTMLInputElement( 'party' + handOrder + '_item' ).textContent = '持ち物';

  for ( const parameter of parameterSix ) {
    getHTMLInputElement( 'party' + handOrder + '_' + parameter ).textContent = '';
  }
  getHTMLInputElement( 'party' + handOrder + '_remainingHP' ).textContent = '';
  for ( const parameter of parameterFive ) {
    getHTMLInputElement( 'party' + handOrder + '_' + parameter ).style.color = 'black';
  }

  for ( let i = 0; i < 4; i++ ) {
    getHTMLInputElement( 'party' + handOrder + '_move' + i ).textContent = '技';
    getHTMLInputElement( 'party' + handOrder + '_remainingPP' + i ).textContent = '';
    getHTMLInputElement( 'party' + handOrder + '_powerPoint' + i ).textContent = 'PP';
  }

  // パーティ画像
  if ( myAllParty[number].status.name !== '' ) {
    imageHTML.src = './image/pokeBall.png';
  }

  // 内部情報リセット
  myAllParty[number] = new Pokemon;
}


// パーティランダムセット
function registerAllRandom(): void {

  for ( let i = 0; i < 6; i++ ) {
    // 登録欄
    const name: string = pokemonData[ Math.floor( Math.random() * pokemonData.length ) ].name;
    getHTMLInputElement( 'register_name' ).value = name;
    registrationPokemon();

    for ( let j = 0; j < 4; j++ ) {
      const move: string = moveData[ Math.floor( Math.random() * moveData.length ) ].name;
      getHTMLInputElement( 'registerMoveName' + j ).value = move;
      reflectMoveNatureInHTML( j );
    }

    // パーティ登録
    registerParty( i );
  }
}


// 選出
function electPokemon( number: number ): void {

  const targetText = getHTMLInputElement( 'electedOrder' + number );
  let electedCount: number = 0;

  // 既に選択済みなら処理なし
  if ( targetText.textContent !== '' ) {
    return;
  }

  // 選出済の数を数える
  for ( let i = 0; i < 6; i++ ) {
    const elect = getHTMLInputElement( 'electedOrder' + i );
    if ( elect.textContent !== '' ) {
      electedCount += 1;
    }
  }

  // 既に規定数選出済みなら処理なし
  if ( electedCount === fieldStatus.numberOfPokemon ) {
    return;
  }

  targetText.value = String( electedCount );
  targetText.textContent = String( electedCount + 1 ) + '番目';
}

// 選出取消
function quitElection( number: number ): void {

  const targetText = getHTMLInputElement( 'electedOrder' + number );
  const targetOrder = Number( targetText.textContent?.charAt(0) );

  // 選択していないなら処理なし
  if ( targetText.textContent === '' ) {
    return;
  }

  targetText.textContent = '';

  for ( let i = 0; i < 6; i++ ) {
    const otherText = getHTMLInputElement( 'electedOrder' + i );
    if ( otherText.textContent === '') {
      continue;
    }
    const otherOrder = Number( otherText.textContent?.charAt(0) )
    if ( otherOrder > targetOrder ) {
      otherText.textContent = String( otherOrder - 1 ) + '番目';
    }
  }
}


// コマンド欄の表示
function showCommand1stField(): void {

  for ( let i = 0; i < fieldStatus.battleStyle; i++ ) {

    for ( const pokemon of myParty ) {
      if ( pokemon.order.battle !== i + 1 ) {
        continue;
      }

      for ( let j = 0; j < 4; j++ ) {
        getHTMLInputElement( 'moveText_' + i + '_' + j ).textContent = pokemon.move[j].name;
      }
    }
  }
}
