class Main {
  me = new Player( true );
  opp = new Player( false );
  field = new Field();

  setHost( host: boolean ): void {
    this.me.setHost( host );
    this.opp.setHost( !host );
    this.field.setHost( host );
  }

  sortUnique( pokeList: Pokemon[] ): Pokemon[] {
    const result = pokeList.sort( ( a, b ) => {
      // トレーナー
      if ( a.order.host ) return -1;
      if ( b.order.host ) return 1;
      // パーティの並び順
      if ( a.order.party > b.order.party ) return -1;
      return 1;
    })

    return result;
  }

  getPlayer( isMe: boolean ): Player {
    return ( isMe )? this.me : this.opp;
  }

  getParty( isMe: boolean ): Pokemon[] {
    return ( isMe )? this.me.pokemon : this.opp.pokemon;
  }

  getPokemonInBattle(): Pokemon[] {
    const me: Pokemon[] = this.me.pokemon.filter( p => p.order.battle !== null );
    const opp: Pokemon[] = this.opp.pokemon.filter( p => p.order.battle !== null );
    const result: Pokemon[] = me.concat( opp );
    return this.sortUnique( result );
  }

  getPokemonToAttack(): Pokemon[] {
    const pokeList: Pokemon[] = this.getPokemonInBattle().filter( p => p.command.isAttack() );
    return sortByActionOrder( pokeList );
  }

  getPokemonToExchange(): Pokemon[] {
    const pokeList: Pokemon[] = this.getPokemonInBattle().filter( p => p.command.isExchange() );
    return sortByActionOrder( pokeList );
  }

  getPokemonInSide( isMe: boolean ): Pokemon[] {
    const pokemon: Pokemon[] = this.getParty( isMe );
    const result: Pokemon[] = pokemon.filter( p => p.order.battle !== null );
    return this.sortUnique( result );
  }

  getPokemonByParty( isMe: boolean, party: number ): Pokemon {
    const pokemon: Pokemon[] = this.getParty( isMe );
    return pokemon.filter( p => p.order.party === party )[0];
  }

  getPokemonByBattle( attack: Attack ): Pokemon {
    const pokemon: Pokemon[] = this.getParty( attack.isMe );
    return pokemon.filter( p => p.order.battle === attack.battle )[0];
  }

  getPokemonByOrder( order: Order ): Pokemon {
    const pokemon: Pokemon[] = this.getParty( order.isMe );
    return pokemon.filter( p => p.order.battle === order.battle )[0];
  }

  getPokemonOnLanding(): Pokemon[] {
    const pokeList: Pokemon[] = this.getPokemonInBattle().filter( p => p.extraParameter.landing );
    return sortByActionOrder( pokeList );
  }

  isExistByBattle( isMe: boolean, battle: number ): boolean {
    const pokemon: Pokemon[] = this.getParty( isMe );
    return pokemon.filter( p => p.order.battle === battle ).length === 1;
  }

  isExistAbility( name: AbilityText ): boolean {
    return this.getPokemonInBattle().filter( p => p.ability.isName( name ) ).length > 0;
  }
  getExistAbility( name: AbilityText ): Pokemon {
    return this.getPokemonInBattle().filter( p => p.ability.isName( name ) )[0];
  }

  isExistAbilityInSide( isMe: boolean, name: AbilityText ): boolean {
    return this.getPokemonInSide( isMe ).filter( p => p.ability.isName( name ) ).length > 0;
  }
  getExistAbilityInSide( isMe: boolean, name: AbilityText ): Pokemon {
    return this.getPokemonInSide( isMe ).filter( p => p.ability.isName( name ) )[0];
  }

