import Gameboard from './Gameboard';
import GameboardShip from './../ships/GameboardShip';

export default class PlayerGameboard extends Gameboard {
    /**
     * Constructs a new instance of the PlayerGameboard class
     *
     * @param id {number}
     * @param ships
     */
    constructor(id, ...ships) {
        super(...ships);

        this.id = id;
    }

    placeShip(ship, cell, orientation) {
        throw new Error("You cannot place a ship on a PlayerGameboard");
    }

    canPlaceShip(ship, cell, orientation) {
        return false;
    }

    static fromJson(jsonObject) {
        let ships = [];

        jsonObject.ships.forEach(ship => {
            ships.push(GameboardShip.fromJson(ship));
        });

        return new PlayerGameboard(jsonObject._id, ...ships);
    }
}