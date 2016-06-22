import JsonBase from '../../util/JsonBase'

export default class TurnEventArguments extends JsonBase {
    constructor(gameId, currentUser) {
        super();

        this.gameId = gameId;
        this.currentUser = currentUser;
    }

    static fromJson(jsonObject) {
        return new TurnEventArguments(jsonObject.gameId, jsonObject.turn);
    }
}