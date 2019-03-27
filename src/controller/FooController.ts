import {controller, onDelegated} from "../decorators";
import {inject} from "inversify";
import XService from "../service/xservice";
import {AbstractController, DomEnv} from "../core/controller/AbstractController";

declare var console: any;

@controller({name: "foo"})
export default class extends AbstractController {

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

        if (event.target.matches(".removeTrigger")) {
            event.stopPropagation();
            event.preventDefault();
            return;
        }

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


        this.env.append(child);

    }

    @onDelegated("click", ".removeTrigger")
    removeNode(el : DomEnv, event : Event) {
        console.log("remove node");
        event.stopPropagation();
        event.preventDefault();

        console.log(this.env.findOne(".sub"));
        this.env.findOne(".sub")!.remove();
    }
}
