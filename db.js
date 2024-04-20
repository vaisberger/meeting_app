class DB {
    constructor() {
        if (!localStorage.getItem('users'))
            localStorage.setItem('users', JSON.stringify([]));
        if (!localStorage.getItem('meetings'))
            localStorage.setItem('meetings', JSON.stringify({}));
        if (!localStorage.getItem('m_index'))
            localStorage.setItem('m_index', JSON.stringify(0));
    }

    AddUser(user) {
        const users = JSON.parse(localStorage.getItem('users'));
        const meetings = JSON.parse(localStorage.getItem('meetings'));

        users.push(user);
        meetings[user.name] = [];

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('meetings', JSON.stringify(meetings));
    };

    DelUser(name) {
        const users = JSON.parse(localStorage.getItem('users'));
        const u_index = users.findIndex(u => u.name === name);

        if (u_index !== -1) {
            users.splice(u_index, 1);
            localStorage.setItem('users', JSON.stringify(users));

            const meetings = JSON.parse(localStorage.getItem('meetings'));
            delete meetings[name];
            localStorage.setItem('meetings', JSON.stringify(meetings));

            return true;
        }

        return false;
    };

    UpdateUser(user) {
        const users = JSON.parse(localStorage.getItem('users'));
        const index = users.findIndex(u => u.name === user.name);

        if (index !== -1) {
            users[index] = user;
            localStorage.setItem('users', JSON.stringify(users));
            return user;
        }

        return null;
    };

    GetUser(name) {
        const users = JSON.parse(localStorage.getItem('users'));
        const index = users.findIndex(u => u.name === name);

        return users ? users[index] : null;
    };

    GetUserByFilter(filter) {
        const users = JSON.parse(localStorage.getItem('users'));
        const filteredUsers = users.filter(u => filter(u));
        return filteredUsers;
    }

    #getMIndex(){
        let index = Number(JSON.parse(localStorage.getItem('m_index')));
        localStorage.setItem('m_index', JSON.stringify(index++));
        return index;
    }

    AddMeeting(name, meeting) {
        const meetings = JSON.parse(localStorage.getItem('meetings'));
        const u_meetings = meetings[name];

        if (u_meetings) {
            meeting.id = this.#getMIndex();
            u_meetings.push(meeting);
            localStorage.setItem('meetings', JSON.stringify(meetings));

            return meeting;
        }

        return null;
    };

    DelMeeting(name, id) {
        const meetings = JSON.parse(localStorage.getItem('meetings'));
        const u_meetings = meetings[name];
        const index = u_meetings.findIndex(m => m.id == id) || -1;

        if (index !== -1) {
            u_meetings.splice(index, 1);
            localStorage.setItem('meetings', JSON.stringify(meetings));
            return true;
        }

        return false;
    };

    UpdateMeeting(name, meeting) {
        const meetings = JSON.parse(localStorage.getItem('meetings'));
        const u_meetings = meetings[name];
        const index = u_meetings.findIndex(m => m.id == meeting.id);

        if (index !== -1) {
            u_meetings[index] = meeting;
            meetings[name] = u_meetings;
            localStorage.setItem('meetings', JSON.stringify(meetings));
            return meeting;
        }

        return null;
    };

    GetMeeting(name, id) {
        const meetings = JSON.parse(localStorage.getItem('meetings'));
        const u_meetings = meetings[name];
        const index = u_meetings.findIndex(m => m.id == id);

        return meetings[index] || null;
    };

    GetMeetingsByFilter(name, filter) {
        const meetings = JSON.parse(localStorage.getItem('meetings'));
        const u_meetings = meetings[name] || [];
        const filteredMeetings = u_meetings.filter(m => filter(m));
        return filteredMeetings;
    }

    GetMeetings(name) {
        const meetings = JSON.parse(localStorage.getItem('meetings'));
        const u_meetings = meetings[name] || [];
        return u_meetings;
    };
}

// user {
//     name: "John",
//     mail: "james@gmail.com",
//     password: 30
// }

// meeting {
//     id: ,
//     date: "2020-01-01",
//     time: "10:00:00",
//     place: "Room",
//     discription: ,
// }