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

        this._ids = [];

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
            .then(() => this.loading = false)
            .catch(this.onError.bind(this));
    }

    bind() {
        $('#lobby-remove-games').on('click', () => {
            swal({
                    title: "Are you sure?",
                    text: "This will remove all your games",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Remove them!",
                    cancelButtonText: "Nope",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true
                },
                () => {
                    this.games.$value = [];

                    UserGame.deleteAll(this.api)
                        .then(() => swal({
                            title: "Battles removed",
                            type: "success"
                        }))
                        .catch(this.onError.bind(this));
                }
            );
        });
    }

    draw() {
        let template = `<div id="${this.name}" class="bs-fill-page bs-lobby">
<div class="bs-lobby-container">
<h1 class="bs-lobby-title">Battleship</h1>
<div id="lobby-user-info" class="bs-lobby-user">
    Here's a list of all the Battles currently happening.
    <button id="lobby-remove-games" class="bs-button bs-button-primary" title="Remove all Games"><i class="fa fa-trash"></i>Remove all games</button>
</div>
<ul class="bs-lobby-list" id="bs-lobby-list"></ul>
</div>
</div>`;

        this.parent.append(template);

        this.bind();
    }

    observe() {

        this.api.onUpdate(args => {

            let contains = this._ids.some(item => item.id === args.gameId);

            if (!contains) {

                this.loading = true;
                UserGame.get(this.api, args.gameId)
                    .then(userGame => {
                        let old = this.games.$value.slice(0);
                        old.push(userGame);

                        this.games.$value = old;
                        this.loading = false;
                    })
                    .catch(this.onError.bind(this));
            }
        });

        this.games.addObserver(args => {
            let list = $('#bs-lobby-list');
            list.empty();

            args.newValue.forEach(item => {
                this._ids.push(item.id);
                let lgvm = new LobbyGameViewModel(this.api, item);
                lgvm.addTo('#bs-lobby-list');
            });
        });

        // this.user.addObserver(args => {
        //
        //     $('#lobby-user-info').text(args.newValue.name);
        //
        // });
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