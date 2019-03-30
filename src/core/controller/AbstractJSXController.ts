import * as React from "react";

export default abstract class<S> extends React.Component<{}, S> {
    constructor(props: {}, context: S) {
        super(props, context);

        this.init();
        const initState = this.init();
        if (initState) {
            this.state = initState;
        }
    }

    init(): Readonly<S> | void {
    }
}

