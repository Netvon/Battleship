/**
 * Created by Sander on 07-06-16.
 */
import ViewModel from "./ViewModel";
import {STATE} from "../util/BattleshipConst";
import StaredGame from "../model/games/StartedGame";

export default class LobbyGameViewModel extends ViewModel {
    constructor(api, userGame) {
        super(api, `vm-usergame-${userGame.id}`);

        this.userGame = userGame;

        this.observe();
    }

    draw() {
        let template = `<li id="lobby-g-${this.userGame.id}">
<ul class="bs-lobby-list-item">
    <li class="bs-lobby-list-item-id"><small class="game-id">${this.userGame.id}</small></li>
    <li class="bs-lobby-list-item-vs">Tegen: '${this.userGame.enemyName}'</li>
    <li class="bs-lobby-list-item-state"><small id="lobby-g-${this.userGame.id}-state">${this.userGame.state}</small></li>
</ul>
</li>`;

        this.parent.append(template);
    }

    observe() {

        let checkStarted = () => {
            if (this.userGame.state === STATE.STARTED) {
                StaredGame.get(this.api, this.userGame.id)
                    .then(startedGame => {
                        let g_el = $(`#lobby-g-${this.userGame.id}`).find(`.bs-lobby-game`);
                        if (startedGame.isPlayerTurn)
                            g_el.append('<li><small>Jouw beurt</small></li>');
                        else
                            g_el.append('<li><small>Niet jouw beurt</small></li>');
                    }).catch(this.onError.bind(this));
            }
        };

        checkStarted();

        this.userGame.onUpdate(this.api, () => {
            $(`#lobby-g-${this.userGame.id}-state`).text(this.userGame.state);

            checkStarted();
        });


    }

    showGames() {
        // console.log(this);

        // $('.menu-hero').on('click', '#resume-game', function () {
        //     $('.bs-hero-menu').hide();
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