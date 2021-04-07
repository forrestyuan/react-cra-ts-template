import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
//mobx on older javascript envirnoment
import { configure } from "mobx";

configure({ useProxies: "never" }); // Or "ifavailable".
