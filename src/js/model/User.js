import JsonBase from './../util/JsonBase';
import UserGame from './../model/games/UserGame';
import Persistence from './../util/Persistence';
import * as bs from '../util/BattleshipConst';
import BattleshipApi from '../util/BattleshipApi';

export default class User extends JsonBase {
    /**
     * Constructs a new instance of the User class
     *
     * @param email {string}
     * @param name {string}
     */
    constructor(email, name) {
        super();

        if (typeof email !== 'string')
            throw new TypeError("The 'email' parameter on the User class must be a string");

        if (typeof name !== 'string')
            throw new TypeError("The 'name' parameter on the User class must be a string");

        this.email = email;
        this.name = name;
    }

    /**
     * Returns the current User
     *
     * @param api {BattleshipApi}
     * @param callback {function}
     */
    static getCurrent(api, callback) {

        if (Persistence.hasKey(bs.PER_USERKEY)) {
            callback(User.fromJson(JSON.parse(Persistence.get(bs.PER_USERKEY))));
        }

        if (api === undefined || api === null)
            throw new Error("The 'api' parameter on User.getCurrent cannot be null");

        if (typeof callback !== 'function')
            throw new TypeError("The 'callback' parameter on User.getCurrent has to be a function");

        api.apiGet({route: BattleshipApi.routes.currentUser}, data => {
            Persistence.set(bs.PER_USERKEY, JSON.stringify(data));
            callback(User.fromJson(data));
        });
    }

    /**
     * Returns an Array of all Games the current user is participating in.
     *
     * @param api {BattleshipApi}
     * @param callback {function}
     * @returns {*}
     */
    static getGames(api, callback) {
        return UserGame.getForCurrentUser(api, callback);
    }

    /**
     * Removes all Games the current user is participating in.
     *
     * @param api {BattleshipApi}
     * @param callback {function|null}
     */
    static deleteAllGames(api, callback) {
        UserGame.deleteAll(api, callback);
    }

    /**
     * Converts a JSON object to a User
     *
     * @param jsonObject {{_id: (string|*), name: (string|*)}}
     * @returns {User}
     */
    static fromJson(jsonObject) {
        return new User(jsonObject._id, jsonObject.name);
    }
}