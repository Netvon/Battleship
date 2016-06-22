import JsonBase from './../../util/JsonBase';
import GameboardShip from './../ships/GameboardShip';
import * as bs from '../../util/BattleshipConst';

export default class Gameboard extends JsonBase {
    /**
     * Constructs a new instance of the Gameboard class
     *
     * @param ships {GameboardShip}
     */
    constructor(...ships) {
        super();

        this.ships = [...ships];
        
        if (this.ships.length > bs.SHIPMAX)
            throw new Error(`A Gameboard must contain ${bs.SHIPMAX} ships`);
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
        let shipMax = bs.SHIPMAX;
        let max = bs.CELLMAX;

        if (this.ships.length != shipMax) {
            return false;
        }

        for (let ship of this.ships) {
            let x = ship.x;
            let y = ship.y;

            if ((ship.isVertical && (y + ship.length - 1) > max) ||
                (!ship.isVertical && (x + ship.length - 1) > max)) {
                return false;
            }
        }

        return true;
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

        var find = this.ships.find(ps => ps.id === ship.id);

        if (this.ships.length >= bs.SHIPMAX || find !== undefined)
            return false;

        let shipBounds = ship.bounds(cell, orientation);

        if (shipBounds.xmax > bs.CELLMAX || shipBounds.xmin < bs.CELLMIN ||
            shipBounds.ymax > bs.CELLMAX || shipBounds.ymin < bs.CELLMIN)
            return false;

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