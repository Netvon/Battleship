import Ship from './Ship';
import Cell from './../Cell';

export default class GameboardShip extends Ship {
    /**
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
     *
     * @returns {boolean}
     */
    get isVertical() {
        return this.orientation === 'vertical';
    }

    get x() {
        return this.startCell.x;
    }

    get y() {
        return this.startCell.y;
    }

    /**
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

    static fromJson(jsonObject) {
        let hits = [];
        jsonObject.hits.forEach(hit => {
           hits.push(Cell.fromJson(hit));
        });

        return new GameboardShip(jsonObject._id,
            jsonObject.name,
            jsonObject.length,
            Cell.fromJson(jsonObject.startCell),
            GameboardShip.orientationFromJson(jsonObject),
            hits
        );
    }

    static orientationFromJson(jsonObject)
    {
        if(jsonObject.isVertical)
            return 'vertical';

        return 'horizontal';
    }
}