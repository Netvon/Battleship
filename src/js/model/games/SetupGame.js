import BaseGame from './BaseGame';
import StartedGame from './StartedGame';
import {STATE} from '../../util/BattleshipConst';
import BattleshipApi from '../../util/BattleshipApi';
import UserGame from "./UserGame";

export default class SetupGame extends BaseGame {
    /**
     * Constructs a new instance of the SetupGame class
     *
     * @param id {number}
     * @param player1 {string}
     * @param player2 {string}
     * @param state {string}
     * @param isAi {boolean}
     */
    constructor(id, player1, player2, state, isAi) {
        super(id, state);

        this.player1 = player1;
        this.player2 = player2;
        this.isAi = isAi;
    }

    /**
     * Creates a new SetupGame
     *
     * @param api {BattleshipApi}
     * @param isAi {boolean}
     * @return {Promise}
     */
    static create(api, isAi = false) {

        let route = BattleshipApi.routes.createGame;
        if (isAi)
            route = BattleshipApi.routes.createGameWithAi;

        return api.apiGet({route})
            .then(data => {
                return SetupGame.fromJson(data);
            });


    }

    /**
     * Submit a Gameboard to the API.
     *
     * @param api {BattleshipApi}
     * @param gameboard {Gameboard}
     * @param id {number}
     * @return {Promise}
     */
    static submitGameboard(api, gameboard, id) {

        // if (this.state !== STATE.SETUP) {
        //     let msg = `You cannot send a Gameboard to a game that is not in the ${STATE.SETUP} state. Current state: ${this.state}`;
        //     return Promise.reject(msg);
        // }

        return api.apiPost({route: BattleshipApi.routes.gameSetupById, parameter: id}, gameboard.toJson())
            .then(data => {
                
                if (data.msg !== undefined && data.msg !== 'success') {
                    return Promise.reject(data);
                }

            });
    }

    /**
     * Converts a Json Object to a new instance of the SetupGame class
     *
     * @param jsonObject
     * @returns {SetupGame}
     */
    static fromJson(jsonObject) {
        return new SetupGame(jsonObject._id, jsonObject.player1, jsonObject.player2, jsonObject.status, jsonObject.isAI);
    }
}