class ExtraParameter {
  landing = false; // 場に出た時
  zeroToHero = false; // 特性「マイティチェンジ」

  onLanding(): void {
    this.landing = true;
  }

  onLanded(): void {
    this.landing = false;
  }
}
