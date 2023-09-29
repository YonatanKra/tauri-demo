import { Auth } from './auth';

const COMPONENT_NAME = 'yag-test';
vi.mock('firebase/auth', () => {
    return {
        getAuth: vi.fn().mockReturnValue({
            currentUser: null
        }),
        signInWithEmailAndPassword: vi.fn(),
        fetchSignInMethodsForEmail: vi.fn(),
        createUserWithEmailAndPassword: vi.fn(),
        signOut: vi.fn()
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

        let firebaseAuth: any;

        beforeEach(async () => {
            firebaseAuth = await import('firebase/auth');
        });

        it('should toggle `isLoggedIn` if login successful', async () => {
            setUserSignInMethods(firebaseAuth, ['password']);
            setLogin(firebaseAuth, SUCCESSFUL);

            await auth.login('email', 'password');
            expect(auth.isLoggedIn()).toBe(true);
        });

        it('should call `signInWithEmailAndPassword` with auth, email and password', async () => {
            setUserSignInMethods(firebaseAuth, ['password']);
            const email = 't@t.com';
            const password = '123456';
            await auth.login(email, password);
            expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(firebaseAuth.getAuth(), email, password);
        });

        it('should emit `user-status-change` event when login successful', async () => {
            setUserSignInMethods(firebaseAuth, ['password']);
            setLogin(firebaseAuth, SUCCESSFUL);
            const spy = spyOnUserStatusChangeEvent(auth);

            await auth.login('email', 'password');
            const eventCallsWithSuccessfulLogin = spy.mock.calls.length;

            expect(eventCallsWithSuccessfulLogin).toBe(1);
        });
        
        it('should prevent emit of event `user-status-change` when login unsuccessful', async () => {
            setUserSignInMethods(firebaseAuth, ['password']);
            setLogin(firebaseAuth, UNSUCCESSFUL);
            const spy = spyOnUserStatusChangeEvent(auth);

            await auth.login('email', 'password');
            const eventCallsWithUnsuccessfulLogin = spy.mock.calls.length;

            expect(eventCallsWithUnsuccessfulLogin).toBe(0);
        });

        it('should sign up user if user not registered', async () => {
            setUserSignInMethods(firebaseAuth, [])
            const email = 't@t.com';
            const password = '123456';
            await auth.login(email, password);
            expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(firebaseAuth.getAuth(), email, password);
        });

        it('should emit `user-status-change` event when signup successful', async () => {
            setUserSignInMethods(firebaseAuth, [])
            setSignUp(firebaseAuth, SUCCESSFUL);
            const spy = spyOnUserStatusChangeEvent(auth);

            await auth.login('email', 'password');
            const eventCallsWithSuccessfulLogin = spy.mock.calls.length;

            expect(eventCallsWithSuccessfulLogin).toBe(1);
        });
        
        it('should prevent emit of event `user-status-change` when signup unsuccessful', async () => {
            setUserSignInMethods(firebaseAuth, [])
            setSignUp(firebaseAuth, UNSUCCESSFUL);
            const spy = spyOnUserStatusChangeEvent(auth);

            await auth.login('email', 'password');
            const eventCallsWithUnsuccessfulLogin = spy.mock.calls.length;

            expect(eventCallsWithUnsuccessfulLogin).toBe(0);
        });
    });

    describe('logout', () => {
        let firebaseAuth: any;

        beforeEach(async () => {
            firebaseAuth = await import('firebase/auth');
        });

        it('should call firebase signOut', async () => {
            auth.logout();
            expect(firebaseAuth.signOut).toHaveBeenCalledWith(firebaseAuth.getAuth());
        });

        it('should emit `user-status-change` event', async () => {
            const spy = spyOnUserStatusChangeEvent(auth);

            await auth.logout();
            const eventCalls = spy.mock.calls.length;

            expect(eventCalls).toBe(1);
        });
    });
});

const SUCCESSFUL = true;
const UNSUCCESSFUL = false;
function setLogin(firebaseAuth: any, successful: boolean) {
    (firebaseAuth.signInWithEmailAndPassword as any).mockImplementation(async () => {
        const user = {
            uid: '123',
            email: 'test@test.com'
        };

        (firebaseAuth.getAuth as any).mockReturnValue({
            currentUser: successful ? user : null
        });


        return {
            user
        };
    });
}

function setSignUp(firebaseAuth: any, successful: boolean) {
    (firebaseAuth.createUserWithEmailAndPassword as any).mockImplementation(async () => {
        const user = {
            uid: '123',
            email: 'test@test.com'
        };

        (firebaseAuth.getAuth as any).mockReturnValue({
            currentUser: successful ? user : null
        });


        return {
            user
        };
    });
}

function spyOnUserStatusChangeEvent(auth: Auth) {
    const spy = vi.fn();
    auth.addEventListener('user-status-change', spy);
    return spy;
}

function setUserSignInMethods(firebaseAuth: any, signInMethods: string[]) {
    (firebaseAuth.fetchSignInMethodsForEmail as any).mockImplementation(async () => signInMethods);
}