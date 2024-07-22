class Weather {
  name: WeatherText = null;
  turn: number = 0;
  extend: boolean = false;
  strong: boolean = false;

  reset(): void {
    this.name = null;
    this.turn = 0;
    this.extend = false;
    this.strong = false;
  }

  isNoWeather(): boolean {
    return main.isExistAbility( 'Cloud Nine' ) || main.isExistAbility( 'Air Lock' ); // 特性「ノーてんき」、特性「エアロック」
  }

  isPlain(): boolean {
    return this.name === null || this.isNoWeather();
  }

  isSunny( pokemon: Pokemon ): boolean {
    if ( pokemon.isItem( 'ばんのうがさ' ) || this.isNoWeather() ) {
      return false;
    } else {
      return this.name === 'HarshSunlight';
    }
  }

  isRainy( pokemon: Pokemon ): boolean {
    if ( pokemon.isItem( 'ばんのうがさ' ) || this.isNoWeather() ) {
      return false;
    } else {
      return this.name === 'Rain';
    }
  }

  isSandy(): boolean {
    if ( this.isNoWeather() ) {
      return false;
    } else {
      return this.name === 'Sandstorm';
    }
  }

  isSnowy(): boolean {
    if ( this.isNoWeather() ) {
      return false;
    } else {
      return this.name === 'Hail';
    }
  }

  isBadSunny( pokemon: Pokemon ): boolean {
    if ( pokemon.isItem( 'ばんのうがさ' ) || this.isNoWeather() ) {
      return false;
    } else {
      return this.name === 'HarshSunlight' && this.strong === true;
    }
  }

  isBadRainy( pokemon: Pokemon ): boolean {
    if ( pokemon.isItem( 'ばんのうがさ' ) || this.isNoWeather() ) {
      return false;
    } else {
      return this.name === 'Rain' && this.strong === true;
    }
  }

  isTurbulence(): boolean {
    if ( this.isNoWeather() ) {
      return false;
    } else {
      return this.name === 'Turbulence';
    }
  }

  isGetSunny(): boolean {
    if ( this.name === 'HarshSunlight' ) return false;
    if ( this.strong ) return false;
    return true;
  }

  isGetRainy(): boolean {
    if ( this.name === 'Rain' ) return false;
    if ( this.strong ) return false;
    return true;
  }

  isGetSandy(): boolean {
    if ( this.name === 'Sandstorm' ) return false;
    if ( this.strong ) return false;
    return true;
  }

  isGetSnowy(): boolean {
    if ( this.name === 'Hail' ) return false;
    if ( this.strong ) return false;
    return true;
  }

  isGetBadSunny(): boolean {
    if ( this.name === 'HarshSunlight' && this.strong ) return false;
    return true;
  }

  isGetBadRainy(): boolean {
    if ( this.name === 'Rain' && this.strong ) return false;
    return true;
  }

  isGetTurbulence(): boolean {
    if ( this.name === 'Turbulence' && this.strong ) return false;
    return true;
  }

  getSunny( pokemon: Pokemon ): void {
    if ( !this.isGetSunny() ) return;

    this.reset()
    fieldStatus.weather.name = 'HarshSunlight';
    fieldStatus.weather.turn = 5;

    if ( pokemon.isItem( 'あついいわ' ) ) {
      fieldStatus.weather.turn = 8;
      fieldStatus.weather.extend = true;
    }

    battleLog.write( '日差しが 強くなった!' );

    this.onActivateWeatherEffect();
  }

  getRainy( pokemon: Pokemon ): void {
    if ( !this.isGetRainy() ) return;

    this.reset()
    fieldStatus.weather.name = 'Rain';
    fieldStatus.weather.turn = 5;

    if ( pokemon.isItem( 'しめったいわ' ) ) {
      fieldStatus.weather.turn = 8;
      fieldStatus.weather.extend = true;
    }

    battleLog.write( '雨が 降り始めた!' );

    this.onActivateWeatherEffect();
  }

  getSandy( pokemon: Pokemon ): void {
    if ( !this.isGetSandy() ) return;

    this.reset()
    fieldStatus.weather.name = 'Sandstorm';
    fieldStatus.weather.turn = 5;

    if ( pokemon.isItem( 'さらさらいわ' ) ) {
      fieldStatus.weather.turn = 8;
      fieldStatus.weather.extend = true;
    }

    battleLog.write( '砂あらしが 吹き始めた!' );

    this.onActivateWeatherEffect();
  }

  getSnowy( pokemon: Pokemon ): void {
    if ( !this.isGetSnowy() ) return;

    this.reset()
    fieldStatus.weather.name = 'Hail';
    fieldStatus.weather.turn = 5;

    if ( pokemon.isItem( 'つめたいいわ' ) ) {
      fieldStatus.weather.turn = 8;
      fieldStatus.weather.extend = true;
    }

    battleLog.write( '雪が 降り始めた!' );

    this.onActivateWeatherEffect();
  }

  getBadSunny(): void {
    if ( !this.isGetBadSunny() ) return;

    this.reset()
    fieldStatus.weather.name = 'HarshSunlight';
    fieldStatus.weather.strong = true;

    battleLog.write( '日差しが とても強くなった!' );
  }

  getBadRainy(): void {
    if ( !this.isGetBadRainy() ) return;

    this.reset()
    fieldStatus.weather.name = 'Rain';
    fieldStatus.weather.strong = true;

    battleLog.write( '強い雨が 降り始めた!' );
  }

  getTurbulence(): void {
    if ( !this.isGetTurbulence() ) return;

    this.reset()
    fieldStatus.weather.name = 'Turbulence'
    fieldStatus.weather.strong = true;

    battleLog.write( '謎の乱気流が ひこうポケモンを 護る!' );
  }

  advance(): void {
    if ( this.turn === 0 ) return;

    this.turn -= 1;

    if ( this.turn > 0 ) return;

    switch ( this.name ) {
      case 'HarshSunlight':
        battleLog.write( '日差しが 元に戻った!' );
        break;

      case 'Rain':
        battleLog.write( '雨が 上がった!' );
        break;

      case 'Sandstorm':
        battleLog.write( '砂あらしが おさまった!' );
        break;

      case 'Hail':
        battleLog.write( '雪が 止んだ!' );
        break;

      default:
        ;
    }

    this.reset();
    this.onActivateWeatherEffect();
  }

  onActivateSandstorm( pokemon: Pokemon ): void {
    if ( !this.isSandy() ) return;
    if ( pokemon.ability.isName( 'Overcoat' ) ) return; // 特性「ぼうじん」
    if ( pokemon.isItem( 'ぼうじんゴーグル' ) ) return;
    if ( pokemon.stateChange.dig.isTrue ) return;
    if ( pokemon.stateChange.dive.isTrue ) return;
    if ( pokemon.type.has( 'Rock' ) ) return;
    if ( pokemon.type.has( 'Ground' ) ) return;
    if ( pokemon.type.has( 'Steel' ) ) return;
    if ( pokemon.ability.isName( 'Sand Veil' ) ) return; // 特性「すながくれ」
    if ( pokemon.ability.isName( 'Sand Rush' ) ) return; // 特性「すなかき」
    if ( pokemon.ability.isName( 'Sand Force' ) ) return; // 特性「すなのちから」

    const damage: number = Math.floor( pokemon.getOrgHP() / 16 );
    pokemon.status.hp.value.add( Math.max( 1, damage ) );
    battleLog.write( `砂あらしが ${pokemon.getArticle()}を 襲う!` );
  }

  isEffectiveBadRainy( pokemon: Pokemon ): boolean {
    if ( !this.isBadRainy( pokemon ) ) return false;
    if ( pokemon.move.selected.isStatus() ) return false;
    if ( pokemon.move.selected.type !== 'Fire' ) return false;

    pokemon.attack.reset();
    battleLog.write( `強い雨の 影響で ほのおタイプの 攻撃が 消失した!` );
    return true;
  }

  isEffectiveBadSunny( pokemon: Pokemon ): boolean {
    if ( !this.isBadSunny( pokemon ) ) return false;
    if ( pokemon.move.selected.isStatus() ) return false;
    if ( pokemon.move.selected.type !== 'Water' ) return false;

    pokemon.attack.reset();
    battleLog.write( `強い日差しの 影響で みずタイプの 攻撃が 蒸発した!` );
    return true;
  }


  // 天候が変化した時に発動する効果
  onActivateWeatherEffect(): void {
    // 特性「てんきや」
    for ( const poke of getPokemonInBattlefield( 'actionOrder' ) ) {
      this.onActivateForecast( poke );
    }

    // 特性「フラワーギフト」
    for ( const pokemon of getPokemonInBattlefield( 'speed' ) ) {
      this.onActivateFlowerGift( pokemon );
    }

    // 特性「アイスフェイス」
    for ( const poke of getPokemonInBattlefield( 'originalSpeed' ) ) {
      this.onActivateIceFace( poke );
    }

    // 特性「こだいかっせい」発動
    for ( const pokemon of getPokemonInBattlefield( 'speed' ) ) {
      this.onActivateProtosynthesis( pokemon );
    }

    // 特性「こだいかっせい」消失
    for ( const pokemon of getPokemonInBattlefield( 'speed' ) ) {
      this.onRemoveProtosynthesis( pokemon );
    }
  }

  onActivateIceFace( pokemon: Pokemon ): void {
    if ( !this.isSnowy() ) return;
    if ( !pokemon.ability.isName( 'Ice Face' ) ) return;
    if ( pokemon.name !== 'Eiscue Noice' ) return;

    pokemon.formChange();
  }

  onActivateProtosynthesis( pokemon: Pokemon ): void {
    if ( !pokemon.ability.isName( 'Protosynthesis' ) ) return;
    if ( !pokemon.stateChange.protosynthesis.isTrue ) return;

    if ( main.field.weather.name === 'HarshSunlight' ) {
      pokemon.stateChange.quarkDrive.onActivate( pokemon, false );
    } else if ( pokemon.item.isName( 'ブーストエナジー' ) ) {
      pokemon.stateChange.quarkDrive.onActivate( pokemon, true );
    }
  }

  onRemoveProtosynthesis( pokemon: Pokemon ): void {
    pokemon.stateChange.protosynthesis.onRemove( pokemon );
  }

  onActivateForecast( pokemon: Pokemon ): void {
    if ( !pokemon.ability.isName( 'Forecast' ) ) return;
    pokemon.formChange();
  }

  onActivateFlowerGift( pokemon: Pokemon ): void {
    if ( !pokemon.ability.isName( 'Flower Gift' ) ) return;
    if ( !this.isSunny( pokemon ) ) return;
  }
}

