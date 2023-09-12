import { invoke } from "@tauri-apps/api";

export const template = `
                <style>
                input,
                button {
                  border-radius: 8px;
                  border: 1px solid transparent;
                  padding: 0.6em 1.2em;
                  font-size: 1em;
                  font-weight: 500;
                  font-family: inherit;
                  color: #0f0f0f;
                  background-color: #ffffff;
                  transition: border-color 0.25s;
                  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
                }

                button {
                  cursor: pointer;
                }

                button:hover {
                  border-color: #396cd8;
                }
                button:active {
                  border-color: #396cd8;
                  background-color: #e8e8e8;
                }

                input,
                button {
                  outline: none;
                }

                #greet-input {
                  margin-right: 5px;
                }

                @media (prefers-color-scheme: dark) {
                  :root {
                    color: #f6f6f6;
                    background-color: #2f2f2f;
                  }

                  a:hover {
                    color: #24c8db;
                  }

                  input,
                  button {
                    color: #ffffff;
                    background-color: #0f0f0f98;
                  }
                  button:active {
                    background-color: #0f0f0f69;
                  }
                }
                </style>
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