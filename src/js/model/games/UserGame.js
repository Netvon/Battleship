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
        return api.apiGet({route: BattleshipApi.routes.currentUserGames})
            .then(data => {
                let userGames = [];

                data.forEach(item => {
                    userGames.push(UserGame.fromJson(item));
                });

                return userGames;
            });
    }

    /**
     *
     * @param api
     * @param id
     * @returns {Promise}
     */
    static get(api, id) {
        return UserGame.getForCurrentUser(api)
            .then(games => {
                return games.find(game => game.id === id);
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