import ViewModel from "./ViewModel";
import BSTestViewModel from "./BSTestViewModel";
import Observable from "./Observable";
import User from "../model/User";

export default class TitleScreenViewModel extends ViewModel {
    constructor(api) {
        super(api, 'vm-title');

        this.bsTestVM = new BSTestViewModel(this.api);
        this.bsTestVisible = new Observable(false);

        this.user = new Observable(null);
    }

    load() {
        User.getCurrent(this.api).then(user => this.user.$value = user);
    }

    draw() {
        let template = `<main id="${this.name}" class="bs-fill-page bs-hero">
    <p class="bs-hero-title">
        Battleship
    </p>
    <p id="lblWelcomeMsg">Welcome</p>
    <button class="hero-button">Play</button>
    <p class="bs-hero-credit">Made by Sander & Tom <button class="bs-button" id="debug-toggle">Show Test View</button></p>
</main>`;

        this.parent.append(template);


        this.bind();
    }

    bind() {

        let btnDebugToggle = $('#debug-toggle');

        this.bsTestVisible.addObserver(() => {
            if (this.bsTestVisible.$value)
                btnDebugToggle.text('Hide Test View');
            else
                btnDebugToggle.text('Show Test View');
        });

        btnDebugToggle.click(() => this.changeBsTestVMVisibility());

        $('html').keydown(event => {
            if (event.keyCode === 192) {
                this.changeBsTestVMVisibility();
            }
        });

        this.user.addObserver(({oldValue, newValue}) => {
            $('#lblWelcomeMsg').text(`Welcome, ${newValue.name}`);
        });
    }

    changeBsTestVMVisibility() {
        if (this.bsTestVisible.$value) {
            this.bsTestVM.destroy();
            this.bsTestVisible.$value = false;
        }
        else {
            this.bsTestVM.addTo('body');
            this.bsTestVisible.$value = true;

            document.querySelector(`#${this.bsTestVM.name}`).scrollIntoView();
        }
    }
}