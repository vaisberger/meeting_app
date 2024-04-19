class FServer {
    #db = new DB();
    #loggedUser = null;

    HandleRequest(data) {
        return this.#handleRequest(data.method, data.path, data.body);
    }

    #handleRequest(method, path, body) {
        switch (method) {
            case 'GET':
                return this.#handleGetRequest(path, body);
            case 'POST':
                return this.#handlePostRequest(path, body);
            case 'PUT':
                return this.#handlePutRequest(path, body);
            case 'DELETE':
                return this.#handleDeleteRequest(path);
            default:
                return { status: 404, body: 'Not Found' };
        }
    }

    #handleGetRequest(path, body) {
        const [basePath, queryParams] = path.split('?');
        const query = new URLSearchParams(queryParams);
        let res = null;

        switch (basePath) {
            case '/user':
                res = this.#db.GetUser(this.#loggedUser);
                break;
            case '/users/filtered':
                let filter = body['filter'];
                res = this.#db.GetUserByFilter(filter);
                break;
            case '/meetings':
                res = this.#db.GetMeetings(this.#loggedUser);
                break;
            case '/meeting':
                const id = query.get('id');
                res = this.#db.GetMeeting(this.#loggedUser, id);
                break;
            case '/meetings/filtered':
                filter = body['filter'];
                res = this.#db.GetMeetingsByFilter(this.#loggedUser, filter);
                break;
            default:
        }

        if (res)
            return { status: 200, body: res };
        return { status: 404, body: 'Not Found' };
    }

    #handlePostRequest(path, data) {
        const object = data;

        switch (path) {
            case '/login':
                return this.#login(object);
            case '/register':
                return this.#register(object);
            case '/logout':
                this.#loggedUser = null;
                return { status: 204 };
            case '/meeting':
                const filter = obj => {
                    return obj.date === object.date && obj.time === object.time;
                };
                if (!this.#db.GetMeetingsByFilter(this.#loggedUser, filter))
                    return { status: 201, body: this.#db.AddMeeting(object) };
                return { status: 409, body: 'Meeting in the same time Already Exists' };
            default:
                return { status: 404, body: 'Not Found' };
        }
    }

    #handlePutRequest(path, data) {
        let res = null;
        const object = data.object;

        switch (path) {
            case '/user':
                if (this.#loggedUser === object.name)
                    res = this.#db.UpdateUser(object);
                break;
            case '/meetings':
                res = this.#db.UpdateMeeting(this.#loggedUser, object);
                break;
            default:
        }

        if (res)
            return { status: 200, body: data };
        return { status: 404, body: `${data} Not Found` };
    }

    #handleDeleteRequest(path) {
        const [basePath, queryParams] = path.split('?');
        const query = new URLSearchParams(queryParams);
        let res = null;

        switch (basePath) {
            case '/user':
                res = this.#db.DelUser(this.#loggedUser);
                if (res)
                    this.#loggedUser = null;
                break;
            case '/meeting':
                res = this.#db.DelMeeting(this.#loggedUser, query.get('id'));
                break;
            default:
        }

        if (res)
            return { status: 204 };
        return { status: 404, body: `${object} Not Found` };
    }

    /*----------------help functions-----------------*/
    #login(obj) {
        let user = this.#db.GetUser(obj.name);
        if (user && user.password === obj.password) {
            this.#loggedUser = user;
            return { status: 200, body: user };
        }
        else
            return { status: 401, body: 'Unauthorized' };

    }

    #register(obj) {
        let exist = this.#db.GetUserByFilter(u => u.name === obj.name);
        if (exist.length == 0) {
            this.#db.AddUser(obj);
            this.#loggedUser = obj.name;
            return { status: 201, body: obj };
        }
        else
            return { status: 409, body: 'User Name Already Exists' };
    }
}

