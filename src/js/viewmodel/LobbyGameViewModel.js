/**
 * Created by Sander on 07-06-16.
 */
import ViewModel from "./ViewModel";
import {STATE} from "../util/BattleshipConst";
import StaredGame from "../model/games/StartedGame";
import UserGame from "../model/games/UserGame";

export default class LobbyGameViewModel extends ViewModel {
    constructor(api, userGame) {
        super(api, `vm-usergame-${userGame.id}`);

        this.userGame = userGame;

    }

    draw() {
        let template = `<li id="lobby-g-${this.userGame.id}" data-state="${this.userGame.state}" title="Playing against '${this.userGame.enemyName}'">
<ul role="button" class="bs-lobby-list-item" data-gid="${this.userGame.id}" data-state="${this.userGame.state}">
    <li class="bs-lobby-list-item-li"><i class="fa fa-refresh fa-spin"></i></li>
    <li class="bs-lobby-list-item-id"><small class="game-id">${this.userGame.id}</small></li>
    <li class="bs-lobby-list-item-vs" id="lobby-g-${this.userGame.id}-vs">${this.userGame.enemyName}</li>
    <li class="bs-lobby-list-item-state"><small id="lobby-g-${this.userGame.id}-state">${this.userGame.state}</small></li>
    <li class="bs-lobby-list-item-turn"><small></small></li>
    <li class="bs-lobby-list-item-go"><i class="fa fa-chevron-circle-right"></i></li>
</ul>
</li>`;

        this.parent.append(template);
        this.observe();
    }
    
    destroy() {
        this.api.removeOn(this.name, 'update');
        this.api.removeOn(this.name, 'turn');
    }

    observe() {

        let checkStarted = () => {

            this.loading = true;

            let el = $(`#lobby-g-${this.userGame.id}`);

            el.find('bs-lobby-list-item')
              .attr('data-state', this.userGame.state);


            if (this.userGame.state === STATE.QUEUE) {
                $(`#lobby-g-${this.userGame.id}-vs`).text('Searching for opponent ...');
                el.attr('title', 'Searching for opponent ...');
            }

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
            else if (this.userGame.state === STATE.SETUP && this.userGame.enemyName === undefined) {
                UserGame.get(this.api, this.userGame.id)
                    .then(userGame => {
                        $(`#lobby-g-${userGame.id}-state`).text(userGame.state);
                        $(`#lobby-g-${userGame.id}-vs`).text(userGame.enemyName);
                        el.attr('title', `Playing against '${userGame.enemyName}'`);
                        el.attr('data-state', userGame.state);
                        el.find('.bs-lobby-list-item-go').show();

                        this.loading = false;
                    }).catch(this.onError.bind(this));
            }
            else {
                this.loading = false;
            }
        };

        checkStarted();

        this.userGame.onUpdate(this.name, this.api, () => {

            // console.log(`[${this.userGame.id}] I got updated`);
            // console.log(this.userGame.state);

            checkStarted();
        });

        this.userGame.onTurn(this.name, this.api, () => {

            // console.log(`[${this.userGame.id}] I got updated`);
            // console.log(this.userGame.state);

            checkStarted();
        });


    }

    set loading(value) {
        super.loading = value;


        if (this.userGame !== undefined) {
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
}