import JsonBase from './../../util/JsonBase';
import GameboardShip from './../ships/GameboardShip';

export default class Gameboard extends JsonBase {
    /**
     * Constructs a new instance of the Gameboard class
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
     * Place a ship on the board.
     *
     * @param ship {Ship}
     * @param cell {Cell}
     * @param orientation {string}
     */
    placeShip(ship, cell, orientation) {

        if (this.canPlaceShip(ship, cell, orientation))
            this.ships.push(GameboardShip.fromShip(ship, cell, orientation));
        else
            throw new Error(`The ship '${ship.name}' cannot be placed on {x:${cell.x}, y:${cell.y}}`);
    }

    /**
     * Checks if a Cell can contain a given Ship
     *
     * @param ship {Ship}
     * @param cell {Cell}
     * @param orientation {string}
     * @returns {boolean}
     */
    canPlaceShip(ship, cell, orientation) {

        if (this.ships.length >= 5)
            return false;

        let shipBounds = ship.bounds(cell, orientation);

        if (shipBounds.xmax > 10 || shipBounds.ymax > 10)
            return false;

        // console.log(this.ships);

        for (let placedShip of this.ships) {

            let pShipBounds = placedShip.bounds();

            if (!(pShipBounds.xmin > shipBounds.xmax ||
                pShipBounds.xmax < shipBounds.xmin ||
                pShipBounds.ymin > shipBounds.ymax ||
                pShipBounds.ymax < shipBounds.ymin))
                return false;
        }

        return true;
    }
}