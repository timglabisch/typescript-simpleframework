import {controller} from "../decorators";
import {inject} from "inversify";
import XService from "../service/xservice";
import {Controller} from "./Controller";

declare var console: any;

@controller({name: "foo"})
export default class FooController extends Controller{

    static counter: number = 0;

    constructor(@inject(XService) xservice: XService) {
        super();
        console.log(FooController.counter++);
    }

    mount(node: Element) {
        console.log("mount foo with ", node)
    }
}
