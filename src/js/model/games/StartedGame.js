import UserGame from './UserGame';
import PlayerGameboard from "../board/PlayerGameboard";
import EnemyGameboard from "../board/EnemyGameboard";

export default class StartedGame extends UserGame {
    /**
     * Created a new instance of the StartedGame class
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

    doShot(api, cell, callback) {
        if (api === undefined || api === null)
            throw new Error("The 'api' parameter on StartedGame.doShot cannot be null");

        if (callback === undefined || callback === null || typeof callback !== 'function')
            throw new Error("The 'callback' parameter on StartedGame.doShot has to be a function");

        api.apiPost({route: api.routes.gameShotById, parameter: this.id}, cell.toJson(), data => {
            callback(data);
        });
    }

    /**
     *
     * @param api {BattleshipApi}
     * @param id {number}
     * @param callback {function}
     */
    static get(api, id, callback) {
        if (api === undefined || api === null)
            throw new Error("The 'api' parameter on StartedGame.get cannot be null");

        if (callback === undefined || callback === null || typeof callback !== 'function')
            throw new Error("The 'callback' parameter on StartedGame.get has to be a function");

        api.apiGet({route: api.routes.gameById, parameter: id}, data => {
            if (data.error !== undefined)
                throw new Error(data.error);

            callback(StartedGame.fromJson(data));
        });
    }

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