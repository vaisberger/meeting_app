class FXHR{
    msg = {};
    #async = false;
    
    constructor(){
        this['#net'] = Network.GetInstance();
    }

    open(method, url, async = false){
        this.msg.method = method;
        this.msg.path = url;
        this.#async = async;
    }

    send(data, dispatcher = null){
        this.msg.body = data;
        if (!this.#async)
        {
            let result = this['#net'].send_sync(this.msg);
            return result;
        }
        else
            this['#net'].send_async(this.msg, dispatcher);
    }
}