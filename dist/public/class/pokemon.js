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
        this._type1 = null;
        this._type2 = null;
        this._gender = '';
        this._ability = '';
        this._level = 50;
        this._item = null;
        this._nature = '';
        this._height = 1.0;
        this._weight = 1.0;
        this._happiness = 255;
        this._remainingHP = 0;
        this._statusAilment = new StateChange(null);
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
    declareSleeping() {
        writeLog(`${this._name}は ぐうぐう 眠っている`);
    }
    declareFleezed() {
        writeLog(`${this._name}は 凍って 動けない!`);
    }
    declareTruant() {
        writeLog(`${this._name}は なまけている`);
    }
    declareFlinch() {
        writeLog(`${this._name}は ひるんで 技が 出せない!`);
    }
    declareDisable() {
        writeLog(`${this._name}は かなしばりで 技が 出せない!`);
    }
    declareGravity(move) {
        writeLog(`${this._name}は じゅうりょくが 強くて ${move}が 出せない!`);
    }
    declareHealBlock() {
        writeLog(`${this._name}は かいふくふうじで 技が 出せない!`);
    }
    declareThroatChop() {
        writeLog(`${this._name}は じごくづきの 効果で 技が 出せない!`);
    }
    declareTaunt() {
        writeLog(`${this._name}は ちょうはつされて 技が 出せない!`);
    }
    declareImprison(move) {
        writeLog(`${this._name}は ふういんで ${move}が だせない!`);
    }
    declareConfuse(confuse, random) {
        if (confuse.count === 0) {
            writeLog(`混乱が 解けた!`);
        }
        else {
            writeLog(`${this._name}は 混乱している!`);
            if (random < 1 / 3 * 100) {
                writeLog(`わけも わからず 自分を 攻撃した!`);
            }
        }
    }
    declareParalysis() {
        writeLog(`${this._name}は 体がしびれて 動けない!`);
    }
    declareAttract(name, random) {
        writeLog(`${this._name}は ${name}に メロメロだ!`);
        if (random < 50) {
            writeLog(`${this._name}は メロメロで 技が だせなかった!`);
        }
    }
    cureAilment() {
        if (this._statusAilment.name === 'ねむり') {
            writeLog(`${this._name}は 目を 覚ました!`);
        }
        if (this._statusAilment.name === 'こおり') {
            writeLog(`${this._name}の こおりが 溶けた!`);
        }
        this._statusAilment = new StateChange(null);
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
        this._type = null;
        this._category = '物理';
        this._power = 0;
        this._accuracy = 0;
        this._remainingPP = 0;
        this._powerPoint = 0;
        this._isDirect = true;
        this._isProtect = true;
        this._target = '自分';
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
    runOutPP() {
        writeLog(`しかし 技の ポイントが なかった!`);
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
        this._trainer = 'field';
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
        this._isTrue = false;
        this._turn = 0;
        this._count = 0;
        this._number = 0;
        this._text = '';
        this._target = new Target;
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
    set number(number) {
        this._number = number;
    }
    set text(text) {
        this._text = text;
    }
    set target(target) {
        this._target = target;
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
    get number() {
        return this._number;
    }
    get text() {
        return this._text;
    }
    get target() {
        return this._target;
    }
    reset() {
        this._isTrue = false;
        this._turn = 0;
        this._count = 0;
        this._number = 0;
        this._text = '';
        this._target = new Target;
    }
}
class StateChangeSummary {
    constructor() {
        this._flinch = new StateChange('ひるみ');
        this._curse = new StateChange('のろい');
        this._attract = new StateChange('メロメロ');
        this._leechSeed = new StateChange('やどりぎのタネ');
        this._yawn = new StateChange('ねむけ');
        this._perishSong = new StateChange('ほろびのうた');
        this._noAbility = new StateChange('とくせいなし');
        this._healBlock = new StateChange('かいふくふうじ');
        this._embargo = new StateChange('さしおさえ');
        this._encore = new StateChange('アンコール');
        this._torment = new StateChange('いちゃもん');
        this._taunt = new StateChange('ちょうはつ');
        this._disable = new StateChange('かなしばり');
        this._foresight = new StateChange('みやぶられている');
        this._miracleEye = new StateChange('ミラクルアイ');
        this._helpingHand = new StateChange('てだすけ');
        this._smackDown = new StateChange('うちおとす');
        this._telekinesis = new StateChange('テレキネシス');
        this._powder = new StateChange('ふんじん');
        this._throatChop = new StateChange('じごくづき');
        this._tarShot = new StateChange('タールショット');
        this._focusEnergy = new StateChange('きゅうしょアップ');
        this._substitute = new StateChange('みがわり');
        this._lockOn = new StateChange('ロックオン');
        this._minimize = new StateChange('ちいさくなる');
        this._imprison = new StateChange('ふういん');
        this._ingrain = new StateChange('ねをはる');
        this._aquaRing = new StateChange('アクアリング');
        this._charge = new StateChange('じゅうでん');
        this._stockpile = new StateChange('たくわえる');
        this._magnetRise = new StateChange('でんじふゆう');
        this._transform = new StateChange('へんしん');
        this._fly = new StateChange('そらを飛ぶ');
        this._dig = new StateChange('あなをほる');
        this._dive = new StateChange('ダイビング');
        this._shadowForce = new StateChange('シャドーダイブ');
        this._confuse = new StateChange('こんらん');
        this._truant = new StateChange('なまけ');
        this._slowStart = new StateChange('スロースタート');
        this._disguise = new StateChange('ばけのかわ');
        this._iceFace = new StateChange('アイスフェイス');
        this._quarkDrive = new StateChange('クォークチャージ');
        this._protosynthesis = new StateChange('こだいかっせい');
        this._flashFire = new StateChange('もらいび');
        this._skin = new StateChange('スキン系特性');
        this._gem = new StateChange('ジュエル');
        this._cannotMove = new StateChange('反動で動けない');
        this._endure = new StateChange('こらえる');
        this._endureMsg = new StateChange('HP1で耐える効果');
        this._recycle = new StateChange('リサイクル');
        this._dynamax = new StateChange('ダイマックス');
    }
    set flinch(flinch) {
        this._flinch = flinch;
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
    set healBlock(healBlock) {
        this._healBlock = healBlock;
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
    set helpingHand(helpingHand) {
        this._helpingHand = helpingHand;
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
    set throatChop(throatChop) {
        this._throatChop = throatChop;
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
    set imprison(imprison) {
        this._imprison = imprison;
    }
    set ingrain(ingrain) {
        this._ingrain = ingrain;
    }
    set aquaRing(aquaRing) {
        this._aquaRing = aquaRing;
    }
    set charge(charge) {
        this._charge = charge;
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
    set fly(fly) {
        this._fly = fly;
    }
    set dig(dig) {
        this._dig = dig;
    }
    set dive(dive) {
        this._dive = dive;
    }
    set shadowForce(shadowForce) {
        this._shadowForce = shadowForce;
    }
    set confuse(confuse) {
        this._confuse = confuse;
    }
    set truant(truant) {
        this._truant = truant;
    }
    set slowStart(slowStart) {
        this._slowStart = slowStart;
    }
    set disguise(disguise) {
        this._disguise = disguise;
    }
    set iceFace(iceFace) {
        this._iceFace = iceFace;
    }
    set quarkDrive(quarkDrive) {
        this._quarkDrive = quarkDrive;
    }
    set protosynthesis(protosynthesis) {
        this._protosynthesis = protosynthesis;
    }
    set flashFire(flashFire) {
        this._flashFire = flashFire;
    }
    set skin(skin) {
        this._skin = skin;
    }
    set gem(gem) {
        this._gem = gem;
    }
    set cannotMove(cannotMove) {
        this._cannotMove = cannotMove;
    }
    set endure(endure) {
        this._endure = endure;
    }
    set endureMsg(endureMsg) {
        this._endureMsg = endureMsg;
    }
    set recycle(recycle) {
        this._recycle = recycle;
    }
    set dynamax(dynamax) {
        this._dynamax = dynamax;
    }
    get flinch() {
        return this._flinch;
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
    get healBlock() {
        return this._healBlock;
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
    get helpingHand() {
        return this._helpingHand;
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
    get throatChop() {
        return this._throatChop;
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
    get imprison() {
        return this._imprison;
    }
    get ingrain() {
        return this._ingrain;
    }
    get aquaRing() {
        return this._aquaRing;
    }
    get charge() {
        return this._charge;
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
    get fly() {
        return this._fly;
    }
    get dig() {
        return this._dig;
    }
    get dive() {
        return this._dive;
    }
    get shadowForce() {
        return this._shadowForce;
    }
    get confuse() {
        return this._confuse;
    }
    get truant() {
        return this._truant;
    }
    get slowStart() {
        return this._slowStart;
    }
    get disguise() {
        return this._disguise;
    }
    get iceFace() {
        return this._iceFace;
    }
    get quarkDrive() {
        return this._quarkDrive;
    }
    get protosynthesis() {
        return this._protosynthesis;
    }
    get flashFire() {
        return this._flashFire;
    }
    get skin() {
        return this._skin;
    }
    get gem() {
        return this._gem;
    }
    get cannotMove() {
        return this._cannotMove;
    }
    get endure() {
        return this._endure;
    }
    get endureMsg() {
        return this._endureMsg;
    }
    get recycle() {
        return this._recycle;
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
        this._stateChange = new StateChangeSummary;
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
    set stateChange(stateChange) {
        this._stateChange = stateChange;
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
    get stateChange() {
        return this._stateChange;
    }
    declareMove() {
        writeLog(`${this._status.name}の ${this._moveUsed.name}!`);
    }
}
