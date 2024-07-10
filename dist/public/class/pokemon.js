"use strict";
class Order {
    constructor(isMe, slot) {
        this.host = true;
        this.battle = null;
        this.isMe = isMe;
        this.party = slot;
        this.hand = slot;
    }
    setInfo(order) {
        this.host = order.host;
        this.isMe = order.isMe;
        this.party = order.party;
        this.hand = order.hand;
        this.battle = order.battle;
    }
}
class ParameterSix {
    constructor() {
        this._hitPoint = 0;
        this._attack = 0;
        this._defense = 0;
        this._specialAttack = 0;
        this._specialDefense = 0;
        this._speed = 0;
    }
    set hitPoint(hitPoint) {
        this._hitPoint = hitPoint;
    }
    set attack(attack) {
        this.attack = attack;
    }
    set defense(defense) {
        this._defense = defense;
    }
    set specialAttack(specialAttack) {
        this._specialAttack = specialAttack;
    }
    set specialDefense(specialDefense) {
        this._specialDefense = specialDefense;
    }
    set speed(speed) {
        this._speed = speed;
    }
    get hitPoint() {
        return this._hitPoint;
    }
    get attack() {
        return this.attack;
    }
    get defense() {
        return this._defense;
    }
    get specialAttack() {
        return this._specialAttack;
    }
    get specialDefense() {
        return this._specialDefense;
    }
    get speed() {
        return this._speed;
    }
}
class Attack {
    constructor(field, isMe, battle, party) {
        this.success = true;
        this.damage = 0;
        this.effective = 0;
        this.critical = false;
        this.substitute = false;
        this.fainted = false;
        this.field = field;
        this.isMe = isMe;
        this.battle = battle;
        this.party = party;
    }
    failure() {
        this.success === false;
        battleLog.write(`しかし うまく決まらなかった...`);
    }
    isField() {
        return this.field;
    }
    calcEffective(move, target) {
        const rate = (comp, defType) => {
            const rate = comp.rate.filter(r => r.defType === defType)[0].rate;
            if (rate === 0.0 && target.isItem('ねらいのまと')) {
                return 1.0;
            }
            if (move.name === 'Freeze-Dry' && defType === 'Water') { // 技「フリーズドライ」
                return 2.0;
            }
            return rate;
        };
        const calcRate = (move, target) => {
            let result = 1.0;
            const comp = typeCompatibility.filter(t => t.atkType === move.type)[0];
            for (const defType of target.type.get()) {
                if (defType === null)
                    continue;
                result = result * rate(comp, defType);
            }
            if (target.stateChange.tarShot.isTrue && move.type === 'Fire') {
                result = result * 2.0;
            }
            return result;
        };
        if (move.type === null)
            return;
        this.effective = calcRate(move, target);
    }
    isNotEffective() {
        return this.effective === 0;
    }
}
class AttackList {
    constructor() {
        this.list = [];
    }
    reset() {
        this.list = [];
    }
    setField() {
        const attack = new Attack(true, false, 0, 0);
        this.list.push(attack);
    }
    setPokemon(isMe, battle, party) {
        if (!main.isExistByBattle(isMe, battle))
            return;
        const attack = new Attack(false, isMe, battle, party);
        this.list.push(attack);
    }
    getTarget() {
        return this.list;
    }
    getValidTarget() {
        return this.list.filter(l => l.success);
    }
    getTargetToPokemon() {
        return this.list.filter(l => l.success && !l.isField() && !l.fainted);
    }
    getTargetToPokemonFainted() {
        return this.list.filter(l => l.success && !l.isField() && l.fainted);
    }
    getTargetToField() {
        return this.list.filter(l => l.success && l.isField());
    }
    isFailure() {
        return !this.list.some(t => t.success);
    }
}
class Command {
    constructor() {
        this.move = null;
        this.reserve = null;
        this.myTarget = null;
        this.opponentTarget = null;
    }
    isAttack() {
        return this.move !== null;
    }
    isExchange() {
        return this.reserve !== null;
    }
}
class ExtraCommand {
    constructor() {
        this.command = [];
        this.isCommand = { host: false, guest: false };
    }
}
class StateChange {
    constructor() {
        this._isTrue = false;
        this._turn = 0;
        this._count = 0;
        this._text = '';
    }
    set isTrue(isTrue) {
        this._isTrue = isTrue;
    }
    set turn(turn) {
        this._turn = turn;
    }
    set count(count) {
        this._count = count;
    }
    set text(text) {
        this._text = text;
    }
    get isTrue() {
        return this._isTrue;
    }
    get turn() {
        return this._turn;
    }
    get count() {
        return this._count;
    }
    get text() {
        return this._text;
    }
    reset() {
        this._isTrue = false;
        this._turn = 0;
        this._count = 0;
        this._text = '';
    }
}
class Transform extends StateChange {
    isTransform(name) {
        return true;
        //return this._isTrue && this.name === name;
    }
}
class Ability {
    constructor() {
        this.name = null;
        this.org = null;
        this.pokeName = '';
    }
    isName(ability) {
        return this.isValid() && this.name === ability;
    }
    isValid() {
        return true;
    }
    setOrg(ability) {
        this.name = ability;
        this.org = ability;
    }
    translate() {
        return abilityMaster.filter(a => a.nameEN === this.name)[0].nameJA;
    }
    changeMaster() {
        for (const info of changeAbilityTable) {
            if (info.name === this.name) {
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
            transform: 4
        };
        return sample;
    }
    onChangeWithMsg(ability) {
        this.name = ability;
        battleLog.write(`${this.pokeName}は ${this.translate()}に なった!`);
    }
}
class Item {
    constructor() {
        this.name = null;
        this.recycle = null;
        this.belch = false;
        this.pokeName = '';
    }
    copyFromOpp(name, pokeName) {
        this.name = name;
        this.pokeName = pokeName;
    }
    isNull() {
        return this.name === null;
    }
    isName(name) {
        return this.name === name;
    }
    isBerry() {
        // return this.name ===
        return false;
    }
    recyclable() {
        if (this.recycle === null) {
            this.recycle = this.name;
        }
        this.name = null;
    }
    getMaster() {
        return itemMaster.filter(i => i.nameEN === this.name)[0];
    }
    getCategory() {
        return categoryList.filter(c => c.name === this.getMaster().category)[0];
    }
    isReleasable(name, ability) {
        if (this.isNull())
            return false;
        const master = this.getMaster();
        const category = this.getCategory();
        if (this.isName('はっきんだま') && name === 'Giratina Origin')
            return false;
        if (master.category === 'plates' && name === 'Arceus')
            return false;
        if (master.category === 'species-specific' && master.nameEN.includes('Drive') && name === 'Genesect')
            return false;
        if (master.category === 'memories' && name === 'Silvally')
            return false; // シルヴァディ
        if (this.isName('くちたけん') && name === 'Zacian Crowned')
            return false; // ザシアン(王)
        if (this.isName('くちたたて') && name === 'Zamazenta Crowned')
            return false; // ザマゼンタ(王)
        if (master.category === 'mega-stones')
            return false;
        if (this.isName('あいいろのたま') && name === 'Kyogre Primal')
            return false; // ゲンシカイオーガ
        if (this.isName('べにいろのたま') && name === 'Groudon Primal')
            return false; // ゲンシグラードン
        if (this.isName('ブーストエナジー') && ability === 'Protosynthesis')
            return false; // 特性「こだいかっせい」
        if (this.isName('ブーストエナジー') && ability === 'Quark Drive')
            return false; // 特性「クォークチャージ」
        if (master.category === 'z-crystals')
            return false;
        return true;
    }
    translate() {
        return String(this.name);
    }
}
class TrickOrTreat extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}に ゴーストタイプが 追加された!`);
    }
}
class ForestsCurse extends StateChangeStatus {
    onActivate(pokemon) {
        this.isTrue = true;
        battleLog.write(`${pokemon.getArticle()}に くさタイプが 追加された!`);
    }
}
class Type {
    constructor() {
        this.list = [];
        this.trickOrTreat = new TrickOrTreat(); // ハロウィン
        this.forestCurse = new ForestsCurse(); // もりののろい
        this.pokeName = '';
    }
    copyFromOpp(list) {
        this.list = list;
    }
    get() {
        let result = this.list;
        if (this.trickOrTreat.isTrue)
            result.push('Ghost');
        if (this.forestCurse.isTrue)
            result.push('Grass');
        return this.list;
    }
    has(type) {
        return this.list.includes(type);
    }
    isOnly(type) {
        return this.get().length === 1 && this.get()[0] === type;
    }
    toType(type) {
        this.list = [type];
        battleLog.write(`${this.pokeName}は ${type}タイプに なった!`);
    }
    getCompatibility(type) {
        const comp = typeCompatibility.filter(t => t.atkType === type)[0];
        const result = this.get().reduce((acc, value) => {
            const rate = comp.rate.filter(r => r.defType === value)[0].rate;
            return acc * rate;
        }, 1.0);
        return result;
    }
}
class Pokemon {
    constructor(isMe, slot) {
        this.id = 0;
        this.order = new Order(true, 0);
        this.name = null; // 名前
        this.level = 50; // レベル
        this.gender = 'genderless'; // 性別
        this.nature = 'Bashful'; // 性格
        this.happiness = 255; // なつき度
        this.type = new Type(); // タイプ
        this.ability = new Ability(); // 特性
        this.item = new Item(); // 持ち物
        this.status = new Status(); // ステータス
        this.move = new Move(); // 技
        this.attack = new AttackList(); // 攻撃情報
        this.command = new Command(); // コマンド
        this.exCommnad = new ExtraCommand(); // 途中交代コマンド
        this.stateChange = new StateChangeSummary(); // 状態変化
        this.statusAilment = new StatusAilment(); // 状態異常
        this.actionOrder = new ActionOrder(); // 行動順
        this.extraParameter = new ExtraParameter();
        //--------------
        // 追加効果発動判定
        //--------------
        this.isAdditionalEffect = (target, attack) => {
            if (this.stateChange.sheerForce.isTrue)
                return false;
            if (target.status.hp.value.isZero())
                return false;
            if (attack.substitute)
                return false;
            if (target.ability.isName('Shield Dust'))
                return false; // 特性「りんぷん」
            if (target.isItem('おんみつマント'))
                return false;
            return true;
        };
        this.sereneGrace = () => {
            if (this.ability.isName('Serene Grace'))
                return 2; // 特性「てんのめぐみ」
            else
                return 1;
        };
        this.rainbow = () => {
            if (this.move.selected.name === 'Secret Power')
                return 1; // 技「ひみつのちから」
            if (main.field.getSide(this.isMine()).rainbow.isTrue)
                return 2;
            else
                return 1;
        };
        this.isAdditionalRate = (moveRate) => {
            const base = moveRate * this.sereneGrace() * this.rainbow();
            return getRandom() < base;
        };
        this.isAdditionalFlinch = (moveRate) => {
            const base = moveRate * this.sereneGrace() * this.rainbow();
            const flinchBase = Math.min(base, moveRate * 2);
            return getRandom() < flinchBase;
        };
        this.order = new Order(isMe, slot);
    }
    reset() {
        const partyOrder = this.order.party;
        const isMe = this.order.isMe;
        const imageHTML = getHTMLInputElement('myParty_image' + partyOrder);
        imageHTML.src = '';
        this.order = new Order(isMe, partyOrder);
        this.name = null;
        this.level = 50;
        this.type = new Type();
        this.gender = 'genderless';
        this.ability = new Ability();
        this.item = new Item();
        this.nature = 'Bashful';
        this.status = new Status();
        this.move = new Move();
        this.happiness = 255;
        this.statusAilment = new StatusAilment();
        this.attack = new AttackList();
        this.command = new Command();
        this.exCommnad = new ExtraCommand();
        this.stateChange = new StateChangeSummary();
    }
    register(reg) {
        this.id = reg.id;
        this.name = reg.name;
        this.level = reg.level;
        this.type.list = reg.type;
        this.gender = reg.gender.value;
        this.ability.setOrg(reg.ability.value);
        this.item.name = reg.item;
        this.nature = reg.nature;
        this.status.register(reg.stat);
        this.move.register(reg.move);
    }
    copyFromOpp(opp) {
        this.id = opp.id;
        this.name = opp.name;
        this.type.copyFromOpp(opp.type.list);
        this.gender = opp.gender;
        this.ability.setOrg(opp.ability.name);
        this.level = opp.level;
        this.item.copyFromOpp(opp.item.name, opp.item.pokeName);
        this.nature = opp.nature;
        this.status.copyFromOpp(opp.status);
        this.move.copyFromOpp(opp.move.learned);
    }
    showHandInfo() {
        getHTMLInputElement('party' + this.order.hand + '_name').textContent = (this.name === null) ? '名前' : this.translateName(this.name);
        getHTMLInputElement('party' + this.order.hand + '_gender').textContent = (this.name === null) ? '性別' : this.translateGender();
        getHTMLInputElement('party' + this.order.hand + '_level').textContent = (this.name === null) ? '' : String(this.level);
        getHTMLInputElement('party' + this.order.hand + '_ability').textContent = (this.name === null) ? '特性' : this.ability.translate();
        getHTMLInputElement('party' + this.order.hand + '_remainingHP').textContent = (this.name === null) ? '' : String(this.status.hp.value.value);
        getHTMLInputElement('party' + this.order.hand + '_item').textContent = (this.name === null) ? '持ち物' : String(this.item.name);
        if (this.type.get().length === 0) {
            getHTMLInputElement('party' + this.order.hand + '_type1').textContent = 'タイプ';
            getHTMLInputElement('party' + this.order.hand + '_type2').textContent = '';
        }
        else if (this.type.get().length === 1) {
            getHTMLInputElement('party' + this.order.hand + '_type1').textContent = this.translateType(String(this.type.get()[0]));
            getHTMLInputElement('party' + this.order.hand + '_type2').textContent = '';
        }
        else if (this.type.get().length === 2) {
            getHTMLInputElement('party' + this.order.hand + '_type1').textContent = this.translateType(String(this.type.get()[0]));
            getHTMLInputElement('party' + this.order.hand + '_type2').textContent = this.translateType(String(this.type.get()[1]));
        }
        this.status.show(this.name, this.order.hand);
        this.move.show(this.order.hand);
    }
    showPartyImage() {
        const partyOrder = this.order.party;
        const imageHTML = getHTMLInputElement('myParty_image' + partyOrder);
        imageHTML.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + this.id + '.png';
    }
    translateName(name) {
        for (const data of pokemonMaster) {
            if (data.nameEN === name)
                return data.nameJA;
            if (data.nameJA === name)
                return data.nameEN;
        }
        return '';
    }
    translateType(name) {
        for (const data of typeTextMaster) {
            if (data.nameEN === name)
                return data.nameJA;
            if (data.nameJA === name)
                return String(data.nameEN);
        }
        return name;
    }
    translateGender() {
        if (this.gender === 'male')
            return '♂';
        if (this.gender === 'female')
            return '♀';
        if (this.gender === 'genderless')
            return '-';
        return '-';
    }
    translateAbility(name) {
        for (const data of abilityMaster) {
            if (data.nameEN === name)
                return data.nameJA;
            if (data.nameJA === name)
                return data.nameEN;
        }
        return name;
    }
    isMine() {
        return this.order.isMe;
    }
    //-----------
    // 有効化どうか
    //-----------
    isAbility(ability) {
        if (!this.ability.isName(ability))
            return false;
        if (this.stateChange.noAbility.isTrue)
            return false;
        return true;
    }
    isItem(item) {
        if (!this.item.isName(item))
            return false;
        if (this.stateChange.embargo.isTrue)
            return false;
        if (main.field.whole.magicRoom.isTrue)
            return false;
        return true;
    }
    //----------
    // メッセージ
    //----------
    isMeToStr() {
        if (this.isMine())
            return '自分';
        else
            return '相手';
    }
    msgToBattleField() {
        battleLog.write(`${this.isMeToStr()}は ${this.translateName(String(this.name))}を くりだした!`);
    }
    getArticle() {
        if (this.name === null)
            return '';
        if (this.isMine())
            return this.translateName(this.name);
        else
            return '相手の' + this.translateName(this.name);
    }
    msgQuickDraw() {
        battleLog.write(`${this.getArticle()}は クイックドロウで 行動が はやくなった!`);
    }
    msgQuickClaw() {
        battleLog.write(`${this.getArticle()}は せんせいのつめで 行動が はやくなった!`);
    }
    msgCustapBerry() {
        battleLog.write(`${this.getArticle()}は イバンのみで 行動が はやくなった!`);
    }
    msgDeclareMove() {
        battleLog.write(`${this.getArticle()}の ${this.move.selected.translate()}!`);
    }
    msgDeclareAbility() {
        battleLog.write(`${this.translateName(String(this.name))}の ${this.ability.translate()}`);
    }
    msgDeclareFailure() {
        battleLog.write(`しかし うまく決まらなかった....`);
    }
    msgInvalidUser() {
        battleLog.write(`しかし ${this.getArticle()}には 使うことが できなかった!`);
    }
    msgRefWeight() {
        battleLog.write(`${this.getArticle()}は 首を 横に振った`);
        battleLog.write(`この技を しかけることが できないようだ......`);
    }
    msgCannotUse() {
        battleLog.write(`${this.getArticle()}は ${this.move.selected.translate()}が 使えない!`);
    }
    msgFutureSight() {
        battleLog.write(`${this.getArticle()}は 未来に 攻撃を予知した!`);
    }
    msgDoomDesire() {
        battleLog.write(`${this.getArticle()}は はめつのねがいを 未来に託した!`);
    }
    msgPreliminary() {
        if (this.move.selected.name === 'Razor Wind') { // 技「かまいたち」
            battleLog.write(`${this.getArticle()}の 周りで 空気が 渦を巻く!`);
        }
        if (this.move.selected.name === 'Ice Burn') { // 技「コールドフレア」
            battleLog.write(`${this.getArticle()}は 凍える空気に 包まれた!`);
        }
        if (this.move.selected.name === 'Sky Attack') { // 技「ゴッドバード」
            battleLog.write(`${this.getArticle()}を 激しい光が 包む!`);
        }
        if (this.move.selected.name === 'Geomancy') { // 技「ジオコントロール」
            battleLog.write(`${this.getArticle()}は パワーを ためこんでいる!`);
        }
        if (this.move.selected.name === 'Solar Beam' // 技「ソーラービーム」
            || this.move.selected.name === 'Solar Blade') { // 技「ソーラーブレード」
            battleLog.write(`${this.getArticle()}は 光を 吸収した!`);
        }
        if (this.move.selected.name === 'Freeze Shock') { // 技「フリーズボルト」
            battleLog.write(`${this.getArticle()}は 冷たい光に 包まれた!`);
        }
        if (this.move.selected.name === 'Meteor Beam') { // 技「メテオビーム」
            battleLog.write(`${this.getArticle()}に 宇宙の 力が あふれだす!`);
        }
        if (this.move.selected.name === 'Skull Bash') { // 技「ロケットずつき」
            battleLog.write(`${this.getArticle()}は 首を 引っ込めた!`);
        }
        if (this.move.selected.name === 'Dig') { // 技「あなをほる」
            battleLog.write(`${this.getArticle()}は 地面に 潜った!`);
        }
        if (this.move.selected.name === 'Fly') { // 技「そらをとぶ」
            battleLog.write(`${this.getArticle()}は 空高く 飛び上がった!`);
        }
        if (this.move.selected.name === 'Bounce') { // 技「とびはねる」
            battleLog.write(`${this.getArticle()}は 高く 飛び跳ねた!`);
        }
        if (this.move.selected.name === 'Dive') { // 技「ダイビング」
            battleLog.write(`${this.getArticle()}は 水中に 身を潜めた!`);
        }
        if (this.move.selected.name === 'Phantom Force' // 技「ゴーストダイブ」
            || this.move.selected.name === 'Shadow Force') { // 技「シャドーダイブ」
            battleLog.write(`${this.getArticle()}の姿が 一瞬にして 消えた!`);
        }
    }
    msgPowerHerb() {
        battleLog.write(`${this.getArticle()}は パワフルハーブで 力が みなぎった!`);
    }
    msgNotHit() {
        battleLog.write(`${this.getArticle()}には 当たらなかった!`);
    }
    msgPsychicTerrain() {
        battleLog.write(`${this.getArticle()}は サイコフィールドに 守られている!`);
    }
    msgQuickGuard() {
        battleLog.write(`${this.getArticle()}は ファストガードで 守られた!`);
    }
    msgWideGuard() {
        battleLog.write(`${this.getArticle()}は ワイドガードで 守られた!`);
    }
    msgCraftyShield() {
        battleLog.write(`${this.getArticle()}は トリックガードで 守られた!`);
    }
    msgProtect() {
        battleLog.write(`${this.getArticle()}は 攻撃から 身を守った!`);
    }
    msgHurt() {
        battleLog.write(`${this.getArticle()}は 傷ついた!`);
    }
    msgMatBlock() {
        battleLog.write(`${this.move.selected.translate()}は たたみがえしで 防がれた!`);
    }
    msgInvalid() {
        battleLog.write(`${this.getArticle()}には 効果がないようだ...`);
    }
    msgSafetyGoggles(move) {
        battleLog.write(`${this.getArticle()}は ぼうじんゴーグルで ${move}を 受けない!`);
    }
    msgDamage(damage) {
        battleLog.write(`${damage}の ダメージ!`);
    }
    msgSuperEffective(targetName) {
        if (this.attack.getTarget().length === 1) {
            battleLog.write(`効果は バツグンだ!`);
        }
        else {
            battleLog.write(`${targetName}に 効果は バツグンだ!`);
        }
    }
    msgNotEffective(targetName) {
        if (this.attack.getTarget().length === 1) {
            battleLog.write(`${targetName}に 効果は 今ひとつのようだ......`);
        }
        else {
            battleLog.write(`${targetName}に 効果は いまひとつだ`);
        }
    }
    msgCritical(targetName) {
        if (this.attack.getTarget().length === 1) {
            battleLog.write(`急所に 当たった!`);
        }
        else {
            battleLog.write(`${targetName}に 急所に 当たった!`);
        }
    }
    msgEndure() {
        battleLog.write(`${this.getArticle()}は 攻撃を こらえた!`);
    }
    msgFocusSash() {
        battleLog.write(`${this.getArticle()}は きあいのタスキで 持ちこたえた!`);
    }
    msgFocusBand() {
        battleLog.write(`${this.getArticle()}は きあいのハチマキで 持ちこたえた!`);
    }
    msgCannotEscape() {
        battleLog.write(`${this.getArticle()}は もう 逃げられない!`);
    }
    msgWhiteHerb() {
        battleLog.write(`${this.getArticle()}は しろいハーブで ステータスを 元に戻した!`);
    }
    msgLiquidOoze() {
        battleLog.write(`${this.getArticle()}は ヘドロえきを 吸い取った!`);
    }
    msgDrain(targetName) {
        battleLog.write(`${targetName}から 体力を 吸い取った!`);
    }
    msgClearSmog() {
        battleLog.write(`全ての ステータスが 元に 戻った!`);
    }
    msgProtectivePads() {
        battleLog.write(`${this.getArticle()}は ぼうごパットで 防いだ!`);
    }
    msgRoughSkin() {
        battleLog.write(`${this.getArticle()}は 傷ついた!`);
    }
    msgAttract() {
        battleLog.write(`${this.getArticle()}は メロメロに なった!`);
    }
    msgMummy() {
        battleLog.write(`${this.getArticle()}は とくせいが ミイラになっちゃった!`);
    }
    msgLingeringAroma() {
        battleLog.write(`${this.getArticle()}は においが うつって とれなくなっちゃった!`);
    }
    msgExchangeAbility() {
        battleLog.write(`${this.getArticle()}は おたがいの とくせいを 入れ替えた!`);
    }
    msgElectromorphosis(moveName) {
        battleLog.write(`${this.getArticle()}は ${moveName}を 受けて 充電した!`);
    }
    msgAngerPoint() {
        battleLog.write(`${this.getArticle()}は 攻撃が 最大まで 上がった!`);
    }
    msgHalfBerry() {
        battleLog.write(`${this.getArticle()}への ダメージを ${this.stateChange.halfBerry.text}が 弱めた!`);
    }
    msgRockyHelmet() {
        battleLog.write(`${this.getArticle()}は ゴツゴツメットで ダメージを受けた!`);
    }
    msgAirBalloon() {
        battleLog.write(`${this.getArticle()}の ふうせんが 割れた!`);
    }
    msgIncinerate() {
        battleLog.write(`${this.getArticle()}の ${this.item.name}は 焼けてなくなった!`);
    }
    msgJabocaBerry(targetName) {
        battleLog.write(`${this.getArticle()}は ${targetName}の ジャポのみで ダメージを 受けた!`);
    }
    msgRowapBerry(targetName) {
        battleLog.write(`${this.getArticle()}は ${targetName}の レンブのみで ダメージを 受けた!`);
    }
    msgFainted() {
        battleLog.write(`${this.getArticle()}は たおれた!`);
    }
    msgDestinyBond() {
        battleLog.write(`${this.getArticle()}は 相手を 道連れに した!`);
    }
    msgRecoil() {
        battleLog.write(`${this.getArticle()}は 反動による ダメージを 受けた!`);
    }
    msgKnockOff(targetName, targetItem) {
        battleLog.write(`${this.getArticle()}は ${targetName}の ${targetItem}を はたき落とした!`);
    }
    msgNotThief(targetName) {
        battleLog.write(`${targetName}の 道具を 奪えない!`);
    }
    msgThief(targetName, targetItem) {
        battleLog.write(`${this.getArticle()}は ${targetName}から ${targetItem}を 奪い取った!`);
    }
    msgBugBote(berryName) {
        battleLog.write(`${this.getArticle()}は ${berryName}を 奪って 食べた!`);
    }
    msgSmackDown() {
        battleLog.write(`${this.getArticle()}は 撃ち落とされて 地面に 落ちた!`);
    }
    msgBattleBond() {
        battleLog.write(`${this.getArticle()}に きずなの 力が みなぎった!`);
    }
    msgLifeOrb() {
        battleLog.write(`${this.getArticle()}は 命が 少し削られた!`);
    }
    msgShellBell() {
        battleLog.write(`${this.getArticle()}は かいがらのすずで 少し 回復`);
    }
    msgPickpocket() {
        battleLog.write(`${this.getArticle()}の ${this.item.name}を 奪った!`);
    }
    msgAddHPByAbility() {
        battleLog.write(`${this.getArticle()}の 体力が 回復した!`);
    }
    msgAddHPByItem(item) {
        battleLog.write(`${this.getArticle()}は ${item}で 体力を 回復した!`);
    }
    msgToHand() {
        battleLog.write(`${this.getArticle()}を 引っ込めた!`); // メッセージ確認不足
    }
    //------------------
    // 特性による優先度変更
    //------------------
    changeMovePriority() {
        if (this.ability.isName('Prankster') && this.move.selected.isStatus()) { // 特性「いたずらごころ」
            this.move.selected.priority += 1;
        }
        if (this.ability.isName('Gale Wings') && this.status.hp.value.isMax()) { // 特性「はやてのつばさ」
            this.move.selected.priority += 1;
        }
        if (this.ability.isName('Triage') && this.move.selected.getMaster().heal) { // 特性「ヒーリングシフト」
            this.move.selected.priority += 3;
        }
    }
    //-------------------------
    // 残りHPによるきのみの発動判定
    //-------------------------
    isActivateBerryByHP(denominator) {
        const gluttony = (this.ability.isName('Gluttony')) ? 2 : 1; // 特性「くいしんぼう」
        if (denominator === 2) {
            return this.status.hp.value.isLessEqual(denominator);
        }
        else {
            return this.status.hp.value.isLessEqual(denominator / gluttony);
        }
    }
    //-----------
    // 持ち物の消費
    //-----------
    consumeItem() {
        if (this.item.isNull())
            return;
        if (this.item.isBerry()) {
            this.item.belch = true;
            this.activateCheekPouch();
        }
        this.item.recyclable();
    }
    //-------------
    // ほおぶくろ発動
    //-------------
    activateCheekPouch() {
        if (!this.ability.isName('Cheek Pouch'))
            return; // 特性「ほおぶくろ」
        if (this.status.hp.value.isZero())
            return;
        if (this.status.hp.value.isMax())
            return;
        if (this.stateChange.healBlock.isTrue)
            return;
        const value = Math.floor(this.getOrgHP() / 3);
        this.status.hp.value.add(value);
        this.msgDeclareAbility();
        this.msgAddHPByAbility();
    }
    //-----------
    // 実質HP
    //-----------
    getOrgHP() {
        const dynamax = (this.stateChange.dynamax.isTrue) ? 0.5 : 1;
        return this.status.hp.av * dynamax;
    }
    //--------------
    // ランク変化可能量
    //--------------
    getRankVariableOrg(value) {
        value = (this.ability.isName('Simple')) ? value * 2 : value; // 特性「たんじゅん」
        value = (this.ability.isName('Contrary')) ? value * -1 : value; // 特性「あまのじゃく」
        return value;
    }
    getRankVariable(para, value) {
        switch (para) {
            case 'atk':
                return this.status.atk.rank.getVariable(value);
            case 'def':
                return this.status.def.rank.getVariable(value);
            case 'spA':
                return this.status.spA.rank.getVariable(value);
            case 'spD':
                return this.status.spD.rank.getVariable(value);
            case 'spe':
                return this.status.spe.rank.getVariable(value);
            case 'acc':
                return this.status.acc.getVariable(value);
            case 'eva':
                return this.status.eva.getVariable(value);
            default:
                return 0;
        }
    }
    isChangeRankByOther(para, value, other) {
        const setting = this.getRankVariableOrg(value);
        const real = this.getRankVariable(para, setting);
        const abilityCheck = (para, real) => {
            if (real >= 0)
                return true;
            if (this.ability.isName('White Smoke'))
                return false; // 特性「しろいけむり」
            if (this.ability.isName('Clear Body'))
                return false; // 特性「クリアボディ」
            if (this.ability.isName('Full Metal Body'))
                return false; // 特性「メタルプロテクト」
            if (main.isExistAbilityInSide(this.isMine(), 'Flower Veil') && this.type.has('Grass'))
                return false; // 特性「フラワーベール」
            if (this.ability.isName('Mirror Armor')) { // 特性「ミラーアーマー」
                //changeTargetRank( target, pokemon, parameter, change );
                // return;
            }
            if (this.ability.isName('Hyper Cutter') && para === 'atk')
                return false; // 特性「かいりきバサミ」
            if (this.ability.isName('Big Pecks') && para === 'def')
                return false; // 特性「はとむね」
            if (this.ability.isName('Keen Eye') && para === 'acc')
                return false; // 特性「するどいめ」
            return true;
        };
        const mistCheck = (real, other) => {
            if (real >= 0)
                return true;
            if (!main.field.getSide(this.isMine()).mist.isTrue)
                return true;
            if (!other.ability.isName('Infiltrator'))
                return true; // 特性「すりぬけ」
            return false;
        };
        return real !== 0 && mistCheck(real, other) && abilityCheck(para, real);
    }
    isChangeRank(para, value) {
        const setting = this.getRankVariableOrg(value);
        const real = this.getRankVariable(para, setting);
        return real !== 0;
    }
    changeRank(para, value, item) {
        const setting = this.getRankVariableOrg(value);
        const real = this.getRankVariable(para, setting);
        this.status.changeRank(para, real, setting, this.getArticle(), item);
    }
    changeRankByOther(para, value, other) {
        this.changeRank(para, value);
        const setting = this.getRankVariableOrg(value);
        const real = this.getRankVariable(para, setting);
        if (real >= 0)
            return;
        if (this.ability.isName('Defiant') && this.isMine() !== other.isMine()) { // 特性「まけんき」
            this.msgDeclareAbility();
            this.changeRank('atk', 2);
        }
        if (this.ability.isName('Competitive') && this.isMine() !== other.isMine()) { // 特性「かちき」
            this.msgDeclareAbility();
            this.changeRank('spA', 2);
        }
    }
    safeGuardCheck(other) {
        if (!main.field.getSide(this.isMine()).safeguard.isTrue)
            return true;
        if (other.ability.isName('Infiltrator') && this.isMine() !== other.isMine())
            return true; // 特性「すりぬけ」
        return false;
    }
    mistTerrainCheck() {
        if (!main.field.terrain.isMisty())
            return true;
        if (!this.isGround())
            return true;
        return false;
    }
    //-----------
    // 状態異常付与
    //-----------
    isGetAilmentByOther(ailment, other) {
        if (ailment === null)
            return false;
        if (!this.statusAilment.isHealth())
            return false;
        const abilityCheck = () => {
            if (this.ability.isName('Shield Dust'))
                return false; // 特性「りんぷん」
            if (this.ability.isName('Purifying Salt'))
                return false; // 特性「きよめのしお」
            if (this.ability.isName('Comatose'))
                return false; // 特性「ぜったいねむり」
            if (this.ability.isName('Leaf Guard') && main.field.weather.isSunny(this))
                return false; // 特性「リーフガード」
            //if ( this.ability.isName( 'リミットシールド' ) && this.name === 'メテノ(流星)' ) return false;
            if (main.isExistAbilityInSide(this.isMine(), 'Flower Veil') && this.type.has('Grass'))
                return false; // 特性「フラワーベール」
            return true;
        };
        const eachCheck = (ailment) => {
            switch (ailment) {
                case 'Paralysis':
                    if (this.type.has('Electric'))
                        return false;
                    break;
                case 'Frozen':
                    if (this.type.has('Ice'))
                        return false;
                    if (main.field.weather.isSunny(this))
                        return false;
                    if (this.ability.isName('Magma Armor'))
                        return false; // 特性「マグマのよろい」
                    break;
                case 'Burned':
                    if (this.type.has('Fire'))
                        return false;
                    if (this.ability.isName('Water Veil'))
                        return false; // 特性「みずのベール」
                    if (this.ability.isName('Water Bubble'))
                        return false; // 特性「すいほう」
                    break;
                case 'Poisoned':
                    if (this.ability.isName('Immunity'))
                        return false; // 特性「めんえき」
                    if (main.isExistAbilityInSide(this.isMine(), 'Pastel Veil'))
                        return false; // 特性「パステルベール」
                    if (this.type.has('Poison'))
                        return false;
                    if (this.type.has('Steel'))
                        return false;
                    break;
                case 'Asleep':
                    if (this.ability.isName('Vital Spirit'))
                        return false; // 特性「やるき」
                    if (this.ability.isName('Insomnia'))
                        return false; // 特性「ふみん」
                    if (main.isExistAbilityInSide(this.isMine(), 'Sweet Veil'))
                        return false; // 特性「スイートベール」
                    if (main.field.terrain.isElectric() && this.isGround())
                        return false;
                    if (main.isUproar())
                        return false;
                    break;
                default:
                    break;
            }
            return true;
        };
        return this.safeGuardCheck(other) && this.mistTerrainCheck() && abilityCheck() && eachCheck(ailment);
    }
    getAilmentByAdditionalEffect(ailmentName, other) {
        switch (ailmentName) {
            case 'paralysis':
                if (!this.isGetAilmentByOther('Paralysis', other))
                    return;
                this.statusAilment.getParalysis();
                break;
            case 'burn':
                if (!this.isGetAilmentByOther('Burned', other))
                    return;
                this.statusAilment.getBurned();
                break;
            case 'freeze':
                if (!this.isGetAilmentByOther('Frozen', other))
                    return;
                this.statusAilment.getFrozen();
                break;
            case 'sleep':
                if (!this.isGetAilmentByOther('Asleep', other))
                    return;
                this.statusAilment.getAsleep();
                break;
            case 'poison':
                if (!this.isGetAilmentByOther('Poisoned', other))
                    return;
                if (other.move.selected.name === 'Poison Fang') { // どくどくのキバ
                    this.statusAilment.getBadPoisoned();
                }
                else {
                    this.statusAilment.getPoisoned();
                }
                break;
            default:
                break;
        }
    }
    getAilmentByStatusMove(ailmentName, pokemon) {
        switch (ailmentName) {
            case 'paralysis':
                this.statusAilment.getParalysis();
                break;
            case 'burn':
                this.statusAilment.getBurned();
                break;
            case 'freeze':
                this.statusAilment.getFrozen();
                break;
            case 'sleep':
                this.statusAilment.getAsleep();
                break;
            case 'poison':
                this.statusAilment.getPoisoned();
                break;
            case 'confusion':
                this.stateChange.confuse.onActivate(this);
                break;
            case 'leech-seed': // やどりぎのタネ
                this.stateChange.leechSeed.onActivate(pokemon, this);
                break;
            case 'nightmare': // あくむ
                break;
            case 'no-type-immunity': // みやぶる、かぎわける、ミラクルアイ
                break;
            case 'perish-song': // ほろびのうた
                this.stateChange.perishSong.onActivate();
                break;
            case 'infatuation': // メロメロ
                break;
            case 'torment': // いちゃもん
                this.stateChange.torment.onActivate(this);
                break;
            case 'ingrain': // ねをはる
                this.stateChange.ingrain.onActivate(this);
                break;
            case 'yawn': // あくび
                break;
            case 'embargo': // さしおさえ
                this.stateChange.embargo.onActivate(this);
                break;
            case 'heal-block': // かいふくふうじ
                this.stateChange.healBlock.onActivate(this);
                break;
            case 'tar-shot': // タールショット
                this.stateChange.tarShot.onActivate(this);
                break;
            case 'unknown': // テレキネシス
                this.stateChange.telekinesis.onActivate(this);
                break;
            default:
                break;
        }
    }
    //--------
    // こんらん
    //--------
    isGetConfusionByAdditionalEffect(other) {
        if (this.stateChange.confuse.isTrue)
            return false;
        if (this.ability.isName('Own Tempo'))
            return false; // 特性「マイペース」
        return this.safeGuardCheck(other) && this.mistTerrainCheck();
    }
    //--------------
    // フォルムチェンジ
    //--------------
    getNextForm() {
        if (this.name === 'Aegislash Shield')
            return 'Aegislash Blade';
        if (this.name === 'Aegislash Blade')
            return 'Aegislash Shield';
        if (this.name === 'Meloetta Aria')
            return 'Meloetta Pirouette';
        if (this.name === 'Meloetta Pirouette')
            return 'Meloetta Aria';
        if (this.name === 'Mimikyu Disguised')
            return 'Mimikyu Busted';
        if (this.name === 'Cramorant Gulping')
            return 'Cramorant';
        if (this.name === 'Cramorant Gorging')
            return 'Cramorant';
        if (this.name === 'Eiscue Ice')
            return 'Eiscue Noice';
        if (this.name === 'Eiscue Noice')
            return 'Eiscue Ice';
        return this.name;
    }
    formChange() {
        const nextForm = this.getNextForm();
        if (nextForm === this.name)
            return;
        this.name = nextForm;
        const pokemon = this.getMaster();
        this.type.list = pokemon.type;
        this.ability.setOrg(abilityTextList.filter(name => name === pokemon.ability[0])[0]);
        this.status.formChange(pokemon.baseStatus, this.level, this.getNatureMaster());
    }
    msgAegislashSchild() {
        battleLog.write(`ブレードフォルム チェンジ!`);
    }
    msgAegislashBlade() {
        battleLog.write(`シールドフォルム チェンジ!`);
    }
    msgRelicSong() {
        battleLog.write(`${this.getArticle()}の 姿が 変化した!`);
    }
    msgDisguise() {
        battleLog.write(`${this.getArticle()}の ばけのかわが はがれた!`);
    }
    msgIceFace() {
        battleLog.write(`${this.getArticle()}の 姿が 変化した!`);
    }
    //-------------
    // きのみを食べる
    //-------------
    getRipen() {
        return (this.ability.isName('Ripen')) ? 2 : 1; // 特性「じゅくせい」
    }
    getChangeValueByBerry(denominator) {
        const value = Math.floor(this.getOrgHP() / denominator) * this.getRipen();
        return value;
    }
    eatBerryJuice() {
        this.status.hp.value.add(10);
        this.msgAddHPByItem('きのみジュース');
    }
    eatCheriBerry() {
        this.statusAilment.getHealth('クラボのみ');
    }
    eatChestoBerry() {
        this.statusAilment.getHealth('カゴのみ');
    }
    eatPechaBerry() {
        this.statusAilment.getHealth('モモンのみ');
    }
    eatRawstBerry() {
        this.statusAilment.getHealth('チーゴのみ');
    }
    eatAspearBerry() {
        this.statusAilment.getHealth('ナナシのみ');
    }
    eatLeppaBerry() {
        // ヒメリのみ
    }
    eatOranBerry() {
        this.status.hp.value.add(10 * this.getRipen());
        this.msgAddHPByItem('オレンのみ');
    }
    eatPersimBerry() {
        // キーのみ
    }
    eatLumBerry() {
        this.statusAilment.getHealth('ラムのみ');
        // 混乱を治す
    }
    eatSitrusBerry() {
        const value = this.getChangeValueByBerry(4);
        this.status.hp.value.add(value);
        this.msgAddHPByItem('オボンのみ');
    }
    eatFigyBerry() {
        const value = this.getChangeValueByBerry(3);
        this.status.hp.value.add(value);
        this.msgAddHPByItem('フィラのみ');
    }
    eatWikiBerry() {
        const value = this.getChangeValueByBerry(3);
        this.status.hp.value.add(value);
        this.msgAddHPByItem('ウイのみ');
    }
    eatMagoBerry() {
        const value = this.getChangeValueByBerry(3);
        this.status.hp.value.add(value);
        this.msgAddHPByItem('マゴのみ');
    }
    eatAguavBerry() {
        const value = this.getChangeValueByBerry(3);
        this.status.hp.value.add(value);
        this.msgAddHPByItem('バンジのみ');
    }
    eatIapapaBerry() {
        const value = this.getChangeValueByBerry(3);
        this.status.hp.value.add(value);
        this.msgAddHPByItem('イアのみ');
    }
    eatLiechiBerry() {
        this.changeRank('atk', this.getRipen(), 'チイラのみ');
    }
    eatGanlonBerry() {
        this.changeRank('def', this.getRipen(), 'リュガのみ');
    }
    eatSalacBerry() {
        this.changeRank('spe', this.getRipen(), 'カムラのみ');
    }
    eatPetayaBerry() {
        this.changeRank('spA', this.getRipen(), 'ヤタピのみ');
    }
    eatApicotBerry() {
        this.changeRank('spD', this.getRipen(), 'ズアのみ');
    }
    eatLansatBerry() {
        // サンのみ
    }
    eatStarfBerry() {
        // スターのみ
    }
    eatEnigmaBerry() {
        const value = this.getChangeValueByBerry(4);
        this.status.hp.value.add(value);
        this.msgAddHPByItem('ナゾのみ');
    }
    eatMicleBerry() {
        // ミクルのみ
    }
    eatKeeBerry() {
        this.changeRank('def', this.getRipen(), 'アッキのみ');
    }
    eatMarangaBerry() {
        this.changeRank('spD', this.getRipen(), 'タラプのみ');
    }
    isEatBerryInstantly(berry) {
        if (berry === 'クラボのみ') {
            if (this.statusAilment.isParalysis()) {
                this.eatCheriBerry();
                return true;
            }
        }
        if (berry === 'カゴのみ') {
            if (this.statusAilment.isAsleep()) {
                this.eatChestoBerry();
                return true;
            }
        }
        if (berry === 'モモンのみ') {
            if (this.statusAilment.isPoisoned() || this.statusAilment.isBadPoisoned()) {
                this.eatPechaBerry();
                return true;
            }
        }
        if (berry === 'チーゴのみ') {
            if (this.statusAilment.isBurned()) {
                this.eatRawstBerry();
                return true;
            }
        }
        if (berry === 'ナナシのみ') {
            if (this.statusAilment.isFrozen()) {
                this.eatAspearBerry();
                return true;
            }
        }
        if (berry === 'ヒメリのみ') {
            this.eatLeppaBerry();
            return true;
        }
        if (berry === 'オレンのみ') {
            if (!this.status.hp.value.isMax()) {
                this.eatOranBerry();
                return true;
            }
        }
        if (berry === 'キーのみ') {
            if (this.stateChange.confuse.isTrue) {
                this.eatPersimBerry();
                return true;
            }
        }
        if (berry === 'ラムのみ') {
            if (!this.statusAilment.isHealth() || this.stateChange.confuse.isTrue) {
                this.eatLumBerry();
                return true;
            }
        }
        if (berry === 'オボンのみ') {
            if (!this.status.hp.value.isMax()) {
                this.eatSitrusBerry();
                return true;
            }
        }
        if (berry === 'フィラのみ') {
            if (!this.status.hp.value.isMax()) {
                this.eatFigyBerry();
                return true;
            }
        }
        if (berry === 'ウイのみ') {
            if (!this.status.hp.value.isMax()) {
                this.eatWikiBerry();
                return true;
            }
        }
        if (berry === 'マゴのみ') {
            if (!this.status.hp.value.isMax()) {
                this.eatMagoBerry();
                return true;
            }
        }
        if (berry === 'バンジのみ') {
            if (!this.status.hp.value.isMax()) {
                this.eatAguavBerry();
                return true;
            }
        }
        if (berry === 'イアのみ') {
            if (!this.status.hp.value.isMax()) {
                this.eatIapapaBerry();
                return true;
            }
        }
        if (berry === 'チイラのみ') {
            if (this.isChangeRank('atk', 1)) {
                this.eatLiechiBerry();
                return true;
            }
        }
        if (berry === 'リュガのみ') {
            if (this.isChangeRank('def', 1)) {
                this.eatGanlonBerry();
                return true;
            }
        }
        if (berry === 'カムラのみ') {
            if (this.isChangeRank('spe', 1)) {
                this.eatSalacBerry();
                return true;
            }
        }
        if (berry === 'ヤタピのみ') {
            if (this.isChangeRank('spA', 1)) {
                this.eatPetayaBerry();
                return true;
            }
        }
        if (berry === 'ズアのみ') {
            if (this.isChangeRank('spD', 1)) {
                this.eatApicotBerry();
                return true;
            }
        }
        if (berry === 'サンのみ') {
        }
        if (berry === 'スターのみ') {
        }
        if (berry === 'ナゾのみ') {
            if (!this.status.hp.value.isMax()) {
                this.eatEnigmaBerry();
                return true;
            }
        }
        if (berry === 'ミクルのみ') {
        }
        if (berry === 'アッキのみ') {
            if (this.isChangeRank('def', 1)) {
                this.eatKeeBerry();
                return true;
            }
        }
        if (berry === 'タラプのみ') {
            if (this.isChangeRank('spD', 1)) {
                this.eatMarangaBerry();
                return true;
            }
        }
        return false;
    }
    //-----------
    // 手持ちに戻る
    //-----------
    isFainted() {
        if (!this.status.hp.value.isZero())
            return false;
        this.msgFainted();
        return true;
    }
    toHand() {
        const naturalCure = () => {
            if (!this.ability.isName('Natural Cure'))
                return; // 特性「しぜんかいふく」
            this.statusAilment.getHealth();
        };
        const regenerator = () => {
            if (!this.ability.isName('Regenerator'))
                return; // 特性「さいせいりょく」
            const value = Math.floor(this.getOrgHP() / 3);
            this.status.hp.value.add(value);
        };
        if (!this.status.hp.value.isZero()) {
            naturalCure(); // しぜんかいふく
            regenerator(); // さいせいりょく
            this.msgToHand();
        }
        main.getPlayer(this.isMine()).setExtraCommand(this.order);
        // 情報のリセット
        // pokemon.ability = pokemon.statusOrg.ability;
        // pokemon.type1 = pokemon.statusOrg.type1;
        // pokemon.type2 = pokemon.statusOrg.type2;
        // pokemon.command = new Command;
        // pokemon.damage = [];
        // pokemon.moveUsed = new AvailableMove;
        this.status.resetRank();
        this.order.battle = null;
        const hand = this.order.hand;
        this.order.hand = main.field.numberOfPokemon;
        main.getPlayer(this.isMine()).cycleHand(hand);
    }
    //-------------
    // バトル場に出る
    //-------------
    toBattleField(battle) {
        main.getPlayer(this.isMine()).deleteExtraCommand(battle);
        this.order.battle = battle;
        const hand = this.order.hand;
        for (const pokemon of main.getParty(this.isMine())) {
            if (pokemon.order.hand < hand) {
                pokemon.order.hand += 1;
            }
        }
        this.order.hand = 0;
        if (this.isMine()) {
            getHTMLInputElement('battleMyImage_' + battle).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + this.getMaster().id + '.png';
        }
        else {
            getHTMLInputElement('battleOpponentImage_' + battle).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + this.getMaster().id + '.png';
        }
        this.msgToBattleField();
    }
    getMaster() {
        return pokemonMaster.filter(p => p.nameEN === this.name)[0];
    }
    getNatureMaster() {
        return natureMaster.filter(n => n.nameEN === this.nature)[0];
    }
    getWeight() {
        const master = this.getMaster();
        let weight = master.weight;
        // ボディパージ
        if (this.ability.isName('Light Metal')) { // 特性「ライトメタル」
            weight = weight / 2;
        }
        if (this.ability.isName('Heavy Metal')) { // 特性「ヘヴィメタル」
            weight = weight * 2;
        }
        if (this.isItem('かるいし')) {
            weight = weight - 100;
        }
        return Math.max(0.1, weight);
    }
    isContact() {
        return this.move.selected.getMaster().contact && !this.ability.isName('Long Reach'); // 特性「えんかく」
    }
    isGround() {
        if (this.stateChange.ingrain.isTrue === true)
            return true;
        if (this.stateChange.smackDown.isTrue === true)
            return true;
        if (main.field.whole.gravity.isTrue === true)
            return true;
        if (this.isItem('くろいてっきゅう'))
            return true;
        if (this.type.has('Flying'))
            return false;
        if (this.ability.isName('Levitate'))
            return false; // 特性「ふゆう」
        if (this.isItem('ふうせん'))
            return false;
        if (this.stateChange.magnetRise.isTrue)
            return false;
        if (this.stateChange.telekinesis.isTrue)
            return false;
        return true;
    }
    onActivateWhenLanding() {
        if (!this.ability.isValid())
            return;
        switch (this.ability.name) {
            // 場に出たときに発動する特性
            case 'Drizzle': // 特性「あめふらし」
                if (main.field.weather.isGetRainy()) {
                    this.msgDeclareAbility();
                    main.field.weather.getRainy(this);
                }
                break;
            case 'Intimidate': // 特性「いかく」
                this.msgDeclareAbility();
                break;
            case 'Air Lock': // 特性「エアロック」
                this.msgDeclareAbility();
                battleLog.write(`天候の影響が なくなった!`);
                break;
            case 'Electric Surge': // 特性「エレキメイカー」
                if (!main.field.terrain.isElectric()) {
                    this.msgDeclareAbility();
                    main.field.terrain.getElectric(this);
                }
                break;
            case 'Aura Break': // 特性「オーラブレイク」
                this.msgDeclareAbility();
                battleLog.write(`${this.getArticle()}は すべての オーラを 制圧する!`);
                break;
            case 'Frisk': // 特性「おみとおし」
                this.msgDeclareAbility();
                break;
            case 'Desolate Land': // 特性「おわりのだいち」
                if (main.field.weather.isGetBadSunny()) {
                    this.msgDeclareAbility();
                    main.field.weather.getBadSunny();
                }
                break;
            case 'Mold Breaker': // 特性「かたやぶり」
                this.msgDeclareAbility();
                battleLog.write(`${this.getArticle()}は かたやぶりだ!`);
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
                if (!main.field.terrain.isGrassy()) {
                    this.msgDeclareAbility();
                    main.field.terrain.getGrassy(this);
                }
                break;
            case 'Psychic Surge': // 特性「サイコメイカー」
                if (!main.field.terrain.isPsychic()) {
                    this.msgDeclareAbility();
                    main.field.terrain.getPsychic(this);
                }
                break;
            case 'Slow Start': // 特性「スロースタート」
                this.msgDeclareAbility();
                break;
            case 'Sand Stream': // 特性「すなあらし」
                if (main.field.weather.isGetSandy()) {
                    this.msgDeclareAbility();
                    main.field.weather.getSandy(this);
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
                battleLog.write(`${this.getArticle()}は ダークオーラを 放っている!`);
                break;
            case 'Turboblaze': // 特性「ターボブレイズ」
                this.msgDeclareAbility();
                battleLog.write(`${this.getArticle()}は 燃え盛る オーラを 放っている!`);
                break;
            case 'Download': // 特性「ダウンロード」
                this.msgDeclareAbility();
                break;
            case 'Teravolt': // 特性「テラボルテージ」
                this.msgDeclareAbility();
                battleLog.write(`${this.getArticle()}は 弾ける オーラを 放っている!`);
                break;
            case 'Delta Stream': // 特性「デルタストリーム」
                if (main.field.weather.isGetTurbulence()) {
                    this.msgDeclareAbility();
                    main.field.weather.getTurbulence();
                }
                break;
            case 'Trace': // 特性「トレース」
                this.msgDeclareAbility();
                break;
            case 'Cloud Nine': // 特性「ノーてんき」
                this.msgDeclareAbility();
                battleLog.write(`天候の影響が なくなった!`);
                break;
            case 'Primordial Sea': // 特性「はじまりのうみ」
                if (main.field.weather.isGetBadRainy()) {
                    this.msgDeclareAbility();
                    main.field.weather.getBadRainy();
                }
                break;
            case 'Hadron Engine': // 特性「ハドロンエンジン」
                if (!main.field.terrain.isElectric()) {
                    this.msgDeclareAbility();
                    main.field.terrain.getElectric(this);
                    battleLog.write(`${this.getArticle()}は エレキフィールドを はり 未来の機関を 躍動させる!!`);
                }
                else {
                    battleLog.write(`${this.getArticle()}は エレキフィールドで 未来の機関を 躍動させる!!`);
                }
                break;
            case 'Screen Cleaner': // 特性「バリアフリー」
                this.msgDeclareAbility();
                break;
            case 'Drought': // 特性「ひでり」
                if (main.field.weather.isGetSunny()) {
                    this.msgDeclareAbility();
                    main.field.weather.getSunny(this);
                }
                break;
            case 'Orichalcum Pulse': // 特性「ひひいろのこどう」
                if (main.field.weather.isGetSunny()) {
                    this.msgDeclareAbility();
                    main.field.weather.getSunny(this);
                    battleLog.write(`${this.getArticle()}は ひざしを 強め 古代の鼓動が 暴れ出す!!`);
                }
                else {
                    battleLog.write(`${this.getArticle()}は ひざしを 受けて 古代の鼓動が 暴れ出す!!`);
                }
                break;
            case 'Fairy Aura': // 特性「フェアリーオーラ」
                this.msgDeclareAbility();
                battleLog.write(`${this.getArticle()}は フェアリーオーラを 放っている!`);
                break;
            case 'Dauntless Shield': // 特性「ふくつのたて」
                if (this.isChangeRank('def', 1)) {
                    this.changeRank('def', 1);
                    this.msgDeclareAbility();
                }
                break;
            case 'Intrepid Sword': // 特性「ふとうのけん」
                if (this.isChangeRank('atk', 1)) {
                    this.changeRank('atk', 1);
                    this.msgDeclareAbility();
                }
                break;
            case 'Pressure': // 特性「プレッシャー」
                this.msgDeclareAbility();
                battleLog.write(`${this.getArticle()}は プレッシャーを 放っている!`);
                break;
            case 'Zero to Hero': // 特性「マイティチェンジ」
                if (this.extraParameter.zeroToHero) {
                    this.msgDeclareAbility();
                    battleLog.write(`${this.getArticle()}は 変身して 帰ってきた!`);
                }
                break;
            case 'Misty Surge': // 特性「ミストメイカー」
                if (!main.field.terrain.isMisty()) {
                    this.msgDeclareAbility();
                    main.field.terrain.getMisty(this);
                }
                break;
            case 'Snow Warning': // 特性「ゆきふらし」
                if (main.field.weather.isGetSnowy()) {
                    this.msgDeclareAbility();
                    main.field.weather.getSnowy(this);
                }
                break;
            case 'Forewarn': // 特性「よちむ」
                this.msgDeclareAbility();
                break;
            case 'Vessel of Ruin': // 特性「わざわいのうつわ」
                this.msgDeclareAbility();
                battleLog.write(`${this.getArticle()}の わざわいのうつわで まわりの 特攻が 弱まった!`);
                break;
            case 'Tablets of Ruin': // 特性「わざわいのおふだ」
                this.msgDeclareAbility();
                battleLog.write(`${this.getArticle()}の わざわいのおふだで まわりの 攻撃が 弱まった!`);
                break;
            case 'Beads of Ruin': // 特性「わざわいのたま」
                this.msgDeclareAbility();
                battleLog.write(`${this.getArticle()}の わざわいのたまで まわりの 特防が 弱まった!`);
                break;
            case 'Sword of Ruin': // 特性「わざわいのつるぎ」
                this.msgDeclareAbility();
                battleLog.write(`${this.getArticle()}の わざわいのつるぎで まわりの 防御が 弱まった!`);
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
