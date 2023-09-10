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
});