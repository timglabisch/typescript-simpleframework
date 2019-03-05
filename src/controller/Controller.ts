import {injectable} from "inversify";

class DomEnv {

    parentEnv: DomEnv | null;
    nativeElements: Element[];
    listenersToClear: Array<({ el: Element, type: string, listener: EventListenerOrEventListenerObject })> = new Array<{ el: Element, type: string, listener: EventListenerOrEventListenerObject }>();

    constructor(nativeElements: Element[], parentEnv: DomEnv | null = null) {
        this.nativeElements = nativeElements;
        this.parentEnv = parentEnv;
    }

    firstNativeElement(): Element | null {
        return this.nativeElements[0];
    }

    length(): number {
        return this.nativeElements.length;
    }

    create<K extends keyof HTMLElementTagNameMap>(tagName: K, html : string) {
        const tag = document.createElement(tagName);
        tag.innerHTML = html;
        return new DomEnv([tag], this);
    }

    append(dom : DomEnv) {
        for (var nativeElement of this.nativeElements) {
            for (var inativeEleent of dom.nativeElements) {
                nativeElement.appendChild(inativeEleent);
            }
        }
    }

    on(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions, gc: boolean = true): DomEnv {

        for (var nativeElement of this.nativeElements) {
            nativeElement.addEventListener(type, listener);
            if (gc) {
                this.saveListenerToClear(nativeElement, type, listener);
            }
        }

        return this;
    }

    saveListenerToClear(el: Element, type: string, listener: EventListenerOrEventListenerObject) {
        if (this.parentEnv) {
            this.parentEnv.saveListenerToClear(el, type, listener);
            return;
        }

        this.listenersToClear.push({el, type, listener});
    }

    find(query: string): DomEnv {
        const elements = [];

        for (var nativeElement of this.nativeElements) {
            for (var subEl of nativeElement.querySelectorAll(query)) {
                elements.push(subEl);
            }
        }

        return new DomEnv(elements, this);
    }

    findOne(query: string): DomEnv {
        for (var nativeElement of this.nativeElements) {

            let node = nativeElement.querySelector(query);

            if (node === null) {
                continue;
            }

            return new DomEnv([node], this)
        }

        return new DomEnv([], this);
    }

    remove() {
        for (var nativeElement of this.nativeElements) {
            nativeElement.parentNode!.removeChild(nativeElement);
        }
    }

    unmount() {
        let l;
        while ((l = this.listenersToClear.pop()) !== undefined) {
            l.el.removeEventListener(l.type, l.listener);
        }

    }
}

@injectable()
abstract class Controller {

    env: DomEnv;

    public mount() {

    }

    public unmount() {
        this.env.unmount();
    }
}

export {Controller, DomEnv}