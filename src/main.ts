import {Container, inject} from "inversify";
import "reflect-metadata";
import {buildProviderModule} from "inversify-binding-decorators";
import FooController from "./controller/FooController";

declare var console: any;

var container = new Container();

container.load(buildProviderModule());

console.log(container.get<FooController>(FooController));
console.log(container.get<FooController>(FooController));


let routingMetadata = Reflect.getMetadata(
    "tg:routing",
    Reflect
);

console.log(routingMetadata);