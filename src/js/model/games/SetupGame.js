import BaseGame from './BaseGame';
import StartedGame from './StartedGame';
import {STATE} from '../../util/BattleshipConst';
import BattleshipApi from '../../util/BattleshipApi';

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
     * @param callback {function|null}
     */
    static create(api, callback, isAi = false) {
        if (!(api instanceof BattleshipApi))
            throw new TypeError("The 'api' parameter on SetupGame.create cannot be null");

        let route = BattleshipApi.routes.createGame;
        if (isAi)
            route = BattleshipApi.routes.createGameWithAi;

        api.apiGet({route}, data => {
            if (callback !== null)
                callback(SetupGame.fromJson(data));
        });
    }

    /**
     * Submit a Gameboard to the API.
     *
     * @param api {BattleshipApi}
     * @param gameboard {Gameboard}
     * @param callback {function}
     */
    submitGameboard(api, gameboard, callback) {

        if(this.state !== STATE.SETUP)
            throw new Error(`You cannot send a Gameboard to a game that is not in the ${STATE.SETUP} state. Current state: ${this.state}`);

        if (!(api instanceof BattleshipApi))
            throw new TypeError("The 'api' parameter on SetupGame.submitGameboard cannot be null");

        if (typeof callback !== 'function')
            throw new TypeError("The 'callback' parameter on SetupGame.submitGameboard has to be a function");

        api.apiPost({route: BattleshipApi.routes.gameSetupById, parameter: this.id}, gameboard.toJson(), data => {

            if (data.msg !== undefined && data.msg === 'success') {
                this.state = data.status;

                if(this.state === STATE.STARTED)
                    StartedGame.get(api, this.id, callback);
                else
                    callback(this);
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