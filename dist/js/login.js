import ajax from "ajax.js";
var oBtn = document.getElementById("btn1");
var aInput = document.querySelectorAll(".form-group input");
var oAlert = document.querySelector(".alert");
oBtn.onclick = function(){
  ajax({
    type:'post',
    url:'../login.php',  
    data:{
      username:aInput[0].value,
      password:aInput[1].value,
      // repassword:aInput[2].value,
      // createTime:new Date().getTime()
    },
    success:function(msg){
      // console.log(msg);
      var obj = JSON.parse(msg);
      if(obj.code){
        oAlert.className = 'alert alert-danger';
      }else{
        oAlert.className = 'alert alert-success';
      }
      oAlert.style.display='block';
      oAlert.innerHTML = obj.msg;
    },
      error:function(msg){
        console.log(msg);       
    }
  })
}