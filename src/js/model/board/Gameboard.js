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
        let max = bs.CELLMAX;

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

        var find = this.ships.find(ps => ps.id === ship.id);

        if (this.ships.length >= bs.SHIPMAX || find !== undefined)
            return false;

        let shipBounds = ship.bounds(cell, orientation);

        if (shipBounds.xmax > bs.CELLMAX || shipBounds.ymax > bs.CELLMAX)
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
    
    drawGameboard() {
        $('.bs-hero-title').hide();
        $('.bs-hero-menu').hide();

        let html = ``;

        html += `<div class='gameboard'>`;
        html += `<table class='player-grid'>`;

        for (let y = bs.CELLMIN; y <= bs.CELLMAX; y++) {
            html += `<tr data-y="${y}">`;

            for (let x = bs.CELLMIN; x <= bs.CELLMAX; x++) {
                html += `<td data-x="${x}" data-y="${y}"></td>`;
            }

            html += `</tr>`;
        }

        html += `</table>`;

        html += `</div>`;

        // Replace by ship assets
        for (let i = 1; i <= bs.SHIPMAX; i++) {
            html += `<div class="test-block"></div>`;
        }

        $('header').append(html);

        $('.player-grid td').droppable({
                                        // accept:
                                        // function(d) {
                                        //     console.log(d, this);
                                        //     return true;
                                        // },
            drop: function(event, ui) {
            console.log(event.target);
        },  });
        $('.test-block').draggable({ revert: 'invalid', snap: '.player-grid td', snapMode: 'outer' });

        // $('header').append('<div class="player-grid">');
        // $('.player-grid').append('<table border="1">');
        //
        // for (let x = 1; x <= bs.CELLMAX; x++) {
        //     $('.player-grid').append(`<tr data-x="${x}">`);
        //     for (let y = 0; y <= bs.CELLMAX; y++) {
        //         $('.player-grid').append('<td>x</td>');
        //     }
        //     $('.player-grid').append(`</tr>`);
        // }
        //
        // $('.player-grid').append('</table>');
    }
}