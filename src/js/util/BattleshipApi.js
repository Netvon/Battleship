import BattleshipRoute from './BattleshipRoute';

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

        this.token = token;

        this.url = 'https://zeeslagavans.herokuapp.com/';
        this.tokenPrefix = 'token=';
        this.routes = {
            // (urlFormat, methods, needsParam = false)
            currentUser: new BattleshipRoute('users/me/info', 'get', false),
            currentUserGames: new BattleshipRoute('users/me/games', 'get|delete', false),
            createGame: new BattleshipRoute('games', 'get', false),
            createGameWithAi: new BattleshipRoute('games/AI', 'get', false),
            allShips: new BattleshipRoute('ships', 'get', false),
            gameById: new BattleshipRoute('games/{id}', 'get', true),
            gameSetupById: new BattleshipRoute('games/{id}/gameboards', 'post', true),
            gameShotById: new BattleshipRoute('games/{id}/shots', 'post', true)
        };
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

        return `${this.url}${formattedRoute}?${this.tokenPrefix }${this.token}`;
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

            if (callback !== undefined && callback !== null)
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

                if (callback !== undefined && callback !== null)
                    callback(data);
            },
            error: () => {
                throw new Error('The Battleship Api failed to process the request');
            }
        })
    }

    /**
     * Listen to a notification on a Socket.IO room
     *
     * @param room {string}
     * @param callback {function}
     */
    on(room, callback) {
        var socket = io.connect(this.url, {
            query: this.tokenPrefix + this.token
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