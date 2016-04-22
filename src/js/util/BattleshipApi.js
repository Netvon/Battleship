const BattleshipRoute = require('./BattleshipRoute.js');

function BattleshipApi() {
    if(window.jQuery === undefined)
        throw new Error('BattleshipApi needs jQuery to work');

    if(window.io === undefined)
        throw new Error('BattleshipApi need Socket.IO to work');
}

BattleshipApi.prototype = {
    url: 'https://zeeslagavans.herokuapp.com/',
    tokenPrefix: 'token=',
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InRtZS52YW5uaW13ZWdlbkBzdHVkZW50LmF2YW5zLm5sIg.4yuhuKWBCnQuoxAeVL2xQ3Ua41YPLRqT7F8FkhxUcKI',
    routes: {
        currentUserGames: new BattleshipRoute('users/me/games'),
        allGames: new BattleshipRoute('games'),
        createGameWithAi: new BattleshipRoute('games/AI'),
        allShips: new BattleshipRoute('ships'),
        gameById: new BattleshipRoute('games/{id}'),
        gameSetupById: new BattleshipRoute('games/{id}/gameboards'),
        gameShotById: new BattleshipRoute('games/{id}/shots'),
        testRoute: new BattleshipRoute('games/{id}')
    },

    withApiTokenSuffix: function (formattedRoute) {
        return this.url + formattedRoute + '?' + this.tokenPrefix + this.token;
    },

    get: function (options, callback) {

        if(options === null || options === undefined)
            throw new Error('The option on the get function of BattleshipApi cannot be empty');
        else if(options.route === null || options.route === undefined)
            throw new Error('The route option on the get function of BattleshipApi cannot be empty');

        $.getJSON(this.withApiTokenSuffix(options.route.format(options.parameter)), callback);
    },

    post: function (route, parameter, object, callback) {

    },

    openSocket: function (callback) {
        var socket = io.connect(this.url, {
            query: this.tokenPrefix + this.token
        });

        socket.on('update', callback);
    }
};

module.exports = BattleshipApi;
