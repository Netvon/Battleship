import JsonBase from './../util/JsonBase';
import * as bs from '../util/BattleshipConst';

export default class Cell extends JsonBase {
    /**
     * Constructs a new instance of the Cell class
     *
     * @param x {number|string}
     * @param y {number}
     */
    constructor(x, y) {
        super();

        if (typeof(x) === 'number')
            x = String.fromCharCode((x - 1) + bs.CHARSTART);

        this._x = x.toLowerCase();
        this._y = y;

        // console.log(`{x: ${this.x}, y: ${this.y}}`);

        if (this.x < bs.CELLMIN || this.x > bs.CELLMAX)
            throw new RangeError(`The X coordinate on a Cell must be between ${bs.CELLMIN} and ${bs.CELLMAX} is ${x}`);

        if (this.y < bs.CELLMIN || this.y > bs.CELLMAX)
            throw new RangeError(`The Y coordinate on a Cell must be between ${bs.CELLMIN} and ${bs.CELLMAX} is ${y}`);
    }

    /**
     * Returns the X coordinate in number form
     *
     * @returns {number}
     */
    get x() {
        return (this._x.charCodeAt(0) - bs.CHARSTART ) + 1;
    }

    /**
     * Returns the X coordinate in letter form
     *
     * @returns {string}
     */
    get xLetter() {
        return this._x;
    }

    /**
     * Returns the Y coordinate in number form
     *
     * @returns {number}
     */
    get y() {
        return this._y;
    }

    /**
     * Converts this object to JSON
     *
     * @returns {{x: (string|*), y: (number|*)}}
     */
    toJson() {
        return {
            "x": this._x,
            "y": this._y
        };
    }

    /**
     * Converts a JSON object to a Cell
     *
     * @param jsonObject {{x: (string|*), y: (number|*)}}
     * @returns {Cell}
     */
    static fromJson(jsonObject) {
        return new Cell(jsonObject.x, jsonObject.y);
    }
}