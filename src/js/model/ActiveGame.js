export default class ActiveGame {
    constructor(id, status, enemyId, enemyName) {
        this.id = id;

        switch (status) {
            case 'queue':
            case 'setup':
            case 'started':
            case 'done':
                this.status = status;
                break;
        }

        this.enemyId = enemyId;
        this.enemyName = enemyName;
    }

    jsonDecode(jsonObject) {
        this.id = jsonObject._id;
        this.status = jsonObject.status;
        this.enemyId = jsonObject.enemyId;
        this.enemyName = jsonObject.enemyName;

        if (jsonObject.winner !== undefined)
            this.winner = jsonObject.winner;
    }
}