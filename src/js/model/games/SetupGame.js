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
     * @return {Promise}
     */
    static create(api, isAi = false) {
        if (!(api instanceof BattleshipApi))
            throw new TypeError("The 'api' parameter on SetupGame.create cannot be null");

        return new Promise((resolve, reject) => {
            let route = BattleshipApi.routes.createGame;
            if (isAi)
                route = BattleshipApi.routes.createGameWithAi;

            api.apiGet({route}).then(data => {
                    resolve(SetupGame.fromJson(data));
            }).catch(reject);
        });


    }

    /**
     * Submit a Gameboard to the API.
     *
     * @param api {BattleshipApi}
     * @param gameboard {Gameboard}
     * @return {Promise}
     */
    submitGameboard(api, gameboard) {

        if (!(api instanceof BattleshipApi))
            throw new TypeError("The 'api' parameter on SetupGame.submitGameboard cannot be null");

        return new Promise((resolve, reject) => {
            if(this.state !== STATE.SETUP) {
                let msg = `You cannot send a Gameboard to a game that is not in the ${STATE.SETUP} state. Current state: ${this.state}`;
                reject(msg);
                throw new Error(msg);
            }

            api.apiPost({route: BattleshipApi.routes.gameSetupById, parameter: this.id}, gameboard.toJson()).then(data => {

                if (data.msg !== undefined && data.msg === 'success') {
                    this.state = data.status;

                    if(this.state === STATE.STARTED)
                        StartedGame.get(api, this.id).then(resolve);
                    else
                        resolve(this);
                }

            }).catch(reject);
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