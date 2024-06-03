"use strict";
class RegisterValue {
    constructor() {
        this.av = 0; // 実数値
        this.bs = 0; // 種族値
        this.iv = 31; // 個体値
        this.ev = 0; // 努力値
    }
    show(para) {
        getHTMLInputElement('register_' + para + 'ActualValue').value = String(this.av);
        getHTMLInputElement('register_' + para + 'BaseStatus').textContent = String(this.bs);
        getHTMLInputElement('register_' + para + 'IndividualValue').value = String(this.iv);
        getHTMLInputElement('register_' + para + 'EffortValue').value = String(this.ev);
    }
    getAV(para) {
        return Number(getHTMLInputElement('register_' + para + 'ActualValue').value);
    }
    copy(stat) {
        this.av = stat.av;
        this.bs = stat.bs;
        this.iv = stat.iv;
        this.ev = stat.ev;
    }
}
class RegisterHitPoint extends RegisterValue {
    constructor() {
        super();
    }
    calcAct(level) {
        const step1 = this.bs * 2 + this.iv + Math.floor(this.ev / 4);
        const step2 = step1 * level;
        this.av = Math.floor(step2 / 100) + level + 10;
    }
    calcEffort(para, level) {
        const step3 = this.getAV(para) - level - 10;
        const step2 = 100 * step3 / level;
        const step1 = Math.ceil(step2 - 2 * this.bs - this.iv);
        let result = Math.max(0, 4 * step1);
        return Math.min(252, result);
    }
}
class RegisterFiveStatus extends RegisterValue {
    constructor() {
        super();
    }
    calcAct(level, corr) {
        const step1 = this.bs * 2 + this.iv + Math.floor(this.ev / 4);
        const step2 = step1 * level;
        const step3 = Math.floor(step2 / 100);
        this.av = Math.floor((step3 + 5) * corr);
    }
    calcEffort(para, level, corr) {
        const step3 = Math.ceil(this.getAV(para) / corr - 5);
        const step2 = 100 * step3 / level;
        const step1 = Math.ceil(step2 - 2 * this.bs - this.iv);
        let result = Math.max(0, 4 * step1);
        return Math.min(252, result);
    }
}
class RegisterStatus {
    constructor() {
        this.hp = new RegisterHitPoint();
        this.atk = new RegisterFiveStatus();
        this.def = new RegisterFiveStatus();
        this.spA = new RegisterFiveStatus();
        this.spD = new RegisterFiveStatus();
        this.spe = new RegisterFiveStatus();
    }
    setMaster(master) {
        this.hp.bs = master.baseStatus.hp;
        this.atk.bs = master.baseStatus.atk;
        this.def.bs = master.baseStatus.def;
        this.spA.bs = master.baseStatus.spA;
        this.spD.bs = master.baseStatus.spD;
        this.spe.bs = master.baseStatus.spe;
    }
    show() {
        this.hp.show('hitPoint');
        this.atk.show('attack');
        this.def.show('defense');
        this.spA.show('specialAttack');
        this.spD.show('specialDefense');
        this.spe.show('speed');
    }
    setIVs() {
        this.hp.iv = Number(getHTMLInputElement('register_hitPointIndividualValue').value);
        this.atk.iv = Number(getHTMLInputElement('register_attackIndividualValue').value);
        this.def.iv = Number(getHTMLInputElement('register_defenseIndividualValue').value);
        this.spA.iv = Number(getHTMLInputElement('register_specialAttackIndividualValue').value);
        this.spD.iv = Number(getHTMLInputElement('register_specialDefenseIndividualValue').value);
        this.spe.iv = Number(getHTMLInputElement('register_speedIndividualValue').value);
    }
    isChangableAV(level, nature) {
        const hp = this.hp.calcEffort('hitPoint', level);
        const atk = this.atk.calcEffort('attack', level, nature.atk);
        const def = this.def.calcEffort('defense', level, nature.def);
        const spA = this.spA.calcEffort('specialAttack', level, nature.spA);
        const spD = this.spD.calcEffort('specialDefense', level, nature.spD);
        const spe = this.spe.calcEffort('speed', level, nature.spe);
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
        this.hp.ev = Number(getHTMLInputElement('register_hitPointEffortValue').value);
        this.atk.ev = Number(getHTMLInputElement('register_attackEffortValue').value);
        this.def.ev = Number(getHTMLInputElement('register_defenseEffortValue').value);
        this.spA.ev = Number(getHTMLInputElement('register_specialAttackEffortValue').value);
        this.spD.ev = Number(getHTMLInputElement('register_specialDefenseEffortValue').value);
        this.spe.ev = Number(getHTMLInputElement('register_speedEffortValue').value);
    }
    setAVs(level, nature) {
        if (!this.isChangableAV(level, nature))
            return;
        this.hp.ev = this.hp.calcEffort('hitPoint', level);
        this.atk.ev = this.atk.calcEffort('attack', level, nature.atk);
        this.def.ev = this.def.calcEffort('defense', level, nature.def);
        this.spA.ev = this.spA.calcEffort('specialAttack', level, nature.spA);
        this.spD.ev = this.spD.calcEffort('specialDefense', level, nature.spD);
        this.spe.ev = this.spe.calcEffort('speed', level, nature.spe);
    }
    copy(stat) {
        this.hp.copy(stat.hp);
        this.atk.copy(stat.atk);
        this.def.copy(stat.def);
        this.spA.copy(stat.spA);
        this.spD.copy(stat.spD);
        this.spe.copy(stat.spe);
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
    isValidName(slot) {
        // 適切な名前でなければ処理なし
        const nameEN = this.translate(getHTMLInputElement('registerMoveName' + slot).value);
        return moveTextList.filter(name => name === nameEN);
    }
    select(nameEN) {
        const master = this.getMoveMaster(nameEN);
        this._name = nameEN;
        this._type = master.type;
        this._power = master.power;
        this._accuracy = master.accuracy;
        this._powerPoint = master.powerPoint;
        this._basePP = master.powerPoint;
    }
    addPP() {
        if (this._name === null)
            return;
        if (this._powerPoint === 1)
            return;
        const step = this._basePP / 5;
        const max = this._basePP + step * 3;
        this._powerPoint = Math.min(max, this._powerPoint + step);
    }
    subPP() {
        if (this._name === null)
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
        this._name = move.name;
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
            for (const move of master.move.sort()) {
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
        this._value = null;
        this._list = [];
    }
    get value() {
        return this._value;
    }
    set value(ability) {
        this._value = ability;
    }
    isValidName() {
        // 適切な名前でなければ処理なし
        const nameEN = this.translate(getHTMLInputElement('register_name').value);
        return abilityTextList.filter(name => name === nameEN);
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
        const abilityList = [];
        for (const ability of master.ability) {
            const nameEN = abilityTextList.filter(name => name === ability);
            if (nameEN.length === 0)
                continue;
            abilityList.push(nameEN[0]);
        }
        this._list = abilityList;
        this._value = abilityList[0];
    }
    setHTML() {
        const abilityHTML = getHTMLInputElement('register_ability');
        abilityHTML.innerHTML = '';
        for (const ability of this._list) {
            const option = document.createElement('option');
            option.value = this.translate(String(ability));
            option.textContent = this.translate(String(ability));
            abilityHTML.appendChild(option);
        }
    }
    set(ability) {
        this._value = ability;
    }
    show() {
        const abilityHTML = getHTMLInputElement('register_ability');
        abilityHTML.value = this.translate(String(this._value));
    }
}
class Register {
    constructor() {
        this._id = 0;
        this._name = null;
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
        this._name = null;
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
    translateNatureToJA(name) {
        return natureMaster.filter(m => m.nameEN === name)[0].nameJA;
    }
    translateNatureToEN(name) {
        return natureMaster.filter(m => m.nameJA === name)[0].nameEN;
    }
    isValidName() {
        // 適切な名前でなければ処理なし
        const nameEN = this.translateName(getHTMLInputElement('register_name').value);
        return pokemonTextList.filter(name => name === nameEN);
    }
    setName(nameEN) {
        this.reset();
        this.setMaster(nameEN);
        this.calculateActualValue();
        this.setHTML();
    }
    setMaster(name) {
        const pokemon = this.getPokemonMaster(name);
        this._id = pokemon.id;
        this._name = name;
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
        return this._name === null;
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
        getHTMLInputElement('register_name').value = this.translateName(String(this._name));
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
