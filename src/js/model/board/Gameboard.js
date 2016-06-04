import JsonBase from './../../util/JsonBase';
import GameboardShip from './../ships/GameboardShip';

export default class Gameboard extends JsonBase {
    /**
     *
     * @param ships {GameboardShip}
     */
    constructor(...ships) {
        super();

        this.ships = [...ships];

        if (this.ships.length > 5)
            throw new Error("A Gameboard must contain 5 ships");
    }

    /**
     * Converts this object to JSON
     *
     * @returns {{ships: Array}}
     */
    toJson() {
        let temp = [];

        this.ships.forEach(ship => {
            temp.push(ship.toJson());
        });

        return {
            "ships": temp
        }
    }

    /**
     * Checks if all Ships fit on the Gameboard
     *
     * @returns {boolean}
     */
    get isValid() {
        let max = 10;

        for (let ship of this.ships) {
            let x = ship.x;
            let y = ship.y;

            if ((ship.isVertical && (y + ship.length) > max) ||
                (!ship.isVertical && (x + ship.length) > max))
                return false;
        }
    }

    /**
     *
     * @param ship {Ship}
     * @param cell {Cell}
     * @param orientation {string}
     */
    placeShip(ship, cell, orientation) {

        if(this.canPlaceShip(ship, cell, orientation))
            this.ships.push(GameboardShip.fromShip(ship, cell, orientation));
        else
            throw new Error(`The ship '${ship.name}' cannot be placed on {x:${cell.x}, y:${cell.y}}`);

    }

    /**
     *
     *
     * @param ship {Ship}
     * @param cell {Cell}
     * @param orientation {string}
     * @returns {boolean}
     */
    canPlaceShip(ship, cell, orientation) {

        if(this.ships.length >= 5)
            return false;

        let xmin, ymin, xmax, ymax;

        if (orientation === 'vertical') {
            xmin = xmax = cell.x;
            ymin = cell.y;
            ymax = ymin + ship.length;

        } else if (orientation === 'horizontal') {
            xmin = cell.x;
            xmax = xmin + ship.length;

            ymin = ymax = cell.y;
        }

        // console.log(this.ships);
        // console.log(`${xmin}|${xmax}|${ymin}|${ymax}`);

        for (let placedShip of this.ships) {
            if((placedShip.x >= xmin && placedShip.x <= xmax) &&
               (placedShip.y >= ymin && placedShip.y <= ymax))
                return false;
        }

        return true;
    }
}