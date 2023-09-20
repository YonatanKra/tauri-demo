import { Auth } from './auth';

describe('login', () => {
    let auth: Auth;

    beforeAll(() => {
        customElements.define('yag-auth', Auth);
    });

    beforeEach(() => {
        auth = document.createElement('yag-auth') as Auth;
    });

    describe('init', () => {
        it('should exist', () => {
           expect(auth).toBeTruthy();
           expect(auth.isLoggedIn()).toBe(false);
        });
    });

    describe('login', () => {
        it('should toggle `isLoggedIn`', () => {
            auth.login();
            expect(auth.isLoggedIn()).toBe(true);
        });

        it('shuold emit `user-status-change` event', () => {
            const spy = vi.fn();
            auth.addEventListener('user-status-change', spy);
            auth.login();
            expect(spy).toHaveBeenCalled();
        });
    });
});