(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _BattleshipApi = require('./util/BattleshipApi');

var _BattleshipApi2 = _interopRequireDefault(_BattleshipApi);

var _Ship = require('./model/ships/Ship');

var _Ship2 = _interopRequireDefault(_Ship);

var _Hu = require('./util/Hu');

var _Hu2 = _interopRequireDefault(_Hu);

var _UserViewModel = require('./viewmodel/UserViewModel');

var _UserViewModel2 = _interopRequireDefault(_UserViewModel);

var _SetupGame = require('./model/games/SetupGame');

var _SetupGame2 = _interopRequireDefault(_SetupGame);

var _Persistence = require('./util/Persistence');

var _Persistence2 = _interopRequireDefault(_Persistence);

var _Gameboard = require('./model/board/Gameboard');

var _Gameboard2 = _interopRequireDefault(_Gameboard);

var _Cell = require('./model/Cell');

var _Cell2 = _interopRequireDefault(_Cell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {

    let allShips = [];

    if (!_Persistence2.default.hasKey('token')) _Persistence2.default.set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InRtZS52YW5uaW13ZWdlbkBzdHVkZW50LmF2YW5zLm5sIg.4yuhuKWBCnQuoxAeVL2xQ3Ua41YPLRqT7F8FkhxUcKI');

    let token = _Persistence2.default.get('token');
    // console.log(token);

    // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InRtZS52YW5uaW13ZWdlbkBzdHVkZW50LmF2YW5zLm5sIg.4yuhuKWBCnQuoxAeVL2xQ3Ua41YPLRqT7F8FkhxUcKI
    var battleshipApi = new _BattleshipApi2.default(token);

    _UserViewModel2.default.getCurrent(battleshipApi, user => user.displayOn('#user-info'));

    _SetupGame2.default.deleteAll(battleshipApi, e => {

        _Ship2.default.getAll(battleshipApi, ships => {

            allShips = ships;

            ships.forEach(ship => _Hu2.default.queryAppend('ul#ship-list', `<li>${ ship.name }</li>`));

            _SetupGame2.default.create(battleshipApi, game => {
                console.log(`Created new game: ${ game.id }`);
                _UserViewModel2.default.getGames(battleshipApi, games => {
                    games.forEach(g => _Hu2.default.queryAppend('#all-games > ul', `<li id="g-${ g.id }">${ g.id } - ${ g.state }</li>`));
                });

                let gameboard = new _Gameboard2.default();
                gameboard.placeShip(allShips[0], new _Cell2.default(1, 1), 'vertical');
                gameboard.placeShip(allShips[1], new _Cell2.default(2, 1), 'vertical');
                gameboard.placeShip(allShips[2], new _Cell2.default(3, 1), 'vertical');
                gameboard.placeShip(allShips[3], new _Cell2.default(4, 1), 'vertical');
                gameboard.placeShip(allShips[4], new _Cell2.default(5, 1), 'vertical');

                game.submitGameboard(battleshipApi, gameboard, data => {
                    console.log("Submitted Gameboard");
                    console.log(data);

                    _Hu2.default.querySet(`#g-${ game.id }`, `${ game.id } - ${ game.state }`);

                    data.doShot(battleshipApi, new _Cell2.default(1, 1), data => console.log(`Shot output: ${ data }`));
                });
            }, true);
        });
    });
})();

},{"./model/Cell":2,"./model/board/Gameboard":6,"./model/games/SetupGame":9,"./model/ships/Ship":13,"./util/BattleshipApi":14,"./util/Hu":17,"./util/Persistence":19,"./viewmodel/UserViewModel":20}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _JsonBase = require('./../util/JsonBase');

var _JsonBase2 = _interopRequireDefault(_JsonBase);

var _BattleshipConst = require('../util/BattleshipConst');

var bs = _interopRequireWildcard(_BattleshipConst);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Cell extends _JsonBase2.default {
    /**
     * Constructs a new instance of the Cell class
     *
     * @param x {number|string}
     * @param y {number}
     */
    constructor(x, y) {
        super();

        if (typeof x === 'number') x = String.fromCharCode(x - 1 + bs.CHARSTART);

        this._x = x.toLowerCase();
        this._y = y;

        // console.log(`{x: ${this.x}, y: ${this.y}}`);

        if (this.x < bs.CELLMIN || this.x > bs.CELLMAX) throw new RangeError(`The X coordinate on a Cell must be between ${ bs.CELLMIN } and ${ bs.CELLMAX }`);

        if (this.y < bs.CELLMIN || this.y > bs.CELLMAX) throw new RangeError(`The Y coordinate on a Cell must be between ${ bs.CELLMIN } and ${ bs.CELLMAX }`);
    }

    /**
     * Returns the X coordinate in number form
     *
     * @returns {number}
     */
    get x() {
        return this._x.charCodeAt(0) - bs.CHARSTART + 1;
    }

    /**
     * Returns the X coordinate in letter form
     *
     * @returns {string}
     */
    get xLetter() {
        return this._x;
    }

    /**
     * Returns the Y coordinate in number form
     *
     * @returns {number}
     */
    get y() {
        return this._y;
    }

    /**
     * Converts this object to JSON
     *
     * @returns {{x: (string|*), y: (number|*)}}
     */
    toJson() {
        return {
            "x": this._x,
            "y": this._y
        };
    }

    /**
     * Converts a JSON object to a Cell
     *
     * @param jsonObject {{x: (string|*), y: (number|*)}}
     * @returns {Cell}
     */
    static fromJson(jsonObject) {
        return new Cell(jsonObject.x, jsonObject.y);
    }
}
exports.default = Cell;

},{"../util/BattleshipConst":15,"./../util/JsonBase":18}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Cell = require('./Cell');

