import {controller} from "../decorators";
import {inject} from "inversify";
import XService from "../service/xservice";
import {Controller} from "./Controller";

declare var console: any;

@controller({name: "foo"})
export default class FooController extends Controller{

    private node : Element;
    static counter: number = 0;

    constructor(@inject(XService) xservice: XService) {
        super();
        console.log(FooController.counter++);
    }

    mount(node: Element) {
        this.node = node;
        console.log("mount foo with ", node)

        node.addEventListener('click', this.onClick.bind(this));
    }


    unmount() {
        super.unmount();
        console.log("unmount");
    }

    onClick() {

        let child = document.createElement("div");
        child.innerHTML = '<div style="padding-left: 20px"><div class="controller" data-controller="foo">sub</div></div>';

        this.node.appendChild(child);
    }
}
