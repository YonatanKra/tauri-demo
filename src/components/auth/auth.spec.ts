import { Auth } from './auth';

const COMPONENT_NAME = 'yag-test';
vi.mock('firebase/auth', () => {
    return {
        getAuth: vi.fn().mockReturnValue({
            currentUser: null
        }),
        signInWithEmailAndPassword: vi.fn()
    }
});

describe('auth', () => {
    
    let auth: Auth;

    beforeAll(() => {
        customElements.define(COMPONENT_NAME, Auth);
    });

    beforeEach(() => {
        auth = document.createElement(COMPONENT_NAME) as Auth;
    });

    describe('init', () => {
        it('should exist', () => {
            expect(auth).toBeTruthy();
            expect(auth.isLoggedIn()).toBe(false);
        });
    });

    describe('login', () => {

        it('should toggle `isLoggedIn` if login successful', async () => {
            const firebaseAuth = await import('firebase/auth');
            
            (firebaseAuth.signInWithEmailAndPassword as any).mockImplementation(async () => {
                const user = {
                    uid: '123',
                    email: 'test@test.com'
                };

                (firebaseAuth.getAuth as any).mockReturnValue({
                    currentUser: user
                });
                return {
                    user
                }
            });

            await auth.login();
            expect(auth.isLoggedIn()).toBe(true);
        });

        it('should call `signInWithEmailAndPassword` with auth, email and password', async () => {
            const email = 't@t.com';
            const password = '123456';
            const firebaseAuth = await import('firebase/auth');
            await auth.login(email, password);
            expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(firebaseAuth.getAuth(), email, password);
        });

        it('should emit `user-status-change` event when login successful', async () => {
            const firebaseAuth = await import('firebase/auth');
            (firebaseAuth.signInWithEmailAndPassword as any).mockImplementation(async () => {
                (firebaseAuth.getAuth as any).mockReturnValue({
                    currentUser: {
                        uid: '123',
                        email: 'test@test.com'
                    }
                });
            });
            const spy = vi.fn();
            auth.addEventListener('user-status-change', spy);

            await auth.login('email', 'password');
            const eventCallsWithSuccessfulLogin = spy.mock.calls.length;

            expect(eventCallsWithSuccessfulLogin).toBe(1);
        });

        it('should prevent emit of event `user-status-change` when login unsuccessful', async () => {
            const firebaseAuth = await import('firebase/auth');
            (firebaseAuth.signInWithEmailAndPassword as any).mockImplementation(async () => {
                (firebaseAuth.getAuth as any).mockReturnValue({
                    currentUser: null
                });
            });
            const spy = vi.fn();
            auth.addEventListener('user-status-change', spy);

            await auth.login('email', 'password');
            const eventCallsWithUnsuccessfulLogin = spy.mock.calls.length;

            expect(eventCallsWithUnsuccessfulLogin).toBe(0);
        });

    });
});
