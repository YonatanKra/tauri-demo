export const template = ``;
const templateElement = document.createElement('template');
templateElement.innerHTML = template;

export class App extends HTMLElement{

    #authComponent?: HTMLElement;

    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        const templateHTML = templateElement.content.cloneNode(true);
        this.shadowRoot?.appendChild(templateHTML);
    }

    connectedCallback(){
        this.#authComponent = document.createElement('yag-auth') as HTMLElement;
        if (this.#authComponent.isLoggedIn?.() === false) {
            this.shadowRoot!.innerHTML = ``;
        } else {
            this.shadowRoot!.innerHTML = `<yag-greeter></yag-greeter>`;
        }
    }
}