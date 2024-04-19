class FXHR {
    msg = {};
    #async = false;

    constructor() {
        this['#net'] = new Network();
    }

    open(method, url, async = false) {
        this.msg.method = method;
        this.msg.path = url;
        this.#async = async;
    }

    send(data, dispatcher = null) {
        this.msg.body = data;
        if (!this.#async)
            return this['#net'].Send(this.msg);
        else
            setTimeout(
                () => {

                    const res = this['#net'].Send(this.msg);
                    if (dispatcher) 
                        dispatcher(res);
                },
                2
            );
    }
}