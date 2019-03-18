import {controller, onDelegated} from "../decorators";
import {inject} from "inversify";
import XService from "../service/xservice";
import {Controller, DomEnv} from "./Controller";
import * as React from 'react'

declare var console: any;

@controller({name: "jsx"})
export default class BtnController extends Controller {

    mount() {
        let dom = <div>foooo</div>;
    }

}