var _Cell2 = _interopRequireDefault(_Cell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Shot extends _Cell2.default {
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

        if (typeof id !== 'number' || id < 0) throw new TypeError('The ID of a shot cannot be negative and must be a number');

        this.id = id;

        if (isHit !== null) this.isHit = isHit;
    }

    /**
     * Converts a JSON object to a Shot
     *
     * @param jsonObject
     * @returns {Cell}
     */
    static fromJson(jsonObject) {
        let hit = null;
        if (jsonObject.isHit !== undefined) hit = jsonObject.isHit;

        return new Shot(jsonObject.x, jsonObject.y, jsonObject._id, hit);
    }
}
exports.default = Shot;

},{"./Cell":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _JsonBase = require('./../util/JsonBase');

var _JsonBase2 = _interopRequireDefault(_JsonBase);

var _UserGame = require('./../model/games/UserGame');

var _UserGame2 = _interopRequireDefault(_UserGame);

var _Persistence = require('./../util/Persistence');

var _Persistence2 = _interopRequireDefault(_Persistence);

var _BattleshipConst = require('../util/BattleshipConst');

var bs = _interopRequireWildcard(_BattleshipConst);

var _BattleshipApi = require('../util/BattleshipApi');

var _BattleshipApi2 = _interopRequireDefault(_BattleshipApi);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class User extends _JsonBase2.default {
    /**
     * Constructs a new instance of the User class
     *
     * @param email {string}
     * @param name {string}
     */
    constructor(email, name) {
        super();

        if (typeof email !== 'string') throw new TypeError("The 'email' parameter on the User class must be a string");

        if (typeof name !== 'string') throw new TypeError("The 'name' parameter on the User class must be a string");

        this.email = email;
        this.name = name;
    }

    /**
     * Returns the current User
     *
     * @param api {BattleshipApi}
     * @param callback {function}
     */
    static getCurrent(api, callback) {

        if (_Persistence2.default.hasKey(bs.PER_USERKEY)) {
            callback(User.fromJson(JSON.parse(_Persistence2.default.get(bs.PER_USERKEY))));
        }

        if (api === undefined || api === null) throw new Error("The 'api' parameter on User.getCurrent cannot be null");

        if (typeof callback !== 'function') throw new TypeError("The 'callback' parameter on User.getCurrent has to be a function");

        api.apiGet({ route: _BattleshipApi2.default.routes.currentUser }, data => {
            _Persistence2.default.set(bs.PER_USERKEY, JSON.stringify(data));
            callback(User.fromJson(data));
        });
    }

    /**
     * Returns an Array of all Games the current user is participating in.
     *
     * @param api {BattleshipApi}
     * @param callback {function}
     * @returns {*}
     */
    static getGames(api, callback) {
        return _UserGame2.default.getForCurrentUser(api, callback);
    }

    /**
     * Removes all Games the current user is participating in.
     *
     * @param api {BattleshipApi}
     * @param callback {function|null}
     */
    static deleteAllGames(api, callback) {
        _UserGame2.default.deleteAll(api, callback);
    }

    /**
     * Converts a JSON object to a User
     *
     * @param jsonObject {{_id: (string|*), name: (string|*)}}
     * @returns {User}
     */
    static fromJson(jsonObject) {
        return new User(jsonObject._id, jsonObject.name);
    }
}
exports.default = User;

},{"../util/BattleshipApi":14,"../util/BattleshipConst":15,"./../model/games/UserGame":11,"./../util/JsonBase":18,"./../util/Persistence":19}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _JsonBase = require('./../../util/JsonBase');

var _JsonBase2 = _interopRequireDefault(_JsonBase);

var _Shot = require('./../Shot');

var _Shot2 = _interopRequireDefault(_Shot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class EnemyGameboard extends _JsonBase2.default {
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
                shots.push(_Shot2.default.fromJson(shot));
            });
        }

        return new EnemyGameboard(jsonObject._id, ...shots);
    }
}
exports.default = EnemyGameboard;

},{"./../../util/JsonBase":18,"./../Shot":3}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _JsonBase = require('./../../util/JsonBase');

var _JsonBase2 = _interopRequireDefault(_JsonBase);

var _GameboardShip = require('./../ships/GameboardShip');

var _GameboardShip2 = _interopRequireDefault(_GameboardShip);

var _BattleshipConst = require('../../util/BattleshipConst');

