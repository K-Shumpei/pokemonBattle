function isSuccess( pokemon: Pokemon ): boolean {

  // 「<ポケモン>の <技>!」のメッセージ。PPが減少することが確約される
  pokemon.declareMove();

  // 技のタイプが変わる。
  // 1. 技のタイプを変える特性
  if ( isAbility( pokemon, 'うるおいボイス' ) === true ) {
    if ( musicMoveList.includes( pokemon.moveUsed.name ) === true ) {
      pokemon.moveUsed.type = 'みず';
    }
  }
  if ( isAbility( pokemon, 'エレキスキン' ) === true ) {
    if ( pokemon.moveUsed.type === 'ノーマル' ) {
      pokemon.moveUsed.type = 'でんき';
    }
  }
  if ( isAbility( pokemon, 'スカイスキン' ) === true ) {
    if ( pokemon.moveUsed.type === 'ノーマル' ) {
      pokemon.moveUsed.type = 'ひこう';
    }
  }
  if ( isAbility( pokemon, 'ノーマルスキン' ) === true ) {
    pokemon.moveUsed.type = 'ノーマル';
  }
  if ( isAbility( pokemon, 'フェアリースキン' ) === true ) {
    if ( pokemon.moveUsed.type === 'ノーマル' ) {
      pokemon.moveUsed.type = 'フェアリー';
    }
  }
  if ( isAbility( pokemon, 'フリーズスキン' ) === true ) {
    if ( pokemon.moveUsed.type === 'ノーマル' ) {
      pokemon.moveUsed.type = 'こおり';
    }
  }
  // 2. タイプが変わる技の効果
  if ( pokemon.moveUsed.name === 'ウェザーボール' ) {
    if ( isWeather( pokemon, 'にほんばれ' ) === true ) pokemon.moveUsed.type = 'ほのお';
    if ( isWeather( pokemon, 'あめ' ) === true ) pokemon.moveUsed.type = 'みず';
    if ( isWeather( pokemon, 'すなあらし' ) === true ) pokemon.moveUsed.type = 'いわ';
    if ( isWeather( pokemon, 'あられ' ) === true ) pokemon.moveUsed.type = 'こおり';
  }
  if ( pokemon.moveUsed.name === 'だいちのはどう' ) {
    if ( isGrounded( pokemon ) === true && fieldStatus.terrain.name === 'エレキフィールド' ) pokemon.moveUsed.type = 'でんき';
    if ( isGrounded( pokemon ) === true && fieldStatus.terrain.name === 'グラスフィールド' ) pokemon.moveUsed.type = 'くさ';
    if ( isGrounded( pokemon ) === true && fieldStatus.terrain.name === 'サイコフィールド' ) pokemon.moveUsed.type = 'エスパー';
    if ( isGrounded( pokemon ) === true && fieldStatus.terrain.name === 'ミストフィールド' ) pokemon.moveUsed.type = 'フェアリー';
  }
  if ( pokemon.moveUsed.name === 'テクノバスター' ) {
    if ( isItem( pokemon, 'アクアカセット' ) === true ) pokemon.moveUsed.type = 'みず';
    if ( isItem( pokemon, 'イナズマカセット' ) === true ) pokemon.moveUsed.type = 'でんき';
    if ( isItem( pokemon, 'ブレイズカセット' ) === true ) pokemon.moveUsed.type = 'ほのお';
    if ( isItem( pokemon, 'フリーズカセット' ) === true ) pokemon.moveUsed.type = 'こおり';
  }
  // そうでん/プラズマシャワー状態

  // 技の対象が決まる。若い番号の対象が優先される。
  decideTarget( pokemon );

  // PPが適切な量引かれる
  pokemon.moveUsed.remainingPP -= 1;
  pokemon.move[pokemon.moveUsed.number].remainingPP -= 1;

  // ほのおタイプではないことによるもえつきるの失敗
  if ( pokemon.moveUsed.name === 'もえつきる' ) {
    if ( pokemon.status.type1 !== 'ほのお' && pokemon.status.type2 !== 'ほのお' ) {
      pokemon.moveUsed.failure();
    }
  }

  // おおあめ/おおひでりによるほのお/みず技の失敗
  if ( isWeather( pokemon, 'おおあめ' ) === true ) {
    if ( pokemon.moveUsed.type === 'ほのお' ) {
      return pokemon.moveUsed.failure();
    }
  }
  if ( isWeather( pokemon, 'おおひでり' ) === true ) {
    if ( pokemon.moveUsed.type === 'みず' ) {
      return pokemon.moveUsed.failure();
    }
  }

  // ふんじんによるほのお技の失敗とダメージ
  if ( pokemon.statusChange.powder.isTrue === true ) {
    if ( pokemon.moveUsed.type === 'ほのお' ) {
      return pokemon.moveUsed.failure();
    }
  }

  // 技の仕様による失敗
  // アイアンローラー: フィールドが無い
  if ( pokemon.moveUsed.name === 'アイアンローラー' ) {
    if ( fieldStatus.terrain.name === false ) {
      return pokemon.moveUsed.failure();
    }
  }
  // いじげんラッシュ/ダークホール/オーラぐるま: 使用者のポケモンの姿が適格でない
  if ( pokemon.moveUsed.name === 'ダークホール' ) {
    if ( pokemon.status.name !== 'ダークライ' ) {
      return pokemon.moveUsed.failure();
    }
  }
  if ( pokemon.moveUsed.name === 'オーラぐるま' ) {
    if ( pokemon.status.name !== 'モルペコ' ) {
      return pokemon.moveUsed.failure();
    }
  }
  // オーロラベール: あられ状態でない
  if ( pokemon.moveUsed.name === 'オーロラベール' ) {
    if ( isWeather( pokemon, 'あられ' ) === false && isWeather( pokemon, 'ゆき' ) === false ) {
      return pokemon.moveUsed.failure();
    }
  }
  // このゆびとまれ/いかりのこな: シングルバトルである
  if ( pokemon.moveUsed.name === 'このゆびとまれ' ) {
    if ( fieldStatus.battleStyle === 1 ) {
      return pokemon.moveUsed.failure();
    }
  }
  if ( pokemon.moveUsed.name === 'いかりのこな' ) {
    if ( fieldStatus.battleStyle === 1 ) {
      return pokemon.moveUsed.failure();
    }
  }
  // ソウルビート: 使用者のHPが足りない
  if ( pokemon.moveUsed.name === 'ソウルビート' ) {
    if ( pokemon.status.remainingHP <= Math.floor( pokemon.actualValue.hitPoint / 3 ) ) {
      return pokemon.moveUsed.failure();
    }
  }
  // たくわえる: たくわえるカウントがすでに3である
  if ( pokemon.moveUsed.name === 'たくわえる' ) {
    if ( pokemon.statusChange.stockpile.count === 3 ) {
      return pokemon.moveUsed.failure();
    }
  }
  // とっておき: 使用されてない技がある/覚えているわざにとっておきがない
  if ( pokemon.moveUsed.name === 'とっておき' ) {
    if ( pokemon.move[0].name !== 'とっておき' &&
      pokemon.move[1].name !== 'とっておき' &&
      pokemon.move[2].name !== 'とっておき' &&
      pokemon.move[3].name !== 'とっておき' ) {
      return pokemon.moveUsed.failure();
    }
  }
  // はきだす/のみこむ: たくわえるカウントが0である
  if ( pokemon.moveUsed.name === 'はきだす' ) {
    if ( pokemon.statusChange.stockpile.count === 0 ) {
      return pokemon.moveUsed.failure();
    }
  }
  if ( pokemon.moveUsed.name === 'のみこむ' ) {
    if ( pokemon.statusChange.stockpile.count === 0 ) {
      return pokemon.moveUsed.failure();
    }
  }
  // いびき/ねごと: 使用者がねむり状態でない
  if ( pokemon.moveUsed.name === 'いびき' ) {
    if ( pokemon.status.statusAilment !== 'ねむり' ) {
      return pokemon.moveUsed.failure();
    }
  }
  if ( pokemon.moveUsed.name === 'ねごと' ) {
    if ( pokemon.status.statusAilment !== 'ねむり' ) {
      return pokemon.moveUsed.failure();
    }
  }
  // ねむる
  if ( pokemon.moveUsed.name === 'ねむる' ) {
    if ( pokemon.status.remainingHP === pokemon.actualValue.hitPoint ) {
      return pokemon.moveUsed.failure();
    }
    if ( pokemon.status.statusAilment === 'ねむり' ) {
      return pokemon.moveUsed.failure();
    }
    if ( isAbility( pokemon, 'ふみん' ) === true ) {
      return pokemon.moveUsed.failure();
    }
    if ( isAbility( pokemon, 'やるき' ) === true ) {
      return pokemon.moveUsed.failure();
    }
  }


  // マックスレイドバトルでの失敗

  // 特性による失敗
  // しめりけ: 爆発技
  if ( explosionMoveList.includes( pokemon.moveUsed.name ) ) {
    for ( const target of allPokemonInBattlefield() ) {
      if ( isAbility( target, 'しめりけ' ) === true ) {
        target.status.declareAbility();
        return pokemon.moveUsed.failure();
      }
    }
  }
  // じょおうのいげん/ビビッドボディ: 優先度が高い技


  // へんげんじざい/リベロの発動
  if ( isAbility( pokemon, 'へんげんじざい' ) === true ) {
    if ( pokemon.status.type1 !== pokemon.moveUsed.type || pokemon.status.type2 !== '' ) {
      pokemon.status.declareAbility();
      pokemon.status.type1 = pokemon.moveUsed.type;
      pokemon.status.type2 = '';
    }
  }
  if ( isAbility( pokemon, 'リベロ' ) === true ) {
    if ( pokemon.status.type1 !== pokemon.moveUsed.type || pokemon.status.type2 !== '' ) {
      pokemon.status.declareAbility();
      pokemon.status.type1 = pokemon.moveUsed.type;
      pokemon.status.type2 = '';
    }
  }

  // マグニチュードの大きさ(威力)が決定
  if ( pokemon.moveUsed.name === 'マグニチュード' ) {
    const random: number = getRandom();
    let magnitude: number = 0;
    if ( random >= 0 ) {
      magnitude = 4;
      pokemon.moveUsed.power = 10;
    }
    if ( random >= 0.05 ) {
      magnitude = 5;
      pokemon.moveUsed.power = 30;
    }
    if ( random >= 0.15 ) {
      magnitude = 6;
      pokemon.moveUsed.power = 50;
    }
    if ( random >= 0.35 ) {
      magnitude = 7;
      pokemon.moveUsed.power = 70;
    }
    if ( random >= 0.65 ) {
      magnitude = 8;
      pokemon.moveUsed.power = 90;
    }
    if ( random >= 0.85 ) {
      magnitude = 9;
      pokemon.moveUsed.power = 110;
    }
    if ( random >= 0.95 ) {
      magnitude = 10;
      pokemon.moveUsed.power = 150;
    }
    writeLog( `マグニチュード${magnitude}!`);
  }

  return true;
}


// 技の対象が決まる。若い番号の対象が優先される。
function decideTarget( pokemon: Pokemon ): void {

  // フリーフォールによる対象

  // ちゅうもくのまと状態の敵

  // ひらいしん/よびみずのポケモン

  // カウンター/ミラーコート/メタルバーストの反射対象

  // ランダム1体が対象の技の対象
  if ( pokemon.moveUsed.target === 'ランダム1体' ) {
    // シングルバトルの時
    if ( fieldStatus.battleStyle === 1 ) {
      const target = new Target;
      target.trainer = 'opponent';
      target.battleNumber = 0;
      pokemon.target.push( target );
    }
  }

  if ( pokemon.target.length !== 0 ) return;

  // 技を選択した対象
  if ( fieldStatus.battleStyle === 1 ) {
    const target = new Target;
    target.trainer = 'opponent';
    target.battleNumber = 0;
    pokemon.target.push( target );
  }
}
