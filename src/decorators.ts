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
            constraint: (bind: interfaces.Bind, bindTarget: any) => bind(target).to(bindTarget),
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
            target
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


export {service, controller, RouteArgs}
