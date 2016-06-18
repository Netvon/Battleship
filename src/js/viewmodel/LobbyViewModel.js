import ViewModel from "./ViewModel";
import UserGame from "../model/games/UserGame";
import Observable from "./Observable";
import LobbyGameViewModel from "./LobbyGameViewModel";
import User from "../model/User";

export default class LobbyViewModel extends ViewModel {
    constructor(api) {
        super(api, 'vm-lobby');

        this.games = new Observable();
        this.user = new Observable();

        this.observe();
    }

    load() {
        this.loading = true;

        let tasks = [
            UserGame.getForCurrentUser(this.api)
                .then(games => this.games.$value = games),

            User.getCurrent(this.api)
                .then(user => this.user.$value = user)
        ];

        Promise.all(tasks)
            .then(() => this.loading = false);
    }

    draw() {
        let template = `<div id="${this.name}" class="bs-fill-page bs-lobby">
<div class="bs-lobby-container">
<h1 class="bs-lobby-title">Battleship</h1>
<div id="lobby-user-info" class="bs-lobby-user">User info</div>
<ul class="bs-lobby-list" id="bs-lobby-list"></ul>
</div>
</div>`;

        this.parent.append(template);
    }

    observe() {
        this.games.addObserver(args => {
            let list = $('#bs-lobby-list');
            list.empty();

            args.newValue.forEach(item => {
                let lgvm = new LobbyGameViewModel(this.api, item);
                lgvm.addTo('#bs-lobby-list');
            });
        });

        this.user.addObserver(args => {

            $('#lobby-user-info').text(args.newValue.name);

        });
    }

    set loading(value) {

        let list = $('#bs-lobby-list');

        if (value)
            list.addClass('bs-lobby-list-loading');
        else
            list.removeClass('bs-lobby-list-loading');

        super.loading = value;
    }
}