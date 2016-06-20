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
     * @returns {Promise}
     */
    static getCurrent(api) {

        if (Persistence.hasKey(bs.PER_USERKEY)) {
            return Promise.resolve(User.fromJson(JSON.parse(Persistence.get(bs.PER_USERKEY))));
        }

        return api.apiGet({route: BattleshipApi.routes.currentUser})
            .then(data => {
                Persistence.set(bs.PER_USERKEY, JSON.stringify(data));
                return User.fromJson(data);
            });
    }

    static hallo() {
        console.log('hallo')
    }

    /**
     * Returns an Array of all Games the current user is participating in.
     *
     * @param api {BattleshipApi}
     * @returns {Promise}
     */
    static getGames(api) {
        return UserGame.getForCurrentUser(api);
    }

    /**
     * Removes all Games the current user is participating in.
     *
     * @param api {BattleshipApi}
     * @return {Promise}
     */
    static deleteAllGames(api) {
        return UserGame.deleteAll(api);
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