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

    send_async(data, dispatcher){    
        this['#svr'].HandleRequestAsync(data, dispatcher);
    }

    send_sync(data){
        let result =  this['#svr'].HandleRequestSync(data);
        return result;
    }
}

Object.freeze(Network.prototype);
