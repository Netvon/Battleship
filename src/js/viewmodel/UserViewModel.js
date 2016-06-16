import User from './../model/User';
import Hu from './../util/Hu';

export default class UserViewModel extends User {
    constructor(email, name) {
        super(email, name);
    }

    get html() {
        return `<ul><li>${this.name}</li><li>${this.email}</li></ul>`;
    }

    displayOn(query) {
        Hu.querySet(query, this.html);
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
        return new Promise((resolve, reject) => {
            super.getCurrent(api).then(user => {
                resolve(UserViewModel.fromUser(user));
            }).catch(reject);
        });

    }
}