import Ship from '../model/ships/Ship';

export default class ShipViewModel extends Ship {
    constructor(id, name, length, location, orientation, sprite) {
        super(id, name, length);

        this.location = location;

        switch (orientation) {
            case 'vertical':
            case 'horizontal':
                this.orientation = orientation;
                break;
            default:
                throw new Error('The "orientation" property of ShipViewModel must be "vertical" or "horizontal"');
                break;
        }

        if (sprite === undefined)
            this.sprite = 'img/placeholder.gif';
        else
            this.sprite = sprite;
    }

    jsonEncode() {
        return {
            _id: this.id,
            length: this.length,
            startCell: {},
            isVertical: false,
            __v: 0
        }
    }

    static fromShip(ship, location, orientation, sprite) {
        return new ShipViewModel(ship.id, ship.name, ship.length, location, orientation, sprite);
    }
}