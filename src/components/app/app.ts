import '@vonage/vivid/header';
import '@vonage/vivid/layout';
import '@vonage/vivid/button';

export class App extends HTMLElement {

    get #mainContent() {
        return this.shadowRoot!.getElementById('main-content') as HTMLElement;
    }

    get #loginButton() {
        return this.shadowRoot!.getElementById('login-button') as HTMLElement;
    }

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
            this.#loginButton.setAttribute('slot', 'hidden');
            this.#mainContent.innerHTML = `<yag-login></yag-login>`;
            this.#setLoginListener();
        } else {
            this.#loginButton.setAttribute('slot', 'action-items');
            this.#unsetLoginListener();
            this.#mainContent.innerHTML = `<yag-greeter></yag-greeter>`;
        }
    }

    #authComponent?: HTMLElement;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot!.innerHTML = `
            <vwc-header>
                <h1>Your Awesome Game!</h1> (yag... dah...)
                <vwc-button id="login-button" slot="hidden" appearance="filled" connotation="alert" label="Sign out"></vwc-button>
                <main slot="app-content">
                    <vwc-layout gutters="small" id="main-content">
                        Loading...
                        <vwc-progress-ring connotation="cta"></vwc-progress-ring>
                    </vwc-layout>
                </main>
            </vwc-header>
        `;
        this.#loginButton.addEventListener('click', () => this.#authComponent?.logout());
    }

    connectedCallback() {
        if (this.#authComponent === undefined) {
            this.#authComponent = document.createElement('yag-auth') as HTMLElement;
            this.#authComponent.addEventListener('user-status-change', this.#setViewAccordingToUserStatus);
        }
    }

    disconnectedCallback() {
        this.#authComponent?.removeEventListener('user-status-change', this.#setViewAccordingToUserStatus);
    }
}