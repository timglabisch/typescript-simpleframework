import "reflect-metadata";
import "./controller/FooController"
import "./controller/BtnController"
import "./controller/JSXController"
import "./controller/AsyncController"
import {App} from "./core/app";

declare var console: any;


(new App()).run();