var bs = _interopRequireWildcard(_BattleshipConst);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Gameboard extends _JsonBase2.default {
    /**
     * Constructs a new instance of the Gameboard class
     *
     * @param ships {GameboardShip}
     */
    constructor(...ships) {
        super();

        this.ships = [...ships];

        if (this.ships.length > bs.SHIPMAX) throw new Error(`A Gameboard must contain ${ bs.SHIPMAX } ships`);
    }

    /**
     * Converts this object to JSON
     *
     * @returns {{ships: Array}}
     */
    toJson() {
        let temp = [];

        this.ships.forEach(ship => {
            temp.push(ship.toJson());
        });

        return {
            "ships": temp
        };
    }

    /**
     * Checks if all Ships fit on the Gameboard
     *
     * @returns {boolean}
     */
    get isValid() {
        let max = bs.CELLMAX;

        for (let ship of this.ships) {
            let x = ship.x;
            let y = ship.y;

            if (ship.isVertical && y + ship.length > max || !ship.isVertical && x + ship.length > max) return false;
        }
    }

    /**
     * Place a ship on the board.
     *
     * @param ship {Ship}
     * @param cell {Cell}
     * @param orientation {string}
     */
    placeShip(ship, cell, orientation) {

        if (this.canPlaceShip(ship, cell, orientation)) this.ships.push(_GameboardShip2.default.fromShip(ship, cell, orientation));else throw new Error(`The ship '${ ship.name }' cannot be placed on {x:${ cell.x }, y:${ cell.y }}`);
    }

    /**
     * Checks if a Cell can contain a given Ship
     *
     * @param ship {Ship}
     * @param cell {Cell}
     * @param orientation {string}
     * @returns {boolean}
     */
    canPlaceShip(ship, cell, orientation) {

        if (this.ships.length >= bs.SHIPMAX) return false;

        let shipBounds = ship.bounds(cell, orientation);

        if (shipBounds.xmax > bs.CELLMAX || shipBounds.ymax > bs.CELLMAX) return false;

        // console.log(this.ships);

        for (let placedShip of this.ships) {

            let pShipBounds = placedShip.bounds();

            if (!(pShipBounds.xmin > shipBounds.xmax || pShipBounds.xmax < shipBounds.xmin || pShipBounds.ymin > shipBounds.ymax || pShipBounds.ymax < shipBounds.ymin)) return false;
        }

        return true;
    }
}
exports.default = Gameboard;

},{"../../util/BattleshipConst":15,"./../../util/JsonBase":18,"./../ships/GameboardShip":12}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Gameboard = require('./Gameboard');

var _Gameboard2 = _interopRequireDefault(_Gameboard);

var _GameboardShip = require('./../ships/GameboardShip');

