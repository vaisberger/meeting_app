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
            document.querySelector('.active').classList.remove('active');
            document.getElementById(currentPage).classList.add('active');
            console.log(currentPage)
            history.pushState({}, currentPage, `#${currentPage}`);
            document.getElementById(currentPage).dispatchEvent(app.show);
            meetingslist = getmeetings();
            showTodo("all");

    }, poppin: function (ev) {
        console.log(location.hash, 'popstate event');
        let hash = location.hash.replace('#', '');
        document.querySelector('.active').classList.remove('active');
        document.getElementById(hash).classList.add('active');
        console.log(hash)
        document.getElementById(hash).dispatchEvent(app.show);
    }
}
document.addEventListener('DOMContentLoaded', app.init);

// login
function login() {

    const fxhr = new FXMLHttpRequest();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fxhr.open("POST", "/login");
    fxhr.send({ name: username, password: password }, (message) => {
        alert(message);
    });
}

//register
document.getElementById("registerForm")
    .addEventListener("button", function (event) {
        event.preventDefault();
        const fxhr = new FXMLHttpRequest();
        const username = document.getElementById("newUsername").value;
        const password = document.getElementById("newPassword").value;
        const email = document.getElementById("email").value;
        fxhr.open("POST", "/register");
        fxhr.send({ username: username, password: password, mail: email }, (message) => {
            alert(message);
        });
    });

let meetingdata = {
    day: "",
    hour: "",
    location: "",
    data: ","
}
let meetingslist = [];

// a function that gets all meetings of specific user
function getmeetings() {

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
    meetingdata.day = document.getElementById("date");
    meetingdata.hour = document.getElementById("time");
    meetingdata.location = document.getElementById("place");
    meetingdata.data = document.getElementById("discription");
    const fxhr = new FXHR();
    const body = meetingdata;
    fxhr.open('Post', '/meetings', true);
    const res = fxhr.send(body);
    if (res.status == 200) {

    } else {

    }
}

const select = document.getElementById('select');
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

function showMeetings(filter) {
    let li = "",sun="";
    if (meetingslist) {
      meetingslist.forEach((meeting) => {
        if (filter == meeting.status || filter == "all") {
          li = `<li class="meeting">
          <input type="checkbox" id="mark">
          <li>time: ${time}</li>
          <li>location:${place}</li>
           <li>discription:${data}</li>
      </li>`                  
        }
        // לשייך ליום ולשלוח
      });
    }

}
