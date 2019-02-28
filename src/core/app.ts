import {Container} from "inversify";
import {buildProviderModule} from "inversify-binding-decorators";

declare var console: any;
declare var window: Window;

export class App {

    private container : Container = new Container();

    private routingMap : Map<string, any> = new Map();

    public run() {

        this.container.load(buildProviderModule());

        let routingMetadata = Reflect.getMetadata(
            "tg:routing",
            Reflect
        );

        console.log(routingMetadata);

        for (var metaData of routingMetadata) {
            this.routingMap.set(metaData.routeArgs.name, metaData.target);
        }

        document.addEventListener("DOMContentLoaded", this.onDomLoaded.bind(this));
    }

    private onDomLoaded() {
        console.log("dom loaded");

        let controllerNodes = document.querySelectorAll(".controller[data-controller]");

        for (var controllerNode of controllerNodes) {
            let controllerName = controllerNode.getAttribute("data-controller");

            if (!controllerName) {
                continue;
            }

            let controllerDiKey = this.routingMap.get(controllerName);

            this.container.get(controllerDiKey);
        }
    }

}
