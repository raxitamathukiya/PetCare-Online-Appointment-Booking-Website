
let token=JSON.parse(localStorage.getItem("token"))
let user=document.getElementById('user')
  let name=JSON.parse(localStorage.getItem('name'))

  user.innerText=name
  Logout=document.getElementById('Logout')
  Logout.addEventListener("click",async()=>{
     try {
         let res= await fetch('https://petcare-oj1q.onrender.com/doctor/logout',{
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
let id=JSON.parse(localStorage.getItem("dr_id"))
let drName=JSON.parse(localStorage.getItem("name"))
const root=document.getElementById('Appointment');
const fetchdata=(async()=>{

    try {
      let res= await fetch(`https://petcare-oj1q.onrender.com/doctor/appointment/${id}`,{
        method:"GET",
        mode:"cors",
        headers:{
            'Content-type':'application/json',
            'Authorization':`Bearer ${token}`
        },

      })
      let data= await res.json()
      console.log("data",data.data)
      display(data.data)
    } catch (error) {
        console.log(error)
    }
})

fetchdata()

function display(data){
    console.log(data);
    data.forEach(element => {
        
        
        let div=document.createElement('div');
        div.setAttribute("class","app_div");

        let drname=document.createElement('h6');
        drname.innerText=`DoctorName: ${drName}`;

        let name=document.createElement('h6');
        name.innerText=`UserName: ${element.name}`;

        let petname=document.createElement('h6');
        petname.innerText=`PetName: ${element.petname}`;

        let date=document.createElement("h6");
        date.innerText=`Date: ${element.date}`;

        let time=document.createElement("h6");
        time.innerText=`Time: ${element.time}`;

        let level=document.createElement("h6");
        level.innerText=`Appointment_Status: ${element.urgency_level}`;

        bt1=document.createElement('button');
        bt1.setAttribute("class","bt1");
        bt1.setAttribute("id","bt1");
        bt1.innerText="Cancel";

        bt1.addEventListener("click",async()=>{
            let obj={
                email:element.email,
                date:element.date,
                time:element.time,
                name:element.name,
                doctor_id:element.doctor_id,
                is_conform:element.is_conform,
                _id:element._id
            }
                    try {
                let res= await fetch('https://petcare-oj1q.onrender.com/doctor/sendmail/?status=false',{
                    method:"POST",
                    mode:"cors",
                    headers:{
                        'Content-type':'application/json' 
                    },
                    body:JSON.stringify(obj)
                  })
                  let data= await res.json()
                  
            
            } catch (error) {
                alert("Appointment canceled")
                location.reload();
                
               
            }
            // logic
        })

        bt2=document.createElement('button');
        bt2.setAttribute("class","bt2");
        bt2.innerText="Confirm";

        bt2.addEventListener("click",async()=>{
            let obj={
                email:element.email,
                date:element.date,
                time:element.time,
                name:element.name,
                doctor_id:element.doctor_id,
                is_conform:element.is_conform,
                _id:element._id
            }
                    try {
                let res= await fetch('https://petcare-oj1q.onrender.com/doctor/sendmail/?status=true',{
                    method:"POST",
                    mode:"cors",
                    headers:{
                        'Content-type':'application/json' 
                    },
                    body:JSON.stringify(obj)
                  })
                  let data= await res.json()
                  
            
            } catch (error) {
                alert("Appointment confirm")
              location.reload();
            }
            // logic
        })


        div.append(name,petname,drname,date,time,level,bt2,bt1)
        root.append(div)

        
        

    });
}

