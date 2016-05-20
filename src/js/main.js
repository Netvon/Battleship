import BattleshipApi from './util/BattleshipApi';
import ShipRepository from './repository/ShipRepository';
import ShipViewModel from './viewmodel/ShipViewModel';
import Hu from './util/Hu';

var battleshipApi = new BattleshipApi('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InRtZS52YW5uaW13ZWdlbkBzdHVkZW50LmF2YW5zLm5sIg.4yuhuKWBCnQuoxAeVL2xQ3Ua41YPLRqT7F8FkhxUcKI');

var sRepo = new ShipRepository(battleshipApi);
sRepo.loadShips(ships => {
    console.log(ships);
    
    ships.forEach(ship => {
        console.log(ship);
        console.log(ShipViewModel.fromShip(ship, {x: 'a', y: 2}, 'vertical', null));

        Hu.queryAppend('ul#ship-list', `<li>${ship.name}</li>`);
    });
});