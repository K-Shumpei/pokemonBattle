class Order {
  host: boolean = true;
  isMe: boolean;
  party: number;
  hand: number;
  battle: number | null = null;

  constructor( isMe: boolean, slot: number ) {
    this.isMe = isMe;
    this.party = slot;
    this.hand = slot;
  }

  setInfo( order: Order ): void {
    this.host = order.host;
    this.isMe = order.isMe;
    this.party = order.party;
    this.hand = order.hand;
    this.battle = order.battle;
  }
}



class ParameterSix {
  [key: string]: number;

  _hitPoint: number;
  _attack: number;
  _defense: number;
  _specialAttack: number;
  _specialDefense: number;
  _speed: number;

  constructor() {
    this._hitPoint = 0;
    this._attack = 0;
    this._defense = 0;
    this._specialAttack = 0;
    this._specialDefense = 0;
    this._speed = 0;
  }

  set hitPoint( hitPoint: number ) {
    this._hitPoint = hitPoint;
  }
  set attack( attack: number ) {
    this._attack = attack;
  }
  set defense( defense: number ) {
    this._defense = defense;
  }
  set specialAttack( specialAttack: number ) {
    this._specialAttack = specialAttack;
  }
  set specialDefense( specialDefense: number ) {
    this._specialDefense = specialDefense;
  }
  set speed( speed: number ) {
    this._speed = speed;
  }

  get hitPoint(): number {
    return this._hitPoint;
  }
  get attack(): number {
    return this._attack;
  }
  get defense(): number {
    return this._defense;
  }
  get specialAttack(): number {
    return this._specialAttack;
  }
  get specialDefense(): number {
    return this._specialDefense;
  }
  get speed(): number {
    return this._speed;
  }
}


class Attack {
  _field: boolean;
  _isMe: boolean;
  _battle: number;
  _party: number;
  _success: boolean;
  _damage: number;
  _effective: number;
  _critical: boolean;
  _substitute: boolean;

  constructor( field: boolean, isMe: boolean, battle: number ) {
    this._field = field;
    this._isMe = isMe;
    this._battle = battle;
    this._party = 0;
    this._success = true;
    this._damage = 0;
    this._effective = 0;
    this._critical = false;
    this._substitute = false;
  }

  set success( success: boolean ) {
    this._success = success;
  }
  set damage( damage: number ) {
    this._damage = damage;
  }
  set critical( critical: boolean ) {
    this._critical = critical;
  }
  set substitute( substitute: boolean ) {
    this._substitute = substitute;
  }

  get isMe(): boolean {
    return this._isMe;
  }
  get battle(): number {
    return this._battle;
  }
  get party(): number {
    return this._party;
  }
  get success(): boolean {
    return this._success;
  }
  get damage(): number {
    return this._damage;
  }
  get effective(): number {
    return this._effective;
  }
  get critical(): boolean {
    return this._critical;
  }
  get substitute(): boolean {
    return this._substitute;
  }

  failure(): void {
    this._success === false;
    writeLog( `しかし うまく決まらなかった...` );
  }

  isField(): boolean {
    return this._field;
  }

  calcEffective( move: SelectedMove, target: Pokemon ): void {

    const rate = ( comp: TypeCompatibilityType, defType: PokemonType ): number => {
      const rate = comp.rate.filter( r => r.defType === defType )[0].rate;

      if ( rate === 0.0 && target.item.isName( 'ねらいのまと' ) ) {
        return 1.0;
      }
      if ( move.name === 'Freeze-Dry' && defType === 'Water' ) { // 技「フリーズドライ」
        return 2.0;
      }

      return rate;
    }

    const calcRate = ( move: SelectedMove, target: Pokemon ): number => {
      let result: number = 1.0;
      const comp: TypeCompatibilityType = typeCompatibility.filter( t => t.atkType === move.type )[0];

      for ( const defType of target.type.get() ) {
        if ( defType === null ) continue;

        result = result * rate( comp, defType );
      }

      if ( target.stateChange.tarShot.isTrue && move.type === 'Fire' ) {
        result = result * 2.0;
      }

      return result;
    }

    if ( move.type === null ) return;
    this._effective = calcRate( move, target );
  }

  isNotEffective(): boolean {
    return this._effective === 0;
  }

}

class AttackList {
  _list: Attack[];

  constructor() {
    this._list = [];
  }

  reset(): void {
    this._list = [];
  }
  setField(): void {
    const attack = new Attack( true, false, 0 );
    this._list.push( attack );
  }
  setPokemon( isMe: boolean, battle: number ): void {
    if ( !main.isExistByBattle( isMe, battle ) ) return;
    const attack = new Attack( false, isMe, battle );
    this._list.push( attack );
  }
  getTarget(): Attack[] {
    return this._list;
  }
  getValidTarget(): Attack[] {
    return this._list.filter( l => l.success );
  }
  getTargetToPokemon(): Attack[] {
    return this._list.filter( l => l.success && !l.isField() );
  }
  getTargetToField(): Attack[] {
    return this._list.filter( l => l.success && l.isField() );
  }
  isFailure(): boolean {
    return !this._list.some( t => t.success );
  }
}

class Command {
  _move: number | null;
  _reserve: number | null;
  _myTarget: number | null;
  _opponentTarget: number | null;

  constructor() {
    this._move = null;
    this._reserve = null;
    this._myTarget = null;
    this._opponentTarget = null;
  }

  set move( move: number | null ) {
    this._move = move;
  }
  set reserve( reserve: number | null ) {
    this._reserve = reserve;
  }
  set myTarget( myTarget: number | null ) {
    this._myTarget = myTarget;
  }
  set opponentTarget( opponentTarget: number | null ) {
    this._opponentTarget = opponentTarget;
  }

  get move(): number | null {
    return this._move;
  }
  get reserve(): number | null {
    return this._reserve;
  }
  get myTarget(): number | null {
    return this._myTarget;
  }
  get opponentTarget(): number | null {
    return this._opponentTarget;
  }

  isAttack(): boolean {
    return this._move !== null;
  }
  isExchange(): boolean {
    return this._reserve !== null;
  }
}

class StateChange {
  _isTrue: boolean;
  _turn: number;
  _count: number;
  _text: string;

  constructor() {
    this._isTrue = false;
    this._turn = 0;
    this._count = 0;
    this._text = '';
  }

  set isTrue( isTrue: boolean ) {
    this._isTrue = isTrue;
  }
  set turn( turn: number ) {
    this._turn = turn;
  }
  set count( count: number ) {
    this._count = count;
  }
  set text( text: string ) {
    this._text = text;
  }

  get isTrue(): boolean {
    return this._isTrue;
  }
  get turn(): number {
    return this._turn;
  }
  get count(): number {
    return this._count;
  }
  get text(): string {
    return this._text;
  }

  reset(): void {
    this._isTrue = false;
    this._turn = 0;
    this._count = 0;
    this._text = '';
  }


}

class Transform extends StateChange {
  isTransform( name: PokemonText ): boolean {
    return true;
    //return this._isTrue && this._name === name;
  }
}


class Attract extends StateChange {
  _order: Order;

  constructor() {
    super();
    this._order = new Order( true, 0 );
  }

  beTrue( order: Order ): void {
    this._isTrue = true;
    this._order.isMe = order.isMe;
    this._order.party = order.party;
  }
}





class Ability {
  name: AbilityText = null;
  org: AbilityText = null;
  pokeName: string = '';


  isName( ability: AbilityText ): boolean {
    return this.isValid() && this.name === ability;
  }

  isValid(): boolean {
    return true;
  }

  setOrg( ability: AbilityText ): void {
    this.name = ability;
    this.org = ability;
  }

  translate(): string {
    return abilityMaster.filter( a => a.nameEN === this.name )[0].nameJA;
  }

  changeMaster(): changeAbilityType {

    for ( const info of changeAbilityTable ) {
      if ( info.name === this.name ) {
        return info;
      }
    }

    const sample = {
      name: '',
      exchange: 4,
      overwrite: 4,
      noAbility: 4,
      neutral: 4,
      copy: 4,
      copied: 4,
      transform: 4 };

    return sample;
  }

  onChangeWithMsg( ability: AbilityText ): void {
    this.name = ability;
    writeLog( `${this.pokeName}は ${this.translate()}に なった!` );
  }
}

class Item {
  _name: string | null;
  _recycle: string | null;
  _belch: boolean;
  _pokeName: string;

  constructor() {
    this._name = null;
    this._recycle = null;
    this._belch = false;
    this._pokeName = '';
  }

  set name( name: string | null ) {
    this._name = name;
  }
  set belch( belch: boolean ) {
    this._belch = belch;
  }

