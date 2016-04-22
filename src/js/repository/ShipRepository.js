const BattleshipApi = require('./../util/BattleshipApi.js');
var Ship = require('./../model/Ship.js');

function ShipRepository(api) {
    if (api instanceof BattleshipApi)
        this.api = api;
    else
        throw new Error('ShipRepository needs BattleshipApi to work');
}

ShipRepository.prototype = {
    loadShips: function (callback) {
        if (this.api === undefined || this.api === null)
            return;

        this.api.get({route: this.api.routes.allShips}, function (data) {
            var ships = [];

            data.forEach(function (jsonShip) {
                var ship = new Ship(jsonShip._id, jsonShip.name, jsonShip.length);

                ships.push(ship);
            });

            callback(ships);
        });
    }
};

module.exports = ShipRepository;