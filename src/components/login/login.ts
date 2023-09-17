import '@vonage/vivid/layout';
import '@vonage/vivid/button';
import '@vonage/vivid/text-field';

const template = `
<form id="login-form">
    <vwc-layout column-basis="block">
        <vwc-text-field type="email" name="email" label="Email" placeholder="Email" icon="envelope-solid"></vwc-text-field>
        <vwc-text-field type="password" name="password" label="Password" placeholder="Password" icon="key-solid"></vwc-text-field>
        <vwc-button type="submit" label="Login or Signup"></vwc-button>
    </vwc-layout>
</form>
        `;
const templateElement = document.createElement('template');
templateElement.innerHTML = template;

export class Login extends HTMLElement {
    get #form() {
        return this.shadowRoot?.querySelector('#login-form') as HTMLFormElement;
    }

    get #emailInput() {
        return this.shadowRoot?.querySelector('form [name="email"]') as HTMLInputElement;
    }

    get #passwordInput() {
        return this.shadowRoot?.querySelector('form [name="password"]') as HTMLInputElement;
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        const templateHTML = templateElement.content.cloneNode(true);
        this.shadowRoot?.appendChild(templateHTML);

        this.#form.addEventListener('submit', (e) => {
            e.preventDefault();         
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent('login-attempt', { detail: { email: this.#emailInput.value, password: this.#passwordInput.value } }));
        });
    }
}