"use strict";
class Order {
    constructor() {
        this._party = 0;
        this._hand = null;
        this._battle = null;
    }
    set party(party) {
        this._party = party;
    }
    set hand(hand) {
        this._hand = hand;
    }
    set battle(battle) {
        this._battle = battle;
    }
    get party() {
        return this._party;
    }
    get hand() {
        return this._hand;
    }
    get battle() {
        return this._battle;
    }
}
class Status {
    constructor() {
        this._number = '';
        this._name = '';
        this._type1 = '';
        this._type2 = '';
        this._gender = '';
        this._ability = '';
        this._level = 50;
        this._item = '';
        this._nature = '';
        this._height = 1.0;
        this._weight = 1.0;
        this._happiness = 255;
        this._remainingHP = 0;
        this._statusAilment = null;
    }
    set number(number) {
        this._number = number;
    }
    set name(name) {
        this._name = name;
    }
    set type1(type) {
        this._type1 = type;
    }
    set type2(type) {
        this._type2 = type;
    }
    set gender(gender) {
        this._gender = gender;
    }
    set ability(ability) {
        this._ability = ability;
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
    set height(height) {
        this._height = height;
    }
    set weight(weight) {
        this._weight = weight;
    }
    set happiness(happiness) {
        this._happiness = happiness;
    }
    set remainingHP(remainingHP) {
        this._remainingHP = remainingHP;
    }
    set statusAilment(statusAilment) {
        this._statusAilment = statusAilment;
    }
    get number() {
        return this._number;
    }
    get name() {
        return this._name;
    }
    get type1() {
        return this._type1;
    }
    get type2() {
        return this._type2;
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
    get height() {
        return this._height;
    }
    get weight() {
        return this._weight;
    }
    get happiness() {
        return this._happiness;
    }
    get remainingHP() {
        return this._remainingHP;
    }
    get statusAilment() {
        return this._statusAilment;
    }
    declareAbility() {
        writeLog(`${this._name} の ${this._ability}`);
    }
    declareInvalid(info) {
        info.success = false;
        writeLog(`${this._name}には 効果がないようだ...`);
    }
    declareNotHit(info) {
        info.success = false;
        writeLog(`${this._name}には 当たらなかった!`);
    }
    declareCannotMove() {
        writeLog(`${this._name}は 攻撃の 反動で 動けない!`);
    }
    abilityInfo() {
        for (const info of changeAbilityTable) {
            if (info.name === this._ability) {
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
class ParameterRank {
    constructor() {
        this._attack = 0;
        this._defense = 0;
        this._specialAttack = 0;
        this._specialDefense = 0;
        this._speed = 0;
        this._evasion = 0;
        this._accuracy = 0;
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
    set evasion(evasion) {
        this._evasion = evasion;
    }
    set accuracy(accuracy) {
        this._accuracy = accuracy;
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
    get evasion() {
        return this._evasion;
    }
    get accuracy() {
        return this._accuracy;
    }
}
class AvailableMove {
    constructor() {
        this._name = '';
        this._type = '';
        this._category = '';
        this._power = 0;
        this._accuracy = 0;
        this._remainingPP = 0;
        this._powerPoint = 0;
        this._isDirect = true;
        this._isProtect = true;
        this._target = '';
        this._number = 0;
        this._priority = 0;
    }
    set name(name) {
        this._name = name;
    }
    set type(type) {
        this._type = type;
    }
    set category(category) {
        this._category = category;
    }
    set power(power) {
        this._power = power;
    }
    set accuracy(accuracy) {
        this._accuracy = accuracy;
    }
    set remainingPP(remainingPP) {
        this._remainingPP = remainingPP;
    }
    set powerPoint(powerPoint) {
        this._powerPoint = powerPoint;
    }
    set isDirect(isDirect) {
        this._isDirect = isDirect;
    }
    set isProtect(isProtect) {
        this._isProtect = isProtect;
    }
    set target(target) {
        this._target = target;
    }
    set number(number) {
        this._number = number;
    }
    set priority(priority) {
        this._priority = priority;
    }
    get name() {
        return this._name;
    }
    get type() {
        return this._type;
    }
    get category() {
        return this._category;
    }
    get power() {
        return this._power;
    }
    get accuracy() {
        return this._accuracy;
    }
    get remainingPP() {
        return this._remainingPP;
    }
    get powerPoint() {
        return this._powerPoint;
    }
    get isDirect() {
        return this._isDirect;
    }
    get isProtect() {
        return this._isProtect;
    }
    get target() {
        return this._target;
    }
    get number() {
        return this._number;
    }
    get priority() {
        return this._priority;
    }
    failure() {
        writeLog(`しかし うまく決まらなかった...`);
        return false;
    }
}
class Damage {
    constructor() {
        this._damage = 0;
        this._effective = 0;
        this._critical = false;
    }
    set damage(damage) {
        this._damage = damage;
    }
    set effective(effective) {
        this._effective = effective;
    }
    set critical(critical) {
        this._critical = critical;
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
}
class Target {
    constructor() {
        this._trainer = '';
        this._battleNumber = null;
        this._success = true;
    }
    set trainer(trainer) {
        this._trainer = trainer;
    }
    set battleNumber(battleNumber) {
        this._battleNumber = battleNumber;
    }
    set success(success) {
        this._success = success;
    }
    get trainer() {
        return this._trainer;
    }
    get battleNumber() {
        return this._battleNumber;
    }
    get success() {
        return this._success;
    }
    failure() {
        this._success === false;
        writeLog(`しかし うまく決まらなかった...`);
    }
}
class Command {
    constructor() {
        this._move = false;
        this._reserve = false;
        this._myTarget = false;
        this._opponentTarget = false;
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
}
class StateChange {
    constructor(name) {
        this._name = name;
        this._isTrue = true;
        this._turn = 0;
        this._count = 0;
    }
    set name(name) {
        this._name = name;
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
    get name() {
        return this._name;
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
}
class StateChangeSummary {
    constructor() {
        this._curse = new StateChange('のろい');
        this._attract = new StateChange('メロメロ');
        this._leechSeed = new StateChange('やどりぎのタネ');
        this._yawn = new StateChange('ねむけ');
        this._perishSong = new StateChange('ほろびのうた');
        this._noAbility = new StateChange('とくせいなし');
        this._embargo = new StateChange('さしおさえ');
        this._encore = new StateChange('アンコール');
        this._torment = new StateChange('いちゃもん');
        this._taunt = new StateChange('ちょうはつ');
        this._disable = new StateChange('かなしばり');
        this._foresight = new StateChange('みやぶられている');
        this._miracleEye = new StateChange('ミラクルアイ');
        this._smackDown = new StateChange('うちおとす');
        this._telekinesis = new StateChange('テレキネシス');
        this._powder = new StateChange('ふんじん');
        this._tarShot = new StateChange('タールショット');
        this._focusEnergy = new StateChange('きゅうしょアップ');
        this._substitute = new StateChange('みがわり');
        this._lockOn = new StateChange('ロックオン');
        this._minimize = new StateChange('ちいさくなる');
        this._ingrain = new StateChange('ねをはる');
        this._aquaRing = new StateChange('アクアリング');
        this._stockpile = new StateChange('たくわえる');
        this._magnetRise = new StateChange('でんじふゆう');
        this._transform = new StateChange('へんしん');
        this._confuse = new StateChange('こんらん');
        this._cannotMove = new StateChange('反動で動けない');
        this._dynamax = new StateChange('ダイマックス');
    }
    set curse(curse) {
        this._curse = curse;
    }
    set attract(attract) {
        this._attract = attract;
    }
    set leechSeed(leechSeed) {
        this._leechSeed = leechSeed;
    }
    set yawn(yawn) {
        this._yawn = yawn;
    }
    set perishSong(perishSong) {
        this._perishSong = perishSong;
    }
    set noAbility(noAbility) {
        this._noAbility = noAbility;
    }
    set embargo(embargo) {
        this._embargo = embargo;
    }
    set encore(encore) {
        this._encore = encore;
    }
    set torment(torment) {
        this._torment = torment;
    }
    set taunt(taunt) {
        this._taunt = taunt;
    }
    set disable(disable) {
        this._disable = disable;
    }
    set foresight(foresight) {
        this._foresight = foresight;
    }
    set miracleEye(miracleEye) {
        this._miracleEye = miracleEye;
    }
    set smackDown(smackDown) {
        this._smackDown = smackDown;
    }
    set telekinesis(telekinesis) {
        this._telekinesis = telekinesis;
    }
    set powder(powder) {
        this._powder = powder;
    }
    set tarShot(tarShot) {
        this._tarShot = tarShot;
    }
    set focusEnergy(focusEnergy) {
        this._focusEnergy = focusEnergy;
    }
    set substitute(substitute) {
        this._substitute = substitute;
    }
    set lockOn(lockOn) {
        this._lockOn = lockOn;
    }
    set minimize(minimize) {
        this._minimize = minimize;
    }
    set ingrain(ingrain) {
        this._ingrain = ingrain;
    }
    set aquaRing(aquaRing) {
        this._aquaRing = aquaRing;
    }
    set stockpile(stockpile) {
        this._stockpile = stockpile;
    }
    set magnetRise(magnetRise) {
        this._magnetRise = magnetRise;
    }
    set transform(transform) {
        this._transform = transform;
    }
    set confuse(confuse) {
        this._confuse = confuse;
    }
    set cannotMove(cannotMove) {
        this._cannotMove = cannotMove;
    }
    set dynamax(dynamax) {
        this._dynamax = dynamax;
    }
    get curse() {
        return this._curse;
    }
    get attract() {
        return this._attract;
    }
    get leechSeed() {
        return this._leechSeed;
    }
    get yawn() {
        return this._yawn;
    }
    get perishSong() {
        return this._perishSong;
    }
    get noAbility() {
        return this._noAbility;
    }
    get embargo() {
        return this._embargo;
    }
    get encore() {
        return this._encore;
    }
    get torment() {
        return this._torment;
    }
    get taunt() {
        return this._taunt;
    }
    get disable() {
        return this._disable;
    }
    get foresight() {
        return this._foresight;
    }
    get miracleEye() {
        return this._miracleEye;
    }
    get smackDown() {
        return this._smackDown;
    }
    get telekinesis() {
        return this._telekinesis;
    }
    get powder() {
        return this._powder;
    }
    get tarShot() {
        return this._tarShot;
    }
    get focusEnergy() {
        return this._focusEnergy;
    }
    get substitute() {
        return this._substitute;
    }
    get lockOn() {
        return this._lockOn;
    }
    get minimize() {
        return this._minimize;
    }
    get ingrain() {
        return this._ingrain;
    }
    get aquaRing() {
        return this._aquaRing;
    }
    get stockpile() {
        return this._stockpile;
    }
    get magnetRise() {
        return this._magnetRise;
    }
    get transform() {
        return this._transform;
    }
    get confuse() {
        return this._confuse;
    }
    get cannotMove() {
        return this._cannotMove;
    }
    get dynamax() {
        return this._dynamax;
    }
}
class Pokemon {
    constructor() {
        this._trainer = 'me';
        this._order = new Order;
        this._status = new Status;
        this._statusOrg = new Status;
        this._actualValue = new ParameterSix;
        this._baseStatus = new ParameterSix;
        this._individualValue = new ParameterSix;
        this._effortValue = new ParameterSix;
        this._rank = new ParameterRank;
        this._move = [
            new AvailableMove,
            new AvailableMove,
            new AvailableMove,
            new AvailableMove
        ];
        this._moveUsed = new AvailableMove;
        this._damage = new Damage;
        this._target = [];
        this._command = new Command;
        this._statusChange = new StateChangeSummary;
    }
    set trainer(trainer) {
        this._trainer = trainer;
    }
    set status(status) {
        this._status = status;
    }
    set rank(rank) {
        this._rank = rank;
    }
    set moveUsed(moveUsed) {
        this._moveUsed = moveUsed;
    }
    set damage(damage) {
        this._damage = damage;
    }
    set target(target) {
        this._target = target;
    }
    set command(command) {
        this._command = command;
    }
    set statusChange(statusChange) {
        this._statusChange = statusChange;
    }
    get trainer() {
        return this._trainer;
    }
    get order() {
        return this._order;
    }
    get status() {
        return this._status;
    }
    get statusOrg() {
        return this._statusOrg;
    }
    get actualValue() {
        return this._actualValue;
    }
    get baseStatus() {
        return this._baseStatus;
    }
    get individualValue() {
        return this._individualValue;
    }
    get effortValue() {
        return this._effortValue;
    }
    get rank() {
        return this._rank;
    }
    get move() {
        return this._move;
    }
    get moveUsed() {
        return this._moveUsed;
    }
    get damage() {
        return this._damage;
    }
    get target() {
        return this._target;
    }
    get command() {
        return this._command;
    }
    get statusChange() {
        return this._statusChange;
    }
    declareMove() {
        writeLog(`${this._status.name}の ${this._moveUsed.name}!`);
    }
}
