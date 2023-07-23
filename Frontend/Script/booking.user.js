const main=document.getElementById("cont");
// const id=localStorage.getItem(userid);
let total=document.getElementById("total");
total.innerText="Your total Bookings : 0";
fetch(`http://localhost:8080/user/getapp/64bbbe5f8d73234be5274d04`,{
    method:"GET",
    headers:{
        "content-type":"application/json",
        "authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGJiYmU1ZjhkNzMyMzRiZTUyNzRkMDQiLCJpYXQiOjE2OTAxMTQ3NDgsImV4cCI6MTY5MDcxOTU0OH0.n8qQLPnEXNsdAB4LI5d2PdQKPfj7xD-mjRxS7UADaRs"
    }
})
.then((res)=>res.json())
.then((data)=>{
    //  console.log(data);
    total.innerText=`Your total Bookings : ${data.length}`;
    showdata(data);
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
    fetch(`http://localhost:8080/delete/${id}`,{
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