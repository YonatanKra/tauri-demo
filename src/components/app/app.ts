export class App extends HTMLElement{

    #authComponent?: HTMLElement;

    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback(){
        this.#authComponent = document.createElement('yag-auth') as HTMLElement;
        if (this.#authComponent.isLoggedIn?.() === false) {
            this.shadowRoot!.innerHTML = `<yag-login></yag-login>`;
        } else {
            this.shadowRoot!.innerHTML = `<yag-greeter></yag-greeter>`;
        }
    }
}