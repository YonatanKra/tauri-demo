export const template = `
                <yag-greeter></yag-greeter>
        `;
const templateElement = document.createElement('template');
templateElement.innerHTML = template;

export class App extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        const templateHTML = templateElement.content.cloneNode(true);
        this.shadowRoot?.appendChild(templateHTML);
    }
}