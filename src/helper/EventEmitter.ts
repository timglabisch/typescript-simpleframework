type Arguments<T> = T extends ( ...args : infer U ) => any
    ? U : [void];

class EventEmitterXX<T> {
    cbs: Map<keyof T, Array<Function>> = new Map();

    public on<K extends keyof T>(event: K, cb: T[K]) {
        let items = this.cbs.get(event);
        items = this.cbs.get(event) || new Array<Function>();
        this.cbs.set(event, items);
    }

    public trigger<K extends keyof T>(event: K, ...args : Arguments<T[K]>) {
        let items = this.cbs.get(event);

        for(let item of items) {
            item(...args);
        }
    }
}

interface Events {
    foo: (x: boolean, y : boolean) => void,
    bar: () => void,
    xxx: (x : (x: boolean) => String) => void,
}


let em = new EventEmitterXX<Events>();
em.on('foo', (x : boolean, y : boolean) => {

});

em.trigger('foo', true, true);
em.trigger('bar');
em.trigger('xxx', (x) => { return "foo" + x; });