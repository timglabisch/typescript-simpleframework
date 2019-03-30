import {AbstractController, DomEnv} from "./controller/AbstractController";
import AbstractJSXController from "./controller/AbstractJSXController";
import * as ReactDOM from "react-dom";
import * as React from "react";

declare var console: any;
declare var window: Window;


export class App {

    private routingMap: Map<string, any> = new Map();
    private controllerMap: Map<Element, { controller: AbstractController | AbstractJSXController<any>, controllerKey: any, found: number }> = new Map();
    private foundRounds: number = 1;

    // todo, managed controllers sammeln...

    public run() {

        let routingMetadata = Reflect.getMetadata(
            "tg:controller",
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

            if (typeof controllerDiKey == "undefined") {
                console.log("warning, controller '" + controllerName + "' is undefined");
                continue;
            }

            if (controllerDiKey instanceof AbstractJSXController) {
                ReactDOM.render(React.createElement(controllerDiKey.constructor as any), controllerNode);
                continue;
            }

            console.log(controllerDiKey);

            let controllerInstance = new controllerDiKey.constructor;

            this.controllerMap.set(controllerNode, {controller: controllerInstance, controllerKey: controllerDiKey, found: 0});
        }

        for (const [key, mapEntry] of this.controllerMap) {
            if (mapEntry.found === 0) {
                mapEntry.found = this.foundRounds;
                if (mapEntry.controller instanceof AbstractController) {
                    mapEntry.controller.env = new DomEnv([key]);
                }
                console.log( mapEntry);

                // register  delegations
                const delegations = Reflect.getMetadata("tg:on_delegate", mapEntry.controllerKey) || [];
                for (const delegation of delegations) {
                    const c : any = mapEntry.controller;
                    if (mapEntry.controller instanceof AbstractController) {
                        mapEntry.controller.env.onDelegated(delegation.type, delegation.query, (event: Event) => {
                            const f = c[delegation.propertyKey].bind(c);
                            f(new DomEnv([event.target as Element], c.env), event);
                        });
                    }
                }
                if (mapEntry.controller instanceof AbstractController) {
                    mapEntry.controller.mount();
                }

                const handleResponse = (response : any) => {
                    if (!response) {
                        return;
                    }
                };

                let response : any = mapEntry.controller.render();
                if (!response) {
                    console.log("response is undefined");
                } else {
                    handleResponse(response);
                }


                continue;
            }

            if (mapEntry.found !== this.foundRounds) {
                if (mapEntry.controller instanceof AbstractController) {
                    mapEntry.controller.unmount();
                }
                this.controllerMap.delete(key);
                continue;
            }

            // noting to do, node is in sync.
        }
    }
}
