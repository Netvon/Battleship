export default class Observable {
    constructor(value = null) {
        this._v = value;
        this._observers = [];
    }

    get $value() {
        return this._v;
    }

    set $value(value) {

        if (this._v === value)
            return;

        let args = {oldValue: this._v, newValue: value};
        this._v = value;

        this._observers.forEach(observer => observer(args));
    }

    /**
     *
     * @param observer {function}
     */
    addObserver(observer) {
        this._observers.push(observer);
    }
}