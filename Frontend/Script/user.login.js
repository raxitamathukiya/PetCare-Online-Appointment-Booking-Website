let form=document.getElementById("login_form");
 

form.addEventListener("submit",(e)=>{
   e.preventDefault();
  let obj={
   email:form.email.value,
   password:form.Password.value
  }
  fetch("http://localhost:8080/user/login",{
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
    alert(data.msg);
     localStorage.setItem("name",JSON.stringify(data.name));
     localStorage.setItem("token",JSON.stringify(data.token));
     localStorage.setItem("userid",JSON.stringify(data.userid));
     window.location.href="./index.html";
   }
   
   
  })
})

