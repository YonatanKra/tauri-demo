import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export class Auth extends HTMLElement {
    #isLoggedIn = false;

    isLoggedIn() {
        return getAuth().currentUser !== null;
    }

    async login(email: string, password: string) {
        await signInWithEmailAndPassword(getAuth(), email, password);
        if (this.isLoggedIn()) {
            this.dispatchEvent(new CustomEvent('user-status-change'));
        }
    }
    
    constructor() {
        super();
    }
}