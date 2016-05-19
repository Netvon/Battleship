export default class Ship {
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