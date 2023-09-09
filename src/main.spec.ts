import './main';
import { mockIPC } from "@tauri-apps/api/mocks";

describe('main', () => {
  function setupDomElements() {
    document.body.innerHTML = `
      <form id="greet-form">
        <input id="greet-input" />
      </form>
      <div id="greet-msg"></div>
    `;
  }
  it('should set the greeting message inside the message element', async () => {
    setupDomElements();
    window.dispatchEvent(new Event("DOMContentLoaded"));

    const name = 'John Doe';
    const { greetForm, greetMsgEl } = getElementsAndSetInputValue(name);

    mockIPC((cmd, args) => {
      if(cmd === "greet") {
          return `Hello, ${args.name}! You've been greeted from Rust!`;
      }
    });

    await dispatchFormSubmit(greetForm);
    
    expect(greetMsgEl?.textContent).toBe(`Hello, ${name}! You've been greeted from Rust!`);
  });
});

async function dispatchFormSubmit(greetForm: HTMLFormElement) {
  greetForm.dispatchEvent(new Event("submit"));
  await new Promise((resolve) => setTimeout(resolve, 0));
}

function getElementsAndSetInputValue(name: string) {
  const greetInputEl = document.querySelector("#greet-input") as HTMLInputElement;
  const greetMsgEl = document.querySelector("#greet-msg");
  const greetForm = document.querySelector("#greet-form") as HTMLFormElement;
  greetInputEl.value = name;
  return { greetForm, greetMsgEl };
}
