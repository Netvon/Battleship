/**
 * Created by Sander on 07-06-16.
 */
import UserGame from '../model/games/UserGame';
import UserViewModel from "./UserViewModel";
import Hu from "../util/Hu";

export default class UserGameViewModel extends UserGame {
    constructor(id, state, enemyId, enemyName, winner = null) {
        super(id, state, enemyId, enemyName, winner = null);
    }

    get gameRowHTML() {
        return `<tr id="g-${this.id}"><td>${this.id}</td><td>${this.state}</td></tr>`;

    }
    
    static getForCurrentUser(api, callback) {
        super.getForCurrentUser(api, userGame => {
            let userGameViewModel = new UserGameViewModel(userGame.id, userGame.state, userGame.enemyId, userGame.enemyName, userGame.winner);
            callback(userGameViewModel);
        });
    }
    
    showGames() {
        console.log(this);
        
        // $('.menu-hero').on('click', '#resume-game', function () {
        //     $('.menu-hero').hide();
        //
        //     Hu.queryAppend('header',
        //         `<table class="games-table">
        //         <th>game</th>
        //         <th>state</th>
        //     </table>`
        //     );
        //
        //     UserViewModel.getGames(battleshipApi, games => {
        //         games.forEach(g => {
        //             Hu.queryAppend('header > .games-table', `<tr id="g-${g.id}"><td>${g.id}</td><td>${g.state}</td></tr>`);
        //             $(`#g-${g.id}`).on('click', this, function () {
        //                 console.log(`Starting g-${g.id}...`);
        //             });
        //         });
        //     });
        // });
    }
}