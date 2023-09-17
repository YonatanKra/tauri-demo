import { App } from './app';

customElements.define('yag-app', App);

class MockAuth extends HTMLElement {
    constructor() {
        super();
        authComponent = this;
    }

    isLoggedIn() {
        return isLoggedIn;
    }
}
customElements.define('yag-auth', MockAuth);
let authComponent: MockAuth | HTMLElement = document.createElement('div');
let isLoggedIn = true;

describe('app', () => {
    let app: App;
    beforeEach(() => {
        app = document.createElement('yag-app') as App;
    });
    
    afterEach(() => {
        app.remove();
    });

    it('should be have an open shadow root', () => {
        expect(app.shadowRoot?.mode).toBe('open');        
    });

    it('should remove `yag-greeter` when user is not logged in', () => {
        isLoggedIn = false;
        app.connectedCallback();
        expect(app.shadowRoot?.querySelector('yag-greeter')).toBeFalsy();
    });

    it('should display `yag-greeter` when user is logged in', () => {
        isLoggedIn = true;
        app.connectedCallback();        
        expect(app.shadowRoot?.querySelector('yag-greeter')).toBeTruthy();
    });
});