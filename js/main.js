(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _BattleshipApi = require('./util/BattleshipApi');

var _BattleshipApi2 = _interopRequireDefault(_BattleshipApi);

var _Persistence = require('./util/Persistence');

var _Persistence2 = _interopRequireDefault(_Persistence);

var _BSTestViewModel = require('./viewmodel/BSTestViewModel');

var _BSTestViewModel2 = _interopRequireDefault(_BSTestViewModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {

    // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InNlZS5ncmFuZGlhQHN0dWRlbnQuYXZhbnMubmwi.DtPnllHeZKqv_lM7evo72TyJWpSOELFunRs4myKHMHA
    // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InRtZS52YW5uaW13ZWdlbkBzdHVkZW50LmF2YW5zLm5sIg.4yuhuKWBCnQuoxAeVL2xQ3Ua41YPLRqT7F8FkhxUcKI

    if (!_Persistence2.default.hasKey('token')) _Persistence2.default.set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InRtZS52YW5uaW13ZWdlbkBzdHVkZW50LmF2YW5zLm5sIg.4yuhuKWBCnQuoxAeVL2xQ3Ua41YPLRqT7F8FkhxUcKI');

    let token = _Persistence2.default.get('token');
    let battleshipApi = new _BattleshipApi2.default(token);

    let tstView = new _BSTestViewModel2.default(battleshipApi);
    tstView.addTo('body');
})();

},{"./util/BattleshipApi":16,"./util/Persistence":21,"./viewmodel/BSTestViewModel":23}],2:[function(require,module,exports){
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

},{"../util/BattleshipConst":17,"./../util/JsonBase":20}],3:[function(require,module,exports){
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
     * @param id {string}
     * @param isHit {boolean|null}
     */
    constructor(x, y, id, isHit = null) {
        super(x, y);

        // if(typeof id !== 'string')
        //     throw new TypeError(`The ID of a shot must be a string. was: ${id}`);

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
     * @param fail {function|null}
     */
    static getCurrent(api, callback, fail = null) {

        if (_Persistence2.default.hasKey(bs.PER_USERKEY)) {
            callback(User.fromJson(JSON.parse(_Persistence2.default.get(bs.PER_USERKEY))));
        }

        if (api === undefined || api === null) throw new Error("The 'api' parameter on User.getCurrent cannot be null");

        if (typeof callback !== 'function') throw new TypeError("The 'callback' parameter on User.getCurrent has to be a function");

        api.apiGet({ route: _BattleshipApi2.default.routes.currentUser }, data => {
            _Persistence2.default.set(bs.PER_USERKEY, JSON.stringify(data));
            callback(User.fromJson(data));
        }, fail);
    }

    /**
     * Returns an Array of all Games the current user is participating in.
     *
     * @param api {BattleshipApi}
     * @param callback {function}
     * @param fail {function|null}
     * @returns {*}
     */
    static getGames(api, callback, fail = null) {
        return _UserGame2.default.getForCurrentUser(api, callback, fail);
    }

    /**
     * Removes all Games the current user is participating in.
     *
     * @param api {BattleshipApi}
     * @param callback {function|null}
     * @param fail {function|null}
     */
    static deleteAllGames(api, callback, fail = null) {
        _UserGame2.default.deleteAll(api, callback, fail);
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

},{"../util/BattleshipApi":16,"../util/BattleshipConst":17,"./../model/games/UserGame":13,"./../util/JsonBase":20,"./../util/Persistence":21}],5:[function(require,module,exports){
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

},{"./../../util/JsonBase":20,"./../Shot":3}],6:[function(require,module,exports){
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

        var find = this.ships.find(ps => ps.id === ship.id);

        if (this.ships.length >= bs.SHIPMAX || find !== undefined) return false;

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

},{"../../util/BattleshipConst":17,"./../../util/JsonBase":20,"./../ships/GameboardShip":14}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Gameboard = require('./Gameboard');

var _Gameboard2 = _interopRequireDefault(_Gameboard);

var _GameboardShip = require('./../ships/GameboardShip');

var _GameboardShip2 = _interopRequireDefault(_GameboardShip);

var _Shot = require('../Shot');

var _Shot2 = _interopRequireDefault(_Shot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PlayerGameboard extends _Gameboard2.default {
    /**
     * Constructs a new instance of the PlayerGameboard class
     *
     * @param id {number}
     * @param shots
     * @param ships
     */
    constructor(id, shots, ...ships) {
        super(...ships);

        this.id = id;
        this.shots = shots;
    }

    placeShip(ship, cell, orientation) {
        throw new Error("You cannot place a ship on a PlayerGameboard");
    }

    canPlaceShip(ship, cell, orientation) {
        return false;
    }

    static fromJson(jsonObject) {
        let ships = [];
        let _shots = [];

        jsonObject.ships.forEach(ship => {
            ships.push(_GameboardShip2.default.fromJson(ship));
        });

        jsonObject.shots.forEach(shot => {
            _shots.push(_Shot2.default.fromJson(shot));
        });

        return new PlayerGameboard(jsonObject._id, _shots, ...ships);
    }
}
exports.default = PlayerGameboard;

},{"../Shot":3,"./../ships/GameboardShip":14,"./Gameboard":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _JsonBase = require('../../util/JsonBase');

var _JsonBase2 = _interopRequireDefault(_JsonBase);

var _Cell = require('../../model/Cell');

var _Cell2 = _interopRequireDefault(_Cell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ShotEventArguments extends _JsonBase2.default {
    constructor(gameId, user, cell, result) {
        super();

        this.gameId = gameId;
        this.user = user;
        this.cell = cell;
        this.result = result;
    }

    set result(value) {

        switch (value) {
            case 'BOOM':
            case 'SPLASH':
            case 'WINNER':
            case 'FAIL':
                this._result = value;
                break;
            default:
                throw new Error(`The result '${ value }' is not a valid result for ShotEventArguments`);
        }

        this._result = value;
    }

    get result() {
        return this._result;
    }

    static fromJson(jsonObject) {
        return new ShotEventArguments(jsonObject.gameId, jsonObject.user, new _Cell2.default(jsonObject.field.x, jsonObject.field.y), jsonObject.result);
    }
}
exports.default = ShotEventArguments;

},{"../../model/Cell":2,"../../util/JsonBase":20}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _JsonBase = require('../../util/JsonBase');

var _JsonBase2 = _interopRequireDefault(_JsonBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UpdateEventArguments extends _JsonBase2.default {
    constructor(gameId, currentUser) {
        super();

        this.gameId = gameId;
        this.currentUser = currentUser;
    }

    static fromJson(jsonObject) {
        return new UpdateEventArguments(jsonObject.gameId, jsonObject.user);
    }
}
exports.default = UpdateEventArguments;

},{"../../util/JsonBase":20}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _JsonBase = require('../../util/JsonBase');

var _JsonBase2 = _interopRequireDefault(_JsonBase);

var _BaseGame = require('../games/BaseGame');

var _BaseGame2 = _interopRequireDefault(_BaseGame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UpdateEventArguments extends _JsonBase2.default {
    constructor(gameId, state) {
        super();

        this.gameId = gameId;

        if (!_BaseGame2.default.isValidState(state)) throw new Error(`The state: '${ state }' is not a valid game state`);

        this.state = state;
    }

    static fromJson(jsonObject) {
        return new UpdateEventArguments(jsonObject.gameId, jsonObject.status);
    }
}
exports.default = UpdateEventArguments;

},{"../../util/JsonBase":20,"../games/BaseGame":11}],11:[function(require,module,exports){
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
     * @param fail {function|null}
     */
    static deleteAll(api, callback, fail = null) {
        if (!(api instanceof _BattleshipApi2.default)) throw new Error("The 'api' parameter on User.deleteAllGames cannot be null");

        api.apiDelete({ route: _BattleshipApi2.default.routes.currentUserGames }, callback, fail);
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

    /**
     *
     * @param api {BattleshipApi}
     * @param callback {function}
     */
    onUpdate(api, callback) {
        api.onUpdate(update => {
            if (update.gameId === this.id) {
                this.state = update.state;
                callback(update);
            }
        });
    }

    /**
     *
     * @param api {BattleshipApi}
     * @param callback {function}
     */
    onTurn(api, callback) {
        api.onTurn(turn => {
            if (turn.gameId === this.id) callback(turn);
        });
    }

    /**
     *
     * @param api {BattleshipApi}
     * @param callback {function}
     */
    onShot(api, callback) {
        api.onShot(shot => {
            if (shot.gameId === this.id) callback(shot);
        });
    }
}
exports.default = BaseGame;

},{"../../util/BattleshipApi":16,"../../util/BattleshipConst":17,"./../../util/JsonBase":20}],12:[function(require,module,exports){
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
     * @param fail {function|null}
     */
    doShot(api, cell, callback, fail = null) {
        if (!this.isPlayerTurn) throw new Error(`You cannot fire a shot in Game#${ this.id } because it is not your turn`);

        if (!(api instanceof _BattleshipApi2.default)) throw new TypeError("The 'api' parameter on StartedGame.doShot cannot be null");

        if (typeof callback !== 'function') throw new TypeError("The 'callback' parameter on StartedGame.doShot has to be a function");

        api.apiPost({ route: _BattleshipApi2.default.routes.gameShotById, parameter: this.id }, cell.toJson(), data => {
            callback(data);
        }, fail);
    }

    /**
     * Returns a new instance of the StaredGame class by ID
     *
     * @param api {BattleshipApi}
     * @param id {number}
     * @param callback {function}
     * @param fail {function|null}
     */
    static get(api, id, callback, fail = null) {
        if (api === undefined || api === null) throw new Error("The 'api' parameter on StartedGame.get cannot be null");

        if (typeof callback !== 'function') throw new Error("The 'callback' parameter on StartedGame.get has to be a function");

        api.apiGet({ route: _BattleshipApi2.default.routes.gameById, parameter: id }, data => {
            if (data.error !== undefined) throw new Error(data.error);

            callback(StartedGame.fromJson(data));
        }, fail);
    }

    /**
     * Converts a Json Object to a new instance of the StartedGame class
     *
     * @param jsonObject
     * @returns {StartedGame}
     */
    static fromJson(jsonObject) {

        return new StartedGame(jsonObject._id, jsonObject.status, jsonObject.enemyId, jsonObject.enemyName, jsonObject.yourTurn, _PlayerGameboard2.default.fromJson(jsonObject.myGameboard), _EnemyGameboard2.default.fromJson(jsonObject.enemyGameboard));
    }
}
exports.default = StartedGame;

},{"../../util/BattleshipApi":16,"../board/EnemyGameboard":5,"../board/PlayerGameboard":7,"./UserGame":13}],13:[function(require,module,exports){
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
     * @param fail {function|null}
     */
    static getForCurrentUser(api, callback, fail = null) {
        if (!(api instanceof _BattleshipApi2.default)) throw new TypeError("The 'api' parameter on UserGame.getForUser cannot be null");

        if (typeof callback !== 'function') throw new TypeError("The 'callback' parameter on UserGame.getForUser has to be a function");

        api.apiGet({ route: _BattleshipApi2.default.routes.currentUserGames }, data => {
            let userGames = [];

            data.forEach(item => {
                userGames.push(UserGame.fromJson(item));
            });

            callback(userGames);
        }, fail);
    }

    static get(api, id, callback, fail = null) {
        UserGame.getForCurrentUser(api, games => {
            callback(games.find(game => game.id === id));
        }, fail);
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

},{"../../util/BattleshipApi":16,"./BaseGame":11}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Ship = require('./Ship');

var _Ship2 = _interopRequireDefault(_Ship);

var _Cell = require('./../Cell');

var _Cell2 = _interopRequireDefault(_Cell);

var _Shot = require('./../Shot');

var _Shot2 = _interopRequireDefault(_Shot);

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
            hits.push(_Shot2.default.fromJson(hit));
        });

        let orientation = bs.HORIZONTAL;
        if (jsonObject.isVertical) orientation = bs.VERTICAL;

        return new GameboardShip(jsonObject._id, jsonObject.name, jsonObject.length, _Cell2.default.fromJson(jsonObject.startCell), orientation, hits);
    }
}
exports.default = GameboardShip;

},{"../../util/BattleshipConst":17,"./../Cell":2,"./../Shot":3,"./Ship":15}],15:[function(require,module,exports){
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
     * @param fail {function|null}
     */
    static getAll(api, callback, fail = null) {

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
            }, fail);
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

},{"../../util/BattleshipApi":16,"../../util/BattleshipConst":17,"../../util/JsonBase":20,"../../util/Persistence":21}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _BattleshipRoute = require('./BattleshipRoute');