  get name(): string | null {
    return this._name;
  }
  get belch(): boolean {
    return this._belch;
  }

  copyFromOpp( name: string | null, pokeName: string ): void {
    this._name = name;
    this._pokeName = pokeName;
  }

  isNull(): boolean {
    return this._name === null;
  }
  isValid(): boolean {
    return true;
  }
  isName( name: string ): boolean {
    return this.isValid() && this._name === name;
  }
  isBerry(): boolean {
    // return this._name ===
    return false;
  }
  recyclable(): void {
    if ( this._recycle === null ) this._recycle = this._name;
    this._name = null;
  }
  getMaster(): ItemData {
    return itemMaster.filter( i => i.nameEN === this._name )[0];
  }
  getCategory() {
    return categoryList.filter( c => c.name === this.getMaster().category )[0];
  }

  isReleasable( name: PokemonText, ability: AbilityText ): boolean {
    if ( this.isNull() ) return false;
    const master: ItemData = this.getMaster();
    const category = this.getCategory();

    if ( this.isName( 'はっきんだま' ) && name === 'Giratina Origin' ) return false;
    if ( master.category === 'plates' && name === 'Arceus' ) return false;
    if ( master.category === 'species-specific' && master.nameEN.includes( 'Drive' ) && name === 'Genesect' ) return false;
    if ( master.category === 'memories' && name === 'Silvally' ) return false; // シルヴァディ
    if ( this.isName( 'くちたけん' ) && name === 'Zacian Crowned' ) return false; // ザシアン(王)
    if ( this.isName( 'くちたたて' ) && name === 'Zamazenta Crowned' ) return false; // ザマゼンタ(王)
    if ( master.category === 'mega-stones' ) return false;
    if ( this.isName( 'あいいろのたま' ) && name === 'Kyogre Primal' ) return false; // ゲンシカイオーガ
    if ( this.isName( 'べにいろのたま' ) && name === 'Groudon Primal' ) return false; // ゲンシグラードン
    if ( this.isName( 'ブーストエナジー' ) && ability === 'Protosynthesis' ) return false; // 特性「こだいかっせい」
    if ( this.isName( 'ブーストエナジー' ) && ability === 'Quark Drive' ) return false; // 特性「クォークチャージ」
    if ( master.category === 'z-crystals' ) return false;

    return true;
  }

  translate(): string {
    return String( this.name );
  }
}

