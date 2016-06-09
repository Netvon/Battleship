import BattleshipRoute from './BattleshipRoute';
import Persistence from './Persistence';
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
     * @returns {string}
     */
    withApiTokenSuffix(formattedRoute) {
        if (formattedRoute === undefined || formattedRoute === null)
            throw new Error('BattleshipApi needs jQuery to work');

        if (typeof(formattedRoute) !== 'string')
            throw new Error("The 'formattedRoute' parameter on BattleshipApi.withApiTokenSuffix must be a string");

        return `${BattleshipApi.url}${formattedRoute}?${BattleshipApi.tokenPrefix }${this.token}`;
    };

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
    apiGet({route, parameter}, callback) {
        if (route === null || route === undefined)
            throw new Error('The route option on the apiGet function of BattleshipApi cannot be empty');

        route.checkMethod('get');

        let url = this.withApiTokenSuffix(route.format(parameter));

        $.get(url, data => {
            if (data.error)
                throw new Error(data.error.replace('Error: ', ''));

            if (callback !== undefined && callback !== null)
                callback(data);

        }).fail(() => {
            throw new Error(`The Battleship Api failed to process the request to '${url}'`);
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
    apiPost({route, parameter}, object, callback) {
        if (route === null || route === undefined)
            throw new Error('The route option on the apiGet function of BattleshipApi cannot be empty');

        route.checkMethod('post');

        let url = this.withApiTokenSuffix(route.format(parameter));

        $.post(url, object, data => {
            if (data.error)
                throw new Error(data.error.replace('Error: ', ''));

            if (typeof callback === 'function')
                callback(data);

        }).fail(() => {
            throw new Error(`The Battleship Api failed to process the request to '${url}'`);
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
    apiDelete({route, parameter}, callback) {
        if (route === null || route === undefined)
            throw new Error('The route option on the apiDelete function of BattleshipApi cannot be empty');

        route.checkMethod('delete');

        $.ajax({
            url: this.withApiTokenSuffix(route.format(parameter)),
            type: 'DELETE',
            success: data => {
                if (data.error)
                    throw new Error(data.error.replace('Error: ', ''));

                if (typeof callback === 'function')
                    callback(data);
            },
            error: () => {
                throw new Error('The Battleship Api failed to process the request');
            }
        })
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
        if(this.token !== value) {
            this._token = value;

            Persistence.set(bs.PER_TOKENKEY, value);
            Persistence.remove(bs.PER_USERKEY);
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

    /**
     * Listen to a notification on a the Socket.IO room named 'update'
     *
     * @param callback {function}
     */
    onUpdate(callback) {
        this.on('update', callback);
    }

    /**
     * Listen to a notification on a the Socket.IO room named 'shot'
     *
     * @param callback {function}
     */
    onShot(callback) {
        this.on('shot', callback);
    }

    /**
     * Listen to a notification on a the Socket.IO room named 'turn'
     *
     * @param callback {function}
     */
    onTurn(callback) {
        this.on('turn', callback);
    }

}