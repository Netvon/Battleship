import UserGame from './UserGame';
import PlayerGameboard from "../board/PlayerGameboard";
import EnemyGameboard from "../board/EnemyGameboard";

export default class StartedGame extends UserGame {
    /**
     * Constructs a new instance of the StartedGame class
     *
     * @param id {number}
     * @param state {string}
     * @param enemyId {string}
     * @param enemyName {string}
     * @param isPlayerTurn {boolean}
     * @param playerGameBoard {PlayerGameboard}
     * @param enemyGameBoard
     */
    constructor(id, state, enemyId, enemyName, isPlayerTurn, playerGameBoard, enemyGameBoard) {
        super(id, state, enemyId, enemyName);

        this.isPlayerTurn = isPlayerTurn;
        this.playerGameBoard = playerGameBoard;
        this.enemyGameBoard = enemyGameBoard;
    }

    /**
     * Fires a shot on a given Cell at the opponent's board
     *
     * @param api {BattleshipApi}
     * @param cell {Cell}
     * @param callback {function}
     */
    doShot(api, cell, callback) {
        if(!this.isPlayerTurn)
            throw new Error(`You cannot fire a shot in Game#${this.id} because it is not your turn`);

        if (api === undefined || api === null)
            throw new Error("The 'api' parameter on StartedGame.doShot cannot be null");

        if (typeof callback !== 'function')
            throw new Error("The 'callback' parameter on StartedGame.doShot has to be a function");

        api.apiPost({route: api.routes.gameShotById, parameter: this.id}, cell.toJson(), data => {
            callback(data);
        });
    }

    /**
     * Returns a new instance of the StaredGame class by ID
     *
     * @param api {BattleshipApi}
     * @param id {number}
     * @param callback {function}
     */
    static get(api, id, callback) {
        if (api === undefined || api === null)
            throw new Error("The 'api' parameter on StartedGame.get cannot be null");

        if (typeof callback !== 'function')
            throw new Error("The 'callback' parameter on StartedGame.get has to be a function");

        api.apiGet({route: api.routes.gameById, parameter: id}, data => {
            if (data.error !== undefined)
                throw new Error(data.error);

            callback(StartedGame.fromJson(data));
        });
    }

    /**
     * Converts a Json Object to a new instance of the StartedGame class
     *
     * @param jsonObject
     * @returns {StartedGame}
     */
    static fromJson(jsonObject) {

        console.log(jsonObject);

        return new StartedGame(jsonObject._id,
            jsonObject.status,
            jsonObject.enemyId,
            jsonObject.enemyName,
            jsonObject.yourTurn,
            PlayerGameboard.fromJson(jsonObject.myGameboard),
            EnemyGameboard.fromJson(jsonObject.enemyGameboard));
    }
}