import JsonBase from '../../util/JsonBase'

export default class Ship extends JsonBase {
    /**
     * Constructs a new instance of the Ship class
     *
     * @param id {number|string}
     * @param name {string}
     * @param length {number}
     */
    constructor(id, name, length) {
        super();
        
        this.name = name;
        this.id = id;
        this.length = length;
    }

    /**
     *
     * @param api {BattleshipApi}
     * @param callback {function}
     */
    static getAll(api, callback) {
        if (api === undefined || api === null)
            throw new Error("The 'api' parameter on Ship.getAll cannot be null");

        if (callback === undefined || callback === null || typeof callback !== 'function')
            throw new Error("The 'callback' parameter on Ship.getAll has to be a function");

        api.apiGet({route: api.routes.allShips}, function (data) {
            let ships = [];

            data.forEach(jsonShip => {
                ships.push(Ship.fromJson(jsonShip));
            });

            callback(ships);
        });
    }

    /**
     * Converts this object to JSON
     *
     * @returns {{_id: (number|string|*), name: (string|*), length: (number|*)}}
     */
    toJson() {
        return {
            "_id": this.id,
            "name": this.name,
            "length": this.length
        };
    }

    /**
     * Converts a JSON object to a Ship
     * 
     * @param jsonObject {{_id: (number|*), name: (string|*), length: (number|*)}}
     * @returns {Ship}
     */
    static fromJson(jsonObject) {
        return new Ship(jsonObject._id,
            jsonObject.name,
            jsonObject.length);
    }
}