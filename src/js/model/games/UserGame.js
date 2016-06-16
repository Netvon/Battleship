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
     * @return {Promise}
     */
    static getForCurrentUser(api) {
        if (!(api instanceof BattleshipApi))
            throw new TypeError("The 'api' parameter on UserGame.getForUser cannot be null");

        return new Promise((resolve, reject) => {
            api.apiGet({route: BattleshipApi.routes.currentUserGames}).then(data => {
                let userGames = [];

                data.forEach(item => {
                    userGames.push(UserGame.fromJson(item));
                });

                resolve(userGames);
            }).then(reject);
        });
    }

    /**
     *
     * @param api
     * @param id
     * @returns {Promise}
     */
    static get(api, id) {
        return new Promise((resolve, reject) => {
            UserGame.getForCurrentUser(api).then(games => {
                resolve(games.find(game => game.id === id));
            }).catch(reject)
        });
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