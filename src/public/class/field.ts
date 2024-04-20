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

  isPlaim(): boolean {
    return this.name === null || this.isNoWeather();
  }

  isSunny( pokemon: Pokemon ): boolean {
    if ( pokemon.item.isName( 'ばんのうがさ' ) || this.isNoWeather() ) {
      return false;
    } else {
      return this.name === 'HarshSunlight';
    }
  }

  isRainy( pokemon: Pokemon ): boolean {
    if ( pokemon.item.isName( 'ばんのうがさ' ) || this.isNoWeather() ) {
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
    if ( pokemon.item.isName( 'ばんのうがさ' ) || this.isNoWeather() ) {
      return false;
    } else {
      return this.name === 'HarshSunlight' && this.strong === true;
    }
  }

  isBadRainy( pokemon: Pokemon ): boolean {
    if ( pokemon.item.isName( 'ばんのうがさ' ) || this.isNoWeather() ) {
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

    if ( pokemon.item.isName( 'あついいわ' ) ) {
      fieldStatus.weather.turn = 8;
      fieldStatus.weather.extend = true;
    }

    writeLog( '日差しが 強くなった!' );
  }

  getRainy( pokemon: Pokemon ): void {
    if ( !this.isGetRainy() ) return;

    this.reset()
    fieldStatus.weather.name = 'Rain';
    fieldStatus.weather.turn = 5;

    if ( pokemon.item.isName( 'しめったいわ' ) ) {
      fieldStatus.weather.turn = 8;
      fieldStatus.weather.extend = true;
    }

    writeLog( '雨が 降り始めた!' );
  }

  getSandy( pokemon: Pokemon ): void {
    if ( !this.isGetSandy() ) return;

    this.reset()
    fieldStatus.weather.name = 'Sandstorm';
    fieldStatus.weather.turn = 5;

    if ( pokemon.item.isName( 'さらさらいわ' ) ) {
      fieldStatus.weather.turn = 8;
      fieldStatus.weather.extend = true;
    }

    writeLog( '砂あらしが 吹き始めた!' );
  }

  getSnowy( pokemon: Pokemon ): void {
    if ( !this.isGetSnowy() ) return;

    this.reset()
    fieldStatus.weather.name = 'Hail';
    fieldStatus.weather.turn = 5;

    if ( pokemon.item.isName( 'つめたいいわ' ) ) {
      fieldStatus.weather.turn = 8;
      fieldStatus.weather.extend = true;
    }

    writeLog( '雪が 降り始めた!' );
  }

  getBadSunny(): void {
    if ( !this.isGetBadSunny() ) return;

    this.reset()
    fieldStatus.weather.name = 'HarshSunlight';
    fieldStatus.weather.strong = true;

    writeLog( '日差しが とても強くなった!' );
  }

  getBadRainy(): void {
    if ( !this.isGetBadRainy() ) return;

    this.reset()
    fieldStatus.weather.name = 'Rain';
    fieldStatus.weather.strong = true;

    writeLog( '強い雨が 降り始めた!' );
  }

  getTurbulence(): void {
    if ( !this.isGetTurbulence() ) return;

    this.reset()
    fieldStatus.weather.name = 'Turbulence'
    fieldStatus.weather.strong = true;

    writeLog( '謎の乱気流が ひこうポケモンを 護る!' );
  }

  advance(): void {
    if ( this.turn === 0 ) return;

    this.turn -= 1;

    if ( this.turn > 0 ) return;

    switch ( this.name ) {
      case 'HarshSunlight':
        writeLog( '日差しが 元に戻った!' );
        break;

      case 'Rain':
        writeLog( '雨が 上がった!' );
        break;

      case 'Sandstorm':
        writeLog( '砂あらしが おさまった!' );
        break;

      case 'Hail':
        writeLog( '雪が 止んだ!' );
        break;

      default:
        ;
    }

    this.reset()
  }
}

class Terrain {
  name: TerrainText = null;
  turn: number = 0;
  extend: boolean = false;

  resetWithMessage(): void {
    if ( this.isElectric() ) writeLog( `足下の 電気が 消え去った!` );
    if ( this.isGrassy() ) writeLog( `足下の 草が 消え去った!` );
    if ( this.isMisty() ) writeLog( `足下の 霧霧が 消え去った!` );
    if ( this.isPsychic() ) writeLog( `足下の 不思議感が 消え去った!` );
    this.reset()
  }

  reset(): void {
    this.name = null;
    this.turn = 0;
    this.extend = false;
  }

  setExtend( pokemon: Pokemon ): void {
    if ( pokemon.item.isName( 'グランドコート' ) ) {
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
    writeLog( `足下に 電気が かけめぐる!` );
  }

  getGrassy( pokemon: Pokemon ): void {
    this.reset();
    this.name = 'grassy';
    this.setExtend( pokemon );
    writeLog( `足下に 草がおいしげった!` );
  }

  getMisty( pokemon: Pokemon ): void {
    this.reset();
    this.name = 'misty';
    this.setExtend( pokemon );
    writeLog( `足下に 霧が立ち込めた!` );
  }

  getPsychic( pokemon: Pokemon ): void {
    this.reset();
    this.name = 'psychic';
    this.setExtend( pokemon );
    writeLog( `足下が 不思議な感じに なった!` );
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

  onActivateGrassy( pokemon: Pokemon ): void {
    if ( this.name !== 'grassy' ) return;
    if ( !pokemon.isGround() ) return;
    const heal: number = Math.floor( pokemon.getOrgHP() / 16 );
    pokemon.status.hp.value.add( Math.max( 1, heal ) );
    writeLog( `${pokemon.getArticle()}の 体力が 回復した!` );
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
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate(): void {
    this.isTrue = true;
    writeLog( `じゅうりょくが 強くなった!` );
    this.msgDrop();
  }

  onElapse(): void {
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      writeLog( `じゅうりょくが 元に戻った! ` );
    }
  }

  msgDrop(): void {
    for ( const pokemon of main.getPokemonInBattle() ) {
      if ( !pokemon.isGround() ) {
        writeLog( `${pokemon.getArticle()}は じゅうりょくの 影響で 空中に いられなくなった!` );
      }
    }
  }
}

class TrickRoom extends WholeFieldStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は 時空を ゆがめた!` );
  }

  onElapse(): void {
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      writeLog( `ゆがんだ 時空が 元に戻った! ` );
    }
  }
}

class MagicRoom extends WholeFieldStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate(): void {
    this.isTrue = true;
    writeLog( `持たせた 道具の 効果が なくなる 空間を 作りだした!` );
  }

  onElapse(): void {
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      writeLog( `マジックルームが 解除され 道具の 効果が 元に戻った! ` );
    }
  }
}

class WonderRoom extends WholeFieldStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate(): void {
    this.isTrue = true;
    writeLog( `防御と 特防が 入れ替わる 空間を 作りだした!` );
  }

  onElapse(): void {
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      writeLog( `ワンダールームが 解除され 防御と 特防が 元に戻った! ` );
    }
  }
}

class MudSport extends WholeFieldStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate(): void {
    this.isTrue = true;
    writeLog( `電気の威力が 弱まった!` );
  }

  onElapse(): void {
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      writeLog( `どろあそびの 効果が なくなった! ` );
    }
  }
}

class WaterSport extends WholeFieldStatus {

  constructor() {
    super();
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate(): void {
    this.isTrue = true;
    writeLog( `炎の威力が 弱まった!` );
  }

  onElapse(): void {
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      writeLog( `みずあそびの 効果が なくなった! ` );
    }
  }
}

class FairyLock extends WholeFieldStatus {

  onActivate(): void {
    this.isTrue = true;
    writeLog( `次のターンは 逃げられない!` );
  }
}

class IonDeluge extends WholeFieldStatus {

  onActivate(): void {
    this.isTrue = true;
    writeLog( `電子のシャワーが 降りそそいだ!` );
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

  isLightCray: boolean = false;
  extendTurn = new ValueWithRange( 3, 0 );

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate( isLightClay: boolean ): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    this.isLightCray = isLightClay;
    writeLog( `${this.getText()}は オーロラベールで 物理と 特殊に 強くなった!` );
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    this.isLightCray = false;
    this.extendTurn.toZero();
    writeLog( `${this.getText()}の オーロラベールが なくなった!` );
  }
}

class LightScreen extends SideFieldStatus {

  isLightCray: boolean = false;
  extendTurn = new ValueWithRange( 3, 0 );

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate( isLightClay: boolean ): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    this.isLightCray = isLightClay;
    writeLog( `${this.getText()}は ひかりのかべで 特殊に 強くなった!` );
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    this.isLightCray = false;
    this.extendTurn.toZero();
    writeLog( `${this.getText()}の ひかりのかべが なくなった!` );
  }
}

class Reflect extends SideFieldStatus {

  isLightCray: boolean = false;
  extendTurn = new ValueWithRange( 3, 0 );

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate( isLightClay: boolean ): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    this.isLightCray = isLightClay;
    writeLog( `${this.getText()}は リフレクターで 物理に 強くなった!` );
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    this.isLightCray = false;
    this.extendTurn.toZero();
    writeLog( `${this.getText()}の リフレクターが なくなった!` );
  }
}


class TailWind extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn = new ValueWithRange( 4, 0 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    writeLog( `${this.getText()}に 追い風が 吹き始めた!` );
  }
}

class LuckyChant extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    writeLog( `おまじないの 力で ${this.getText()}の 急所が 隠れた!` );
  }
}

class Mist extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    writeLog( `${this.getText()}は 白い霧に 包まれた!` );
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    writeLog( `${this.getText()}の 白い霧が なくなった!` );
  }
}

class Safeguard extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn = new ValueWithRange( 5, 0 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    writeLog( `${this.getText()}は 神秘の守りに 包まれた!` );
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    writeLog( `${this.getText()}の 神秘の守りが なくなった!` );
  }
}

class MatBlock extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
  }

  onActivate( pokemon: Pokemon ): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}は たたみがえしを 狙っている!` );
  }
}

