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
        this._attack = attack;
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
        return this._attack;
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
    constructor(field, isMe, battle) {
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
    set success(success) {
        this._success = success;
    }
    set damage(damage) {
        this._damage = damage;
    }
    set critical(critical) {
        this._critical = critical;
    }
    set substitute(substitute) {
        this._substitute = substitute;
    }
    get isMe() {
        return this._isMe;
    }
    get battle() {
        return this._battle;
    }
    get party() {
        return this._party;
    }
    get success() {
        return this._success;
    }
    get damage() {
        return this._damage;
    }
    get effective() {
        return this._effective;
    }
    get critical() {
        return this._critical;
    }
    get substitute() {
        return this._substitute;
    }
    failure() {
        this._success === false;
        writeLog(`しかし うまく決まらなかった...`);
    }
    isField() {
        return this._field;
    }
    calcEffective(move, target) {
        const rate = (comp, defType) => {
            const rate = comp.rate.filter(r => r.defType === defType)[0].rate;
            if (rate === 0.0 && target.item.isName('ねらいのまと')) {
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
        this._effective = calcRate(move, target);
    }
    isNotEffective() {
        return this._effective === 0;
    }
}
class AttackList {
    constructor() {
        this._list = [];
    }
    reset() {
        this._list = [];
    }
    setField() {
        const attack = new Attack(true, false, 0);
        this._list.push(attack);
    }
    setPokemon(isMe, battle) {
        if (!main.isExistByBattle(isMe, battle))
            return;
        const attack = new Attack(false, isMe, battle);
        this._list.push(attack);
    }
    getTarget() {
        return this._list;
    }
    getValidTarget() {
        return this._list.filter(l => l.success);
    }
    getTargetToPokemon() {
        return this._list.filter(l => l.success && !l.isField());
    }
    getTargetToField() {
        return this._list.filter(l => l.success && l.isField());
    }
    isFailure() {
        return !this._list.some(t => t.success);
    }
}
class Command {
    constructor() {
        this._move = null;
        this._reserve = null;
        this._myTarget = null;
        this._opponentTarget = null;
    }
    set move(move) {
        this._move = move;
    }
    set reserve(reserve) {
        this._reserve = reserve;
    }
    set myTarget(myTarget) {
        this._myTarget = myTarget;
    }
    set opponentTarget(opponentTarget) {
        this._opponentTarget = opponentTarget;
    }
    get move() {
        return this._move;
    }
    get reserve() {
        return this._reserve;
    }
    get myTarget() {
        return this._myTarget;
    }
    get opponentTarget() {
        return this._opponentTarget;
    }
    isAttack() {
        return this._move !== null;
    }
    isExchange() {
        return this._reserve !== null;
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
        //return this._isTrue && this._name === name;
    }
}
class Attract extends StateChange {
    constructor() {
        super();
        this._order = new Order(true, 0);
    }
    beTrue(order) {
        this._isTrue = true;
        this._order.isMe = order.isMe;
        this._order.party = order.party;
    }
}
class Ability {
    constructor() {
        this._name = null;
        this._org = null;
    }
    set name(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    isName(ability) {
        return this.isValid() && this._name === ability;
    }
    isValid() {
        return true;
    }
    setOrg(ability) {
        this._name = ability;
        this._org = ability;
    }
    translate() {
        return abilityMaster.filter(a => a.nameEN === this._name)[0].nameJA;
    }
    changeMaster() {
        for (const info of changeAbilityTable) {
            if (info.name === this._name) {
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
}
class Item {
    constructor() {
        this._name = null;
        this._recycle = null;
        this._belch = false;
        this._pokeName = '';
    }
    set name(name) {
        this._name = name;
    }
    set belch(belch) {
        this._belch = belch;
    }
    get name() {
        return this._name;
    }
    get belch() {
        return this._belch;
    }
    copyFromOpp(name, pokeName) {
        this._name = name;
        this._pokeName = pokeName;
    }
    isNull() {
        return this._name === null;
    }
    isValid() {
        return true;
    }
    isName(name) {
        return this.isValid() && this._name === name;
    }
    isBerry() {
        // return this._name ===
        return false;
    }
    recyclable() {
        if (this._recycle === null)
            this._recycle = this._name;
        this._name = null;
    }
    getMaster() {
        return itemMaster.filter(i => i.nameEN === this._name)[0];
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
class Type {
    constructor() {
        this._list = [];
    }
    set list(list) {
        this._list = list;
    }
    copyFromOpp(list) {
        this._list = list;
    }
    get() {
        return this._list;
    }
    has(type) {
        return this._list.includes(type);
    }
    isOnly(type) {
        return this.get().length === 1 && this.get()[0] === type;
    }
    toType(type) {
        this._list = [type];
    }
}
class Pokemon {
    constructor(isMe, slot) {
        //--------------
        // 追加効果発動判定
        //--------------
        this.isAdditionalEffect = (target, attack) => {
            if (this._stateChange.sheerForce.isTrue)
                return false;
            if (target.status.hp.value.isZero())
                return false;
            if (attack.substitute)
                return false;
            if (target.ability.isName('Shield Dust'))
                return false; // 特性「りんぷん」
            if (target.item.isName('おんみつマント'))
                return false;
            return true;
        };
        this.sereneGrace = () => {
            if (this._ability.isName('Serene Grace'))
                return 2; // 特性「てんのめぐみ」
            else
                return 1;
        };
        this.rainbow = () => {
            if (this._move.selected.name === 'Secret Power')
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
        this._id = 0;
        this._order = new Order(isMe, slot);
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
    set id(id) {
        this._id = id;
    }
    set command(command) {
        this._command = command;
    }
    set stateChange(stateChange) {
        this._stateChange = stateChange;
    }
    set name(name) {
        this._name = name;
    }
    set type(type) {
        this._type = type;
    }
    set gender(gender) {
        this._gender = gender;
    }
    set level(level) {
        this._level = level;
    }
    set item(item) {
        this._item = item;
    }
    set nature(nature) {
        this._nature = nature;
    }
    set happiness(happiness) {
        this._happiness = happiness;
    }
    set statusAilment(statusAilment) {
        this._statusAilment = statusAilment;
    }
    get id() {
        return this._id;
    }
    get order() {
        return this._order;
    }
    get status() {
        return this._status;
    }
    get name() {
        return this._name;
    }
    get move() {
        return this._move;
    }
    get attack() {
        return this._attack;
    }
    get command() {
        return this._command;
    }
    get stateChange() {
        return this._stateChange;
    }
    get type() {
        return this._type;
    }
    get gender() {
        return this._gender;
    }
    get ability() {
        return this._ability;
    }
    get level() {
        return this._level;
    }
    get item() {
        return this._item;
    }
    get nature() {
        return this._nature;
    }
    get happiness() {
        return this._happiness;
    }
    get statusAilment() {
        return this._statusAilment;
    }
    get actionOrder() {
        return this._actionOrder;
    }
    reset() {
        const partyOrder = this._order.party;
        const isMe = this._order.isMe;
        const imageHTML = getHTMLInputElement('myParty_image' + partyOrder);
        imageHTML.src = '';
        this._order = new Order(isMe, partyOrder);
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
    register(reg) {
        this._id = reg.id;
        this._name = reg.name;
        this._level = reg.level;
        this._type.list = reg.type;
        this._gender = reg.gender.value;
        this._ability.setOrg(reg.ability.value);
        this._item.name = reg.item;
        this._nature = reg.nature;
        this._status.register(reg.stat);
        this._move.register(reg.move);
    }
    copyFromOpp(opp) {
        this._id = opp._id;
        this._name = opp._name;
        this._type.copyFromOpp(opp._type._list);
        this._gender = opp._gender;
        this._ability.setOrg(opp._ability._name);
        this._level = opp._level;
        this._item.copyFromOpp(opp._item._name, opp._item._pokeName);
        this._nature = opp._nature;
        this._status.copyFromOpp(opp._status);
        this._move.copyFromOpp(opp._move._learned);
    }
    showHandInfo() {
        getHTMLInputElement('party' + this._order.hand + '_name').textContent = (this._name === null) ? '名前' : this.translateName(this._name);
        getHTMLInputElement('party' + this._order.hand + '_gender').textContent = (this._name === null) ? '性別' : this.translateGender();
        getHTMLInputElement('party' + this._order.hand + '_level').textContent = (this._name === null) ? '' : String(this._level);
        getHTMLInputElement('party' + this._order.hand + '_ability').textContent = (this._name === null) ? '特性' : this._ability.translate();
        getHTMLInputElement('party' + this._order.hand + '_remainingHP').textContent = (this._name === null) ? '' : String(this._status.hp.value.value);
        getHTMLInputElement('party' + this._order.hand + '_item').textContent = (this._name === null) ? '持ち物' : String(this._item.name);
        if (this._type.get().length === 0) {
            getHTMLInputElement('party' + this._order.hand + '_type1').textContent = 'タイプ';
            getHTMLInputElement('party' + this._order.hand + '_type2').textContent = '';
        }
        else if (this._type.get().length === 1) {
            getHTMLInputElement('party' + this._order.hand + '_type1').textContent = this.translateType(String(this._type.get()[0]));
            getHTMLInputElement('party' + this._order.hand + '_type2').textContent = '';
        }
        else if (this._type.get().length === 2) {
            getHTMLInputElement('party' + this._order.hand + '_type1').textContent = this.translateType(String(this._type.get()[0]));
            getHTMLInputElement('party' + this._order.hand + '_type2').textContent = this.translateType(String(this._type.get()[1]));
        }
        this._status.show(this._name, this._order.hand);
        this._move.show(this._order.hand);
    }
    showPartyImage() {
        const partyOrder = this._order.party;
        const imageHTML = getHTMLInputElement('myParty_image' + partyOrder);
        imageHTML.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + this._id + '.png';
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
        if (this._gender === 'male')
            return '♂';
        if (this._gender === 'female')
            return '♀';
        if (this._gender === 'genderless')
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
        return this._order.isMe;
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
        writeLog(`${this.isMeToStr()}は ${this.translateName(String(this._name))}を くりだした!`);
    }
    getArticle() {
        if (this._name === null)
            return '';
        if (this.isMine())
            return this.translateName(this._name);
        else
            return '相手の' + this.translateName(this._name);
    }
    msgQuickDraw() {
        writeLog(`${this.getArticle()}は クイックドロウで 行動が はやくなった!`);
    }
    msgQuickClaw() {
        writeLog(`${this.getArticle()}は せんせいのつめで 行動が はやくなった!`);
    }
    msgCustapBerry() {
        writeLog(`${this.getArticle()}は イバンのみで 行動が はやくなった!`);
    }
    msgCannotMove() {
        writeLog(`${this.getArticle()}は 攻撃の 反動で 動けない!`);
    }
    msgStillAsleep() {
        writeLog(`${this.getArticle()}は ぐうぐう 眠っている`);
    }
    msgStillFrozen() {
        writeLog(`${this.getArticle()}は 凍ってしまって 動けない!`);
    }
    msgNoPowerPoint() {
        writeLog(`しかし 技の 残りポイントが なかった!`);
    }
    msgTruant() {
        writeLog(`${this.getArticle()}は なまけている`);
    }
    msgFocusPunch() {
        writeLog(`${this.getArticle()}は 集中が 途切れて 技が 出せない!`);
    }
    msgFlinch() {
        writeLog(`${this.getArticle()}は ひるんで 技が 出せない!`);
    }
    msgDisable() {
        writeLog(`${this.getArticle()}は かなしばりで 技が 出せない!`);
    }
    msgGravity() {
        writeLog(`${this.getArticle()}は じゅうりょくが 強くて ${this._move.selected.translate()}が 出せない!`);
    }
    msgHealBlock() {
        writeLog(`${this.getArticle()}は かいふくふうじで 技が 出せない!`);
    }
    msgThroatChop() {
        writeLog(`${this.getArticle()}は じごくづきの効果で 技が 出せない!`);
    }
    msgTaunt() {
        writeLog(`${this.getArticle()}は ちょうはつされて 技が 出せない!`);
    }
    msgImprison() {
        writeLog(`${this.getArticle()}は ふういんで 技が 出せない!`);
    }
    msgStillConfuse() {
        writeLog(`${this.getArticle()}は 混乱している!`);
    }
    msgAttackMyself() {
        writeLog(`わけも わからず 自分を 攻撃した!`);
    }
    msgParalysis() {
        writeLog(`${this.getArticle()}は 体がしびれて 動かない!`);
    }
    msgMeltByMove() {
        writeLog(`${this.getArticle()}の ${this._move.selected.translate()}で こおりがとけた!`);
    }
    msgDeclareMove() {
        writeLog(`${this.getArticle()}の ${this._move.selected.translate()}!`);
    }
    msgDeclareAbility() {
        writeLog(`${this.translateName(String(this._name))}の ${this._ability.translate()}`);
    }
    msgDeclareFailure() {
        writeLog(`しかし うまく決まらなかった....`);
    }
    msgBadRainy() {
        writeLog(`強い雨の 影響で ほのおタイプの 攻撃が 消失した!`);
    }
    msgBadSunny() {
        writeLog(`強い日差しの 影響で みずタイプの 攻撃が 蒸発した!`);
    }
    msgPowder() {
        writeLog(`${this._move.selected.translate()}に 反応して ふんじんが 爆発した!`);
    }
    msgInvalidUser() {
        writeLog(`しかし ${this.getArticle()}には 使うことが できなかった!`);
    }
    msgRefWeight() {
        writeLog(`${this.getArticle()}は 首を 横に振った`);
        writeLog(`この技を しかけることが できないようだ......`);
    }
    msgCannotUse() {
        writeLog(`${this.getArticle()}は ${this._move.selected.translate()}が 使えない!`);
    }
    msgFutureSight() {
        writeLog(`${this.getArticle()}は 未来に 攻撃を予知した!`);
    }
    msgDoomDesire() {
        writeLog(`${this.getArticle()}は はめつのねがいを 未来に託した!`);
    }
    msgProtean() {
        writeLog(`${this.getArticle()}は ${this._type.get()[0]}タイプに なった!`);
    }
    msgPreliminary() {
        if (this._move.selected.name === 'Razor Wind') { // 技「かまいたち」
            writeLog(`${this.getArticle()}の 周りで 空気が 渦を巻く!`);
        }
        if (this._move.selected.name === 'Ice Burn') { // 技「コールドフレア」
            writeLog(`${this.getArticle()}は 凍える空気に 包まれた!`);
        }
        if (this._move.selected.name === 'Sky Attack') { // 技「ゴッドバード」
            writeLog(`${this.getArticle()}を 激しい光が 包む!`);
        }
        if (this._move.selected.name === 'Geomancy') { // 技「ジオコントロール」
            writeLog(`${this.getArticle()}は パワーを ためこんでいる!`);
        }
        if (this._move.selected.name === 'Solar Beam' // 技「ソーラービーム」
            || this._move.selected.name === 'Solar Blade') { // 技「ソーラーブレード」
            writeLog(`${this.getArticle()}は 光を 吸収した!`);
        }
        if (this._move.selected.name === 'Freeze Shock') { // 技「フリーズボルト」
            writeLog(`${this.getArticle()}は 冷たい光に 包まれた!`);
        }
        if (this._move.selected.name === 'Meteor Beam') { // 技「メテオビーム」
            writeLog(`${this.getArticle()}に 宇宙の 力が あふれだす!`);
        }
        if (this._move.selected.name === 'Skull Bash') { // 技「ロケットずつき」
            writeLog(`${this.getArticle()}は 首を 引っ込めた!`);
        }
        if (this._move.selected.name === 'Dig') { // 技「あなをほる」
            writeLog(`${this.getArticle()}は 地面に 潜った!`);
        }
        if (this._move.selected.name === 'Fly') { // 技「そらをとぶ」
            writeLog(`${this.getArticle()}は 空高く 飛び上がった!`);
        }
        if (this._move.selected.name === 'Bounce') { // 技「とびはねる」
            writeLog(`${this.getArticle()}は 高く 飛び跳ねた!`);
        }
        if (this._move.selected.name === 'Dive') { // 技「ダイビング」
            writeLog(`${this.getArticle()}は 水中に 身を潜めた!`);
        }
        if (this._move.selected.name === 'Phantom Force' // 技「ゴーストダイブ」
            || this._move.selected.name === 'Shadow Force') { // 技「シャドーダイブ」
            writeLog(`${this.getArticle()}の姿が 一瞬にして 消えた!`);
        }
    }
    msgPowerHerb() {
        writeLog(`${this.getArticle()}は パワフルハーブで 力が みなぎった!`);
    }
    msgNotHit() {
        writeLog(`${this.getArticle()}には 当たらなかった!`);
    }
    msgPsychicTerrain() {
        writeLog(`${this.getArticle()}は サイコフィールドに 守られている!`);
    }
    msgQuickGuard() {
        writeLog(`${this.getArticle()}は ファストガードで 守られた!`);
    }
    msgWideGuard() {
        writeLog(`${this.getArticle()}は ワイドガードで 守られた!`);
    }
    msgCraftyShield() {
        writeLog(`${this.getArticle()}は トリックガードで 守られた!`);
    }
    msgProtect() {
        writeLog(`${this.getArticle()}は 攻撃から 身を守った!`);
    }
    msgHurt() {
        writeLog(`${this.getArticle()}は 傷ついた!`);
    }
    msgMatBlock() {
        writeLog(`${this._move.selected.translate()}は たたみがえしで 防がれた!`);
    }
    msgInvalid() {
        writeLog(`${this.getArticle()}には 効果がないようだ...`);
    }
    msgSafetyGoggles(move) {
        writeLog(`${this.getArticle()}は ぼうじんゴーグルで ${move}を 受けない!`);
    }
    msgDamage(damage) {
        writeLog(`${damage}の ダメージ!`);
    }
    msgSuperEffective(targetName) {
        if (this._attack.getTarget().length === 1) {
            writeLog(`効果は バツグンだ!`);
        }
        else {
            writeLog(`${targetName}に 効果は バツグンだ!`);
        }
    }
    msgNotEffective(targetName) {
        if (this._attack.getTarget().length === 1) {
            writeLog(`${targetName}に 効果は 今ひとつのようだ......`);
        }
        else {
            writeLog(`${targetName}に 効果は いまひとつだ`);
        }
    }
    msgCritical(targetName) {
        if (this._attack.getTarget().length === 1) {
            writeLog(`急所に 当たった!`);
        }
        else {
            writeLog(`${targetName}に 急所に 当たった!`);
        }
    }
    msgEndure() {
        writeLog(`${this.getArticle()}は 攻撃を こらえた!`);
    }
    msgFocusSash() {
        writeLog(`${this.getArticle()}は きあいのタスキで 持ちこたえた!`);
    }
    msgFocusBand() {
        writeLog(`${this.getArticle()}は きあいのハチマキで 持ちこたえた!`);
    }
    msgCannotEscape() {
        writeLog(`${this.getArticle()}は もう 逃げられない!`);
    }
    msgSaltCure() {
        writeLog(`${this.getArticle()}は しおづけに なった!`);
    }
    msgWhiteHerb() {
        writeLog(`${this.getArticle()}は しろいハーブで ステータスを 元に戻した!`);
    }
    msgLiquidOoze() {
        writeLog(`${this.getArticle()}は ヘドロえきを 吸い取った!`);
    }
    msgDrain(targetName) {
        writeLog(`${targetName}から 体力を 吸い取った!`);
    }
    msgRage() {
        writeLog(`${this.getArticle()}の いかりのボルテージが 上がっていく!`);
    }
    msgClearSmog() {
        writeLog(`全ての ステータスが 元に 戻った!`);
    }
    msgGrudge() {
        writeLog(`${this.getArticle()}の ${this._move.learned[this._move.selected.slot].translate()}は おんねんで PPが0になった!`);
    }
    msgProtectivePads() {
        writeLog(`${this.getArticle()}は ぼうごパットで 防いだ!`);
    }
    msgRoughSkin() {
        writeLog(`${this.getArticle()}は 傷ついた!`);
    }
    msgAttract() {
        writeLog(`${this.getArticle()}は メロメロに なった!`);
    }
    msgMummy() {
        writeLog(`${this.getArticle()}は とくせいが ミイラになっちゃった!`);
    }
    msgLingeringAroma() {
        writeLog(`${this.getArticle()}は においが うつって とれなくなっちゃった!`);
    }
    msgExchangeAbility() {
        writeLog(`${this.getArticle()}は おたがいの とくせいを 入れ替えた!`);
    }
    msgPerishBodySide() {
        writeLog(`${this.getArticle()}は 3ターン後に 滅びてしまう!`);
    }
    msgPerishBodyAll() {
        writeLog(`おたがいは 3ターン後に 滅びてしまう!`);
    }
    msgElectromorphosis(moveName) {
        writeLog(`${this.getArticle()}は ${moveName}を 受けて 充電した!`);
    }
    msgAngerPoint() {
        writeLog(`${this.getArticle()}は 攻撃が 最大まで 上がった!`);
    }
    msgHalfBerry() {
        writeLog(`${this.getArticle()}への ダメージを ${this._stateChange.halfBerry.text}が 弱めた!`);
    }
    msgRockyHelmet() {
        writeLog(`${this.getArticle()}は ゴツゴツメットで ダメージを受けた!`);
    }
    msgAirBalloon() {
        writeLog(`${this.getArticle()}の ふうせんが 割れた!`);
    }
    msgIncinerate() {
        writeLog(`${this.getArticle()}の ${this._item.name}は 焼けてなくなった!`);
    }
    msgJabocaBerry(targetName) {
        writeLog(`${this.getArticle()}は ${targetName}の ジャポのみで ダメージを 受けた!`);
    }
    msgRowapBerry(targetName) {
        writeLog(`${this.getArticle()}は ${targetName}の レンブのみで ダメージを 受けた!`);
    }
    msgFainted() {
        writeLog(`${this.getArticle()}は たおれた!`);
    }
    msgDestinyBond() {
        writeLog(`${this.getArticle()}は 相手を 道連れに した!`);
    }
    msgRecoil() {
        writeLog(`${this.getArticle()}は 反動による ダメージを 受けた!`);
    }
    msgBind(targetName) {
        if (this._move.selected.name === 'Whirlpool') { // 技「うずしお」
            writeLog(`${this.getArticle()}は 渦の中に 閉じこめられた!`);
        }
        if (this._move.selected.name === 'Clamp') { // 技「からではさむ」
            writeLog(`${this.getArticle()}は ${targetName}の からに はさまれた!`);
        }
        if (this._move.selected.name === 'Thunder Cage') { // 技「サンダープリズン」
            writeLog(`${this.getArticle()}は ${targetName}に 閉じこめられた!`);
        }
        if (this._move.selected.name === 'Bind') { // 技「しめつける」
            writeLog(`${this.getArticle()}は ${targetName}に しめつけられた!`);
        }
        if (this._move.selected.name === 'Sand Tomb') { // 技「すなじごく」
            writeLog(`${this.getArticle()}は 砂じごくに 捕らわれた!`);
        }
        if (this._move.selected.name === 'Snap Trap') { // 技「トラバサミ」
            writeLog(`${this.getArticle()}は トラバサミに 捕らわれた!`);
        }
        if (this._move.selected.name === 'Fire Spin') { // 技「ほのおのうず」
            writeLog(`${this.getArticle()}は 炎の渦に 閉じこめられた!`);
        }
        if (this._move.selected.name === 'Wrap') { // 技「まきつく」
            writeLog(`${this.getArticle()}は ${targetName}に 巻きつかれた!`);
        }
        if (this._move.selected.name === 'Magma Storm') { // 技「マグマストーム」
            writeLog(`${this.getArticle()}は マグマの渦に 閉じこめられた!`);
        }
        if (this._move.selected.name === 'Infestation') { // 技「まとわりつく」
            writeLog(`${this.getArticle()}は ${targetName}に まとわりつかれた!`);
        }
    }
    msgKnockOff(targetName, targetItem) {
        writeLog(`${this.getArticle()}は ${targetName}の ${targetItem}を はたき落とした!`);
    }
    msgNotThief(targetName) {
        writeLog(`${targetName}の 道具を 奪えない!`);
    }
    msgThief(targetName, targetItem) {
        writeLog(`${this.getArticle()}は ${targetName}から ${targetItem}を 奪い取った!`);
    }
    msgBugBote(berryName) {
        writeLog(`${this.getArticle()}は ${berryName}を 奪って 食べた!`);
    }
    msgSmackDown() {
        writeLog(`${this.getArticle()}は 撃ち落とされて 地面に 落ちた!`);
    }
    msgThousandWaves() {
        writeLog(`${this.getArticle()}は もう 逃げられない!`);
    }
    msgJawLock() {
        writeLog(`おたがいの ポケモンは 逃げることが できなくなった!`);
    }
    msgColorChange(type) {
        writeLog(`${this.getArticle()}は ${type}タイプに なった!`);
    }
    msgBattleBond() {
        writeLog(`${this.getArticle()}に きずなの 力が みなぎった!`);
    }
    msgLifeOrb() {
        writeLog(`${this.getArticle()}は 命が 少し削られた!`);
    }
    msgShellBell() {
        writeLog(`${this.getArticle()}は かいがらのすずで 少し 回復`);
    }
    msgPickpocket() {
        writeLog(`${this.getArticle()}の ${this._item.name}を 奪った!`);
    }
    msgAddHPByAbility() {
        writeLog(`${this.getArticle()}の 体力が 回復した!`);
    }
    msgAddHPByItem(item) {
        writeLog(`${this.getArticle()}は ${item}で 体力を 回復した!`);
    }
    msgSandstorm() {
        writeLog(`砂あらしが ${this.getArticle()}を 襲う!`);
    }
    msgCureConfuse() {
        writeLog(`${this.getArticle()}の 混乱が 解けた!`);
    }
    msgToHand() {
        writeLog(`${this.getArticle()}を 引っ込めた!`); // メッセージ確認不足
    }
    //------------------
    // 特性による優先度変更
    //------------------
    changeMovePriority() {
        if (this._ability.isName('Prankster') && this._move.selected.isStatus()) { // 特性「いたずらごころ」
            this._move.selected.priority += 1;
        }
        if (this._ability.isName('Gale Wings') && this._status.hp.value.isMax()) { // 特性「はやてのつばさ」
            this._move.selected.priority += 1;
        }
        if (this._ability.isName('Triage') && this._move.selected.getMaster().heal) { // 特性「ヒーリングシフト」
            this._move.selected.priority += 3;
        }
    }
    //-------------------------
    // 残りHPによるきのみの発動判定
    //-------------------------
    isActivateBerryByHP(denominator) {
        const gluttony = (this._ability.isName('Gluttony')) ? 2 : 1; // 特性「くいしんぼう」
        if (denominator === 2) {
            return this._status.hp.value.isLessEqual(denominator);
        }
        else {
            return this._status.hp.value.isLessEqual(denominator / gluttony);
        }
    }
    //-----------
    // 持ち物の消費
    //-----------
    consumeItem() {
        if (this._item.isNull())
            return;
        if (this._item.isBerry()) {
            this._item.belch = true;
            this.activateCheekPouch();
        }
        this._item.recyclable();
    }
    //-------------
    // ほおぶくろ発動
    //-------------
    activateCheekPouch() {
        if (!this._ability.isName('Cheek Pouch'))
            return; // 特性「ほおぶくろ」
        if (this._status.hp.value.isZero())
            return;
        if (this._status.hp.value.isMax())
            return;
        if (this._stateChange.healBlock.isTrue)
            return;
        const value = Math.floor(this.getOrgHP() / 3);
        this._status.hp.value.add(value);
        this.msgDeclareAbility();
        this.msgAddHPByAbility();
    }
    //-----------
    // 実質HP
    //-----------
    getOrgHP() {
        const dynamax = (this._stateChange.dynamax.isTrue) ? 0.5 : 1;
        return this._status.hp.av * dynamax;
    }
    //--------------
    // ランク変化可能量
    //--------------
    getRankVariableOrg(value) {
        value = (this._ability.isName('Simple')) ? value * 2 : value; // 特性「たんじゅん」
        value = (this._ability.isName('Contrary')) ? value * -1 : value; // 特性「あまのじゃく」
        return value;
    }
    getRankVariable(para, value) {
        switch (para) {
            case 'atk':
                return this._status.atk.rank.getVariable(value);
            case 'def':
                return this._status.def.rank.getVariable(value);
            case 'spA':
                return this._status.spA.rank.getVariable(value);
            case 'spD':
                return this._status.spD.rank.getVariable(value);
            case 'spe':
                return this._status.spe.rank.getVariable(value);
            case 'acc':
                return this._status.acc.getVariable(value);
            case 'eva':
                return this._status.eva.getVariable(value);
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
            if (this._ability.isName('White Smoke'))
                return false; // 特性「しろいけむり」
            if (this._ability.isName('Clear Body'))
                return false; // 特性「クリアボディ」
            if (this._ability.isName('Full Metal Body'))
                return false; // 特性「メタルプロテクト」
            if (main.isExistAbilityInSide(this.isMine(), 'Flower Veil') && this._type.has('Grass'))
                return false; // 特性「フラワーベール」
            if (this._ability.isName('Mirror Armor')) { // 特性「ミラーアーマー」
                //changeTargetRank( target, pokemon, parameter, change );
                // return;
            }
            if (this._ability.isName('Hyper Cutter') && para === 'atk')
                return false; // 特性「かいりきバサミ」
            if (this._ability.isName('Big Pecks') && para === 'def')
                return false; // 特性「はとむね」
            if (this._ability.isName('Keen Eye') && para === 'acc')
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
        this._status.changeRank(para, real, setting, this.getArticle(), item);
    }
    changeRankByOther(para, value, other) {
        this.changeRank(para, value);
        const setting = this.getRankVariableOrg(value);
        const real = this.getRankVariable(para, setting);
        if (real >= 0)
            return;
        if (this._ability.isName('Defiant') && this.isMine() !== other.isMine()) { // 特性「まけんき」
            this.msgDeclareAbility();
            this.changeRank('atk', 2);
        }
        if (this.ability.isName('Competitive') && this.isMine() !== other.isMine()) { // 特性「かちき」
            this.msgDeclareAbility();
            this.changeRank('spA', 2);
        }
    }
    changeRankByRage() {
        const setting = this.getRankVariableOrg(1);
        const real = this.getRankVariable('atk', setting);
        this.status.atk.rank.add(real);
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
        if (!this._statusAilment.isHealth())
            return false;
        const abilityCheck = () => {
            if (this._ability.isName('Shield Dust'))
                return false; // 特性「りんぷん」
            if (this._ability.isName('Purifying Salt'))
                return false; // 特性「きよめのしお」
            if (this._ability.isName('Comatose'))
                return false; // 特性「ぜったいねむり」
            if (this._ability.isName('Leaf Guard') && main.field.weather.isSunny(this))
                return false; // 特性「リーフガード」
            //if ( this._ability.isName( 'リミットシールド' ) && this._name === 'メテノ(流星)' ) return false;
            if (main.isExistAbilityInSide(this.isMine(), 'Flower Veil') && this._type.has('Grass'))
                return false; // 特性「フラワーベール」
            return true;
        };
        const eachCheck = (ailment) => {
            switch (ailment) {
                case 'Paralysis':
                    if (this._type.has('Electric'))
                        return false;
                    break;
                case 'Frozen':
                    if (this._type.has('Ice'))
                        return false;
                    if (main.field.weather.isSunny(this))
                        return false;
                    if (this._ability.isName('Magma Armor'))
                        return false; // 特性「マグマのよろい」
                    break;
                case 'Burned':
                    if (this._type.has('Fire'))
                        return false;
                    if (this._ability.isName('Water Veil'))
                        return false; // 特性「みずのベール」
                    if (this._ability.isName('Water Bubble'))
                        return false; // 特性「すいほう」
                    break;
                case 'Poisoned':
                    if (this._ability.isName('Immunity'))
                        return false; // 特性「めんえき」
                    if (main.isExistAbilityInSide(this.isMine(), 'Pastel Veil'))
                        return false; // 特性「パステルベール」
                    if (this._type.has('Poison'))
                        return false;
                    if (this._type.has('Steel'))
                        return false;
                    break;
                case 'Asleep':
                    if (this._ability.isName('Vital Spirit'))
                        return false; // 特性「やるき」
                    if (this._ability.isName('Insomnia'))
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
                this._statusAilment.getParalysis();
                break;
            case 'burn':
                if (!this.isGetAilmentByOther('Burned', other))
                    return;
                this._statusAilment.getBurned();
                break;
            case 'freeze':
                if (!this.isGetAilmentByOther('Frozen', other))
                    return;
                this._statusAilment.getFrozen();
                break;
            case 'sleep':
                if (!this.isGetAilmentByOther('Asleep', other))
                    return;
                this._statusAilment.getAsleep();
                break;
            case 'poison':
                if (!this.isGetAilmentByOther('Poisoned', other))
                    return;
                if (other.move.selected.name === 'Poison Fang') { // どくどくのキバ
                    this._statusAilment.getBadPoisoned();
                }
                else {
                    this._statusAilment.getPoisoned();
                }
                break;
            default:
                break;
        }
    }
    getAilmentByStatusMove(ailmentName) {
        switch (ailmentName) {
            case 'paralysis':
                this._statusAilment.getParalysis();
                break;
            case 'burn':
                this._statusAilment.getBurned();
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
                this.stateChange.tarShot.onActivate(this);
                break;
            default:
                break;
        }
    }
    //--------
    // こんらん
    //--------
    isGetConfusionByAdditionalEffect(other) {
        if (this._stateChange.confuse.isTrue)
            return false;
        if (this._ability.isName('Own Tempo'))
            return false; // 特性「マイペース」
        return this.safeGuardCheck(other) && this.mistTerrainCheck();
    }
    getConfusion() {
        this._stateChange.getConfusion(this.getArticle());
    }
    //--------
    // メロメロ
    //--------
    isGetAttract(other) {
        if (this._gender === 'genderless')
            return false;
        if (other.gender === 'genderless')
            return false;
        if (this._gender === other.gender)
            return false;
        if (this.isMine() === other.isMine())
            return false;
        if (this._stateChange.attract.isTrue)
            return false;
        if (this._ability.isName('Oblivious'))
            return false; // 特性「どんかん」
        if (!main.isExistAbilityInSide(this.isMine(), 'Aroma Veil'))
            return false; // 特性「アロマベール」
        return true;
    }
    getAttract(other) {
        this._stateChange.attract.beTrue(other.order);
        this.msgAttract();
        if (!this._item.isName('あかいいと'))
            return;
        if (!other.isGetAttract(this))
            return;
        other.getAttract(this);
    }
    //--------------
    // フォルムチェンジ
    //--------------
    getNextForm() {
        if (this._name === 'Aegislash Shield')
            return 'Aegislash Blade';
        if (this._name === 'Aegislash Blade')
            return 'Aegislash Shield';
        if (this._name === 'Meloetta Aria')
            return 'Meloetta Pirouette';
        if (this._name === 'Meloetta Pirouette')
            return 'Meloetta Aria';
        if (this._name === 'Mimikyu Disguised')
            return 'Mimikyu Busted';
        if (this._name === 'Cramorant Gulping')
            return 'Cramorant';
        if (this._name === 'Cramorant Gorging')
            return 'Cramorant';
        if (this._name === 'Eiscue Ice')
            return 'Eiscue Noice';
        if (this._name === 'Eiscue Noice')
            return 'Eiscue Ice';
        return this._name;
    }
    formChange() {
        const nextForm = this.getNextForm();
        if (nextForm === this._name)
            return;
        this._name = nextForm;
        const pokemon = this.getMaster();
        this._type.list = pokemon.type;
        this._ability.setOrg(abilityTextList.filter(name => name === pokemon.ability[0])[0]);
        this._status.formChange(pokemon.baseStatus, this._level, this.getNatureMaster());
    }
    msgAegislashSchild() {
        writeLog(`ブレードフォルム チェンジ!`);
    }
    msgAegislashBlade() {
        writeLog(`シールドフォルム チェンジ!`);
    }
    msgRelicSong() {
        writeLog(`${this.getArticle()}の 姿が 変化した!`);
    }
    msgDisguise() {
        writeLog(`${this.getArticle()}の ばけのかわが はがれた!`);
    }
    msgIceFace() {
        writeLog(`${this.getArticle()}の 姿が 変化した!`);
    }
    //-------------
    // きのみを食べる
    //-------------
    getRipen() {
        return (this._ability.isName('Ripen')) ? 2 : 1; // 特性「じゅくせい」
    }
    getChangeValueByBerry(denominator) {
        const value = Math.floor(this.getOrgHP() / denominator) * this.getRipen();
        return value;
    }
    eatBerryJuice() {
        this._status.hp.value.add(10);
        this.msgAddHPByItem('きのみジュース');
    }
    eatCheriBerry() {
        this._statusAilment.getHealth('クラボのみ');
    }
    eatChestoBerry() {
        this._statusAilment.getHealth('カゴのみ');
    }
    eatPechaBerry() {
        if (!this._statusAilment.isPoisoned() && !this._statusAilment.isBadPoisoned())
            return;
        this._statusAilment.getHealth('モモンのみ');
    }
    eatRawstBerry() {
        this._statusAilment.getHealth('チーゴのみ');
    }
    eatAspearBerry() {
        this._statusAilment.getHealth('ナナシのみ');
    }
    eatLeppaBerry() {
        // ヒメリのみ
    }
    eatOranBerry() {
        this._status.hp.value.add(10 * this.getRipen());
        this.msgAddHPByItem('オレンのみ');
    }
    eatPersimBerry() {
        // キーのみ
    }
    eatLumBerry() {
        this._statusAilment.getHealth('ラムのみ');
        // 混乱を治す
    }
    eatSitrusBerry() {
        const value = this.getChangeValueByBerry(4);
        this._status.hp.value.add(value);
        this.msgAddHPByItem('オボンのみ');
    }
    eatFigyBerry() {
        const value = this.getChangeValueByBerry(3);
        this._status.hp.value.add(value);
        this.msgAddHPByItem('フィラのみ');
    }
    eatWikiBerry() {
        const value = this.getChangeValueByBerry(3);
        this._status.hp.value.add(value);
        this.msgAddHPByItem('ウイのみ');
    }
    eatMagoBerry() {
        const value = this.getChangeValueByBerry(3);
        this._status.hp.value.add(value);
        this.msgAddHPByItem('マゴのみ');
    }
    eatAguavBerry() {
        const value = this.getChangeValueByBerry(3);
        this._status.hp.value.add(value);
        this.msgAddHPByItem('バンジのみ');
    }
    eatIapapaBerry() {
        const value = this.getChangeValueByBerry(3);
        this._status.hp.value.add(value);
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
        this._status.hp.value.add(value);
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
    //-----------
    // 手持ちに戻る
    //-----------
    isFainted() {
        if (!this._status.hp.value.isZero())
            return false;
        this.msgFainted();
        return true;
    }
    toHand() {
        const naturalCure = () => {
            if (!this._ability.isName('Natural Cure'))
                return; // 特性「しぜんかいふく」
            this._statusAilment.getHealth();
        };
        const regenerator = () => {
            if (!this._ability.isName('Regenerator'))
                return; // 特性「さいせいりょく」
            const value = Math.floor(this.getOrgHP() / 3);
            this._status.hp.value.add(value);
        };
        if (!this._status.hp.value.isZero()) {
            naturalCure(); // しぜんかいふく
            regenerator(); // さいせいりょく
            this.msgToHand();
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
        const hand = this._order.hand;
        this._order.hand = main.field.numberOfPokemon;
        main.getPlayer(this.isMine()).cycleHand(hand);
    }
    //-------------
    // バトル場に出る
    //-------------
    toBattleField(battle) {
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
        return pokemonMaster.filter(p => p.nameEN === this._name)[0];
    }
    getNatureMaster() {
        return natureMaster.filter(n => n.nameEN === this._nature)[0];
    }
    getWeight() {
        const master = this.getMaster();
        let weight = master.weight;
        // ボディパージ
        if (this._ability.isName('Light Metal')) { // 特性「ライトメタル」
            weight = weight / 2;
        }
        if (this._ability.isName('Heavy Metal')) { // 特性「ヘヴィメタル」
            weight = weight * 2;
        }
        if (this._item.isName('かるいし')) {
            weight = weight - 100;
        }
        return Math.max(0.1, weight);
    }
    isContact() {
        return this._move.selected.getMaster().contact && !this._ability.isName('Long Reach'); // 特性「えんかく」
    }
    isGround() {
        if (this._stateChange.ingrain.isTrue === true)
            return true;
        if (this._stateChange.smackDown.isTrue === true)
            return true;
        if (main.field.whole.gravity.isTrue === true)
            return true;
        if (this._item.isName('くろいてっきゅう'))
            return true;
        if (this._type.has('Flying'))
            return false;
        if (this._ability.isName('Levitate'))
            return false; // 特性「ふゆう」
        if (this._item.isName('ふうせん'))
            return false;
        if (this._stateChange.magnetRise.isTrue)
            return false;
        if (this._stateChange.telekinesis.isTrue)
            return false;
        return true;
    }
}
