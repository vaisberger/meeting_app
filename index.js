const app={
    pages:[],
    show: new Event('show'),
    init:function(){
        app.pages=document.querySelectorAll('.page');
        app.pages.forEach((pg)=>{
            pg.addEventListener('show',app.pageShown);
        })
        
        document.querySelectorAll('.nav-link').forEach((link)=>{
            link.addEventListener('click',app.nav)
        })
    },
    nav: function(ev){
        ev.preventDefault();
        let currentPage=ev.target.getAttribute('data-target');
        document.querySelector('.active').classList.remove('active');
        document.getElementById(currentPage).classList.add('active');
        history.pushState({},currentPage,`#${currentPage}`);
    },
    pageShown: function(ev){

    },
    poppin: function(ev){

    }
}
document.addEventListener('DOMContentLoaded',app.init);