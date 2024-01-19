"use strict";
class ActionOrder {
    constructor() {
        this._raise = false;
        this._lower = false;
        this._ahead = false;
        this._later = false;
    }
    set raise(raise) {
        this._raise = raise;
    }
    set lower(lower) {
        this._lower = lower;
    }
    set ahead(ahead) {
        this._ahead = ahead;
    }
    set later(later) {
        this._later = later;
    }
    get raise() {
        return this._raise;
    }
    get lower() {
        return this._lower;
    }
    get ahead() {
        return this._ahead;
    }
    get later() {
        return this._later;
    }
    reset() {
        this._raise = false;
        this._lower = false;
        this._ahead = false;
        this._later = false;
    }
}
