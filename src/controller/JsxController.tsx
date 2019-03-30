import {controller} from "../decorators";
import * as React from 'react'
import AbstractJSXController from "../core/controller/AbstractJSXController";

declare var console: any;

@controller({name: "jsx"})
export default class extends AbstractJSXController<any> {

    init() {
        this.state = {
            clicks: 0
        }
    }

    addOne() {
        this.setState({
            clicks: this.state.clicks + 1
        });
    }

    render() {
        return <div>
            <button onClick={this.addOne.bind(this)}>
                clicks { this.state.clicks }
            </button>
        </div>
    }

}