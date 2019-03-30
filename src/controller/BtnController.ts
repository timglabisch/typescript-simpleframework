import {controller, onDelegated} from "../decorators";
import {AbstractController, DomEnv} from "../core/controller/AbstractController";

declare var console: any;

@controller({name: "btn"})
export default class extends AbstractController {

    protected clicksA: number = 0;
    protected clicksB: number = 0;

    @onDelegated('click', '.btnA')
    onClickA() {
        this.env.find('.btnA').html("click " + this.clicksA++);
    }

    @onDelegated('click', '.btnB')
    onClickB(el : DomEnv) {
        el.html("click " + this.clicksB++)
    }

    mount() {
        console.log(this.env.firstNativeElement())
    }

}
