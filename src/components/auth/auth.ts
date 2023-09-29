import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

export class Auth extends HTMLElement {

    isLoggedIn() {
        return getAuth().currentUser !== null;
    }

    async login(email: string, password: string) {
        const auth = getAuth();
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        if (signInMethods.length === 0) {
            await createUserWithEmailAndPassword(auth, email, password);
        } else {
            await signInWithEmailAndPassword(auth, email, password);
        }
        if (this.isLoggedIn()) {
            this.dispatchEvent(new CustomEvent('user-status-change'));
        }
    }
    
    async logout() {
        await signOut(getAuth());
        this.dispatchEvent(new CustomEvent('user-status-change'));
    }

    constructor() {
        super();
    }
}