class Network{
    constructor() {
        this['#svr'] = new FServer();
    }

    static instance = null;

    static getInstance() {
        if (!Network.instance) {
            Network.instance = new Network();
        }
        return Network.instance;
    }

    send(data){
        return this['#svr'].HandleRequest(data);
    }
}

Object.freeze(Network.prototype);
