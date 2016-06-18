/**
 * Created by Sander on 16-06-16.
 */
import ViewModel from "./ViewModel";
import * as bs from "../util/BattleshipConst";
import Ship from "../model/ships/Ship";
import Observable from "./Observable";
import PlayerGameboard from '../model/board/PlayerGameboard';

export default class PlayerGameboardViewModel extends ViewModel {

    constructor(api) {
        super(api, 'vm-playergameboard');

        this.ships = new Observable();

        this.observe();
    }

    load() {

    }

    draw() {
        console.log('draw');

        let html = ``;

        html += `<p class="bs-hero-title">
        Battleship
    </p>`;
        html += `<div class='gameboard'>`;
        html += `<table class='player-grid'>`;

        for (let y = bs.CELLMIN; y <= bs.CELLMAX; y++)
        {
            html += `<tr data-y="${y}">`;

            for (let x = bs.CELLMIN; x <= bs.CELLMAX; x++) {
                html += `<td data-x="${x}" data-y="${y}"></td>`;
            }

            html += `</tr>`;
        }

        html += `</table>`;

        html += `</div>`;

        // Replace by ship assets
        for (let i = 1; i <= this.ships.length; i++) {
            html += `<div class="test-block"></div>`;
        }

        this.parent.append(html);
    }
    
    bind() {
        console.log('bind');

        $('.player-grid td').droppable( {
            // accept:
            // function(d) {
            //     console.log(d, this);
            //     return true;
            // },
            drop: function (event, ui) {
                console.log(event.target);
            }
        });
        $('.placeble-ship').draggable({revert: 'invalid', snap: '.player-grid td', snapMode: 'outer'});
    }

    observe() {
        Ship.getAll(this.api)
            .then(ships => {
                this.ships.$value = ships;

                // console.log(args.newValue);

                let ship_template = ``;

                // console.log(this.ships.$value[0].name);

                for (let i = 0; i < this.ships.$value.length; i++) {
                    ship_template += `<img id="${this.ships.$value[i].name}" class="placeble-ship" src="img/ships/${this.ships.$value[i].name}.png"/>`;
                    console.log(this.ships.$value[i].name);
                }

                $('.gameboard').append(ship_template);

                // $('#Destroyer').rotateLeft();

                console.log($(ship_template));
                console.log($('.gameboard'));

                this.bind();
            });

        // this.ships.addObserver(args => {
        //     console.log(args.newValue);
        //
        //     let ship_template = '';
        //
        //     for (let i = 1; i < this.ships.length; i++) {
        //         ship_template += '<img id=" + this.ships[i].name + " src="../img/ships/' + this.ships[i].name + '.png"/>';
        //     }
        //
        //     $('.game-board').append(ship_template);
        //
        //     console.log('ships added');
        // });
    }
}