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

        let firebaseAuth: any;

        beforeEach(async () => {
            firebaseAuth = await import('firebase/auth');
        });

        it('should toggle `isLoggedIn` if login successful', async () => {
            setLogin(firebaseAuth, SUCCESSFUL);

            await auth.login('email', 'password');
            expect(auth.isLoggedIn()).toBe(true);
        });

        it('should call `signInWithEmailAndPassword` with auth, email and password', async () => {
            const email = 't@t.com';
            const password = '123456';
            await auth.login(email, password);
            expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(firebaseAuth.getAuth(), email, password);
        });

        it('should emit `user-status-change` event when login successful', async () => {
            setLogin(firebaseAuth, SUCCESSFUL);
            const spy = spyOnUserStatusChangeEvent(auth);

            await auth.login('email', 'password');
            const eventCallsWithSuccessfulLogin = spy.mock.calls.length;

            expect(eventCallsWithSuccessfulLogin).toBe(1);
        });
        
        it('should prevent emit of event `user-status-change` when login unsuccessful', async () => {
            setLogin(firebaseAuth, UNSUCCESSFUL);
            const spy = spyOnUserStatusChangeEvent(auth);

            await auth.login('email', 'password');
            const eventCallsWithUnsuccessfulLogin = spy.mock.calls.length;

            expect(eventCallsWithUnsuccessfulLogin).toBe(0);
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

function spyOnUserStatusChangeEvent(auth: Auth) {
    const spy = vi.fn();
    auth.addEventListener('user-status-change', spy);
    return spy;
}
