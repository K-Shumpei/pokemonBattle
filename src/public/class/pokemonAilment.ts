
class StatusAilment {
  name: StatusAilmentText = null;
  turn: number = 0;
  rest: boolean = false; // 技「ねむる」により眠った場合
  defrost: boolean = false; // 氷を解かす技
  pokeName: string = '';

  reset(): void {
    this.name = null;
    this.turn = 0;
    this.rest = false;
    this.defrost = false;
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

  getHealth( item?: string, move?: string ): void {

    switch ( this.name ) {
      case 'Paralysis':
        if ( item ) battleLog.write( `${this.pokeName}は ${item}で まひが 治った!` );
        else battleLog.write( `${this.pokeName}は まひが 治った!` );
        break;

      case 'Frozen':
        if ( item ) battleLog.write( `${this.pokeName}は ${item}で こおり状態が 治った!` );
        else if ( move ) battleLog.write( `${this.pokeName}の ${move}で こおりが 解けた!` );
        else battleLog.write( `${this.pokeName}は こおり状態が 治った!` );
        break;

      case 'Burned':
        if ( item ) battleLog.write( `${this.pokeName}は ${item}で やけどが 治った!` );
        else battleLog.write( `${this.pokeName}は やけどが 治った!` );
        break;

      case 'Poisoned':
        if ( item ) battleLog.write( `${this.pokeName}は ${item}で 毒が 治った!` );
        else battleLog.write( `${this.pokeName}は 毒が 治った!` );
        break;

      case 'Asleep':
        if ( item )
        battleLog.write( `${this.pokeName}は 目を 覚ました!` );
        break;

      default:
        break;
    }

    this.reset();
  }

  getParalysis(): void {
    this.name = 'Paralysis';
    battleLog.write( `${this.pokeName}は まひして 技が でにくくなった!` );
  }

  getFrozen(): void {
    this.name = 'Frozen';
    battleLog.write( `${this.pokeName}は 凍りついた!` );
  }

  getBurned( item?: string ): void {
    this.name = 'Burned';
    if ( item ) {
      battleLog.write( `${this.pokeName}は ${item}で やけどを 負った!` );
    } else {
      battleLog.write( `${this.pokeName}は やけどを 負った!` );
    }
  }

  getPoisoned(): void {
    this.name = 'Poisoned';
    battleLog.write( `${this.pokeName}は 毒を あびた!` );
  }

  getBadPoisoned( item?: string ): void {
    this.name = 'Poisoned';
    this.turn = 1;
    if ( item ) {
      battleLog.write( `${this.pokeName}は ${item}で 猛毒を あびた!` );
    } else {
      battleLog.write( `${this.pokeName}は 猛毒を あびた!` );
    }
  }

  getAsleep(): void {
    this.name = 'Asleep';
    battleLog.write( `${this.pokeName}は 眠ってしまった!` );
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
    battleLog.write( `${this.pokeName}は 眠って 元気に なった!` );
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
      battleLog.write( `${pokemon.getArticle()}は 毒の ダメージを受けた!` );
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
    battleLog.write( `${pokemon.getArticle()}は やけどの ダメージを 受けた!` );
  }

  isEffectiveAsleep( pokemon: Pokemon ): boolean {
    if ( !this.isAsleep() ) return false;

    const turn = (): number => {
      if ( pokemon.ability.isName( 'Early Bird' ) ) { // 特性「はやおき」
        return 2;
      } else {
        return 1;
      }
    }

    this.turn -= turn();

    if ( this.turn <= 0 ) {
      this.getHealth();
      return false;
    }

    if ( pokemon.move.selected.getAddOn().sleepingMove ) {
      return false;
    } else {
      battleLog.write( `${pokemon.getArticle()}は ぐうぐう 眠っている` );
      return true;
    }
  }

  onSleepingMoveMsg( pokemon: Pokemon ): void {
    if ( pokemon.move.selected.getAddOn().sleepingMove ) {
      battleLog.write( `${pokemon.getArticle()}は ぐうぐう 眠っている` );
    }
  }

  isEffectiveFrozen( pokemon: Pokemon ): boolean {
    if ( !this.isFrozen() ) return false;

    const isBurnUp = (): boolean => {
      if ( pokemon.move.selected.name === 'Burn Up' && !pokemon.type.has( 'Fire' ) ) {
        return false;
      } else {
        return true;
      }
    }

    // 確率で回復
    if ( getRandom() < 20 ) {
      pokemon.statusAilment.getHealth();
      return false;
    }

    // 氷を解かす技
    if ( pokemon.move.selected.getMaster().defrost && isBurnUp() ) {
      this.defrost = true;
      return false;
    }

    // 解けない
    battleLog.write( `${pokemon.getArticle()}は 凍ってしまって 動けない!` );
    return true;
  }

  onDefrost( pokemon: Pokemon ): void {
    if ( !this.defrost ) return;
    this.getHealth( undefined, pokemon.move.selected.translate() );
  }

  isEffectiveParalysis( pokemon: Pokemon ): boolean {
    if ( !this.isParalysis() ) return false;
    if ( getRandom() < 3/4 * 100 ) return false;

    battleLog.write( `${pokemon.getArticle()}は 体がしびれて 動かない!` );
    return true;
  }
}
