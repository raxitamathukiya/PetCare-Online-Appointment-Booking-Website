const main=document.getElementById("cont");
const id=localStorage.getItem("userid");
const token=JSON.parse(localStorage.getItem("token"))
let total=document.getElementById("total");
let user=document.getElementById('user')
let name=localStorage.getItem('name')

user.innerText=name
Logout=document.getElementById('Logout')
Logout.addEventListener("click",async()=>{
   try {
       let res= await fetch('https://petcare-oj1q.onrender.com/user/logout',{
                   method:"POST",
                   mode:"cors",
                   headers:{
                       'Content-type':'application/json' ,
                       'Authorization': `Bearer ${token}`
                   },
                 
                 })
                 let data= await res.json()
                 alert(data.msg)
                 localStorage.setItem("name","");
                   localStorage.setItem("token","");
                 window.location.href="./index.html"
                 
   } catch (error) {
       console.log(error)
   }
})
total.innerText="Your total Bookings : 0";
fetch(`https://petcare-oj1q.onrender.com/user/getapp/${id}`,{
    method:"GET",
    headers:{
        "content-type":"application/json",
        "authorization":`Bearer ${token}`
    }
})
.then((res)=>res.json())
.then((data)=>{
     console.log(data);
    total.innerText=`Your total Bookings : ${data.length}`;
    showdata(data);
}).catch((error)=>{
    console.log(error)
})

function showdata(data){
    main.innerHTML=null;
    console.log(data);

    data.forEach(element => {
        let card=document.createElement("div");
        card.setAttribute("class","card");

        let div1=document.createElement("div");
        

        let status=document.createElement("div");
        status.setAttribute("class","statusdiv");

        let h2=document.createElement("h3");
        h2.innerHTML=`Status <span id="confirm">${element.is_conform}</span>`;

        status.append(h2);

        let middle=document.createElement("div");
        middle.setAttribute("class","middle");

        let id=document.createElement("h3");
        id.innerHTML=`<span>ID : </span> ${element._id}`;

        let petname=document.createElement("h3");
        petname.innerHTML=`<span>Pet-name : </span> ${element.petname}`

        let date=document.createElement("h3");
        date.innerHTML=`<span>Date : </span> ${element.date}`

        let time=document.createElement("h3");
        time.innerHTML=`<span>Time : </span> ${element.time}`

        let urgency=document.createElement("h3");
        urgency.innerHTML=`<span>Urgency Level : </span> ${element.urgency_level}`

        let note=document.createElement("h3");
        note.innerHTML=`<span>Note : </span> ${element.note}`

        let p=document.createElement("p");
        p.innerText="( When doctor confirm your appointment then you will get updated status of your appointment)"


        middle.append(id,petname,date,time,urgency,note,p);

        let div=document.createElement("div");
        div.setAttribute("class","btn-div");

        // let edit=document.createElement("button");
        // edit.setAttribute("class","update");
        // edit.innerText="Updatd details";
        // edit.addEventListener("click",()=>{
        //     // updateAppointment(element._id);
        // });

        let cancle=document.createElement("button");
        cancle.setAttribute("class","cancle");
        cancle.innerText="Cancle appointment";
        cancle.addEventListener("click",()=>{
            cancleAppointment(element._id);
        });

        let logo=document.createElement("div");
        logo.setAttribute("class","logo-div");

        let img=document.createElement("img");
        img.src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3y_kimC-KZq7MB-jCbNPsc92BPM71KBdVnA&usqp=CAU";

        logo.append(img);

        div.append(cancle);
        div1.append(status,middle,div);
        card.append(div1,logo);
        main.append(card);

    });
}

function updateAppointment(id){

}

function cancleAppointment(id){
    fetch(`https://petcare-oj1q.onrender.com/user/delete/${id}`,{
        method:"DELETE",
        headers:{
            "content-type":"application/json",
            "authorization":`bearer ${token}`
        }
    })
    .then((res)=>res.json())
    .then((data)=>{
        alert("Appointment cancled successfully");
        location.reload();
    })
}