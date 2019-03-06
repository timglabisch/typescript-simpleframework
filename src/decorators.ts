import {fluentProvide} from "inversify-binding-decorators";
import {decorate, injectable, interfaces} from "inversify";

const service = (identifier: any) => {
    return fluentProvide(identifier)
        .inSingletonScope()
        .done();
};

interface RouteArgs {
    name: string | undefined
}

const controller = (routeArgs : RouteArgs) => {

    return function (target: any) {

        decorate(injectable(), target);

        // provide metadata
        const currentMetadata = {
            constraint: (bind: interfaces.Bind, bindTarget: any) => bind(target.prototype).to(bindTarget),
            implementationType: target
        };

        const previousMetadata = Reflect.getMetadata(
            "inversify-binding-decorators:provide",
            Reflect
        ) || [];

        Reflect.defineMetadata(
            "inversify-binding-decorators:provide",
            [currentMetadata, ...previousMetadata],
            Reflect
        );


        // routing
        const currentRouting = {
            routeArgs,
            target: target.prototype,
        };

        const previousRouting = Reflect.getMetadata(
            "tg:routing",
            Reflect
        ) || [];

        Reflect.defineMetadata(
            "tg:routing",
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


export {service, controller, RouteArgs, onDelegated}
