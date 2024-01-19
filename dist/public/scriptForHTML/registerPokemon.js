"use strict";
class RegisterValue {
    constructor() {
        this._av = 0;
        this._bs = 0;
        this._iv = 31;
        this._ev = 0;
    }
    set av(val) {
        this._av = val;
    }
    set bs(val) {
        this._bs = val;
    }
    set iv(val) {
        this._iv = val;
    }
    set ev(val) {
        this._ev = val;
    }
    get av() {
        return this._av;
    }
    get bs() {
        return this._bs;
    }
    get iv() {
        return this._iv;
    }
    get ev() {
        return this._ev;
    }
    show(para) {
        getHTMLInputElement('register_' + para + 'ActualValue').value = String(this._av);
        getHTMLInputElement('register_' + para + 'BaseStatus').textContent = String(this._bs);
        getHTMLInputElement('register_' + para + 'IndividualValue').value = String(this._iv);
        getHTMLInputElement('register_' + para + 'EffortValue').value = String(this._ev);
    }
    getAV(para) {
        return Number(getHTMLInputElement('register_' + para + 'ActualValue').value);
    }
    copy(stat) {
        this._av = stat.av;
        this._bs = stat.bs;
        this._iv = stat.iv;
        this._ev = stat.ev;
    }
}
class RegisterHitPoint extends RegisterValue {
    constructor() {
        super();
    }
    calcAct(level) {
        const step1 = this._bs * 2 + this._iv + Math.floor(this._ev / 4);
        const step2 = step1 * level;
        this._av = Math.floor(step2 / 100) + level + 10;
    }
    calcEffort(para, level) {
        const step3 = this.getAV(para) - level - 10;
        const step2 = 100 * step3 / level;
        const step1 = Math.ceil(step2 - 2 * this._bs - this._iv);
        let result = Math.max(0, 4 * step1);
        return Math.min(252, result);
    }
}
class RegisterFiveStatus extends RegisterValue {
    constructor() {
        super();
    }
    calcAct(level, corr) {
        const step1 = this._bs * 2 + this._iv + Math.floor(this._ev / 4);
        const step2 = step1 * level;
        const step3 = Math.floor(step2 / 100);
        this._av = Math.floor((step3 + 5) * corr);
    }
    calcEffort(para, level, corr) {
        const step3 = Math.ceil(this.getAV(para) / corr - 5);
        const step2 = 100 * step3 / level;
        const step1 = Math.ceil(step2 - 2 * this._bs - this._iv);
        let result = Math.max(0, 4 * step1);
        return Math.min(252, result);
    }
}
class RegisterStatus {
    constructor() {
        this._hp = new RegisterHitPoint();
        this._atk = new RegisterFiveStatus();
        this._def = new RegisterFiveStatus();
        this._spA = new RegisterFiveStatus();
        this._spD = new RegisterFiveStatus();
        this._spe = new RegisterFiveStatus();
    }
    get hp() {
        return this._hp;
    }
    get atk() {
        return this._atk;
    }
    get def() {
        return this._def;
    }
    get spA() {
        return this._spA;
    }
    get spD() {
        return this._spD;
    }
    get spe() {
        return this._spe;
    }
    setMaster(master) {
        this._hp.bs = master.baseStatus.hp;
        this._atk.bs = master.baseStatus.atk;
        this._def.bs = master.baseStatus.def;
        this._spA.bs = master.baseStatus.spA;
        this._spD.bs = master.baseStatus.spD;
        this._spe.bs = master.baseStatus.spe;
    }
    show() {
        this._hp.show('hitPoint');
        this._atk.show('attack');
        this._def.show('defense');
        this._spA.show('specialAttack');
        this._spD.show('specialDefense');
        this._spe.show('speed');
    }
    setIVs() {
        this._hp.iv = Number(getHTMLInputElement('register_hitPointIndividualValue').value);
        this._atk.iv = Number(getHTMLInputElement('register_attackIndividualValue').value);
        this._def.iv = Number(getHTMLInputElement('register_defenseIndividualValue').value);
        this._spA.iv = Number(getHTMLInputElement('register_specialAttackIndividualValue').value);
        this._spD.iv = Number(getHTMLInputElement('register_specialDefenseIndividualValue').value);
        this._spe.iv = Number(getHTMLInputElement('register_speedIndividualValue').value);
    }
    isChangableAV(level, nature) {
        const hp = this._hp.calcEffort('hitPoint', level);
        const atk = this._atk.calcEffort('attack', level, nature.atk);
        const def = this._def.calcEffort('defense', level, nature.def);
        const spA = this._spA.calcEffort('specialAttack', level, nature.spA);
        const spD = this._spD.calcEffort('specialDefense', level, nature.spD);
        const spe = this._spe.calcEffort('speed', level, nature.spe);
        return hp + atk + def + spA + spD + spe <= 510;
    }
    isChangableEV() {
        const hp = Number(getHTMLInputElement('register_hitPointEffortValue').value);
        const atk = Number(getHTMLInputElement('register_attackEffortValue').value);
        const def = Number(getHTMLInputElement('register_defenseEffortValue').value);
        const spA = Number(getHTMLInputElement('register_specialAttackEffortValue').value);
        const spD = Number(getHTMLInputElement('register_specialDefenseEffortValue').value);
        const spe = Number(getHTMLInputElement('register_speedEffortValue').value);
        return hp + atk + def + spA + spD + spe <= 510;
    }
    setEVs() {
        if (!this.isChangableEV())
            return;
        this._hp.ev = Number(getHTMLInputElement('register_hitPointEffortValue').value);
        this._atk.ev = Number(getHTMLInputElement('register_attackEffortValue').value);
        this._def.ev = Number(getHTMLInputElement('register_defenseEffortValue').value);
        this._spA.ev = Number(getHTMLInputElement('register_specialAttackEffortValue').value);
        this._spD.ev = Number(getHTMLInputElement('register_specialDefenseEffortValue').value);
        this._spe.ev = Number(getHTMLInputElement('register_speedEffortValue').value);
    }
    setAVs(level, nature) {
        if (!this.isChangableAV(level, nature))
            return;
        this._hp.ev = this._hp.calcEffort('hitPoint', level);
        this._atk.ev = this._atk.calcEffort('attack', level, nature.atk);
        this._def.ev = this._def.calcEffort('defense', level, nature.def);
        this._spA.ev = this._spA.calcEffort('specialAttack', level, nature.spA);
        this._spD.ev = this._spD.calcEffort('specialDefense', level, nature.spD);
        this._spe.ev = this._spe.calcEffort('speed', level, nature.spe);
    }
    copy(stat) {
        this._hp.copy(stat.hp);
        this._atk.copy(stat.atk);
        this._def.copy(stat.def);
        this._spA.copy(stat.spA);
        this._spD.copy(stat.spD);
        this._spe.copy(stat.spe);
    }
}
class RegisterMove {
    constructor(slot) {
        this._slot = slot;
        this._name = null;
        this._type = null;
        this._power = null;
        this._accuracy = null;
        this._powerPoint = 0;
        this._basePP = 0;
    }
    get name() {
        return this._name;
    }
    get powerPoint() {
        return this._powerPoint;
    }
    getMoveMaster(name) {
        return moveMaster.filter(m => m.nameEN === name)[0];
    }
    translate(move) {
        for (const data of moveMaster) {
            if (data.nameEN === move)
                return data.nameJA;
            if (data.nameJA === move)
                return data.nameEN;
        }
        return move;
    }
    select(slot) {
        const name = this.translate(getHTMLInputElement('registerMoveName' + slot).value);
        const master = moveMaster.filter(m => m.nameEN === name)[0];
        this._name = master.nameEN;
        this._type = master.type;
        this._power = master.power;
        this._accuracy = master.accuracy;
        this._powerPoint = master.powerPoint;
        this._basePP = master.powerPoint;
    }
    addPP() {
        if (this._name === '')
            return;
        if (this._powerPoint === 1)
            return;
        const step = this._basePP / 5;
        const max = this._basePP + step * 3;
        this._powerPoint = Math.min(max, this._powerPoint + step);
    }
    subPP() {
        if (this._name === '')
            return;
        if (this._powerPoint === 1)
            return;
        const step = this._basePP / 5;
        this._powerPoint = Math.max(this._basePP, this._powerPoint - step);
    }
    copy(move) {
        if (move.name === null)
            return;
        const master = this.getMoveMaster(move.name);
        this._name = master.nameEN;
        this._type = master.type;
        this._power = master.power;
        this._accuracy = master.accuracy;
        this._powerPoint = move.powerPoint.value;
        this._basePP = master.powerPoint;
        getHTMLInputElement('registerMoveName' + this._slot).value = this.translate(this._name);
    }
}
class RegisterMoveList {
    constructor() {
        this._slot = [
            new RegisterMove(0),
            new RegisterMove(1),
            new RegisterMove(2),
            new RegisterMove(3),
        ];
    }
    get slot() {
        return this._slot;
    }
    translate(move) {
        for (const data of moveMaster) {
            if (data.nameEN === move)
                return data.nameJA;
            if (data.nameJA === move)
                return data.nameEN;
        }
        return move;
    }
    setHTML(master) {
        for (let i = 0; i < 4; i++) {
            const moveHTML = getHTMLInputElement('registerMoveName' + i);
            moveHTML.innerHTML = '';
            // ブランクの選択肢
            const blunk = document.createElement('option');
            blunk.value = '';
            blunk.textContent = '';
            moveHTML.appendChild(blunk);
            // ポケモンが覚える技
            for (const move of master.move) {
                const option = document.createElement('option');
                option.value = this.translate(move);
                option.textContent = this.translate(move);
                moveHTML.appendChild(option);
            }
        }
    }
    show() {
        for (let i = 0; i < 4; i++) {
            getHTMLInputElement('registerMoveType' + i).textContent = String(this._slot[i]._type);
            getHTMLInputElement('registerMovePower' + i).textContent = String(this._slot[i]._power);
            getHTMLInputElement('registerMoveAccuracy' + i).textContent = String(this._slot[i]._accuracy);
            getHTMLInputElement('registerMovePowerPoint' + i).textContent = String(this._slot[i]._powerPoint);
            getHTMLInputElement('registerMovePowerPoint' + i).value = String(this._slot[i]._powerPoint);
        }
    }
    copy(move) {
        for (let i = 0; i < 4; i++) {
            this._slot[i].copy(move[i]);
        }
    }
}
class RegisterGender {
    constructor() {
        this._value = 'genderless';
        this._type = 'genderless';
    }
    get value() {
        return this._value;
    }
    set value(gender) {
        this._value = gender;
    }
    translate() {
        if (this._value === 'male')
            return '♂';
        if (this._value === 'female')
            return '♀';
        if (this._value === 'genderless')
            return '-';
        return '-';
    }
    setMaster(master) {
        this._type = master.gender;
        this._value = master.gender;
        if (this._value === 'both')
            this._value = 'male';
    }
    setHTML() {
        const genderHTML = getHTMLInputElement('register_gender');
        genderHTML.innerHTML = '';
        const optionMale = document.createElement('option');
        optionMale.value = '♂';
        optionMale.textContent = '♂';
        const optionFemale = document.createElement('option');
        optionFemale.value = '♀';
        optionFemale.textContent = '♀';
        const optionLess = document.createElement('option');
        optionLess.value = '-';
        optionLess.textContent = '-';
        switch (this._type) {
            case 'both':
                genderHTML.appendChild(optionMale);
                genderHTML.appendChild(optionFemale);
                break;
            case 'male':
                genderHTML.appendChild(optionMale);
                break;
            case 'female':
                genderHTML.appendChild(optionFemale);
                break;
            case 'genderless':
                genderHTML.appendChild(optionLess);
                break;
        }
    }
    set() {
        const gender = getHTMLInputElement('register_gender').value;
        if (gender === '♂')
            this._value = 'male';
        if (gender === '♀')
            this._value = 'female';
        if (gender === '-')
            this._value = 'genderless';
    }
    show() {
        const genderHTML = getHTMLInputElement('register_gender');
        genderHTML.value = this.translate();
    }
}
class RegisterAbility {
    constructor() {
        this._value = '';
        this._list = [];
    }
    get value() {
        return this._value;
    }
    set value(ability) {
        this._value = ability;
    }
    translate(name) {
        for (const data of abilityMaster) {
            if (data.nameEN === name)
                return data.nameJA;
            if (data.nameJA === name)
                return data.nameEN;
        }
        return name;
    }
    setMaster(master) {
        this._list = master.ability;
        ;
        this._value = master.ability[0];
    }
    setHTML() {
        const abilityHTML = getHTMLInputElement('register_ability');
        abilityHTML.innerHTML = '';
        for (const ability of this._list) {
            const option = document.createElement('option');
            option.value = this.translate(ability);
            option.textContent = this.translate(ability);
            abilityHTML.appendChild(option);
        }
    }
    set() {
        const ability = this.translate(getHTMLInputElement('register_ability').value);
        this._value = ability;
    }
    show() {
        const abilityHTML = getHTMLInputElement('register_ability');
        abilityHTML.value = this.translate(this._value);
    }
}
class Register {
    constructor() {
        this._id = 0;
        this._name = '';
        this._level = 0;
        this._type = [];
        this._gender = new RegisterGender();
        this._ability = new RegisterAbility();
        this._item = null;
        this._nature = 'Bashful';
        this._stat = new RegisterStatus();
        this._move = new RegisterMoveList();
    }
    reset() {
        this._id = 0;
        this._name = '';
        this._level = 50;
        this._type = [];
        this._gender = new RegisterGender();
        this._ability = new RegisterAbility();
        this._item = null;
        this._nature = 'Bashful';
        this._stat = new RegisterStatus();
        this._move = new RegisterMoveList();
        for (let i = 0; i < 4; i++) {
            const moveHTML = getHTMLInputElement('registerMoveName' + i);
            moveHTML.innerHTML = '';
        }
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get level() {
        return this._level;
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
    get item() {
        return this._item;
    }
    get nature() {
        return this._nature;
    }
    get stat() {
        return this._stat;
    }
    get move() {
        return this._move;
    }
    isGetPokemonMaster(name) {
        if (pokemonMaster.filter(m => m.nameEN === name).length === 0) {
            return false;
        }
        else {
            return true;
        }
    }
    getPokemonMaster(name) {
        return pokemonMaster.filter(m => m.nameEN === name)[0];
    }
    getMoveLearnedMaster(name) {
        return moveLearnedByPokemon.filter(m => m.nameEN === name)[0];
    }
    getNatureMaster(nature) {
        return natureMaster.filter(m => m.nameEN === nature)[0];
    }
    translateName(name) {
        for (const data of pokemonMaster) {
            if (data.nameEN === name)
                return data.nameJA;
            if (data.nameJA === name)
                return data.nameEN;
        }
        return name;
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
    translateNatureToJA(name) {
        return natureMaster.filter(m => m.nameEN === name)[0].nameJA;
    }
    translateNatureToEN(name) {
        return natureMaster.filter(m => m.nameJA === name)[0].nameEN;
    }
    isValidName() {
        // 適切な名前でなければ処理なし
        const name = this.translateName(getHTMLInputElement('register_name').value);
        return this.isGetPokemonMaster(name);
    }
    setName() {
        const name = this.translateName(getHTMLInputElement('register_name').value);
        this.reset();
        this.setMaster(name);
        this.calculateActualValue();
        this.setHTML();
    }
    setMaster(name) {
        const pokemon = this.getPokemonMaster(name);
        this._id = pokemon.id;
        this._name = pokemon.nameEN;
        this._type = pokemon.type;
        this._gender.setMaster(pokemon);
        this._ability.setMaster(pokemon);
        this._stat.setMaster(pokemon);
    }
    setHTML() {
        const move = this.getMoveLearnedMaster(this._name);
        this._gender.setHTML();
        this._ability.setHTML();
        this._move.setHTML(move);
    }
    setLevel() {
        const level = Number(getHTMLInputElement('register_level').value);
        this._level = level;
    }
    setGender() {
        this._gender.set();
    }
    setNatureList() {
        const nature = getHTMLInputElement('register_nature').value;
        this._nature = this.translateNatureToEN(nature);
        this.setNatureListToButton();
    }
    setNatureButton() {
        let plus = '';
        let minus = '';
        if (getHTMLInputElement('register_attackNaturePlus').checked)
            plus = 'atk';
        if (getHTMLInputElement('register_attackNatureMinus').checked)
            minus = 'atk';
        if (getHTMLInputElement('register_defenseNaturePlus').checked)
            plus = 'def';
        if (getHTMLInputElement('register_defenseNatureMinus').checked)
            minus = 'def';
        if (getHTMLInputElement('register_specialAttackNaturePlus').checked)
            plus = 'spA';
        if (getHTMLInputElement('register_specialAttackNatureMinus').checked)
            minus = 'spA';
        if (getHTMLInputElement('register_specialDefenseNaturePlus').checked)
            plus = 'spD';
        if (getHTMLInputElement('register_specialDefenseNatureMinus').checked)
            minus = 'spD';
        if (getHTMLInputElement('register_speedNaturePlus').checked)
            plus = 'spe';
        if (getHTMLInputElement('register_speedNatureMinus').checked)
            minus = 'spe';
        const nature = natureMaster.filter(m => m.plus === plus && m.minus === minus)[0];
        this._nature = nature.nameEN;
    }
    isUnreg() {
        return this._name === '';
    }
    calculateActualValue() {
        const nature = this.getNatureMaster(this._nature);
        this._stat.hp.calcAct(this._level);
        this._stat.atk.calcAct(this._level, nature.atk);
        this._stat.def.calcAct(this._level, nature.def);
        this._stat.spA.calcAct(this._level, nature.spA);
        this._stat.spD.calcAct(this._level, nature.spD);
        this._stat.spe.calcAct(this._level, nature.spe);
        if (this._name === 'Shedinja') {
            this._stat.hp.av = 1;
        }
    }
    setAVs() {
        const nature = this.getNatureMaster(this._nature);
        this._stat.setAVs(this._level, nature);
    }
    showOnScreen() {
        getHTMLInputElement('register_name').value = this.translateName(this._name);
        getHTMLInputElement('register_level').value = String(this._level);
        if (this._type.length === 0) {
            getHTMLInputElement('register_type1').value = '';
            getHTMLInputElement('register_type1').textContent = '';
            getHTMLInputElement('register_type2').value = '';
            getHTMLInputElement('register_type2').textContent = '';
        }
        else if (this._type.length === 1) {
            getHTMLInputElement('register_type1').value = this.translateType(String(this._type[0]));
            getHTMLInputElement('register_type1').textContent = this.translateType(String(this._type[0]));
            getHTMLInputElement('register_type2').value = '';
            getHTMLInputElement('register_type2').textContent = '';
        }
        else if (this._type.length === 2) {
            getHTMLInputElement('register_type1').value = this.translateType(String(this._type[0]));
            getHTMLInputElement('register_type1').textContent = this.translateType(String(this._type[0]));
            getHTMLInputElement('register_type2').value = this.translateType(String(this._type[1]));
            getHTMLInputElement('register_type2').textContent = this.translateType(String(this._type[1]));
        }
        getHTMLInputElement('register_item').textContent = this._item;
        this.setNatureListToButton();
        /*
        getHTMLInputElement( 'remainingEffortValue' ).textContent = '510';
        */
        this._gender.show();
        this._ability.show();
        this._stat.show();
        this._move.show();
    }
    setNatureListToButton() {
        getHTMLInputElement('register_nature').value = this.translateNatureToJA(this._nature);
        const nature = this.getNatureMaster(this._nature);
        if (nature.atk === 1.1)
            getHTMLInputElement('register_attackNaturePlus').checked = true;
        if (nature.atk === 0.9)
            getHTMLInputElement('register_attackNatureMinus').checked = true;
        if (nature.def === 1.1)
            getHTMLInputElement('register_defenseNaturePlus').checked = true;
        if (nature.def === 0.9)
            getHTMLInputElement('register_defenseNatureMinus').checked = true;
        if (nature.spA === 1.1)
            getHTMLInputElement('register_specialAttackNaturePlus').checked = true;
        if (nature.spA === 0.9)
            getHTMLInputElement('register_specialAttackNatureMinus').checked = true;
        if (nature.spD === 1.1)
            getHTMLInputElement('register_specialDefenseNaturePlus').checked = true;
        if (nature.spD === 0.9)
            getHTMLInputElement('register_specialDefenseNatureMinus').checked = true;
        if (nature.spe === 1.1)
            getHTMLInputElement('register_speedNaturePlus').checked = true;
        if (nature.spe === 0.9)
            getHTMLInputElement('register_speedNatureMinus').checked = true;
    }
    copy(pokemon) {
        this.reset();
        this.setMaster(pokemon.name);
        this.setHTML();
        this._level = pokemon.level;
        this._type = pokemon.type.get();
        this._gender.value = pokemon.gender;
        this._ability.value = pokemon.ability.name;
        this._item = pokemon.item.name;
        this._nature = pokemon.nature;
        this._stat.copy(pokemon.status);
        this._move.copy(pokemon.move.learned);
        this.calculateActualValue();
    }
}
