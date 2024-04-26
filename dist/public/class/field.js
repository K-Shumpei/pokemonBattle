"use strict";
class Weather {
    constructor() {
        this.name = null;
        this.turn = 0;
        this.extend = false;
        this.strong = false;
    }
    reset() {
        this.name = null;
        this.turn = 0;
        this.extend = false;
        this.strong = false;
    }
    isNoWeather() {
        return main.isExistAbility('Cloud Nine') || main.isExistAbility('Air Lock'); // 特性「ノーてんき」、特性「エアロック」
    }
    isPlaim() {
        return this.name === null || this.isNoWeather();
    }
    isSunny(pokemon) {
        if (pokemon.isItem('ばんのうがさ') || this.isNoWeather()) {
            return false;
        }
        else {
            return this.name === 'HarshSunlight';
        }
    }
    isRainy(pokemon) {
        if (pokemon.isItem('ばんのうがさ') || this.isNoWeather()) {
            return false;
        }
        else {
            return this.name === 'Rain';
        }
    }
    isSandy() {
        if (this.isNoWeather()) {
            return false;
        }
        else {
            return this.name === 'Sandstorm';
        }
    }
    isSnowy() {
        if (this.isNoWeather()) {
            return false;
        }
        else {
            return this.name === 'Hail';
        }
    }
    isBadSunny(pokemon) {
        if (pokemon.isItem('ばんのうがさ') || this.isNoWeather()) {
            return false;
        }
        else {
            return this.name === 'HarshSunlight' && this.strong === true;
        }
    }
    isBadRainy(pokemon) {
        if (pokemon.isItem('ばんのうがさ') || this.isNoWeather()) {
            return false;
        }
        else {
            return this.name === 'Rain' && this.strong === true;
        }
    }
    isTurbulence() {
        if (this.isNoWeather()) {
            return false;
        }
        else {
            return this.name === 'Turbulence';
        }
    }
    isGetSunny() {
        if (this.name === 'HarshSunlight')
            return false;
        if (this.strong)
            return false;
        return true;
    }
    isGetRainy() {
        if (this.name === 'Rain')
            return false;
        if (this.strong)
            return false;
        return true;
    }
    isGetSandy() {
        if (this.name === 'Sandstorm')
            return false;
        if (this.strong)
            return false;
        return true;
    }
    isGetSnowy() {
        if (this.name === 'Hail')
            return false;
        if (this.strong)
            return false;
        return true;
    }
    isGetBadSunny() {
        if (this.name === 'HarshSunlight' && this.strong)
            return false;
        return true;
    }
    isGetBadRainy() {
        if (this.name === 'Rain' && this.strong)
            return false;
        return true;
    }
    isGetTurbulence() {
        if (this.name === 'Turbulence' && this.strong)
            return false;
        return true;
    }
    getSunny(pokemon) {
        if (!this.isGetSunny())
            return;
        this.reset();
        fieldStatus.weather.name = 'HarshSunlight';
        fieldStatus.weather.turn = 5;
        if (pokemon.isItem('あついいわ')) {
            fieldStatus.weather.turn = 8;
            fieldStatus.weather.extend = true;
        }
        battleLog.write('日差しが 強くなった!');
    }
    getRainy(pokemon) {
        if (!this.isGetRainy())
            return;
        this.reset();
        fieldStatus.weather.name = 'Rain';
        fieldStatus.weather.turn = 5;
        if (pokemon.isItem('しめったいわ')) {
            fieldStatus.weather.turn = 8;
            fieldStatus.weather.extend = true;
        }
        battleLog.write('雨が 降り始めた!');
    }
    getSandy(pokemon) {
        if (!this.isGetSandy())
            return;
        this.reset();
        fieldStatus.weather.name = 'Sandstorm';
        fieldStatus.weather.turn = 5;
        if (pokemon.isItem('さらさらいわ')) {
            fieldStatus.weather.turn = 8;
            fieldStatus.weather.extend = true;
        }
        battleLog.write('砂あらしが 吹き始めた!');
    }
    getSnowy(pokemon) {
        if (!this.isGetSnowy())
            return;
        this.reset();
        fieldStatus.weather.name = 'Hail';
        fieldStatus.weather.turn = 5;
        if (pokemon.isItem('つめたいいわ')) {
            fieldStatus.weather.turn = 8;
            fieldStatus.weather.extend = true;
        }
        battleLog.write('雪が 降り始めた!');
    }
    getBadSunny() {
        if (!this.isGetBadSunny())
            return;
        this.reset();
        fieldStatus.weather.name = 'HarshSunlight';
        fieldStatus.weather.strong = true;
        battleLog.write('日差しが とても強くなった!');
    }
    getBadRainy() {
        if (!this.isGetBadRainy())
            return;
        this.reset();
        fieldStatus.weather.name = 'Rain';
        fieldStatus.weather.strong = true;
        battleLog.write('強い雨が 降り始めた!');
    }
    getTurbulence() {
        if (!this.isGetTurbulence())
            return;
        this.reset();
        fieldStatus.weather.name = 'Turbulence';
        fieldStatus.weather.strong = true;
        battleLog.write('謎の乱気流が ひこうポケモンを 護る!');
    }
    advance() {
        if (this.turn === 0)
            return;
        this.turn -= 1;
        if (this.turn > 0)
            return;
        switch (this.name) {
            case 'HarshSunlight':
                battleLog.write('日差しが 元に戻った!');
                break;
            case 'Rain':
                battleLog.write('雨が 上がった!');
                break;
            case 'Sandstorm':
                battleLog.write('砂あらしが おさまった!');
                break;
            case 'Hail':
                battleLog.write('雪が 止んだ!');
                break;
            default:
                ;
        }
        this.reset();
    }
    onActivateSandstorm(pokemon) {
        if (!this.isSandy())
            return;
        if (pokemon.ability.isName('Overcoat'))
            return; // 特性「ぼうじん」
        if (pokemon.isItem('ぼうじんゴーグル'))
            return;
        if (pokemon.stateChange.dig.isTrue)
            return;
        if (pokemon.stateChange.dive.isTrue)
            return;
        if (pokemon.type.has('Rock'))
            return;
        if (pokemon.type.has('Ground'))
            return;
        if (pokemon.type.has('Steel'))
            return;
        if (pokemon.ability.isName('Sand Veil'))
            return; // 特性「すながくれ」
        if (pokemon.ability.isName('Sand Rush'))
            return; // 特性「すなかき」
        if (pokemon.ability.isName('Sand Force'))
            return; // 特性「すなのちから」
        const damage = Math.floor(pokemon.getOrgHP() / 16);
        pokemon.status.hp.value.add(Math.max(1, damage));
        battleLog.write(`砂あらしが ${pokemon.getArticle()}を 襲う!`);
    }
}
class Terrain {
    constructor() {
        this.name = null;
        this.turn = 0;
        this.extend = false;
    }
    resetWithMessage() {
        if (this.isElectric())
            battleLog.write(`足下の 電気が 消え去った!`);
        if (this.isGrassy())
            battleLog.write(`足下の 草が 消え去った!`);
        if (this.isMisty())
            battleLog.write(`足下の 霧霧が 消え去った!`);
        if (this.isPsychic())
            battleLog.write(`足下の 不思議感が 消え去った!`);
        this.reset();
    }
    reset() {
        this.name = null;
        this.turn = 0;
        this.extend = false;
    }
    setExtend(pokemon) {
        if (pokemon.isItem('グランドコート')) {
            this.turn = 8;
            this.extend = true;
        }
        else {
            this.turn = 5;
            this.extend = false;
        }
    }
    getElectric(pokemon) {
        this.reset();
        this.name = 'electric';
        this.setExtend(pokemon);
        battleLog.write(`足下に 電気が かけめぐる!`);
    }
    getGrassy(pokemon) {
        this.reset();
        this.name = 'grassy';
        this.setExtend(pokemon);
        battleLog.write(`足下に 草がおいしげった!`);
    }
    getMisty(pokemon) {
        this.reset();
        this.name = 'misty';
        this.setExtend(pokemon);
        battleLog.write(`足下に 霧が立ち込めた!`);
    }
    getPsychic(pokemon) {
        this.reset();
        this.name = 'psychic';
        this.setExtend(pokemon);
        battleLog.write(`足下が 不思議な感じに なった!`);
    }
    isElectric() {
        return this.name === 'electric';
    }
    isGrassy() {
        return this.name === 'grassy';
    }
    isMisty() {
        return this.name === 'misty';
    }
    isPsychic() {
        return this.name === 'psychic';
    }
    isPlain() {
        return this.name === null;
    }
    onElapse() {
        if (this.name === null)
            return;
        this.turn -= 1;
        if (this.turn === 0) {
            this.resetWithMessage();
        }
    }
    onActivateGrassy(pokemon) {
        if (this.name !== 'grassy')
            return;
        if (!pokemon.isGround())
            return;
        const heal = Math.floor(pokemon.getOrgHP() / 16);
        pokemon.status.hp.value.add(Math.max(1, heal));
        battleLog.write(`${pokemon.getArticle()}の 体力が 回復した!`);
    }
}
class WholeFieldStatus {
    constructor() {
        this.isTrue = false;
        this.turn = new ValueWithRange();
    }
    reset() {
        this.isTrue = false;
        this.turn.value = this.turn.max;
    }
}
class Gravity extends WholeFieldStatus {
    constructor() {
        super();
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate() {
        this.isTrue = true;
        battleLog.write(`じゅうりょくが 強くなった!`);
        this.msgDrop();
    }
    onElapse() {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            battleLog.write(`じゅうりょくが 元に戻った! `);
        }
    }
    msgDrop() {
        for (const pokemon of main.getPokemonInBattle()) {
            if (!pokemon.isGround()) {
                battleLog.write(`${pokemon.getArticle()}は じゅうりょくの 影響で 空中に いられなくなった!`);
            }
        }
    }
}
class TrickRoom extends WholeFieldStatus {
    constructor() {
        super();
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は 時空を ゆがめた!`);
    }
    onElapse() {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            battleLog.write(`ゆがんだ 時空が 元に戻った! `);
        }
    }
}
class MagicRoom extends WholeFieldStatus {
    constructor() {
        super();
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate() {
        this.isTrue = true;
        battleLog.write(`持たせた 道具の 効果が なくなる 空間を 作りだした!`);
    }
    onElapse() {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            battleLog.write(`マジックルームが 解除され 道具の 効果が 元に戻った! `);
        }
    }
}
class WonderRoom extends WholeFieldStatus {
    constructor() {
        super();
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate() {
        this.isTrue = true;
        battleLog.write(`防御と 特防が 入れ替わる 空間を 作りだした!`);
    }
    onElapse() {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            battleLog.write(`ワンダールームが 解除され 防御と 特防が 元に戻った! `);
        }
    }
}
class MudSport extends WholeFieldStatus {
    constructor() {
        super();
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate() {
        this.isTrue = true;
        battleLog.write(`電気の威力が 弱まった!`);
    }
    onElapse() {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            battleLog.write(`どろあそびの 効果が なくなった! `);
        }
    }
}
class WaterSport extends WholeFieldStatus {
    constructor() {
        super();
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate() {
        this.isTrue = true;
        battleLog.write(`炎の威力が 弱まった!`);
    }
    onElapse() {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            battleLog.write(`みずあそびの 効果が なくなった! `);
        }
    }
}
class FairyLock extends WholeFieldStatus {
    onActivate() {
        this.isTrue = true;
        battleLog.write(`次のターンは 逃げられない!`);
    }
}
class IonDeluge extends WholeFieldStatus {
    onActivate() {
        this.isTrue = true;
        battleLog.write(`電子のシャワーが 降りそそいだ!`);
    }
}
class WholeField {
    constructor() {
        this.trickRoom = new TrickRoom(); // トリックルーム
        this.magicRoom = new MagicRoom(); // マジックルーム
        this.wonderRoom = new WonderRoom(); // ワンダールーム
        this.gravity = new Gravity(); // じゅうりょく
        this.mudSport = new MudSport(); // どろあそび
        this.waterSport = new WaterSport(); // みずあそび
        this.fairyLock = new FairyLock(); // フェアリーロック
        this.ionDeluge = new IonDeluge(); // プラズマシャワー
    }
}
class SideFieldStatus {
    constructor(isMine) {
        this.isMine = isMine;
        this.isTrue = false;
        this.turn = new ValueWithRange();
        this.count = 0;
    }
    getText() {
        if (this.isMine) {
            return `味方`;
        }
        else {
            return `相手`;
        }
    }
    reset() {
        this.isTrue = false;
        this.turn.toZero();
        this.count = 0;
    }
}
class AuroraVeil extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate(isLightClay) {
        if (this.isTrue)
            return;
        this.isTrue = true;
        if (isLightClay) {
            this.turn = new ValueWithRange(8, 0);
        }
        battleLog.write(`${this.getText()}は オーロラベールで 物理と 特殊に 強くなった!`);
    }
    onRemove() {
        if (!this.isTrue)
            return;
        this.reset();
        battleLog.write(`${this.getText()}の オーロラベールが なくなった!`);
    }
    onElapse() {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.onRemove();
        }
    }
}
class LightScreen extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate(isLightClay) {
        if (this.isTrue)
            return;
        this.isTrue = true;
        if (isLightClay) {
            this.turn = new ValueWithRange(8, 0);
        }
        battleLog.write(`${this.getText()}は ひかりのかべで 特殊に 強くなった!`);
    }
    onRemove() {
        if (!this.isTrue)
            return;
        this.reset();
        battleLog.write(`${this.getText()}の ひかりのかべが なくなった!`);
    }
    onElapse() {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.onRemove();
        }
    }
}
class Reflect extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate(isLightClay) {
        if (this.isTrue)
            return;
        this.isTrue = true;
        if (isLightClay) {
            this.turn = new ValueWithRange(8, 0);
        }
        battleLog.write(`${this.getText()}は リフレクターで 物理に 強くなった!`);
    }
    onRemove() {
        if (!this.isTrue)
            return;
        this.reset();
        battleLog.write(`${this.getText()}の リフレクターが なくなった!`);
    }
    onElapse() {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.onRemove();
        }
    }
}
class TailWind extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
        this.turn = new ValueWithRange(4, 0);
    }
    onActivate() {
        if (this.isTrue)
            return;
        this.isTrue = true;
        battleLog.write(`${this.getText()}に 追い風が 吹き始めた!`);
    }
    onElapse() {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            battleLog.write(`${this.getText()}の 追い風が 止んだ!`);
        }
    }
}
class LuckyChant extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate() {
        if (this.isTrue)
            return;
        this.isTrue = true;
        battleLog.write(`おまじないの 力で ${this.getText()}の 急所が 隠れた!`);
    }
    onElapse() {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            // battleLog.write( `${this.getText()}の !` );
        }
    }
}
class Mist extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate() {
        if (this.isTrue)
            return;
        this.isTrue = true;
        battleLog.write(`${this.getText()}は 白い霧に 包まれた!`);
    }
    onRemove() {
        if (!this.isTrue)
            return;
        this.reset();
        battleLog.write(`${this.getText()}の 白い霧が なくなった!`);
    }
    onElapse() {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.onRemove();
        }
    }
}
class Safeguard extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate() {
        if (this.isTrue)
            return;
        this.isTrue = true;
        battleLog.write(`${this.getText()}は 神秘の守りに 包まれた!`);
    }
    onRemove() {
        if (!this.isTrue)
            return;
        this.reset();
        battleLog.write(`${this.getText()}の 神秘の守りが なくなった!`);
    }
}
class MatBlock extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
    }
    onActivate(pokemon) {
        if (this.isTrue)
            return;
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}は たたみがえしを 狙っている!`);
    }
}
class CraftyShield extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
    }
    onActivate() {
        if (this.isTrue)
            return;
        this.isTrue = true;
        battleLog.write(`${this.getText()}の 周りを トリックガードが 守っている!`);
    }
}
class QuickGuard extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
    }
    onActivate() {
        if (this.isTrue)
            return;
        this.isTrue = true;
        battleLog.write(`${this.getText()}の 周りを ファストガードが 守っている!`);
    }
}
class WideGuard extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
    }
    onActivate() {
        if (this.isTrue)
            return;
        this.isTrue = true;
        battleLog.write(`${this.getText()}の 周りを ワイドガードが 守っている!`);
    }
}
class Rainbow extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
        this.turn = new ValueWithRange(4, 0);
    }
    onActivate() {
        if (this.isTrue)
            return;
        this.isTrue = true;
        battleLog.write(`${this.getText()}の 空に 虹が かかった!`);
    }
    onElapse() {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            battleLog.write(`${this.getText()}の 虹が 消え去った!`);
        }
    }
}
class Wetlands extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
        this.turn = new ValueWithRange(4, 0);
    }
    onActivate() {
        if (this.isTrue)
            return;
        this.isTrue = true;
        battleLog.write(`${this.getText()}の 周りに 湿原が 広がった!`);
    }
    onElapse() {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            battleLog.write(`${this.getText()}の 湿原が 消え去った!`);
        }
    }
}
class SeaOfFire extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
        this.turn = new ValueWithRange(4, 0);
    }
    onActivate() {
        if (this.isTrue)
            return;
        this.isTrue = true;
        battleLog.write(`${this.getText()}の 周りが 火の海に 包まれた!`);
    }
    onEffective(pokemon) {
        if (!this.isTrue)
            return;
        if (pokemon.type.has('Fire'))
            return;
        const damage = Math.floor(pokemon.getOrgHP() / 8);
        pokemon.status.hp.value.sub(Math.max(1, damage));
        battleLog.write(`${pokemon.getArticle()}は 火の海の ダメージを受けた!`);
    }
    onElapse() {
        if (!this.isTrue)
            return;
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            battleLog.write(`${this.getText()}の 周りの 火の海が 消え去った!`);
        }
    }
}
class StealthRock extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
    }
    onActivate() {
        if (this.isTrue)
            return;
        this.isTrue = true;
        battleLog.write(`${this.getText()}の 周りに とがった岩が ただよい始めた! `);
    }
    onRemove() {
        if (!this.isTrue)
            return;
        this.reset();
        battleLog.write(`${this.getText()}の 周りの ステルスロックが 消え去った! `);
    }
    onEffective(pokemon) {
        if (!this.isTrue)
            return;
        if (pokemon.isItem('あつぞこブーツ'))
            return;
        const damage = Math.floor(pokemon.status.hp.value.max * pokemon.type.getCompatibility('Rock') / 8);
        pokemon.status.hp.value.sub(Math.max(1, damage));
        battleLog.write(`${pokemon.getArticle()}は とがった岩が 食いこんだ!`);
    }
}
class ToxicSpikes extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
    }
    onActivate() {
        if (this.count === 2)
            return;
        this.isTrue = true;
        this.count += 1;
        battleLog.write(`${this.getText()}の 足元に どくびしが 散らばった!`);
    }
    onRemove() {
        if (!this.isTrue)
            return;
        this.reset();
        battleLog.write(`${this.getText()}の 足元の どくびしが 消え去った!`);
    }
    onEffective(pokemon) {
        if (!this.isTrue)
            return;
        if (!pokemon.isGround())
            return;
        if (pokemon.isItem('あつぞこブーツ'))
            return;
        if (!pokemon.isGetAilmentByOther('Poisoned', pokemon))
            return;
        if (this.count === 1) {
            pokemon.statusAilment.getPoisoned();
        }
        if (this.count === 2) {
            pokemon.statusAilment.getBadPoisoned();
        }
    }
}
class StickyWeb extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
    }
    onActivate() {
        if (this.isTrue)
            return;
        this.isTrue = true;
        battleLog.write(`${this.getText()}の 足元に ねばねばネットが 広がった!`);
    }
    onRemove() {
        if (!this.isTrue)
            return;
        this.reset();
        battleLog.write(`${this.getText()}の 足元の ねばねばネットが 消え去った!`);
    }
    onEffective(pokemon) {
        if (!this.isTrue)
            return;
        if (!pokemon.isGround())
            return;
        if (pokemon.isItem('あつぞこブーツ'))
            return;
        if (!pokemon.isChangeRank('spe', -1))
            return;
        battleLog.write(`${this.getText()}は ねばねばネットに ひっかかった!`);
        pokemon.changeRank('spe', -1);
    }
}
class Spikes extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
    }
    onActivate() {
        if (this.count === 3)
            return;
        this.isTrue = true;
        this.count += 1;
        battleLog.write(`${this.getText()}の 足元に まきびしが 散らばった!`);
    }
    onRemove() {
        if (!this.isTrue)
            return;
        this.reset();
        battleLog.write(`${this.getText()}の 足元の まきびしが 消え去った!`);
    }
    onEffective(pokemon) {
        if (!this.isTrue)
            return;
        if (!pokemon.isGround())
            return;
        if (pokemon.isItem('あつぞこブーツ'))
            return;
        const damage = Math.floor(pokemon.status.hp.value.max / (10 - this.count * 2));
        pokemon.status.hp.value.sub(Math.max(1, damage));
        battleLog.write(`${pokemon.getArticle()}は まきびしの ダメージを受けた!`);
    }
}
class Steelsurge extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
    }
    onActivate() {
        if (this.isTrue)
            return;
        this.isTrue = true;
        battleLog.write(`${this.getText()}の 周りに とがった はがねが ただよい始めた! `);
    }
    onRemove() {
        if (!this.isTrue)
            return;
        this.reset();
        battleLog.write(`${this.getText()}の 周りの キョダイコウジンが 消え去った! `);
    }
    onEffective(pokemon) {
        if (!this.isTrue)
            return;
        if (pokemon.isItem('あつぞこブーツ'))
            return;
        const damage = Math.floor(pokemon.status.hp.value.max * pokemon.type.getCompatibility('Steel') / 8);
        pokemon.status.hp.value.sub(Math.max(1, damage));
        battleLog.write(`${pokemon.getArticle()}は とがった はがねが 食いこんだ!`);
    }
}
class Wildfire extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
    }
    onActivate() {
        if (this.isTrue)
            return;
        this.isTrue = true;
        battleLog.write(`${this.getText()}の ポケモンが 炎に 包まれた! `);
    }
    onEffective(pokemon) {
        if (!this.isTrue)
            return;
        if (pokemon.type.has('Fire'))
            return;
        const damage = Math.floor(pokemon.getOrgHP() / 6);
        pokemon.status.hp.value.sub(Math.max(1, damage));
        battleLog.write(`${pokemon.getArticle()}は キョダイゴクエンの 炎に 包まれていて 熱い!`);
    }
    onElapse() {
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
        }
    }
}
class Volcalith extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
        this.turn = new ValueWithRange(4, 0);
    }
    onActivate() {
        if (this.isTrue)
            return;
        this.isTrue = true;
        battleLog.write(`${this.getText()}の ポケモンが 岩に 囲まれた! `);
    }
    onEffective(pokemon) {
        if (!this.isTrue)
            return;
        if (pokemon.type.has('Rock'))
            return;
        const damage = Math.floor(pokemon.getOrgHP() / 6);
        pokemon.status.hp.value.sub(Math.max(1, damage));
        battleLog.write(`${pokemon.getArticle()}は キョダイフンセキの 岩に 囲まれていて 痛い!`);
    }
    onElapse() {
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
        }
    }
}
class VineLash extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
        this.turn = new ValueWithRange(4, 0);
    }
    onActivate() {
        if (this.isTrue)
            return;
        this.isTrue = true;
        battleLog.write(`${this.getText()}の ポケモンが ムチの 猛打に 包まれた! `);
    }
    onEffective(pokemon) {
        if (!this.isTrue)
            return;
        if (pokemon.type.has('Grass'))
            return;
        const damage = Math.floor(pokemon.getOrgHP() / 6);
        pokemon.status.hp.value.sub(Math.max(1, damage));
        battleLog.write(`${pokemon.getArticle()}は キョダイベンタツの 猛打に さらされていて 痛い!`);
    }
    onElapse() {
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
        }
    }
}
class Cannonade extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
        this.turn = new ValueWithRange(4, 0);
    }
    onActivate() {
        if (this.isTrue)
            return;
        this.isTrue = true;
        battleLog.write(`${this.getText()}の ポケモンが 水の 流れに 包まれた! `);
    }
    onEffective(pokemon) {
        if (!this.isTrue)
            return;
        if (pokemon.type.has('Water'))
            return;
        const damage = Math.floor(pokemon.getOrgHP() / 6);
        pokemon.status.hp.value.sub(Math.max(1, damage));
        battleLog.write(`${pokemon.getArticle()}は キョダイホウゲキの 流れに 飲みこまれていて 苦しい!`);
    }
    onElapse() {
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
        }
    }
}
class SideField {
    constructor(isMine) {
        this._host = true;
        this._isMine = isMine;
        this.auroraVeil = new AuroraVeil(isMine);
        this.lightScreen = new LightScreen(isMine);
        this.reflect = new Reflect(isMine);
        this.tailwind = new TailWind(isMine);
        this.luckyChant = new LuckyChant(isMine);
        this.mist = new Mist(isMine);
        this.safeguard = new Safeguard(isMine);
        this.matBlock = new MatBlock(isMine);
        this.craftyShield = new CraftyShield(isMine);
        this.quickGuard = new QuickGuard(isMine);
        this.wideGuard = new WideGuard(isMine);
        this.rainbow = new Rainbow(isMine);
        this.stealthRock = new StealthRock(isMine);
        this.toxicSpikes = new ToxicSpikes(isMine);
        this.stickyWeb = new StickyWeb(isMine);
        this.spikes = new Spikes(isMine);
        this.steelsurge = new Steelsurge(isMine);
        this.wildfire = new Wildfire(isMine);
        this.volcalith = new Volcalith(isMine);
        this.vineLash = new VineLash(isMine);
        this.cannonade = new Cannonade(isMine);
        this.wetlands = new Wetlands(isMine);
        this.seaOfFire = new SeaOfFire(isMine);
    }
    get host() {
        return this._host;
    }
    setHost(host) {
        this._host = host;
    }
}
class Field {
    constructor() {
        this._battleStyle = 1;
        this._numberOfPokemon = 3;
        this._weather = new Weather;
        this._terrain = new Terrain;
        this._whole = new WholeField;
        this._myField = new SideField(true);
        this._opponentField = new SideField(false);
    }
    set weather(weather) {
        this._weather = weather;
    }
    set terrain(terrain) {
        this._terrain = terrain;
    }
    get battleStyle() {
        return this._battleStyle;
    }
    get numberOfPokemon() {
        return this._numberOfPokemon;
    }
    get weather() {
        return this._weather;
    }
    get terrain() {
        return this._terrain;
    }
    get whole() {
        return this._whole;
    }
    setHost(host) {
        this._myField = new SideField(host);
        this._opponentField = new SideField(!host);
    }
    getSide(isMine) {
        if (isMine === this._myField._isMine) {
            return this._myField;
        }
        else {
            return this._opponentField;
        }
    }
    getSideByHost(host) {
        if (this._myField.host === host) {
            return this._myField;
        }
        else {
            return this._opponentField;
        }
    }
    setNumberOfPokemon(battleStyle) {
        this._battleStyle = battleStyle;
        if (battleStyle === 1) {
            this._numberOfPokemon = 3;
        }
        else if (battleStyle === 2) {
            this._numberOfPokemon = 4;
        }
        else if (battleStyle === 3) {
            this._numberOfPokemon = 6;
        }
    }
}
