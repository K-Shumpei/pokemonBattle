class Main {
  _me: Player;
  _opp: Player;
  _field: Field;

  constructor() {
    this._me = new Player( true );
    this._opp = new Player( false );
    this._field = new Field();
  }

  get me(): Player {
    return this._me;
  }
  get opp(): Player {
    return this._opp;
  }
  get field(): Field {
    return this._field;
  }

  setHost( host: boolean ): void {
    this._me.setHost( host );
    this._opp.setHost( !host );
    this._field.setHost( host );
  }

  sortUnique( pokeList: Pokemon[] ): Pokemon[] {
    const result = pokeList.sort( ( a, b ) => {
      // トレーナー
      if ( a.host ) return -1;
      if ( b.host ) return 1;
      // パーティの並び順
      if ( a.order.party > b.order.party ) return -1;
      return 1;
    })

    return result;
  }

  getPlayer( isMe: boolean ): Player {
    return ( isMe )? this._me : this._opp;
  }

  getParty( isMe: boolean ): Pokemon[] {
    return ( isMe )? this._me.pokemon : this._opp.pokemon;
  }

  getPokemonInBattle(): Pokemon[] {
    const me: Pokemon[] = this._me.pokemon.filter( p => p.order.battle !== null );
    const opp: Pokemon[] = this._opp.pokemon.filter( p => p.order.battle !== null );
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

  isExistByBattle( isMe: boolean, battle: number ): boolean {
    const pokemon: Pokemon[] = this.getParty( isMe );
    return pokemon.filter( p => p.order.battle === battle ).length === 1;
  }

  isExistAbility( name: string ): boolean {
    return this.getPokemonInBattle().filter( p => p.ability.isName( name ) ).length > 0;
  }
  getExistAbility( name: string ): Pokemon {
    return this.getPokemonInBattle().filter( p => p.ability.isName( name ) )[0];
  }

  isExistAbilityInSide( isMe: boolean, name: string ): boolean {
    return this.getPokemonInSide( isMe ).filter( p => p.ability.isName( name ) ).length > 0;
  }
  getExistAbilityInSide( isMe: boolean, name: string ): Pokemon {
    return this.getPokemonInSide( isMe ).filter( p => p.ability.isName( name ) )[0];
  }

  calcSpeed(): void {
    for ( const pokemon of this.getPokemonInBattle() ) {
      let corr: number = 4096;

      if ( pokemon.ability.isName( 'ようりょくそ' ) && this._field.weather.isSunny( pokemon ) ) {
        corr = Math.round( corr * 8192 / 4096 );
      }
      if ( pokemon.ability.isName( 'すいすい' ) && this._field.weather.isRainy( pokemon ) ) {
        corr = Math.round( corr * 8192 / 4096 );
      }
      if ( pokemon.ability.isName( 'すなかき' ) && this._field.weather.isSandy() ) {
        corr = Math.round( corr * 8192 / 4096 );
      }
      if ( pokemon.ability.isName( 'ゆきかき' ) && this._field.weather.isSnowy() ) {
        corr = Math.round( corr * 8192 / 4096 );
      }
      if ( pokemon.ability.isName( 'サーフテール' ) && this._field.terrain.isElectric() ) {
        corr = Math.round( corr * 8192 / 4096 );
      }
      if ( pokemon.ability.isName( 'スロースタート' ) ) {
        corr = Math.round( corr * 2048 / 4096 );
      }
      if ( pokemon.ability.isName( 'かるわざ' ) ) {
        corr = Math.round( corr * 8192 / 4096 );
      }
      if ( pokemon.ability.isName( 'はやあし' ) && !pokemon.statusAilment.isHealth() ) {
        corr = Math.round( corr * 6144 / 4096 );
      }
      if ( pokemon.ability.isName( 'こだいかっせい' ) ) {
        corr = Math.round( corr * 6144 / 4096 );
      }
      if ( pokemon.ability.isName( 'クォークチャージ' ) ) {
        corr = Math.round( corr * 6144 / 4096 );
      }
      if ( pokemon.item.isName( 'スピードパウダー' ) && pokemon.isName( 'メタモン' ) ) {
        corr = Math.round( corr * 8192 / 4096 );
      }
      if ( pokemon.item.isName( 'こだわりスカーフ' ) ) {
        corr = Math.round( corr * 6144 / 4096 );
      }
      if ( pokemon.item.isName( 'くろいてっきゅう' ) ) {
        corr = Math.round( corr * 2048 / 4096 );
      }
      if ( pokemon.item.isName( 'きょうせいギプス' ) ) {
        corr = Math.round( corr * 2048 / 4096 );
      }
      if ( this._field.getSide( pokemon.isMine() ).tailwind.isTrue ) {
        corr = Math.round( corr * 8192 / 4096 );
      }
      if ( this._field.getSide( pokemon.isMine() ).wetlands.isTrue ) {
        corr = Math.round( corr * 1024 / 4096 );
      }

      const paralysis: number = ( pokemon.statusAilment.isParalysis() )? 2048 / 4096 : 1;

      pokemon.status.spe.calcSpeed( corr, paralysis, this._field.whole.trickRoom.isTrue );
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
  _party: Pokemon[];
  _pokemon: Pokemon[];

  constructor( isMe: boolean ) {
    this._party = [
      new Pokemon( 0, isMe ),
      new Pokemon( 1, isMe ),
      new Pokemon( 2, isMe ),
      new Pokemon( 3, isMe ),
      new Pokemon( 4, isMe ),
      new Pokemon( 5, isMe )
    ]
    this._pokemon = [];
  }

  get party(): Pokemon[] {
    return this._party;
  }
  get pokemon(): Pokemon[] {
    return this._pokemon;
  }

  setHost( host: boolean ): void {
    for ( const pokemon of this._pokemon ) {
      pokemon._host = host;
    }
  }

  showHandInfo(): void {
    for ( const pokemon of this._pokemon ) {
      pokemon.showHandInfo();
    }
  }

  showCommand1stField(): void {
    // 送信ボタンの非活性化
    getHTMLInputElement( 'sendCommandButton' ).disabled = false;

    for ( let i = 0; i < this._pokemon.length; i++ ) {

      if ( this._pokemon.filter( poke => poke.order.battle === i ).length === 0 ) continue;
      const pokemon: Pokemon = this._pokemon.filter( poke => poke.order.battle === i )[0]

      // 技・控え
      getHTMLInputElement( 'command1st_' + i ).style.visibility = 'visible';

      if ( pokemon.order.battle === null ) return;
      pokemon.move.showCommand1st( pokemon.order.battle );


      // 控え
      const reserve = this._pokemon.filter( poke => poke.order.battle === null && !poke.status.hp.value.isZero() );
      for ( let j = 0; j < reserve.length; j++ ) {
        if ( reserve[j].name === null ) continue;
        getHTMLInputElement( 'reserveRadio_' + i + '_' + j ).disabled = false;
        getHTMLInputElement( 'reserveText_' + i + '_' + j ).textContent = reserve[j].translateName( String( reserve[j].name ) );
        getHTMLInputElement( 'reserveText_' + i + '_' + j ).value = String( reserve[j].order.party );
      }
    }
  }

  isExcangable(): boolean {
    return this._pokemon.filter( p => p.order.battle === null && !p.status.hp.value.isZero() ).length > 0;
  }

  cycleHand( hand: number ): void {
    for ( const pokemon of this._pokemon ) {
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
