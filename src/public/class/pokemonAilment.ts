
class StatusAilment {
  name: StatusAilmentText = null;
  turn: number = 0;
  rest: boolean = false; // 技「ねむる」により眠った場合
  pokeName: string = '';

  reset(): void {
    this.name = null;
    this.turn = 0;
    this.rest = false;
  }

  isHealth(): boolean {
    return this.name === null;
  }

  isParalysis(): boolean {
    return this.name === 'Paralysis';
  }

  isFrozen(): boolean {
    return this.name === 'Frozen';
  }

  isBurned(): boolean {
    return this.name === 'Burned';
  }

  isPoisoned(): boolean {
    return this.name === 'Poisoned';
  }

  isBadPoisoned(): boolean {
    return this.name === 'Poisoned' && this.turn > 0;
  }

  isAsleep(): boolean {
    return this.name === 'Asleep';
  }

  getHealth( item?: string ): void {
    switch ( this.name ) {
      case 'Paralysis':
        if ( item ) writeLog( `${this.pokeName}は ${item}で まひが 治った!` );
        else writeLog( `${this.pokeName}は まひが 治った!` );
        break;

      case 'Frozen':
        if ( item ) writeLog( `${this.pokeName}は ${item}で こおり状態が 治った!` );
        else writeLog( `${this.pokeName}は こおり状態が 治った!` );
        break;

      case 'Burned':
        if ( item ) writeLog( `${this.pokeName}は ${item}で やけどが 治った!` );
        else writeLog( `${this.pokeName}は やけどが 治った!` );
        break;

      case 'Poisoned':
        if ( item ) writeLog( `${this.pokeName}は ${item}で 毒が 治った!` );
        else writeLog( `${this.pokeName}は 毒が 治った!` );
        break;

      case 'Asleep':
        if ( item )
        writeLog( `${this.pokeName}は 目を 覚ました!` );
        break;

      default:
        break;
    }

    this.reset();
  }

  getParalysis(): void {
    this.name = 'Paralysis';
    writeLog( `${this.pokeName}は まひして 技が でにくくなった!` );
  }

  getFrozen(): void {
    this.name = 'Frozen';
    writeLog( `${this.pokeName}は 凍りついた!` );
  }

  getBurned(): void {
    this.name = 'Burned';
    writeLog( `${this.pokeName}は やけどを 負った!` );
  }

  getPoisoned(): void {
    this.name = 'Poisoned';
    writeLog( `${this.pokeName}は 毒を あびた!` );
  }

  getBadPoisoned(): void {
    this.name = 'Poisoned';
    this.turn = 1;
    writeLog( `${this.pokeName}は 猛毒を あびた!` );
  }

  getAsleep(): void {
    this.name = 'Asleep';
    writeLog( `${this.pokeName}は 眠ってしまった!` );
  }

  countPoisoned(): void {
    this.turn += 1;
  }

  copyAilment( ailment: StatusAilment ): void {
    if ( ailment.isAsleep() ) this.getAsleep();
    if ( ailment.isBurned() ) this.getBurned();
    if ( ailment.isFrozen() ) this.getFrozen();
    if ( ailment.isParalysis() ) this.getParalysis();
    if ( ailment.isPoisoned() ) this.getPoisoned();
    if ( ailment.isBadPoisoned() ) this.getBadPoisoned();

    this.turn = ailment.turn;
  }

  onRest(): void {
    this.name = 'Asleep';
    this.rest = true;
    writeLog( `${this.pokeName}は 眠って 元気に なった!` );
  }

  onEffectivePoisoned( pokemon: Pokemon ): void {
    if ( !this.isPoisoned() ) return;

    const damage = (): number => {
      if ( pokemon.ability.isName( 'Poison Heal' ) ) { // 特性「ポイズンヒール」
        return Math.floor( pokemon.getOrgHP() / 8 );
      }

      if ( this.isBadPoisoned() ) {
        return Math.floor( pokemon.getOrgHP() * Math.min( this.turn, 15 ) / 16 );
      } else {
        return Math.floor( pokemon.getOrgHP() / 8 );
      }
    }

    if ( pokemon.ability.isName( 'Poison Heal' ) ) { // 特性「ポイズンヒール」
      pokemon.msgDeclareAbility();
      pokemon.status.hp.value.add( Math.max( 1, damage() ) );
    } else {
      pokemon.status.hp.value.sub( Math.max( 1, damage() ) );
      writeLog( `${pokemon.getArticle()}は 毒の ダメージを受けた!` );
    }

    if ( this.isBadPoisoned() ) {
      this.turn += 1;
    }
  }

  onEffectiveBurned( pokemon: Pokemon ): void {
    if ( !this.isBurned() ) return;

    const damage = (): number => {
      if ( pokemon.ability.isName( 'Heatproof' ) ) { // 特性「たいねつ」
        return Math.floor( pokemon.getOrgHP() / 32 );
      } else {
        return Math.floor( pokemon.getOrgHP() / 16 );
      }
    }

    pokemon.status.hp.value.sub( Math.max( 1, damage() ) );
    writeLog( `${pokemon.getArticle()}は やけどの ダメージを 受けた!` );
  }
}