class Terrain {
  name: TerrainText = null;
  turn: number = 0;
  extend: boolean = false;

  resetWithMessage(): void {
    if ( this.isElectric() ) battleLog.write( `足下の 電気が 消え去った!` );
    if ( this.isGrassy() ) battleLog.write( `足下の 草が 消え去った!` );
    if ( this.isMisty() ) battleLog.write( `足下の 霧霧が 消え去った!` );
    if ( this.isPsychic() ) battleLog.write( `足下の 不思議感が 消え去った!` );
    this.reset();
    this.onActivateTerrainEffect();
  }

  reset(): void {
    this.name = null;
    this.turn = 0;
    this.extend = false;
  }

  setExtend( pokemon: Pokemon ): void {
    if ( pokemon.isItem( 'グランドコート' ) ) {
      this.turn = 8;
      this.extend = true;
    } else {
      this.turn = 5;
      this.extend = false;
    }
  }

  getElectric( pokemon: Pokemon ): void {
    this.reset();
    this.name = 'electric';
    this.setExtend( pokemon );
    battleLog.write( `足下に 電気が かけめぐる!` );
    this.onActivateTerrainEffect();
  }

  getGrassy( pokemon: Pokemon ): void {
    this.reset();
    this.name = 'grassy';
    this.setExtend( pokemon );
    battleLog.write( `足下に 草がおいしげった!` );
    this.onActivateTerrainEffect();
  }

