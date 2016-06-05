import JsonBase from './../../util/JsonBase';
import Shot from './../Shot';

export default class EnemyGameboard extends JsonBase {
    /**
     * Constructs a new instance of the EnemyGameboard class
     * @param id {number}
     * @param shots {Shot}
     */
    constructor(id, ...shots) {
        super();
        
        this.id = id;
        this.shots = [...shots];
    }

    /**
     * Converts a Json Object to a new instance of EnemyGameboard
     * 
     * @param jsonObject
     * @returns {EnemyGameboard}
     */
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