  calcSpeed(): void {
    for ( const pokemon of this.getPokemonInBattle() ) {
      let corr: number = 4096;

      if ( pokemon.ability.isName( 'Chlorophyll' ) && this.field.weather.isSunny( pokemon ) ) { // 特性「ようりょくそ」
        corr = Math.round( corr * 8192 / 4096 );
      }
      if ( pokemon.ability.isName( 'Swift Swim' ) && this.field.weather.isRainy( pokemon ) ) { // 特性「すいすい」
        corr = Math.round( corr * 8192 / 4096 );
      }
      if ( pokemon.ability.isName( 'Sand Rush' ) && this.field.weather.isSandy() ) { // 特性「すなかき」
        corr = Math.round( corr * 8192 / 4096 );
      }
      if ( pokemon.ability.isName( 'Slush Rush' ) && this.field.weather.isSnowy() ) { // 特性「ゆきかき」
        corr = Math.round( corr * 8192 / 4096 );
      }
      if ( pokemon.ability.isName( 'Surge Surfer' ) && this.field.terrain.isElectric() ) { // 特性「サーフテール」
        corr = Math.round( corr * 8192 / 4096 );
      }
      if ( pokemon.ability.isName( 'Slow Start' ) ) { // 特性「スロースタート」
        corr = Math.round( corr * 2048 / 4096 );
      }
      if ( pokemon.ability.isName( 'Unburden' ) ) { // 特性「かるわざ」
        corr = Math.round( corr * 8192 / 4096 );
      }
      if ( pokemon.ability.isName( 'Quick Feet' ) && !pokemon.statusAilment.isHealth() ) { // 特性「はやあし」
        corr = Math.round( corr * 6144 / 4096 );
      }
      if ( pokemon.ability.isName( 'Protosynthesis' ) ) { // 特性「こだいかっせい」
        corr = Math.round( corr * 6144 / 4096 );
      }
      if ( pokemon.ability.isName( 'Quark Drive' ) ) { // 特性「クォークチャージ」
        corr = Math.round( corr * 6144 / 4096 );
      }
      if ( pokemon.isItem( 'スピードパウダー' ) && pokemon.name === 'Ditto' ) { // メタモン
        corr = Math.round( corr * 8192 / 4096 );
      }
      if ( pokemon.isItem( 'こだわりスカーフ' ) ) {
        corr = Math.round( corr * 6144 / 4096 );
      }
      if ( pokemon.isItem( 'くろいてっきゅう' ) ) {
        corr = Math.round( corr * 2048 / 4096 );
      }
      if ( pokemon.isItem( 'きょうせいギプス' ) ) {
        corr = Math.round( corr * 2048 / 4096 );
      }
      if ( this.field.getSide( pokemon.isMine() ).tailwind.isTrue ) {
        corr = Math.round( corr * 8192 / 4096 );
      }
      if ( this.field.getSide( pokemon.isMine() ).wetlands.isTrue ) {
        corr = Math.round( corr * 1024 / 4096 );
      }

      const paralysis: number = ( pokemon.statusAilment.isParalysis() )? 2048 / 4096 : 1;

      pokemon.status.spe.calcSpeed( corr, paralysis, this.field.whole.trickRoom.isTrue );
    }
  }

  isUproar(): boolean {
    for ( const pokemon of this.getPokemonInBattle() ) {
      if ( pokemon.stateChange.uproar.isTrue ) return true;
    }
    return false;
  }
}

class Player {
  party: Pokemon[];
  pokemon: Pokemon[] = [];
  extraCommand: boolean = false;

  constructor( isMe: boolean ) {
    this.party = [
      new Pokemon( isMe, 0 ),
      new Pokemon( isMe, 1 ),
      new Pokemon( isMe, 2 ),
      new Pokemon( isMe, 3 ),
      new Pokemon( isMe, 4 ),
      new Pokemon( isMe, 5 )
    ]
  }

  setHost( host: boolean ): void {
    for ( const pokemon of this.pokemon ) {
      pokemon.order.host = host;
    }
  }

  showHandInfo(): void {
    for ( const pokemon of this.pokemon ) {
      pokemon.showHandInfo();
    }
  }

