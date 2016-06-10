import JsonBase from '../../util/JsonBase'

export default class UpdateEventArguments extends JsonBase {
    constructor(gameId, userWhoHasTurn) {
        this.gameId = gameId;
        this.userWhoHasTurn = userWhoHasTurn;
    }

    static fromJson(jsonObject) {
        return new UpdateEventArguments(jsonObject.gameId, jsonObject.user);
    }
}