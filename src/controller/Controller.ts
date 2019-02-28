import {injectable} from "inversify";

@injectable()
abstract class Controller {
    public mount(node : Element) {
    }

    public unmount(node : Element) {
    }
}

export { Controller }