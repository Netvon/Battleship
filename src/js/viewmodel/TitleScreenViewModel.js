import ViewModel from "./ViewModel";
import Observable from "./Observable";
import User from "../model/User";

export default class TitleScreenViewModel extends ViewModel {
    constructor(api) {
        super(api, 'vm-title');

        // console.log('hallo');

        // this.bsTestVM = new BSTestViewModel(this.api);
        // this.bsTestVisible = new Observable(false);

        this.user = new Observable('user');
        this.token = new Observable('token', this.api.token);
    }

    load() {
        // console.log('loading user');

        User.getCurrent(this.api)
            .then(user => {
                this.user.$value = user
            })
            .catch(this.onError.bind(this));
    }

    draw() {
        this.observe();

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

    destroy() {
        this.api.removeOnTokenChanged(this.name);
        this.user.removeObserver(this.name);
    }

    bind() {

        let input = $('#title-input-token');
        input.change(() => {

            let old = this.token.$value;
            this.token.$value = input.val();

            User.getCurrent(this.api)
                .then(user => {
                    this.user.$value = user
                })
                .catch(() => {
                    this.token.$value = old;
                    input.val(old);
                    swal({title: 'Token Error', text: 'This is not a valid token'});
                });

            // this.api.isValidToken(val)
            //     .then(() => {
            //
            //         // console.log('changing api token');
            //
            //         this.token.$value = val;
            //     })
            //     .catch((reason, error, statusCode) => {
            //         console.error(reason);
            //
            //         // swal({title: 'Token Error', text: reason});
            //
            //         input.val(this.token.$value);
            //     });
        });

        this.user.addObserver(this.name, ({oldValue, newValue}) => {
            // console.log('user changed');
            $('#lblWelcomeMsg').text(`Ahoy, Captain ${newValue.name}!`);
        });
    }

    observe() {
        // this.api.onTokenChanged(this.name, () => this.load());
        this.token.addObserver(this.name, args => this.api.token = args.newValue);
    }

    get title() {
        return 'Ahoy!';
    }
}