  getMisty( pokemon: Pokemon ): void {
    this.reset();
    this.name = 'misty';
    this.setExtend( pokemon );
    battleLog.write( `足下に 霧が立ち込めた!` );
    this.onActivateTerrainEffect();
  }

  getPsychic( pokemon: Pokemon ): void {
    this.reset();
    this.name = 'psychic';
    this.setExtend( pokemon );
    battleLog.write( `足下が 不思議な感じに なった!` );
    this.onActivateTerrainEffect();
  }

  isElectric(): boolean {
    return this.name === 'electric';
  }

  isGrassy(): boolean {
    return this.name === 'grassy';
  }

  isMisty(): boolean {
    return this.name === 'misty';
  }

  isPsychic(): boolean {
    return this.name === 'psychic';
  }

  isPlain(): boolean {
    return this.name === null;
  }

  onElapse(): void {
    if ( this.name === null ) return;
    this.turn -= 1;
    if ( this.turn === 0 ) {
      this.resetWithMessage();
    }
  }

  onActivateGrassy( pokemon: Pokemon ): void {
    if ( this.name !== 'grassy' ) return;
    if ( !pokemon.isGround() ) return;
    const heal: number = Math.floor( pokemon.getOrgHP() / 16 );
    pokemon.status.hp.value.add( Math.max( 1, heal ) );
    battleLog.write( `${pokemon.getArticle()}の 体力が 回復した!` );
  }

