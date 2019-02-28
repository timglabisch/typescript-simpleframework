import {Container} from "inversify";
import {buildProviderModule} from "inversify-binding-decorators";

declare var console: any;

export class App {

    public run() {
        var container = new Container();

        container.load(buildProviderModule());

        let routingMetadata = Reflect.getMetadata(
            "tg:routing",
            Reflect
        );

        console.log(routingMetadata);
    }

}
