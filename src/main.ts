import { App, Greeter, Login } from "./components";

customElements.define("yag-app", App);
customElements.define("yag-greeter", Greeter);
customElements.define("yag-login", Login);

document.body.innerHTML = "<yag-app></yag-app>";