  // フィールドが変化した時に発動する効果
  onActivateTerrainEffect(): void {
    // もちもの「シード系」
    for ( const poke of getPokemonInBattlefield( 'speed' ) ) {
      this.onActivateSeed( poke );
    }

    // 特性「ぎたい」
    for ( const poke of getPokemonInBattlefield( 'speed' ) ) {
      this.onActivateMimicry( poke );
    }

    // 特性「クォークチャージ」発動
    for ( const pokemon of getPokemonInBattlefield( 'speed' ) ) {
      this.onActivateQuarkDrive( pokemon );
    }

    // 特性「クォークチャージ」消失
    for ( const pokemon of getPokemonInBattlefield( 'speed' ) ) {
      this.onRemoveQuarkDrive( pokemon );
    }
  }

  onActivateMimicry( pokemon: Pokemon ): void {
    if ( !pokemon.ability.isName( 'Mimicry' ) ) return; // 特性「ぎたい」

    if ( this.isElectric() && !pokemon.type.isOnly( 'Electric' ) ) {
      pokemon.msgDeclareAbility();
      pokemon.type.toType( 'Electric' );
    }

    if ( this.isGrassy() && !pokemon.type.isOnly( 'Grass' ) ) {
      pokemon.msgDeclareAbility();
      pokemon.type.toType( 'Grass' );
    }

    if ( this.isMisty() && !pokemon.type.isOnly( 'Fairy' ) ) {
      pokemon.msgDeclareAbility();
      pokemon.type.toType( 'Fairy' );
    }

    if ( this.isPsychic() && !pokemon.type.isOnly( 'Psychic' ) ) {
      pokemon.msgDeclareAbility();
      pokemon.type.toType( 'Psychic' );
    }

    if ( this.isPlain() && pokemon.type.get() !== pokemon.type.org ) {
      pokemon.msgDeclareAbility();
      // battleLog.write( `${pokemon.getArticle()}の タイプが 元に戻った!` );
      pokemon.type.toOrg();
    }
  }

  onActivateSeed( pokemon: Pokemon ): void {
    if ( pokemon.item.isName( 'エレキシード' ) && this.isElectric() ) {
      if ( pokemon.isChangeRank( 'def', 1 ) ) {
        pokemon.changeRank( 'def', 1, 'エレキシード' );
        pokemon.consumeItem();
      }
    }
    if ( pokemon.item.isName( 'グラスシード' ) && this.isGrassy() ) {
      if ( pokemon.isChangeRank( 'def', 1 ) ) {
        pokemon.changeRank( 'def', 1, 'グラスシード' );
        pokemon.consumeItem();
      }
    }
    if ( pokemon.item.isName( 'ミストシード' ) && this.isMisty() ) {
      if ( pokemon.isChangeRank( 'spD', 1 ) ) {
        pokemon.changeRank( 'spD', 1, 'ミストシード' );
        pokemon.consumeItem();
      }
    }
    if ( pokemon.item.isName( 'サイコシード' ) && this.isPsychic() ) {
      if ( pokemon.isChangeRank( 'spD', 1 ) ) {
        pokemon.changeRank( 'spD', 1, 'サイコシード' );
        pokemon.consumeItem();
      }
    }
  }

  onActivateQuarkDrive( pokemon: Pokemon ): void {
    if ( !pokemon.ability.isName( 'Quark Drive' ) ) return;
    if ( !pokemon.stateChange.quarkDrive.isTrue ) return;

    if ( main.field.terrain.isElectric() ) {
      pokemon.stateChange.quarkDrive.onActivate( pokemon, false );
    } else if ( pokemon.item.isName( 'ブーストエナジー' ) ) {
      pokemon.stateChange.quarkDrive.onActivate( pokemon, true );
    }
  }

  onRemoveQuarkDrive( pokemon: Pokemon ): void {
    pokemon.stateChange.quarkDrive.onRemove( pokemon );
  }

}


class WholeFieldStatus {
  isTrue = false;
  turn = new ValueWithRange();

  reset(): void {
    this.isTrue = false;
    this.turn.value = this.turn.max;
  }
}

class Gravity extends WholeFieldStatus {

