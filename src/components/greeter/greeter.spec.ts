import { mockIPC } from '@tauri-apps/api/mocks';
import { Greeter } from './index';

describe('greeter', () => {
    it('should be defined', () => {
        expect(Greeter).toBeDefined();
    });

    it ('should set a shadow DOM with mode open', () => {
        customElements.define('yag-greeter', Greeter);
        const greeter = document.createElement('yag-greeter');
        expect(greeter.shadowRoot).toBeDefined();
        expect(greeter.shadowRoot?.mode).toBe('open');
    });


    it ('should have a shadow root with mode open', () => {
        const greeter = document.createElement('yag-greeter');
        expect(greeter.shadowRoot?.mode).toBe('open');
    });

    it ('should have greet button inside', () => {
        const greeter = document.createElement('yag-greeter');
        expect(greeter.shadowRoot?.querySelector('#greet-form button')).toBeTruthy();
    });


    it ('should have greet form inside', () => {
        const greeter = document.createElement('yag-greeter');
        expect(greeter.shadowRoot?.querySelector('#greet-form')).toBeTruthy();
    });

    it ('should have greet input inside', () => {
        const greeter = document.createElement('yag-greeter');
        const greetInput = greeter.shadowRoot?.querySelector('#greet-input');
        expect(greetInput).toBeTruthy();
        expect(greetInput?.form).toEqual(greeter.shadowRoot?.querySelector('#greet-form'));
    });


    it('should set the greeting message inside the message element', async () => {
        const greeter = document.createElement('yag-greeter');
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
    
        greetForm.dispatchEvent(new Event("submit"));
        await new Promise((resolve) => setTimeout(resolve, 0));
        
        expect(greetMsgEl?.textContent).toBe(`Hello, ${name}! You've been greeted from Rust!`);
    });
});