import JsonBase from '../../util/JsonBase'

export default class UpdateEventArguments extends JsonBase {
    constructor(gameId, currentUser) {
        super();

        this.gameId = gameId;
        this.currentUser = currentUser;
    }

    static fromJson(jsonObject) {
        return new UpdateEventArguments(jsonObject.gameId, jsonObject.user);
    }
}