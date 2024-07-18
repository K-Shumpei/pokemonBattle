"use strict";
class ExtraParameter {
    constructor() {
        this.landing = false; // 場に出た時
        this.zeroToHero = false; // 特性「マイティチェンジ」
    }
    onLanding() {
        this.landing = true;
    }
    onLanded() {
        this.landing = false;
    }
}
