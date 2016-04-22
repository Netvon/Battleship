function Ship(id, name, length) {
    this.name = name;
    this.id = id;
    this.length = length;
}

Ship.prototype = {
    jsonDecode: function(jsonObject)
    {
        this.id = jsonObject._id;
        this.name = jsonObject.name;
        this.length = jsonObject.length;
    }
};

module.exports = Ship;