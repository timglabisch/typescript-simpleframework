import {Container} from "inversify";
import {buildProviderModule} from "inversify-binding-decorators";
import {Controller, DomEnv} from "../controller/Controller";

declare var console: any;
declare var window: Window;


export class App {

    private container: Container = new Container();
    private routingMap: Map<string, any> = new Map();
    private controllerMap: Map<Element, { controller: Controller, controllerKey: any, found: number }> = new Map();
    private foundRounds: number = 1;

    // todo, managed controllers sammeln...

    public run() {

        this.container.load(buildProviderModule());

        let routingMetadata = Reflect.getMetadata(
            "tg:routing",
            Reflect
        );

        for (var metaData of routingMetadata) {
            this.routingMap.set(metaData.routeArgs.name, metaData.target);
        }

        document.addEventListener("DOMContentLoaded", this.onDomLoaded.bind(this));
    }

    private onDomLoaded() {

        this.checkControllers();

        const observer = new MutationObserver(this.onBodyChanged.bind(this));
        observer.observe(document.body, {childList: true, subtree: true});
    }

    private onBodyChanged() {
        this.checkControllers();
    }

    private checkControllers() {
        this.foundRounds++;
        let controllerNodes = document.querySelectorAll(".controller[data-controller]");

        for (var controllerNode of controllerNodes) {
            let controllerName = controllerNode.getAttribute("data-controller");

            if (!controllerName) {
                continue;
            }

            let entry = this.controllerMap.get(controllerNode);

            if (entry !== undefined) {
                entry.found = this.foundRounds;
                continue;
            }

            let controllerDiKey = this.routingMap.get(controllerName);

            let controllerInstance = this.container.get<Controller>(controllerDiKey);

            this.controllerMap.set(controllerNode, {controller: controllerInstance, controllerKey: controllerDiKey, found: 0});
        }

        for (const [key, mapEntry] of this.controllerMap) {
            if (mapEntry.found === 0) {
                mapEntry.found = this.foundRounds;
                mapEntry.controller.env = new DomEnv([key]);
                console.log( mapEntry);

                // register  delegations
                const delegations = Reflect.getMetadata("tg:on_delegate", mapEntry.controllerKey) || [];
                for (const delegation of delegations) {
                    const c : any = mapEntry.controller;
                    mapEntry.controller.env.onDelegated(delegation.type, delegation.query, c[delegation.propertyKey].bind(c));
                }

                mapEntry.controller.mount();


                continue;
            }

            if (mapEntry.found !== this.foundRounds) {
                mapEntry.controller.unmount();
                this.controllerMap.delete(key);
                continue;
            }

            // noting to do, node is in sync.
        }
    }
}
