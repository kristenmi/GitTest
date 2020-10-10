// for(var i = 0;i<100;i++){
//     return i
// }

$(function(){
    var oBtns = $(".carouselbox").find("ol li");
    var oUl = $(".carouselbox").find("ul");
    var iNow = 0;
    var timer = null;

    $(".carouselbox").mouseenter(function(){
      clearInterval(timer);
    })

    $(".carouselbox").mouseleave(function(){
      timer = setInterval(function(){
        iNow++;
        tab();
      },4000)
      tab();
    })

    oBtns.click(function(){
      iNow = $(this).index();
      tab();
    })

    timer = setInterval(function(){
      iNow++;
      tab();
    },4000)

    function tab(){
      oBtns.removeClass("active").eq(iNow).addClass("active");
      if(iNow == oBtns.size()){
        oBtns.eq(0).addClass("active");
      }
      oUl.animate({
        left:-iNow * 1516
      },1000,function(){
        if(iNow === oBtns.size()){
          iNow = 0;
          oUl.css("left",0);
        }
      })
    }
  })
