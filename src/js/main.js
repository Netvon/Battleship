import BattleshipApi from './util/BattleshipApi';
import ShipRepository from './repository/ShipRepository';

var battleshipApi = new BattleshipApi('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InRtZS52YW5uaW13ZWdlbkBzdHVkZW50LmF2YW5zLm5sIg.4yuhuKWBCnQuoxAeVL2xQ3Ua41YPLRqT7F8FkhxUcKI');

var sRepo = new ShipRepository(battleshipApi);
sRepo.loadShips(ships => {
    console.log(ships);
    console.log(ships[0].eentest);
});