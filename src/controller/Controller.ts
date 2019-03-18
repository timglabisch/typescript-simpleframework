import {injectable} from "inversify";
import * as ReactDOM from "react-dom";
import * as React from "react";

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

    create<K extends keyof HTMLElementTagNameMap>(tagName: K, html: string) {
        const tag = document.createElement(tagName);
        tag.innerHTML = html;
        return new DomEnv([tag], this);
    }

    append(dom: DomEnv) {
        for (var nativeElement of this.nativeElements) {
            for (var inativeEleent of dom.nativeElements) {
                nativeElement.appendChild(inativeEleent);
            }
        }
    }

    onDelegated(type: string, query: string, listener: any, gc: boolean = true): DomEnv {

        for (var nativeElement of this.nativeElements) {

            const rawListener = (evt: any) => {

                if (!evt.target) {
                    return;
                }

                if (!evt.target.matches(query)) {
                    return;
                }

                listener(evt);
            };

            nativeElement.addEventListener(type, rawListener);

            if (gc) {
                this.saveListenerToClear(nativeElement, type, rawListener);
            }
        }

        return this;
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

    html(html : string) {
        for (var nativeElement of this.nativeElements) {
            nativeElement.innerHTML = html;
        }
    }

    jsx(el : JSX.Element) {

        /*
        class JSXEL extends React.Component {
            constructor(props : any) {
                super(props);
            }

            render() {
                return el;
            }
        }*/

        ReactDOM.render(el, this.firstNativeElement())
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

    reRender() {
        let jsx = this.render();
        if (jsx) {
            this.env.jsx(jsx);
        }
    }

    public render(): null | JSX.Element {
        return null;
    }

    public unmount() {
        this.env.unmount();
    }
}

export {Controller, DomEnv}