export class Greeter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
}