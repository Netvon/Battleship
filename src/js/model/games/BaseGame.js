import JsonBase from './../../util/JsonBase'
import {STATE} from '../../util/BattleshipConst';
import BattleshipApi from '../../util/BattleshipApi';

export default class BaseGame extends JsonBase {

    /**
     * Constructs a new instance of the BaseGame class
     *
     * @param id {string}
     * @param state {string}
     */
    constructor(id, state) {
        super();

        this.id = id;
        this.state = state;
    }

    /**
     * Delete all the games for the current User
     *
     * @param api {BattleshipApi}
     * @returns {Promise}
     */
    static deleteAll(api) {
        if (!(api instanceof BattleshipApi))
            throw new Error("The 'api' parameter on User.deleteAllGames cannot be null");

        return api.apiDelete({route: BattleshipApi.routes.currentUserGames});
    }

    /**
     * Converts a Json Object to a new instance of the BaseGame class.
     *
     * @param jsonObject
     * @returns {BaseGame}
     */
    static fromJson(jsonObject) {
        return new BaseGame(jsonObject._id, jsonObject.status);
    }

    /**
     * Returns the current state of the game.
     *
     * @returns {*}
     */
    get state() {
        return this._state;
    }

    /**
     * Set the state of the game
     *
     * @param value
     */
    set state(value) {
        if (!BaseGame.isValidState(value))
            throw new Error(`The state: '${value}' is not a valid game state`);

        this._state = value;
    }

    /**
     * Converts this BaseGame to a Json Object
     *
     * @returns {{_id: (string|*), status: *}}
     */
    toJson() {
        return {
            "_id": this.id,
            "status": this.state
        };
    }

    /**
     * Checks if a state string is valid.
     * Valid values include;
     *  - queue
     *  - setup
     *  - started
     *  - done
     *
     * @param state {string}
     * @returns {boolean}
     */
    static isValidState(state) {
        switch (state.toLowerCase()) {
            case STATE.QUEUE:
            case STATE.SETUP:
            case STATE.STARTED:
            case STATE.DONE:
                return true;
        }

        return false;
    }

    /**
     *
     * @param api {BattleshipApi}
     * @param id
     * @param callback {function}
     */
    onUpdate(id, api, callback) {
        api.onUpdate(id, update => {
            if (update.gameId === this.id) {
                this.state = update.state;
                callback(update);
            }
        })
    }

    /**
     *
     * @param api {BattleshipApi}
     * @param id {string}
     * @param callback {function}
     */
    onTurn(id, api, callback) {
        api.onTurn(id, turn => {
            if (turn.gameId === this.id)
                callback(turn);
        })
    }

    /**
     *
     * @param api {BattleshipApi}
     * @param id {string}
     * @param callback {function}
     */
    onShot(id, api, callback) {
        api.onShot(id, shot => {
            if (shot.gameId === this.id)
                callback(shot);
        })
    }
}