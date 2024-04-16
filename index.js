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
    }, poppin: function (ev) {
        console.log(location.hash, 'popstate event');
        let hash = location.hash.replace('#', '');
        document.querySelector('.active').classList.remove('active');
        document.getElementById(hash).classList.add('active');
        console.log(hash)
        document.getElementById(hash).dispatchEvent(app.show);
    }
}
// a function that gets all meetings of specific user
function getmeetings() {
    let meetings = [];
  
    const fxhr = new FXHR();
    fxhr.open("GET", "");
    fxhr.send({ meeting: "meeting" }, (meetinglist) => {
      meetings = meetinglist;
    });
    return meetings;
  }
function addMeeting() {
    document.getElementById("newmeeting").style.visibility = "visible";
}
function exit() {
    document.getElementById("newmeeting").style.visibility = "hidden";
}
let meetinglist =[];
function add(){
   const date =document.getElementById("date") ;
   const time =document.getElementById("time") ;
   const place =document.getElementById("place") ;
   const discription =document.getElementById("discription") ;
   const fxhr = new FXHR();
   fxhr.open('Post', '');
   meetinglist = !meetinglist ? [] : meetinglist;
   let meetingdata = {day: date, hour: time, location: place,data:discription};
   meetinglist.push(meetingdata);
   fxhr.send({ meeting: meetinglist[meetinglist.length-1] }, (message) => {
    alert(message);});
}
document.addEventListener('DOMContentLoaded', app.init);
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



