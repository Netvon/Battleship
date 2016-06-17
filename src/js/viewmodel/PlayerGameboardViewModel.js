/**
 * Created by Sander on 16-06-16.
 */

import PlayerGameboard from '../model/board/PlayerGameboard';

export default class PlayerGameboardViewModel extends PlayerGameboard {

    constructor(id, shots, ...ships) {
        super(id, shots, ...ships);
    }

    draw() {
        let html = ``;

        html += `<div class='gameboard'>`;
        html += `<table class='player-grid'>`;

        for (let y = bs.CELLMIN; y <= bs.CELLMAX; y++)
        {
            html
                += `<tr data-y="${y}">`;

            for (let x = bs.CELLMIN; x <= bs.CELLMAX; x++) {
                html += `<td data-x="${x}" data-y="${y}"></td>`;
            }

            html += `</tr>`;
        }

        html += `</table>`;

        html += `</div>`;

        // Replace by ship assets
        for (let i = 1; i <= bs.SHIPMAX; i++) {
            html += `<div class="test-block"></div>`;
        }

        $('header').append(html);

        $('.player-grid td').droppable({
            // accept:
            // function(d) {
            //     console.log(d, this);
            //     return true;
            // },
            drop: function (event, ui) {
                console.log(event.target);
            }
        });
        $('.test-block').draggable({revert: 'invalid', snap: '.player-grid td', snapMode: 'outer'});

    }
}