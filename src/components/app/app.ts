export class App extends HTMLElement{

    #setViewAccordingToUserStatus = () => {
        if (this.#authComponent!.isLoggedIn?.() === false) {
            this.shadowRoot!.innerHTML = `<yag-login></yag-login>`;
        } else {
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
}