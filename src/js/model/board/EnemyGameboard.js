import JsonBase from './../../util/JsonBase';
import Shot from './../Shot';

export default class EnemyGameboard extends JsonBase {
    constructor(id, ...shots) {
        super();

        this.id = id;
        this.shots = [...shots];
    }

    static fromJson(jsonObject) {
        let shots = [];

        if (jsonObject.shots !== undefined && jsonObject.shots !== null) {

            jsonObject.shots.forEach(shot => {
                shots.push(Shot.fromJson(shot));
            });
        }

        return new EnemyGameboard(jsonObject._id, ...shots);
    }
}