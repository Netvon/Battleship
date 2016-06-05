export default class Persistence {
    /**
     * Returns a stored value from the local storage.
     *
     * @param key {string}
     */
    static get(key) {
        if (typeof(Storage) === "undefined")
            throw new Error("Local storage is not supported.");

        return localStorage.getItem(key);
    }

    /**
     * Sets a value in the local storage
     *
     * @param key {string}
     * @param value {*}
     */
    static set(key, value) {
        if (typeof(Storage) === "undefined")
            throw new Error("Local storage is not supported.");

        localStorage.setItem(key, value);
    }

    /**
     * Removes a key from the local storage
     *
     * @param key {string}
     */
    static remove(key){
        if (typeof(Storage) === "undefined")
            throw new Error("Local storage is not supported.");

        localStorage.removeItem(key);
    }

    /**
     * Checks if a given key exists in the Local Storage
     * 
     * @param key {string}
     * @returns {boolean}
     */
    static hasKey(key) {
        if (typeof(Storage) === "undefined")
            throw new Error("Local storage is not supported.");

        return localStorage.getItem(key) !== null;
    }
}