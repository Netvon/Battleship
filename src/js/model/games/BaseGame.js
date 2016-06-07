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
     * @param callback {function|null}
     */
    static deleteAll(api, callback) {
        if (!(api instanceof BattleshipApi))
            throw new Error("The 'api' parameter on User.deleteAllGames cannot be null");

        api.apiDelete({route: BattleshipApi.routes.currentUserGames}, callback);
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
        if(!BaseGame.isValidState(value))
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
}