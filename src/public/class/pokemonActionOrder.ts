class ActionOrder {
  _raise: boolean;
  _lower: boolean;
  _ahead: boolean;
  _later: boolean;

  constructor() {
    this._raise = false;
    this._lower = false;
    this._ahead = false;
    this._later = false;
  }

  set raise( raise: boolean ) {
    this._raise = raise;
  }
  set lower( lower: boolean ) {
    this._lower = lower;
  }
  set ahead( ahead: boolean ) {
    this._ahead = ahead;
  }
  set later( later: boolean ) {
    this._later = later;
  }

  get raise(): boolean {
    return this._raise;
  }
  get lower(): boolean {
    return this._lower;
  }
  get ahead(): boolean {
    return this._ahead;
  }
  get later(): boolean {
    return this._later;
  }

  reset(): void {
    this._raise = false;
    this._lower = false;
    this._ahead = false;
    this._later = false;
  }
}


