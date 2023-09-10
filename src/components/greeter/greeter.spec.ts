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
});