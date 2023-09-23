import { App, Greeter, Login, Auth, Firebase } from "./components";

customElements.define("yag-app", App);
customElements.define("yag-greeter", Greeter);
customElements.define("yag-login", Login);
customElements.define("yag-auth", Auth);
customElements.define("yag-firebase", Firebase);

document.body.innerHTML = "<yag-app></yag-app>";



