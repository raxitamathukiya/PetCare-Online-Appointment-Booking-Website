let notification=document.getElementById("notification");
let allbookings=document.getElementById("all-bookoing");
let seebooking=document.getElementById("see-booking");


let container=document.getElementById("container");

seebooking.addEventListener("click",()=>{
    fetch("https://petcare-oj1q.onrender.com/doctor/totalbbokings/new",{
        method:"GET",
        Headers:{
            "content-type":"application/json",
            "token":`bearer ${localStorage.getItem("token")}`
        }
    })
    .then((res)=>res.json())
    .then((data)=>{
        showdata(data.data);
    })
});

function showdata(data){
    container.innerHTML=null;
        
       
    data.forEach(ele => {
        
        let card=document.createElement("div");
        card.setAttribute("class","each-card");

        let div1=document.createElement("div");
        div1.setAttribute("class","top-info");

        let div2=document.createElement("div");
        // div1.setAttribute("class","top-info");
        let name=document.createElement("h4");
        name.innerText=` NAME : ${ele.name}`
        let mobile=document.createElement("h4");
        mobile.innerText=` PHONE NO : ${ele.mobile}`;

        div2.append(name,mobile);

        let div3=document.createElement("div");
        div3.setAttribute("class","img-div");

        let img=document.createElement("img");
        img.src="./images/dog.jfif";

        let petname=document.createElement("h3");
        petname.innerText=`PET : ${ele.petname}`;

        div3.append(img,petname);

        div1.append(div2,div3);

        let middle=document.createElement("div");
        middle.setAttribute("class","date-time");

        let date=document.createElement("h3");
        date.innerText=`DATE : ${ele.date}`;

        let time=document.createElement("h3");
        time.innerText=`TIME : ${ele.time}`;

        middle.append(date,time);

        let note=document.createElement("p");
        note.setAttribute("class","note");
        note.innerHTML=`${ele.note}`;

        
        let buttons=document.createElement("div");
        buttons.setAttribute("class","buttondiv");

        let cancle=document.createElement("button");
        cancle.setAttribute("id","cancle-btn");
        cancle.innerText="Cancle";

        cancle.addEventListener("click",()=>{
            cancleAppointment(ele);
        });

        let confirm=document.createElement("button");
        confirm.setAttribute("id","confirm-btn");
        confirm.innerText="confirm";

        confirm.addEventListener("click",()=>{
            confirmAppointment(ele);
        })

        buttons.append(cancle,confirm);

        card.append(div1,middle,note,buttons);

        container.append(card);

    });
}

function confirmAppointment(data){
    alert("cancle")
}

function cancleAppointment(data){
    alert("confirm")
}

