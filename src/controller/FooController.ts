import {controller} from "../decorators";
import {inject} from "inversify";
import XService from "../service/xservice";

declare var console: any;

@controller({name: "foo"})
export default class FooController {

    static counter: number = 0;

    constructor(@inject(XService) xservice: XService) {
        console.log(FooController.counter++);
    }
}
