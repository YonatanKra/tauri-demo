export class App extends HTMLElement {

    #handleLoginAttempt = (e: Event) => {
        const { email, password } = (<CustomEvent>e).detail;
        this.#authComponent?.login(email, password);
    }
    #setViewAccordingToUserStatus = () => {
        
        if (!this.#authComponent!.isLoggedIn || this.#authComponent!.isLoggedIn?.() === false) {
            this.shadowRoot!.innerHTML = `<yag-login></yag-login>`;
            const loginElement = this.shadowRoot!.querySelector('yag-login') as HTMLElement;
            loginElement.addEventListener('login-attempt', this.#handleLoginAttempt);
        } else {
            const loginElement = this.shadowRoot!.querySelector('yag-login') as HTMLElement;
            loginElement?.removeEventListener('login-attempt', this.#handleLoginAttempt);
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