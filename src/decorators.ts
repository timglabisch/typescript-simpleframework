interface RouteArgs {
    name: string | undefined
}

const controller = (routeArgs : RouteArgs) => {

    return function (target: any) {

        // routing
        const currentRouting = {
            routeArgs,
            target: target.prototype,
        };

        const previousRouting = Reflect.getMetadata(
            "tg:controller",
            Reflect
        ) || [];

        Reflect.defineMetadata(
            "tg:controller",
            [currentRouting, ...previousRouting],
            Reflect
        );

        return target;

    }

};

const onDelegated = (type : string, query : string) => {
    return function (target : any, propertyKey: string, descriptor: PropertyDescriptor) {
        // console.log(target, propertyKey, descriptor);

        Reflect.defineMetadata(
            "tg:on_delegate",
            [{ type, query, target, propertyKey  }, ... Reflect.getMetadata("tg:on_delegate", target) || []],
            target
        );

    }
}


export {controller, RouteArgs, onDelegated}
