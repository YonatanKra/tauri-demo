import './main';

describe('main', () => {
  it ('should define yag-greeter', () => {
    expect(customElements.get('yag-greeter')).toBeDefined();
  });
});