class TrickOrTreat extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}に ゴーストタイプが 追加された!` );
  }
}

class ForestsCurse extends StateChangeStatus {

  onActivate( pokemon: Pokemon ): void {
    this.isTrue = true;
    writeLog( `${pokemon.getArticle()}に くさタイプが 追加された!` );
  }
}


class Type {
  list: PokemonType[] = [];
  trickOrTreat = new TrickOrTreat(); // ハロウィン
  forestCurse = new ForestsCurse(); // もりののろい

  copyFromOpp( list: PokemonType[] ): void {
    this.list = list;
  }
  get(): PokemonType[] {
    let result = this.list;
    if ( this.trickOrTreat.isTrue ) result.push( 'Ghost' );
    if ( this.forestCurse.isTrue ) result.push( 'Grass' );
    return this.list;
  }
  has( type: PokemonType ): boolean {
    return this.list.includes( type );
  }
  isOnly( type: PokemonType ): boolean {
    return this.get().length === 1 && this.get()[0] === type;
  }
  toType( type: PokemonType ): void {
    this.list = [ type ];
  }

  getCompatibility( type: PokemonType ): number {
    const comp = typeCompatibility.filter( t => t.atkType === type )[0];
    const result: number = this.get().reduce( ( acc, value ) => {
      const rate = comp.rate.filter( r => r.defType === value )[0].rate
      return acc * rate;
    }, 1.0 );

    return result;
  }

}




class Pokemon {
  _id: number;
  _order: Order;

  _name: PokemonText; // 名前
  _level: number; // レベル
  _type: Type; // タイプ
  _gender: Gender; // 性別
  _ability: Ability; // 特性
  _item: Item; // 持ち物
  _nature: NatureText; // 性格
  _status: Status; // ステータス
  _move: Move; // 技

  _happiness: number; // なつき度
  _statusAilment: StatusAilment; // 状態異常

  _attack: AttackList; // 攻撃情報
  _command: Command; // コマンド
  _stateChange: StateChangeSummary; // 状態変化
  _actionOrder: ActionOrder; // 行動順

  extraParameter = new ExtraParameter();

  constructor( isMe: boolean, slot: number ) {
    this._id = 0;
    this._order = new Order( isMe, slot );

    this._name = null;
    this._level = 50;
    this._type = new Type();
    this._gender = 'genderless';
    this._ability = new Ability();
    this._item = new Item();
    this._nature = 'Bashful';
    this._status = new Status();
    this._move = new Move();

    this._happiness = 255;
    this._statusAilment = new StatusAilment();

    this._attack = new AttackList();
    this._command = new Command;
    this._stateChange = new StateChangeSummary();
    this._actionOrder = new ActionOrder();
  }

  set id( id: number ) {
    this._id = id;
  }
  set command( command: Command ) {
    this._command = command;
  }
  set stateChange( stateChange: StateChangeSummary ) {
    this._stateChange = stateChange;
  }

  set name( name: PokemonText ) {
    this._name = name;
  }
  set type( type: Type ) {
    this._type = type;
  }
  set gender( gender: Gender ) {
    this._gender = gender;
  }

  set level( level: number ) {
    this._level = level;
  }
  set item( item: Item ) {
    this._item = item;
  }
  set nature( nature: NatureText ) {
    this._nature = nature;
  }
  set happiness( happiness: number ) {
    this._happiness = happiness;
  }
  set statusAilment( statusAilment: StatusAilment ) {
    this._statusAilment = statusAilment;
  }

  get id(): number {
    return this._id;
  }
  get order(): Order {
    return this._order;
  }

  get status(): Status {
    return this._status;
  }
  get name(): PokemonText {
    return this._name;
  }

  get move(): Move {
    return this._move;
  }
  get attack(): AttackList {
    return this._attack;
  }
  get command(): Command {
    return this._command;
  }
  get stateChange(): StateChangeSummary {
    return this._stateChange;
  }

  get type(): Type {
    return this._type;
  }
  get gender(): Gender {
    return this._gender;
  }
  get ability(): Ability {
    return this._ability;
  }
  get level(): number {
    return this._level;
  }
  get item(): Item {
    return this._item;
  }
  get nature(): NatureText {
    return this._nature;
  }
  get happiness(): number {
    return this._happiness;
  }
  get statusAilment(): StatusAilment {
    return this._statusAilment;
  }
  get actionOrder(): ActionOrder {
    return this._actionOrder;
  }

  reset(): void {
    const partyOrder: number = this._order.party;
    const isMe: boolean = this._order.isMe;
    const imageHTML = getHTMLInputElement( 'myParty_image' + partyOrder );
    imageHTML.src = '';

    this._order = new Order( isMe, partyOrder );

    this._name = null;
    this._level = 50;
    this._type = new Type();
    this._gender = 'genderless';
    this._ability = new Ability();
    this._item = new Item();
    this._nature = 'Bashful';
    this._status = new Status();
    this._move = new Move();

    this._happiness = 255;
    this._statusAilment = new StatusAilment();

    this._attack = new AttackList();
    this._command = new Command();
    this._stateChange = new StateChangeSummary();
  }


  register( reg: Register ): void {
    this._id = reg.id;
    this._name = reg.name;
    this._level = reg.level;
    this._type.list = reg.type;
    this._gender = reg.gender.value;
    this._ability.setOrg( reg.ability.value );
    this._item.name = reg.item;
    this._nature = reg.nature;
    this._status.register( reg.stat );
    this._move.register( reg.move );
  }

  copyFromOpp( opp: Pokemon ): void {
    this._id = opp._id;
    this._name = opp._name;
    this._type.copyFromOpp( opp._type.list );
    this._gender = opp._gender;
    this._ability.setOrg( opp._ability.name );
    this._level = opp._level;
    this._item.copyFromOpp( opp._item._name, opp._item._pokeName );
    this._nature = opp._nature;
    this._status.copyFromOpp( opp._status );
    this._move.copyFromOpp( opp._move._learned );
  }

  showHandInfo(): void {
    getHTMLInputElement( 'party' + this._order.hand + '_name' ).textContent = ( this._name === null )? '名前' : this.translateName( this._name );
    getHTMLInputElement( 'party' + this._order.hand + '_gender' ).textContent = ( this._name === null )? '性別' : this.translateGender();
    getHTMLInputElement( 'party' + this._order.hand + '_level' ).textContent = ( this._name === null )? '' : String( this._level );
    getHTMLInputElement( 'party' + this._order.hand + '_ability' ).textContent = ( this._name === null )? '特性' : this._ability.translate();
    getHTMLInputElement( 'party' + this._order.hand + '_remainingHP' ).textContent = ( this._name === null )? '' : String( this._status.hp.value.value );
    getHTMLInputElement( 'party' + this._order.hand + '_item' ).textContent = ( this._name === null )? '持ち物' : String( this._item.name );

    if ( this._type.get().length === 0 ) {
      getHTMLInputElement( 'party' + this._order.hand + '_type1' ).textContent = 'タイプ';
      getHTMLInputElement( 'party' + this._order.hand + '_type2' ).textContent = '';
    } else if ( this._type.get().length === 1 ) {
      getHTMLInputElement( 'party' + this._order.hand + '_type1' ).textContent = this.translateType( String( this._type.get()[0] ) );
      getHTMLInputElement( 'party' + this._order.hand + '_type2' ).textContent = '';
    } else if ( this._type.get().length === 2 ) {
      getHTMLInputElement( 'party' + this._order.hand + '_type1' ).textContent = this.translateType( String( this._type.get()[0] ) );
      getHTMLInputElement( 'party' + this._order.hand + '_type2' ).textContent = this.translateType( String( this._type.get()[1] ) );
    }

    this._status.show( this._name, this._order.hand );
    this._move.show( this._order.hand );
  }

  showPartyImage(): void {
    const partyOrder: number = this._order.party;
    const imageHTML = getHTMLInputElement( 'myParty_image' + partyOrder );

    imageHTML.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + this._id + '.png';
  }

  translateName( name: string ): string {

    for ( const data of pokemonMaster ) {
      if ( data.nameEN === name ) return data.nameJA;
      if ( data.nameJA === name ) return data.nameEN;
    }
    return '';
  }

  translateType( name: string ): string {
    for ( const data of typeTextMaster ) {
      if ( data.nameEN === name ) return data.nameJA;
      if ( data.nameJA === name ) return String( data.nameEN );
    }
    return name;
  }

  translateGender(): string {
    if ( this._gender === 'male' ) return '♂';
    if ( this._gender === 'female' ) return '♀';
    if ( this._gender === 'genderless' ) return '-';

    return '-'
  }

  translateAbility( name: string ): string {
    for ( const data of abilityMaster ) {
      if ( data.nameEN === name ) return data.nameJA;
      if ( data.nameJA === name ) return data.nameEN;
    }
    return name;
  }

  isMine(): boolean {
    return this._order.isMe;
  }

  //----------
  // メッセージ
  //----------
  isMeToStr(): string {
    if ( this.isMine() ) return '自分';
    else return '相手';
  }
  msgToBattleField(): void {
    writeLog( `${this.isMeToStr()}は ${this.translateName( String(this._name) )}を くりだした!` );
  }
  getArticle(): string {
    if ( this._name === null ) return ''
    if ( this.isMine() ) return this.translateName( this._name );
    else return '相手の' + this.translateName( this._name );
  }

  msgQuickDraw(): void {
    writeLog( `${this.getArticle()}は クイックドロウで 行動が はやくなった!` );
  }
  msgQuickClaw(): void {
    writeLog( `${this.getArticle()}は せんせいのつめで 行動が はやくなった!` );
  }
  msgCustapBerry(): void {
    writeLog( `${this.getArticle()}は イバンのみで 行動が はやくなった!` );
  }
  msgCannotMove(): void {
    writeLog( `${this.getArticle()}は 攻撃の 反動で 動けない!` );
  }
  msgStillAsleep(): void {
    writeLog( `${this.getArticle()}は ぐうぐう 眠っている` );
  }
  msgStillFrozen(): void {
    writeLog( `${this.getArticle()}は 凍ってしまって 動けない!` );
  }
  msgNoPowerPoint(): void {
    writeLog( `しかし 技の 残りポイントが なかった!` );
  }
  msgTruant(): void {
    writeLog( `${this.getArticle()}は なまけている` );
  }
  msgFocusPunch(): void {
    writeLog( `${this.getArticle()}は 集中が 途切れて 技が 出せない!` );
  }
  msgFlinch(): void {
    writeLog( `${this.getArticle()}は ひるんで 技が 出せない!` );
  }
  msgDisable(): void {
    writeLog( `${this.getArticle()}は かなしばりで 技が 出せない!` );
  }
  msgGravity(): void {
    writeLog( `${this.getArticle()}は じゅうりょくが 強くて ${this._move.selected.translate()}が 出せない!` );
  }
  msgHealBlock(): void {
    writeLog( `${this.getArticle()}は かいふくふうじで 技が 出せない!` );
  }
  msgThroatChop(): void {
    writeLog( `${this.getArticle()}は じごくづきの効果で 技が 出せない!` );
  }
  msgTaunt(): void {
    writeLog( `${this.getArticle()}は ちょうはつされて 技が 出せない!` );
  }
  msgImprison(): void {
    writeLog( `${this.getArticle()}は ふういんで 技が 出せない!` );
  }
  msgStillConfuse(): void {
    writeLog( `${this.getArticle()}は 混乱している!` );
  }
  msgAttackMyself(): void {
    writeLog( `わけも わからず 自分を 攻撃した!` );
  }
  msgParalysis(): void {
    writeLog( `${this.getArticle()}は 体がしびれて 動かない!` );
  }
  msgMeltByMove(): void {
    writeLog( `${this.getArticle()}の ${this._move.selected.translate()}で こおりがとけた!` );
  }
  msgDeclareMove(): void {
    writeLog( `${this.getArticle()}の ${this._move.selected.translate()}!` );
  }
  msgDeclareAbility(): void {
    writeLog( `${this.translateName( String(this._name) )}の ${this._ability.translate()}` );
  }
  msgDeclareFailure(): void {
    writeLog( `しかし うまく決まらなかった....` );
  }
  msgBadRainy(): void {
    writeLog( `強い雨の 影響で ほのおタイプの 攻撃が 消失した!` );
  }
  msgBadSunny(): void {
    writeLog( `強い日差しの 影響で みずタイプの 攻撃が 蒸発した!` );
  }
  msgPowder(): void {
    writeLog( `${this._move.selected.translate()}に 反応して ふんじんが 爆発した!` );
  }
  msgInvalidUser(): void {
    writeLog( `しかし ${this.getArticle()}には 使うことが できなかった!` );
  }
  msgRefWeight(): void {
    writeLog( `${this.getArticle()}は 首を 横に振った` );
    writeLog( `この技を しかけることが できないようだ......` );
  }
  msgCannotUse(): void {
    writeLog( `${this.getArticle()}は ${this._move.selected.translate()}が 使えない!` );
  }
  msgFutureSight(): void {
    writeLog( `${this.getArticle()}は 未来に 攻撃を予知した!` );
  }
  msgDoomDesire(): void {
    writeLog( `${this.getArticle()}は はめつのねがいを 未来に託した!` );
  }
  msgProtean(): void {
    writeLog( `${this.getArticle()}は ${this._type.get()[0]}タイプに なった!` );
  }
  msgPreliminary(): void {
    if ( this._move.selected.name === 'Razor Wind' ) { // 技「かまいたち」
      writeLog( `${this.getArticle()}の 周りで 空気が 渦を巻く!` );
    }
    if ( this._move.selected.name === 'Ice Burn' ) { // 技「コールドフレア」
      writeLog( `${this.getArticle()}は 凍える空気に 包まれた!` );
    }
    if ( this._move.selected.name === 'Sky Attack' ) { // 技「ゴッドバード」
      writeLog( `${this.getArticle()}を 激しい光が 包む!` );
    }
    if ( this._move.selected.name === 'Geomancy' ) { // 技「ジオコントロール」
      writeLog( `${this.getArticle()}は パワーを ためこんでいる!` );
    }
    if ( this._move.selected.name === 'Solar Beam' // 技「ソーラービーム」
      || this._move.selected.name === 'Solar Blade' ) { // 技「ソーラーブレード」
      writeLog( `${this.getArticle()}は 光を 吸収した!` );
    }
    if ( this._move.selected.name === 'Freeze Shock' ) { // 技「フリーズボルト」
      writeLog( `${this.getArticle()}は 冷たい光に 包まれた!` );
    }
    if ( this._move.selected.name === 'Meteor Beam' ) { // 技「メテオビーム」
      writeLog( `${this.getArticle()}に 宇宙の 力が あふれだす!` );
    }
    if ( this._move.selected.name === 'Skull Bash' ) { // 技「ロケットずつき」
      writeLog( `${this.getArticle()}は 首を 引っ込めた!` );
    }
    if ( this._move.selected.name === 'Dig' ) { // 技「あなをほる」
      writeLog( `${this.getArticle()}は 地面に 潜った!` );
    }
    if ( this._move.selected.name === 'Fly' ) { // 技「そらをとぶ」
      writeLog( `${this.getArticle()}は 空高く 飛び上がった!` );
    }
    if ( this._move.selected.name === 'Bounce' ) { // 技「とびはねる」
      writeLog( `${this.getArticle()}は 高く 飛び跳ねた!` );
    }
    if ( this._move.selected.name === 'Dive' ) { // 技「ダイビング」
      writeLog( `${this.getArticle()}は 水中に 身を潜めた!` );
    }
    if ( this._move.selected.name === 'Phantom Force' // 技「ゴーストダイブ」
      || this._move.selected.name === 'Shadow Force' ) { // 技「シャドーダイブ」
      writeLog( `${this.getArticle()}の姿が 一瞬にして 消えた!` );
    }
  }
  msgPowerHerb(): void {
    writeLog( `${this.getArticle()}は パワフルハーブで 力が みなぎった!` );
  }
  msgNotHit(): void {
    writeLog( `${this.getArticle()}には 当たらなかった!` );
  }
  msgPsychicTerrain(): void {
    writeLog( `${this.getArticle()}は サイコフィールドに 守られている!` );
  }
  msgQuickGuard(): void {
    writeLog( `${this.getArticle()}は ファストガードで 守られた!` );
  }
  msgWideGuard(): void {
    writeLog( `${this.getArticle()}は ワイドガードで 守られた!` );
  }
  msgCraftyShield(): void {
    writeLog( `${this.getArticle()}は トリックガードで 守られた!` );
  }
  msgProtect(): void {
    writeLog( `${this.getArticle()}は 攻撃から 身を守った!` );
  }
  msgHurt(): void {
    writeLog( `${this.getArticle()}は 傷ついた!` );
  }
  msgMatBlock(): void {
    writeLog( `${this._move.selected.translate()}は たたみがえしで 防がれた!` );
  }
  msgInvalid(): void {
    writeLog( `${this.getArticle()}には 効果がないようだ...` );
  }
  msgSafetyGoggles( move: string ): void {
    writeLog( `${this.getArticle()}は ぼうじんゴーグルで ${move}を 受けない!` );
  }

  msgDamage( damage: number ): void {
    writeLog( `${damage}の ダメージ!` );
  }
  msgSuperEffective( targetName: string ): void {
    if ( this._attack.getTarget().length === 1 ) {
      writeLog( `効果は バツグンだ!` );
    } else {
      writeLog( `${targetName}に 効果は バツグンだ!` );
    }
  }
  msgNotEffective( targetName: string ): void {
    if ( this._attack.getTarget().length === 1 ) {
      writeLog( `${targetName}に 効果は 今ひとつのようだ......` );
    } else {
      writeLog( `${targetName}に 効果は いまひとつだ` );
    }
  }
  msgCritical( targetName: string ): void {
    if ( this._attack.getTarget().length === 1 ) {
      writeLog( `急所に 当たった!` );
    } else {
      writeLog( `${targetName}に 急所に 当たった!` );
    }
  }
  msgEndure(): void {
    writeLog( `${this.getArticle()}は 攻撃を こらえた!` );
  }
  msgFocusSash(): void {
    writeLog( `${this.getArticle()}は きあいのタスキで 持ちこたえた!` );
  }
  msgFocusBand(): void {
    writeLog( `${this.getArticle()}は きあいのハチマキで 持ちこたえた!` );
  }
  msgCannotEscape(): void {
    writeLog( `${this.getArticle()}は もう 逃げられない!` );
  }
  msgSaltCure(): void {
    writeLog( `${this.getArticle()}は しおづけに なった!` );
  }
  msgWhiteHerb(): void {
    writeLog( `${this.getArticle()}は しろいハーブで ステータスを 元に戻した!` );
  }
  msgLiquidOoze(): void {
    writeLog( `${this.getArticle()}は ヘドロえきを 吸い取った!` );
  }
  msgDrain( targetName: string ): void {
    writeLog( `${targetName}から 体力を 吸い取った!` );
  }
  msgRage(): void {
    writeLog( `${this.getArticle()}の いかりのボルテージが 上がっていく!` );
  }
  msgClearSmog(): void {
    writeLog( `全ての ステータスが 元に 戻った!` );
  }
  msgGrudge(): void {
    writeLog( `${this.getArticle()}の ${this._move.learned[this._move.selected.slot].translate()}は おんねんで PPが0になった!` );
  }
  msgProtectivePads(): void {
    writeLog( `${this.getArticle()}は ぼうごパットで 防いだ!` );
  }
  msgRoughSkin(): void {
    writeLog( `${this.getArticle()}は 傷ついた!` );
  }
  msgAttract(): void {
    writeLog( `${this.getArticle()}は メロメロに なった!` );
  }
  msgMummy(): void {
    writeLog( `${this.getArticle()}は とくせいが ミイラになっちゃった!` );
  }
  msgLingeringAroma(): void {
    writeLog( `${this.getArticle()}は においが うつって とれなくなっちゃった!` );
  }
  msgExchangeAbility(): void {
    writeLog( `${this.getArticle()}は おたがいの とくせいを 入れ替えた!` );
  }
  msgPerishBodySide(): void {
    writeLog( `${this.getArticle()}は 3ターン後に 滅びてしまう!` );
  }
  msgPerishBodyAll(): void {
    writeLog( `おたがいは 3ターン後に 滅びてしまう!` );
  }
  msgElectromorphosis( moveName: string ): void {
    writeLog( `${this.getArticle()}は ${moveName}を 受けて 充電した!` );
  }
  msgAngerPoint(): void {
    writeLog( `${this.getArticle()}は 攻撃が 最大まで 上がった!` );
  }
  msgHalfBerry(): void {
    writeLog( `${this.getArticle()}への ダメージを ${this._stateChange.halfBerry.text}が 弱めた!` );
  }
  msgRockyHelmet(): void {
    writeLog( `${this.getArticle()}は ゴツゴツメットで ダメージを受けた!` );
  }
  msgAirBalloon(): void {
    writeLog( `${this.getArticle()}の ふうせんが 割れた!` );
  }
  msgIncinerate(): void {
    writeLog( `${this.getArticle()}の ${this._item.name}は 焼けてなくなった!` );
  }
  msgJabocaBerry( targetName: string ): void {
    writeLog( `${this.getArticle()}は ${targetName}の ジャポのみで ダメージを 受けた!` );
  }
  msgRowapBerry( targetName: string ): void {
    writeLog( `${this.getArticle()}は ${targetName}の レンブのみで ダメージを 受けた!` );
  }
  msgFainted(): void {
    writeLog( `${this.getArticle()}は たおれた!` );
  }
  msgDestinyBond(): void {
    writeLog( `${this.getArticle()}は 相手を 道連れに した!` );
  }
  msgRecoil(): void {
    writeLog( `${this.getArticle()}は 反動による ダメージを 受けた!` );
  }
  msgBind( targetName: string ): void {
    if ( this._move.selected.name === 'Whirlpool' ) { // 技「うずしお」
      writeLog( `${this.getArticle()}は 渦の中に 閉じこめられた!` );
    }
    if ( this._move.selected.name === 'Clamp' ) { // 技「からではさむ」
      writeLog( `${this.getArticle()}は ${targetName}の からに はさまれた!` );
    }
    if ( this._move.selected.name === 'Thunder Cage' ) { // 技「サンダープリズン」
      writeLog( `${this.getArticle()}は ${targetName}に 閉じこめられた!` );
    }
    if ( this._move.selected.name === 'Bind' ) { // 技「しめつける」
      writeLog( `${this.getArticle()}は ${targetName}に しめつけられた!` );
    }
    if ( this._move.selected.name === 'Sand Tomb' ) { // 技「すなじごく」
      writeLog( `${this.getArticle()}は 砂じごくに 捕らわれた!` );
    }
    if ( this._move.selected.name === 'Snap Trap' ) { // 技「トラバサミ」
      writeLog( `${this.getArticle()}は トラバサミに 捕らわれた!` );
    }
    if ( this._move.selected.name === 'Fire Spin' ) { // 技「ほのおのうず」
      writeLog( `${this.getArticle()}は 炎の渦に 閉じこめられた!` );
    }
    if ( this._move.selected.name === 'Wrap' ) { // 技「まきつく」
      writeLog( `${this.getArticle()}は ${targetName}に 巻きつかれた!` );
    }
    if ( this._move.selected.name === 'Magma Storm' ) { // 技「マグマストーム」
      writeLog( `${this.getArticle()}は マグマの渦に 閉じこめられた!` );
    }
    if ( this._move.selected.name === 'Infestation' ) { // 技「まとわりつく」
      writeLog( `${this.getArticle()}は ${targetName}に まとわりつかれた!` );
    }
  }
  msgKnockOff( targetName: string, targetItem: string ): void {
    writeLog( `${this.getArticle()}は ${targetName}の ${targetItem}を はたき落とした!` );
  }
  msgNotThief( targetName: string ): void {
    writeLog( `${targetName}の 道具を 奪えない!` );
  }
  msgThief( targetName: string, targetItem: string ): void {
    writeLog( `${this.getArticle()}は ${targetName}から ${targetItem}を 奪い取った!` );
  }
  msgBugBote( berryName: string ): void {
    writeLog( `${this.getArticle()}は ${berryName}を 奪って 食べた!` );
  }
  msgSmackDown(): void {
    writeLog( `${this.getArticle()}は 撃ち落とされて 地面に 落ちた!` );
  }
  msgThousandWaves(): void {
    writeLog( `${this.getArticle()}は もう 逃げられない!` );
  }
  msgJawLock(): void {
    writeLog( `おたがいの ポケモンは 逃げることが できなくなった!` );
  }
  msgColorChange( type: string ): void {
    writeLog( `${this.getArticle()}は ${type}タイプに なった!` );
  }
  msgBattleBond(): void {
    writeLog( `${this.getArticle()}に きずなの 力が みなぎった!` );
  }
  msgLifeOrb(): void {
    writeLog( `${this.getArticle()}は 命が 少し削られた!` );
  }
  msgShellBell(): void {
    writeLog( `${this.getArticle()}は かいがらのすずで 少し 回復` );
  }
  msgPickpocket(): void {
    writeLog( `${this.getArticle()}の ${this._item.name}を 奪った!` );
  }

  msgAddHPByAbility(): void {
    writeLog( `${this.getArticle()}の 体力が 回復した!` );
  }
  msgAddHPByItem( item: string ): void {
    writeLog( `${this.getArticle()}は ${item}で 体力を 回復した!` );
  }
  msgSandstorm(): void {
    writeLog( `砂あらしが ${this.getArticle()}を 襲う!` );
  }


  msgCureConfuse(): void {
    writeLog( `${this.getArticle()}の 混乱が 解けた!` );
  }
  msgToHand(): void {
    writeLog( `${this.getArticle()}を 引っ込めた!` ); // メッセージ確認不足
  }


  //------------------
  // 特性による優先度変更
  //------------------
  changeMovePriority(): void {
    if ( this._ability.isName( 'Prankster' ) && this._move.selected.isStatus() ) { // 特性「いたずらごころ」
      this._move.selected.priority += 1;
    }
    if ( this._ability.isName( 'Gale Wings' ) && this._status.hp.value.isMax() ) { // 特性「はやてのつばさ」
      this._move.selected.priority += 1;
    }
    if ( this._ability.isName( 'Triage' ) && this._move.selected.getMaster().heal ) { // 特性「ヒーリングシフト」
      this._move.selected.priority += 3;
    }
  }

  //-------------------------
  // 残りHPによるきのみの発動判定
  //-------------------------
  isActivateBerryByHP( denominator: 2 | 4 ): boolean {
    const gluttony: number = ( this._ability.isName( 'Gluttony' ) )? 2 : 1; // 特性「くいしんぼう」
    if ( denominator === 2 ) {
      return this._status.hp.value.isLessEqual( denominator );
    } else {
      return this._status.hp.value.isLessEqual( denominator / gluttony );
    }
  }

  //-----------
  // 持ち物の消費
  //-----------
  consumeItem(): void {
    if ( this._item.isNull() ) return;

    if ( this._item.isBerry() ) {
      this._item.belch = true;
      this.activateCheekPouch();
    }

    this._item.recyclable();
  }

  //-------------
  // ほおぶくろ発動
  //-------------
  activateCheekPouch(): void {
    if ( !this._ability.isName( 'Cheek Pouch' ) ) return; // 特性「ほおぶくろ」
    if ( this._status.hp.value.isZero() )return;
    if ( this._status.hp.value.isMax() ) return;
    if ( this._stateChange.healBlock.isTrue ) return;

    const value: number = Math.floor( this.getOrgHP() / 3 );
    this._status.hp.value.add( value );

    this.msgDeclareAbility();
    this.msgAddHPByAbility();
  }

  //-----------
  // 実質HP
  //-----------
  getOrgHP(): number {
    const dynamax: number = ( this._stateChange.dynamax.isTrue )? 0.5 : 1;
    return this._status.hp.av * dynamax;
  }

  //--------------
  // ランク変化可能量
  //--------------
  getRankVariableOrg( value: number ): number {
    value = ( this._ability.isName( 'Simple' ) )? value * 2 : value; // 特性「たんじゅん」
    value = ( this._ability.isName( 'Contrary' ) )? value * -1 : value; // 特性「あまのじゃく」
    return value;
  }
  getRankVariable( para: RankStrings, value: number ): number {
    switch ( para ) {
      case 'atk':
        return this._status.atk.rank.getVariable( value );
      case 'def':
        return this._status.def.rank.getVariable( value );
      case 'spA':
        return this._status.spA.rank.getVariable( value );
      case 'spD':
        return this._status.spD.rank.getVariable( value );
      case 'spe':
        return this._status.spe.rank.getVariable( value );
      case 'acc':
        return this._status.acc.getVariable( value );
      case 'eva':
        return this._status.eva.getVariable( value );
      default:
        return 0;
    }
  }

  isChangeRankByOther( para: RankStrings, value: number, other: Pokemon ): boolean {
    const setting: number = this.getRankVariableOrg( value );
    const real: number = this.getRankVariable( para, setting );

    const abilityCheck = ( para: RankStrings, real: number ): boolean => {
      if ( real >= 0 ) return true;

      if ( this._ability.isName( 'White Smoke' ) ) return false; // 特性「しろいけむり」
      if ( this._ability.isName( 'Clear Body' ) ) return false; // 特性「クリアボディ」
      if ( this._ability.isName( 'Full Metal Body' ) ) return false; // 特性「メタルプロテクト」
      if ( main.isExistAbilityInSide( this.isMine(), 'Flower Veil' ) && this._type.has( 'Grass' ) ) return false; // 特性「フラワーベール」
      if ( this._ability.isName( 'Mirror Armor' ) ) { // 特性「ミラーアーマー」
        //changeTargetRank( target, pokemon, parameter, change );
        // return;
      }
      if ( this._ability.isName( 'Hyper Cutter' ) && para === 'atk' ) return false; // 特性「かいりきバサミ」
      if ( this._ability.isName( 'Big Pecks' ) && para === 'def' ) return false; // 特性「はとむね」
      if ( this._ability.isName( 'Keen Eye' ) && para === 'acc' ) return false; // 特性「するどいめ」

      return true;
    }

    const mistCheck = ( real: number, other: Pokemon ): boolean => {
      if ( real >= 0 ) return true;
      if ( !main.field.getSide( this.isMine() ).mist.isTrue ) return true;
      if ( !other.ability.isName( 'Infiltrator' ) ) return true; // 特性「すりぬけ」
      return false;
    }

    return real !== 0 && mistCheck( real, other ) && abilityCheck( para, real );
  }

  isChangeRank( para: RankStrings, value: number ): boolean {
    const setting: number = this.getRankVariableOrg( value );
    const real: number = this.getRankVariable( para, setting );

    return real !== 0;
  }

  changeRank( para: RankStrings, value: number, item?: string ): void {
    const setting: number = this.getRankVariableOrg( value );
    const real: number = this.getRankVariable( para, setting );

    this._status.changeRank( para, real, setting, this.getArticle(), item );
  }

  changeRankByOther( para: RankStrings, value: number, other: Pokemon ): void {
    this.changeRank( para, value );

    const setting: number = this.getRankVariableOrg( value );
    const real: number = this.getRankVariable( para, setting );

    if ( real >= 0 ) return;

    if ( this._ability.isName( 'Defiant' ) && this.isMine() !== other.isMine() ) { // 特性「まけんき」
      this.msgDeclareAbility();
      this.changeRank( 'atk', 2 );
    }
    if ( this.ability.isName( 'Competitive' ) && this.isMine() !== other.isMine() ) { // 特性「かちき」
      this.msgDeclareAbility();
      this.changeRank( 'spA', 2 );
    }
  }

  changeRankByRage(): void {
    const setting: number = this.getRankVariableOrg( 1 );
    const real: number = this.getRankVariable( 'atk', setting );

    this.status.atk.rank.add( real );
  }

  safeGuardCheck( other: Pokemon ): boolean {
    if ( !main.field.getSide( this.isMine() ).safeguard.isTrue ) return true;
    if ( other.ability.isName( 'Infiltrator' ) && this.isMine() !== other.isMine() ) return true; // 特性「すりぬけ」

    return false;
  }

  mistTerrainCheck(): boolean {
    if ( !main.field.terrain.isMisty() ) return true;
    if ( !this.isGround() ) return true;
    return false;
  }

  //-----------
  // 状態異常付与
  //-----------
  isGetAilmentByOther( ailment: StatusAilmentText, other: Pokemon ): boolean {
    if ( ailment === null ) return false;
    if ( !this._statusAilment.isHealth() ) return false;

    const abilityCheck = (): boolean => {
      if ( this._ability.isName( 'Shield Dust' ) ) return false; // 特性「りんぷん」
      if ( this._ability.isName( 'Purifying Salt' ) ) return false; // 特性「きよめのしお」
      if ( this._ability.isName( 'Comatose' ) ) return false; // 特性「ぜったいねむり」
      if ( this._ability.isName( 'Leaf Guard' )  && main.field.weather.isSunny( this ) ) return false; // 特性「リーフガード」
      //if ( this._ability.isName( 'リミットシールド' ) && this._name === 'メテノ(流星)' ) return false;
      if ( main.isExistAbilityInSide( this.isMine(), 'Flower Veil' ) && this._type.has( 'Grass' ) ) return false; // 特性「フラワーベール」

      return true;
    }

    const eachCheck = ( ailment: StatusAilmentText ): boolean => {
      switch ( ailment ) {
        case 'Paralysis':
          if ( this._type.has( 'Electric' ) ) return false;
          break;

        case 'Frozen':
          if ( this._type.has( 'Ice' ) ) return false;
          if ( main.field.weather.isSunny( this ) ) return false;
          if ( this._ability.isName( 'Magma Armor' ) ) return false; // 特性「マグマのよろい」
          break;

        case 'Burned':
          if ( this._type.has( 'Fire' ) ) return false;
          if ( this._ability.isName( 'Water Veil' ) ) return false; // 特性「みずのベール」
          if ( this._ability.isName( 'Water Bubble' ) ) return false; // 特性「すいほう」
          break;

        case 'Poisoned':
          if ( this._ability.isName( 'Immunity' ) ) return false; // 特性「めんえき」
          if ( main.isExistAbilityInSide( this.isMine(), 'Pastel Veil' ) ) return false; // 特性「パステルベール」
          if ( this._type.has( 'Poison' ) ) return false;
          if ( this._type.has( 'Steel' ) ) return false;
          break;

        case 'Asleep':
          if ( this._ability.isName( 'Vital Spirit' ) ) return false; // 特性「やるき」
          if ( this._ability.isName( 'Insomnia' ) ) return false; // 特性「ふみん」
          if ( main.isExistAbilityInSide( this.isMine(), 'Sweet Veil' ) ) return false; // 特性「スイートベール」
          if ( main.field.terrain.isElectric() && this.isGround() ) return false;
          if ( main.isUproar() ) return false;
          break;

        default:
          break;
      }

      return true;
    }

    return this.safeGuardCheck( other ) && this.mistTerrainCheck() && abilityCheck() && eachCheck( ailment );
  }

  getAilmentByAdditionalEffect( ailmentName: string, other: Pokemon ): void {

    switch ( ailmentName ) {
      case 'paralysis':
        if ( !this.isGetAilmentByOther( 'Paralysis', other ) ) return;
        this._statusAilment.getParalysis();
        break;

      case 'burn':
        if ( !this.isGetAilmentByOther( 'Burned', other ) ) return;
        this._statusAilment.getBurned( );
        break;

      case 'freeze':
        if ( !this.isGetAilmentByOther( 'Frozen', other ) ) return;
        this._statusAilment.getFrozen();
        break;

      case 'sleep':
        if ( !this.isGetAilmentByOther( 'Asleep', other ) ) return;
        this._statusAilment.getAsleep();
        break;

      case 'poison':
        if ( !this.isGetAilmentByOther( 'Poisoned', other ) ) return;
        if ( other.move.selected.name === 'Poison Fang' ) { // どくどくのキバ
          this._statusAilment.getBadPoisoned();
        } else {
          this._statusAilment.getPoisoned();
        }
        break;

      default:
        break;
    }
  }

  getAilmentByStatusMove( ailmentName: string ): void {

    switch ( ailmentName ) {
      case 'paralysis':
        this._statusAilment.getParalysis();
        break;

      case 'burn':
        this._statusAilment.getBurned( );
        break;

      case 'freeze':
        this._statusAilment.getFrozen();
        break;

      case 'sleep':
        this._statusAilment.getAsleep();
        break;

      case 'poison':
        this._statusAilment.getPoisoned();
        break;

      case 'confusion':
        this.getConfusion();
        break;

      case 'tar-shot':
        this.stateChange.tarShot.onActivate( this );
        break;

      case 'ingrain':
        this.stateChange.ingrain.onActivate( this );
        break;

      default:
        break;
    }
  }






  //--------
  // こんらん
  //--------
  isGetConfusionByAdditionalEffect( other: Pokemon ): boolean {

    if ( this._stateChange.confuse.isTrue ) return false;
    if ( this._ability.isName( 'Own Tempo' ) ) return false; // 特性「マイペース」

    return this.safeGuardCheck( other ) && this.mistTerrainCheck();
  }

  getConfusion(): void {
    this._stateChange.getConfusion( this.getArticle() );
  }



  //--------
  // メロメロ
  //--------
  isGetAttract( other: Pokemon ): boolean {
    if ( this._gender === 'genderless' ) return false;
    if ( other.gender === 'genderless' ) return false;
    if ( this._gender === other.gender ) return false;
    if ( this.isMine() === other.isMine() ) return false;
    if ( this._stateChange.attract.isTrue ) return false;
    if ( this._ability.isName( 'Oblivious' ) ) return false; // 特性「どんかん」
    if ( !main.isExistAbilityInSide( this.isMine(), 'Aroma Veil' ) ) return false; // 特性「アロマベール」

    return true;
  }

  getAttract( other: Pokemon ): void {
    this._stateChange.attract.beTrue( other.order );
    this.msgAttract();

    if ( !this._item.isName( 'あかいいと' ) ) return;
    if ( !other.isGetAttract( this ) ) return;

    other.getAttract( this );
  }


  //--------------
  // フォルムチェンジ
  //--------------
  getNextForm(): PokemonText {
    if ( this._name === 'Aegislash Shield' )   return 'Aegislash Blade';
    if ( this._name === 'Aegislash Blade' )    return 'Aegislash Shield';
    if ( this._name === 'Meloetta Aria' )      return 'Meloetta Pirouette';
    if ( this._name === 'Meloetta Pirouette' ) return 'Meloetta Aria';
    if ( this._name === 'Mimikyu Disguised' )  return 'Mimikyu Busted'
    if ( this._name === 'Cramorant Gulping' )  return 'Cramorant';
    if ( this._name === 'Cramorant Gorging' )  return 'Cramorant';
    if ( this._name === 'Eiscue Ice' )         return 'Eiscue Noice';
    if ( this._name === 'Eiscue Noice' )       return 'Eiscue Ice';

    return this._name;
  }

  formChange(): void {
    const nextForm: PokemonText = this.getNextForm();
    if ( nextForm === this._name ) return;

    this._name = nextForm;
    const pokemon: PokemonData = this.getMaster();
    this._type.list = pokemon.type;
    this._ability.setOrg( abilityTextList.filter( name => name === pokemon.ability[0] )[0] );
    this._status.formChange( pokemon.baseStatus, this._level, this.getNatureMaster() );
  }

  msgAegislashSchild(): void {
    writeLog( `ブレードフォルム チェンジ!` );
  }
  msgAegislashBlade(): void {
    writeLog( `シールドフォルム チェンジ!` );
  }
  msgRelicSong(): void {
    writeLog( `${this.getArticle()}の 姿が 変化した!` );
  }
  msgDisguise(): void {
    writeLog( `${this.getArticle()}の ばけのかわが はがれた!` );
  }
  msgIceFace(): void {
    writeLog( `${this.getArticle()}の 姿が 変化した!` );
  }


  //-------------
  // きのみを食べる
  //-------------
  getRipen(): number {
    return ( this._ability.isName( 'Ripen' ) )? 2 : 1; // 特性「じゅくせい」
  }
  getChangeValueByBerry( denominator: number ): number {
    const value: number = Math.floor( this.getOrgHP() / denominator ) * this.getRipen();
    return value;
  }

  eatBerryJuice(): void {
    this._status.hp.value.add( 10 );
    this.msgAddHPByItem( 'きのみジュース' );
  }
  eatCheriBerry(): void {
    this._statusAilment.getHealth( 'クラボのみ' );
  }
  eatChestoBerry(): void {
    this._statusAilment.getHealth( 'カゴのみ' );
  }
  eatPechaBerry(): void {
    if ( !this._statusAilment.isPoisoned() && !this._statusAilment.isBadPoisoned() ) return;
    this._statusAilment.getHealth( 'モモンのみ' );
  }
  eatRawstBerry(): void {
    this._statusAilment.getHealth( 'チーゴのみ' );
  }
  eatAspearBerry(): void {
    this._statusAilment.getHealth( 'ナナシのみ' );
  }
  eatLeppaBerry(): void {
    // ヒメリのみ
  }
  eatOranBerry(): void {
    this._status.hp.value.add( 10 * this.getRipen() );
    this.msgAddHPByItem( 'オレンのみ' );
  }
  eatPersimBerry(): void {
    // キーのみ
  }
  eatLumBerry(): void {
    this._statusAilment.getHealth( 'ラムのみ' );
    // 混乱を治す
  }
  eatSitrusBerry(): void {
    const value: number = this.getChangeValueByBerry( 4 );
    this._status.hp.value.add( value );
    this.msgAddHPByItem( 'オボンのみ' );
  }
  eatFigyBerry(): void {
    const value: number = this.getChangeValueByBerry( 3 );
    this._status.hp.value.add( value );
    this.msgAddHPByItem( 'フィラのみ' );
  }
  eatWikiBerry(): void {
    const value: number = this.getChangeValueByBerry( 3 );
    this._status.hp.value.add( value );
    this.msgAddHPByItem( 'ウイのみ' );
  }
  eatMagoBerry(): void {
    const value: number = this.getChangeValueByBerry( 3 );
    this._status.hp.value.add( value );
    this.msgAddHPByItem( 'マゴのみ' );
  }
  eatAguavBerry(): void {
    const value: number = this.getChangeValueByBerry( 3 );
    this._status.hp.value.add( value );
    this.msgAddHPByItem( 'バンジのみ' );
  }
  eatIapapaBerry(): void {
    const value: number = this.getChangeValueByBerry( 3 );
    this._status.hp.value.add( value );
    this.msgAddHPByItem( 'イアのみ' );
  }
  eatLiechiBerry(): void {
    this.changeRank( 'atk', this.getRipen() , 'チイラのみ' );
  }
  eatGanlonBerry(): void {
    this.changeRank( 'def', this.getRipen() , 'リュガのみ' );
  }
  eatSalacBerry(): void {
    this.changeRank( 'spe', this.getRipen() , 'カムラのみ' );
  }
  eatPetayaBerry(): void {
    this.changeRank( 'spA', this.getRipen() , 'ヤタピのみ' );
  }
  eatApicotBerry(): void {
    this.changeRank( 'spD', this.getRipen() , 'ズアのみ' );
  }
  eatLansatBerry(): void {
    // サンのみ
  }
  eatStarfBerry(): void {
    // スターのみ
  }
  eatEnigmaBerry(): void {
    const value: number = this.getChangeValueByBerry( 4 );
    this._status.hp.value.add( value );
    this.msgAddHPByItem( 'ナゾのみ' );
  }
  eatMicleBerry(): void {
    // ミクルのみ
  }
  eatKeeBerry(): void {
    this.changeRank( 'def', this.getRipen() , 'アッキのみ' );
  }
  eatMarangaBerry(): void {
    this.changeRank( 'spD', this.getRipen() , 'タラプのみ' );
  }



  //-----------
  // 手持ちに戻る
  //-----------
  isFainted(): boolean {
    if ( !this._status.hp.value.isZero() ) return false;

    this.msgFainted();
    return true;
  }

  toHand(): void {
    const naturalCure = (): void => {
      if ( !this._ability.isName( 'Natural Cure' ) ) return; // 特性「しぜんかいふく」
      this._statusAilment.getHealth();
    }

    const regenerator = (): void => {
      if ( !this._ability.isName( 'Regenerator' ) ) return; // 特性「さいせいりょく」
      const value: number = Math.floor( this.getOrgHP() / 3 );
      this._status.hp.value.add( value );
    }

    if ( !this._status.hp.value.isZero() ) {
      naturalCure(); // しぜんかいふく
      regenerator(); // さいせいりょく
      this.msgToHand()
    }

    // 情報のリセット
    // pokemon.ability = pokemon.statusOrg.ability;
    // pokemon.type1 = pokemon.statusOrg.type1;
    // pokemon.type2 = pokemon.statusOrg.type2;
    // pokemon.command = new Command;
    // pokemon.damage = [];
    // pokemon.moveUsed = new AvailableMove;
    this._status.resetRank();

    this._order.battle = null;
    const hand: number = this._order.hand;
    this._order.hand = main.field.numberOfPokemon;
    main.getPlayer( this.isMine() ).cycleHand( hand );
  }

  //-------------
  // バトル場に出る
  //-------------
  toBattleField( battle: number ): void {
    this.order.battle = battle;

    const hand: number = this.order.hand;
    for ( const pokemon of main.getParty( this.isMine() ) ) {
      if ( pokemon.order.hand < hand ) {
        pokemon.order.hand += 1;
      }
    }
    this.order.hand = 0;

    if ( this.isMine() ) {
      getHTMLInputElement( 'battleMyImage_' + battle ).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + this.getMaster().id + '.png';
    } else {
      getHTMLInputElement( 'battleOpponentImage_' + battle ).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + this.getMaster().id + '.png';
    }

    this.msgToBattleField();
  }


  //--------------
  // 追加効果発動判定
  //--------------
  isAdditionalEffect = ( target: Pokemon, attack: Attack ): boolean => {
    if ( this._stateChange.sheerForce.isTrue ) return false;
    if ( target.status.hp.value.isZero() ) return false;
    if ( attack.substitute ) return false ;
    if ( target.ability.isName( 'Shield Dust' ) ) return false; // 特性「りんぷん」
    if ( target.item.isName( 'おんみつマント' ) ) return false;

    return true;
  }

  sereneGrace = (): number => {
    if ( this._ability.isName( 'Serene Grace' ) ) return 2; // 特性「てんのめぐみ」
    else return 1;
  }

  rainbow = (): number => {
    if ( this._move.selected.name === 'Secret Power' ) return 1; // 技「ひみつのちから」
    if ( main.field.getSide( this.isMine() ).rainbow.isTrue ) return 2;
    else return 1;
  }

  isAdditionalRate = ( moveRate: number ): boolean => {
    const base: number = moveRate * this.sereneGrace() * this.rainbow();

    return getRandom() < base;
  }

  isAdditionalFlinch = ( moveRate: number ): boolean => {
    const base: number = moveRate * this.sereneGrace() * this.rainbow();
    const flinchBase: number = Math.min( base, moveRate * 2 );

    return getRandom() < flinchBase;
  }








  getMaster(): PokemonData {
    return pokemonMaster.filter( p => p.nameEN === this._name )[0];
  }
  getNatureMaster(): NatureData {
    return natureMaster.filter( n => n.nameEN === this._nature )[0];
  }

  getWeight(): number {
    const master = this.getMaster();
    let weight = master.weight;

    // ボディパージ
    if ( this._ability.isName( 'Light Metal' ) ) { // 特性「ライトメタル」
      weight = weight / 2;
    }
    if ( this._ability.isName( 'Heavy Metal' ) ) { // 特性「ヘヴィメタル」
      weight = weight * 2;
    }
    if ( this._item.isName( 'かるいし' ) ) {
      weight = weight - 100;
    }

    return Math.max( 0.1, weight );
  }


  isContact(): boolean {
    return this._move.selected.getMaster().contact && !this._ability.isName( 'Long Reach' ); // 特性「えんかく」
  }

  isGround(): boolean {
    if ( this._stateChange.ingrain.isTrue === true ) return true;
    if ( this._stateChange.smackDown.isTrue === true ) return true;
    if ( main.field.whole.gravity.isTrue === true ) return true;
    if ( this._item.isName( 'くろいてっきゅう' ) ) return true;

    if ( this._type.has( 'Flying' ) ) return false;
    if ( this._ability.isName( 'Levitate' ) ) return false; // 特性「ふゆう」
    if ( this._item.isName( 'ふうせん' ) ) return false;
    if ( this._stateChange.magnetRise.isTrue ) return false;
    if ( this._stateChange.telekinesis.isTrue ) return false;

    return true;
  }

  onActivateWhenLanding(): void {
    if ( !this.ability.isValid() ) return;

    switch ( this.ability.name ) {
      // 場に出たときに発動する特性
      case 'Drizzle': // 特性「あめふらし」
        if ( main.field.weather.isGetRainy() ) {
          this.msgDeclareAbility();
          main.field.weather.getRainy( this );
        }
        break;

      case 'Intimidate': // 特性「いかく」
        this.msgDeclareAbility();
        break;

      case 'Air Lock': // 特性「エアロック」
        this.msgDeclareAbility();
        writeLog( `天候の影響が なくなった!` );
        break;

      case 'Electric Surge': // 特性「エレキメイカー」
        if ( !main.field.terrain.isElectric() ) {
          this.msgDeclareAbility();
          main.field.terrain.getElectric( this );
        }
        break;

      case 'Aura Break': // 特性「オーラブレイク」
        this.msgDeclareAbility();
        writeLog( `${this.getArticle()}は すべての オーラを 制圧する!` );
        break;

      case 'Frisk': // 特性「おみとおし」
        this.msgDeclareAbility();
        break;

      case 'Desolate Land': // 特性「おわりのだいち」
        if ( main.field.weather.isGetBadSunny() ) {
          this.msgDeclareAbility();
          main.field.weather.getBadSunny();
        }
        break;

      case 'Mold Breaker': // 特性「かたやぶり」
        this.msgDeclareAbility();
        writeLog( `${this.getArticle()}は かたやぶりだ!` );
        break;

      case 'Imposter': // 特性「かわりもの」
        this.msgDeclareAbility();
        break;

      case 'Anticipation': // 特性「きけんよち」
        this.msgDeclareAbility();
        break;

      case 'Curious Medicine': // 特性「きみょうなくすり」
        this.msgDeclareAbility();
        break;

      case 'Grassy Surge': // 特性「グラスメイカー」
        if ( !main.field.terrain.isGrassy() ) {
          this.msgDeclareAbility();
          main.field.terrain.getGrassy( this );
        }
        break;

      case 'Psychic Surge': // 特性「サイコメイカー」
        if ( !main.field.terrain.isPsychic() ) {
          this.msgDeclareAbility();
          main.field.terrain.getPsychic( this );
        }
        break;

      case 'Slow Start': // 特性「スロースタート」
        this.msgDeclareAbility();
        break;

      case 'Sand Stream': // 特性「すなあらし」
        if ( main.field.weather.isGetSandy() ) {
          this.msgDeclareAbility();
          main.field.weather.getSandy( this );
        }
        break;

      case 'Comatose': // 特性「ぜったいねむり」
        this.msgDeclareAbility();
        break;

      /* case 'Feldherr': // 特性「そうだいしょう」
        this.msgDeclareAbility();
        break;
      */

      case 'Dark Aura': // 特性「ダークオーラ」
        this.msgDeclareAbility();
        writeLog( `${this.getArticle()}は ダークオーラを 放っている!` );
        break;

      case 'Turboblaze': // 特性「ターボブレイズ」
        this.msgDeclareAbility();
        writeLog( `${this.getArticle()}は 燃え盛る オーラを 放っている!` );
        break;

      case 'Download': // 特性「ダウンロード」
        this.msgDeclareAbility();
        break;

      case 'Teravolt': // 特性「テラボルテージ」
        this.msgDeclareAbility();
        writeLog( `${this.getArticle()}は 弾ける オーラを 放っている!` );
        break;

      case 'Delta Stream': // 特性「デルタストリーム」
        if ( main.field.weather.isGetTurbulence() ) {
          this.msgDeclareAbility();
          main.field.weather.getTurbulence();
        }
        break;

      case 'Trace': // 特性「トレース」
        this.msgDeclareAbility();
        break;

      case 'Cloud Nine': // 特性「ノーてんき」
        this.msgDeclareAbility();
        writeLog( `天候の影響が なくなった!` );
        break;

      case 'Primordial Sea': // 特性「はじまりのうみ」
        if ( main.field.weather.isGetBadRainy() ) {
          this.msgDeclareAbility();
          main.field.weather.getBadRainy();
        }
        break;

      case 'Hadron Engine': // 特性「ハドロンエンジン」
        if ( !main.field.terrain.isElectric() ) {
          this.msgDeclareAbility();
          main.field.terrain.getElectric( this );
          writeLog( `${this.getArticle()}は エレキフィールドを はり 未来の機関を 躍動させる!!` );
        } else {
          writeLog( `${this.getArticle()}は エレキフィールドで 未来の機関を 躍動させる!!` );
        }
        break;

      case 'Screen Cleaner': // 特性「バリアフリー」
        this.msgDeclareAbility();
        break;

      case 'Drought': // 特性「ひでり」
        if ( main.field.weather.isGetSunny() ) {
          this.msgDeclareAbility();
          main.field.weather.getSunny( this );
        }
        break;

      case 'Orichalcum Pulse': // 特性「ひひいろのこどう」
        if ( main.field.weather.isGetSunny() ) {
          this.msgDeclareAbility();
          main.field.weather.getSunny( this );
          writeLog( `${this.getArticle()}は ひざしを 強め 古代の鼓動が 暴れ出す!!` );
        } else {
          writeLog( `${this.getArticle()}は ひざしを 受けて 古代の鼓動が 暴れ出す!!` );
        }
        break;

      case 'Fairy Aura': // 特性「フェアリーオーラ」
        this.msgDeclareAbility();
        writeLog( `${this.getArticle()}は フェアリーオーラを 放っている!` );
        break;

      case 'Dauntless Shield': // 特性「ふくつのたて」
        if ( this.isChangeRank( 'def', 1 ) ) {
          this.changeRank( 'def', 1 );
          this.msgDeclareAbility();
        }
        break;

      case 'Intrepid Sword': // 特性「ふとうのけん」
        if ( this.isChangeRank( 'atk', 1 ) ) {
          this.changeRank( 'atk', 1 );
          this.msgDeclareAbility();
        }
        break;

      case 'Pressure': // 特性「プレッシャー」
        this.msgDeclareAbility();
        writeLog( `${this.getArticle()}は プレッシャーを 放っている!` );
        break;

      case 'Zero to Hero': // 特性「マイティチェンジ」
        if ( this.extraParameter.zeroToHero ) {
          this.msgDeclareAbility();
          writeLog( `${this.getArticle()}は 変身して 帰ってきた!` );
        }
        break;

      case 'Misty Surge': // 特性「ミストメイカー」
        if ( !main.field.terrain.isMisty() ) {
          this.msgDeclareAbility();
          main.field.terrain.getMisty( this );
        }
        break;

      case 'Snow Warning': // 特性「ゆきふらし」
        if ( main.field.weather.isGetSnowy() ) {
          this.msgDeclareAbility();
          main.field.weather.getSnowy( this );
        }
        break;

      case 'Forewarn': // 特性「よちむ」
        this.msgDeclareAbility();
        break;

      case 'Vessel of Ruin': // 特性「わざわいのうつわ」
        this.msgDeclareAbility();
        writeLog( `${this.getArticle()}の わざわいのうつわで まわりの 特攻が 弱まった!` );
        break;

      case 'Tablets of Ruin': // 特性「わざわいのおふだ」
        this.msgDeclareAbility();
        writeLog( `${this.getArticle()}の わざわいのおふだで まわりの 攻撃が 弱まった!` );
        break;

      case 'Beads of Ruin': // 特性「わざわいのたま」
        this.msgDeclareAbility();
        writeLog( `${this.getArticle()}の わざわいのたまで まわりの 特防が 弱まった!` );
        break;

      case 'Sword of Ruin': // 特性「わざわいのつるぎ」
        this.msgDeclareAbility();
        writeLog( `${this.getArticle()}の わざわいのつるぎで まわりの 防御が 弱まった!` );
        break;

      // 状態異常を治す特性
      case 'Limber': // 特性「じゅうなん」
        this.msgDeclareAbility();
        break;

      case 'Water Bubble': // 特性「すいほう」
        this.msgDeclareAbility();
        break;

      case 'Thermal Exchange': // 特性「ねつこうかん」
        this.msgDeclareAbility();
        break;

      case 'Pastel Veil': // 特性「パステルベール」
        this.msgDeclareAbility();
        break;

      case 'Insomnia': // 特性「ふみん」
        this.msgDeclareAbility();
        break;

      case 'Magma Armor': // 特性「マグマのよろい」
        this.msgDeclareAbility();
        break;

      case 'Water Veil': // 特性「みずのベール」
        this.msgDeclareAbility();
        break;

      case 'Immunity': // 特性「めんえき」
        this.msgDeclareAbility();
        break;

      case 'Vital Spirit': // 特性「やるき」
        this.msgDeclareAbility();
        break;

      default:
        break;
    }
  }
}






