export default class Observable {
    constructor(propertyName = 'none', defaultValue = null) {
        this._v = defaultValue;
        this._observers = new Map();
        this._name = propertyName;
    }

    get $value() {
        return this._v;
    }

    get $name() {
        return this._name;
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
     * @param id {string}
     * @param observer {function}
     */
    addObserver(id, observer) {
        this._observers.set(id, observer);
    }

    /**
     *
     * @param id {string}
     */
    removeObserver(id) {
        // console.log(`Removed observer '${id}' from '${this.$name}'`);
        this._observers.delete(id);
    }
}