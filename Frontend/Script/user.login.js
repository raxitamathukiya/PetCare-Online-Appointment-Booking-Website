let form=document.getElementById("login_form");
 

form.addEventListener("submit",(e)=>{
   e.preventDefault();
  let obj={
   email:form.email.value,
   password:form.Password.value
  }
  fetch("https://petcare-oj1q.onrender.com/user/login",{
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
    Swal.fire(
      `${data.msg}`,
      'Successful',
      'success'
  )
  setTimeout(() => {
    window.location.href="./user_index.html";
  }, 3000);

     localStorage.setItem("name",JSON.stringify(data.name));
     localStorage.setItem("token",JSON.stringify(data.token));
     localStorage.setItem("userid",(data.userid));
     

   }else if(!data.token){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
    })
  setTimeout(() => {
    window.location.href="#";
  }, 3000);
   }
   
   
  })
})

