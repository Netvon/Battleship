(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _BattleshipApi = require('./util/BattleshipApi');

var _BattleshipApi2 = _interopRequireDefault(_BattleshipApi);

var _Persistence = require('./util/Persistence');

var _Persistence2 = _interopRequireDefault(_Persistence);

var _TitleScreenViewModel = require('./viewmodel/TitleScreenViewModel');

var _TitleScreenViewModel2 = _interopRequireDefault(_TitleScreenViewModel);

var _PlayerGameboardViewModel = require('./viewmodel/PlayerGameboardViewModel');

var _PlayerGameboardViewModel2 = _interopRequireDefault(_PlayerGameboardViewModel);

var _Cell = require('./model/Cell');

var _Cell2 = _interopRequireDefault(_Cell);

var _LobbyGameViewModel = require('./viewmodel/LobbyGameViewModel');

var _LobbyGameViewModel2 = _interopRequireDefault(_LobbyGameViewModel);

var _MainViewModel = require('./viewmodel/MainViewModel');

var _MainViewModel2 = _interopRequireDefault(_MainViewModel);

var _AudioManager = require('./util/AudioManager');

var _AudioManager2 = _interopRequireDefault(_AudioManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {

    // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InNlZS5ncmFuZGlhQHN0dWRlbnQuYXZhbnMubmwi.DtPnllHeZKqv_lM7evo72TyJWpSOELFunRs4myKHMHA
    // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InRtZS52YW5uaW13ZWdlbkBzdHVkZW50LmF2YW5zLm5sIg.4yuhuKWBCnQuoxAeVL2xQ3Ua41YPLRqT7F8FkhxUcKI

    if (!_Persistence2.default.hasKey('token')) _Persistence2.default.set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InRtZS52YW5uaW13ZWdlbkBzdHVkZW50LmF2YW5zLm5sIg.4yuhuKWBCnQuoxAeVL2xQ3Ua41YPLRqT7F8FkhxUcKI');

    let token = _Persistence2.default.get('token');
    let battleshipApi = new _BattleshipApi2.default(token);

    let titleVM = new _MainViewModel2.default(battleshipApi);
    titleVM.addTo('body');

    // var battleshipApi = new BattleshipApi(token);
    //
    // UserGameViewModel.getForCurrentUser(battleshipApi, games => games.forEach(game => console.log(game.enemyId)));
    //
    // let playerGameboardVM = new PlayerGameboardViewModel();
    // playerGameboardVM.addTo('body');

    // userGameViewModel.showGames();

    // UserViewModel.getCurrent(battleshipApi, user => user.displayOn('#user-info'));

    // SetupGame.deleteAll(battleshipApi, e => {
    //
    //     Ship.getAll(battleshipApi, ships => {
    //
    //         allShips = ships;
    //
    //         ships.forEach(ship => Hu.queryAppend('ul#ship-list', `<li>${ship.name}</li>`));
    //
    //         SetupGame.create(battleshipApi, game => {
    //             console.log(`Created new game: ${game.id}`);
    //             UserViewModel.getGames(battleshipApi, games => {
    //                 games.forEach(g => Hu.queryAppend('#all-games > ul', `<li id="g-${g.id}">${g.id} - ${g.state}</li>`));
    //             });
    //
    //             let gameboard = new Gameboard();
    //             gameboard.placeShip(allShips[0], new Cell(1, 1), 'vertical');
    //             gameboard.placeShip(allShips[1], new Cell(2, 1), 'vertical');
    //             gameboard.placeShip(allShips[2], new Cell(3, 1), 'vertical');
    //             gameboard.placeShip(allShips[3], new Cell(4, 1), 'vertical');
    //             gameboard.placeShip(allShips[4], new Cell(5, 1), 'vertical');
    //
    //             game.submitGameboard(battleshipApi, gameboard, data => {
    //                 console.log("Submitted Gameboard");
    //                 console.log(data);
    //
    //                 Hu.querySet(`#g-${game.id}`, `${game.id} - ${game.state}`);
    //
    //                 data.doShot(battleshipApi, new Cell(1, 1), data => console.log(`Shot output: ${data}`));
    //             });
    //
    //         }, true);
    //     });
    //
    //
    // });
})();

},{"./model/Cell":2,"./util/AudioManager":17,"./util/BattleshipApi":18,"./util/Persistence":23,"./viewmodel/LobbyGameViewModel":27,"./viewmodel/MainViewModel":29,"./viewmodel/PlayerGameboardViewModel":31,"./viewmodel/TitleScreenViewModel":32}],2:[function(require,module,exports){
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

},{"../util/BattleshipConst":19,"./../util/JsonBase":22}],3:[function(require,module,exports){
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

        if (typeof id !== 'string' && typeof id !== 'number') throw new TypeError(`The ID of a shot must be a string or a number. was: ${ typeof id }`);

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
     * @returns {Promise}
     */
    static getCurrent(api) {

        if (_Persistence2.default.hasKey(bs.PER_USERKEY)) {
            return Promise.resolve(User.fromJson(JSON.parse(_Persistence2.default.get(bs.PER_USERKEY))));
        }

        return api.apiGet({ route: _BattleshipApi2.default.routes.currentUser }).then(data => {
            _Persistence2.default.set(bs.PER_USERKEY, JSON.stringify(data));
            return User.fromJson(data);
        });
    }

    static hallo() {
        console.log('hallo');
    }

    /**
     * Returns an Array of all Games the current user is participating in.
     *
     * @param api {BattleshipApi}
     * @returns {Promise}
     */
    static getGames(api) {
        return _UserGame2.default.getForCurrentUser(api);
    }

    /**
     * Removes all Games the current user is participating in.
     *
     * @param api {BattleshipApi}
     * @return {Promise}
     */
    static deleteAllGames(api) {
        return _UserGame2.default.deleteAll(api);
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

},{"../util/BattleshipApi":18,"../util/BattleshipConst":19,"./../model/games/UserGame":14,"./../util/JsonBase":22,"./../util/Persistence":23}],5:[function(require,module,exports){
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

},{"./../../util/JsonBase":22,"./../Shot":3}],6:[function(require,module,exports){
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

    drawGameboard() {
        $('.bs-hero-title').hide();
        $('.bs-hero-menu').hide();
    }
}
exports.default = Gameboard;

},{"../../util/BattleshipConst":19,"./../../util/JsonBase":22,"./../ships/GameboardShip":15}],7:[function(require,module,exports){
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

},{"../Shot":3,"./../ships/GameboardShip":15,"./Gameboard":6}],8:[function(require,module,exports){
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

},{"../../model/Cell":2,"../../util/JsonBase":22}],9:[function(require,module,exports){
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

},{"../../util/JsonBase":22}],10:[function(require,module,exports){
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

},{"../../util/JsonBase":22,"../games/BaseGame":11}],11:[function(require,module,exports){
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
     * @returns {Promise}
     */
    static deleteAll(api) {
        if (!(api instanceof _BattleshipApi2.default)) throw new Error("The 'api' parameter on User.deleteAllGames cannot be null");

        return api.apiDelete({ route: _BattleshipApi2.default.routes.currentUserGames });
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

},{"../../util/BattleshipApi":18,"../../util/BattleshipConst":19,"./../../util/JsonBase":22}],12:[function(require,module,exports){
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

var _UserGame = require('./UserGame');

var _UserGame2 = _interopRequireDefault(_UserGame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SetupGame extends _BaseGame2.default {
    /**
     * Constructs a new instance of the SetupGame class
     *
     * @param id {number}
     * @param player1 {string}
     * @param player2 {string}
     * @param state {string}
     * @param isAi {boolean}
     */
    constructor(id, player1, player2, state, isAi) {
        super(id, state);

        this.player1 = player1;
        this.player2 = player2;
        this.isAi = isAi;
    }

    /**
     * Creates a new SetupGame
     *
     * @param api {BattleshipApi}
     * @param isAi {boolean}
     * @return {Promise}
     */
    static create(api, isAi = false) {

        let route = _BattleshipApi2.default.routes.createGame;
        if (isAi) route = _BattleshipApi2.default.routes.createGameWithAi;

        return api.apiGet({ route }).then(data => {
            return SetupGame.fromJson(data);
        });
    }

    /**
     * Submit a Gameboard to the API.
     *
     * @param api {BattleshipApi}
     * @param gameboard {Gameboard}
     * @param id {number}
     * @return {Promise}
     */
    static submitGameboard(api, gameboard, id) {

        // if (this.state !== STATE.SETUP) {
        //     let msg = `You cannot send a Gameboard to a game that is not in the ${STATE.SETUP} state. Current state: ${this.state}`;
        //     return Promise.reject(msg);
        // }

        return api.apiPost({ route: _BattleshipApi2.default.routes.gameSetupById, parameter: id }, gameboard.toJson()).then(data => {

            if (data.msg !== undefined && data.msg !== 'success') {
                return Promise.reject(data);
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
        return new SetupGame(jsonObject._id, jsonObject.player1, jsonObject.player2, jsonObject.status, jsonObject.isAI);
    }
}
exports.default = SetupGame;

},{"../../util/BattleshipApi":18,"../../util/BattleshipConst":19,"./BaseGame":11,"./StartedGame":13,"./UserGame":14}],13:[function(require,module,exports){
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
     * @return {Promise}
     */
    doShot(api, cell) {

        if (!this.isPlayerTurn) {
            let msg = `You cannot fire a shot in Game#${ this.id } because it is not your turn`;
            return Promise.reject(msg);
        }

        return api.apiPost({ route: _BattleshipApi2.default.routes.gameShotById, parameter: this.id }, cell.toJson());
    }

    /**
     * Returns a new instance of the StaredGame class by ID
     *
     * @param api {BattleshipApi}
     * @param id {number}
     * @return {Promise}
     */
    static get(api, id) {
        return api.apiGet({ route: _BattleshipApi2.default.routes.gameById, parameter: id }).then(data => {
            if (data.error !== undefined) {
                throw new Error(data.error);
            }

            return StartedGame.fromJson(data);
        });
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

},{"../../util/BattleshipApi":18,"../board/EnemyGameboard":5,"../board/PlayerGameboard":7,"./UserGame":14}],14:[function(require,module,exports){
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
     * @return {Promise}
     */
    static getForCurrentUser(api) {
        return api.apiGet({ route: _BattleshipApi2.default.routes.currentUserGames }).then(data => {
            let userGames = [];

            data.forEach(item => {
                userGames.push(UserGame.fromJson(item));
            });

            return userGames;
        });
    }

    /**
     *
     * @param api
     * @param id
     * @returns {Promise}
     */
    static get(api, id) {
        return UserGame.getForCurrentUser(api).then(games => {
            return games.find(game => game.id === id);
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

},{"../../util/BattleshipApi":18,"./BaseGame":11}],15:[function(require,module,exports){
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

},{"../../util/BattleshipConst":19,"./../Cell":2,"./../Shot":3,"./Ship":16}],16:[function(require,module,exports){
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
     * @returns {Promise}
     */
    static getAll(api) {

        let processShips = data => {
            _Persistence2.default.set(bs.PER_SHIPSKEY, JSON.stringify(data));

            let ships = [];

            data.forEach(jsonShip => {
                ships.push(Ship.fromJson(jsonShip));
            });

            return ships;
        };

        if (_Persistence2.default.hasKey(bs.PER_SHIPSKEY)) {
            let json = _Persistence2.default.get(bs.PER_SHIPSKEY);
            return Promise.resolve(processShips(JSON.parse(json)));
        }

        return api.apiGet({ route: _BattleshipApi2.default.routes.allShips }).then(data => {
            return processShips(data);
        });
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

},{"../../util/BattleshipApi":18,"../../util/BattleshipConst":19,"../../util/JsonBase":22,"../../util/Persistence":23}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class AudioManager {

    static load(name, source) {
        if (this._audio === undefined) this._audio = new Map();

        let el = document.createElement('audio');
        el.src = source;
        el.volume = 0.5;
        this._audio.set(name, el);

        el.currentTime = 0;
    }

    static play(name, loop = false, removeAfterComplete = true, startAt = 0) {

        if (this._audio === undefined || !this._audio.has(name)) this._audio = new Map();

        // console.dir(this._audio);

        let el = this._audio.get(name);

        if (removeAfterComplete) el.addEventListener('ended', () => this._audio.delete(name));

        el.loop = loop;
        el.currentTime = startAt;
        el.play();
    }

    static pause(name) {
        if (this._audio === undefined || !this._audio.has(name)) return;

        this._audio.get(name).pause();
    }

    static stop(name) {
        if (this._audio === undefined || !this._audio.has(name)) return;

        let audio = this._audio.get(name);

        audio.pause();
        audio.currentTime = 0;
    }
}
exports.default = AudioManager;

},{}],18:[function(require,module,exports){
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
        return 'https://zeeslagavans3.herokuapp.com/';
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
     * @param token
     * @returns {string}
     */
    withApiTokenSuffix(formattedRoute, token = this.token) {
        if (formattedRoute === undefined || formattedRoute === null) throw new Error('BattleshipApi needs jQuery to work');

        if (typeof formattedRoute !== 'string') throw new Error("The 'formattedRoute' parameter on BattleshipApi.withApiTokenSuffix must be a string");

        return `${ BattleshipApi.url }${ formattedRoute }?${ BattleshipApi.tokenPrefix }${ token }`;
    }

    /**
     * Sends a Get request to the BattleShip Api
     *  The options are:
     *  - route {BattleshipRoute}
     *  - parameter {string}
     *
     * @param route {BattleshipRoute}
     * @param parameter {string}
     * @returns {Promise}
     */
    apiGet({ route, parameter }) {

        return new Promise(function (resolve, reject) {
            if (route === null || route === undefined) {
                let msg = 'The route option on the apiGet function of BattleshipApi cannot be empty';
                reject(msg);
            }

            if (!route.checkMethod('get')) reject(`The selected route ('${ route.urlFormat }') does not support the 'get' method`);

            let url = this.withApiTokenSuffix(route.format(parameter));

            $.ajax({
                timeout: bs.AJAX_TIMEOUT,
                url: url,
                type: 'GET'
            }).done(data => {
                if (data.error) {
                    let _msg = data.error.replace('Error: ', '');
                    reject(_msg);
                }

                resolve(data);
            }).fail(jqXHR => {
                reject(`HTTP Status: ${ jqXHR.status }`);
            });
        }.bind(this));
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
     * @returns {Promise}
     */
    apiPost({ route, parameter }, object) {

        return new Promise((resolve, reject) => {
            if (route === null || route === undefined) {
                let msg = 'The route option on the apiGet function of BattleshipApi cannot be empty';
                reject(msg);
            }

            if (!route.checkMethod('post')) reject(`The selected route ('${ route.urlFormat }') does not support the 'post' method`);

            let url = this.withApiTokenSuffix(route.format(parameter));

            $.ajax({
                timeout: bs.AJAX_TIMEOUT,
                url: url,
                type: 'POST',
                contents: object
            }).done(data => {
                if (data.error) {
                    let _msg = data.error.replace('Error: ', '');
                    reject(_msg);
                }

                resolve(data);
            }).fail(jqXHR => {
                reject(`HTTP Status: ${ jqXHR.status }`);
            });
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
     * @returns {Promise}
     */
    apiDelete({ route, parameter }) {

        return new Promise((resolve, reject) => {
            if (route === null || route === undefined) {
                let msg = 'The route option on the apiDelete function of BattleshipApi cannot be empty';
                reject(msg);
            }

            if (!route.checkMethod('delete')) reject(`The selected route ('${ route.urlFormat }') does not support the 'delete' method`);

            $.ajax({
                timeout: bs.AJAX_TIMEOUT,
                url: this.withApiTokenSuffix(route.format(parameter)),
                type: 'DELETE'
            }).success(data => {
                if (data.error) {
                    let _msg = data.error.replace('Error: ', '');
                    reject(_msg);
                }

                resolve(data);
            }).fail(jqXHR => {
                reject(`HTTP Status: ${ jqXHR.status }`);
            });
        });
    }

    isValidToken(token) {

        if (typeof token !== 'string') return Promise.reject('Token must be a string');

        return new Promise((resolve, reject) => {
            $.ajax({
                timeout: bs.AJAX_TIMEOUT,
                url: this.withApiTokenSuffix(BattleshipApi.routes.currentUser.format(1), token),
                type: 'GET'
            }).done(data => {
                if (data.msg) {
                    let _msg = data.msg.replace('Error: ', '');
                    reject(_msg);
                }

                resolve(data);
            }).fail(jqXHR => {
                reject(`HTTP Status: ${ jqXHR.status }`);
            });
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

},{"../model/events/ShotEventArguments":8,"../model/events/TurnEventArguments":9,"../model/events/UpdateEventArguments":10,"./BattleshipConst":19,"./BattleshipRoute":20,"./Persistence":23}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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
        return this.methods.indexOf(method) !== -1;
    }
}
exports.default = BattleshipRoute;

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class Session {
    /**
     * Returns a stored value from the Session storage.
     *
     * @param key {string}
     */
    static get(key) {
        if (typeof Storage === "undefined") throw new Error("Session storage is not supported.");

        return sessionStorage.getItem(key);
    }

    /**
     * Sets a value in the Session storage
     *
     * @param key {string}
     * @param value {*}
     */
    static set(key, value) {
        if (typeof Storage === "undefined") throw new Error("Session storage is not supported.");

        sessionStorage.setItem(key, value);
    }

    /**
     * Removes a key from the Session storage
     *
     * @param key {string}
     */
    static remove(key) {
        if (typeof Storage === "undefined") throw new Error("Session storage is not supported.");

        sessionStorage.removeItem(key);
    }

    /**
     * Checks if a given key exists in the Session Storage
     *
     * @param key {string}
     * @returns {boolean}
     */
    static hasKey(key) {
        if (typeof Storage === "undefined") throw new Error("Session storage is not supported.");

        return sessionStorage.getItem(key) !== null;
    }
}
exports.default = Session;

},{}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ViewModel = require('./ViewModel');

var _ViewModel2 = _interopRequireDefault(_ViewModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BSODViewModel extends _ViewModel2.default {
    constructor(api, errorCode, reason) {
        super(api, 'vm-bsod');

        this.errorCode = errorCode;
        this.reason = reason;
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

        if (this.errorCode !== undefined) {
            $(this.name).append(`<pre><code>Status: ${ this.errorCode }</code></pre>`);
        }

        // console.log(this.reason);

        if (this.reason !== null) {
            $(`#${ this.name }`).append(`<pre><code>${ this.reason }</code></pre>`);
        }
    }
}
exports.default = BSODViewModel;

},{"./ViewModel":34}],26:[function(require,module,exports){
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

var _SetupGame = require('../model/games/SetupGame');

var _SetupGame2 = _interopRequireDefault(_SetupGame);

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
    }

    onError(reason, error, statusCode) {
        // console.log(error);
        // swal({
        //     title: "You broke it :(",
        //     text: `<p>An error occurred, please reload the page to try again.</p><code>${reason}</code>`,
        //     type: "error",
        //     html: true
        // });

        // console.log(statusCode);

        let bsod = new _BSODViewModel2.default(this.api, statusCode, reason);
        bsod.addTo('body');

        this.loading = false;
    }

    load() {
        this.loading = true;

        let promises = [_Ship2.default.getAll(this.api).then(ships => this.ships.$value = ships), _UserViewModel2.default.getCurrent(this.api).then(user => this.user.$value = user), _UserGame2.default.getForCurrentUser(this.api).then(games => this.games.$value = games)];

        Promise.all(promises).then(() => this.loading = false).catch(this.onError.bind(this));
    }

    draw() {
        this.observe();

        let template = `<div id="${ this.name }" class="bs-fill-page bs-tst">
<code class="bs-console">
        Some information... 🎩
    </code>
    <input class="bs-input" type="text" id="input-token" value="${ this.token.$value }"/>
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
    <button id="tst-ai-game" class="bs-button bs-button-primary">Create AI Game</button>
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
            }, () => _UserGame2.default.deleteAll(this.api).catch(this.onError.bind(this)));
        });

        $('#tst-ai-game').click(() => {
            _SetupGame2.default.create(this.api, true).then(() => swal('Game created!')).catch(this.onError.bind(this));
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
                    _StartedGame2.default.get(this.api, game.id).then(startedGame => {
                        let g_el = $(`#g-${ game.id }`).find(`.bs-tst-game`);
                        if (startedGame.isPlayerTurn) g_el.append('<li><small>Jouw beurt</small></li>');else g_el.append('<li><small>Niet jouw beurt</small></li>');
                    }).catch(this.onError.bind(this));
                }

                gameList.append(string);
            });
        });

        this.api.onUpdate(console.dir);
        this.api.onTurn(console.log);
        this.api.onShot(console.log);
    }

    set loading(value) {

        let allCards = $('.bs-tst-card');

        if (value) allCards.addClass('bs-tst-card-loading');else allCards.removeClass('bs-tst-card-loading');

        super.loading = value;
    }
}
exports.default = BSTestViewModel;

},{"../model/games/SetupGame":12,"../model/games/StartedGame":13,"../model/games/UserGame":14,"../model/ships/Ship":16,"../util/BattleshipApi":18,"../util/BattleshipConst":19,"./BSODViewModel":25,"./Observable":30,"./UserViewModel":33,"./ViewModel":34}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ViewModel = require("./ViewModel");

var _ViewModel2 = _interopRequireDefault(_ViewModel);

var _BattleshipConst = require("../util/BattleshipConst");

var _StartedGame = require("../model/games/StartedGame");

var _StartedGame2 = _interopRequireDefault(_StartedGame);

var _UserGame = require("../model/games/UserGame");

var _UserGame2 = _interopRequireDefault(_UserGame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by Sander on 07-06-16.
 */
class LobbyGameViewModel extends _ViewModel2.default {
    constructor(api, userGame) {
        super(api, `vm-usergame-${ userGame.id }`);

        this.userGame = userGame;
    }

    draw() {
        let template = `<li id="lobby-g-${ this.userGame.id }" data-state="${ this.userGame.state }" title="Playing against '${ this.userGame.enemyName }'">
<ul role="button" class="bs-lobby-list-item" data-gid="${ this.userGame.id }">
    <li class="bs-lobby-list-item-li"><i class="fa fa-refresh fa-spin"></i></li>
    <li class="bs-lobby-list-item-id"><small class="game-id">${ this.userGame.id }</small></li>
    <li class="bs-lobby-list-item-vs" id="lobby-g-${ this.userGame.id }-vs">${ this.userGame.enemyName }</li>
    <li class="bs-lobby-list-item-state"><small id="lobby-g-${ this.userGame.id }-state">${ this.userGame.state }</small></li>
    <li class="bs-lobby-list-item-turn"><small></small></li>
    <li class="bs-lobby-list-item-go"><i class="fa fa-chevron-circle-right"></i></li>
</ul>
</li>`;

        this.parent.append(template);
        this.observe();
    }

    observe() {

        let checkStarted = () => {

            this.loading = true;

            if (this.userGame.state === _BattleshipConst.STATE.QUEUE) {
                $(`#lobby-g-${ this.userGame.id }-vs`).text('Searching for opponent ...');
                $(`#lobby-g-${ this.userGame.id }`).attr('title', 'Searching for opponent ...');
            }

            // console.log(this.userGame.state);

            if (this.userGame.state === _BattleshipConst.STATE.STARTED) {
                _StartedGame2.default.get(this.api, this.userGame.id).then(startedGame => {
                    let g_el = $(`#lobby-g-${ this.userGame.id }`).find(`.bs-lobby-list-item`).find('.bs-lobby-list-item-turn small');

                    if (startedGame.isPlayerTurn) g_el.text('Your turn!');else g_el.text('Not your turn');

                    this.loading = false;
                }).catch(this.onError.bind(this));
            } else if (this.userGame.state === _BattleshipConst.STATE.SETUP && this.userGame.enemyName === undefined) {
                _UserGame2.default.get(this.api, this.userGame.id).then(userGame => {
                    let main = $(`#lobby-g-${ userGame.id }`);
                    $(`#lobby-g-${ userGame.id }-state`).text(userGame.state);
                    $(`#lobby-g-${ userGame.id }-vs`).text(userGame.enemyName);
                    main.attr('title', `Playing against '${ userGame.enemyName }'`);
                    main.attr('data-state', userGame.state);

                    this.loading = false;
                }).catch(this.onError.bind(this));
            } else {
                this.loading = false;
            }
        };

        checkStarted();

        this.userGame.onUpdate(this.api, () => {

            console.log(`[${ this.userGame.id }] I got updated`);
            console.log(this.userGame.state);

            // let main = $(`#lobby-g-${this.userGame.id}`);
            // $(`#lobby-g-${this.userGame.id}-state`).text(this.userGame.state);
            // $(`#lobby-g-${this.userGame.id}-vs`).text(this.userGame.enemyName);
            // main.attr('title', `Playing against '${this.userGame.enemyName}'`);
            // main.attr('data-state', this.userGame.state);

            checkStarted();
        });
    }

    set loading(value) {
        super.loading = value;

        if (this.userGame !== undefined) {
            // console.log(`ID: ${this.userGame.id} - ${super.loading}`);

            let item = $(`#lobby-g-${ this.userGame.id }`).find('.bs-lobby-list-item-li');

            // console.log(item);

            if (super.loading) {
                item.show();
            } else {
                item.hide();
            }
        }
    }

    showGames() {
        // console.log(this);

        // $('.menu-hero').on('click', '#resume-game', function () {
        //     $('.bs-hero-menu').hide();
        //
        //     Hu.queryAppend('header',
        //         `<table class="games-table">
        //         <th>game</th>
        //         <th>state</th>
        //     </table>`
        //     );
        //
        //     UserViewModel.getGames(battleshipApi, games => {
        //         games.forEach(g => {
        //             Hu.queryAppend('header > .games-table', `<tr id="g-${g.id}"><td>${g.id}</td><td>${g.state}</td></tr>`);
        //             $(`#g-${g.id}`).on('click', this, function () {
        //                 console.log(`Starting g-${g.id}...`);
        //             });
        //         });
        //     });
        // });
    }
}
exports.default = LobbyGameViewModel;

},{"../model/games/StartedGame":13,"../model/games/UserGame":14,"../util/BattleshipConst":19,"./ViewModel":34}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ViewModel = require("./ViewModel");

var _ViewModel2 = _interopRequireDefault(_ViewModel);

var _UserGame = require("../model/games/UserGame");

var _UserGame2 = _interopRequireDefault(_UserGame);

var _Observable = require("./Observable");

var _Observable2 = _interopRequireDefault(_Observable);

var _LobbyGameViewModel = require("./LobbyGameViewModel");

var _LobbyGameViewModel2 = _interopRequireDefault(_LobbyGameViewModel);

var _User = require("../model/User");

var _User2 = _interopRequireDefault(_User);

var _SetupGame = require("../model/games/SetupGame");

var _SetupGame2 = _interopRequireDefault(_SetupGame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LobbyViewModel extends _ViewModel2.default {
    constructor(api) {
        super(api, 'vm-lobby');

        this.games = new _Observable2.default();
        this.user = new _Observable2.default();

        this._ids = new Set();

        this.observe();
    }

    load() {
        this.loading = true;

        let tasks = [_UserGame2.default.getForCurrentUser(this.api).then(games => this.games.$value = games), _User2.default.getCurrent(this.api).then(user => this.user.$value = user)];

        Promise.all(tasks).then(() => this.loading = false).catch(this.onError.bind(this));
    }

    bind() {

        $('#lobby-new-game').on('click', () => {
            _SetupGame2.default.create(this.api).then(() => swal('Game created!')).catch((reason, error, statusCode) => {
                if (statusCode !== undefined) {
                    this.onError(reason, error, statusCode);
                } else {
                    swal({
                        title: "Can't let you do that.",
                        text: reason
                    });
                }
            });
        });

        $('#lobby-new-ai').on('click', () => {
            _SetupGame2.default.create(this.api, true).then(() => swal('Game created!')).catch((reason, error, statusCode) => {
                if (statusCode !== undefined) {
                    this.onError(reason, error, statusCode);
                } else {
                    swal({
                        title: "Can't let you do that.",
                        text: reason
                    });
                }
            });
        });

        $('#lobby-remove-games').on('click', () => {
            swal({
                title: "Are you sure?",
                text: "This will remove all your games",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Remove them!",
                cancelButtonText: "Nope",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, () => {
                this.games.$value = [];

                _UserGame2.default.deleteAll(this.api).then(() => swal({
                    title: "Battles removed",
                    type: "success"
                })).catch(this.onError.bind(this));
            });
        });
    }

    draw() {
        let template = `<div id="${ this.name }" class="bs-fill-page bs-lobby">
<div class="bs-lobby-container">
<h1 class="bs-lobby-title">Battleship</h1>
<div id="lobby-user-info" class="bs-lobby-user">
    <p>Here's a list of all the Battles currently happening.</p>
    <button id="lobby-remove-games" class="bs-button bs-button-primary" title="Remove all Battles"><i class="fa fa-trash"></i><span class="bs-button-text">Remove all Battles</span></button>
    <button id="lobby-new-game" class="bs-button bs-button-primary" title="New Battle"><i class="fa fa-plus"></i><span class="bs-button-text">New Battle</span></button>
    <button id="lobby-new-ai" class="bs-button bs-button-primary" title="Start Training"><i class="fa fa-plus"></i><span class="bs-button-text">New Training</span></button>
</div>
<ul class="bs-lobby-list" id="bs-lobby-list" role="list"></ul>
</div>
</div>`;

        this.parent.append(template);

        this.bind();
    }

    observe() {

        this.api.onUpdate(args => {

            let contains = this._ids.has(args.gameId);

            if (!contains) {

                this.loading = true;
                _UserGame2.default.get(this.api, args.gameId).then(userGame => {

                    this._ids.add(userGame.id);
                    let lgvm = new _LobbyGameViewModel2.default(this.api, userGame);
                    lgvm.addTo('#bs-lobby-list');

                    this.loading = false;
                }).catch(this.onError.bind(this));
            }
        });

        this.games.addObserver(args => {
            let list = $('#bs-lobby-list');
            list.empty();

            args.newValue.forEach(item => {
                this._ids.add(item.id);
                let lgvm = new _LobbyGameViewModel2.default(this.api, item);
                lgvm.addTo('#bs-lobby-list');
            });
        });

        // this.user.addObserver(args => {
        //
        //     $('#lobby-user-info').text(args.newValue.name);
        //
        // });
    }

    set loading(value) {

        let list = $('#bs-lobby-list');

        if (value) list.addClass('bs-lobby-list-loading');else list.removeClass('bs-lobby-list-loading');

        super.loading = value;
    }
}
exports.default = LobbyViewModel;

},{"../model/User":4,"../model/games/SetupGame":12,"../model/games/UserGame":14,"./LobbyGameViewModel":27,"./Observable":30,"./ViewModel":34}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ViewModel = require("./ViewModel");

var _ViewModel2 = _interopRequireDefault(_ViewModel);

var _TitleScreenViewModel = require("./TitleScreenViewModel");

var _TitleScreenViewModel2 = _interopRequireDefault(_TitleScreenViewModel);

var _LobbyViewModel = require("./LobbyViewModel");

var _LobbyViewModel2 = _interopRequireDefault(_LobbyViewModel);

var _Observable = require("./Observable");

var _Observable2 = _interopRequireDefault(_Observable);

var _BSTestViewModel = require("./BSTestViewModel");

var _BSTestViewModel2 = _interopRequireDefault(_BSTestViewModel);

var _Session = require("../util/Session");

var _Session2 = _interopRequireDefault(_Session);

var _BSODViewModel = require("./BSODViewModel");

var _BSODViewModel2 = _interopRequireDefault(_BSODViewModel);

var _LobbyGameViewModel = require("./LobbyGameViewModel");

var _LobbyGameViewModel2 = _interopRequireDefault(_LobbyGameViewModel);

var _PlayerGameboardViewModel = require("./PlayerGameboardViewModel");

var _PlayerGameboardViewModel2 = _interopRequireDefault(_PlayerGameboardViewModel);

var _AudioManager = require("../util/AudioManager");

var _AudioManager2 = _interopRequireDefault(_AudioManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MainViewModel extends _ViewModel2.default {
    constructor(api) {
        super(api, 'vm-main');

        if (!_Session2.default.hasKey('last-page')) {
            _Session2.default.set('last-page', '1');
        }

        _LobbyViewModel2.default.prototype.onError = this.handleError;
        _TitleScreenViewModel2.default.prototype.onError = this.handleError;
        _LobbyGameViewModel2.default.prototype.onError = this.handleError;
        _BSTestViewModel2.default.prototype.onError = this.handleError;
        _PlayerGameboardViewModel2.default.prototype.onError = this.handleError;

        this.bsTestVM = new _BSTestViewModel2.default(this.api);
        this.bsTestVisible = new _Observable2.default(false);

        this.titleVM = new _TitleScreenViewModel2.default(this.api);
        this.lobbyVM = new _LobbyViewModel2.default(this.api);
        // this.gameBoardVM = new PlayerGameboardViewModel(this.api);

        this.playingBGM = new _Observable2.default(true);

        this.views = {
            1: this.titleVM,
            2: this.lobbyVM
            // 3: this.gameBoardVM
        };

        this.currentView = new _Observable2.default(null);
    }

    draw() {

        _AudioManager2.default.load('btn1', 'audio/button-37.mp3');

        _AudioManager2.default.load('test2', 'audio/test2.mp3');
        _AudioManager2.default.play('test2');

        let template = `<p class="bs-credit">Made by Sander & Tom <button class="bs-button" id="debug-toggle">Show Test View</button></p>`;

        this.parent.append(template);
        this.parent.append(`<button id="go-back" class="bs-button bs-button-primary" title="Go back"><i class="fa fa-chevron-left"></i></button>`);
        this.parent.append(`<button id="mute" class="bs-button bs-button-primary" title="Mute"><i class="fa fa-volume-up"></i></button>`);

        this.bind();
    }

    bind() {

        this.currentView.addObserver(args => {
            let ov = this.views[args.oldValue];
            if (ov !== undefined && ov != null) $(`#${ ov.name }`).remove();

            let nv = this.views[args.newValue];
            nv.addTo();

            _Session2.default.set('last-page', `${ args.newValue }`);

            if (args.newValue <= 1) $('#go-back').hide();else $('#go-back').show();
        });

        this.currentView.$value = Number(_Session2.default.get('last-page'));

        this.parent.delegate('#play-button', 'click', () => {
            this.currentView.$value += 1;
        });

        let btnDebugToggle = $('#debug-toggle');

        this.bsTestVisible.addObserver(() => {
            if (this.bsTestVisible.$value) btnDebugToggle.text('Hide Test View');else btnDebugToggle.text('Show Test View');
        });

        $('html').keydown(event => {
            if (event.keyCode === 192) {
                this.changeBsTestVMVisibility();
            }
        });

        btnDebugToggle.click(() => this.changeBsTestVMVisibility());

        $('#go-back').click(() => {
            this.currentView.$value -= 1;
        });

        let mute = $('#mute');

        mute.click(() => {

            if (this.playingBGM.$value) {

                _AudioManager2.default.pause('test2');

                mute.find('.fa').removeClass('fa-volume-up');

                mute.find('.fa').addClass('fa-volume-off');

                this.playingBGM.$value = false;
            } else {
                _AudioManager2.default.play('test2');

                mute.find('.fa').removeClass('fa-volume-off');

                mute.find('.fa').addClass('fa-volume-up');

                this.playingBGM.$value = true;
            }
        });

        this.parent.delegate('.bs-lobby-list-item', 'click', e => {
            console.log($(e.target).attr('data-gid'));

            this.currentView.$value += 1;
        });

        let playSound = () => {
            _AudioManager2.default.play('btn1', false, false);
        };

        this.parent.delegate('.bs-button', 'click', playSound);
        this.parent.delegate('.hero-button', 'click', playSound);
    }

    changeBsTestVMVisibility() {
        if (this.bsTestVisible.$value) {
            this.bsTestVM.destroy();
            this.bsTestVisible.$value = false;
        } else {
            this.bsTestVM.addTo('body');
            this.bsTestVisible.$value = true;

            document.querySelector(`#${ this.bsTestVM.name }`).scrollIntoView();
        }
    }

    handleError(reason, error, statusCode) {
        console.error(error);

        let bsod = new _BSODViewModel2.default(this.api, statusCode, reason);
        bsod.addTo('body');

        this.loading = false;
    }
}
exports.default = MainViewModel;

},{"../util/AudioManager":17,"../util/Session":24,"./BSODViewModel":25,"./BSTestViewModel":26,"./LobbyGameViewModel":27,"./LobbyViewModel":28,"./Observable":30,"./PlayerGameboardViewModel":31,"./TitleScreenViewModel":32,"./ViewModel":34}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ViewModel = require("./ViewModel");

var _ViewModel2 = _interopRequireDefault(_ViewModel);

var _BattleshipConst = require("../util/BattleshipConst");

var bs = _interopRequireWildcard(_BattleshipConst);

var _Ship = require("../model/ships/Ship");

var _Ship2 = _interopRequireDefault(_Ship);

var _Observable = require("./Observable");

var _Observable2 = _interopRequireDefault(_Observable);

var _PlayerGameboard = require("../model/board/PlayerGameboard");

var _PlayerGameboard2 = _interopRequireDefault(_PlayerGameboard);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PlayerGameboardViewModel extends _ViewModel2.default {

    constructor(api) {
        super(api, 'vm-playergameboard');

        this.ships = new _Observable2.default();

        this.observe();
    }

    load() {}

    draw() {
        console.log('draw');

        let html = `<div class="bs-fill-page" id=${ this.name }>`;

        html += `<p class="bs-hero-title">
        Battleship
    </p>`;
        html += `<div class='gameboard'>`;
        html += `<table class='player-grid'>`;

        for (let y = bs.CELLMIN; y <= bs.CELLMAX; y++) {
            html += `<tr data-y="${ y }">`;

            for (let x = bs.CELLMIN; x <= bs.CELLMAX; x++) {
                html += `<td data-x=${ x }" data-y="${ y }"></td>`;
            }

            html += `</tr>`;
        }

        html += `</table>`;

        html += `</div>`;

        // Replace by ship assets
        for (let i = 1; i <= this.ships.length; i++) {
            html += `<div class="test-block"></div>`;
        }

        this.parent.append(html + '</div>');
    }

    bind() {
        console.log('bind');

        $('.player-grid td').droppable({
            // accept:
            // function(d) {
            //     console.log(d, this);
            //     return true;
            // },
            drop: function (event, ui) {
                console.log(event.target);
            }
        });
        $('.placeble-ship').draggable({ revert: 'invalid', snap: '.player-grid td', snapMode: 'outer' });
    }

    observe() {
        _Ship2.default.getAll(this.api).then(ships => {
            this.ships.$value = ships;

            // console.log(args.newValue);

            let ship_template = ``;

            // console.log(this.ships.$value[0].name);

            for (let i = 0; i < this.ships.$value.length; i++) {
                ship_template += `<img id="${ this.ships.$value[i].name }" class="placeble-ship" src="img/ships/${ this.ships.$value[i].name }.png"/>`;
                console.log(this.ships.$value[i].name);
            }

            $('.gameboard').append(ship_template);

            // $('#Destroyer').rotateLeft();

            console.log($(ship_template));
            console.log($('.gameboard'));

            this.bind();
        });

        // this.ships.addObserver(args => {
        //     console.log(args.newValue);
        //
        //     let ship_template = '';
        //
        //     for (let i = 1; i < this.ships.length; i++) {
        //         ship_template += '<img id=" + this.ships[i].name + " src="../img/ships/' + this.ships[i].name + '.png"/>';
        //     }
        //
        //     $('.game-board').append(ship_template);
        //
        //     console.log('ships added');
        // });
    }
}
exports.default = PlayerGameboardViewModel; /**
                                             * Created by Sander on 16-06-16.
                                             */

},{"../model/board/PlayerGameboard":7,"../model/ships/Ship":16,"../util/BattleshipConst":19,"./Observable":30,"./ViewModel":34}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ViewModel = require("./ViewModel");

var _ViewModel2 = _interopRequireDefault(_ViewModel);

var _Observable = require("./Observable");

var _Observable2 = _interopRequireDefault(_Observable);

var _User = require("../model/User");

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TitleScreenViewModel extends _ViewModel2.default {
    constructor(api) {
        super(api, 'vm-title');

        // this.bsTestVM = new BSTestViewModel(this.api);
        // this.bsTestVisible = new Observable(false);

        this.user = new _Observable2.default(null);
    }

    load() {
        _User2.default.getCurrent(this.api).then(user => this.user.$value = user).catch(this.onError.bind(this));
    }

    draw() {
        let template = `<main id="${ this.name }" class="bs-fill-page bs-hero">
    <p id="bs-title" class="bs-hero-title">
        Battleship
    </p>
    <div class="bs-hero-token">
        <p class="bs-hero-token-welcome" id="lblWelcomeMsg">Ahoy, Stanger!</p>
        <input class="bs-input" type="text" id="title-input-token" placeholder="your token" value="${ this.api.token }"/>
    </div>
    <button id="play-button" class="hero-button">Play</button>
</main>`;

        this.parent.append(template);

        this.bind();
    }

    bind() {

        let input = $('#title-input-token');
        input.change(() => {

            let val = input.val();

            this.api.isValidToken(val).then(() => this.api.token = val).catch((reason, error, statusCode) => {
                console.error(reason);

                swal({ title: 'Validation Error', text: reason });

                input.val(this.api.token);
            });
        });

        this.api.onTokenChanged(() => this.load());

        this.user.addObserver(({ oldValue, newValue }) => {
            $('#lblWelcomeMsg').text(`Ahoy, Captain ${ newValue.name }!`);
        });
    }
}
exports.default = TitleScreenViewModel;

},{"../model/User":4,"./Observable":30,"./ViewModel":34}],33:[function(require,module,exports){
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

    static getCurrent(api) {

        let s = super.getCurrent(api).catch(console.dir);

        return new Promise(function (resolve, reject) {
            s.then(user => {
                resolve(UserViewModel.fromUser(user));
            }).catch(() => console.log('hallo! (userviewmodel)'));
        }.bind(this));
    }
}
exports.default = UserViewModel;

},{"./../model/User":4,"./../util/Hu":21}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// import BSODViewModel from "./BSODViewModel";

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
        $(`#${ this.name }`).remove();
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

        // let bsod = new BSODViewModel(this.api);
        // bsod.addTo('body');

        this.loading = false;
    }
}
exports.default = ViewModel;

},{}]},{},[1]);
