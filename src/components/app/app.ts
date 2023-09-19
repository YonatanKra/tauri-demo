export class App extends HTMLElement {

    #handleLoginAttempt = (e: Event) => {
        const { email, password } = (<CustomEvent>e).detail;
        this.#authComponent?.login(email, password);
    }

    get #loginElement () {
        return this.shadowRoot!.querySelector('yag-login') as HTMLElement;
    }
    #setLoginListener = () => {
        this.#loginElement.addEventListener('login-attempt', this.#handleLoginAttempt);
    }

    #unsetLoginListener = () => {
        this.#loginElement?.removeEventListener('login-attempt', this.#handleLoginAttempt);
    }

    #setViewAccordingToUserStatus = () => {
        if (!this.#authComponent!.isLoggedIn || this.#authComponent!.isLoggedIn?.() === false) {
            this.shadowRoot!.innerHTML = `<yag-login></yag-login>`;
            this.#setLoginListener();
        } else {
            this.#unsetLoginListener();
            this.shadowRoot!.innerHTML = `<yag-greeter></yag-greeter>`;
        }
    }

    #authComponent?: HTMLElement;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        if (this.#authComponent === undefined) {
            this.#authComponent = document.createElement('yag-auth') as HTMLElement;
            this.#authComponent.addEventListener('user-status-change', this.#setViewAccordingToUserStatus);
        }
        this.#setViewAccordingToUserStatus();
    }

    disconnectedCallback() {
        this.#authComponent?.removeEventListener('user-status-change', this.#setViewAccordingToUserStatus);
    }
}