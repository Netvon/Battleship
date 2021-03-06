import Cell from './Cell';

export default class Shot extends Cell {
    /**
     * Constructs a new instance of the Shot class
     *
     * @param x {string|number}
     * @param y {number}
     * @param id {number}
     * @param isHit {boolean|null}
     */
    constructor(x, y, id, isHit = null) {
        super(x, y);

        if(typeof id !== 'number' || id < 0)
            throw new Error('The ID of a shot cannot be negative and must be a number');
        
        this.id = id;

        if(isHit !== null)
            this.isHit = isHit;
    }

    /**
     * Converts a JSON object to a Shot
     *
     * @param jsonObject
     * @returns {Cell}
     */
    static fromJson(jsonObject) {
        let hit = null;
        if(jsonObject.isHit !== undefined)
            hit = jsonObject.isHit;

        return new Shot(jsonObject.x, jsonObject.y, jsonObject._id, hit);
    }
}