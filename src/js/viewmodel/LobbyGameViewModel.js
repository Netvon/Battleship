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

    }

    draw() {
        let template = `<li id="lobby-g-${this.userGame.id}" title="Playing against '${this.userGame.enemyName}'">
<ul role="button" class="bs-lobby-list-item" data-gid="${this.userGame.id}">
    <li class="bs-lobby-list-item-li"><i class="fa fa-refresh fa-spin"></i></li>
    <li class="bs-lobby-list-item-id"><small class="game-id">${this.userGame.id}</small></li>
    <li class="bs-lobby-list-item-vs">${this.userGame.enemyName}</li>
    <li class="bs-lobby-list-item-state"><small id="lobby-g-${this.userGame.id}-state">${this.userGame.state}</small></li>
    <li class="bs-lobby-list-item-turn"><small></small></li>
    <li class="bs-lobby-list-item-go"><i class="fa fa-chevron-circle-right"></i></li>
</ul>
</li>`;

        this.parent.append(template);
        this.observe();
    }

    observe() {

        let checkStarted = () => {

            this.loading = true;

            // console.log(this.userGame.state);

            if (this.userGame.state === STATE.STARTED) {
                StaredGame.get(this.api, this.userGame.id)
                    .then(startedGame => {
                        let g_el = $(`#lobby-g-${this.userGame.id}`)
                            .find(`.bs-lobby-list-item`)
                            .find('.bs-lobby-list-item-turn small');

                        if (startedGame.isPlayerTurn)
                            g_el.text('Your turn!');
                        else
                            g_el.text('Not your turn');

                        this.loading = false;
                    }).catch(this.onError.bind(this));
            }
            else{
                this.loading = false;

            }
        };

        checkStarted();

        this.userGame.onUpdate(this.api, () => {
            $(`#lobby-g-${this.userGame.id}-state`).text(this.userGame.state);

            checkStarted();
        });


    }

    set loading(value) {
        super.loading = value;


        if(this.userGame !== undefined) {
            // console.log(`ID: ${this.userGame.id} - ${super.loading}`);

            let item = $(`#lobby-g-${this.userGame.id}`)
                .find('.bs-lobby-list-item-li');

            // console.log(item);

            if (super.loading) {
                item.show();
            }
            else {
                item.hide();
            }
        }
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