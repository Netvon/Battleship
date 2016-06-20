import ViewModel from "./ViewModel";
import TitleScreenViewModel from "./TitleScreenViewModel";
import LobbyViewModel from "./LobbyViewModel";
import Observable from "./Observable";
import BSTestViewModel from "./BSTestViewModel";
import Session from "../util/Session";
import BSODViewModel from "./BSODViewModel";
import LobbyGameViewModel from "./LobbyGameViewModel";
import GameboardViewModel from "./GameboardViewModel";
import GameViewModel from "./GameViewModel";
import AudioManager from "../util/AudioManager";
import {STATE} from "../util/BattleshipConst";
import Persistence from "../util/Persistence";

export default class MainViewModel extends ViewModel {
    constructor(api) {
        super(api, 'vm-mains');

        if (!Session.hasKey('last-page')) {
            Session.set('last-page', '1');
        }

        if (!Persistence.hasKey('play-music')) {
            Persistence.set('play-music', 'true');
        }

        LobbyViewModel.prototype.onError = this.handleError;
        TitleScreenViewModel.prototype.onError = this.handleError;
        LobbyGameViewModel.prototype.onError = this.handleError;
        BSTestViewModel.prototype.onError = this.handleError;
        GameboardViewModel.prototype.onError = this.handleError;
        GameViewModel.prototype.onError = this.handleError;

        this.bsTestVM = new BSTestViewModel(this.api);
        this.bsTestVisible = new Observable(false);

        this.titleVM = new TitleScreenViewModel(this.api);
        this.lobbyVM = new LobbyViewModel(this.api);
        this.gameBoardVM = null;

        this.playingBGM = new Observable();

        this.views = {
            1: this.titleVM,
            2: this.lobbyVM,
            3: this.gameBoardVM
        };

        this.currentView = new Observable(null);

        this.observe();
        this.playingBGM.$value = Persistence.get('play-music');
    }

    observe() {
        this.playingBGM.addObserver(args => {
            Persistence.set('play-music', args.newValue);
        })
    }

    draw() {
        let template = `<p class="bs-credit">Made by Sander & Tom <button class="bs-button" id="debug-toggle">Show Test View</button></p>`;

        this.parent.append(template);
        this.parent.append(`<button id="go-back" class="bs-button bs-button-primary" title="Go back"><i class="fa fa-chevron-left"></i></button>`);
        this.parent.append(`<button id="mute" class="bs-button bs-button-primary" title="Mute"><i class="fa fa-volume-up"></i></button>`);

        AudioManager.load('btn1', 'audio/button-37.mp3');

        AudioManager.load('test2', 'audio/test2.mp3');

        if (this.playingBGM.$value === 'true') {
            AudioManager.play('test2');
        }
        else {
            let mute = $('#mute');

            mute.find('.fa')
                .removeClass('fa-volume-up');

            mute.find('.fa').addClass('fa-volume-off');
        }

        this.bind();
    }

    bind() {

        this.currentView.addObserver(args => {
            let ov = this.views[args.oldValue];
            if (ov !== undefined && ov != null)
                $(`#${ov.name}`).remove();

            let nv = this.views[args.newValue];

            if (nv === undefined || nv === null) {
                this.currentView.$value--;
                return;
            }

            nv.addTo();

            Session.set('last-page', `${args.newValue}`);

            if (args.newValue <= 1)
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

        let mute = $('#mute');

        mute.click(() => {

            if (this.playingBGM.$value === 'true') {

                AudioManager.pause('test2');

                mute.find('.fa')
                    .removeClass('fa-volume-up');

                mute.find('.fa').addClass('fa-volume-off');

                this.playingBGM.$value = 'false';
            }
            else {
                AudioManager.play('test2');

                mute.find('.fa')
                    .removeClass('fa-volume-off');

                mute.find('.fa').addClass('fa-volume-up');

                this.playingBGM.$value = 'true';
            }
        });

        this.parent.delegate(`.bs-lobby-list-item`, 'click', e => {

            let id = $(e.currentTarget).attr('data-gid');
            let state = $(e.currentTarget).attr('data-state');

            console.log(state);

            if (state === STATE.QUEUE) {
                swal({
                    title: 'Hold on',
                    text: "We're still looking for an opponent for this Battle",
                    type: 'error'
                })
            } else if (state === STATE.SETUP) {
                this.views[3] = new GameboardViewModel(this.api, id);
                this.currentView.$value++;

            } else if (state === STATE.STARTED) {
                this.views[3] = new GameViewModel(this.api, id);
                this.currentView.$value++;

            } else if (state === STATE.DONE) {
                swal({
                    title: 'Nothing to see here',
                    text: "This Battle has already been fought",
                    type: 'error'
                })
            }
            else {
                this.currentView.$value += 1;
            }


        });

        let playSound = () => {
            AudioManager.play('btn1', false, false);
        };

        this.parent.delegate('.bs-button', 'click', playSound);
        this.parent.delegate('.hero-button', 'click', playSound);
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
        console.error(error);

        let bsod = new BSODViewModel(this.api, statusCode, reason);
        bsod.addTo('body');

        this.loading = false;
    }
}