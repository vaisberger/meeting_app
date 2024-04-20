const dates = document.querySelectorAll('.days');
const app = {
    pages: [],
    show: new Event('show'),
    init: function () {
        app.pages = document.querySelectorAll('.page');
        app.pages.forEach((pg) => {
            pg.addEventListener('show', app.pageShown);
        })

        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', app.nav);
        })
        history.replaceState({}, 'Home', '#home');
        window.addEventListener('popstate', app.poppin);
    },
    nav: function (ev) {
        ev.preventDefault();
        let currentPage = ev.target.getAttribute('data-target');
        if (currentPage !== "home" || (document.querySelector('.active').id === "login" && login()) || (document.querySelector('.active').id === "registration" && register())) {
            document.querySelector('.active').classList.remove('active');
            document.getElementById(currentPage).classList.add('active');
            console.log(currentPage)
            history.pushState({}, currentPage, `#${currentPage}`);
            document.getElementById(currentPage).dispatchEvent(app.show);
            getmeetings(showMeetings, 'all');
        }
    },
    poppin: function (ev) {
        console.log(location.hash, 'popstate event');
        let hash = location.hash.replace('#', '');
        document.querySelector('.active').classList.remove('active');
        document.getElementById(hash).classList.add('active');
        console.log(hash)
        //history.pushState({}, currentPage, `#${currentPage}`);
        document.getElementById(hash).dispatchEvent(app.show);
    }
}
document.addEventListener('DOMContentLoaded', app.init);

// login
function login() {

    const fxhr = new FXHR();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fxhr.open("POST", "/login");
    let res = fxhr.send({ object: { name: username, password: password } });
    alert(res.body);
    if (res.status == 200) {
        return true;
    }
    return false;
}

//register
function register() {
    const fxhr = new FXHR();
    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;
    const email = document.getElementById("email").value;
    fxhr.open("POST", "/register");
    let res = fxhr.send({ object: { name: username, password: password, mail: email } });
    alert(res.body);
    if (res.status == 201) {
        return true;
    }
    return false;
}

let meetingdata = {
    date: "",
    time: "",
    location: "",
    data: ","
}

// a function that gets all meetings of specific user
function getmeetings(dispatcher, filter) {
    const fxhr = new FXHR();
    fxhr.open("GET", "/meetings", true);
    fxhr.send({}, (response) => {
        if (response.status === 200) {
            let usermeetings = response.body;
            dispatcher(usermeetings, filter);
        }
        else {
            alert(response.body);
        }
    });
}

// add meeting

// button to add meeting
function addMeeting() {
    document.getElementById("newmeeting").style.visibility = "visible";
}
//button to exit the adding form
function exit() {
    document.getElementById("newmeeting").style.visibility = "hidden";
}
// adding a meeting
function add() {
    meetingdata.date = document.getElementById("date").value;
    meetingdata.time = document.getElementById("time").value;
    meetingdata.location = document.getElementById("place").value;
    meetingdata.data = document.getElementById("discription").value;
    const fxhr = new FXHR();
    const obj = meetingdata;
    fxhr.open('POST', '/meeting', true);
    const res = fxhr.send({ object: obj });
    getmeetings(showMeetings, 'all');
}

const select = document.getElementById('date');
select.addEventListener('change', selectChange());

function selectChange() {
    const month = select.value;
    const body = {
        filter: {
            month: month
        }
    };

    let fxhr = new FXHR();
    fxhr.open('GET', '/meetings/filtered');
    const res = fxhr.send(body);

    if (res.status == 200) {

    }


}
//deletes a spcific meeting
function delete_meeting(id) {

}

function edit_meeting(meeting) {
    meeting.date = document.getElementById("date").value;
    meeting.time = document.getElementById("time").value;
    meeting.location = document.getElementById("place").value;
    meeting.data = document.getElementById("discription").value;
    
    const fxhr = new FXHR();
    fxhr.open('PUT', '/meeting', true);
    fxhr.send({ object: meeting }, response => {
        if (response.status == 200) {
            getmeetings(showMeetings, 'all');
        }
        else {
            alert(response.body);
        }
    });

    exit();
    const btn = document.getElementById('n_u_meeting');
    btn.removeEventListener('click', edit_meeting);
    btn.addEventListener('click', add);
    btn.innerText = 'Add';
}

function show_update_card(meeting) {
    const btn = document.getElementById('n_u_meeting');
    btn.removeEventListener('click', add);
    btn.addEventListener('click', edit_meeting(meeting));
    btn.innerText = 'Update';
    addMeeting();
}

function menue_buttons(meeting) {
    const ul = document.createElement('ul');
    ul.classList.add('task-menu');

    // Create the "Edit" element
    const editLi = document.createElement('li');
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="uil uil-pen"></i>Edit';
    editBtn.addEventListener('click', () => {
        show_update_card(meeting);
    });
    editLi.appendChild(editBtn);

    // Create the "Delete" element
    const deleteLi = document.createElement('li');
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="uil uil-trash"></i>Delete';
    deleteBtn.addEventListener('click', () => {
        delete_meeting(meeting.id);
    });
    deleteLi.appendChild(deleteBtn);

    ul.appendChild(editLi);
    ul.appendChild(deleteLi);

    return ul;
}

function meetingGuiItem(meeting) {
    const li = document.createElement('li');
    li.classList.add('meeting');

    const dateItem = document.createElement('li');
    dateItem.textContent = `Day: ${meeting.date}`;

    const timeItem = document.createElement('li');
    timeItem.textContent = `Time: ${meeting.time}`;

    const locationItem = document.createElement('li');
    locationItem.textContent = `Location: ${meeting.place}`;

    const descriptionItem = document.createElement('li');
    descriptionItem.textContent = `Description: ${meeting.data}`;

    const ul = menue_buttons(meeting);

    li.appendChild(timeItem);
    li.appendChild(locationItem);
    li.appendChild(descriptionItem);
    li.appendChild(ul);

    return li;
}

function appendMettings(divName, meetingsLi){
    let div = document.getElementById(divName);
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    meetingsLi.forEach(item => div.appendChild(item));
}
//shows all posted meeting
function showMeetings(meetingslist, filter) {
    let li = "",
        sun = [],
        mon = "",
        tue = "",
        wed = "",
        thu = "",
        fri = "",
        sat = "";
    if (meetingslist) {
        meetingslist.forEach((meeting) => {
            if (filter == meeting.status || filter == "all") {
                li = meetingGuiItem(meeting);
            }
            if (meeting.date === 'sun') {
                sun.push(li);
            }
            else if (meeting.date === 'mon') {
                mon += li;
            }
            else if (meeting.date === 'tue') {
                tue += li;
            }
            else if (meeting.date === 'wed') {
                wed += li;
            }
            else if (meeting.date === 'thu') {
                thu += li;
            }
            else if (meeting.date === 'fri') {
                fri += li;
            } else {
                sat += li;
            }
        });
    }
    appendMettings('sun', sun);
    document.getElementById("mon").innerHTML = mon;
    document.getElementById("tue").innerHTML = tue;
    document.getElementById("wed").innerHTML = wed;
    document.getElementById("thu").innerHTML = thu;
    document.getElementById("fri").innerHTML = fri;
    document.getElementById("sat").innerHTML = sat;
}

let boxes = document.querySelectorAll("input[type=checkbox]");
boxes.forEach(b => b.addEventListener("change", tick));
function tick(e) {
    let state = e.target.checked;
    boxes.forEach(b => b.checked = false);
    e.target.checked = state;
}