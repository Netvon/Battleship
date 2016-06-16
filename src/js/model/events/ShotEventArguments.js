import JsonBase from '../../util/JsonBase'
import Cell from '../../model/Cell';

export default class ShotEventArguments extends JsonBase {
    constructor(gameId, user, cell, result) {
        super();

        this.gameId = gameId;
        this.user = user;
        this.cell = cell;
        this.result = result;
    }

    set result(value) {

        switch(value) {
            case 'BOOM':
            case 'SPLASH':
            case 'WINNER':
            case 'FAIL':
                this._result = value;
                break;
            default:
                throw new Error(`The result '${value}' is not a valid result for ShotEventArguments`);
        }

        this._result = value;
    }

    get result() {
        return this._result;
    }

    static fromJson(jsonObject) {
        return new ShotEventArguments(jsonObject.gameId,
            jsonObject.user,
            new Cell(jsonObject.field.x, jsonObject.field.y),
            jsonObject.result)
    }
}