<?php
  header("Content-type:text/html;charset=utf-8");

  //模拟官方的返回，生成对应的内容
  $responseData = array("code" => 0, "msg" => "");

  // var_dump($_POST);
  //将数据取出
  $username = $_POST['username']; 
  $password = $_POST['password'];
  // $createtime = $_POST['createTime'];
  // $repassword = $_POST['repassword'];

  //初步的判断
  if(!$username){
    $responseData['code'] = 1;
    $responseData['msg'] = "用户名不能为空";
    echo json_encode($responseData);
    exit;
  }

  if(!$password){
    $responseData['code'] = 2;
    $responseData['msg'] = "密码不能为空";
    echo json_encode($responseData);
    exit;
  }

  //验证数据库是否有同名的用户
  //1、链接数据库
  $link = mysql_connect("localhost", "root", "123456");

  //2、判断数据库是否链接成功
  if(!$link){
    $responseData['code'] = 4;
    $responseData['msg'] = "服务器忙";
    echo json_encode($responseData);
    exit;
  }

  //3、设置访问字符集
  mysql_set_charset("utf8");

  //4、选择数据库
  mysql_select_db("qd2004");

  //5、准备sql语句  username  password  是否能够登陆成功
  $password = md5(md5(md5($password)."qianfeng")."qingdao");
  $sql = "SELECT * FROM users WHERE username='{$username}' AND password = '{$password}'";

  // echo $sql; //输出一下，看一下sql拼接的对不对
  //6、发送sql语句
  $res = mysql_query($sql);

  $row = mysql_fetch_assoc($res);

  //7、取出一行
  
  if($row){
    $responseData['msg'] = "登陆成功";
    echo json_encode($responseData);
  }else{
    $responseData['code'] = 5;
    $responseData['msg'] = "用户名或密码错误";
    echo json_encode($responseData);
    exit;
  }

  // $password = md5(md5(md5($password)."qianfeng")."qingdao");

  // //注册
  // $sql2 = "INSERT INTO users(username,password,createtime) VALUES('{$username}','{$password}',{$createtime})";

  // $res = mysql_query($sql2);

  // if(!$res){
  //   $responseData['code'] = 6;
  //   $responseData['msg'] = "注册失败";
  //   echo json_encode($responseData);
  //   exit;
  // }

  // $responseData['msg'] = "注册成功";
  // echo json_encode($responseData);


  //8、关闭数据库
  mysql_close($link);


?>