var _GameboardShip2 = _interopRequireDefault(_GameboardShip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PlayerGameboard extends _Gameboard2.default {
    /**
     * Constructs a new instance of the PlayerGameboard class
     *
     * @param id {number}
     * @param ships
     */
    constructor(id, ...ships) {
        super(...ships);

        this.id = id;
    }

    placeShip(ship, cell, orientation) {
        throw new Error("You cannot place a ship on a PlayerGameboard");
    }

    canPlaceShip(ship, cell, orientation) {
        return false;
    }

    static fromJson(jsonObject) {
        let ships = [];

        jsonObject.ships.forEach(ship => {
            ships.push(_GameboardShip2.default.fromJson(ship));
        });

        return new PlayerGameboard(jsonObject._id, ...ships);
    }
}
exports.default = PlayerGameboard;

},{"./../ships/GameboardShip":12,"./Gameboard":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _JsonBase = require('./../../util/JsonBase');

var _JsonBase2 = _interopRequireDefault(_JsonBase);

var _BattleshipConst = require('../../util/BattleshipConst');

var _BattleshipApi = require('../../util/BattleshipApi');

var _BattleshipApi2 = _interopRequireDefault(_BattleshipApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BaseGame extends _JsonBase2.default {
    /**
     * Constructs a new instance of the BaseGame class
     *
     * @param id {string}
     * @param state {string}
     */
    constructor(id, state) {
        super();

        this.id = id;
        this.state = state;
    }

    /**
     * Delete all the games for the current User
     *
     * @param api {BattleshipApi}
     * @param callback {function|null}
     */
    static deleteAll(api, callback) {
        if (!(api instanceof _BattleshipApi2.default)) throw new Error("The 'api' parameter on User.deleteAllGames cannot be null");

        api.apiDelete({ route: _BattleshipApi2.default.routes.currentUserGames }, callback);
    }

    /**
     * Converts a Json Object to a new instance of the BaseGame class.
     *
     * @param jsonObject
     * @returns {BaseGame}
     */
    static fromJson(jsonObject) {
        return new BaseGame(jsonObject._id, jsonObject.status);
    }

    /**
     * Returns the current state of the game.
     *
     * @returns {*}
     */
    get state() {
        return this._state;
    }

    /**
     * Set the state of the game
     *
     * @param value
     */
    set state(value) {
        if (!BaseGame.isValidState(value)) throw new Error(`The state: '${ value }' is not a valid game state`);

        this._state = value;
    }

    /**
     * Converts this BaseGame to a Json Object
     *
     * @returns {{_id: (string|*), status: *}}
     */
    toJson() {
        return {
            "_id": this.id,
            "status": this.state
        };
    }

    /**
     * Checks if a state string is valid.
     * Valid values include;
     *  - queue
     *  - setup
     *  - started
     *  - done
     *  
     * @param state {string}
     * @returns {boolean}
     */
    static isValidState(state) {
        switch (state.toLowerCase()) {
            case _BattleshipConst.STATE.QUEUE:
            case _BattleshipConst.STATE.SETUP:
            case _BattleshipConst.STATE.STARTED:
            case _BattleshipConst.STATE.DONE:
                return true;
        }

        return false;
    }
}
exports.default = BaseGame;

},{"../../util/BattleshipApi":14,"../../util/BattleshipConst":15,"./../../util/JsonBase":18}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _BaseGame = require('./BaseGame');

var _BaseGame2 = _interopRequireDefault(_BaseGame);

var _StartedGame = require('./StartedGame');

var _StartedGame2 = _interopRequireDefault(_StartedGame);

var _BattleshipConst = require('../../util/BattleshipConst');

var _BattleshipApi = require('../../util/BattleshipApi');

var _BattleshipApi2 = _interopRequireDefault(_BattleshipApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SetupGame extends _BaseGame2.default {
    /**
     * Constructs a new instance of the SetupGame class
     *
     * @param id {number}
     * @param player1 {string}
     * @param state {string}
     * @param isAi {boolean}
     */
    constructor(id, player1, state, isAi) {
        super(id, state);

        this.player1 = player1;
        this.isAi = isAi;
    }

    /**
     * Creates a new SetupGame
     *
     * @param api {BattleshipApi}
     * @param isAi {boolean}
     * @param callback {function|null}
     */
    static create(api, callback, isAi = false) {
        if (!(api instanceof _BattleshipApi2.default)) throw new TypeError("The 'api' parameter on SetupGame.create cannot be null");

        let route = _BattleshipApi2.default.routes.createGame;
        if (isAi) route = _BattleshipApi2.default.routes.createGameWithAi;

        api.apiGet({ route }, data => {
            if (callback !== null) callback(SetupGame.fromJson(data));
        });
    }

    /**
     * Submit a Gameboard to the API.
     *
     * @param api {BattleshipApi}
     * @param gameboard {Gameboard}
     * @param callback {function}
     */
    submitGameboard(api, gameboard, callback) {

        if (this.state !== _BattleshipConst.STATE.SETUP) throw new Error(`You cannot send a Gameboard to a game that is not in the ${ _BattleshipConst.STATE.SETUP } state. Current state: ${ this.state }`);

        if (!(api instanceof _BattleshipApi2.default)) throw new TypeError("The 'api' parameter on SetupGame.submitGameboard cannot be null");

        if (typeof callback !== 'function') throw new TypeError("The 'callback' parameter on SetupGame.submitGameboard has to be a function");

        api.apiPost({ route: _BattleshipApi2.default.routes.gameSetupById, parameter: this.id }, gameboard.toJson(), data => {

            if (data.msg !== undefined && data.msg === 'success') {
                this.state = data.status;

                if (this.state === _BattleshipConst.STATE.STARTED) _StartedGame2.default.get(api, this.id, callback);else callback(this);
            }
        });
    }

    /**
     * Converts a Json Object to a new instance of the SetupGame class
     *
     * @param jsonObject
     * @returns {SetupGame}
     */
    static fromJson(jsonObject) {
        return new SetupGame(jsonObject._id, jsonObject.player1, jsonObject.status, jsonObject.isAI);
    }
}
exports.default = SetupGame;

},{"../../util/BattleshipApi":14,"../../util/BattleshipConst":15,"./BaseGame":8,"./StartedGame":10}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _UserGame = require("./UserGame");

var _UserGame2 = _interopRequireDefault(_UserGame);

var _PlayerGameboard = require("../board/PlayerGameboard");

var _PlayerGameboard2 = _interopRequireDefault(_PlayerGameboard);

var _EnemyGameboard = require("../board/EnemyGameboard");

var _EnemyGameboard2 = _interopRequireDefault(_EnemyGameboard);

var _BattleshipApi = require("../../util/BattleshipApi");

var _BattleshipApi2 = _interopRequireDefault(_BattleshipApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class StartedGame extends _UserGame2.default {
    /**
     * Constructs a new instance of the StartedGame class
     *
     * @param id {number}
     * @param state {string}
     * @param enemyId {string}
     * @param enemyName {string}
     * @param isPlayerTurn {boolean}
     * @param playerGameBoard {PlayerGameboard}
     * @param enemyGameBoard
     */
    constructor(id, state, enemyId, enemyName, isPlayerTurn, playerGameBoard, enemyGameBoard) {
        super(id, state, enemyId, enemyName);

        this.isPlayerTurn = isPlayerTurn;
        this.playerGameBoard = playerGameBoard;
        this.enemyGameBoard = enemyGameBoard;
    }

    /**
     * Fires a shot on a given Cell at the opponent's board
     *
     * @param api {BattleshipApi}
     * @param cell {Cell}
     * @param callback {function}
     */
    doShot(api, cell, callback) {
        if (!this.isPlayerTurn) throw new Error(`You cannot fire a shot in Game#${ this.id } because it is not your turn`);

        if (!(api instanceof _BattleshipApi2.default)) throw new TypeError("The 'api' parameter on StartedGame.doShot cannot be null");

        if (typeof callback !== 'function') throw new TypeError("The 'callback' parameter on StartedGame.doShot has to be a function");

        api.apiPost({ route: _BattleshipApi2.default.routes.gameShotById, parameter: this.id }, cell.toJson(), data => {
            callback(data);
        });
    }

    /**
     * Returns a new instance of the StaredGame class by ID
     *
     * @param api {BattleshipApi}
     * @param id {number}
     * @param callback {function}
     */
    static get(api, id, callback) {
        if (api === undefined || api === null) throw new Error("The 'api' parameter on StartedGame.get cannot be null");

        if (typeof callback !== 'function') throw new Error("The 'callback' parameter on StartedGame.get has to be a function");

        api.apiGet({ route: _BattleshipApi2.default.routes.gameById, parameter: id }, data => {
            if (data.error !== undefined) throw new Error(data.error);

            callback(StartedGame.fromJson(data));
        });
    }

    /**
     * Converts a Json Object to a new instance of the StartedGame class
     *
     * @param jsonObject
     * @returns {StartedGame}
     */
    static fromJson(jsonObject) {

        // console.log(jsonObject);

        return new StartedGame(jsonObject._id, jsonObject.status, jsonObject.enemyId, jsonObject.enemyName, jsonObject.yourTurn, _PlayerGameboard2.default.fromJson(jsonObject.myGameboard), _EnemyGameboard2.default.fromJson(jsonObject.enemyGameboard));
    }
}
exports.default = StartedGame;

},{"../../util/BattleshipApi":14,"../board/EnemyGameboard":5,"../board/PlayerGameboard":7,"./UserGame":11}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _BaseGame = require('./BaseGame');

var _BaseGame2 = _interopRequireDefault(_BaseGame);

var _BattleshipApi = require('../../util/BattleshipApi');

var _BattleshipApi2 = _interopRequireDefault(_BattleshipApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UserGame extends _BaseGame2.default {
    /**
     * Constructs a new instance of the UserGame class.
     *
     * @param id {string}
     * @param state {string}
     * @param enemyId {string}
     * @param enemyName {string}
     * @param winner {null|string}
     */
    constructor(id, state, enemyId, enemyName, winner = null) {
        super(id, state);

        this.enemyId = enemyId;
        this.enemyName = enemyName;
        this.winner = winner;
    }

    /**
     * Returns an Array of all Games this user is participating in.
     *
     * @param api {BattleshipApi}
     * @param callback {function}
     */
    static getForCurrentUser(api, callback) {
        if (!(api instanceof _BattleshipApi2.default)) throw new TypeError("The 'api' parameter on UserGame.getForUser cannot be null");

        if (typeof callback !== 'function') throw new TypeError("The 'callback' parameter on UserGame.getForUser has to be a function");

        api.apiGet({ route: _BattleshipApi2.default.routes.currentUserGames }, data => {
            let userGames = [];

            data.forEach(item => {
                userGames.push(UserGame.fromJson(item));
            });

            callback(userGames);
        });
    }

    /**
     * Converts a Json Object to a new instance of the UserGame class
     * 
     * @param jsonObject
     * @returns {UserGame}
     */
    static fromJson(jsonObject) {
        return new UserGame(jsonObject._id, jsonObject.status, jsonObject.enemyId, jsonObject.enemyName, jsonObject.winner);
    }
}
exports.default = UserGame;

},{"../../util/BattleshipApi":14,"./BaseGame":8}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Ship = require('./Ship');

var _Ship2 = _interopRequireDefault(_Ship);

var _Cell = require('./../Cell');

var _Cell2 = _interopRequireDefault(_Cell);

var _BattleshipConst = require('../../util/BattleshipConst');

var bs = _interopRequireWildcard(_BattleshipConst);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class GameboardShip extends _Ship2.default {
    /**
     * Constructs a new instance of the GameboardShip class
     *
     * @param id {id|string}
     * @param name {string}
     * @param length {number}
     * @param startCell {Cell}
     * @param orientation {string}
     * @param hits {null|Array}
     */
    constructor(id, name, length, startCell, orientation, hits = null) {
        super(id, name, length);

        if (!(startCell instanceof _Cell2.default)) throw new TypeError('The startCell of a GameboardShip must be of type Cell');
        if (typeof orientation !== 'string') throw new TypeError('The orientation of a GameboardShip must be a string');

        this.startCell = startCell;

        if (!GameboardShip.isValidOrientation(orientation)) throw new Error(`The orientation: '${ orientation }' is not a valid orientation`);

        this.orientation = orientation.toLowerCase();
        this.hits = hits;
    }

    /**
     * Checks if the orientation of this Ship is vertical
     *
     * @returns {boolean}
     */
    get isVertical() {
        return this.orientation === bs.VERTICAL;
    }

    /**
     * Returns the X coordinate in number form
     *
     * @returns {number}
     */
    get x() {
        return this.startCell.x;
    }

    /**
     * Returns the Y coordinate in number form
     *
     * @returns {number}
     */
    get y() {
        return this.startCell.y;
    }

    /**
     * Constructs a new instance of the GameboardShip class user a Ship
     *
     * @param ship {Ship}
     * @param startCell {Cell}
     * @param orientation {string}
     * @param hits {null|Array}
     * @returns GameboardShip
     */
    static fromShip(ship, startCell, orientation, hits = null) {
        return new GameboardShip(ship.id, ship.name, ship.length, startCell, orientation, hits);
    }

    /**
     * Checks if a orientation string is valid.
     * Valid values are:
     *  - vertical
     *  - horizontal
     *
     * @param orientation {string}
     * @returns {boolean}
     */
    static isValidOrientation(orientation) {
        switch (orientation.toLowerCase()) {
            case bs.VERTICAL:
            case bs.HORIZONTAL:
                return true;
        }

        return false;
    }

    /**
     * Get the bounds of this GameboardShip
     *
     * @param cell {Cell}
     * @param orientation {string}
     * @returns {{xmin, ymin, xmax, ymax}|{xmin: number, ymin: number, xmax: number, ymax: number}}
     */
    bounds(cell = this.startCell, orientation = this.orientation) {
        return super.bounds(cell, orientation);
    }

    /**
     * Converts this object to JSON
     *
     * @returns {{_id: (*|number|string), length: (*|number), name: (*|string), startCell: ({x, y}|{x: (string|*), y: (number|*)}), isVertical: boolean}}
     */
    toJson() {
        return {
            "_id": this.id,
            "length": this.length,
            "name": this.name,
            "startCell": this.startCell.toJson(),
            "isVertical": this.isVertical
        };
    }

    /**
     * Converts a Json Object to a new instance of the GameboardShip class
     *
     * @param jsonObject
     * @returns {GameboardShip}
     */
    static fromJson(jsonObject) {
        let hits = [];
        jsonObject.hits.forEach(hit => {
            hits.push(_Cell2.default.fromJson(hit));
        });

        let orientation = bs.HORIZONTAL;
        if (jsonObject.isVertical) orientation = bs.VERTICAL;

        return new GameboardShip(jsonObject._id, jsonObject.name, jsonObject.length, _Cell2.default.fromJson(jsonObject.startCell), orientation, hits);
    }
}
exports.default = GameboardShip;

},{"../../util/BattleshipConst":15,"./../Cell":2,"./Ship":13}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _JsonBase = require('../../util/JsonBase');

