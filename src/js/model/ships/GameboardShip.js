import Ship from './Ship';
import Cell from './../Cell';
import * as bs from '../../util/BattleshipConst';

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

        if (!(startCell instanceof Cell))
            throw new Error('The startCell of a GameboardShip must be of type Cell');
        if (typeof orientation !== 'string')
            throw new Error('The orientation of a GameboardShip must be a string');

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
        return this.orientation === bs.VERTICAL;
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
            case bs.VERTICAL:
            case bs.HORIZONTAL:
                return true;
        }

        return false;
    }

    /**
     * Get the bounds of this GameboardShip
     *
     * @param cell {Cell}
     * @param orientation {string}
     * @returns {{xmin, ymin, xmax, ymax}|{xmin: number, ymin: number, xmax: number, ymax: number}}
     */
    bounds(cell = this.startCell, orientation = this.orientation) {
        return super.bounds(cell, orientation);
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

        let orientation = bs.HORIZONTAL;
        if (jsonObject.isVertical)
            orientation = bs.VERTICAL;

        return new GameboardShip(jsonObject._id,
            jsonObject.name,
            jsonObject.length,
            Cell.fromJson(jsonObject.startCell),
            orientation,
            hits
        );
    }
}