import {service} from "../decorators";

declare var console: any;


@service(XService)
class XService {
    constructor() {
        console.log("foo");
    }
}

export default XService;