var _JsonBase2 = _interopRequireDefault(_JsonBase);

var _Persistence = require('../../util/Persistence');

var _Persistence2 = _interopRequireDefault(_Persistence);

var _BattleshipConst = require('../../util/BattleshipConst');

var bs = _interopRequireWildcard(_BattleshipConst);

var _BattleshipApi = require('../../util/BattleshipApi');

var _BattleshipApi2 = _interopRequireDefault(_BattleshipApi);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Ship extends _JsonBase2.default {
    /**
     * Constructs a new instance of the Ship class
     *
     * @param id {number|string}
     * @param name {string}
     * @param length {number}
     */
    constructor(id, name, length) {
        super();

        if (typeof id !== 'number' && typeof id !== 'string') throw new TypeError(`The ID of a Ship must be a number or a string: ID ${ id }`);
        if (typeof name !== 'string') throw new TypeError(`The name of a Ship must be a string: name ${ name }`);
        if (typeof length !== 'number' || length < 0) throw new RangeError(`The length of a Ship cannot be negative and must be a number: length ${ length }`);

        this.name = name;
        this.id = id;
        this.length = length;
    }

    /**
     * Returns an Array of all Ship available to the User
     *
     * @param api {BattleshipApi}
     * @param callback {function}
     */
    static getAll(api, callback) {

        let processShips = data => {
            _Persistence2.default.set(bs.PER_SHIPSKEY, JSON.stringify(data));

            let ships = [];

            data.forEach(jsonShip => {
                ships.push(Ship.fromJson(jsonShip));
            });

            callback(ships);
        };

        if (_Persistence2.default.hasKey(bs.PER_SHIPSKEY)) {
            // console.log('Loading Ships from storage');
            let json = _Persistence2.default.get(bs.PER_SHIPSKEY);
            processShips(JSON.parse(json));
        } else {
            if (api === undefined || api === null) throw new Error("The 'api' parameter on Ship.getAll cannot be null");

            if (typeof callback !== 'function') throw new TypeError("The 'callback' parameter on Ship.getAll has to be a function");

            api.apiGet({ route: _BattleshipApi2.default.routes.allShips }, data => {
                processShips(data);
            });
        }
    }

    /**
     * Get the bounds of this Ship
     * 
     * @param cell {Cell}
     * @param orientation {string}
     * @returns {{xmin: number, ymin: number, xmax: number, ymax: number}}
     */
    bounds(cell, orientation) {
        let xmin, ymin, xmax, ymax;

        if (orientation === bs.VERTICAL) {
            xmin = xmax = cell.x;
            ymin = cell.y;
            ymax = ymin + this.length - 1;
        } else if (orientation === bs.HORIZONTAL) {
            xmin = cell.x;
            xmax = xmin + this.length - 1;

            ymin = ymax = cell.y;
        }

        // console.log(`length: ${this.length} - xmin:${xmin}|xmax:${xmax}|ymin:${ymin}|ymax:${ymax}`);

        return { xmin, ymin, xmax, ymax };
    }

    /**
     * Converts this object to JSON
     *
     * @returns {{_id: (number|string|*), name: (string|*), length: (number|*)}}
     */
    toJson() {
        return {
            "_id": this.id,
            "name": this.name,
            "length": this.length
        };
    }

    /**
     * Converts a JSON object to a Ship
     *
     * @param jsonObject {{_id: (number|*), name: (string|*), length: (number|*)}}
     * @returns {Ship}
     */
    static fromJson(jsonObject) {
        return new Ship(jsonObject._id, jsonObject.name, jsonObject.length);
    }
}
exports.default = Ship;

},{"../../util/BattleshipApi":14,"../../util/BattleshipConst":15,"../../util/JsonBase":18,"../../util/Persistence":19}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _BattleshipRoute = require('./BattleshipRoute');

