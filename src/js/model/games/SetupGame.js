import BaseGame from './BaseGame';

export default class SetupGame extends BaseGame {
    /**
     * Created a new instance of the SetupGame class
     *
     * @param id
     * @param player1
     * @param state
     * @param isAi
     */
    constructor(id, player1, state, isAi) {
        super(id, state);

        this.player1 = player1;
        this.isAi = isAi;
    }

    /**
     * Creates a new SetupGame
     *
     * @param api BattleshipApi
     * @param isAi {boolean}
     * @param callback {function}
     */
    static create(api, callback, isAi = false) {
        let route = api.routes.createGame;
        if (isAi)
            route = api.routes.createGameWithAi;

        api.apiGet({route}, data => {
            callback(new SetupGame(data._id, data.player1, data.status, data.isAI));
        });
    }
}