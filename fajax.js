class FXHR {
    msg = {};
    #async = false;

    constructor() {
        this['#net'] = Network.GetInstance();
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

                    const res = this['#net'].Send(this.msg);;
                    dispatcher(res);
                },
                2
            );
    }
}