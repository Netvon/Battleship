import JsonBase from '../../util/JsonBase'
import Persistence from '../../util/Persistence';
import * as bs from '../../util/BattleshipConst';

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

        if (typeof id !== 'number' && typeof id !== 'string')
            throw new Error(`The ID of a Ship must be a number or a string: ID ${id}`);
        if (typeof name !== 'string')
            throw new Error(`The name of a Ship must be a string: name ${name}`);
        if (typeof length !== 'number' || length < 0)
            throw new Error(`The length of a Ship cannot be negative and must be a number: length ${length}`);

        this.name = name;
        this.id = id;
        this.length = length;
    }

    /**
     * Returns an Array of all Ship available to the User
     *
     * @param api {BattleshipApi}
     * @param callback {function}
     */
    static getAll(api, callback) {

        let processShips = data => {
            Persistence.set(bs.PER_SHIPSKEY, JSON.stringify(data));

            let ships = [];

            data.forEach(jsonShip => {
                ships.push(Ship.fromJson(jsonShip));
            });

            callback(ships);
        };

        if (Persistence.hasKey(bs.PER_SHIPSKEY)) {
            // console.log('Loading Ships from storage');
            let json = Persistence.get(bs.PER_SHIPSKEY);
            processShips(JSON.parse(json));
        }
        else {
            if (api === undefined || api === null)
                throw new Error("The 'api' parameter on Ship.getAll cannot be null");

            if (typeof callback !== 'function')
                throw new Error("The 'callback' parameter on Ship.getAll has to be a function");

            api.apiGet({route: api.routes.allShips}, data => {
                processShips(data);
            });
        }
    }

    /**
     * Get the bounds of this Ship
     * 
     * @param cell {Cell}
     * @param orientation {string}
     * @returns {{xmin: number, ymin: number, xmax: number, ymax: number}}
     */
    bounds(cell, orientation) {
        let xmin, ymin, xmax, ymax;

        if (orientation === bs.VERTICAL) {
            xmin = xmax = cell.x;
            ymin = cell.y;
            ymax = (ymin + this.length) - 1;

        } else if (orientation === bs.HORIZONTAL) {
            xmin = cell.x;
            xmax = (xmin + this.length) - 1;

            ymin = ymax = cell.y;
        }

        // console.log(`length: ${this.length} - xmin:${xmin}|xmax:${xmax}|ymin:${ymin}|ymax:${ymax}`);

        return {xmin, ymin, xmax, ymax};
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