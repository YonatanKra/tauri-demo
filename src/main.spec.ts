import './main';

describe('main', () => {
  it ('should define yag-greeter', () => {
    expect(customElements.get('yag-greeter')).toBeDefined();
  });

  it ('should define yag-app', () => {
    expect(customElements.get('yag-app')).toBeDefined();
  });

  it('should set yag-app inside the body', () => {
    expect(document.body.innerHTML).toBe('<yag-app></yag-app>');
  });

  it ('should define yag-login', () => {
    expect(customElements.get('yag-login')).toBeDefined();
  });

  it ('should define yag-auth', () => {
    expect(customElements.get('yag-auth')).toBeDefined();
  });

  it ('should define yag-firebase', () => {
    expect(customElements.get('yag-firebase')).toBeDefined();
  });
});