var _BattleshipRoute2 = _interopRequireDefault(_BattleshipRoute);

var _Persistence = require('./Persistence');

var _Persistence2 = _interopRequireDefault(_Persistence);

var _BattleshipConst = require('./BattleshipConst');

var bs = _interopRequireWildcard(_BattleshipConst);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BattleshipApi {
    /**
     * Constructs a new instance of the BattleShipApi class
     * @param token {string}
     */
    constructor(token) {
        if (window.jQuery === undefined) throw new Error('BattleshipApi needs jQuery to work');

        if (window.io === undefined) throw new Error('BattleshipApi need Socket.IO to work');

        this._token = token;
    }

    /**
     *
     * @returns {string}
     */
    static get tokenPrefix() {
        return 'token=';
    }

    /**
     * The online URL of the Battleship API
     *
     * @returns {string}
     */
    static get url() {
        return 'https://zeeslagavans.herokuapp.com/';
    }
    /**
     * All routes available for the Battleship API
     *
     * @returns {{currentUser: BattleshipRoute, currentUserGames: BattleshipRoute, createGame: BattleshipRoute, createGameWithAi: BattleshipRoute, allShips: BattleshipRoute, gameById: BattleshipRoute, gameSetupById: BattleshipRoute, gameShotById: BattleshipRoute}}
     */
    static get routes() {
        return {
            // (urlFormat, methods, needsParam = false)
            currentUser: new _BattleshipRoute2.default('users/me/info', 'get', false),
            currentUserGames: new _BattleshipRoute2.default('users/me/games', 'get|delete', false),
            createGame: new _BattleshipRoute2.default('games', 'get', false),
            createGameWithAi: new _BattleshipRoute2.default('games/AI', 'get', false),
            allShips: new _BattleshipRoute2.default('ships', 'get', false),
            gameById: new _BattleshipRoute2.default('games/{id}', 'get', true),
            gameSetupById: new _BattleshipRoute2.default('games/{id}/gameboards', 'post', true),
            gameShotById: new _BattleshipRoute2.default('games/{id}/shots', 'post', true)
        };
    }

    /**
     * Returns a formatted version of a route URI with the API base url and API token
     *
     * @param formattedRoute {string}
     * @returns {string}
     */
    withApiTokenSuffix(formattedRoute) {
        if (formattedRoute === undefined || formattedRoute === null) throw new Error('BattleshipApi needs jQuery to work');

        if (typeof formattedRoute !== 'string') throw new Error("The 'formattedRoute' parameter on BattleshipApi.withApiTokenSuffix must be a string");

        return `${ BattleshipApi.url }${ formattedRoute }?${ BattleshipApi.tokenPrefix }${ this.token }`;
    }

    /**
     * Sends a Get request to the BattleShip Api
     *  The options are:
     *  - route {BattleshipRoute}
     *  - parameter {string}
     *
     * @param route {BattleshipRoute}
     * @param parameter {string}
     * @param callback {function|null}
     */
    apiGet({ route, parameter }, callback) {
        if (route === null || route === undefined) throw new Error('The route option on the apiGet function of BattleshipApi cannot be empty');

        route.checkMethod('get');

        let url = this.withApiTokenSuffix(route.format(parameter));

        $.get(url, data => {
            if (data.error) throw new Error(data.error.replace('Error: ', ''));

            if (callback !== undefined && callback !== null) callback(data);
        }).fail(() => {
            throw new Error(`The Battleship Api failed to process the request to '${ url }'`);
        });
    }

    /**
     * Sends a Post request to the BattleShip Api.
     *  The options are:
     *  - route BattleshipRoute
     *  - parameter {string}
     *
     * @param route {BattleshipRoute}
     * @param parameter {string}
     * @param object {*}
     * @param callback {function|null}
     */
    apiPost({ route, parameter }, object, callback) {
        if (route === null || route === undefined) throw new Error('The route option on the apiGet function of BattleshipApi cannot be empty');

        route.checkMethod('post');

        let url = this.withApiTokenSuffix(route.format(parameter));

        $.post(url, object, data => {
            if (data.error) throw new Error(data.error.replace('Error: ', ''));

            if (typeof callback === 'function') callback(data);
        }).fail(() => {
            throw new Error(`The Battleship Api failed to process the request to '${ url }'`);
        });
    }

    /**
     * Sends a Delete request to the BattleShip Api.
     *  The options are:
     *  - route BattleshipRoute
     *  - parameter {string}
     *
     * @param route {BattleshipRoute}
     * @param parameter {string}
     * @param callback {function|null}
     */
    apiDelete({ route, parameter }, callback) {
        if (route === null || route === undefined) throw new Error('The route option on the apiDelete function of BattleshipApi cannot be empty');

        route.checkMethod('delete');

        $.ajax({
            url: this.withApiTokenSuffix(route.format(parameter)),
            type: 'DELETE',
            success: data => {
                if (data.error) throw new Error(data.error.replace('Error: ', ''));

                if (typeof callback === 'function') callback(data);
            },
            error: () => {
                throw new Error('The Battleship Api failed to process the request');
            }
        });
    }

    get token() {
        return this._token;
    }

    set token(value) {
        if (this.token !== value) {
            this._token = value;

            _Persistence2.default.set(bs.PER_TOKENKEY, value);
            _Persistence2.default.remove(bs.PER_USERKEY);
        }
    }

    /**
     * Listen to a notification on a Socket.IO room
     *
     * @param room {string}
     * @param callback {function}
     */
    on(room, callback) {
        var socket = io.connect(this.url, {
            query: BattleshipApi.tokenPrefix + this.token
        });

        socket.on(room, callback);
    }

    onUpdate(callback) {
        on('update', callback);
    }

    onShot(callback) {
        on('shot', callback);
    }

    onTurn(callback) {
        on('turn', callback);
    }

}
exports.default = BattleshipApi;

},{"./BattleshipConst":15,"./BattleshipRoute":16,"./Persistence":19}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
const CELLMAX = exports.CELLMAX = 10;
const CELLMIN = exports.CELLMIN = 1;
const SHIPMAX = exports.SHIPMAX = 5;
const CHARSTART = exports.CHARSTART = 'a'.charCodeAt(0);
const PER_USERKEY = exports.PER_USERKEY = 'bs-user';
const PER_TOKENKEY = exports.PER_TOKENKEY = 'token';
const PER_SHIPSKEY = exports.PER_SHIPSKEY = 'bs-ships';
const HORIZONTAL = exports.HORIZONTAL = 'horizontal';
const VERTICAL = exports.VERTICAL = 'vertical';
/**
 *
 * @type {{QUEUE: string, SETUP: string, STARTED: string, DONE: string}}
 */
