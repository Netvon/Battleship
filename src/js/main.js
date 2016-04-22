const BattleshipApi = require('./util/BattleshipApi.js');
var ShipRepository = require('./repository/ShipRepository.js');

var battleshipApi = new BattleshipApi();

var sRepo = new ShipRepository(battleshipApi);
sRepo.loadShips(function(ships){
   console.log(ships);
});