import {controller, onDelegated} from "../decorators";
import {inject} from "inversify";
import XService from "../service/xservice";
import {Controller, DomEnv} from "./Controller";

declare var console: any;

@controller({name: "btn"})
export default class BtnController extends Controller {

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
