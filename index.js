const dates = document.querySelectorAll('.days');
const app = {
    pages: [],
    show: new Event('show'),
    init: function(){
        app.pages = document.querySelectorAll('.page');
        app.pages.forEach((pg)=>{
            pg.addEventListener('show', app.pageShown);
        })
        
        document.querySelectorAll('.nav-link').forEach((link)=>{
            link.addEventListener('click', app.nav);
        })
        history.replaceState({}, 'Home', '#home');
        window.addEventListener('popstate', app.poppin);
    },
    nav: function(ev){
        ev.preventDefault();
        let currentPage = ev.target.getAttribute('data-target');
        if (currentPage!=="home"||(document.querySelector('.active').id==="login"&&login())||(document.querySelector('.active').id==="registration"&&register()) ){
            document.querySelector('.active').classList.remove('active');
            document.getElementById(currentPage).classList.add('active');
            console.log(currentPage)
            history.pushState({}, currentPage, `#${currentPage}`);
            document.getElementById(currentPage).dispatchEvent(app.show);
            meetingslist=getmeetings();
            showMeetings("all");
        }
    },
    poppin: function(ev){
        console.log(location.hash, 'popstate event');
        let hash = location.hash.replace('#' ,'');
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
    let res = fxhr.send({object:{ name: username, password: password }});
    alert(res.body);
    if (res.status == 200){
        return true;
    }
    return false;
}

//register
function register(){
        const fxhr = new FXHR(); 
        const username = document.getElementById("newUsername").value;
        const password = document.getElementById("newPassword").value;
        const email = document.getElementById("email").value;
        fxhr.open("POST", "/register");
        let res = fxhr.send({object: { name: username, password: password, mail: email }});
        alert(res.body);
        if (res.status == 201) {
            return true;
        } 
        return false;
    }

let meetingdata = {
    day: "",
    hour: "",
    location: "",
    data: ","
}
let meetingslist = [];

// a function that gets all meetings of specific user
function getmeetings() {
    let usermeetings = [];
    const fxhr = new FXHR();
    fxhr.open("GET", "/meetings");
    fxhr.send({ }, (allmeetings) => {
      usermeetings =allmeetings;
    });
    return userTasklist;
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
    meetingdata.day = document.getElementById("date").value;
    meetingdata.hour = document.getElementById("time").value;
    meetingdata.location = document.getElementById("place").value;
    meetingdata.data = document.getElementById("discription").value;
    const fxhr = new FXHR();
    const obj = meetingdata;
    fxhr.open('Post', '/meetings', true);
    const res = fxhr.send(obj);
    //alert(res.body);
    meetingslist=getmeetings();
    showMeetings("all");
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
function delete_meeting(){

}
 //shows all posted meeting
function showMeetings(filter) {
    let li = "",
    sun="",
    mon="",
    tue="",
    wed="",
    thu="",
    fri="",
    sat="";
    if (meetingslist) {
      meetingslist.forEach((meeting) => {
        if (filter == meeting.status || filter == "all") {
          li = `<li class="meeting">
          <input type="checkbox" class="radio" id="mark">
          <li>time: ${meeting.time}</li>
          <li>location:${meeting.place}</li>
           <li>discription:${meeting.data}</li>
      </li>`                  
        }
        if(meeting.date==='sun'){
           sun+=li;
        }
        else if(meeting.date==='mon'){
            mon+=li;
        }
        else if(meeting.date==='tue'){
            tue+=li;
        }
        else if(meeting.date==='wed'){
            wed+=li;
        }
        else if(meeting.date==='thu'){
            thu+=li; 
        }
        else if(meeting.date==='fri'){
            fri+=li;
        }else{
            sat+=li;
        }
      });
    }
    document.getElementById("sun").innerHTML = sun;
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