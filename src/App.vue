<template>
  <div id="app">
    <!--页面头部-->
    <div class="header">
      <ul>
        <li class="header-left"><router-link to="/">首页</router-link></li>
        <li class="header-left"><router-link to="/home">用户主页</router-link></li> 
        <!-- <li class="header-left"><router-link to="/test">测试页</router-link></li>  -->
        <li class="header-right" v-if="loggedUser"><router-link to="/logout">退出登录</router-link></li>       
        <li class="header-right" v-if="!loggedUser"><router-link to="/login">登录</router-link></li> 
      </ul>
    </div>
    <div class="logInfo" v-if="loggedUser" ><p v-html="'已登录，当前用户：'+loggedUser"></p></div>
    <div>
      <router-view></router-view>
    </div>
    
    
  </div>
</template>

<script>
import {store,Event} from './main';
export default {
  name: 'App',
  data:function(){
    return{
      loggedUser:null,
    }
  },

  mounted:function(){
    var that=this;
    Event.$on('login',function(user){      
      that.loggedUser=user;    
    });
    Event.$on('logout',function(){
      that.loggedUser=store.state.logged_user;
    })
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #333;
}

.header-left{
    float: left;
}

.header-right{
    float: right;
}

li a {
    display: block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
}

li a:hover {
    background-color: #41b883;
}

li a:active {
    background-color: #41b883;
}

.router-link-exact-active {
  background-color:#169d61;
}

.logInfo{
  color:white;
  width:100%;
  height:40px;
  border-radius: 0 0 6px 6px;
  background-color: #41b883;
}

.logInfo p{
    margin:0;
    padding:8px 0;
}

</style>
