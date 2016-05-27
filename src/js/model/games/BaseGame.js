export default class BaseGame {
    /**
     * Created a new instance of the BaseGame class
     *
     * @param id
     * @param state
     */
    constructor(id, state) {
        this.id = id;
        this.state = state;
    }

    /**
     * Delete all the games for the current User
     *
     * @param api BattleshipApi
     * @param callback {function}
     */
    static deleteAll(api, callback) {
        api.apiDelete({route: api.routes.currentUserGames}, callback);
    }
}