export const template = `
                <form class="row" id="greet-form">
                    <input id="greet-input" placeholder="Enter a name..." />
                    <button type="submit">Greet</button>
                </form>
        
                <p id="greet-msg"></p>
        `;
const templateElement = document.createElement('template');
templateElement.innerHTML = template;

export class Greeter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const templateHTML = templateElement.content.cloneNode(true);
    this.shadowRoot?.appendChild(templateHTML);
  }
}