import BattleshipApi from '../util/BattleshipApi'
import Ship from '../model/ships/Ship'
import UserGame from '../model/games/UserGame'
import UserViewModel from "./UserViewModel";
import {STATE} from '../util/BattleshipConst';
import StaredGame from "../model/games/StartedGame";
import ViewModel from './ViewModel';
import Observable from "./Observable";
import BSODViewModel from "./BSODViewModel";

export default class BSTestViewModel extends ViewModel {
    /**
     *
     * @param api {BattleshipApi}
     */
    constructor(api) {
        super(api, 'vm-bstest');

        this.token = new Observable(this.api.token);
        this.ships = new Observable();
        this.user = new Observable();
        this.games = new Observable();

        this.observe();
    }

    onError(reason, error, statusCode) {
        // console.log(error);
        // swal({
        //     title: "You broke it :(",
        //     text: `<p>An error occurred, please reload the page to try again.</p><code>${reason}</code>`,
        //     type: "error",
        //     html: true
        // });

        let bsod = new BSODViewModel(this.api, statusCode);
        bsod.addTo('body');

        this.loading = false;
    }

    load() {
        this.loading = true;

        Ship.getAll(this.api, ships => this.ships.$value = ships, this.onError.bind(this));
        UserViewModel.getCurrent(this.api, user => this.user.$value = user, this.onError.bind(this));
        UserGame.getForCurrentUser(this.api, games => {
            this.games.$value = games;
            this.loading = false;
        }, this.onError.bind(this));
    }

    draw() {
        let template =
            `<div id="${this.name}" class="bs-fill-page">
<code class="bs-console">
        Some information... 🎩
    </code>
    <input type="text" id="input-token" value="${this.token.$value}"/>
    <ul class="bs-tst-cards">
        <li class="bs-tst-card">
            <h4>Ships</h4>
            <ul id="ship-list"></ul>
        </li>
        <li class="bs-tst-card">
            <h4>User</h4>
            <ul id="user-info"></ul>
        </li>
        <li class="bs-tst-card">
            <h4>Games <a id="tst-delete"><i class="fa fa-trash"></i></a></h4>
            <ul id="all-games"></ul>
        </li>
    </ul>
</div>`;

        this.parent.append(template);
        this.bind();
    }

    bind() {
        let input = $('#input-token');
        input.change(() => this.token.$value = input.val());

        $('#tst-delete').click(() => {
            swal({
                title: "Are you sure?",
                text: "This will remove all your games",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Remove them!",
                cancelButtonText: "Nope",
                closeOnConfirm: false
            }, () => UserGame.deleteAll(this.api, null, this.onError.bind(this)));
        });
    }

    observe() {
        this.api.onTokenChanged(() => this.load());

        this.token.addObserver(args => this.api.token = args.newValue);
        this.user.addObserver(args => args.newValue.displayOn('#user-info'));
        this.ships.addObserver(args => {
            let shipList = $('#ship-list');
            shipList.empty();

            args.newValue.forEach(ship => shipList.append(`<li>${ship.name}</li>`));
        });
        this.games.addObserver(args => {
            let gameList = $('#all-games');
            gameList.empty();

            args.newValue.forEach(game => {

                game.onUpdate(this.api, () => {
                    $(`#g-${game.id}-state`).text(game.state);
                });

                let string = `<li id="g-${game.id}">
<ul class="bs-tst-game">
    <li><small class="game-id">${game.id}</small></li>
    <li>Tegen: '${game.enemyName}'</li>
    <li><small id="g-${game.id}-state">${game.state}</small></li>
</ul>
</li>`;

                if (game.state === STATE.STARTED) {
                    StaredGame.get(this.api, game.id, startedGame => {
                        let g_el = $(`#g-${game.id}`).find(`.bs-tst-game`);
                        if (startedGame.isPlayerTurn)
                            g_el.append('<li><small>Jouw beurt</small></li>');
                        else
                            g_el.append('<li><small>Niet jouw beurt</small></li>');
                    }, this.onError);
                }

                gameList.append(string);

            });
        });
    }

    set loading(value) {

        let allCards = $('.bs-tst-card');

        if (value)
            allCards.addClass('bs-tst-card-loading');
        else
            allCards.removeClass('bs-tst-card-loading');

        super.loading = value;
    }
}