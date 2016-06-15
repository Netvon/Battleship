import JsonBase from '../../util/JsonBase'
import BaseGame from '../games/BaseGame'

export default class UpdateEventArguments extends JsonBase {
    constructor(gameId, state) {
        super();
        
        this.gameId = gameId;

        if(!BaseGame.isValidState(state))
            throw new Error(`The state: '${state}' is not a valid game state`);

        this.state = state;
    }

    static fromJson(jsonObject) {
        return new UpdateEventArguments(jsonObject.gameId, jsonObject.status);
    }
}