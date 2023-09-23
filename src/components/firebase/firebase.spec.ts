import { Firebase } from './firebase';

describe('login', () => {
    let firebase: Firebase;

    beforeAll(() => {
        vi.mock('firebase/app', () => {
            return {
                initializeApp: () => 'MockFirebaseApp'
            }
        });
        customElements.define('yag-firebase', Firebase);
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    beforeEach(() => { 
        firebase = document.createElement('yag-firebase') as Firebase;
    });

    describe('init', () => {
        it('should expose an app property', () => {
           expect(firebase).toBeTruthy();
           expect(firebase.app).toBe('MockFirebaseApp');
        });
    });
});