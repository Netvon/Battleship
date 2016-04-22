function ShipViewModel(ship) {
    this.ship = ship;

    this.location = {
        x: 0,
        y: 0,
        orientation: 'vertical'
    };

    this.sprite = 'img/placeholder.gif';
}

ShipViewModel.prototype = {
    jsonEncode: function () {
        return {
            _id: this.ship.id,
            length: this.ship.length,
            startCell: {},
            isVertical: false,
            __v: 0
        }
    }
};

module.exports = ShipViewModel;