// var num = null;
var num=0;
var money=0;
$(function(){
    sc_msg();
    sc_num();
    // moneycount();
    // moneycount();
  
    //加载数据
    $.ajax({
      url: "./data.json",
      success: function(arr){
          console.log(arr[0].title);
        var str = ``;
        for(var i = 0; i < arr[0].childs.length; i++){
          str += `<li class="goods_item">
          <div class="goods_pic">
            <img src="${arr[0].childs[i].img}" alt="">
          </div>
          <div class="goods_title">
            <p>${arr[0].childs[i].name}</p>
          </div>
          <div class="goods_price">
            <p>￥${arr[0].childs[i].price}</p>
            <i id="${arr[0].childs[i].id}" class="sc_btn iconfont">&#xe62e;</i>
          </div>
      </li>`
        }
        $(".goods_box .rankshop").html(str);
  
      },
      error: function(msg){
        console.log(msg);
      }
    })
  
    //给加入购物车按钮添加点击
    //设置cookie <1>只能存储字符串  <2>cookie大小限制
    //json数据，id num  [{id:1,num:1},{id:2,num2}];
    $(".goods_box .rankshop").on("click", ".sc_btn", function(){
      //取出当前点击加入购物车按钮的id
      var id = this.id;
      //1、判断是否是第一次添加
      // var first = $.cookie("goods") == null ? true : false;
      var first = !($.cookie("goods"));
      if(first){
        $.cookie("goods", JSON.stringify([{id:id,num:1}]), {
          expires: 7
        });
      }else{
        //2、不是第一次，判定之前是否添加过
        var cookieArr = JSON.parse($.cookie("goods"));
        var same = false; //假设没有相同的数据
        for(var i = 0; i < cookieArr.length; i++){
          if(cookieArr[i].id == id){
            same = true;
            break;
          }
        }
        same ? cookieArr[i].num++ : cookieArr.push({id:id, num: 1});
  
        //3、将处理完的数据存储回去
        $.cookie("goods", JSON.stringify(cookieArr), {
          expires: 7
        })
      }
      sc_msg();
      sc_num();
      // moneycount();
      // moneycount();
      ballMove(this);
    })
  
  
    //抛物线运动
    function ballMove(oBtn){
      //将小球移动到点击按钮的这个位置
      $("#ball").css({
        left: $(oBtn).offset().left,
        top: $(oBtn).offset().top,
        display: 'block'
      })
  
      //计算偏移位置：
      var offsetX = $(".shopcar #shopcarnum").offset().left - $("#ball").offset().left;
      var offsetY =  $(".shopcar #shopcarnum").offset().top - $("#ball").offset().top;
  
      var bool = new Parabola({
        el: "#ball",
        offset: [offsetX, offsetY],
        duration: 2000,
        curvature: 0.001,
        autostart: true,
        callback: function(){
          $("#ball").hide();
        }
      })
      bool.start();
  
    }
  
    //右侧购物车移入移出效果
    // $(".sideBox").mouseenter(function(){
    //   $(this).stop(true).animate({right: 35}, 500)
    // }).mouseleave(function(){
    //   $(this).stop(true).animate({right: -270}, 500)
    // })
    $(".shopcar").click(function(){
      $(".sideBox").stop(true).animate({right: 35}, 500)
      $(".snbar").stop(true).animate({left: -315}, 500)
    })
    $(".snbar").click(function(){
      $(".sideBox").stop(true).animate({right: -270}, 500)
      $(".snbar").stop(true).animate({left: 0}, 500)
    })
  
    //给右侧购物车的删除按钮添加点击
    $(".sc_content ul").on("click", ".delete_goodsBtn", function(){
      var id = $(this).closest("li").remove().attr("id");
      //删除页面上的节点  从cookie中删除数据
      var cookieArr = JSON.parse($.cookie("goods"));
      for(var i = 0; i < cookieArr.length; i++){
        if(cookieArr[i].id == id){
          cookieArr.splice(i, 1);
          break;
        }
      }
      if(cookieArr.length){
        $.cookie("goods", JSON.stringify(cookieArr), {
          expires: 7
        })
      }else{
        $.cookie("goods", null);
      }
  
      //更新数据数量
      sc_num();
      moneycount();
      checkall();
    })
    $(".sc_content ul").on("click", ".sc_goodsNum button", function(){
      var id = $(this).closest("li").attr("id");
      var cookieArr = JSON.parse($.cookie("goods"));
      for(var i = 0; i < cookieArr.length; i++){
        if(cookieArr[i].id == id){
          break;
        }
      }
      if(this.innerHTML == "+"){
        cookieArr[i].num++;
      }else{
        cookieArr[i].num == 1 ? alert("数量为1，不能减少") : cookieArr[i].num--;
      }
      $.cookie("goods", JSON.stringify(cookieArr), {
        expires: 7
      })
  
      //修改页面上的数量
      $(this).siblings("span").html(`${cookieArr[i].num}`);
      sc_num();
      moneycount();
      checkall();
      // moneycount();
    })
  
    //加载右侧的购物车里面的数据
    //1、购物车的数据存储在cookie  2、商品数据在服务器
    function sc_msg(){
      var cookieStr = $.cookie("goods");
      if(!cookieStr){
        return;
      }
      //下载所有的商品数据
      $.ajax({
        url: "./data.json",
        success: function(arr){
          var cookieArr = JSON.parse(cookieStr);
          //精益求精  写算法
          var newArr = [];
          for(var i = 0; i <  arr[0].childs.length; i++){
            for(var j = 0; j < cookieArr.length; j++){
              if(cookieArr[j].id == arr[0].childs[i].id){
                  arr[0].childs[i].num = cookieArr[j].num;
                newArr.push(arr[0].childs[i]);
                break;
              }
            }
          }
          //通过newArr。处理数据，将数据添加页面上
          var str = ``;
          for(var i = 0; i < newArr.length; i++){
            str += `<li id="${newArr[i].id}">
          <input type="checkbox">
          <div class="sc_goodsPic">
              <img src="${newArr[i].img}" alt="">
          </div>
          <div class="sc_goodscont">
              <div class="sc_goodsTitle">
                  <p>${newArr[i].name}</p>
              </div>
              <div class="sc_goodsNum">
                  <div>
                      <button>+</button>
                      <span>${newArr[i].num}</span>
                      <button>-</button>
                  </div>
                  <p>￥<b>${newArr[i].price}</b></p>
              </div>
          </div> 
          <div class="delete_goodsBtn">X</div>
          </li>`;
          }
          $(".sc_content ul").html(str);
        },
        error: function(msg){
          console.log(msg);
        }
      })
    }
    // var sum = 0;
    //计算加入购物车商品的总数
    function sc_num(){
      var cookieStr = $.cookie("goods");
      var sum = 0;
      if(cookieStr){
        var cookieArr = JSON.parse(cookieStr);
        for(var i = 0; i < cookieArr.length; i++){
          sum += cookieArr[i].num;
        }
      }
      // var goods_money=$(".sc_goodscont").children(".sc_goodsNum").children("p").html();
      // var goods_num=$(".sc_goodscont").children(".sc_goodsNum").children("div").children("span").html();
      // var money=goods_money * goods_num;
      $(".shopcar #shopcarnum").html(sum);
      $(".shopCarNumBox .sc_num").html(sum);
      $(".sideBoxTop .sum-num").html(sum);
      // num=sum;
      // $("#checkedSum").find("u").html(sum);
      // $("#moneySum").find("u").html(money);
      // $(".sideBoxTop .check-sum").html(sum);
     
    }
    //判断checked属性，计算选中数量
  
  // console.log($("input").prop("checked"));
  
  // var num=sum;
  //给购物车添加input按钮
  
  
  
  $(".sc_content").on("input","li input", moneycount)
  
  })

  function moneycount(){
    // var money = 0;
    // var check=sum;
    var goods_num=0;
    var goods_money=0.00;
    goods_money=$(this).siblings(".sc_goodscont").children(".sc_goodsNum").children("p").children("b").html();
    goods_num=$(this).siblings(".sc_goodscont").children(".sc_goodsNum").children("div").children("span").html();
    // 判断是否选中
    if($(this).is(":checked")){
      num+=parseInt(goods_num);
      money+=parseFloat(goods_money*goods_num);
      $("#checkedSum").find("u").html(num);
      $("#moneySum").find("u").html(money);
    }else{
      num-= goods_num;       
      money-= parseFloat(goods_money * goods_num);
      $("#checkedSum").find("u").html(num);
      $("#moneySum").find("u").html(money);
      
    }
    console.log(money);
    console.log(goods_money);
  }
