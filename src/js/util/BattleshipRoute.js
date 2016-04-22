function BattleshipRoute(urlFormat, canPost, canGet) {
    if (urlFormat === undefined || urlFormat === null)
        throw new Error('Cannot define an empty BattleshipRoute. Please define urlFormat.');
    if (typeof urlFormat !== 'string')
        throw new Error('urlFormat must be of type string.');

    this.urlFormat = urlFormat;

    if (canPost === undefined || canPost === null || typeof canPost !== 'boolean')
        this.canPost = false;
    else
        this.canPost = canPost;

    if (canGet === undefined || canGet === null || typeof canGet !== 'boolean')
        this.canGet = true;
    else
        this.canGet = canGet;
}

BattleshipRoute.prototype = {

    format: function (parameter) {
        var url = this.urlFormat;

        if (parameter !== undefined && ((typeof parameter === 'number') && (parameter % 1 === 0)))
            url = url.replace('{id}', parameter);

        return url;
    }

};

module.exports = BattleshipRoute;