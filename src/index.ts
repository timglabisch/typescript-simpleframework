import "reflect-metadata";
import "./controller/FooController"
import "./controller/BtnController"
import "./controller/JsxController"
import {App} from "./core/app";

declare var console: any;


(new App()).run();
