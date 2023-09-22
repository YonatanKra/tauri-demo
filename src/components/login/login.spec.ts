import { Login } from './login';

describe('login', () => {
    let login: Login;

    beforeAll(() => {
        customElements.define('yag-login', Login);
    });

    beforeEach(() => {
        login = document.createElement('yag-login') as Login;
        document.body.appendChild(login);
    });

    describe('init', () => {
        it('should set the shadow root mode to open', () => {
            expect(login.shadowRoot?.mode).toBe('open');
        });

        it('should set an email field in a form', () => {
            expect(login.shadowRoot?.querySelector('form [name="email"]')).toBeTruthy();
        });

        it('should set a password field in a form', () => {
            expect(login.shadowRoot?.querySelector('form [name="password"]')).toBeTruthy();
        });

        it('should set a submit button in a form', () => {
            expect(login.shadowRoot?.querySelector('form [type="submit"]')).toBeTruthy();
        });
    });

    describe('submit', () => {
        it('should prevent default', () => {
            const event = new Event('submit', { bubbles: true, cancelable: true });
            const form = login.shadowRoot?.querySelector('form');
            form?.dispatchEvent(event);
            expect(event.defaultPrevented).toBe(true);
        });

        it('should prevent propagation to parent element', () => {
            const form = login.shadowRoot?.querySelector('form');
            const spy = vi.fn();
            login.addEventListener('submit', spy);
            form?.dispatchEvent(new MouseEvent('submit', { bubbles: true, cancelable: true, composed: true }));
            expect(spy).not.toHaveBeenCalled();
        });

        it('should emit event "login-attempt" with email and password', () => {
            const email = 'ff@gmail.com';
            const password = '123456';
            const form = login.shadowRoot?.querySelector('form');
            const emailInput = login.shadowRoot?.querySelector('form [name="email"]') as HTMLInputElement;
            const passwordInput = login.shadowRoot?.querySelector('form [name="password"]') as HTMLInputElement;
            emailInput.value = email;
            passwordInput.value = password;
            const spy = vi.fn();
            login.addEventListener('login-attempt', spy);
            form?.requestSubmit();
            expect(spy.mock.calls[0][0].detail).toEqual({email, password});         
        });
    });
});