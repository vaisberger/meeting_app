class Network{
    constructor() {
        this['#svr'] = new FServer();
    }

    Send(data){
        return this['#svr'].HandleRequest(data);
    }
}