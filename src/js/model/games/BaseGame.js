import JsonBase from './../../util/JsonBase'

export default class BaseGame extends JsonBase {
    /**
     * Created a new instance of the BaseGame class
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
     * @param callback {function}
     */
    static deleteAll(api, callback) {
        api.apiDelete({route: api.routes.currentUserGames}, callback);
    }

    static fromJson(jsonObject) {
        return new BaseGame(jsonObject._id, jsonObject.status);
    }

    get state() {
        return this._state;
    }

    set state(value) {
        if(!BaseGame.isValidState(value))
            throw new Error(`The state: '${value}' is not a valid game state`);

        this._state = value;
    }

    toJson() {
        return {
            "_id": this.id,
            "status": this.state
        };
    }

    /**
     *
     * @param state {string}
     * @returns {boolean}
     */
    static isValidState(state) {
        switch (state.toLowerCase()) {
            case 'queue':
            case 'setup':
            case 'started':
            case 'done':
                return true;
        }

        return false;
    }
}