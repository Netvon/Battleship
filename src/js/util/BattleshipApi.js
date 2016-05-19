import BattleshipRoute from './BattleshipRoute';

export default class BattleshipApi {
    constructor(token) {
        if (window.jQuery === undefined)
            throw new Error('BattleshipApi needs jQuery to work');

        if (window.io === undefined)
            throw new Error('BattleshipApi need Socket.IO to work');

        this.token = token;

        this.url = 'https://zeeslagavans.herokuapp.com/';
        this.tokenPrefix = 'token=';
        this.routes = {
            currentUserGames: new BattleshipRoute('users/me/games'),
            allGames: new BattleshipRoute('games'),
            createGameWithAi: new BattleshipRoute('games/AI'),
            allShips: new BattleshipRoute('ships'),
            gameById: new BattleshipRoute('games/{id}'),
            gameSetupById: new BattleshipRoute('games/{id}/gameboards'),
            gameShotById: new BattleshipRoute('games/{id}/shots'),
            testRoute: new BattleshipRoute('games/{id}')
        };
    }

    withApiTokenSuffix(formattedRoute) {
        return `${this.url}${formattedRoute}?${this.tokenPrefix }${this.token}`;
    };

    apiGet(options, callback) {
        if (options === null || options === undefined)
            throw new Error('The option on the get function of BattleshipApi cannot be empty');
        else if (options.route === null || options.route === undefined)
            throw new Error('The route option on the get function of BattleshipApi cannot be empty');

        $.getJSON(this.withApiTokenSuffix(options.route.format(options.parameter)), callback);
    }

    apiPost(route, parameter, object, callback) {

    }

    openSocket(callback) {
        var socket = io.connect(this.url, {
            query: this.tokenPrefix + this.token
        });

        socket.on('update', callback);
    }

}