import BattleshipRoute from './BattleshipRoute';
import Persistence from './Persistence';
import ShotEventArguments from '../model/events/ShotEventArguments';
import UpdateEventArguments from '../model/events/UpdateEventArguments';
import TurnEventArguments from '../model/events/TurnEventArguments';
import * as bs from './BattleshipConst';

export default class BattleshipApi {
    /**
     * Constructs a new instance of the BattleShipApi class
     * @param token {string}
     */
    constructor(token) {
        if (window.jQuery === undefined)
            throw new Error('BattleshipApi needs jQuery to work');

        if (window.io === undefined)
            throw new Error('BattleshipApi need Socket.IO to work');

        this._token = token;

        this._onTokenChangedCallbacks = new Map();
        this._initSocketIO();
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
            currentUser: new BattleshipRoute('users/me/info', 'get', false),
            currentUserGames: new BattleshipRoute('users/me/games', 'get|delete', false),
            createGame: new BattleshipRoute('games', 'get', false),
            createGameWithAi: new BattleshipRoute('games/AI', 'get', false),
            allShips: new BattleshipRoute('ships', 'get', false),
            gameById: new BattleshipRoute('games/{id}', 'get', true),
            gameSetupById: new BattleshipRoute('games/{id}/gameboards', 'post', true),
            gameShotById: new BattleshipRoute('games/{id}/shots', 'post', true)
        }
    }

    /**
     * Returns a formatted version of a route URI with the API base url and API token
     *
     * @param formattedRoute {string}
     * @param token
     * @returns {string}
     */
    withApiTokenSuffix(formattedRoute, token = this.token) {
        if (formattedRoute === undefined || formattedRoute === null)
            throw new Error('BattleshipApi needs jQuery to work');

        if (typeof(formattedRoute) !== 'string')
            throw new Error("The 'formattedRoute' parameter on BattleshipApi.withApiTokenSuffix must be a string");

        return `${BattleshipApi.url}${formattedRoute}?${BattleshipApi.tokenPrefix }${token}`;
    };

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
    apiGet({route, parameter}) {

        return new Promise(function (resolve, reject) {
            if (route === null || route === undefined) {
                let msg = 'The route option on the apiGet function of BattleshipApi cannot be empty';
                reject(msg);
            }

            if (!route.checkMethod('get'))
                reject(`The selected route ('${route.urlFormat}') does not support the 'get' method`);

            let url = this.withApiTokenSuffix(route.format(parameter));

            // console.log(url);

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
                reject(`HTTP Status: ${jqXHR.status}`);
            });

            // console.log('after ajax');
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
    apiPost({route, parameter}, object) {

        return new Promise((resolve, reject) => {
            if (route === null || route === undefined) {
                let msg = 'The route option on the apiGet function of BattleshipApi cannot be empty';
                reject(msg);
            }

            if (!route.checkMethod('post'))
                reject(`The selected route ('${route.urlFormat}') does not support the 'post' method`);

            let url = this.withApiTokenSuffix(route.format(parameter));

            $.post(url, object).done(data => {
                if (data.error) {
                    let _msg = data.error.replace('Error: ', '');
                    reject(_msg);
                }

                resolve(data);
            }).fail(jqXHR => {
                reject(`HTTP Status: ${jqXHR.status}`);
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
    apiDelete({route, parameter}) {

        return new Promise((resolve, reject) => {
            if (route === null || route === undefined) {
                let msg = 'The route option on the apiDelete function of BattleshipApi cannot be empty';
                reject(msg);
            }

            if (!route.checkMethod('delete'))
                reject(`The selected route ('${route.urlFormat}') does not support the 'delete' method`);

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
                reject(`HTTP Status: ${jqXHR.status}`);
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

            Persistence.set(bs.PER_TOKENKEY, value);
            Persistence.remove(bs.PER_USERKEY);
            Persistence.remove('submitted-gb');

            let old = new Map(this._socketIoCallbacks);

            old.forEach((obj, key) => {
                this.removeOn(key, obj.room);
            });

            this._initSocketIO();

            old.forEach((obj, key) => {
                this.on(key, obj.room, obj.callback);
            });

            this._onTokenChangedCallbacks.forEach(cb => {
                // console.log(cb);
                cb({oldToken: oldToken, newToken: this._token})
            });
        }
    }

    /**
     *
     * @param id {string}
     * @param callback {function}
     */
    onTokenChanged(id, callback) {
        this._onTokenChangedCallbacks.set(id, callback);
    }

    /**
     *
     * @param id {string}
     */
    removeOnTokenChanged(id) {
        this._onTokenChangedCallbacks.delete(id);
    }

    _initSocketIO() {

        // console.log('socket init called');

        this._socketIoCallbacks = new Map();

        this._socket = io.connect(BattleshipApi.url, {
            query: BattleshipApi.tokenPrefix + this._token
        });

        let createCallback = room => {
            return data => {

                let args;

                switch (room) {
                    case 'update':
                        args = UpdateEventArguments.fromJson(data);
                        break;
                    case 'turn':
                        args = TurnEventArguments.fromJson(data);
                        break;
                    case 'shot':
                        args = ShotEventArguments.fromJson(data);
                        break;
                }

                this._socketIoCallbacks.forEach(val => {
                    if (val.room === room)
                        val.callback(args);
                });
            }
        };

        this._socket.on('update', createCallback('update'));
        this._socket.on('turn', createCallback('turn'));
        this._socket.on('shot', createCallback('shot'));
    }

    /**
     * Listen to a notification on a Socket.IO room
     *
     * @param id {string}
     * @param room {string}
     * @param callback {function}
     */
    on(id, room, callback) {
        this._socketIoCallbacks.set(`${id}-${room}`, {
            room: room,
            callback: callback
        });
    }

    /**
     * Removes a listener from a Socket.IO room
     *
     * @param id {string}
     * @param room {string}
     */
    removeOn(id, room) {
        let cb = this._socketIoCallbacks.get(`${id}-${room}`);

        if (cb === null || cb === undefined)
            return;

        this._socketIoCallbacks.delete(`${id}-${room}`);
    }

    /**
     * Listen to a notification on a the Socket.IO room named 'update'
     *
     * @param id {string}
     * @param callback {function}
     */
    onUpdate(id, callback) {
        this.on(id, 'update', callback);
    }

    /**
     * Listen to a notification on a the Socket.IO room named 'shot'
     *
     * @param id {string}
     * @param callback {function}
     */
    onShot(id, callback) {
        this.on(id, 'shot', callback);
    }

    /**
     * Listen to a notification on a the Socket.IO room named 'turn'
     *
     * @param id
     * @param callback {function}
     */
    onTurn(id, callback) {
        this.on(id, 'turn', callback);
    }

}