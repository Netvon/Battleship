import ViewModel from "./ViewModel";
import Observable from "./Observable";
import StartedGame from "../model/games/StartedGame";
import * as bs from '../util/BattleshipConst';
import Cell from "../model/Cell";
import User from "../model/User";
import AudioManager from "../util/AudioManager";
import Persistence from "../util/Persistence";
import Shot from "../model/Shot";

export default class GameViewModel extends ViewModel {
    constructor(api, id) {
        super(api, `vm-startedgame-${id}`);

        this.id = id;
        this.startedGame = new Observable('startedGame', null);
        this.user = new Observable('user', null);
        this.tasks = [];
        this.bind();

    }

    destroy() {
        this.parent.undelegate('.bs-grid-cell[data-player=enemy]', 'click');
        this.api.removeOn(this.name, 'shot');
        this.startedGame.removeObserver(this.name);
    }

    load() {

        this.loading = true;

        this.tasks = [
            User.getCurrent(this.api)
                .then(user => this.user.$value = user),

            StartedGame.get(this.api, this.id)
                .then(startedGame => this.startedGame.$value = startedGame)
        ];

        Promise.all(this.tasks)
            .then(() => this.loading = false)
            .catch(this.onError.bind(this))

    }

    gameLoaded() {
        console.log(this.startedGame.$value);

        this.drawGameboards();
        this.drawShotsHits();
        this.drawTurn();
    }

    onShot(args) {

        if (this.startedGame.$value.id !== args.gameId)
            return;
        let isWon = args.result === 'WINNER';

        if (isWon) {
            this.destroy();
            swal({title: 'Victory!', text: `You won the battle against ${this.startedGame.$value.enemyName}!`});
            AudioManager.pause('test2');
            AudioManager.play('win');
            setTimeout(() => {
                if (Persistence.get('play-music') === 'true') {
                    AudioManager.resume('test2');
                }
            }, 6000);
            return;
        }

        if (args.user === this.user.$value.email)
            this.startedGame.$value.enemyGameBoard.shots.push(args.shot);
        else
            this.startedGame.$value.playerGameBoard.shots.push(args.shot);

        if (args.user !== this.user.$value.email && args.result !== 'FAIL') {
            console.log(`The Enemy fired on square ${args.cell.xLetter.toUpperCase()}${args.cell.y}`);
        }

        this.drawShotsHits();
    }

    onTurn(args) {
        if (this.startedGame.$value.id !== args.gameId)
            return;

        // console.log(args);

        this.startedGame.$value.isPlayerTurn = args.currentUser === this.user.$value.email;

        this.drawTurn();
    }

    drawTurn() {

        let game = this.startedGame.$value;

        let turnLabel = $(`#sg-turn-${this.id}`);

        if (game.isPlayerTurn)
            turnLabel.text('Your turn');
        else
            turnLabel.text(`Waiting for ${game.enemyName} to make a move`);
    }

    drawGameboards() {
        let game = this.startedGame.$value;

        let generateGrid = (player) => {
            let rows = '';

            for (let r = 0; r <= bs.CELLMAX; r++) {
                rows += `<div class="bs-grid-row" data-row="${r}">`;

                if(r > 0)
                    rows += `<div class="bs-grid-cell-xy" data-player="${player}">${r}</div>`;
                else
                    rows += `<div class="bs-grid-cell-xy" data-player="${player}"></div>`;

                for (let c = 1; c <= bs.CELLMAX; c++) {
                    if(r > 0)
                        rows += `<div data-player="${player}" class="bs-grid-cell" data-row="${r}" data-cell="${c}"></div>`;
                    else
                        rows += `<div class="bs-grid-cell-xy" data-player="${player}">${Cell.cellNumberToLetter(c).toUpperCase()}</div>`
                }
                rows += `</div>`;
            }
            return rows;
        };

        let rows = generateGrid('enemy');
        let rowsPlayer = generateGrid('player');

        let template = `<div class="bs-game-info"><h2>Battle against <span>${game.enemyName}</span></h2>
<p id="sg-turn-${this.id}"></p></div>
<div class="bs-game-container" id="sg-${game.id}">
<div id="grid-enemy-${game.id}" data-player="enemy" class="bs-grid">${rows}</div>
<div id="grid-player-${game.id}" data-player="player" class="bs-grid">${rowsPlayer}</div>
</div>`;

        $(`#${this.name}`).html(template);

        game.playerGameBoard.ships.forEach(ship => {

            let cell = $(`.bs-grid-cell[data-player=player][data-row='${ship.y}'][data-cell='${ship.x}']`);

            if (ship.isVertical) {
                for (let y = 0; y < ship.length; y++) {
                    $(`.bs-grid-cell[data-player=player][data-row='${ship.y + y}'][data-cell='${ship.x}']`)
                        .addClass('bs-grid-cell-ship')
                        .attr('data-ship', ship.name);
                }
            }
            else {
                for (let x = 0; x < ship.length; x++) {
                    $(`.bs-grid-cell[data-player=player][data-row='${ship.y}'][data-cell='${ship.x + x}']`)
                        .addClass('bs-grid-cell-ship')
                        .attr('data-ship', ship.name);
                }
            }

            cell.addClass('bs-grid-cell-ship');
        });
    }

    drawShotsHits() {
        let game = this.startedGame.$value;

        let forEachShotHit = (type, shot) => {
            let cell = $(`.bs-grid-cell[data-player=${type}][data-row='${shot.y}'][data-cell='${shot.x}']`);

            if (!shot.isHit)
                cell.addClass('bs-grid-cell-shot');
            else
                cell.addClass('bs-grid-cell-hit');
        };

        game.playerGameBoard.shots.forEach(shot => forEachShotHit('player', shot));
        game.enemyGameBoard.shots.forEach(shot => forEachShotHit('enemy', shot));
    }


    bind() {
        this.api.on(this.name, 'shot', this.onShot.bind(this));
        this.api.on(this.name, 'turn', this.onTurn.bind(this));
        this.startedGame.addObserver(this.name, this.gameLoaded.bind(this))
    }

    draw() {
        let template = `<div class="bs-fill-page bs-started-game" id="${this.name}">
</div>`;

        this.parent.append(template);

        this.parent.delegate('.bs-grid-cell[data-player=enemy]', 'click', e => {
            if (this.loading || !this.startedGame.$value.isPlayerTurn)
                return;

            this.loading = true;

            let row = Number($(e.currentTarget).attr('data-row'));
            let cell = Number($(e.currentTarget).attr('data-cell'));

            // console.log(`{x:${row}(${typeof row}),y:${cell}(${typeof cell})}`);

            let c = new Cell(cell, row);

            this.startedGame.$value.doShot(this.api, c)
                .then(args => {

                    if (args === 'BOOM') {
                        swal({title: 'Hit!', text: `You hit the target!`, type: 'success'});
                        AudioManager.play('hit');
                    }
                    else if (args === 'FAIL') {
                        swal({
                            title: "That doesn't work",
                            text: `You already fired a shot on that spot`,
                            type: 'error'
                        });
                    }
                    else if (args === 'SPLASH') {
                        swal({title: 'Miss!', text: `The shot failed to connect`, type: 'error'});
                        AudioManager.play('splash');
                    }
                })
                .then(() => this.loading = false)
                .catch(this.onError.bind(this));

        });
    }

    get title() {
        return 'Battle';
    }
}