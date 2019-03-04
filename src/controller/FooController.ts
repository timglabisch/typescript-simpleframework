import {controller} from "../decorators";
import {inject} from "inversify";
import XService from "../service/xservice";
import {Controller} from "./Controller";

declare var console: any;

@controller({name: "foo"})
export default class FooController extends Controller{

    private level : number;
    private node : Element;
    static counter: number = 0;

    constructor(@inject(XService) xservice: XService) {
        super();
    }

    mount(node: Element) {

        this.level = Number(node.getAttribute('data-level') || 0);

        this.node = node;
        console.log("mount foo with ", node);

        node.addEventListener('click', this.onClick.bind(this));
    }


    unmount() {
        super.unmount();
        console.log("unmount");
    }

    onClick(event : any) {

        event.stopPropagation();
        event.preventDefault();

        let child = document.createElement("div");
        child.innerHTML = `
            <div style="padding-left: 20px">
                <span class="sub">
                    <span style="position: absolute; margin-left: -10px;">-</span>
                    <div class="controller" data-controller="foo" data-level="${this.level + 1}">sub ${this.level}</div>
                </span>
            </div>`;
        child.querySelector('span')!.addEventListener('click', this.removeNode.bind(this));

        this.node.appendChild(child);
    }

    removeNode(event : any) {
        event.stopPropagation();
        event.preventDefault();

        this.node.querySelector(".sub")!.remove();
    }
}
