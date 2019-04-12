import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import login from '@/components/login'
import home from '@/components/home'
import logout from '@/components/logout'
import home1 from '@/components/Pages/Home1'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: '/home',
      name: 'home',
      component: home1,
      meta:{
        login_require:true,
      }
    },
    {
      path: '/logout',
      name: 'logout',
      component: logout,
      
    },
    // {
    //   path:'/test',
    //   name:'test',
    //   component:home1,
    // },
  ]
})
