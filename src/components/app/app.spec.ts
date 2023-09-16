import { App } from './app';

customElements.define('yag-app', App);

describe('app', () => {
    let app: App;
    beforeEach(() => {
        app = document.createElement('yag-app') as App;
        document.body.appendChild(app);
    });
    
    afterEach(() => {
        app.remove();
    });

    it('should be have an open shadow root', () => {
        expect(app.shadowRoot?.mode).toBe('open');        
    });

    it('should set yag-greeter inside the shadow root', () => {
        expect(app.shadowRoot?.querySelector('yag-greeter')).toBeTruthy();
    });
});