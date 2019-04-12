// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import Vuex from 'vuex'
Vue.use(Vuex)

//导入axios，封装的ajax组件
import axios from 'axios'
//导入VueAxios
import VueAxios from 'vue-axios'

//全局注册，所有组件都可以用
Vue.use(VueAxios,axios)

axios.defaults.baseURL='/api'
// axios.defaults.headers.post['Content-Type']='application/json'
axios.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded'
//每次请求都携带cookies信息
axios.defaults.withCredentials = true

Vue.config.productionTip = false


const store=new Vuex.Store({
  state:{
    logged_user:null,
  },
  mutations:{
    setLogStatus(state,user){
      state.logged_user=user;
    },
    clearStatus(state){
      state.logged_user=null;
    },
  },//mutations
})


//事件触发器
const Event=new Vue();




//路由加载之前中间件
router.beforeEach(function(to,from,next){
  //to 到达哪里，from 从哪里来，next()是个方法，表示接下来做什么
  //next();//正常执行
  //next(false);//所有路由都不跳转

  //此处条件限制比较严格，只有完全符合'/post'的路由才会被登录状态限制，
  //因此需要用到to对象中的to.matched数组
  // if(!logged_in && to.path=='/post')
  //   next('/login');
  // else
  //   next();

  //----------判断用户是否已经登录，如果登录则加载用户管理页面，如果没有登录则加载用户登录页面
  //if为true:用户没有登录 并且 即将访问模块需要登录
  if(to.name=="home" && store.state.logged_user==null){
    alert("请点击登录页面进行登录！");
    next('/login');
  }
  else
    next();
  //------------------

  //console.log(to)

  //-----------当用户点击退出登录链接时，判断用户是否已经登录，已经登陆则退出，没有登录则显示已退出
  if(to.name=="logout" && store.state.logged_user==null){
    alert("您还没有登录，请先登录。");
    router.push('/login');
  }else if(to.name=="logout" && store.state.logged_user!=null){
    store.commit('clearStatus');
    Event.$emit('logout');
    next();
  }
  //---------------------------


});



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  data:function(){
    return{
      currentUser:store.state.logged_user,
    }
  },
  components: { App },
  template: '<App />',
  mounted:function(){
    Event.$on("login",function(logged_user){
      //记录登录用户
      store.commit('setLogStatus',logged_user);
      router.push('/home');
    });
  },
  watch:{
    //
    
  },
})


export {Event, store};
