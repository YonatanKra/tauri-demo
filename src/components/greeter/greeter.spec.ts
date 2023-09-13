import { mockIPC } from '@tauri-apps/api/mocks';
import { Greeter } from './index';

describe('greeter', () => {
    let greeter: Greeter;

    beforeAll(() => {
        customElements.define('yag-greeter', Greeter);        
    });

    beforeEach(() => {
        greeter = document.createElement('yag-greeter');
        document.body.appendChild(greeter);
    });

    afterEach(() => {
        greeter.remove();
    });
    
    it('should be defined', () => {
        expect(Greeter).toBeDefined();
    });

    it ('should set a shadow DOM with mode open', () => {
        expect(greeter.shadowRoot).toBeDefined();
        expect(greeter.shadowRoot?.mode).toBe('open');
    });


    it ('should have a shadow root with mode open', () => {
        expect(greeter.shadowRoot?.mode).toBe('open');
    });

    it ('should have greet button inside', () => { 
        expect(greeter.shadowRoot?.querySelector('#greet-form [type="submit"]')).toBeTruthy();
    });


    it ('should have greet form inside', () => {
        const greeter = document.createElement('yag-greeter');
        expect(greeter.shadowRoot?.querySelector('#greet-form')).toBeTruthy();
    });

    it ('should have greet input inside the form', () => {
        const greetInput = greeter.shadowRoot?.querySelector('#greet-input');
        expect(greetInput).toBeTruthy();
        expect(greetInput?.form).toEqual(greeter.shadowRoot?.querySelector('#greet-form'));
    });


    it('should set the greeting message inside the message element', async () => {
        const name = 'John Doe';
        const greetForm = greeter.shadowRoot?.querySelector('#greet-form') as HTMLFormElement;
        const greetInput = greeter.shadowRoot?.querySelector('#greet-input') as HTMLInputElement;
        const greetMsgEl = greeter.shadowRoot?.querySelector('#greet-msg') as HTMLElement;

        greetInput.value = name;
    
        mockIPC((cmd, args) => {
          if(cmd === "greet") {
              return `Hello, ${args.name}! You've been greeted from Rust!`;
          }
        });
    
        await dispatchFormSubmit(greetForm);
        
        expect(greetMsgEl?.textContent).toBe(`Hello, ${name}! You've been greeted from Rust!`);
    });
});

const dispatchFormSubmit = async (greetForm: HTMLFormElement) => {
    greetForm.dispatchEvent(new Event("submit"));
    await new Promise((resolve) => setTimeout(resolve, 0));
}