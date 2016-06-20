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

        return new Promise(function(resolve, reject) {
            if (route === null || route === undefined) {
                let msg = 'The route option on the apiGet function of BattleshipApi cannot be empty';
                reject(msg);
            }

            if (!route.checkMethod('get'))
                reject(`The selected route ('${route.urlFormat}') does not support the 'get' method`);

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
                reject(`HTTP Status: ${jqXHR.status}`);
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
    apiPost({route, parameter}, object) {

        return new Promise((resolve, reject) => {
            if (route === null || route === undefined) {
                let msg = 'The route option on the apiGet function of BattleshipApi cannot be empty';
                reject(msg);
            }

            if (!route.checkMethod('post'))
                reject(`The selected route ('${route.urlFormat}') does not support the 'post' method`);

            let url = this.withApiTokenSuffix(route.format(parameter));

            $.post(url, object)
            .done(data => {
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

    isValidToken(token) {

        if(typeof token !== 'string')
            return Promise.reject('Token must be a string');

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

            this._socket = io.connect(BattleshipApi.url, {
                query: BattleshipApi.tokenPrefix + this._token
            });

            let old = this._socketIoCallbacks.slice(0);
            this._socketIoCallbacks = [];

            old.forEach(obj => {
                this.on(obj.room, obj.callback);
            });

            this._onTokenChangedCallbacks.forEach(cb => cb({oldToken: oldToken, newToken: this._token}));
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
            callback(UpdateEventArguments.fromJson(data));
        });
    }

    /**
     * Listen to a notification on a the Socket.IO room named 'shot'
     *
     * @param callback {function}
     */
    onShot(callback) {
        this.on('shot', data => {
            callback(ShotEventArguments.fromJson(data));
        });
    }

    /**
     * Listen to a notification on a the Socket.IO room named 'turn'
     *
     * @param callback {function}
     */
    onTurn(callback) {
        this.on('turn', data => {
            callback(TurnEventArguments.fromJson(data));
        });
    }

}