class CraftyShield extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    writeLog( `${this.getText()}の 周りを トリックガードが 守っている!` );
  }
}

class QuickGuard extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    writeLog( `${this.getText()}の 周りを ファストガードが 守っている!` );
  }
}

class WideGuard extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    writeLog( `${this.getText()}の 周りを ワイドガードが 守っている!` );
  }
}

class Rainbow extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn = new ValueWithRange( 4, 0 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    writeLog( `${this.getText()}の 空に 虹が かかった!` );
  }
}

class Wetlands extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn = new ValueWithRange( 4, 0 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    writeLog( `${this.getText()}の 周りに 湿原が 広がった!` );
  }
}

class SeaOfFire extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
    this.turn = new ValueWithRange( 4, 0 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    writeLog( `${this.getText()}の 周りが 火の海に 包まれた!` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( pokemon.type.has( 'Fire' ) ) return;
    const damage: number = Math.floor( pokemon.getOrgHP() / 8 );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    writeLog( `${pokemon.getArticle()}は 火の海の ダメージを受けた!` );
  }

  onElapse(): void {
    this.turn.sub( 1 );
    if ( this.turn.isZero() ) {
      this.reset();
      writeLog( `${this.getText()}の 周りの 火の海が 消え去った!` );
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
    writeLog( `${this.getText()}の 周りに とがった岩が ただよい始めた! `);
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    writeLog( `${this.getText()}の 周りの ステルスロックが 消え去った! ` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( pokemon.item.isName( 'あつぞこブーツ' ) ) return;
    const damage: number = Math.floor( pokemon.status.hp.value.max * pokemon.type.getCompatibility( 'Rock' ) / 8 );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    writeLog( `${pokemon.getArticle()}は とがった岩が 食いこんだ!` );
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
    writeLog( `${this.getText()}の 足元に どくびしが 散らばった!` );
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    writeLog( `${this.getText()}の 足元の どくびしが 消え去った!` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( !pokemon.isGround() ) return;
    if ( pokemon.item.isName( 'あつぞこブーツ' ) ) return;
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
    writeLog( `${this.getText()}の 足元に ねばねばネットが 広がった!` );
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    writeLog( `${this.getText()}の 足元の ねばねばネットが 消え去った!` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( !pokemon.isGround() ) return;
    if ( pokemon.item.isName( 'あつぞこブーツ' ) ) return;
    if ( !pokemon.isChangeRank( 'spe', -1 ) ) return;

    writeLog( `${this.getText()}は ねばねばネットに ひっかかった!` );
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
    writeLog( `${this.getText()}の 足元に まきびしが 散らばった!` );
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    writeLog( `${this.getText()}の 足元の まきびしが 消え去った!` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( !pokemon.isGround() ) return;
    if ( pokemon.item.isName( 'あつぞこブーツ' ) ) return;
    const damage: number = Math.floor( pokemon.status.hp.value.max / ( 10 - this.count * 2 ) );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    writeLog( `${pokemon.getArticle()}は まきびしの ダメージを受けた!` );
  }
}

class Steelsurge extends SideFieldStatus { // テキスト未検証

  constructor ( isMine: boolean ) {
    super( isMine )
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    writeLog( `${this.getText()}の 周りに とがった はがねが ただよい始めた! `);
  }

  onRemove(): void {
    if ( !this.isTrue ) return;
    this.reset();
    writeLog( `${this.getText()}の 周りの キョダイコウジンが 消え去った! ` );
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( pokemon.item.isName( 'あつぞこブーツ' ) ) return;
    const damage: number = Math.floor( pokemon.status.hp.value.max * pokemon.type.getCompatibility( 'Steel' ) / 8 );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    writeLog( `${pokemon.getArticle()}は とがった はがねが 食いこんだ!` );
  }
}

class Wildfire extends SideFieldStatus {

  constructor ( isMine: boolean ) {
    super( isMine )
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    writeLog( `${this.getText()}の ポケモンが 炎に 包まれた! `);
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( pokemon.type.has( 'Fire' ) ) return;
    const damage: number = Math.floor( pokemon.getOrgHP() / 6 );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    writeLog( `${pokemon.getArticle()}は キョダイゴクエンの 炎に 包まれていて 熱い!` );
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
    this.turn = new ValueWithRange( 4, 0 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    writeLog( `${this.getText()}の ポケモンが 岩に 囲まれた! `);
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( pokemon.type.has( 'Rock' ) ) return;
    const damage: number = Math.floor( pokemon.getOrgHP() / 6 );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    writeLog( `${pokemon.getArticle()}は キョダイフンセキの 岩に 囲まれていて 痛い!` );
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
    this.turn = new ValueWithRange( 4, 0 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    writeLog( `${this.getText()}の ポケモンが ムチの 猛打に 包まれた! `);
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( pokemon.type.has( 'Grass' ) ) return;
    const damage: number = Math.floor( pokemon.getOrgHP() / 6 );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    writeLog( `${pokemon.getArticle()}は キョダイベンタツの 猛打に さらされていて 痛い!` );
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
    this.turn = new ValueWithRange( 4, 0 );
  }

  onActivate(): void {
    if ( this.isTrue ) return;
    this.isTrue = true;
    writeLog( `${this.getText()}の ポケモンが 水の 流れに 包まれた! `);
  }

  onEffective( pokemon: Pokemon ): void {
    if ( !this.isTrue ) return;
    if ( pokemon.type.has( 'Water' ) ) return;
    const damage: number = Math.floor( pokemon.getOrgHP() / 6 );
    pokemon.status.hp.value.sub( Math.max( 1, damage ) );
    writeLog( `${pokemon.getArticle()}は キョダイホウゲキの 流れに 飲みこまれていて 苦しい!` );
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

}

class Field {
  _battleStyle: number;
  _numberOfPokemon: number;
  _weather: Weather;
  _terrain: Terrain;
  _whole: WholeField;
  _myField: SideField;
  _opponentField: SideField;

  constructor() {
    this._battleStyle = 1;
    this._numberOfPokemon = 3;
    this._weather = new Weather;
    this._terrain = new Terrain;
    this._whole = new WholeField;
    this._myField = new SideField( true );
    this._opponentField = new SideField( false );
  }

  set weather( weather: Weather ) {
    this._weather = weather;
  }
  set terrain( terrain: Terrain ) {
    this._terrain = terrain;
  }

  get battleStyle(): number {
    return this._battleStyle;
  }
  get numberOfPokemon(): number {
    return this._numberOfPokemon;
  }
  get weather(): Weather {
    return this._weather;
  }
  get terrain(): Terrain {
    return this._terrain;
  }
  get whole(): WholeField {
    return this._whole;
  }

  setHost( host: boolean ): void {
    this._myField = new SideField( host );
    this._opponentField = new SideField( !host );
  }

  getSide( isMine: boolean ): SideField {
    if ( isMine === this._myField._isMine ) {
      return this._myField;
    } else {
      return this._opponentField;
    }
  }

  setNumberOfPokemon( battleStyle: number ): void {
    this._battleStyle = battleStyle;
    if ( battleStyle === 1 ) {
      this._numberOfPokemon = 3;
    } else if ( battleStyle === 2 ) {
      this._numberOfPokemon = 4;
    } else if ( battleStyle === 3) {
      this._numberOfPokemon = 6;
    }
  }
}
