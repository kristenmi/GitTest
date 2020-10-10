define(["jquery","jquery_cookie"],function($){
  function check(){
    console.log("shopping_cart.js开始执行");
    console.log($?"ok":"error");
  }
  function end(){
    console.log("shopping_cart.js执行结束");
  }
  //加载购物车页面
  function cart_msg(){
    var cookieStr = $.cookie("goods");
    if(!cookieStr){
      $(".cart_insert").html("");
      $(".text_choose_all").prev().removeClass("checkbox_on");
      $(".total_num").find("h4 i").text(0);
      $(".total_num").find("h5 i").text(0);
      $(".total_price").find("h4 i span").text(0.00);
      return;
    }
    $(".text_choose_all").prev().addClass("checkbox_on");
    //下载所有的商品数据
    $.ajax({
      url: "../json/hot_goods.json",
      success: function(data){
        let arr = data.data.list;
        let cookieArr = JSON.parse(cookieStr);
        let newArr = [];
        for(let i = 0; i < arr.length; i++){
          for(let j = 0; j < cookieArr.length; j++){
            if(cookieArr[j].id == arr[i].id){
              newArr.push({
                id:arr[i].id,
                num:cookieArr[j].num,
                name:arr[i].name,
                title:arr[i].shop_info.title,
                sub_title:arr[i].shop_info.sub_title,
                price:arr[i].price,
                image:arr[i].shop_info.ali_image,
                note:arr[i].shop_info.spec_json[0].item_value
              });
              break;
            }
          }
        }
        //通过newArr。处理数据，将数据添加页面上
        let str = ``;
        for(let i = 0; i < newArr.length; i++){
          let total_money = Number(newArr[i].price) * Number(newArr[i].num);
          str += `
          <div class="divide" data-id="${newArr[i].id}">
            <!---->
            <div class="cart_items">
              <!---->
              <div class="cart_item">
                <div class="checkbox_container">
                  <span class="m_blue_checkbox_new checkbox_on"> </span>
                </div>
                <div class="item_wrapper">
                  <div class="items_thumb">
                    <img height="80" width="80" src="${newArr[i].image}" alt="${newArr[i].title}">
                    <a target="_blank" title="${newArr[i].title}" href="https://www.smartisan.com/item/${newArr[i].id}"></a>
                  </div>
                  <div class="name hide_row">
                    <div class="name_table">
                      <a target="_blank" title="${newArr[i].title}" href="https://www.smartisan.com/item/${newArr[i].id}">${newArr[i].title}</a>
                      <ul class="attribute clearfix">
                        <li>${newArr[i].note}</li>
                      </ul>
                    </div>
                  </div>
                  <div class="operation">
                    <a class="items_delete_btn" data-id="${newArr[i].id}"></a>
                  </div>
                  <div>
                    <!---->
                    <div class="subtotal">
                      <i>¥</i>
                      <span>${total_money}</span>
                    </div>
                    <!---->
                    <div class="item_cols_num">
                      <!---->
                      <div class="quantity">
                        <span class="button down disabled"></span>
                        <span class="num">
                          <input name='number' readonly="readonly" type="number" value="${newArr[i].num}">
                        </span>
                        <span class="button up"></span>
                        <!---->
                      </div>
                      <!---->
                      <!---->
                    </div>
                    <div class="price">
                      <i>¥</i>
                      <span>${newArr[i].price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          `;
        }
        $(".cart_insert").html(str);
        console.log("加载购物车页面完成");
        total_data();
      },
      error: function(msg){
        console.log(msg);
      }
    });
  }
  //统计栏刷新
  function total_data(){
    let cookieStr = $.cookie("goods");
    let sum = 0;
    if(cookieStr){
      var cookieArr = JSON.parse(cookieStr);
      for(let i = 0; i < cookieArr.length; i++){
        sum += cookieArr[i].num;
      }
    }else{
      $(".text_choose_all").prev().removeClass("checkbox_on");
      $(".total_num").find("h4 i").text(0);
      $(".total_num").find("h5 i").text(0);
      $(".total_price").find("h4 i span").text(0.00);
    }
    $(".total_num").find("h5 i").text(sum);//总商品数
    let checkbox_node = $(".cart_insert").find(".checkbox_on");
    let check_num = 0;
    let check_money = 0;
    if(checkbox_node.length){
      for(let i = 0; i < checkbox_node.length; i++){
        let parent_node = checkbox_node.eq(i).closest("div.divide");
        check_num += Number(parent_node.find("input[name='number']").val());
        check_money += Number(parent_node.find(".subtotal span").text());
      }
    }else{
      check_num = 0;
      check_money = 0;
    }
    $(".total_num").find("h4 i").text(check_num);//选中商品数
    if(check_num == sum){//是否全选
      $(".text_choose_all").prev().addClass("checkbox_on");
    }else{
      $(".text_choose_all").prev().removeClass("checkbox_on");
    }
    $(".total_price").find("h4 i span").text(check_money);//选中总金额
  }
  //购物车操作集合
  function cart_operation(){
    //选择按钮
    $(".cart_insert").on("click","span.m_blue_checkbox_new",function(){
      $(this).hasClass("checkbox_on") ? $(this).removeClass("checkbox_on"):$(this).addClass("checkbox_on");
      total_data();
    });
    $(".js_choose_all span.m_blue_checkbox_new").click(function(){
      $(this).hasClass("checkbox_on") ? $("span.m_blue_checkbox_new").removeClass("checkbox_on"):$("span.m_blue_checkbox_new").addClass("checkbox_on");
      total_data();
    });
    //加减按钮
    $(".cart_insert").on("click","span.button.down",function(){
      let num_node = $(this).next(".num").find("input");
      let id = Number($(this).closest("div.divide").attr("data-id"));
      let num = Number(num_node.val());
      num--;
      if(num <= 1){
        $(this).addClass("disabled");
        num = 1;
      }
      num_node.val(num);
      let price = Number($(this).closest("div.divide").find("div.price span").text());
      let money = price * num;
      $(this).closest("div.divide").find("div.subtotal span").text(money);
      let cookieArr = JSON.parse($.cookie("goods"));
      let index = cookieArr.findIndex(item => item.id == id);
      cookieArr[index].num = num;
      $.cookie("goods", JSON.stringify(cookieArr), {
        expires: 7,
        path:"/"
      });
      total_data();
    });
    $(".cart_insert").on("click","span.button.up",function(){
      let num_node = $(this).prev(".num").find("input");
      let id = Number($(this).closest("div.divide").attr("data-id"));
      let num = Number(num_node.val());
      num++;
      $(this).closest("div.divide").find(".button.down").removeClass("disabled");
      num_node.val(num);
      let price = Number($(this).closest("div.divide").find("div.price span").text());
      let money = price * num;
      $(this).closest("div.divide").find("div.subtotal span").text(money);
      let cookieArr = JSON.parse($.cookie("goods"));
      let index = cookieArr.findIndex(item => item.id == id);
      cookieArr[index].num = num;
      $.cookie("goods", JSON.stringify(cookieArr), {
        expires: 7,
        path:"/"
      });
      total_data();
    });
    //删除按钮
    $(".cart_insert").on("click",".items_delete_btn",function(){
      let id = Number($(this).attr("data-id"));
      $(this).closest("div.divide").remove();
      let cookieArr = JSON.parse($.cookie("goods"));
      let index = cookieArr.findIndex(item => item.id == id);
      cookieArr.splice(index, 1);
      if(cookieArr.length){
        $.cookie("goods", JSON.stringify(cookieArr), {
          expires: 7,
          path:"/"
        });
      }else{
        $.cookie("goods", null,{path:"/"});
      }
      total_data();
    });
    //删除选中所有商品
    $(".delete_choose_goods").click(function(){
      let checkbox_node = $(".cart_insert").find(".checkbox_on");
      let cookieArr = JSON.parse($.cookie("goods"));
      if(!checkbox_node.length){
        return;
      }
      for(let i = 0; i < checkbox_node.length; i++){
        let parent_node = checkbox_node.eq(i).closest("div.divide");
        let id = Number(parent_node.attr("data-id"));
        parent_node.remove();
        let index = cookieArr.findIndex(item => item.id == id);
        cookieArr.splice(index, 1);
      }
      if(cookieArr.length){
        $.cookie("goods", JSON.stringify(cookieArr), {
          expires: 7,
          path:"/"
        })
      }else{
        $.cookie("goods", null,{path:"/"});
      }
      total_data();
    });
  }
  return {
    check,
    c_m:cart_msg,
    t_d:total_data,
    c_o:cart_operation,
    end
  };
});