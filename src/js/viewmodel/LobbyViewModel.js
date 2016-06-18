import ViewModel from "./ViewModel";
import UserGame from "../model/games/UserGame";
import Observable from "./Observable";
import LobbyGameViewModel from "./LobbyGameViewModel";
import User from "../model/User";
import SetupGame from "../model/games/SetupGame";

export default class LobbyViewModel extends ViewModel {
    constructor(api) {
        super(api, 'vm-lobby');

        this.games = new Observable();
        this.user = new Observable();

        this._ids = new Set();

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

        $('#lobby-new-game').on('click', () => {
            SetupGame.create(this.api)
                .then(() => swal('Game created!'))
                .catch((reason, error, statusCode) => {
                    if (statusCode !== undefined) {
                        this.onError(reason, error, statusCode);
                    } else {
                        swal({
                            title: "Can't let you do that.",
                            text: reason
                        })
                    }
                });
        });

        $('#lobby-new-ai').on('click', () => {
            SetupGame.create(this.api, true)
                .then(() => swal('Game created!'))
                .catch((reason, error, statusCode) => {
                    if (statusCode !== undefined) {
                        this.onError(reason, error, statusCode);
                    } else {
                        swal({
                            title: "Can't let you do that.",
                            text: reason
                        })
                    }
                });
        });

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
    <p>Here's a list of all the Battles currently happening.</p>
    <button id="lobby-remove-games" class="bs-button bs-button-primary" title="Remove all Battles"><i class="fa fa-trash"></i><span class="bs-button-text">Remove all Battles</span></button>
    <button id="lobby-new-game" class="bs-button bs-button-primary" title="New Battle"><i class="fa fa-plus"></i><span class="bs-button-text">New Battle</span></button>
    <button id="lobby-new-ai" class="bs-button bs-button-primary" title="Start Training"><i class="fa fa-plus"></i><span class="bs-button-text">New Training</span></button>
</div>
<ul class="bs-lobby-list" id="bs-lobby-list" role="list"></ul>
</div>
</div>`;

        this.parent.append(template);

        this.bind();
    }

    observe() {

        this.api.onUpdate(args => {

            let contains = this._ids.has(args.gameId);

            if (!contains) {

                this.loading = true;
                UserGame.get(this.api, args.gameId)
                    .then(userGame => {

                        this._ids.add(userGame.id);
                        let lgvm = new LobbyGameViewModel(this.api, userGame);
                        lgvm.addTo('#bs-lobby-list');

                        this.loading = false;
                    })
                    .catch(this.onError.bind(this));
            }
        });

        this.games.addObserver(args => {
            let list = $('#bs-lobby-list');
            list.empty();

            args.newValue.forEach(item => {
                this._ids.add(item.id);
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