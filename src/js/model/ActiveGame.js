import BaseGame from './BaseGame';

export default class ActiveGame extends BaseGame {
    /**
     * Created a new instance of the ActiveGame class
     *
     * @param id {number}
     * @param state {string}
     * @param enemyId {string}
     * @param enemyName {string}
     * @param isPlayerTurn {boolean}
     * @param playerGameBoard
     * @param enemyGameBoard
     */
    constructor(id, state, enemyId, enemyName, isPlayerTurn, playerGameBoard, enemyGameBoard) {
        super(id, state);

        this.enemyId = enemyId;
        this.enemyName = enemyName;
        this.isPlayerTurn = isPlayerTurn;
        this.playerGameBoard = playerGameBoard;
        this.enemyGameBoard = enemyGameBoard;
    }

    /**
     *
     * @param api BattleshipApi
     * @param id {number}
     * @param callback {function}
     */
    static get(api, id, callback) {
        api.apiGet({route: api.routes.gameById, parameter: id}, data => {

        });
    }
}