  showCommand1stField(): void {
    // 送信ボタンの非活性化
    getHTMLInputElement( 'sendCommandButton' ).disabled = false;

    for ( let i = 0; i < this.pokemon.length; i++ ) {

      if ( this.pokemon.filter( poke => poke.order.battle === i ).length === 0 ) continue;
      const pokemon: Pokemon = this.pokemon.filter( poke => poke.order.battle === i )[0]

      // 技・控え
      getHTMLInputElement( 'command1st_' + i ).style.visibility = 'visible';

      if ( pokemon.order.battle === null ) return;
      pokemon.move.showCommand1st( pokemon.order.battle );


      // 控え
      const reserve: Pokemon[] = this.pokemon.filter( poke => poke.order.battle === null && !poke.status.hp.value.isZero() );
      for ( let j = 0; j < reserve.length; j++ ) {
        if ( reserve[j].name === null ) continue;
        getHTMLInputElement( 'reserveRadio_' + i + '_' + j ).disabled = false;
        getHTMLInputElement( 'reserveText_' + i + '_' + j ).textContent = reserve[j].translateName( String( reserve[j].name ) );
        getHTMLInputElement( 'reserveText_' + i + '_' + j ).value = String( reserve[j].order.party );
      }
    }
  }

  showCommandOnlyMe(): void {
    // 途中コマンド
    getHTMLInputElement( 'sendExtraCommandButton' ).disabled = false;

    // 控え
    const reserve: Pokemon[] = this.pokemon.filter( poke => poke.order.battle === null && !poke.status.hp.value.isZero() );

    for ( let i = 0; i < this.pokemon.length; i++ ) {
      for ( let j = 0; j < reserve.length; j++ ) {
        if ( reserve[j].name === null ) continue;
        getHTMLInputElement( 'reserveRadio_' + i + '_' + j ).disabled = false;
        getHTMLInputElement( 'reserveText_' + i + '_' + j ).textContent = reserve[j].translateName( String( reserve[j].name ) );
        getHTMLInputElement( 'reserveText_' + i + '_' + j ).value = String( reserve[j].order.party );
      }
    }
  }

  isExcangable(): boolean {
    return this.pokemon.filter( p => p.order.battle === null && !p.status.hp.value.isZero() ).length > 0;
  }

  cycleHand( hand: number ): void {
    for ( const pokemon of this.pokemon ) {
      if ( pokemon.order.hand > hand ) {
        pokemon.order.hand -= 1;
      }
    }
  }
}


class ElectOrder {
  _order: number[];

  constructor() {
    this._order = [];
  }

  isElected( number: number ): boolean {
    return this._order.some( o => o === number );
  }
  isAllElected(): boolean {
    return this._order.length === fieldStatus.numberOfPokemon;
  }
  elsect( number: number ): void {
    this._order.push( number );
  }
  quit( number: number ): void {
    this._order = this._order.filter( o => o !== number );
  }
  show(): void {
    for ( let i = 0; i < 6; i++ ) {
      const targetText = getHTMLInputElement( 'electedOrder' + i );

      // 選出が0匹の時
      if ( this._order.length === 0 ) {
        targetText.textContent = '';
        continue;
      }

      // 選出が1匹以上の時
      for ( let j = 0; j < this._order.length; j++ ) {
        if ( this._order[j] === i ) {
          targetText.textContent = String( j + 1 ) + '番目';
          break;
        } else {
          targetText.textContent = '';
        }
      }
    }

  }
}

const main = new Main();
const electedOrder = new ElectOrder();


class BattleLog {
  log: string[] = [];

  write( msg: string ): void {
    this.log.push( msg );
  }

  // 非同期関数としてタイマーを実装
  sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 上記の関数をasync/awaitと組み合わせて使用
  output = async () => {
    const output = <HTMLInputElement>document.getElementById( 'battle_log' );
    for ( const log of this.log ) {
      output.value += log + "\n";
      await this.sleep(1000);  // 2秒待機
    }
    output.value += "終了" + "\n\n";
    this.log = [];
  }
}

const battleLog = new BattleLog();
