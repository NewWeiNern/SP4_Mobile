const page = new PageController($(".nav"), $(".page-container"));
const map = {
    tileLayer : new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    
}
function run(dir, event){
    event.preventDefault();
    const element = !event ? this : event.target;
    const from = $(element).data("from") || $(element).attr("href");
    const to = $(element).data("to");
    page.view(from, to, dir).then(e=>e._p.setHash(to));
}
$(`
    #intro.page input, 
    #login.page .no-acc a
`).click(run.bind(null, "left"));
$(`
    #register .hve-acc a
`).click(run.bind(null, "right"));
$(".nav a").click(function(e){
    e.preventDefault();
    if($(this).hasClass("active")){return;}
    page.view($(this).data("from"), $(this).attr("href"), $(this).data("transition"))
    .then(e=>{
        $(".nav .active").removeClass("active");
        $(this).addClass("active");
        e._p.setHash($(this).attr("href"));
    });
});
swipe($("#onboard.page"));
$(".nav #qr-img").change(scanner);
$("#login.page form, #register.page form").submit(function(e){
    e.preventDefault();
    fetch(this.action, {
        method : this.method,
        body : new FormData(this)
    }).then(e=>e.json())
    .then(e=>{
        if(Object.keys(e).indexOf("err") > -1){
            alert(e["err"]);
        }
        else{
            page._store.set("user_data", JSON.stringify(e));
            page.userLogin(e);
            page
            .view($(this).data("from"), $(this).data("to"), $(this).data("transition"))
            .then(e=>{
                e._p.setHash("#profile");
                $(".nav").removeClass("disable").addClass("enable");
            });
        }
    });
});