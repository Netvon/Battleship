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
        User.getCurrent(this.api).then(user => this.user.$value = user);
    }

    draw() {
        let template = `<main id="${this.name}" class="bs-fill-page bs-hero">
    <p id="bs-title" class="bs-hero-title">
        Battleship
    </p>
    <p class="bs-welcome" id="lblWelcomeMsg">Ahoy, Captain!</p>
    <button id="play-button" class="hero-button">Play</button>
</main>`;

        this.parent.append(template);


        this.bind();
    }

    bind() {

        // let btnDebugToggle = $('#debug-toggle');
        //
        // this.bsTestVisible.addObserver(() => {
        //     if (this.bsTestVisible.$value)
        //         btnDebugToggle.text('Hide Test View');
        //     else
        //         btnDebugToggle.text('Show Test View');
        // });
        //
        // $('html').keydown(event => {
        //     if (event.keyCode === 192) {
        //         this.changeBsTestVMVisibility();
        //     }
        // });

        this.user.addObserver(({oldValue, newValue}) => {
            $('#lblWelcomeMsg').text(`Ahoy, Captain ${newValue.name}!`);
        });
    }

    // changeBsTestVMVisibility() {
    //     if (this.bsTestVisible.$value) {
    //         this.bsTestVM.destroy();
    //         this.bsTestVisible.$value = false;
    //     }
    //     else {
    //         this.bsTestVM.addTo('body');
    //         this.bsTestVisible.$value = true;
    //
    //         document.querySelector(`#${this.bsTestVM.name}`).scrollIntoView();
    //     }
    // }

    onPlayClick(callback){
        $('#play-button').click(callback);
    }
}