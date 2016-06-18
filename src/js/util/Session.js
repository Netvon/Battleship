export default class Session {
    /**
     * Returns a stored value from the Session storage.
     *
     * @param key {string}
     */
    static get(key) {
        if (typeof(Storage) === "undefined")
            throw new Error("Session storage is not supported.");

        return sessionStorage.getItem(key);
    }

    /**
     * Sets a value in the Session storage
     *
     * @param key {string}
     * @param value {*}
     */
    static set(key, value) {
        if (typeof(Storage) === "undefined")
            throw new Error("Session storage is not supported.");

        sessionStorage.setItem(key, value);
    }

    /**
     * Removes a key from the Session storage
     *
     * @param key {string}
     */
    static remove(key){
        if (typeof(Storage) === "undefined")
            throw new Error("Session storage is not supported.");

        sessionStorage.removeItem(key);
    }

    /**
     * Checks if a given key exists in the Session Storage
     *
     * @param key {string}
     * @returns {boolean}
     */
    static hasKey(key) {
        if (typeof(Storage) === "undefined")
            throw new Error("Session storage is not supported.");

        return sessionStorage.getItem(key) !== null;
    }
}