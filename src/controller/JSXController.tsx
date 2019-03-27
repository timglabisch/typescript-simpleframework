import {controller} from "../decorators";
import * as React from 'react'
import {AbstractController} from "../core/controller/AbstractController";

declare var console: any;

@controller({name: "jsx"})
export default class extends AbstractController {

    clicks = 1;

    addOne() {
        this.clicks++;
        console.log("click", this);
        this.reRender();
    }

    render() {
        return <div>
            <button onClick={this.addOne.bind(this)}>
                clicks { this.clicks }
            </button>
        </div>
    }

}
