import ViewModel from "./ViewModel";
import UserGame from "../model/games/UserGame";
import Observable from "./Observable";
import LobbyGameViewModel from "./LobbyGameViewModel";

export default class LobbyViewModel extends ViewModel {
    constructor(api) {
        super(api, 'vm-lobby');

        this.games = new Observable();

        this.observe();
    }

    load() {
        this.loading = true;

        UserGame.getForCurrentUser(this.api)
            .then(games => this.games.$value = games)
            .then(() => this.loading = false);
    }

    draw() {
        let template = `<div id="${this.name}" class="bs-fill-page bs-lobby">
<div>User info</div>
<ul class="bs-lobby-list" id="bs-lobby-list"></ul>
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
    }
}