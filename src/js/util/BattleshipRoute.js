/**
 *
 * @property urlFormat {string}
 * @property methods {array}
 * @property needsParam {boolean}
 */
export default class BattleshipRoute {
    /**
     * Constructs a new instance of the BattleshipRoute class
     *
     * @param urlFormat {string}
     * @param methods {string}
     * @param needsParam {boolean}
     */
    constructor(urlFormat, methods, needsParam = false) {
        if (urlFormat === undefined || urlFormat === null)
            throw new Error('Cannot define an empty BattleshipRoute. Please define urlFormat.');
        if (typeof urlFormat !== 'string')
            throw new Error('urlFormat must be of type string.');

        this.urlFormat = urlFormat;

        if (typeof methods === 'string')
            this.methods = methods.split('|');

        if (typeof needsParam === 'boolean')
            this.needsParam = needsParam;
    }

    /**
     * Return a formatted string of this route
     *
     * @param parameter {number}
     * @returns {string|*}
     */
    format(parameter) {
        var url = this.urlFormat;

        if ((parameter !== undefined || parameter !== null) && this.needsParam)
            url = url.replace('{id}', `${parameter}`);
        else if ((parameter === undefined || parameter === null) && this.needsParam)
            throw new Error(`Route '${this.urlFormat}' needs a parameter`);

        return url;
    }

    /**
     * Checks if this route can perform a given http method
     *
     * @param method {string}
     * @returns {boolean}
     */
    checkMethod(method) {
        if(this.methods.indexOf(method) === -1)
            throw new Error(`The selected route ('${this.urlFormat}') does not support the '${method}' method`);
    }
}