var _BattleshipRoute2 = _interopRequireDefault(_BattleshipRoute);

var _Persistence = require('./Persistence');

var _Persistence2 = _interopRequireDefault(_Persistence);

var _ShotEventArguments = require('../model/events/ShotEventArguments');

var _ShotEventArguments2 = _interopRequireDefault(_ShotEventArguments);

var _UpdateEventArguments = require('../model/events/UpdateEventArguments');

var _UpdateEventArguments2 = _interopRequireDefault(_UpdateEventArguments);

var _TurnEventArguments = require('../model/events/TurnEventArguments');

var _TurnEventArguments2 = _interopRequireDefault(_TurnEventArguments);

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

        this._socketIoCallbacks = [];

        this._socket = io.connect(BattleshipApi.url, {
            query: BattleshipApi.tokenPrefix + token
        });

        this._onTokenChangedCallbacks = [];
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
     * @param fail {function|null}
     */
    apiGet({ route, parameter }, callback, fail = null) {
        if (route === null || route === undefined) throw new Error('The route option on the apiGet function of BattleshipApi cannot be empty');

        route.checkMethod('get');

        let url = this.withApiTokenSuffix(route.format(parameter));

        $.ajax({
            timeout: bs.AJAX_TIMEOUT,
            url: url,
            type: 'GET'
        }).done(data => {
            if (data.error) {
                let _msg = data.error.replace('Error: ', '');
                fail(_msg);
                throw new Error(_msg);
            }

            if (callback !== undefined && callback !== null) callback(data);
        }).fail((jqXHR, textStatus, errorThrown) => {
            if (typeof fail === 'function') fail(textStatus, errorThrown);
            throw new Error(`The Battleship Api failed to process the request to '${ url }'`);
        });

        // $.get(url, data => {
        //     if (data.error) {
        //         let _msg = data.error.replace('Error: ', '');
        //         fail(_msg);
        //         throw new Error(_msg);
        //     }
        //
        //     if (callback !== undefined && callback !== null)
        //         callback(data);
        //
        // }).fail((jqXHR, textStatus, errorThrown) => {
        //     if (typeof fail === 'function')
        //         fail(jqXHR, textStatus, errorThrown);
        //     throw new Error(`The Battleship Api failed to process the request to '${url}'`);
        // });
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
     * @param fail {function|null}
     */
    apiPost({ route, parameter }, object, callback, fail = null) {
        if (route === null || route === undefined) throw new Error('The route option on the apiGet function of BattleshipApi cannot be empty');

        route.checkMethod('post');

        let url = this.withApiTokenSuffix(route.format(parameter));

        $.ajax({
            timeout: bs.AJAX_TIMEOUT,
            url: url,
            type: 'POST',
            contents: object
        }).done(data => {
            if (data.error) {
                let _msg = data.error.replace('Error: ', '');
                fail(_msg);
                throw new Error(_msg);
            }

            if (typeof callback === 'function') callback(data);
        }).fail((jqXHR, textStatus, errorThrown) => {
            if (typeof fail === 'function') fail(textStatus, errorThrown);
            throw new Error(`The Battleship Api failed to process the request to '${ url }'`);
        });

        // $.post(url, object, data => {
        //     if (data.error) {
        //         let _msg = data.error.replace('Error: ', '');
        //         fail(_msg);
        //         throw new Error(_msg);
        //     }
        //
        //     if (typeof callback === 'function')
        //         callback(data);
        //
        // }).fail((jqXHR, textStatus, errorThrown) => {
        //     if (typeof fail === 'function')
        //         fail(jqXHR, textStatus, errorThrown);
        //     throw new Error(`The Battleship Api failed to process the request to '${url}'`);
        // });
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
     * @param fail {function|null}
     */
    apiDelete({ route, parameter }, callback, fail = null) {
        if (route === null || route === undefined) throw new Error('The route option on the apiDelete function of BattleshipApi cannot be empty');

        route.checkMethod('delete');

        $.ajax({
            timeout: bs.AJAX_TIMEOUT,
            url: this.withApiTokenSuffix(route.format(parameter)),
            type: 'DELETE'
        }).success(data => {
            if (data.error) {
                let _msg = data.error.replace('Error: ', '');
                fail(_msg);
                throw new Error(_msg);
            }

            if (typeof callback === 'function') callback(data);
        }).fail((jqXHR, textStatus, errorThrown) => {
            if (typeof fail === 'function') fail(textStatus, errorThrown);

            throw new Error('The Battleship Api failed to process the request');
        });
    }

    /**
     * Returns the Token used for the API connection. The Token represents the user currently playing the game
     *
     * @returns {string}
     */
    get token() {
        return this._token;
    }

    /**
     * Sets the Token used for the API connection. This changes the user that is playing the game.
     * Please note that after chancing the Token any Socket connections need to re-established to reflect the
     * new Token.
     *
     * @param value {string}
     */
    set token(value) {
        if (this.token !== value) {
            let oldToken = this._token;
            this._token = value;

            _Persistence2.default.set(bs.PER_TOKENKEY, value);
            _Persistence2.default.remove(bs.PER_USERKEY);

            this._socket = io.connect(BattleshipApi.url, {
                query: BattleshipApi.tokenPrefix + this._token
            });

            let old = this._socketIoCallbacks.slice(0);
            this._socketIoCallbacks = [];

            old.forEach(obj => {
                this.on(obj.room, obj.callback);
            });

            this._onTokenChangedCallbacks.forEach(cb => cb({ oldToken: oldToken, newToken: this._token }));
        }
    }

    /**
     *
     * @param callback {function}
     */
    onTokenChanged(callback) {
        this._onTokenChangedCallbacks.push(callback);
    }

    /**
     * Listen to a notification on a Socket.IO room
     *
     * @param room {string}
     * @param callback {function}
     */
    on(room, callback) {

        this._socketIoCallbacks.push({
            room: room,
            callback: callback
        });

        this._socket.on(room, callback);
    }

    /**
     * Listen to a notification on a the Socket.IO room named 'update'
     *
     * @param callback {function}
     */
    onUpdate(callback) {
        this.on('update', data => {
            callback(_UpdateEventArguments2.default.fromJson(data));
        });
    }

    /**
     * Listen to a notification on a the Socket.IO room named 'shot'
     *
     * @param callback {function}
     */
    onShot(callback) {
        this.on('shot', data => {
            callback(_ShotEventArguments2.default.fromJson(data));
        });
    }

    /**
     * Listen to a notification on a the Socket.IO room named 'turn'
     *
     * @param callback {function}
     */
    onTurn(callback) {
        this.on('turn', data => {
            callback(_TurnEventArguments2.default.fromJson(data));
        });
    }

}
exports.default = BattleshipApi;

},{"../model/events/ShotEventArguments":8,"../model/events/TurnEventArguments":9,"../model/events/UpdateEventArguments":10,"./BattleshipConst":17,"./BattleshipRoute":18,"./Persistence":21}],17:[function(require,module,exports){
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
const AJAX_TIMEOUT = exports.AJAX_TIMEOUT = 1000000;
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ViewModel = require('./ViewModel');

var _ViewModel2 = _interopRequireDefault(_ViewModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BSODViewModel extends _ViewModel2.default {
    constructor(api) {
        super(api, 'vm-bsod');
    }

    draw() {
        let template = `<div id=${ this.name } class="bs-fill-page bs-bsod">
<p><i class="fa fa-bomb fa-2x"></i></p>
    <h2>Well done, you broke it</h2>
    <p>An error occurred, please reload the page and try again.</p>
</div>`;

        this.parent.prepend(template);

        document.querySelector('.bs-bsod').scrollIntoView();
        this.parent.addClass('bs-bsod-html');
    }
}
exports.default = BSODViewModel;

},{"./ViewModel":26}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _BattleshipApi = require('../util/BattleshipApi');

var _BattleshipApi2 = _interopRequireDefault(_BattleshipApi);

var _Ship = require('../model/ships/Ship');

var _Ship2 = _interopRequireDefault(_Ship);

var _UserGame = require('../model/games/UserGame');

var _UserGame2 = _interopRequireDefault(_UserGame);

var _UserViewModel = require('./UserViewModel');

var _UserViewModel2 = _interopRequireDefault(_UserViewModel);

var _BattleshipConst = require('../util/BattleshipConst');

var _StartedGame = require('../model/games/StartedGame');

var _StartedGame2 = _interopRequireDefault(_StartedGame);

var _ViewModel = require('./ViewModel');

var _ViewModel2 = _interopRequireDefault(_ViewModel);

var _Observable = require('./Observable');

var _Observable2 = _interopRequireDefault(_Observable);

var _BSODViewModel = require('./BSODViewModel');

var _BSODViewModel2 = _interopRequireDefault(_BSODViewModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BSTestViewModel extends _ViewModel2.default {
    /**
     *
     * @param api {BattleshipApi}
     */
    constructor(api) {
        super(api, 'vm-bstest');

        this.token = new _Observable2.default(this.api.token);
        this.ships = new _Observable2.default();
        this.user = new _Observable2.default();
        this.games = new _Observable2.default();

        this.observe();
    }

    onError(reason, error) {
        // console.log(error);
        // swal({
        //     title: "You broke it :(",
        //     text: `<p>An error occurred, please reload the page to try again.</p><code>${reason}</code>`,
        //     type: "error",
        //     html: true
        // });

        let bsod = new _BSODViewModel2.default(this.api);
        bsod.addTo('body');

        this.loading = false;
    }

    load() {
        this.loading = true;

        _Ship2.default.getAll(this.api, ships => this.ships.$value = ships, this.onError.bind(this));
        _UserViewModel2.default.getCurrent(this.api, user => this.user.$value = user, this.onError.bind(this));
        _UserGame2.default.getForCurrentUser(this.api, games => {
            this.games.$value = games;
            this.loading = false;
        }, this.onError.bind(this));
    }

    draw() {
        let template = `<div id="${ this.name }" class="bs-fill-page">
<code class="bs-console">
        Some information... 🎩
    </code>
    <input type="text" id="input-token" value="${ this.token.$value }"/>
    <ul class="bs-tst-cards">
        <li class="bs-tst-card">
            <h4>Ships</h4>
            <ul id="ship-list"></ul>
        </li>
        <li class="bs-tst-card">
            <h4>User</h4>
            <ul id="user-info"></ul>
        </li>
        <li class="bs-tst-card">
            <h4>Games <a id="tst-delete"><i class="fa fa-trash"></i></a></h4>
            <ul id="all-games"></ul>
        </li>
    </ul>
</div>`;

        this.parent.append(template);
        this.bind();
    }

    bind() {
        let input = $('#input-token');
        input.change(() => this.token.$value = input.val());

        $('#tst-delete').click(() => {
            swal({
                title: "Are you sure?",
                text: "This will remove all your games",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Remove them!",
                cancelButtonText: "Nope",
                closeOnConfirm: false
            }, () => _UserGame2.default.deleteAll(this.api, null, this.onError.bind(this)));
        });
    }

    observe() {
        this.api.onTokenChanged(() => this.load());

        this.token.addObserver(args => this.api.token = args.newValue);
        this.user.addObserver(args => args.newValue.displayOn('#user-info'));
        this.ships.addObserver(args => {
            let shipList = $('#ship-list');
            shipList.empty();

            args.newValue.forEach(ship => shipList.append(`<li>${ ship.name }</li>`));
        });
        this.games.addObserver(args => {
            let gameList = $('#all-games');
            gameList.empty();

            args.newValue.forEach(game => {

                game.onUpdate(this.api, () => {
                    $(`#g-${ game.id }-state`).text(game.state);
                });

                let string = `<li id="g-${ game.id }">
<ul class="bs-tst-game">
    <li><small class="game-id">${ game.id }</small></li>
    <li>Tegen: '${ game.enemyName }'</li>
    <li><small id="g-${ game.id }-state">${ game.state }</small></li>
</ul>
</li>`;

                if (game.state === _BattleshipConst.STATE.STARTED) {
                    _StartedGame2.default.get(this.api, game.id, startedGame => {
                        let g_el = $(`#g-${ game.id }`).find(`.bs-tst-game`);
                        if (startedGame.isPlayerTurn) g_el.append('<li><small>Jouw beurt</small></li>');else g_el.append('<li><small>Niet jouw beurt</small></li>');
                    }, this.onError);
                }

                gameList.append(string);
            });
        });
    }

    set loading(value) {

        let allCards = $('.bs-tst-card');

        if (value) allCards.addClass('bs-tst-card-loading');else allCards.removeClass('bs-tst-card-loading');

        super.loading = value;
    }
}
exports.default = BSTestViewModel;

},{"../model/games/StartedGame":12,"../model/games/UserGame":13,"../model/ships/Ship":15,"../util/BattleshipApi":16,"../util/BattleshipConst":17,"./BSODViewModel":22,"./Observable":24,"./UserViewModel":25,"./ViewModel":26}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class Observable {
    constructor(value = null) {
        this._v = value;
        this._observers = [];
    }

    get $value() {
        return this._v;
    }

    set $value(value) {

        if (this._v === value) return;

        let args = { oldValue: this._v, newValue: value };
        this._v = value;

        this._observers.forEach(observer => observer(args));
    }

    /**
     *
     * @param observer {function}
     */
    addObserver(observer) {
        this._observers.push(observer);
    }
}
exports.default = Observable;

},{}],25:[function(require,module,exports){
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

},{"./../model/User":4,"./../util/Hu":19}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class ViewModel {
    /**
     *
     * @param api {BattleshipApi}
     * @param name {string}
     */
    constructor(api, name) {
        this.api = api;
        this.name = name;
        this.loading = false;
    }

    /**
     *
     * @param parent {string}
     */
    addTo(parent = 'body') {
        this.parent = $(parent);

        this.draw();
        this.load();
    }

    destroy() {
        this.parent.remove(`#${ this.name }`);
    }

    load() {}
    draw() {}
    bind() {}
    observe() {}

    get loading() {
        return this._loading;
    }

    set loading(value) {
        this._loading = value;
    }

    onError(reason, error) {
        // console.log(error);
        // swal({
        //     title: "You broke it :(",
        //     text: `<p>An error occurred, please reload the page to try again.</p><code>${reason}</code>`,
        //     type: "error",
        //     html: true
        // });

        let bsod = new BSODViewModel(this.api);
        bsod.addTo('body');

        this.loading = false;
    }
}
exports.default = ViewModel;

},{}]},{},[1]);
