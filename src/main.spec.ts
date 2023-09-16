import './main';

describe('main', () => {
  it ('should define yag-greeter', () => {
    expect(customElements.get('yag-greeter')).toBeDefined();
  });

  it('should set yag-app inside the body', () => {
    expect(document.body.innerHTML).toBe('<yag-app></yag-app>');
  });
});

