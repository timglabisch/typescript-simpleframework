import {controller} from "../decorators";
import {Controller} from "./Controller";
import * as React from 'react'

declare var console: any;

@controller({name: "jsx"})
export default class JSXController extends Controller {

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
