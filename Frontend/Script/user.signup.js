let form=document.getElementById("signup_form");

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    let obj={
        firstname:form.firstname.value,
        email:form.email.value,
        password:form.password.value,
        phone:form.phone.value,
        city:form.city.value
    }
    fetch("http://localhost:8080/user/register",{
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
    alert(data.msg);
    window.location.href="../user.login.html";
    
   })
})