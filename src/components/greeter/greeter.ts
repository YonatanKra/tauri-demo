import { invoke } from "@tauri-apps/api";

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
  #submitNameAndOutputRecievedGreet = async () => {
      const greetInputEl = this.shadowRoot?.querySelector('#greet-input') as HTMLInputElement;
      const greetMsgEl = this.shadowRoot?.querySelector('#greet-msg') as HTMLElement;
      greetMsgEl.textContent = await invoke('greet', {
          name: greetInputEl.value,
      });
  };

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const templateHTML = templateElement.content.cloneNode(true);
    this.shadowRoot?.appendChild(templateHTML);
    this.shadowRoot?.querySelector('#greet-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.#submitNameAndOutputRecievedGreet();
    });
  }
}