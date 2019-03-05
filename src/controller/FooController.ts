import {controller} from "../decorators";
import {inject} from "inversify";
import XService from "../service/xservice";
import {Controller} from "./Controller";

declare var console: any;

@controller({name: "foo"})
export default class FooController extends Controller {

    private level: number = 0;
    private node: Element;
    static counter: number = 0;

    constructor(@inject(XService) xservice: XService) {
        super();
    }

    mount() {
        this.level = Number(this.env.firstNativeElement()!.getAttribute('data-level') || 0);
        this.env.on('click', this.onClick.bind(this));
    }

    onClick(event: any) {
        console.log("append node");
        event.stopPropagation();
        event.preventDefault();

        let child = this.env.create("div", `
            <div style="padding-left: 20px">
                <span class="sub">
                    <span class="removeTrigger" style="position: absolute; margin-left: -20px; display:inline-block; background-color: grey">[=]</span>
                    <div class="controller" data-controller="foo" data-level="${this.level + 1}">sub ${this.level}</div>
                </span>
            </div>`
        );

        //child.querySelector(".removeTrigger")!.addEventListener('click', this.removeNode.bind(this));
        child.findOne('.removeTrigger')!.on('click', this.removeNode.bind(this));

        this.env.append(child);

    }

    removeNode(event: any) {
        console.log("remove node");
        event.stopPropagation();
        event.preventDefault();

        this.env.findOne(".sub")!.remove();
    }
}
