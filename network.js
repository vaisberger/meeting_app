class Network{
    constructor() {
        this['#svr'] = new FServer();
    }

    static instance = null;

    static GetInstance() {
        if (!Network.instance) {
            Network.instance = new Network();
        }
        return Network.instance;
    }

    Send(data){
        return this['#svr'].HandleRequest(data);
    }
}

Object.freeze(Network.prototype);
