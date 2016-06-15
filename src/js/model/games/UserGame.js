import BaseGame from './BaseGame';
import BattleshipApi from '../../util/BattleshipApi';

export default class UserGame extends BaseGame {
    /**
     * Constructs a new instance of the UserGame class.
     *
     * @param id {string}
     * @param state {string}
     * @param enemyId {string}
     * @param enemyName {string}
     * @param winner {null|string}
     */
    constructor(id, state, enemyId, enemyName, winner = null) {
        super(id, state);

        this.enemyId = enemyId;
        this.enemyName = enemyName;
        this.winner = winner;
    }

    /**
     * Returns an Array of all Games this user is participating in.
     *
     * @param api {BattleshipApi}
     * @param callback {function}
     * @param fail {function|null}
     */
    static getForCurrentUser(api, callback, fail = null) {
        if (!(api instanceof BattleshipApi))
            throw new TypeError("The 'api' parameter on UserGame.getForUser cannot be null");

        if (typeof callback !== 'function')
            throw new TypeError("The 'callback' parameter on UserGame.getForUser has to be a function");

        api.apiGet({route: BattleshipApi.routes.currentUserGames}, data => {
            let userGames = [];

            data.forEach(item => {
                userGames.push(UserGame.fromJson(item));
            });

            callback(userGames);
        }, fail);
    }

    static get(api, id, callback, fail = null) {
        UserGame.getForCurrentUser(api, games => {
            callback(games.find(game => game.id === id));
        }, fail)
    }

    /**
     * Converts a Json Object to a new instance of the UserGame class
     * 
     * @param jsonObject
     * @returns {UserGame}
     */
    static fromJson(jsonObject) {
        return new UserGame(jsonObject._id,
            jsonObject.status,
            jsonObject.enemyId,
            jsonObject.enemyName,
            jsonObject.winner);
    }
}