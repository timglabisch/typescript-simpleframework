import {AbstractController, DomEnv} from "./controller/AbstractController";
import AbstractJSXController from "./controller/AbstractJSXController";
import * as React from "react";
import * as ReactDOM from "react-dom";

declare var console: any;
declare var window: Window;


export class App {

    private routingMap: Map<string, any> = new Map();
    private controllerMap: Map<Element, { controller: AbstractController | null, controllerKey: any, found: number }> = new Map();
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
                this.controllerMap.set(controllerNode, {controller: null, controllerKey: controllerDiKey, found: 0});
                continue;
            }

            this.controllerMap.set(controllerNode, {controller: new controllerDiKey.constructor, controllerKey: controllerDiKey, found: 0});
        }

        for (const [key, mapEntry] of this.controllerMap) {

            if (mapEntry.controllerKey instanceof AbstractJSXController) {

                if (mapEntry.found === 0) {
                    console.log("render jsx");
                    ReactDOM.render(React.createElement(mapEntry.controllerKey.constructor as any), key);
                } else if (mapEntry.found !== this.foundRounds) {
                    console.log("unmount jsx");
                    ReactDOM.unmountComponentAtNode(key);
                    this.controllerMap.delete(key);
                } else {
                    // simply do nothing
                }

                continue;
            }

            if (mapEntry.controller instanceof AbstractController) {

                if (mapEntry.found === 0) {
                    mapEntry.found = this.foundRounds;


                    // handle abstract controller
                    mapEntry.controller.env = new DomEnv([key]);

                    // register  delegations
                    const delegations = Reflect.getMetadata("tg:on_delegate", mapEntry.controllerKey) || [];
                    for (const delegation of delegations) {
                        const c: any = mapEntry.controller;
                        if (mapEntry.controller instanceof AbstractController) {
                            mapEntry.controller.env.onDelegated(delegation.type, delegation.query, (event: Event) => {
                                const f = c[delegation.propertyKey].bind(c);
                                f(new DomEnv([event.target as Element], c.env), event);
                            });
                        }
                    }

                    mapEntry.controller.mount();


                    const handleResponse = (response: any) => {
                        if (!response) {
                            return;
                        }
                    };

                    let response: any = mapEntry.controller.render();
                    if (!response) {
                        console.log("response is undefined");
                    } else {
                        handleResponse(response);
                    }

                } else if (mapEntry.found !== this.foundRounds) {
                    mapEntry.controller.unmount();

                    this.controllerMap.delete(key);
                    continue;
                }

                continue;
            }




        }


// noting to do, node is in sync.
    }
}
