'use strict';

import BattleshipApi from './util/BattleshipApi';
import Persistence from './util/Persistence';
import TitleScreenViewModel from "./viewmodel/TitleScreenViewModel";
import PlayerGameboardViewModel from './viewmodel/PlayerGameboardViewModel';
import Cell from './model/Cell';
import UserGameViewModel from "./viewmodel/UserGameViewModel";
import SoundFXViewModel from './viewmodel/SoundFXViewModel';

(function () {

    // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InNlZS5ncmFuZGlhQHN0dWRlbnQuYXZhbnMubmwi.DtPnllHeZKqv_lM7evo72TyJWpSOELFunRs4myKHMHA
    // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InRtZS52YW5uaW13ZWdlbkBzdHVkZW50LmF2YW5zLm5sIg.4yuhuKWBCnQuoxAeVL2xQ3Ua41YPLRqT7F8FkhxUcKI

    if (!Persistence.hasKey('token'))
        Persistence.set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InNlZS5ncmFuZGlhQHN0dWRlbnQuYXZhbnMubmwi.DtPnllHeZKqv_lM7evo72TyJWpSOELFunRs4myKHMHA');

    let token = Persistence.get('token');
    let battleshipApi = new BattleshipApi(token);

    // let titleVM = new TitleScreenViewModel(battleshipApi);
    // titleVM.addTo('body');

    // var battleshipApi = new BattleshipApi(token);
    //
    // UserGameViewModel.getForCurrentUser(battleshipApi, games => games.forEach(game => console.log(game.enemyId)));
    //
    let playerGameboardVM = new PlayerGameboardViewModel();
    playerGameboardVM.addTo('body');
    
    // userGameViewModel.showGames();

    // UserViewModel.getCurrent(battleshipApi, user => user.displayOn('#user-info'));
    
    // SetupGame.deleteAll(battleshipApi, e => {
    //
    //     Ship.getAll(battleshipApi, ships => {
    //
    //         allShips = ships;
    //
    //         ships.forEach(ship => Hu.queryAppend('ul#ship-list', `<li>${ship.name}</li>`));
    //
    //         SetupGame.create(battleshipApi, game => {
    //             console.log(`Created new game: ${game.id}`);
    //             UserViewModel.getGames(battleshipApi, games => {
    //                 games.forEach(g => Hu.queryAppend('#all-games > ul', `<li id="g-${g.id}">${g.id} - ${g.state}</li>`));
    //             });
    //
    //             let gameboard = new Gameboard();
    //             gameboard.placeShip(allShips[0], new Cell(1, 1), 'vertical');
    //             gameboard.placeShip(allShips[1], new Cell(2, 1), 'vertical');
    //             gameboard.placeShip(allShips[2], new Cell(3, 1), 'vertical');
    //             gameboard.placeShip(allShips[3], new Cell(4, 1), 'vertical');
    //             gameboard.placeShip(allShips[4], new Cell(5, 1), 'vertical');
    //
    //             game.submitGameboard(battleshipApi, gameboard, data => {
    //                 console.log("Submitted Gameboard");
    //                 console.log(data);
    //
    //                 Hu.querySet(`#g-${game.id}`, `${game.id} - ${game.state}`);
    //
    //                 data.doShot(battleshipApi, new Cell(1, 1), data => console.log(`Shot output: ${data}`));
    //             });
    //
    //         }, true);
    //     });
    //
    //
    // });
}());


