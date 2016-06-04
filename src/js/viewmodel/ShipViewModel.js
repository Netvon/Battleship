import GameboardShip from '../model/ships/GameboardShip';

export default class ShipViewModel extends GameboardShip {
    /**
     *
     * @param id {id|string}
     * @param name {string}
     * @param length {number}
     * @param startCell {Cell}
     * @param orientation {string}
     * @param sprite
     */
    constructor(id, name, length, startCell, orientation, sprite) {
        super(id, name, length, startCell, orientation, null);
        
        if (sprite === undefined)
            this.sprite = 'img/placeholder.gif';
        else
            this.sprite = sprite;
    }

    static fromShip(ship, location, orientation, sprite) {
        return new ShipViewModel(ship.id, ship.name, ship.length, location, orientation, sprite);
    }
}