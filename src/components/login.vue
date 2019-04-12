<template>
  <div class="login">
    <form class="form-signin">
      <img class="mb-4" src="../assets/logo.png" alt="logo" width="72" height="72">
      <h1 class="h3 mb-3 font-weight-normal">用户管理系统登录</h1>
      <label for="username" class="sr-only">用户名</label>
      <input type="text" id="username" class="form-control" placeholder="请输入用户名" v-model="userInfo.username" required autofocus>
      <label for="inputPassword" class="sr-only">密码</label>
      <input type="password" id="inputPassword" class="form-control" placeholder="请输入密码" v-model="userInfo.password" required @keyup.enter="doLogin">
      <!-- <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me"> Remember me
        </label>
      </div> -->
      <button class="btn btn-lg btn-primary btn-block" type="button" @click="doLogin">Sign in</button>
      <!-- <p class="mt-5 mb-3 text-muted">&copy; 2017-2018</p> -->
    </form>
  </div>
</template>

<script>

  //导入axios，封装的ajax组件
  import axios from 'axios'

  //一个querystring解析和字符串化库，添加了一些安全性。
  import Qs from 'qs'

  //每次请求都携带cookies信息
  //axios.defaults.withCredentials = true


import {Event} from '../main.js'


export default {
  name: 'login',
  data () {
    return {
      userInfo:{
        username:'',
        password:''
      }
    };
  },
  methods:{
    doLogin:function () {
      var data=Qs.stringify({
        'username':this.userInfo.username,
        'password':this.userInfo.password
        });
      var that=this;
      axios.post('/logincheck',data)
        .then(function (response) {
          console.log(response)
          if(response.data==true){
            //跳转到登录成功界面
            console.log(Event);
            Event.$emit('login',that.userInfo.username);
          }
          else{
            alert("用户名或者密码错误，请重新输入！");
          }
        })
        .catch(function (error) {
          console.log(error)
        })


    }
  }
}
</script>

<style scoped>
@import '../assets/css/bootstrap4.0.min.css';
@import '../assets/css/signin.css';
</style>
