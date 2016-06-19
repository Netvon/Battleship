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

        let html = `<div class="bs-fill-page" id=${this.name}>`;

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

        this.parent.append(html + '</div>');
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
                let ship = event.toElement;
                let target = event.target;

                let ship_x = $(target).attr('data-x');
                let ship_y = $(target).attr('data-y');
                let length = $(ship).attr('data-length');

                if (ship.className.includes('north')) {
                    switch (length) {
                        case '5':
                            ship_y = ship_y - 2;
                            break;
                        case '4':
                            ship_y = ship_y - 2;
                            break;
                        case '3':
                            ship_y = ship_y - 1;
                            break;
                        case '2':
                            ship_y = ship_y - 1;
                            break;
                        default:
                            console.log('Placement ships: invalid length');
                    }
                } else {
                    switch (length) {
                        case '5':
                            ship_x = ship_x - 2;
                            break;
                        case '4':
                            ship_x = ship_x - 2;
                            break;
                        case '3':
                            ship_x = ship_x - 1;
                            break;
                        case '2':
                            ship_x = ship_x - 1;
                            break;
                        default:
                            console.log('Placement ships: invalid length');
                    }
                }

                console.log('x', ship_x, 'y', ship_y);
            }
        });
        $('.placeble-ship').draggable({revert: 'invalid', snap: '.player-grid td', snapMode: 'outer'});

        for (let i = 0; i < this.ships.$value.length; i++) {
            let ship = this.slugify_shipname(this.ships.$value[i].name);

            $('#' + ship).on('dblclick', function () {
                let x = this;
                if (x.className.includes('north')) {
                    $(this).removeClass('north');
                    $(this).addClass('west');
                    $(this).attr('style', 'position: absolute;');
                    $(this).attr("src", `img/ships/${ship}-west.png`);
                } else {
                    $(this).removeClass('west');
                    $(this).addClass('north');
                    $(this).attr('style', 'position: absolute;');
                    $(this).attr("src", `img/ships/${ship}-north.png`);
                }

                console.log(this);
            })
        }
    }

    observe() {
        Ship.getAll(this.api)
            .then(ships => {
                this.ships.$value = ships;

                // console.log(args.newValue);

                let ship_template = ``;

                // console.log(this.ships.$value[0].name);

                for (let i = 0; i < this.ships.$value.length; i++) {
                    let ship = this.slugify_shipname(this.ships.$value[i].name);
                    console.log(ship);

                    ship_template += `<img id="${ship}" class="placeble-ship north" data-length="${this.ships.$value[i].length}" src="img/ships/${ship}-north.png"/>`;
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

    /*
     * Replaces space with '-'
     * Text to lower case
     */
    slugify_shipname(name) {
        return name.replace(/\s+/g, '-').toLowerCase();
    }
}