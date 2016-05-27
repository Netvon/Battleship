export default class User {
    /**
     * Constructs a new instance of the User class
     *
     * @param email {string}
     * @param name {string}
     */
    constructor(email, name) {
        if (email === undefined || email == null)
            throw new Error("You cannot create a User without specifying an email address");
        if (name === undefined || name == null)
            throw new Error("You cannot create a User without specifying a name");

        if(typeof email !== 'string')
            throw new Error("The 'email' parameter on the User class must be a string");

        if(typeof name !== 'string')
            throw new Error("The 'name' parameter on the User class must be a string");

        this.email = email;
        this.name = name;
    }

    /**
     * Returns the current User
     *
     * @param api BattleshipApi
     * @param callback {function}
     */
    static getCurrent(api, callback) {
        if(api === undefined || api === null)
            throw new Error("The 'api' parameter on User.getCurrent cannot be null");

        if(callback === undefined || callback === null || typeof callback !== 'function')
            throw new Error("The 'callback' parameter on User.getCurrent has to be a function");

        api.apiGet({route: api.routes.currentUser}, data => {
            callback(new User(data._id, data.name));
        });
    }
}