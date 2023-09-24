import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, getAuth, signInWithEmailAndPassword } from "firebase/auth";

export class Auth extends HTMLElement {

    isLoggedIn() {
        return getAuth().currentUser !== null;
    }

    async login(email: string, password: string) {
        const signInMethods = await fetchSignInMethodsForEmail(getAuth(), email);
        if (signInMethods.length === 0) {
            await createUserWithEmailAndPassword(getAuth(), email, password);
        } else {
            await signInWithEmailAndPassword(getAuth(), email, password);
        }
        if (this.isLoggedIn()) {
            this.dispatchEvent(new CustomEvent('user-status-change'));
        }
    }
    
    constructor() {
        super();
    }
}