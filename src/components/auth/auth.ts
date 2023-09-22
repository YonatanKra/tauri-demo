
export class Auth extends HTMLElement {
    #isLoggedIn = false;
    isLoggedIn() {
        return this.#isLoggedIn;
    }

    login() {
        this.#isLoggedIn = true;
        this.dispatchEvent(new CustomEvent('user-status-change'));
    }
    
    constructor() {
        super();
    }
}