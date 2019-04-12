<template>
  <div class="container">
    <div class="row clearfix">
      <div class="col-md-12 column">

        <!--标题-->
        <div class="container">
          <h2>用户管理系统</h2>
        </div>

        <!--欢迎信息-->
        <div class="jumbotron">
          <h3>
            管理员您好，欢迎登录！
          </h3>
          <p>
            在这里，您可以对用户信息进行管理。
          </p>
        </div>
        
        <!--添加按钮-->
        <div class="form-group">
          <input class="btn btn-success form-control" type="button" @click="showModal('add')" value="添加用户"/>
        </div>

        <!--用户信息表格-->
        <table class="table">
          <thead>
            <tr>
              <th>编号</th>
              <th>用户名</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in userData" :key=item.id>
              <td>{{item.id}}</td>
              <td>{{item.username}}</td>
              <td>{{item.createDate}}</td>
              <td>
                <button type="button" class="btn btn-primary btn-sm" @click="showModal('checkEdit',item)">查看/编辑</button>
                <button type="button" class="btn btn-danger btn-sm" @click="deleteUser(item)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>

        <modal v-if="ifModalShow" :type="modalType" :userInfo="sendedUser" :allUsers="userData"></modal>

      </div><!--col-md-12-->
    </div><!--row clear fix-->
  </div><!--container-->
</template>

<script>
//导入axios，封装的ajax组件
import axios from 'axios'
//一个querystring解析和字符串化库，添加了一些安全性。
import Qs from 'qs'
//导入模态框组件
import modal from './HomeDetails'
//导入事件触发器
import {Event} from '../../main.js'


export default{
  data:function(){
    return{
      userData:[],
      ifModalShow:false,      //模态框开关
      modalType:'',           //模态框类型，绑定type的组件prop
      sendedUser:{},          //查看/编辑模态框需要的用户数据
    }
  },//data
  components:{modal},
  mounted:function(){
    let that=this;
    //请求全部用户数据
    axios.get('/getalluser')
    .then(function(response){
      console.log(response);
      that.userData=response.data;

    })
    .catch(function(err){
      console.log(err);
    });

    //监听关闭modal事件
    Event.$on('hideModal',function(){
      that.hideModal();
    });

    //监听添加或者修改响应成功事件
    Event.$on('successForAddOrModify',function(){
      that.getAllUser();
      that.hideModal();
      alert("操作成功！");
    })

    //监听添加或者修改响应失败事件
    Event.$on('failureForAddOrModify',function(){
      alert("操作失败！");
    })

  },//mounted
  methods:{

    //打开模态框
    showModal:function(type,item=null){
      this.modalType=type
      if(item){
        this.sendedUser=item;
      }
      this.ifModalShow=true;
    },

    //关闭模态框
    hideModal:function(){
      this.modalType='';
      this.sendedUser={};
      this.ifModalShow=false;
    },

    //获取全部数据
    getAllUser:function(){
      let that=this;
      let result= axios.get('/getalluser')
      .then(function(response){
        console.log(response);
        that.userData=response.data;
      })
      .catch(function(err){
        console.log(err);
      });
      //console.log(result);
      /*
      axios返回一个promise对象：

      Promise {<pending>}
      __proto__: Promise
      [[PromiseStatus]]: "resolved"
      [[PromiseValue]]: undefined 
      */
      return result;
    },

    //删除用户
    deleteUser:function(item){
      let that=this;
      if(confirm("您确定删除该用户吗？")){//提示确认
        let data=Qs.stringify({id:item.id});
        axios.post('/userdelete',data)//发送请求
        .then(function(response){
          console.log(response);
          if(response.data==true){//判断响应内容
            that.getAllUser();
            alert("删除成功！");//提示成功
          }else{
            alert("删除失败！");
          }
        })
        .catch(function(err){
          console.log(err);
        });
      }
    },


  },//methods
}
</script>


<style scoped>
@import '../../assets/css/bootstrap4.0.min.css';

</style>
