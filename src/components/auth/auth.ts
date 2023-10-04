import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendEmailVerification } from "firebase/auth";

export class Auth extends HTMLElement {

    isLoggedIn() {
        return getAuth().currentUser !== null;
    }

    async #isUserRegistered(email: string) {
        const signInMethods = await fetchSignInMethodsForEmail(getAuth(), email);
        return signInMethods.length > 0;
    }

    async #registerUser(email: string, password: string) {
        await createUserWithEmailAndPassword(getAuth(), email, password);
        await sendEmailVerification(getAuth().currentUser!);
    }

    async login(email: string, password: string) {        
        if (await this.#isUserRegistered(email) === false) {
            await this.#registerUser(email, password);
        } else {
            await signInWithEmailAndPassword(getAuth(), email, password);
        }
    }
    
    async logout() {
        await signOut(getAuth());
    }

    #handleAuthChange = () => {
        this.dispatchEvent(new CustomEvent('user-status-change'));
    }
    constructor() {
        super();
        onAuthStateChanged(getAuth(), this.#handleAuthChange);
    }
}