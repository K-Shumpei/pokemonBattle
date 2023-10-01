"use strict";
class Order {
    constructor() {
        this._party = 0;
        this._hand = 0;
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
class Index {
    constructor() {
        this._id = 0;
        this._order = 0;
        this._index = 0;
    }
    set id(id) {
        this._id = id;
    }
    set order(order) {
        this._order = order;
    }
    set index(index) {
        this._index = index;
    }
    get id() {
        return this._id;
    }
    get order() {
        return this._order;
    }
    get index() {
        return this._index;
    }
}
class ValueWithRange {
    constructor(max, min) {
        this._value = 0;
        this._max = max;
        this._min = min;
    }
    get value() {
        return this._value;
    }
    add(value) {
        value = Math.min(6, this._value + value);
        value = Math.max(-6, this._value + value);
        this._value = value;
    }
    sub(value) {
        value = Math.min(6, this._value - value);
        value = Math.max(-6, this._value - value);
        this._value = value;
    }
    toZero() {
        this._value = 0;
    }
    isMax() {
        return this._value === this._max;
    }
    isMin() {
        return this._value === this._min;
    }
    isZero() {
        return this._value === 0;
    }
    isPlus() {
        return this._value > 0;
    }
    isMinus() {
        return this._value < 0;
    }
}
class StatusAilment {
    constructor() {
        this._name = null;
        this._turn = 0;
    }
    get turn() {
        return this._turn;
    }
    isHealth() {
        return this._name === null;
    }
    isParalysis() {
        return this._name === 'PARALYSIS';
    }
    isFrozen() {
        return this._name === 'FROZEN';
    }
    isBurned() {
        return this._name === 'BURNED';
    }
    isPoisoned() {
        return this._name === 'POISONED';
    }
    isBadPoisoned() {
        return this._name === 'POISONED' && this._turn > 0;
    }
    isAsleep() {
        return this._name === 'ASLEEP';
    }
    getHealth() {
        this._name = null;
        this._turn = 0;
    }
    getParalysis() {
        this._name = 'PARALYSIS';
    }
    getFrozen() {
        this._name = 'FROZEN';
    }
    getBurned() {
        this._name = 'BURNED';
    }
    getPoisoned() {
        this._name = 'POISONED';
    }
    getBadPoisoned() {
        this._name = 'POISONED';
        this._turn = 1;
    }
    getAsleep() {
        this._name = 'ASLEEP';
    }
    countPoisoned() {
        this._turn += 1;
    }
    countAsleep(turn) {
        this._turn -= turn;
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
        this._attack = new Rank();
        this._defense = new Rank();
        this._specialAttack = new Rank();
        this._specialDefense = new Rank();
        this._speed = new Rank();
        this._evasion = new Rank();
        this._accuracy = new Rank();
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
/*
class Damage {
  _damage: number;
  _effective: number;
  _critical: boolean;
  _substitute: boolean;

  constructor() {
    this._damage = 0;
    this._effective = 0;
    this._critical = false;
    this._substitute = false;
  }

  set damage( damage: number ) {
    this._damage = damage;
  }
  set effective( effective: number ) {
    this._effective = effective;
  }
  set critical( critical: boolean ) {
    this._critical = critical;
  }
  set substitute( substitute: boolean ) {
    this._substitute = substitute;
  }

  get damage(): number {
    return this._damage;
  }
  get effective(): number {
    return this._effective;
  }
  get critical(): boolean {
    return this._critical;
  }
  get substitute(): boolean {
    return this._substitute;
  }
}
*/
class Target {
    constructor() {
        this._trainer = 'field';
        this._battle = null;
        this._party = 0;
    }
    set trainer(trainer) {
        this._trainer = trainer;
    }
    set battle(battle) {
        this._battle = battle;
    }
    set party(party) {
        this._party = party;
    }
    get trainer() {
        return this._trainer;
    }
    get battle() {
        return this._battle;
    }
    get party() {
        return this._party;
    }
}
class Damage {
    constructor() {
        this._trainer = 'field';
        this._battle = null;
        this._party = 0;
        this._success = true;
        this._damage = 0;
        this._effective = 0;
        this._critical = false;
        this._substitute = false;
    }
    set trainer(trainer) {
        this._trainer = trainer;
    }
    set battle(battle) {
        this._battle = battle;
    }
    set party(party) {
        this._party = party;
    }
    set success(success) {
        this._success = success;
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
    set substitute(substitute) {
        this._substitute = substitute;
    }
    get trainer() {
        return this._trainer;
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
}
class StateChange {
    constructor(name) {
        this._name = name;
        this._isTrue = false;
        this._turn = 0;
        this._count = 0;
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
        this._text = '';
        this._target = new Target;
    }
}
class StateChangeSummary {
    constructor() {
        this._flinch = new StateChange('ひるみ');
        this._bind = new StateChange('バインド');
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
        this._cannotEscape = new StateChange('にげられない');
        this._electrify = new StateChange('そうでん');
        this._powder = new StateChange('ふんじん');
        this._throatChop = new StateChange('じごくづき');
        this._tarShot = new StateChange('タールショット');
        this._saltCure = new StateChange('しおづけ');
        this._focusEnergy = new StateChange('きゅうしょアップ');
        this._substitute = new StateChange('みがわり');
        this._protect = new StateChange('まもる');
        this._lockOn = new StateChange('ロックオン');
        this._minimize = new StateChange('ちいさくなる');
        this._destinyBond = new StateChange('みちづれ');
        this._grudge = new StateChange('おんねん');
        this._uproar = new StateChange('さわぐ');
        this._imprison = new StateChange('ふういん');
        this._rage = new StateChange('いかり');
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
        this._protean = new StateChange('へんげんじざい');
        this._quarkDrive = new StateChange('クォークチャージ');
        this._protosynthesis = new StateChange('こだいかっせい');
        this._flashFire = new StateChange('もらいび');
        this._sheerForce = new StateChange('ちからずく');
        this._synchronize = new StateChange('シンクロ');
        this._gulpMissile = new StateChange('うのミサイル');
        this._orderRaise = new StateChange('行動順繰り上げ');
        this._skin = new StateChange('スキン系特性');
        this._gem = new StateChange('ジュエル');
        this._micleBerry = new StateChange('ミクルのみ');
        this._halfBerry = new StateChange('半減きのみ');
        this._cannotMove = new StateChange('反動で動けない');
        this._endure = new StateChange('こらえる');
        this._beakBlast = new StateChange('くちばしキャノン');
        this._focusPunch = new StateChange('きあいパンチ');
        this._noRetreat = new StateChange('はいすいのじん');
        this._someProtect = new StateChange('まもる連続使用');
        this._endureMsg = new StateChange('HP1で耐える効果');
        this._recycle = new StateChange('リサイクル');
        this._fling = new StateChange('なげつける');
        this._store = new StateChange('ため技');
        this._belch = new StateChange('ゲップ');
        this._dynamax = new StateChange('ダイマックス');
        this._rangeCorr = new StateChange('範囲補正');
        this._memo = new StateChange('メモ');
    }
    set flinch(flinch) {
        this._flinch = flinch;
    }
    set bind(bind) {
        this._bind = bind;
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
    set cannotEscape(cannotEscape) {
        this._cannotEscape = cannotEscape;
    }
    set electrify(electrify) {
        this._electrify = electrify;
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
    set saltCure(saltCure) {
        this._saltCure = saltCure;
    }
    set focusEnergy(focusEnergy) {
        this._focusEnergy = focusEnergy;
    }
    set substitute(substitute) {
        this._substitute = substitute;
    }
    set protect(protect) {
        this._protect = protect;
    }
    set lockOn(lockOn) {
        this._lockOn = lockOn;
    }
    set minimize(minimize) {
        this._minimize = minimize;
    }
    set destinyBond(destinyBond) {
        this._destinyBond = destinyBond;
    }
    set grudge(grudge) {
        this._grudge = grudge;
    }
    set uproar(uproar) {
        this._uproar = uproar;
    }
    set imprison(imprison) {
        this._imprison = imprison;
    }
    set rage(rage) {
        this._rage = rage;
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
    set protean(protean) {
        this._protean = protean;
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
    set sheerForce(sheerForce) {
        this._sheerForce = sheerForce;
    }
    set synchronize(synchronize) {
        this._synchronize = synchronize;
    }
    set gulpMissile(gulpMissile) {
        this._gulpMissile = gulpMissile;
    }
    set orderRaise(orderRaise) {
        this._orderRaise = orderRaise;
    }
    set skin(skin) {
        this._skin = skin;
    }
    set gem(gem) {
        this._gem = gem;
    }
    set micleBerry(micleBerry) {
        this._micleBerry = micleBerry;
    }
    set halfBerry(halfBerry) {
        this._halfBerry = halfBerry;
    }
    set cannotMove(cannotMove) {
        this._cannotMove = cannotMove;
    }
    set endure(endure) {
        this._endure = endure;
    }
    set beakBlast(beakBlast) {
        this._beakBlast = beakBlast;
    }
    set focusPunch(focusPunch) {
        this._focusPunch = focusPunch;
    }
    set noRetreat(noRetreat) {
        this._noRetreat = noRetreat;
    }
    set someProtect(someProtect) {
        this._someProtect = someProtect;
    }
    set endureMsg(endureMsg) {
        this._endureMsg = endureMsg;
    }
    set recycle(recycle) {
        this._recycle = recycle;
    }
    set fling(fling) {
        this._fling = fling;
    }
    set store(store) {
        this._store = store;
    }
    set belch(belch) {
        this._belch = belch;
    }
    set dynamax(dynamax) {
        this._dynamax = dynamax;
    }
    set rangeCorr(rangeCorr) {
        this._rangeCorr = rangeCorr;
    }
    set memo(memo) {
        this._memo = memo;
    }
    get flinch() {
        return this._flinch;
    }
    get bind() {
        return this._bind;
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
    get cannotEscape() {
        return this._cannotEscape;
    }
    get electrify() {
        return this._electrify;
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
    get saltCure() {
        return this._saltCure;
    }
    get focusEnergy() {
        return this._focusEnergy;
    }
    get substitute() {
        return this._substitute;
    }
    get protect() {
        return this._protect;
    }
    get lockOn() {
        return this._lockOn;
    }
    get minimize() {
        return this._minimize;
    }
    get destinyBond() {
        return this._destinyBond;
    }
    get grudge() {
        return this._grudge;
    }
    get uproar() {
        return this._uproar;
    }
    get imprison() {
        return this._imprison;
    }
    get rage() {
        return this._rage;
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
    get protean() {
        return this._protean;
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
    get sheerForce() {
        return this._sheerForce;
    }
    get synchronize() {
        return this._synchronize;
    }
    get gulpMissile() {
        return this._gulpMissile;
    }
    get orderRaise() {
        return this._orderRaise;
    }
    get skin() {
        return this._skin;
    }
    get gem() {
        return this._gem;
    }
    get micleBerry() {
        return this._micleBerry;
    }
    get halfBerry() {
        return this._halfBerry;
    }
    get cannotMove() {
        return this._cannotMove;
    }
    get endure() {
        return this._endure;
    }
    get beakBlast() {
        return this._beakBlast;
    }
    get focusPunch() {
        return this._focusPunch;
    }
    get noRetreat() {
        return this._noRetreat;
    }
    get someProtect() {
        return this._someProtect;
    }
    get endureMsg() {
        return this._endureMsg;
    }
    get recycle() {
        return this._recycle;
    }
    get fling() {
        return this._fling;
    }
    get store() {
        return this._store;
    }
    get belch() {
        return this._belch;
    }
    get dynamax() {
        return this._dynamax;
    }
    get rangeCorr() {
        return this._rangeCorr;
    }
    get memo() {
        return this._memo;
    }
}
class LearnedMove {
    constructor() {
        this._slot = 0;
        this._name = null;
        this._powerPoint = 0;
        this._remainingPP = 0;
    }
    set slot(slot) {
        this._slot = slot;
    }
    set name(name) {
        this._name = name;
    }
    set powerPoint(powerPoint) {
        this._powerPoint = powerPoint;
    }
    set remainingPP(remainingPP) {
        this._remainingPP = remainingPP;
    }
    get slot() {
        return this._slot;
    }
    get name() {
        return this._name;
    }
    get powerPoint() {
        return this._powerPoint;
    }
    get remainingPP() {
        return this._remainingPP;
    }
    curePPByLeppaBerry(pokemon, value) {
        // PP回復
        this._remainingPP = Math.min(this._remainingPP + value, this._powerPoint);
        // メッセージ
        writeLog(`${getArticle(pokemon)}は ヒメリのみで ${this._name}のPPを 回復した!`);
        // なげつける・むしくい・ついばむ
        if (pokemon.stateChange.memo.isTrue === true) {
            pokemon.stateChange.memo.count += 1;
        }
    }
}
class MoveFlag {
    constructor() {
        this._contact = false;
        this._charge = false;
        this._recharge = false;
        this._protect = false;
        this._reflectable = false;
        this._snatch = false;
        this._mirror = false;
        this._punch = false;
        this._sound = false;
        this._gravity = false;
        this._defrost = false;
        this._distance = false;
        this._heal = false;
        this._authentic = false;
        this._powder = false;
        this._bite = false;
        this._pulse = false;
        this._ballistics = false;
        this._mental = false;
        this._nonSkyBattle = false;
        this._dance = false;
    }
    set contact(contact) {
        this._contact = contact;
    }
    set charge(charge) {
        this._charge = charge;
    }
    set recharge(recharge) {
        this._recharge = recharge;
    }
    set protect(protect) {
        this._protect = protect;
    }
    set reflectable(reflectable) {
        this._reflectable = reflectable;
    }
    set snatch(snatch) {
        this._snatch = snatch;
    }
    set mirror(mirror) {
        this._mirror = mirror;
    }
    set punch(punch) {
        this._punch = punch;
    }
    set sound(sound) {
        this._sound = sound;
    }
    set gravity(gravity) {
        this._gravity = gravity;
    }
    set defrost(defrost) {
        this._defrost = defrost;
    }
    set distance(distance) {
        this._distance = distance;
    }
    set heal(heal) {
        this._heal = heal;
    }
    set authentic(authentic) {
        this._authentic = authentic;
    }
    set powder(powder) {
        this._powder = powder;
    }
    set bite(bite) {
        this._bite = bite;
    }
    set pulse(pulse) {
        this._pulse = pulse;
    }
    set ballistics(ballistics) {
        this._ballistics = ballistics;
    }
    set mental(mental) {
        this._mental = mental;
    }
    set nonSkyBattle(nonSkyBattle) {
        this._nonSkyBattle = nonSkyBattle;
    }
    set dance(dance) {
        this._dance = dance;
    }
    get contact() {
        return this._contact;
    }
    get charge() {
        return this._charge;
    }
    get recharge() {
        return this._recharge;
    }
    get protect() {
        return this._protect;
    }
    get reflectable() {
        return this._reflectable;
    }
    get snatch() {
        return this._snatch;
    }
    get mirror() {
        return this._mirror;
    }
    get punch() {
        return this._punch;
    }
    get sound() {
        return this._sound;
    }
    get gravity() {
        return this._gravity;
    }
    get defrost() {
        return this._defrost;
    }
    get distance() {
        return this._distance;
    }
    get heal() {
        return this._heal;
    }
    get authentic() {
        return this._authentic;
    }
    get powder() {
        return this._powder;
    }
    get bite() {
        return this._bite;
    }
    get pulse() {
        return this._pulse;
    }
    get ballistics() {
        return this._ballistics;
    }
    get mental() {
        return this._mental;
    }
    get nonSkyBattle() {
        return this._nonSkyBattle;
    }
    get dance() {
        return this._dance;
    }
}
class SelectedMove {
    constructor() {
        this._slot = 0;
        this._name = '';
        this._type = null;
        this._damageClass = '';
        this._target = '';
        this._category = '';
        this._power = 0;
        this._accuracy = 0;
        this._priority = 0;
        this._critical = 0;
        this._drain = 0;
        this._flinch = 0;
        this._healing = 0;
        this._hits = { max: null, min: null };
        this._turns = { max: null, min: null };
        this._ailment = { chance: 0, name: '' };
        this._stat = { chance: 0, changes: [] };
        this._flag = new MoveFlag;
    }
    set slot(slot) {
        this._slot = slot;
    }
    set name(name) {
        this._name = name;
    }
    set type(type) {
        this._type = type;
    }
    set damageClass(damageClass) {
        this._damageClass = damageClass;
    }
    set target(target) {
        this._target = target;
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
    set priority(priority) {
        this._priority = priority;
    }
    set critical(critical) {
        this._critical = critical;
    }
    set drain(drain) {
        this._drain = drain;
    }
    set flinch(flinch) {
        this._flinch = flinch;
    }
    set healing(healing) {
        this._healing = healing;
    }
    set hits(hits) {
        this._hits = hits;
    }
    set turns(turns) {
        this._turns = turns;
    }
    set ailment(ailment) {
        this._ailment = ailment;
    }
    set stat(stat) {
        this._stat = stat;
    }
    set flag(flag) {
        this._flag = flag;
    }
    get slot() {
        return this._slot;
    }
    get name() {
        return this._name;
    }
    get type() {
        return this._type;
    }
    get damageClass() {
        return this._damageClass;
    }
    get target() {
        return this._target;
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
    get priority() {
        return this._priority;
    }
    get critical() {
        return this._critical;
    }
    get drain() {
        return this._drain;
    }
    get flinch() {
        return this._flinch;
    }
    get healing() {
        return this._healing;
    }
    get hits() {
        return this._hits;
    }
    get turns() {
        return this._turns;
    }
    get ailment() {
        return this._ailment;
    }
    get stat() {
        return this._stat;
    }
    get flag() {
        return this._flag;
    }
}
class Ability {
    constructor() {
        this._name = '';
        this._org = '';
    }
    set name(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    isName(ability) {
        return this._name === ability;
    }
    setOrg(ability) {
        this._name = ability;
        this._org = ability;
    }
}
class ActualWithThreeValue {
    constructor() {
        this._actual = 0;
        this._base = 0;
        this._individual = 0;
        this._effort = 0;
    }
    get actual() {
        return this._actual;
    }
    get base() {
        return this._base;
    }
    get individual() {
        return this._individual;
    }
    get effort() {
        return this._effort;
    }
    register(parameter) {
        this.setActual(Number(getHTMLInputElement('register_' + parameter + 'ActualValue').value));
        this.setBase(Number(getHTMLInputElement('register_' + parameter + 'BaseStatus').value));
        this.setIndividual(Number(getHTMLInputElement('register_' + parameter + 'IndividualValue').value));
        this.setEffort(Number(getHTMLInputElement('register_' + parameter + 'EffortValue').value));
    }
    edit(parameter) {
        getHTMLInputElement('register_' + parameter + 'IndividualValue').value = String(this._individual);
        getHTMLInputElement('register_' + parameter + 'EffortValue').value = String(this._effort);
    }
    showAcrual(parameter, handOrder) {
        getHTMLInputElement('party' + handOrder + '_' + parameter).textContent = String(this._actual);
    }
    copy(status) {
        this.setActual(status._actual);
        this.setBase(status._base);
        this.setIndividual(status._individual);
        this.setEffort(status._effort);
    }
    setActual(value) {
        this._actual = value;
    }
    setBase(value) {
        this._base = value;
    }
    setIndividual(value) {
        this._individual = value;
    }
    setEffort(value) {
        this._effort = value;
    }
}
class Rank extends ValueWithRange {
    constructor() {
        super(6, -6);
    }
}
class HitPointValue extends ValueWithRange {
    constructor() {
        super(175, 0);
    }
    setActualValue(value) {
        this._value = value;
        this._max = value;
    }
    rate() {
        return this._value / this._max;
    }
    isGreaterThan(denominator) {
        return this._value > this._max / denominator;
    }
    isGreaterEqual(denominator) {
        return this._value >= this._max / denominator;
    }
    isLessThan(denominator) {
        return this._value < this._max / denominator;
    }
    isLessEqual(denominator) {
        return this._value <= this._max / denominator;
    }
}
class HitPoint extends ActualWithThreeValue {
    constructor() {
        super();
        this._value = new HitPointValue();
    }
    get value() {
        return this._value;
    }
}
class MainStatus extends ActualWithThreeValue {
    constructor() {
        super();
        this._rank = new Rank();
    }
    get rank() {
        return this._rank;
    }
}
class Status {
    constructor() {
        this._hitPoint = new HitPoint();
        this._attack = new MainStatus();
        this._defense = new MainStatus();
        this._specialAttack = new MainStatus();
        this._specialDefense = new MainStatus();
        this._speed = new MainStatus();
        this._accuracy = new Rank();
        this._evasion = new Rank();
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
    get accuracy() {
        return this._accuracy;
    }
    get evasion() {
        return this._evasion;
    }
    register() {
        this._hitPoint.register('hitPoint');
        this._attack.register('attack');
        this._defense.register('defense');
        this._specialAttack.register('specialAttack');
        this._specialDefense.register('specialDefense');
        this._speed.register('speed');
    }
    edit() {
        this._hitPoint.edit('hitPoint');
        this._attack.edit('attack');
        this._defense.edit('defense');
        this._specialAttack.edit('specialAttack');
        this._specialDefense.edit('specialDefense');
        this._speed.edit('speed');
    }
    getAllEffort() {
        let allEffort = 0;
        allEffort += this._hitPoint.effort;
        allEffort += this._attack.effort;
        allEffort += this._defense.effort;
        allEffort += this._specialAttack.effort;
        allEffort += this._specialDefense.effort;
        allEffort += this._speed.effort;
        return allEffort;
    }
    showActual(handOrder) {
        this._hitPoint.showAcrual('hitPoint', handOrder);
        this._attack.showAcrual('attack', handOrder);
        this._defense.showAcrual('defense', handOrder);
        this._specialAttack.showAcrual('specialAttack', handOrder);
        this._specialDefense.showAcrual('specialDefense', handOrder);
        this._speed.showAcrual('speed', handOrder);
    }
    resetRank() {
        this._attack.rank.toZero();
        this._defense.rank.toZero();
        this._specialAttack.rank.toZero();
        this._specialDefense.rank.toZero();
        this._speed.rank.toZero();
        this._accuracy.toZero();
        this._evasion.toZero();
    }
    copy(status) {
        this._hitPoint.copy(status._hitPoint);
        this._attack.copy(status._attack);
        this._defense.copy(status._defense);
        this._specialAttack.copy(status._specialAttack);
        this._specialDefense.copy(status._specialDefense);
        this._speed.copy(status._speed);
    }
}
class Pokemon {
    constructor() {
        this._id = new Index();
        this._trainer = 'me';
        this._order = new Order;
        this._status = new Status();
        this._learnedMove = [
            new LearnedMove,
            new LearnedMove,
            new LearnedMove,
            new LearnedMove,
        ];
        this._selectedMove = new SelectedMove;
        this._damage = [];
        this._command = new Command;
        this._stateChange = new StateChangeSummary;
        this._name = '';
        this._type1 = null;
        this._type2 = null;
        this._gender = 'genderless';
        this._ability = new Ability();
        this._level = 50;
        this._item = null;
        this._nature = 'てれや';
        this._height = 1.0;
        this._weight = 1.0;
        this._happiness = 255;
        this._hitPoint = new HitPoint();
        this._statusAilment = new StatusAilment();
    }
    set id(id) {
        this._id = id;
    }
    set trainer(trainer) {
        this._trainer = trainer;
    }
    set learnedMove(learnedMove) {
        this._learnedMove = learnedMove;
    }
    set selectedMove(selectedMove) {
        this._selectedMove = selectedMove;
    }
    set damage(damage) {
        this._damage = damage;
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
    set type1(type) {
        this._type1 = type;
    }
    set type2(type) {
        this._type2 = type;
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
    set height(height) {
        this._height = height;
    }
    set weight(weight) {
        this._weight = weight;
    }
    set happiness(happiness) {
        this._happiness = happiness;
    }
    set hitPoint(hitPoint) {
        this._hitPoint = hitPoint;
    }
    set statusAilment(statusAilment) {
        this._statusAilment = statusAilment;
    }
    get id() {
        return this._id;
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
    get learnedMove() {
        return this._learnedMove;
    }
    get selectedMove() {
        return this._selectedMove;
    }
    get damage() {
        return this._damage;
    }
    get command() {
        return this._command;
    }
    get stateChange() {
        return this._stateChange;
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
    get hitPoint() {
        return this._hitPoint;
    }
    get statusAilment() {
        return this._statusAilment;
    }
    declareAbility() {
        writeLog(`${this._name}の ${this._ability}`);
    }
    declareFailure() {
        writeLog(`しかし うまく決まらなかった....`);
    }
    declareInvalid(info) {
        info.success = false;
        writeLog(`${this._name}には 効果がないようだ...`);
    }
    declareNotHit(info) {
        info.success = false;
        writeLog(`${this._name}には 当たらなかった!`);
    }
    abilityInfo() {
        /*
        for ( const info of changeAbilityTable ) {
          if ( info.name === this._ability ) {
            return info;
          }
        }
        */
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
    //----------
    // 行動の失敗
    //----------
    // 反動で動けない
    isCannotMove() {
        if (!this._stateChange.cannotMove.isTrue)
            return false;
        this._stateChange.cannotMove.reset();
        // なまけ
        if (this._ability.isName('Truant')) {
            this._stateChange.truant.count += 1;
        }
        return true;
    }
}