// 动画函数
//    aClose.onclick = function () {
//         oDiv.setAttribute('style','animation:closeTime 1s ease-in-out 0ms 1 normal');
//         setTimeout(function () {
//             oDiv.removeAttribute('style');
//             oDiv.style.marginRight = "-128px";
//             aClose.style.display = "none";
//             aOpen.style.display = "block";
//         },1000);
//     };
//     aOpen.onclick = function () {
//         oDiv.setAttribute('style','animation:closeTime 1s ease-in-out 0ms 1 reverse');
//         setTimeout(function () {
//             oDiv.removeAttribute('style');
//             oDiv.style.marginRight = "0";
//             aClose.style.display = "block";
//             aOpen.style.display = "none";
//         },1000);
//     };

//全选按钮选中状态判断sideBoxTop
$(".sideBoxTop").on("input","#checked-all",checkall);

function checkall(){
  var goods_num = 0; 
  var goods_money = 0.00;
  var goods_num_id=$(this).parent().siblings(".sc_content").children("ul").find(".sc_goodsNum div").find("span");
  var goods_money_id=$(this).parent().siblings(".sc_content").children("ul").find(".sc_goodsNum").find("b");
//  console.log(goods_num_id)
 // console.log(goods_money_id)
for(var i = 0;i < goods_num_id.length;i ++){
    goods_num+= parseInt($(goods_num_id.get(i)).html());
    goods_money += parseFloat($(goods_money_id.get(i)).html());
    money += goods_money * goods_num;
 }
 //  console.log(goods_money)
  //console.log((cookieArr[0].money).substring(1,2))
  //判断是否选中
  if($(this).is(":checked")){
   var id = $(this).parent().siblings(".sc_content").find("input");
   //.children("li")
    //console.log(id);
    id.prop("checked"," ")
     num += parseInt(goods_num);
    
     $("#checkedSum").find("u").html(num);
     $("#moneySum").find("u").html(money);
     $(".sideBoxTop .check-sum").html(num);
     console.log(money);
  }else{   
    var id = $(this).parent().siblings(".sc_content").find("input");
   //.children("li")
   // console.log(id);
    id.prop("checked",null);    
    num -= goods_num;       
    money -= money;
    if(num<0){
      num = 0;
    }
    console.log(money);
    $("#checkedSum").find("u").html(num);
    $("#moneySum").find("u").html(money);
    $(".sideBoxTop .check-sum").html(num);

  }
  
}
