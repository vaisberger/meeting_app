class FServer {
    #db = DB.GetInstance();

    HandleRequestAsync(data, dispatcher){
        setTimeout(
            () => {
                const res = this.#handleRequest(data.method, data.path, data.body);
                dispatcher(res);
            },
            2
        );
    }

    HandleRequestSync(data){
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

        switch (basePath) {
            case '/user':
                const name = query.get('name');
                return { status: 200, body: this.#db.GetUser(name) };
            case '/user/filtered':
                let filter = body['filter'];
                return { status: 200, body: this.#db.GetUserByFilter(filter) };
            case '/meetings':
                return { status: 200, body: this.#db.GetMeetings() };
            case '/meeting':
                const date = query.get('date');
                const time = query.get('time');
                return { status: 200, body: this.#db.GetMeeting(date, time) };
            case '/meetings/filtered':
                filter = body['filter'];
                return { status: 200, body: this.#db.GetMeetingsByFilter(filter) };
            default:
                return { status: 404, body: 'Not Found' };
        }
    }

    #handlePostRequest(path, data) {
        switch (path) {
            case '/user':
                if (!this.#db.GetUser(data.name))
                    return { status: 201, body: this.#db.AddUser(data) };
                return { status: 409, body: 'User Already Exists' };
            case '/meeting':
                if (!this.#db.GetMeeting(data.date, data.time))
                    return { status: 201, body: this.#db.AddMeeting(data) };

                return { status: 409, body: 'Meeting i the same time Already Exists' };
            default:
                return { status: 404, body: 'Not Found' };
        }
    }

    #handlePutRequest(path, data) {
        let res = null;

        switch (path) {
            case '/user':
                res = this.#db.UpdateUser(data);
                break;
            case '/meetings':
                res = this.#db.UpdateMeeting(data);
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
                res = this.#db.DeleteUser(query.get('name'));
                break;
            case '/meeting':
                res = this.#db.DelMeeting(query.get('date'), query.get('time'));
                break;
            default:
        }

        if (res)
            return { status: 204 };
        return { status: 404, body: `${data} Not Found` };
    }
}

// Usage
const fakeServer = new FakeServer();

// Example usage: Handle a GET request
const getUsersResponse = fakeServer.handleRequest('GET', '/users');
console.log(getUsersResponse);

// Example usage: Handle a POST request
const postData = { id: 3, name: 'Alice' };
const postUsersResponse = fakeServer.handleRequest('POST', '/users', postData);
console.log(postUsersResponse);

// Example usage: Handle a PUT request
const putData = { id: 1, name: 'Updated John' };
const putUsersResponse = fakeServer.handleRequest('PUT', '/users', putData);
console.log(putUsersResponse);

// Example usage: Handle a DELETE request
const deleteUsersResponse = fakeServer.handleRequest('DELETE', '/users');
console.log(deleteUsersResponse);
