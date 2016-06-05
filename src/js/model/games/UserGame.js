import BaseGame from './BaseGame';

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
     */
    static getForCurrentUser(api, callback) {
        if (api === undefined || api === null)
            throw new Error("The 'api' parameter on UserGame.getForUser cannot be null");

        if (typeof callback !== 'function')
            throw new Error("The 'callback' parameter on UserGame.getForUser has to be a function");

        api.apiGet({route: BattleshipApi.routes.currentUserGames}, data => {
            let userGames = [];

            data.forEach(item => {
                userGames.push(UserGame.fromJson(item));
            });

            callback(userGames);
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