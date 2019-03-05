import {controller} from "../decorators";
import {inject} from "inversify";
import XService from "../service/xservice";
import {Controller} from "./Controller";

declare var console: any;

@controller({name: "btn"})
export default class FooController extends Controller {

    mount() {
        console.log(this.env.firstNativeElement())
    }

}
