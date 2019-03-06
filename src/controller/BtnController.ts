import {controller, onDelegated} from "../decorators";
import {inject} from "inversify";
import XService from "../service/xservice";
import {Controller} from "./Controller";

declare var console: any;

@controller({name: "btn"})
export default class BtnController extends Controller {

    protected clicksA: number = 0;
    protected clicksB: number = 0;

    @onDelegated('click', '.btnA')
    onClickA() {
        this.env.find('.btnA').firstNativeElement()!.innerHTML = "click " + this.clicksA++;
    }

    @onDelegated('click', '.btnB')
    onClickB() {
        this.env.find('.btnB').firstNativeElement()!.innerHTML = "click " + this.clicksB++;
    }

    mount() {
        console.log(this.env.firstNativeElement())
    }

}
