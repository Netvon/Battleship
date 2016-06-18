import ViewModel from "./ViewModel";
import Observable from "./Observable";
import User from "../model/User";

export default class TitleScreenViewModel extends ViewModel {
    constructor(api) {
        super(api, 'vm-title');

        // this.bsTestVM = new BSTestViewModel(this.api);
        // this.bsTestVisible = new Observable(false);

        this.user = new Observable(null);
    }

    load() {
        User.getCurrent(this.api)
            .then(user => this.user.$value = user)
            .catch(this.onError.bind(this));
    }

    draw() {
        let template = `<main id="${this.name}" class="bs-fill-page bs-hero">
    <p id="bs-title" class="bs-hero-title">
        Battleship
    </p>
    <div class="bs-hero-token">
        <p class="bs-hero-token-welcome" id="lblWelcomeMsg">Ahoy, Stanger!</p>
        <input class="bs-input" type="text" id="title-input-token" placeholder="your token" value="${this.api.token}"/>
    </div>
    <button id="play-button" class="hero-button">Play</button>
</main>`;

        this.parent.append(template);

        this.bind();
    }

    bind() {

        let input = $('#title-input-token');
        input.change(() => {

            let val = input.val();

            this.api.isValidToken(val)
                .then(() => this.api.token = val)
                .catch((reason, error, statusCode) => {
                    console.error(reason);

                    swal({title: 'Validation Error', text: reason});

                    input.val(this.api.token);
                });
        });

        this.api.onTokenChanged(() => this.load());

        this.user.addObserver(({oldValue, newValue}) => {
            $('#lblWelcomeMsg').text(`Ahoy, Captain ${newValue.name}!`);
        });
    }
}