  constructor() {
    super();
    this.turn.setInitial( 5 );
  }

  onActivate(): void {
    this.isTrue = true;
    battleLog.write( `じゅうりょくが 強くなった!` );
    this.msgDrop();
  }

  onElapse(): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      battleLog.write( `じゅうりょくが 元に戻った! ` );
    }
  }

  msgDrop(): void {
    for ( const pokemon of getPokemonInBattlefield( 'eachLeft' ) ) {
      if ( !pokemon.isGround() ) {
        battleLog.write( `${pokemon.getArticle()}は じゅうりょくの 影響で 空中に いられなくなった!` );
      }
    }
  }

  isEffective( pokemon: Pokemon ): boolean {
    if ( !this.isTrue ) return false;
    if ( !pokemon.move.selected.getMaster().gravity ) return false;

    battleLog.write( `${pokemon.getArticle()}は じゅうりょくが 強くて ${pokemon.move.selected.translate()}が 出せない!` );
    return true;
  }
}

class TrickRoom extends WholeFieldStatus {

  constructor() {
    super();
    this.turn.setInitial( 5 );
  }

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は 時空を ゆがめた!` );

    for ( const poke of getPokemonInBattlefield( 'originalSpeed' ) ) {
      this.onActivateRoomService( poke );
    }
  }

  onElapse(): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      battleLog.write( `ゆがんだ 時空が 元に戻った! ` );
    }
  }

  onActivateRoomService( pokemon: Pokemon ): void {
    if ( !pokemon.item.isName( 'ルームサービス' ) ) return;
    if ( !this.isTrue ) return;
    if ( !pokemon.isChangeRank( 'spe', -1 ) ) return;

    pokemon.changeRank( 'spe', -1 );
    pokemon.consumeItem();
  }
}

class MagicRoom extends WholeFieldStatus {

  constructor() {
    super();
    this.turn.setInitial( 5 );
  }

  onActivate(): void {
    this.isTrue = true;
    battleLog.write( `持たせた 道具の 効果が なくなる 空間を 作りだした!` );
  }

  onElapse(): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      battleLog.write( `マジックルームが 解除され 道具の 効果が 元に戻った! ` );
    }
  }
}

class WonderRoom extends WholeFieldStatus {

  constructor() {
    super();
    this.turn.setInitial( 5 );
  }

  onActivate(): void {
    this.isTrue = true;
    battleLog.write( `防御と 特防が 入れ替わる 空間を 作りだした!` );
  }

  onElapse(): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      battleLog.write( `ワンダールームが 解除され 防御と 特防が 元に戻った! ` );
    }
  }
}

class MudSport extends WholeFieldStatus {

  constructor() {
    super();
    this.turn.setInitial( 5 );
  }

  onActivate(): void {
    this.isTrue = true;
    battleLog.write( `電気の威力が 弱まった!` );
  }

  onElapse(): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      battleLog.write( `どろあそびの 効果が なくなった! ` );
    }
  }
}

class WaterSport extends WholeFieldStatus {

  constructor() {
    super();
    this.turn.setInitial( 5 );
  }

  onActivate(): void {
    this.isTrue = true;
    battleLog.write( `炎の威力が 弱まった!` );
  }

  onElapse(): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      battleLog.write( `みずあそびの 効果が なくなった! ` );
    }
  }
}

class FairyLock extends WholeFieldStatus {

  onActivate(): void {
    this.isTrue = true;
    battleLog.write( `次のターンは 逃げられない!` );
  }
}

class IonDeluge extends WholeFieldStatus {

  onActivate(): void {
    this.isTrue = true;
    battleLog.write( `電子のシャワーが 降りそそいだ!` );
  }
}


class WholeField {

  trickRoom  = new TrickRoom();  // トリックルーム
  magicRoom  = new MagicRoom();  // マジックルーム
  wonderRoom = new WonderRoom(); // ワンダールーム
  gravity    = new Gravity();    // じゅうりょく
  mudSport   = new MudSport();   // どろあそび
  waterSport = new WaterSport(); // みずあそび
  fairyLock  = new FairyLock();  // フェアリーロック
  ionDeluge  = new IonDeluge();  // プラズマシャワー
}



class SideFieldStatus {
  isTrue = false;
  turn   = new ValueWithRange();
  count  = 0;

  constructor (
    readonly isMine: boolean
  ) {}

  getText(): string {
    if ( this.isMine ) {
      return `味方`;
    } else {
      return `相手`;
    }
  }

  reset(): void {
    this.isTrue = false;
    this.turn.toZero();
    this.count = 0;
  }
}

class AuroraVeil extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn.setInitial( 5 );
  }

  onActivate( isLightClay: boolean ): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    if ( isLightClay ) {
      this.turn.setInitial( 8 );
    }
    battleLog.write( `${this.getText()}は オーロラベールで 物理と 特殊に 強くなった!` );
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    battleLog.write( `${this.getText()}の オーロラベールが なくなった!` );
  }

  onElapse(): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.onRemove();
    }
  }
}

class LightScreen extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn.setInitial( 5 );
  }

  onActivate( isLightClay: boolean ): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    if ( isLightClay ) {
      this.turn.setInitial( 8 );
    }
    battleLog.write( `${this.getText()}は ひかりのかべで 特殊に 強くなった!` );
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    battleLog.write( `${this.getText()}の ひかりのかべが なくなった!` );
  }

  onElapse(): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.onRemove();
    }
  }
}

class Reflect extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn.setInitial( 5 );
  }

  onActivate( isLightClay: boolean ): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    if ( isLightClay ) {
      this.turn.setInitial( 8 );
    }
    battleLog.write( `${this.getText()}は リフレクターで 物理に 強くなった!` );
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    battleLog.write( `${this.getText()}の リフレクターが なくなった!` );
  }

  onElapse(): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.onRemove();
    }
  }
}


class TailWind extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn.setInitial( 4 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    battleLog.write( `${this.getText()}に 追い風が 吹き始めた!` );
  }

  onElapse(): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      battleLog.write( `${this.getText()}の 追い風が 止んだ!` );
    }
  }
}

class LuckyChant extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn.setInitial( 5 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    battleLog.write( `おまじないの 力で ${this.getText()}の 急所が 隠れた!` );
  }

  onElapse(): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      // battleLog.write( `${this.getText()}の !` );
    }
  }
}

class Mist extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn.setInitial( 5 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    battleLog.write( `${this.getText()}は 白い霧に 包まれた!` );
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    battleLog.write( `${this.getText()}の 白い霧が なくなった!` );
  }

  onElapse(): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.onRemove();
    }
  }
}

class Safeguard extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn.setInitial( 5 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    battleLog.write( `${this.getText()}は 神秘の守りに 包まれた!` );
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    battleLog.write( `${this.getText()}の 神秘の守りが なくなった!` );
  }
}

class MatBlock extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
  }

  onActivate( pokemon: Pokemon ): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    battleLog.write( `${pokemon.getArticle()}は たたみがえしを 狙っている!` );
  }
}

class CraftyShield extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    battleLog.write( `${this.getText()}の 周りを トリックガードが 守っている!` );
  }
}

class QuickGuard extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    battleLog.write( `${this.getText()}の 周りを ファストガードが 守っている!` );
  }
}

class WideGuard extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    battleLog.write( `${this.getText()}の 周りを ワイドガードが 守っている!` );
  }
}

class Rainbow extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn.setInitial( 4 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    battleLog.write( `${this.getText()}の 空に 虹が かかった!` );
  }

  onElapse(): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      battleLog.write( `${this.getText()}の 虹が 消え去った!` );
    }
  }
}

class Wetlands extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn.setInitial( 4 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    battleLog.write( `${this.getText()}の 周りに 湿原が 広がった!` );
  }

  onElapse(): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      battleLog.write( `${this.getText()}の 湿原が 消え去った!` );
    }
  }
}

class SeaOfFire extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn.setInitial( 4 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    battleLog.write( `${this.getText()}の 周りが 火の海に 包まれた!` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( pokemon.type.has( 'Fire' ) ) return;
    const damage: number = Math.floor( pokemon.getOrgHP() / 8 );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    battleLog.write( `${pokemon.getArticle()}は 火の海の ダメージを受けた!` );
  }

  onElapse(): void {
    if ( !this.isTrue ) return;
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      battleLog.write( `${this.getText()}の 周りの 火の海が 消え去った!` );
    }
  }
}

class StealthRock extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    battleLog.write( `${this.getText()}の 周りに とがった岩が ただよい始めた! `);
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    battleLog.write( `${this.getText()}の 周りの ステルスロックが 消え去った! ` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( pokemon.isItem( 'あつぞこブーツ' ) ) return;
    const damage: number = Math.floor( pokemon.status.hp.value.max * pokemon.type.getCompatibility( 'Rock' ) / 8 );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    battleLog.write( `${pokemon.getArticle()}は とがった岩が 食いこんだ!` );
  }
}

class ToxicSpikes extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
  }

  onActivate(): void {
    if ( this.count === 2 ) return;
    this.isTrue = true;
    this.count += 1;
    battleLog.write( `${this.getText()}の 足元に どくびしが 散らばった!` );
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    battleLog.write( `${this.getText()}の 足元の どくびしが 消え去った!` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( !pokemon.isGround() ) return;
    if ( pokemon.isItem( 'あつぞこブーツ' ) ) return;
    if ( !pokemon.isGetAilmentByOther( 'Poisoned', pokemon ) ) return;

    if ( this.count === 1 ) {
      pokemon.statusAilment.getPoisoned();
    }

    if ( this.count === 2 ) {
      pokemon.statusAilment.getBadPoisoned();
    }
  }
}

class StickyWeb extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    battleLog.write( `${this.getText()}の 足元に ねばねばネットが 広がった!` );
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    battleLog.write( `${this.getText()}の 足元の ねばねばネットが 消え去った!` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( !pokemon.isGround() ) return;
    if ( pokemon.isItem( 'あつぞこブーツ' ) ) return;
    if ( !pokemon.isChangeRank( 'spe', -1 ) ) return;

    battleLog.write( `${this.getText()}は ねばねばネットに ひっかかった!` );
    pokemon.changeRank( 'spe', -1 );
  }
}

class Spikes extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
  }

  onActivate(): void {
    if ( this.count === 3 ) return;
    this.isTrue = true;
    this.count += 1;
    battleLog.write( `${this.getText()}の 足元に まきびしが 散らばった!` );
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    battleLog.write( `${this.getText()}の 足元の まきびしが 消え去った!` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( !pokemon.isGround() ) return;
    if ( pokemon.isItem( 'あつぞこブーツ' ) ) return;
    const damage: number = Math.floor( pokemon.status.hp.value.max / ( 10 - this.count * 2 ) );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    battleLog.write( `${pokemon.getArticle()}は まきびしの ダメージを受けた!` );
  }
}

class Steelsurge extends SideFieldStatus { // テキスト未検証

  constructor ( isMine: boolean ) {
    super( isMine )
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    battleLog.write( `${this.getText()}の 周りに とがった はがねが ただよい始めた! `);
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    battleLog.write( `${this.getText()}の 周りの キョダイコウジンが 消え去った! ` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( pokemon.isItem( 'あつぞこブーツ' ) ) return;
    const damage: number = Math.floor( pokemon.status.hp.value.max * pokemon.type.getCompatibility( 'Steel' ) / 8 );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    battleLog.write( `${pokemon.getArticle()}は とがった はがねが 食いこんだ!` );
  }
}

class Wildfire extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine );
    this.turn.setInitial( 4 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    battleLog.write( `${this.getText()}の ポケモンが 炎に 包まれた! `);
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( pokemon.type.has( 'Fire' ) ) return;
    const damage: number = Math.floor( pokemon.getOrgHP() / 6 );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    battleLog.write( `${pokemon.getArticle()}は キョダイゴクエンの 炎に 包まれていて 熱い!` );
  }

  onElapse(): void {
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
    }
  }
}

class Volcalith extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn.setInitial( 4 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    battleLog.write( `${this.getText()}の ポケモンが 岩に 囲まれた! `);
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( pokemon.type.has( 'Rock' ) ) return;
    const damage: number = Math.floor( pokemon.getOrgHP() / 6 );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    battleLog.write( `${pokemon.getArticle()}は キョダイフンセキの 岩に 囲まれていて 痛い!` );
  }

  onElapse(): void {
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
    }
  }
}

class VineLash extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn.setInitial( 4 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    battleLog.write( `${this.getText()}の ポケモンが ムチの 猛打に 包まれた! `);
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( pokemon.type.has( 'Grass' ) ) return;
    const damage: number = Math.floor( pokemon.getOrgHP() / 6 );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    battleLog.write( `${pokemon.getArticle()}は キョダイベンタツの 猛打に さらされていて 痛い!` );
  }

  onElapse(): void {
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
    }
  }
}

class Cannonade extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn.setInitial( 4 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    battleLog.write( `${this.getText()}の ポケモンが 水の 流れに 包まれた! `);
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( pokemon.type.has( 'Water' ) ) return;
    const damage: number = Math.floor( pokemon.getOrgHP() / 6 );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    battleLog.write( `${pokemon.getArticle()}は キョダイホウゲキの 流れに 飲みこまれていて 苦しい!` );
  }

  onElapse(): void {
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
    }
  }
}



class SideField {
  _host: boolean;
  _isMine: boolean;

  // 味方の場に発生
  auroraVeil:   AuroraVeil;   // オーロラベール
  lightScreen:  LightScreen;  // ひかりのかべ
  reflect:      Reflect;      // リフレクター
  tailwind:     TailWind;     // おいかぜ
  luckyChant:   LuckyChant;   // おまじない
  mist:         Mist;         // しろいきり
  safeguard:    Safeguard;    // しんぴのまもり
  matBlock:     MatBlock;     // たたみがえし
  craftyShield: CraftyShield; // トリックガード
  quickGuard:   QuickGuard;   // ファストガード
  wideGuard:    WideGuard;    // ワイドガード
  rainbow:      Rainbow;      // にじ

  // 相手の場に発生
  stealthRock:  StealthRock;  // ステルスロック
  toxicSpikes:  ToxicSpikes;  // どくびし
  stickyWeb:    StickyWeb;    // ねばねばネット
  spikes:       Spikes;       // まきびし
  steelsurge:   Steelsurge;   // キョダイコウジン
  wildfire:     Wildfire;     // キョダイゴクエン
  volcalith:    Volcalith;    // キョダイフンセキ
  vineLash:     VineLash;     // キョダイベンタツ
  cannonade:    Cannonade;    // キョダイホウゲキ
  wetlands:     Wetlands;     // しつげん
  seaOfFire:    SeaOfFire;    // ひのうみ

  constructor( isMine: boolean ) {
    this._host = true;
    this._isMine = isMine;

    this.auroraVeil   = new AuroraVeil( isMine );
    this.lightScreen  = new LightScreen( isMine );
    this.reflect      = new Reflect( isMine );
    this.tailwind     = new TailWind( isMine );
    this.luckyChant   = new LuckyChant( isMine );
    this.mist         = new Mist( isMine );
    this.safeguard    = new Safeguard( isMine );
    this.matBlock     = new MatBlock( isMine );
    this.craftyShield = new CraftyShield( isMine );
    this.quickGuard   = new QuickGuard( isMine );
    this.wideGuard    = new WideGuard( isMine );
    this.rainbow      = new Rainbow( isMine );

    this.stealthRock  = new StealthRock( isMine );
    this.toxicSpikes  = new ToxicSpikes( isMine );
    this.stickyWeb    = new StickyWeb( isMine );
    this.spikes       = new Spikes( isMine );
    this.steelsurge   = new Steelsurge( isMine );
    this.wildfire     = new Wildfire( isMine );
    this.volcalith    = new Volcalith( isMine );
    this.vineLash     = new VineLash( isMine );
    this.cannonade    = new Cannonade( isMine );
    this.wetlands     = new Wetlands( isMine );
    this.seaOfFire    = new SeaOfFire( isMine );
  }

  get host(): boolean {
    return this._host;
  }


  setHost( host: boolean ) {
    this._host = host;
  }

  isScreen(): boolean {
    return this.reflect.isTrue || this.lightScreen.isTrue || this.auroraVeil.isTrue;
  }

  onRemoveScreen(): void {
    this.reflect.onRemove();
    this.lightScreen.onRemove();
    this.auroraVeil.onRemove();
  }

}

class Field {
  battleStyle: number = 1;
  numberOfPokemon: number = 3;
  weather = new Weather();
  terrain = new Terrain();
  whole = new WholeField();
  myField = new SideField( true );
  opponentField = new SideField( false );

  setHost( host: boolean ): void {
    this.myField = new SideField( host );
    this.opponentField = new SideField( !host );
  }

  getSide( isMine: boolean ): SideField {
    if ( isMine === this.myField._isMine ) {
      return this.myField;
    } else {
      return this.opponentField;
    }
  }

  getSideByHost( host: boolean ): SideField {
    if ( this.myField.host === host ) {
      return this.myField;
    } else {
      return this.opponentField;
    }
  }

  setNumberOfPokemon( battleStyle: number ): void {
    this.battleStyle = battleStyle;
    if ( battleStyle === 1 ) {
      this.numberOfPokemon = 3;
    } else if ( battleStyle === 2 ) {
      this.numberOfPokemon = 4;
    } else if ( battleStyle === 3) {
      this.numberOfPokemon = 6;
    }
  }
}
