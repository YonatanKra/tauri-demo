import { App, Greeter, Login, Auth } from "./components";

customElements.define("yag-app", App);
customElements.define("yag-greeter", Greeter);
customElements.define("yag-login", Login);
customElements.define("yag-auth", Auth);

document.body.innerHTML = "<yag-app></yag-app>";



