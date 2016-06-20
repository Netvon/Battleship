/**
 * Created by Sander on 16-06-16.
 */
import ViewModel from "./ViewModel";
import * as bs from "../util/BattleshipConst";
import SetupGame from "../model/games/SetupGame";
import Ship from "../model/ships/Ship";
import Cell from "../model/Cell";
import Gameboard from "../model/board/Gameboard";
import GameboardShip from "../model/ships/GameboardShip";
import Observable from "./Observable";
import PlayerGameboard from '../model/board/PlayerGameboard';

export default class PlayerGameboardViewModel extends ViewModel {

    constructor(api, id) {
        super(api, 'vm-playergameboard');

        this.api = api;
        this.id = id;

        this.ships = new Observable();
        this.gameboard = new Gameboard();

        this.observe();
    }

    load() {

    }

    draw() {
        let html = `<div class="bs-fill-page" id=${this.name}>`;
        let alphabet = "ABCDEFGHIJ".split("");

        html += `<p class="bs-hero-title">
        Battleship
    </p>`;
        html += `<div class='gameboard'>`;
        html += `<table class='player-grid'>`;

        for (let y = 0; y <= bs.CELLMAX; y++)
        {
            if (y != 0) {
                html += `<tr data-y="${y}">`;

                html += `<th>${y}</th>`;
            } else {
                html += `<tr>`;

                html += `<th></th>`;
            }

            for (let x = 1; x <= bs.CELLMAX; x++) {
                if (y != 0) {
                    html += `<td data-x="${x}" data-y="${y}"></td>`;
                } else {
                    html += `<th>${alphabet[x - 1]}</th>`;
                }
            }

            html += `</tr>`;
        }

        html += `</table>
            </div>
            <div id="placeable-ships"></div>
            <button id="submit-button" class="hero-button">Submit gameboard</button>
        </div>`;

        this.parent.append(html);
    }
    
    bind() {
        $('.player-grid td').droppable( {
            // accept:
            // function(d) {
            //     console.log(d, this);
            //     return true;
            // },
            drop: (event, ui) => {
                let ship = event.toElement;
                let target = event.target;

                let ship_x = $(target).attr('data-x');
                let ship_y = $(target).attr('data-y');
                let length = $(ship).attr('data-length');
                let orientation = '';

                if (ship.className.includes(bs.VERTICAL)) {
                    orientation = bs.VERTICAL;
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
                            if (ship_y <= 1) {
                                ship_y = 1;
                            } else {
                                ship_y = ship_y - 1;
                            }
                            break;
                        default:
                            console.log('Placement ships: invalid length');
                    }
                } else {
                    orientation = bs.HORIZONTAL;
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
                            if (ship_x <= 1) {
                                ship_x = 1;
                            } else {
                                ship_x = ship_x - 1;
                            }
                            break;
                        default:
                            console.log('Placement ships: invalid length');
                    }
                }

                this.placeShip($(ship).attr('data-name'), ship_x, ship_y, orientation);
                console.log('x', ship_x, 'y', ship_y);
            }
        });
        $('.placeable-ship').draggable({revert: 'invalid', snap: '.player-grid td', snapMode: 'outer'});

        for (let i = 0; i < this.ships.$value.length; i++) {
            let ship = this.slugify_shipname(this.ships.$value[i].name);

            $('#' + ship).on('dblclick', function () {
                let x = this;
                if (x.className.includes(bs.VERTICAL)) {
                    $(this).removeClass(bs.VERTICAL);
                    $(this).addClass(bs.HORIZONTAL);
                    $(this).attr('style', 'position: absolute;');
                    $(this).attr("src", `img/ships/${ship}-horizontal.png`);
                } else {
                    $(this).removeClass(bs.HORIZONTAL);
                    $(this).addClass(bs.VERTICAL);
                    $(this).attr('style', 'position: absolute;');
                    $(this).attr("src", `img/ships/${ship}-vertical.png`);
                }
            })
        }

        $('#submit-button').on('click', () => {
            if (this.gameboard.ships.length == bs.SHIPMAX) {
                SetupGame.submitGameboard(this.api, this.gameboard, this.id);
            }
        })
    }

    placeShip(name, x, y, orientation) {
        let ship = this.ships.$value.find(s => s.name == name);

        if (this.gameboard.ships.find(s => s.name == name)){
            let ship = this.gameboard.ships.find(s => s.name == name);
            let indexShip = this.gameboard.ships.indexOf(ship);
            let removedItem = this.gameboard.ships.splice(indexShip, 1);
        }

        try {
            let cell = new Cell(parseInt(x), parseInt(y));
            this.gameboard.placeShip(ship, cell, orientation);
        } catch(e) {
            this.resetPlacement(name);
        }

        console.log(this.gameboard);
    }

    resetPlacement(shipName) {
        $('#' + this.slugify_shipname(shipName)).attr('style', 'position: absolute;');
    }

    observe() {
        Ship.getAll(this.api)
            .then(ships => {
                this.ships.$value = ships;

                let ship_template = ``;

                for (let i = 0; i < this.ships.$value.length; i++) {
                    let ship = this.slugify_shipname(this.ships.$value[i].name);

                    ship_template += `<img id="${ship}" class="placeable-ship vertical" data-length="${this.ships.$value[i].length}" data-name="${this.ships.$value[i].name}" src="img/ships/${ship}-vertical.png"/>`;
                }

                $('#placeable-ships').append(ship_template);

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