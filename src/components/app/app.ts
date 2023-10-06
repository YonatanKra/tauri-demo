import '@vonage/vivid/header';
import '@vonage/vivid/layout';
import '@vonage/vivid/button';
import '@vonage/vivid/alert';
import { Auth } from '..';

const template = `
<vwc-header>
    <vwc-alert id="alert" removable connotation="alert" placement="top"></vwc-alert>
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
const templateElement = document.createElement('template');
templateElement.innerHTML = template;

export class App extends HTMLElement {

    get #mainContent() {
        return this.shadowRoot!.getElementById('main-content') as HTMLElement;
    }

    get #loginButton() {
        return this.shadowRoot!.getElementById('login-button') as HTMLElement;
    }

    get #alertComponent() {
        return this.shadowRoot!.getElementById('alert') as HTMLElement;
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

    get #authComponent (): Auth {
        if (this.shadowRoot!.querySelector('#auth') === null) {
            const authComponent = document.createElement('yag-auth') as HTMLElement;
            authComponent.id = 'auth';
            this.shadowRoot!.appendChild(authComponent);
        }
        return this.shadowRoot!.querySelector('#auth') as HTMLElement;
    }

    #setViewAccordingToUserStatus = () => {
        const isLoggedIn = this.#authComponent.isLoggedIn();
        const isUserEmailVerified = this.#authComponent.isUserEmailVerified();

        if (isLoggedIn && isUserEmailVerified === false) {
            this.#authComponent.logout();
            this.alert({message: 'Please verify your email address', title: 'Email not verified'});
            return;
        }

        if (!isLoggedIn) {
            this.#loginButton.setAttribute('slot', 'hidden');
            this.#mainContent.innerHTML = `<yag-login></yag-login>`;
            this.#setLoginListener();
        } else {
            this.#loginButton.setAttribute('slot', 'action-items');
            this.#unsetLoginListener();
            this.#mainContent.innerHTML = `<yag-greeter></yag-greeter>`;
        }
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        const templateHTML = templateElement.content.cloneNode(true);
        this.shadowRoot?.appendChild(templateHTML);

        this.#loginButton.addEventListener('click', () => this.#authComponent?.logout());
    }

    connectedCallback() {
        this.#authComponent.addEventListener('user-status-change', this.#setViewAccordingToUserStatus);
    }

    disconnectedCallback() {
        this.#authComponent?.removeEventListener('user-status-change', this.#setViewAccordingToUserStatus);
    }

    alert({message, title = 'Alert'} : {message: string, title?: string}) {
        this.#alertComponent.setAttribute('headline', title!);
        this.#alertComponent.setAttribute('text', message);
        this.#alertComponent.toggleAttribute('open', true);
    }
}