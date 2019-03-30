import {controller} from "../decorators";
import {AbstractController} from "../core/controller/AbstractController";
import * as React from "react";

declare var console: any;

class FooComponent extends React.Component {

}

@controller({name: "async"})
export default class extends AbstractController {

    clicks = 1;

    addOne() {
        this.clicks++;
        this.reRender();
    }

    async timeout(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async loading(counter: number) {
        return <div>loading {counter}</div>
    }

    async* otherRender() {
        yield this.loading(3);
        await this.timeout(100);
        yield this.loading(4);
        await this.timeout(100);
    }

    async* render() {
        yield this.loading(1);
        await this.timeout(100);
        yield this.loading(2);
        await this.timeout(100);
        yield* this.otherRender();

        yield <div>
            loaded.
            <button onClick={this.addOne.bind(this)}>
                clicks { this.clicks }
            </button>
        </div>
    }

}
