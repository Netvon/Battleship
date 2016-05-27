export default class Ship {
    /**
     * Constructs a new instance of the Ship class
     *
     * @param id {number}
     * @param name {string}
     * @param length {number}
     */
    constructor(id, name, length) {
        this.name = name;
        this.id = id;
        this.length = length;
    }

    jsonDecode(jsonObject) {
        this.id = jsonObject._id;
        this.name = jsonObject.name;
        this.length = jsonObject.length;
    }
}