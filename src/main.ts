import { App } from "./components/app";
import { Greeter } from "./components/greeter";

customElements.define("yag-app", App);
customElements.define("yag-greeter", Greeter);

document.body.innerHTML = "<yag-app></yag-app>";



