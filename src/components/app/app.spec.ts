import { App } from './app';

customElements.define('yag-app', App);

class MockAuth extends HTMLElement {
    constructor() {
        super();
        authComponent = this;
    }

    isLoggedIn() {}

    login(_email: string, _password: string) {}

    logout = vi.fn();

    isUserEmailVerified = vi.fn();
}

customElements.define('yag-auth', MockAuth);
let authComponent: MockAuth | HTMLElement = document.createElement('div');

function setLoginStatus(isLoggedIn: boolean) {
    authComponent.isLoggedIn = vi.fn().mockReturnValue(isLoggedIn);
    authComponent.dispatchEvent(new CustomEvent('user-status-change'));
}

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
        app.connectedCallback();
        setLoginStatus(false);
        expect(getElementInView('yag-greeter')).toBeFalsy();
    });

    it('should display `yag-greeter` when user is logged in', () => {
        app.connectedCallback();        
        setLoginStatus(true);
        expect(getElementInView('yag-greeter')).toBeTruthy();
    });

    it('should display `yag-login` when user is not logged in', () => {
        app.connectedCallback();
        setLoginStatus(false);
        expect(getElementInView('yag-login')).toBeTruthy();
    });

    it('should remove `yag-login` when user is logged in', () => {
        app.connectedCallback();
        setLoginStatus(true);
        expect(getElementInView('yag-login')).toBeFalsy();
    });

    it('should display `yag-login` when user logs out', () => {
        app.connectedCallback();
        setLoginStatus(true);
        setLoginStatus(false);
        authComponent.dispatchEvent(new CustomEvent('user-status-change'));
        expect(getElementInView('yag-login')).toBeTruthy();
    });

    it('should hide yag-login when user logs in', () => {
        
        app.connectedCallback();
        setLoginStatus(false);
        setLoginStatus(true);
        authComponent.dispatchEvent(new CustomEvent('user-status-change'));
        expect(getElementInView('yag-login')).toBeFalsy();
    });

    it('should display `yag-greeter` when user logs in', () => {
        app.connectedCallback();
        setLoginStatus(false);
        setLoginStatus(true);
        authComponent.dispatchEvent(new CustomEvent('user-status-change'));
        expect(getElementInView('yag-greeter')).toBeTruthy();
    });

    it('should hide `yag-greeter` when user logs out', () => {
        app.connectedCallback();
        setLoginStatus(true);
        setLoginStatus(false);
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

    it('should display "Loading..." if auth component is not initialized', () => {
        app.connectedCallback();
        expect(getElementInView('#main-content')?.textContent?.trim()).toBe('Loading...');
    });

    it('should evoke the login function from Auth on `login-attempt` event', () => {
        
        app.connectedCallback();
        setLoginStatus(false);
        const email = 'ff@gmail.com';
        const password = '123456';
        const loginComponent = app.shadowRoot?.querySelector('yag-login');
        const spy = vi.spyOn(authComponent, 'login');
        loginComponent!.dispatchEvent(new CustomEvent('login-attempt', {detail: {email, password}}));
        expect(spy).toHaveBeenCalledWith(email, password);
    });

    it('should remove `login-attempt` listener to the old loginComponent', () => {
        app.connectedCallback();
        setLoginStatus(false);
        const oldLoginComponent = app.shadowRoot?.querySelector('yag-login') as HTMLElement;  
        const removeEventListenerSpy = vi.spyOn(oldLoginComponent, 'removeEventListener'); 
        setLoginStatus(true);
        authComponent.dispatchEvent(new CustomEvent('user-status-change'));
        expect(removeEventListenerSpy).toHaveBeenCalledWith('login-attempt', expect.any(Function));
        removeEventListenerSpy.mockRestore();
    });

    it('should logout user if logged in and email not verified', () => {
        app.connectedCallback();
        authComponent.isUserEmailVerified.mockReturnValue(false);
        const spy = vi.spyOn(authComponent, 'logout');
        setLoginStatus(true);
        expect(spy).toHaveBeenCalled();
    });

    it('should display an alert if user is logged in and email not verified', () => {
        app.connectedCallback();
        authComponent.isUserEmailVerified.mockReturnValue(false);
        const spy = vi.spyOn(app, 'alert');
        setLoginStatus(true);
        expect(spy).toHaveBeenCalledWith({message: 'Please verify your email address', title: 'Email not verified'});
    });

    describe('login button', () => {
        function getLogoutButton() {
            return app.shadowRoot?.querySelector('#login-button');
        }

        function isLoginButtonHidden() {
            const logoutButton = getLogoutButton();
            return logoutButton?.getAttribute('slot') === 'hidden';
        }

        function isLoginButtonVisible() {
            const logoutButton = getLogoutButton();
            return logoutButton?.getAttribute('slot') === 'action-items';
        }

        it('should show a logout button to the header when user is logged in', () => {
            app.connectedCallback();
            setLoginStatus(true);
            expect(isLoginButtonVisible()).toBe(true);
        });
        
        it('should hide the logout button from the header when user is logged out', () => {
            
            app.connectedCallback();
            setLoginStatus(true);
            setLoginStatus(false);

            expect(isLoginButtonHidden()).toBe(true);
        });    

        it('should add a logout button to the header when user logs in', () => {
            
            app.connectedCallback();
            setLoginStatus(false);
            setLoginStatus(true);
            
            expect(isLoginButtonVisible()).toBe(true);
        });

        it('should remove the logout button from the header when user logs out', () => {
            
            app.connectedCallback();
            setLoginStatus(true);
            setLoginStatus(false);
            
            expect(isLoginButtonHidden()).toBe(true);
        });

        it('should call `logout` on auth component when logout button is clicked', () => {
            
            app.connectedCallback();
            setLoginStatus(true);
            getLogoutButton()?.dispatchEvent(new CustomEvent('click'));
            expect(authComponent.logout).toHaveBeenCalled();
        });
    });
    
    describe('alert', () => {
        it('should display an alert with given message and title', () => {
            app.connectedCallback();
            const message = 'some message';
            const title = 'some title';
            app.alert({message, title});
            const alert = app.shadowRoot?.querySelector('#alert');
            expect(alert?.getAttribute('Headline')).toBe(title);
            expect(alert?.getAttribute('text')).toBe(message);
        });

        it('should display an alert with given message and default title', () => {
            app.connectedCallback();
            const message = 'some message';
            app.alert({message});
            const alert = app.shadowRoot?.querySelector('#alert');
            expect(alert?.getAttribute('Headline')).toBe('Alert');
            expect(alert?.getAttribute('text')).toBe(message);
        });

        it('should open the alert', () => {
            app.connectedCallback();
            const message = 'some message';
            app.alert({message});
            const alert = app.shadowRoot?.querySelector('#alert');
            expect(alert?.hasAttribute('open')).toBe(true);
        });
    });
});