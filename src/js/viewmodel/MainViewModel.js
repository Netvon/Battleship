import ViewModel from "./ViewModel";
import TitleScreenViewModel from "./TitleScreenViewModel";
import LobbyViewModel from "./LobbyViewModel";
import Observable from "./Observable";
import BSTestViewModel from "./BSTestViewModel";
import Session from "../util/Session";
import BSODViewModel from "./BSODViewModel";
import LobbyGameViewModel from "./LobbyGameViewModel";
import PlayerGameboardViewModel from "./PlayerGameboardViewModel";

export default class MainViewModel extends ViewModel {
    constructor(api) {
        super(api, 'vm-main');

        if (!Session.hasKey('last-page')) {
            Session.set('last-page', '1');
        }
        
        LobbyViewModel.prototype.onError = this.handleError;
        TitleScreenViewModel.prototype.onError = this.handleError;
        LobbyGameViewModel.prototype.onError = this.handleError;
        BSTestViewModel.prototype.onError = this.handleError;
        PlayerGameboardViewModel.prototype.onError = this.handleError;

        this.bsTestVM = new BSTestViewModel(this.api);
        this.bsTestVisible = new Observable(false);

        this.titleVM = new TitleScreenViewModel(this.api);
        this.lobbyVM = new LobbyViewModel(this.api);
        this.gameBoardVM = new PlayerGameboardViewModel(this.api);

        this.views = {
            1: this.titleVM,
            2: this.lobbyVM
        };

        this.currentView = new Observable(null);
    }

    draw() {
        let template = `<p class="bs-credit">Made by Sander & Tom <button class="bs-button" id="debug-toggle">Show Test View</button></p>`;

        // if (Session.get('last-page') == 1) {
        //     this.titleVM.addTo();
        // }
        // else if (Session.get('last-page') == 2) {
        //     this.lobbyVM.addTo();
        // }

        this.parent.append(template);
        this.parent.append(`<button id="go-back" class="bs-button bs-button-primary" title="Go back"><i class="fa fa-chevron-left"></i></button>`);

        this.bind();
    }

    bind() {

        this.currentView.addObserver(args => {
            let ov = this.views[args.oldValue];
            if(ov !== undefined && ov != null)
                $(`#${ov.name}`).remove();

            let nv = this.views[args.newValue];
            nv.addTo();

            Session.set('last-page', `${args.newValue}`);

            if(args.newValue <= 1)
                $('#go-back').hide();
            else
                $('#go-back').show();
        });

        this.currentView.$value = Number(Session.get('last-page'));

        this.parent.delegate('#play-button', 'click', () => {
            this.currentView.$value += 1;
        });

        let btnDebugToggle = $('#debug-toggle');

        this.bsTestVisible.addObserver(() => {
            if (this.bsTestVisible.$value)
                btnDebugToggle.text('Hide Test View');
            else
                btnDebugToggle.text('Show Test View');
        });

        $('html').keydown(event => {
            if (event.keyCode === 192) {
                this.changeBsTestVMVisibility();
            }
        });

        btnDebugToggle.click(() => this.changeBsTestVMVisibility());

        $('#go-back').click(() => {
            this.currentView.$value -= 1;
        });

        this.parent.delegate('.bs-lobby-list-item', 'click', e => {
            console.log($(e.target).attr('data-gid'));

            this.lobbyVM.destroy();

            this.gameBoardVM.addTo();
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

    handleError(reason, error, statusCode) {
        // console.log(error);
        // swal({
        //     title: "You broke it :(",
        //     text: `<p>An error occurred, please reload the page to try again.</p><code>${reason}</code>`,
        //     type: "error",
        //     html: true
        // });

        let bsod = new BSODViewModel(this.api, statusCode, reason);
        bsod.addTo('body');

        this.loading = false;
    }
}