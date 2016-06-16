import UserGame from './UserGame';
import PlayerGameboard from "../board/PlayerGameboard";
import EnemyGameboard from "../board/EnemyGameboard";
import BattleshipApi from '../../util/BattleshipApi';

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
     * @return {Promise}
     */
    doShot(api, cell) {

        if (!this.isPlayerTurn) {
            let msg = `You cannot fire a shot in Game#${this.id} because it is not your turn`;
            return Promise.reject(msg);
        }

        return api.apiPost({route: BattleshipApi.routes.gameShotById, parameter: this.id}, cell.toJson());
    }

    /**
     * Returns a new instance of the StaredGame class by ID
     *
     * @param api {BattleshipApi}
     * @param id {number}
     * @return {Promise}
     */
    static get(api, id) {
        return api.apiGet({route: BattleshipApi.routes.gameById, parameter: id})
            .then(data => {
                if (data.error !== undefined) {
                    throw new Error(data.error);
                }

                return StartedGame.fromJson(data);
            });


    }

    /**
     * Converts a Json Object to a new instance of the StartedGame class
     *
     * @param jsonObject
     * @returns {StartedGame}
     */
    static fromJson(jsonObject) {

        return new StartedGame(jsonObject._id,
            jsonObject.status,
            jsonObject.enemyId,
            jsonObject.enemyName,
            jsonObject.yourTurn,
            PlayerGameboard.fromJson(jsonObject.myGameboard),
            EnemyGameboard.fromJson(jsonObject.enemyGameboard));
    }
}