import Gameboard from './Gameboard';
import GameboardShip from './../ships/GameboardShip';
import Shot from "../Shot";

export default class PlayerGameboard extends Gameboard {
    /**
     * Constructs a new instance of the PlayerGameboard class
     *
     * @param id {number}
     * @param shots
     * @param ships
     */
    constructor(id, shots, ...ships) {
        super(...ships);

        this.id = id;
        this.shots = shots;
    }

    placeShip(ship, cell, orientation) {
        throw new Error("You cannot place a ship on a PlayerGameboard");
    }

    canPlaceShip(ship, cell, orientation) {
        return false;
    }

    static fromJson(jsonObject) {
        let ships = [];
        let _shots = [];

        jsonObject.ships.forEach(ship => {
            ships.push(GameboardShip.fromJson(ship));
        });

        jsonObject.shots.forEach(shot => {
            _shots.push(Shot.fromJson(shot));
        });

        return new PlayerGameboard(jsonObject._id, _shots, ...ships);
    }
}