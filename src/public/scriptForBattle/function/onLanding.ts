function onActivateLandingEffect(): void {
  const event1a = ( pokemon: Pokemon ): void => {

  }

  const event1b = ( pokemon: Pokemon ): void => {
    const field: SideField = main.field.getSide( pokemon.isMine() )

    field.spikes.onEffective( pokemon );
    field.toxicSpikes.onEffective( pokemon );
    field.stealthRock.onEffective( pokemon );
    field.stickyWeb.onEffective( pokemon );
    field.steelsurge.onEffective( pokemon );
  }


  const landingPokemon: Pokemon[] = main.getPokemonOnLanding()
  for ( const pokemon of landingPokemon ) {
    // かがくへんかガスの発動
  }

  for ( const pokemon of landingPokemon ) {
    // きんちょうかん/じんばいったいの発動
  }

  for ( const pokemon of landingPokemon ) {
    // イベントブロック (その1) - 回復効果/設置技/特性/持ち物の発動
    event1a( pokemon ); // a. いやしのねがい/みかづきのまい/Zおきみやげ/Zすてゼリフによる回復
    event1b( pokemon ); // b. 設置技: 技が使用された順に発動
    pokemon.onActivateWhenLanding(); // c. 特性の効果

    // d. きのみ/きのみジュース/ふうせん/メンタルハーブ

  }

  for ( const pokemon of landingPokemon ) {
    // イベントブロック (その2) - 一部の特性/場の状態による持ち物/ゲンシカイキの発動
    // a. ぎたい/ぎょぐん/リミットシールド
    // b. エレキシード/グラスシード/サイコシード/ミストシード/ルームサービス
    // c. ゲンシカイキ[4]
  }

  for ( const pokemon of landingPokemon ) {
    // イベントブロック (その3) - 一部の特性/場の状態による持ち物
    // a. アイスフェイス/きょうえん/クォークチャージ/こだいかっせい/しれいとう/おもてなし/てんきや/フラワーギフト
    // b. ブーストエナジー
  }

  for ( const pokemon of landingPokemon ) {
    // かがくへんかガスの発動
  }

}
