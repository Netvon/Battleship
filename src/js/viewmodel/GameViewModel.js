import ViewModel from "./ViewModel";
import Observable from "./Observable";
import StartedGame from "../model/games/StartedGame";
import * as bs from '../util/BattleshipConst';
import Cell from "../model/Cell";
import User from "../model/User";
import Shot from "../model/Shot";

export default class GameViewModel extends ViewModel {
    constructor(api, id) {
        super(api, `vm-startedgame-${id}`);

        this.id = id;
        this.startedGame = new Observable('startedGame', null);
        this.user = new Observable('user', null);

        console.log(api._socketIoCallbacks);

        this.bind();
    }

    destroy() {

        console.dir(this.api._socketIoCallbacks);

        this.api.removeOn(this.name, 'update');
        this.api.removeOn(this.name, 'shot');
        this.api.removeOn(this.name, 'turn');

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

    bind() {
        this.startedGame.addObserver(this.name, args => {

            let showPlayerShots = () => {
                newGame.playerGameBoard.shots.forEach(shot => {

                    let cell = $(`.bs-grid-cell[data-player=player][data-row='${shot.y}'][data-cell='${shot.x}']`);

                    if (!shot.isHit)
                        cell.addClass('bs-grid-cell-shot');
                    else
                        cell.addClass('bs-grid-cell-hit');
                });
            };

            let showEnemyShots = () => {
                newGame.enemyGameBoard.shots.forEach(shot => {

                    let cell = $(`.bs-grid-cell[data-player=enemy][data-row='${shot.y}'][data-cell='${shot.x}']`);

                    if (!shot.isHit)
                        cell.addClass('bs-grid-cell-shot');
                    else
                        cell.addClass('bs-grid-cell-hit');
                });
            };


            let newGame = args.newValue;

            // console.log(newGame);
            // console.log(newGame.onShot);

            newGame.onShot(this.name, this.api, data => {
                // console.log(data);

                let isHit = data.result === 'BOOM';

                if (data.user === this.user.$value.email) {

                    newGame.enemyGameBoard.shots.push(new Shot(data.cell.x, data.cell.y, '0', isHit));

                    showPlayerShots();
                    showEnemyShots();
                }
                else {

                    newGame.playerGameBoard.shots.push(new Shot(data.cell.x, data.cell.y, '0', isHit));

                    showPlayerShots();
                    showEnemyShots();
                }

                console.log(data);
            });

            let generateGrid = (player) => {
                let rows = '';

                for (let r = 1; r <= bs.CELLMAX; r++) {
                    rows += `<div class="bs-grid-row" data-row="${r}">`;
                    for (let c = 1; c <= bs.CELLMAX; c++) {
                        rows += `<div data-player="${player}" class="bs-grid-cell" data-row="${r}" data-cell="${c}"></div>`;
                    }
                    rows += `</div>`;
                }
                return rows;
            };

            let rows = generateGrid('enemy');
            let rowsPlayer = generateGrid('player');

            let template = `<h2>Battle against <span>${newGame.enemyName}</span></h2>
<div class="bs-game-container" id="sg-${newGame.id}">
<div id="grid-enemy-${newGame.id}" data-player="enemy" class="bs-grid">${rows}</div>
<div id="grid-player-${newGame.id}" data-player="player" class="bs-grid">${rowsPlayer}</div>
</div>`;

            $(`#${this.name}`).html(template);


            // let changeWHEnemy = (el) => {
            //     let w = el[0].getBoundingClientRect().width;
            //     // el.height(w);
            // };
            //
            // let changeWHPlayer = (el) => {
            //     let w = el[0].getBoundingClientRect().width;
            //     // el.height(w/2);
            //     // el.width(w/2);
            //     // el.css('min-width', w/2);
            // };

            // console.log(newGame.playerGameBoard.ships);
            newGame.playerGameBoard.ships.forEach(ship => {

                // console.log(`${ship.y}${ship.x}`);

                let cell = $(`.bs-grid-cell[data-player=player][data-row='${ship.y}'][data-cell='${ship.x}']`);

                if (ship.isVertical) {
                    for (let y = 1; y < ship.length; y++) {
                        $(`.bs-grid-cell[data-player=player][data-row='${ship.y + y}'][data-cell='${ship.x}']`)
                            .addClass('bs-grid-cell-ship');
                    }
                }
                else {
                    for (let x = 1; x < ship.length; x++) {
                        $(`.bs-grid-cell[data-player=player][data-row='${ship.y}'][data-cell='${ship.x + x}']`)
                            .addClass('bs-grid-cell-ship');
                    }
                }

                cell.addClass('bs-grid-cell-ship');
            });

            showPlayerShots();
            showEnemyShots();

            // changeWHEnemy($('.bs-grid[data-player=enemy]'));
            // changeWHPlayer($('.bs-grid[data-player=player]'));
        })
    }

    draw() {
        let template = `<div class="bs-fill-page" id="${this.name}">
</div>`;

        this.parent.append(template);

        this.parent.delegate('.bs-grid-cell[data-player=enemy]', 'click', e => {
            let row = Number($(e.currentTarget).attr('data-row'));
            let cell = Number($(e.currentTarget).attr('data-cell'));

            // console.log(`{x:${row}(${typeof row}),y:${cell}(${typeof cell})}`);

            let c = new Cell(cell, row);

            this.loading = true;

            this.startedGame.$value.doShot(this.api, c)
                .then(data => swal({title: 'shot', text: data}))
                .then(() => this.loading = false)
                .catch(this.onError.bind(this));

        });
    }
}