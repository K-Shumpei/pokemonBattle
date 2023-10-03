"use strict";
class Weather {
    constructor() {
        this._name = null;
        this._turn = 0;
        this._extend = false;
        this._strong = false;
    }
    set name(name) {
        this._name = name;
    }
    set turn(turn) {
        this._turn = turn;
    }
    set extend(extend) {
        this._extend = extend;
    }
    set strong(strong) {
        this._strong = strong;
    }
    reset() {
        this._name = null;
        this._turn = 0;
        this._extend = false;
        this._strong = false;
    }
    isNoWeather() {
        if ((isExistAbility('ノーてんき') || isExistAbility('エアロック')) === false) {
            return false;
        }
        else {
            return true;
        }
    }
    isPlaim() {
        return this._name === null || this.isNoWeather();
    }
    isSunny(pokemon) {
        if (pokemon.item.isName('ばんのうがさ') || this.isNoWeather()) {
            return false;
        }
        else {
            return this._name === 'HarshSunlight';
        }
    }
    isRainy(pokemon) {
        if (pokemon.item.isName('ばんのうがさ') || this.isNoWeather()) {
            return false;
        }
        else {
            return this._name === 'Rain';
        }
    }
    isSandy() {
        if (this.isNoWeather()) {
            return false;
        }
        else {
            return this._name === 'Sandstorm';
        }
    }
    isSnowy() {
        if (this.isNoWeather()) {
            return false;
        }
        else {
            return this._name === 'Hail';
        }
    }
    isBadSunny(pokemon) {
        if (pokemon.item.isName('ばんのうがさ') || this.isNoWeather()) {
            return false;
        }
        else {
            return this._name === 'HarshSunlight' && this._strong === true;
        }
    }
    isBadRainy(pokemon) {
        if (pokemon.item.isName('ばんのうがさ') || this.isNoWeather()) {
            return false;
        }
        else {
            return this._name === 'Rain' && this._strong === true;
        }
    }
    isTurbulence() {
        if (this.isNoWeather()) {
            return false;
        }
        else {
            return this._name === 'Turbulence';
        }
    }
    isGetSunny() {
        if (this._name === 'HarshSunlight')
            return false;
        if (this._strong)
            return false;
        return true;
    }
    isGetRainy() {
        if (this._name === 'Rain')
            return false;
        if (this._strong)
            return false;
        return true;
    }
    isGetSandy() {
        if (this._name === 'Sandstorm')
            return false;
        if (this._strong)
            return false;
        return true;
    }
    isGetSnowy() {
        if (this._name === 'Hail')
            return false;
        if (this._strong)
            return false;
        return true;
    }
    isGetBadSunny() {
        if (this._name === 'HarshSunlight' && this._strong)
            return false;
        return true;
    }
    isGetBadRainy() {
        if (this._name === 'Rain' && this._strong)
            return false;
        return true;
    }
    isGetTurbulence() {
        if (this._name === 'Turbulence' && this._strong)
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
}
class Terrain {
    constructor() {
        this._name = null;
        this._turn = 0;
        this._extend = false;
    }
    set turn(turn) {
        this._turn = turn;
    }
    set extend(extend) {
        this._extend = extend;
    }
    resetWithMessage() {
        if (this.isElectric())
            writeLog(`足下の 電気が 消え去った!`);
        if (this.isGrassy())
            writeLog(`足下の 電気が 消え去った!`);
        if (this.isMisty())
            writeLog(`足下の 電気が 消え去った!`);
        if (this.isPsychic())
            writeLog(`足下の 電気が 消え去った!`);
        this.reset();
    }
    reset() {
        this._name = null;
        this._turn = 0;
        this._extend = false;
    }
    setExtend(pokemon) {
        if (pokemon.item.isName('グランドコート')) {
            this._turn = 8;
            this._extend = true;
        }
        else {
            this._turn = 5;
            this._extend = false;
        }
    }
    getElectric(pokemon) {
        this.reset();
        this._name = 'electric';
        this.setExtend(pokemon);
        writeLog(`足下に 電気が かけめぐる!`);
    }
    getGrassy(pokemon) {
        this.reset();
        this._name = 'grassy';
        this.setExtend(pokemon);
        writeLog(`足下に 草がおいしげった!`);
    }
    getMisty(pokemon) {
        this.reset();
        this._name = 'misty';
        this.setExtend(pokemon);
        writeLog(`足下が 不思議な感じに なった!`);
    }
    getPsychic(pokemon) {
        this.reset();
        this._name = 'psychic';
        this.setExtend(pokemon);
        writeLog(`足下に 霧が立ち込めた!`);
    }
    isElectric() {
        return this._name === 'electric';
    }
    isGrassy() {
        return this._name === 'grassy';
    }
    isMisty() {
        return this._name === 'misty';
    }
    isPsychic() {
        return this._name === 'psychic';
    }
    isPlain() {
        return this._name === null;
    }
}
class WholeField {
    constructor() {
        this._trickRoom = new StateChange('トリックルーム');
        this._magicRoom = new StateChange('マジックルーム');
        this._wonderRoom = new StateChange('ワンダールーム');
        this._gravity = new StateChange('じゅうりょく');
        this._mudSport = new StateChange('どろあそび');
        this._fairyLock = new StateChange('フェアリーロック');
        this._ionDeluge = new StateChange('プラズマシャワー');
        this._waterSport = new StateChange('みずあそび');
        this._futureSight = [];
    }
    set trickRoom(trickRoom) {
        this._trickRoom = trickRoom;
    }
    set magicRoom(magicRoom) {
        this._magicRoom = magicRoom;
    }
    set wonderRoom(wonderRoom) {
        this._wonderRoom = wonderRoom;
    }
    set gravity(gravity) {
        this._gravity = gravity;
    }
    set mudSport(mudSport) {
        this._mudSport = mudSport;
    }
    set fairyLock(fairyLock) {
        this._fairyLock = fairyLock;
    }
    set ionDeluge(ionDeluge) {
        this._ionDeluge = ionDeluge;
    }
    set waterSport(waterSport) {
        this._waterSport = waterSport;
    }
    set futureSight(futureSight) {
        this._futureSight = futureSight;
    }
    get trickRoom() {
        return this._trickRoom;
    }
    get magicRoom() {
        return this._magicRoom;
    }
    get wonderRoom() {
        return this._wonderRoom;
    }
    get gravity() {
        return this._gravity;
    }
    get mudSport() {
        return this._mudSport;
    }
    get fairyLock() {
        return this._fairyLock;
    }
    get ionDeluge() {
        return this._ionDeluge;
    }
    get waterSport() {
        return this._waterSport;
    }
    get futureSight() {
        return this._futureSight;
    }
}
class SideField {
    constructor() {
        this._auroraVeil = new StateChange('オーロラベール');
        this._lightScreen = new StateChange('ひかりのかべ');
        this._reflect = new StateChange('リフレクター');
        this._matBlock = new StateChange('たたみがえし');
        this._craftyShield = new StateChange('トリックガード');
        this._quickGuard = new StateChange('ファストガード');
        this._wideGuard = new StateChange('ワイドガード');
        this._tailwind = new StateChange('おいかぜ');
        this._luckyChant = new StateChange('おまじない');
        this._mist = new StateChange('しろいきり');
        this._safeguard = new StateChange('しんぴのまもり');
        this._rainbow = new StateChange('にじ');
        this._stealthRock = new StateChange('ステルスロック');
        this._toxicSpikes = new StateChange('どくびし');
        this._stickyWeb = new StateChange('ねばねばネット');
        this._spikes = new StateChange('まきびし');
        this._steelsurge = new StateChange('キョダイコウジン');
        this._wildfire = new StateChange('キョダイゴクエン');
        this._volcalith = new StateChange('キョダイフンセキ');
        this._vineLash = new StateChange('キョダイベンタツ');
        this._cannonade = new StateChange('キョダイホウゲキ');
        this._wetlands = new StateChange('しつげん');
        this._seaOfFire = new StateChange('ひのうみ');
    }
    set auroraVeil(auroraVeil) {
        this._auroraVeil = auroraVeil;
    }
    set lightScreen(lightScreen) {
        this._lightScreen = lightScreen;
    }
    set reflect(reflect) {
        this._reflect = reflect;
    }
    set matBlock(matBlock) {
        this._matBlock = matBlock;
    }
    set craftyShield(craftyShield) {
        this._craftyShield = craftyShield;
    }
    set quickGuard(quickGuard) {
        this._quickGuard = quickGuard;
    }
    set wideGuard(wideGuard) {
        this._wideGuard = wideGuard;
    }
    set tailwind(tailwind) {
        this._tailwind = tailwind;
    }
    set luckyChant(luckyChant) {
        this._luckyChant = luckyChant;
    }
    set mist(mist) {
        this._mist = mist;
    }
    set safeguard(safeguard) {
        this._safeguard = safeguard;
    }
    set rainbow(rainbow) {
        this._rainbow = rainbow;
    }
    set stealthRock(stealthRock) {
        this._stealthRock = stealthRock;
    }
    set toxicSpikes(toxicSpikes) {
        this._toxicSpikes = toxicSpikes;
    }
    set stickyWeb(stickyWeb) {
        this._stickyWeb = stickyWeb;
    }
    set spikes(spikes) {
        this._spikes = spikes;
    }
    set steelsurge(steelsurge) {
        this._steelsurge = steelsurge;
    }
    set wildfire(wildfire) {
        this._wildfire = wildfire;
    }
    set volcalith(volcalith) {
        this._volcalith = volcalith;
    }
    set vineLash(vineLash) {
        this._vineLash = vineLash;
    }
    set cannonade(cannonade) {
        this._cannonade = cannonade;
    }
    set wetlands(wetlands) {
        this._wetlands = wetlands;
    }
    set seaOfFire(seaOfFire) {
        this._seaOfFire = seaOfFire;
    }
    get auroraVeil() {
        return this._auroraVeil;
    }
    get lightScreen() {
        return this._lightScreen;
    }
    get reflect() {
        return this._reflect;
    }
    get matBlock() {
        return this._matBlock;
    }
    get craftyShield() {
        return this._craftyShield;
    }
    get quickGuard() {
        return this._quickGuard;
    }
    get wideGuard() {
        return this._wideGuard;
    }
    get tailwind() {
        return this._tailwind;
    }
    get luckyChant() {
        return this._luckyChant;
    }
    get mist() {
        return this._mist;
    }
    get safeguard() {
        return this._safeguard;
    }
    get rainbow() {
        return this._rainbow;
    }
    get stealthRock() {
        return this._stealthRock;
    }
    get toxicSpikes() {
        return this._toxicSpikes;
    }
    get stickyWeb() {
        return this._stickyWeb;
    }
    get spikes() {
        return this._spikes;
    }
    get steelsurge() {
        return this._steelsurge;
    }
    get wildfire() {
        return this._wildfire;
    }
    get volcalith() {
        return this._volcalith;
    }
    get vineLash() {
        return this._vineLash;
    }
    get cannonade() {
        return this._cannonade;
    }
    get wetlands() {
        return this._wetlands;
    }
    get seaOfFire() {
        return this._seaOfFire;
    }
}
class Field {
    constructor() {
        this._battleStyle = 1;
        this._numberOfPokemon = 3;
        this._weather = new Weather;
        this._terrain = new Terrain;
        this._whole = new WholeField;
        this._myField = new SideField;
        this._opponentField = new SideField;
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
    getSide(side) {
        if (side === 'me') {
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
