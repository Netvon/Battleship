import Ship from './Ship';
import Cell from './../Cell';

export default class GameboardShip extends Ship {
    /**
     * Constructs a new instance of the GameboardShip class
     *
     * @param id {id|string}
     * @param name {string}
     * @param length {number}
     * @param startCell {Cell}
     * @param orientation {string}
     * @param hits {null|Array}
     */
    constructor(id, name, length, startCell, orientation, hits = null) {
        super(id, name, length);

        this.startCell = startCell;

        if (!GameboardShip.isValidOrientation(orientation))
            throw new Error(`The orientation: '${orientation}' is not a valid orientation`);

        this.orientation = orientation.toLowerCase();
        this.hits = hits;
    }

    /**
     * Checks if the orientation of this Ship is vertical
     *
     * @returns {boolean}
     */
    get isVertical() {
        return this.orientation === 'vertical';
    }

    /**
     * Returns the X coordinate in number form
     *
     * @returns {number}
     */
    get x() {
        return this.startCell.x;
    }

    /**
     * Returns the Y coordinate in number form
     *
     * @returns {number}
     */
    get y() {
        return this.startCell.y;
    }

    /**
     * Constructs a new instance of the GameboardShip class user a Ship
     *
     * @param ship {Ship}
     * @param startCell {Cell}
     * @param orientation {string}
     * @param hits {null|Array}
     * @returns GameboardShip
     */
    static fromShip(ship, startCell, orientation, hits = null) {
        return new GameboardShip(ship.id, ship.name, ship.length, startCell, orientation, hits);
    }

    /**
     * Checks if a orientation string is valid.
     * Valid values are:
     *  - vertical
     *  - horizontal
     *
     * @param orientation {string}
     * @returns {boolean}
     */
    static isValidOrientation(orientation) {
        switch (orientation.toLowerCase()) {
            case 'vertical':
            case 'horizontal':
                return true;
        }

        return false;
    }

    /**
     * Converts this object to JSON
     *
     * @returns {{_id: (*|number|string), length: (*|number), name: (*|string), startCell: ({x, y}|{x: (string|*), y: (number|*)}), isVertical: boolean}}
     */
    toJson() {
        return {
            "_id": this.id,
            "length": this.length,
            "name": this.name,
            "startCell": this.startCell.toJson(),
            "isVertical": this.isVertical
        }
    }

    /**
     * Converts a Json Object to a new instance of the GameboardShip class
     * 
     * @param jsonObject
     * @returns {GameboardShip}
     */
    static fromJson(jsonObject) {
        let hits = [];
        jsonObject.hits.forEach(hit => {
           hits.push(Cell.fromJson(hit));
        });

        let orientation = 'horizontal';
        if(jsonObject.isVertical)
            orientation =  'vertical';

        return new GameboardShip(jsonObject._id,
            jsonObject.name,
            jsonObject.length,
            Cell.fromJson(jsonObject.startCell),
            orientation,
            hits
        );
    }
}