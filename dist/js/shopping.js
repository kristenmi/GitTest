$(function(){
  $.ajax({
    url:"data.json",
    success:function(result){
      console.log(result);
    },
    error:function(msg){
      console.log(msg);
    }
  })
})