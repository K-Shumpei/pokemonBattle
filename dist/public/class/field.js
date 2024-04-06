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
        if (pokemon.item.isName('ばんのうがさ') || this.isNoWeather()) {
            return false;
        }
        else {
            return this.name === 'HarshSunlight';
        }
    }
    isRainy(pokemon) {
        if (pokemon.item.isName('ばんのうがさ') || this.isNoWeather()) {
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
        if (pokemon.item.isName('ばんのうがさ') || this.isNoWeather()) {
            return false;
        }
        else {
            return this.name === 'HarshSunlight' && this.strong === true;
        }
    }
    isBadRainy(pokemon) {
        if (pokemon.item.isName('ばんのうがさ') || this.isNoWeather()) {
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
        if (pokemon.item.isName('あついいわ')) {
            fieldStatus.weather.turn = 8;
            fieldStatus.weather.extend = true;
        }
        writeLog('日差しが 強くなった!');
    }
    getRainy(pokemon) {
        if (!this.isGetRainy())
            return;
        this.reset();
        fieldStatus.weather.name = 'Rain';
        fieldStatus.weather.turn = 5;
        if (pokemon.item.isName('しめったいわ')) {
            fieldStatus.weather.turn = 8;
            fieldStatus.weather.extend = true;
        }
        writeLog('雨が 降り始めた!');
    }
    getSandy(pokemon) {
        if (!this.isGetSandy())
            return;
        this.reset();
        fieldStatus.weather.name = 'Sandstorm';
        fieldStatus.weather.turn = 5;
        if (pokemon.item.isName('さらさらいわ')) {
            fieldStatus.weather.turn = 8;
            fieldStatus.weather.extend = true;
        }
        writeLog('砂あらしが 吹き始めた!');
    }
    getSnowy(pokemon) {
        if (!this.isGetSnowy())
            return;
        this.reset();
        fieldStatus.weather.name = 'Hail';
        fieldStatus.weather.turn = 5;
        if (pokemon.item.isName('つめたいいわ')) {
            fieldStatus.weather.turn = 8;
            fieldStatus.weather.extend = true;
        }
        writeLog('雪が 降り始めた!');
    }
    getBadSunny() {
        if (!this.isGetBadSunny())
            return;
        this.reset();
        fieldStatus.weather.name = 'HarshSunlight';
        fieldStatus.weather.strong = true;
        writeLog('日差しが とても強くなった!');
    }
    getBadRainy() {
        if (!this.isGetBadRainy())
            return;
        this.reset();
        fieldStatus.weather.name = 'Rain';
        fieldStatus.weather.strong = true;
        writeLog('強い雨が 降り始めた!');
    }
    getTurbulence() {
        if (!this.isGetTurbulence())
            return;
        this.reset();
        fieldStatus.weather.name = 'Turbulence';
        fieldStatus.weather.strong = true;
        writeLog('謎の乱気流が ひこうポケモンを 護る!');
    }
    advance() {
        if (this.turn === 0)
            return;
        this.turn -= 1;
        if (this.turn > 0)
            return;
        switch (this.name) {
            case 'HarshSunlight':
                writeLog('日差しが 元に戻った!');
                break;
            case 'Rain':
                writeLog('雨が 上がった!');
                break;
            case 'Sandstorm':
                writeLog('砂あらしが おさまった!');
                break;
            case 'Hail':
                writeLog('雪が 止んだ!');
                break;
            default:
                ;
        }
        this.reset();
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
            writeLog(`足下の 電気が 消え去った!`);
        if (this.isGrassy())
            writeLog(`足下の 草が 消え去った!`);
        if (this.isMisty())
            writeLog(`足下の 霧霧が 消え去った!`);
        if (this.isPsychic())
            writeLog(`足下の 不思議感が 消え去った!`);
        this.reset();
    }
    reset() {
        this.name = null;
        this.turn = 0;
        this.extend = false;
    }
    setExtend(pokemon) {
        if (pokemon.item.isName('グランドコート')) {
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
        writeLog(`足下に 電気が かけめぐる!`);
    }
    getGrassy(pokemon) {
        this.reset();
        this.name = 'grassy';
        this.setExtend(pokemon);
        writeLog(`足下に 草がおいしげった!`);
    }
    getMisty(pokemon) {
        this.reset();
        this.name = 'misty';
        this.setExtend(pokemon);
        writeLog(`足下に 霧が立ち込めた!`);
    }
    getPsychic(pokemon) {
        this.reset();
        this.name = 'psychic';
        this.setExtend(pokemon);
        writeLog(`足下が 不思議な感じに なった!`);
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
        writeLog(`じゅうりょくが 強くなった!`);
        this.msgDrop();
    }
    onElapse() {
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            writeLog(`じゅうりょくが 元に戻った! `);
        }
    }
    msgDrop() {
        for (const pokemon of main.getPokemonInBattle()) {
            if (!pokemon.isGround()) {
                writeLog(`${pokemon.getArticle()}は じゅうりょくの 影響で 空中に いられなくなった!`);
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
        writeLog(`${pokemon.getArticle()}は 時空を ゆがめた!`);
    }
    onElapse() {
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            writeLog(`ゆがんだ 時空が 元に戻った! `);
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
        writeLog(`持たせた 道具の 効果が なくなる 空間を 作りだした!`);
    }
    onElapse() {
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            writeLog(`マジックルームが 解除され 道具の 効果が 元に戻った! `);
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
        writeLog(`防御と 特防が 入れ替わる 空間を 作りだした!`);
    }
    onElapse() {
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            writeLog(`ワンダールームが 解除され 防御と 特防が 元に戻った! `);
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
        writeLog(`電気の威力が 弱まった!`);
    }
    onElapse() {
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            writeLog(`どろあそびの 効果が なくなった! `);
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
        writeLog(`炎の威力が 弱まった!`);
    }
    onElapse() {
        this.turn.sub(1);
        if (this.turn.isZero()) {
            this.reset();
            writeLog(`みずあそびの 効果が なくなった! `);
        }
    }
}
class FairyLock extends WholeFieldStatus {
    onActivate() {
        this.isTrue = true;
        writeLog(`次のターンは 逃げられない!`);
    }
}
class IonDeluge extends WholeFieldStatus {
    onActivate() {
        this.isTrue = true;
        writeLog(`電子のシャワーが 降りそそいだ!`);
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
        this.isLightCray = false;
        this.extendTurn = new ValueWithRange(3, 0);
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate(isLightClay) {
        if (this.isTrue)
            return;
        this.isTrue = true;
        this.isLightCray = isLightClay;
        writeLog(`${this.getText()}は オーロラベールで 物理と 特殊に 強くなった!`);
    }
}
class LightScreen extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
        this.isLightCray = false;
        this.extendTurn = new ValueWithRange(3, 0);
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate(isLightClay) {
        if (this.isTrue)
            return;
        this.isTrue = true;
        this.isLightCray = isLightClay;
        writeLog(`${this.getText()}は ひかりのかべで 特殊に 強くなった!`);
    }
}
class Reflect extends SideFieldStatus {
    constructor(isMine) {
        super(isMine);
        this.isLightCray = false;
        this.extendTurn = new ValueWithRange(3, 0);
        this.turn = new ValueWithRange(5, 0);
    }
    onActivate(isLightClay) {
        if (this.isTrue)
            return;
        this.isTrue = true;
        this.isLightCray = isLightClay;
        writeLog(`${this.getText()}は リフレクターで 物理に 強くなった!`);
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
        writeLog(`${this.getText()}に 追い風が 吹き始めた!`);
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
        writeLog(`おまじないの 力で ${this.getText()}の 急所が 隠れた!`);
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
        writeLog(`${this.getText()}は 白い霧に 包まれた!`);
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
        writeLog(`${this.getText()}は 白い霧に 包まれた!`);
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
        writeLog(`${pokemon.getArticle()}は たたみがえしを 狙っている!`);
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
        writeLog(`${this.getText()}の 周りを トリックガードが 守っている!`);
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
        writeLog(`${this.getText()}の 周りを ファストガードが 守っている!`);
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
        writeLog(`${this.getText()}の 周りを ワイドガードが 守っている!`);
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
        writeLog(`${this.getText()}の 空に 虹が かかった!`);
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
        writeLog(`${this.getText()}の 周りに 湿原が 広がった!`);
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
        writeLog(`${this.getText()}の 周りが 火の海に 包まれた!`);
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
        writeLog(`${this.getText()}の 周りに とがった岩が ただよい始めた! `);
    }
    onRemove() {
        if (!this.isTrue)
            return;
        this.reset();
        writeLog(`${this.getText()}の 周りの ステルスロックが 消え去った! `);
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
        writeLog(`${this.getText()}の 足元に どくびしが 散らばった!`);
    }
    onRemove() {
        if (!this.isTrue)
            return;
        this.reset();
        writeLog(`${this.getText()}の 足元の どくびしが 消え去った!`);
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
        writeLog(`${this.getText()}の 足元に ねばねばネットが 広がった!`);
    }
    onRemove() {
        if (!this.isTrue)
            return;
        this.reset();
        writeLog(`${this.getText()}の 足元の ねばねばネットが 消え去った!`);
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
        writeLog(`${this.getText()}の 足元に まきびしが 散らばった!`);
    }
    onRemove() {
        if (!this.isTrue)
            return;
        this.reset();
        writeLog(`${this.getText()}の 足元の まきびしが 消え去った!`);
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
        writeLog(`${this.getText()}の 周りに 尖った鋼が ただよい始めた! `);
    }
    onRemove() {
        if (!this.isTrue)
            return;
        this.reset();
        writeLog(`${this.getText()}の 周りの キョダイコウジンが 消え去った! `);
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
        writeLog(`${this.getText()}の ポケモンが 炎に 包まれた! `);
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
        writeLog(`${this.getText()}の ポケモンが 岩に 囲まれた! `);
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
        writeLog(`${this.getText()}の ポケモンが ムチの 猛打に 包まれた! `);
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
        writeLog(`${this.getText()}の ポケモンが 水の 流れに 包まれた! `);
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
