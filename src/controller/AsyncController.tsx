import {controller} from "../decorators";
import {AbstractController} from "../core/controller/AbstractController";
import * as React from "react";

declare var console: any;

@controller({name: "async"})
export default class extends AbstractController {

    async timeout(ms : number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async loading(counter : number) {
        return <div>loading {counter}</div>
    }

    async *render() {
        yield this.loading(1);
        await this.timeout(100);
        yield this.loading(2);
        await this.timeout(100);
        
        yield <div>loaded.</div>
    }

}
