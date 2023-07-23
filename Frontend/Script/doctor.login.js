let form=document.getElementById("login_form");
 

form.addEventListener("submit",(e)=>{
   e.preventDefault();
  let obj={
   email:form.email.value,
   password:form.Password.value
  }
  fetch("https://petcare-oj1q.onrender.com/doctor/login",{
   method:"POST",
   headers:{
       "Content-type":"application/json"
   },
   body:JSON.stringify(obj)
  })
  .then((res)=>{
   return res.json();
  })
  .then((data)=>{
   
   if(data.token){
     localStorage.setItem("name",JSON.stringify(data.name));
     localStorage.setItem("token",JSON.stringify(data.token));
     localStorage.setItem("dr_id",JSON.stringify(data.dr_id));
     window.location.href="./doctor_index.html";
   }
   
   
  })
})

