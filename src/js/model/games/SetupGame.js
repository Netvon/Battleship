import BaseGame from './BaseGame';
import StartedGame from './StartedGame';

export default class SetupGame extends BaseGame {
    /**
     * Constructs a new instance of the SetupGame class
     *
     * @param id {number}
     * @param player1 {string}
     * @param state {string}
     * @param isAi {boolean}
     */
    constructor(id, player1, state, isAi) {
        super(id, state);

        this.player1 = player1;
        this.isAi = isAi;
    }

    /**
     * Creates a new SetupGame
     *
     * @param api {BattleshipApi}
     * @param isAi {boolean}
     * @param callback {function}
     */
    static create(api, callback, isAi = false) {
        let route = api.routes.createGame;
        if (isAi)
            route = api.routes.createGameWithAi;

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
        api.apiPost({route: api.routes.gameSetupById, parameter: this.id}, gameboard.toJson(), data => {

            if (data.msg !== undefined && data.msg === 'success') {
                this.state = data.status;

                if(this.state = 'started')
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
        return new SetupGame(jsonObject._id, jsonObject.player1, jsonObject.status, jsonObject.isAI);
    }
}