import BattleshipApi from './../util/BattleshipApi.js';
import Ship from './../model/Ship.js';

export default class ShipRepository {
    constructor(api) {
        if (api instanceof BattleshipApi)
            this.api = api;
        else
            throw new Error('ShipRepository needs BattleshipApi to work');
    }

    loadShips(callback) {
        if (this.api === undefined || this.api === null)
            return;

        this.api.apiGet({route: this.api.routes.allShips}, function (data) {
            let ships = [];

            data.forEach(jsonShip => {
                let ship = new Ship(jsonShip._id, jsonShip.name, jsonShip.length);

                ships.push(ship);
            });

            callback(ships);
        });
    }
}