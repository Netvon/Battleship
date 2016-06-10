import JsonBase from '../../util/JsonBase'
import BaseGame from '../games/BaseGame'

export default class UpdateEventArguments extends JsonBase {
    constructor(gameId, state) {
        this.gameId = gameId;

        if(!BaseGame.isValidState(state))
            throw new Error(`The state: '${state}' is not a valid game state`);

        this.status = status;
    }

    static fromJson(jsonObject) {
        return new UpdateEventArguments(jsonObject.gameId, jsonObject.status);
    }
}