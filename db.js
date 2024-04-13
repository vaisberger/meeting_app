class DB {
    constructor() {
        if (!localStorage.getItem('users'))
            localStorage.setItem('users', JSON.stringify([]));
        if (!localStorage.getItem('meetings'))
            localStorage.setItem('meetings', JSON.stringify([]));
    }

    static instance = null;

    static GetInstance() {
        if (!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance;
    }

    AddUser(user) {
        const users = JSON.parse(localStorage.getItem('users'));
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    };

    DelUser(name)  {
        const users = JSON.parse(localStorage.getItem('users'));
        const index = users.findIndex(u => u.name === name);

        if (index !== -1){
            users.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            return true;
        }
        
        return false;
    };

    UpdateUser(user) {
        const users = JSON.parse(localStorage.getItem('users'));
        const index = users.findIndex(u => u.name === user.name);

        if (index !== -1){
            users[index] = user;
            localStorage.setItem('users', JSON.stringify(users));
            return user;
        }

        return null;
    };

    GetUser(name) {
        const users = JSON.parse(localStorage.getItem('users'));
        const index = users.findIndex(u => u.name === name);

        return users[index] || null;
    };

    GetUserByFilter(filter) {
        const users = JSON.parse(localStorage.getItem('users'));
        const filteredUsers = users.filter(u => filter(u));
        return filteredUsers;
    }

    AddMeeting(meeting) {
        const meetings = JSON.parse(localStorage.getItem('meetings'));
        meetings.push(meeting);
        localStorage.setItem('meetings', JSON.stringify(meetings));
    };

    DelMeeting(date, time) {
        const meetings = JSON.parse(localStorage.getItem('meetings'));
        const index = meetings.findIndex(m => m.date === date && m.time === time);

        if (index !== -1){
            meetings.splice(index, 1);
            localStorage.setItem('meetings', JSON.stringify(meetings));
            return true;
        }

        return false;
    };

    UpdateMeeting(meeting) {
        const meetings = JSON.parse(localStorage.getItem('meetings'));
        const index = meetings.findIndex(m => m.date === meeting.date && m.time === meeting.time);

        if (index !== -1){
            meetings[index] = meeting;
            localStorage.setItem('meetings', JSON.stringify(meetings));
            return meeting;
        }

        return null;
    };

    GetMeeting(date, time) {
        const meetings = JSON.parse(localStorage.getItem('meetings'));
        const index = meetings.findIndex(m => m.date === date && m.time === time);

        return meetings[index] || null;
    };

    GetMeetingsByFilter(filter) {
        const meetings = JSON.parse(localStorage.getItem('meetings'));
        const filteredMeetings = meetings.filter(m => filter(m));
        return filteredMeetings;
    }

    GetMeetings() {
        const meetings = JSON.parse(localStorage.getItem('meetings'));
        return meetings;
    };
}

Object.freeze(DB.prototype);

// user {
//     name: "John",
//     mail: "james@gmail.com",
//     password: 30
// }

// meeting {
//     name: "meeting",
//     date: "2020-01-01",
//     time: "10:00:00",
//     place: "Room"
// }