const STATE = exports.STATE = {
    QUEUE: 'queue',
    SETUP: 'setup',
    STARTED: 'started',
    DONE: 'done'
};

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 *
 * @property urlFormat {string}
 * @property methods {array}
 * @property needsParam {boolean}
 */
class BattleshipRoute {
    /**
     * Constructs a new instance of the BattleshipRoute class
     *
     * @param urlFormat {string}
     * @param methods {string}
     * @param needsParam {boolean}
     */
    constructor(urlFormat, methods, needsParam = false) {
        if (urlFormat === undefined || urlFormat === null) throw new Error('Cannot define an empty BattleshipRoute. Please define urlFormat.');
        if (typeof urlFormat !== 'string') throw new Error('urlFormat must be of type string.');

        this.urlFormat = urlFormat;

        if (typeof methods === 'string') this.methods = methods.split('|');

        if (typeof needsParam === 'boolean') this.needsParam = needsParam;
    }

    /**
     * Return a formatted string of this route
     *
     * @param parameter {number}
     * @returns {string|*}
     */
    format(parameter) {
        var url = this.urlFormat;

        if ((parameter !== undefined || parameter !== null) && this.needsParam) url = url.replace('{id}', `${ parameter }`);else if ((parameter === undefined || parameter === null) && this.needsParam) throw new Error(`Route '${ this.urlFormat }' needs a parameter`);

        return url;
    }

