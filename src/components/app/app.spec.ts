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
    function getElementInView(query: string) {
        return app.shadowRoot?.querySelector(query);
    }
    
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
        expect(getElementInView('yag-greeter')).toBeFalsy();
    });

    it('should display `yag-greeter` when user is logged in', () => {
        isLoggedIn = true;
        app.connectedCallback();        
        expect(getElementInView('yag-greeter')).toBeTruthy();
    });

    it('should display `yag-login` when user is not logged in', () => {
        isLoggedIn = false;
        app.connectedCallback();
        expect(getElementInView('yag-login')).toBeTruthy();
    });

    it('should remove `yag-login` when user is logged in', () => {
        isLoggedIn = true;
        app.connectedCallback();
        expect(getElementInView('yag-login')).toBeFalsy();
    });

    it('should display `yag-login` when user logs out', () => {
        isLoggedIn = true;
        app.connectedCallback();
        isLoggedIn = false;
        authComponent.dispatchEvent(new CustomEvent('user-status-change'));
        expect(getElementInView('yag-login')).toBeTruthy();
    });

    it('should hide yag-login when user logs in', () => {
        isLoggedIn = false;
        app.connectedCallback();
        isLoggedIn = true;
        authComponent.dispatchEvent(new CustomEvent('user-status-change'));
        expect(getElementInView('yag-login')).toBeFalsy();
    });

    it('should display `yag-greeter` when user logs in', () => {
        isLoggedIn = false;
        app.connectedCallback();
        isLoggedIn = true;
        authComponent.dispatchEvent(new CustomEvent('user-status-change'));
        expect(getElementInView('yag-greeter')).toBeTruthy();
    });

    it('should hide `yag-greeter` when user logs out', () => {
        isLoggedIn = true;
        app.connectedCallback();
        isLoggedIn = false;
        authComponent.dispatchEvent(new CustomEvent('user-status-change'));
        expect(getElementInView('yag-greeter')).toBeFalsy();
    });

    it('should remove `user-status-change` listener to the old authComponent', () => {
        const addEventListenerSpy = vi.spyOn(HTMLElement.prototype, 'addEventListener');
        app.connectedCallback();
        const oldAuthComponent = authComponent;  
        const removeEventListenerSpy = vi.spyOn(oldAuthComponent, 'removeEventListener');   
        app.disconnectedCallback();
        app.connectedCallback();
        expect(addEventListenerSpy).toHaveBeenCalledWith('user-status-change', expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith('user-status-change', expect.any(Function));
        expect(removeEventListenerSpy.mock.calls[0][1]).toBe(addEventListenerSpy.mock.calls[0][1]);
        addEventListenerSpy.mockRestore();
    });

});