    /**
     * Checks if this route can perform a given http method
     *
     * @param method {string}
     * @returns {boolean}
     */
    checkMethod(method) {
        if (this.methods.indexOf(method) === -1) throw new Error(`The selected route ('${ this.urlFormat }') does not support the '${ method }' method`);
    }
}
exports.default = BattleshipRoute;

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class Hu {
    /**
     *
     * @param element 
     * @param html {string}
     */
    static append(element, html) {
        element.innerHTML = `${ element.innerHTML }${ html }`;
    }

    /**
     *
     * @param query {string}
     * @param html {string}
     */
    static queryAppend(query, html) {
        let el = document.querySelector(query);
        el.innerHTML = `${ el.innerHTML }${ html }`;
    }

    /**
     *
     * @param query {string}
     * @param html {string}
     */
    static querySet(query, html) {
        let el = document.querySelector(query);
        el.innerHTML = `${ html }`;
    }

}
exports.default = Hu;

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class JsonBase {

    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(jsonObject) {
        return jsonObject;
    }
}
exports.default = JsonBase;

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class Persistence {
    /**
     * Returns a stored value from the local storage.
     *
     * @param key {string}
     */
    static get(key) {
        if (typeof Storage === "undefined") throw new Error("Local storage is not supported.");

        return localStorage.getItem(key);
    }

    /**
     * Sets a value in the local storage
     *
     * @param key {string}
     * @param value {*}
     */
    static set(key, value) {
        if (typeof Storage === "undefined") throw new Error("Local storage is not supported.");

        localStorage.setItem(key, value);
    }

    /**
     * Removes a key from the local storage
     *
     * @param key {string}
     */
    static remove(key) {
        if (typeof Storage === "undefined") throw new Error("Local storage is not supported.");

        localStorage.removeItem(key);
    }

    /**
     * Checks if a given key exists in the Local Storage
     * 
     * @param key {string}
     * @returns {boolean}
     */
    static hasKey(key) {
        if (typeof Storage === "undefined") throw new Error("Local storage is not supported.");

        return localStorage.getItem(key) !== null;
    }
}
exports.default = Persistence;

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _User = require('./../model/User');

var _User2 = _interopRequireDefault(_User);

var _Hu = require('./../util/Hu');

var _Hu2 = _interopRequireDefault(_Hu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UserViewModel extends _User2.default {
    constructor(email, name) {
        super(email, name);
    }

    get html() {
        return `<ul><li>${ this.name }</li><li>${ this.email }</li></ul>`;
    }

    displayOn(query) {
        _Hu2.default.querySet(query, this.html);
    }

    /**
     *
     * @param user {User}
     * @returns {UserViewModel}
     */
    static fromUser(user) {
        return new UserViewModel(user.email, user.name);
    }

    static getCurrent(api, callback) {
        super.getCurrent(api, user => {
            callback(UserViewModel.fromUser(user));
        });
    }
}
exports.default = UserViewModel;

},{"./../model/User":4,"./../util/Hu":17}]},{},[1]);
