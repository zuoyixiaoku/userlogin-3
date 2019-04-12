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
        <input class="btn btn-success form-control" type="button" @click="showAdd" value="添加用户"/>
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
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-primary" @click="showDetails(item)">查看</button>
                <button type="button" class="btn btn-primary" @click="showEdit(item)">编辑</button>
                <button type="button" class="btn btn-primary" @click="deleteUser(item)">删除</button>
              </div>
            </td>
					</tr>
				</tbody>
			</table>
    
      <!-- 详情-模态框 -->
      <div class="mask" id="details" v-show="ifDetailsShow">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
      
            <!-- 模态框头部 -->
            <div class="modal-header">
              <h4 class="modal-title">用户详情</h4>
              <button type="button" class="close" @click="hideDetails">&times;</button>
            </div>
      
            <!-- 模态框主体 -->
            <div class="modal-body">
              <p>用户名：{{targetUser.username}}</p>
              <p>密码：{{targetUser.password}}</p>
              <p>创建时间：{{targetUser.createDate}}</p>
            </div>
      
            <!-- 模态框底部 -->
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="hideDetails">关闭</button>
            </div>
      
          </div><!--modal content-->
        </div><!--modal dialog-->
      </div><!--mask-->



      <!-- 编辑-模态框 -->
      <div class="mask" id="details" v-show="ifEditShow">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
      
            <!-- 模态框头部 -->
            <div class="modal-header">
              <h4 class="modal-title">编辑用户信息</h4>
              <button type="button" class="close" @click="hideEdit">&times;</button>
            </div>
      
            <!-- 模态框主体 -->
            <div class="modal-body">
              <div class="form-group">
                <label>
                  用户名：
                  <input class="form-control" type="text" placeholder="请输入新用户名" v-model="editUser.username">
                </label>
                <br />
                <label>
                  新密码：
                  <input class="form-control" type="text" placeholder="请输入新密码" v-model="editUser.password">
                </label>
                <br />
                <label>
                  确认密码：
                  <input class="form-control" type="text" placeholder="请再次输入新密码" v-model="checkedPassword">
                </label>
              </div>
            </div>
      
            <!-- 模态框底部 -->
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="checkAndSend(editUser,'edit')">确认</button>
              <button type="button" class="btn btn-secondary" @click="hideEdit">取消</button>
            </div>
      
          </div><!--modal content-->
        </div><!--modal dialog-->
      </div><!--mask-->


      <!-- 添加用户-模态框 -->
      <div class="mask" id="details" v-show="ifAddShow">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
      
            <!-- 模态框头部 -->
            <div class="modal-header">
              <h4 class="modal-title">新用户信息</h4>
              <button type="button" class="close" @click="hideAdd">&times;</button>
            </div>
      
            <!-- 模态框主体 -->
            <div class="modal-body">
              <div class="form-group">
                <label>
                  用户名：
                  <input class="form-control" type="text" placeholder="请输入用户名" v-model="newUser.username">
                </label>
                <br />
                <label>
                  新密码：
                  <input class="form-control" type="text" placeholder="请输入密码" v-model="newUser.password">
                </label>
                <br />
                <label>
                  确认密码：
                  <input class="form-control" type="text" placeholder="请再次输入密码" v-model="checkedPassword">
                </label>
              </div>
            </div>
      
            <!-- 模态框底部 -->
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="checkAndSend(newUser,'add')">确认</button>
              <button type="button" class="btn btn-secondary" @click="hideAdd">取消</button>
            </div>
      
          </div><!--modal content-->
        </div><!--modal dialog-->
      </div><!--mask-->



    </div><!--col-md-12-->
  </div><!--row clear fix-->
</div><!--container-->
</template>

<script>

//导入axios，封装的ajax组件
import axios from 'axios'

//一个querystring解析和字符串化库，添加了一些安全性。
import Qs from 'qs'

import {objDeepCopy} from '../assets/js/functions'


export default{
  data:function(){
    return{
      userData:[],
      
      targetUser:{},

      editUser:{},

      checkedPassword:'',

      newUser:{
        username:'',
        password:'',
      },

      ifDetailsShow:false,
      ifEditShow:false,
      ifAddShow:false,

      
    }
  },
  //-----------------------------------------methods↓
  methods:{
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

    //打开查看模态框
    showDetails:function(item){
      this.targetUser=item;
      this.ifDetailsShow=true;
    },
    //关闭模态框
    hideDetails:function(){
      this.targetUser={};
      this.ifDetailsShow=false;
    },
    //打开编辑模态框
    showEdit:function(item){
      this.targetUser=item;
      this.editUser=objDeepCopy(item);
      this.ifEditShow=true;
    },
    //关闭编辑模态框
    hideEdit:function(){
      this.targetUser={};
      this.editUser={};
      this.ifEditShow=false;
    },
    //删除用户
    deleteUser:function(item){
      let that=this;
      if(confirm("您确定删除该用户吗？")){
        let data=Qs.stringify({id:item.id});
        axios.post('/userdelete',data)
        .then(function(response){
          console.log(response);
          if(response.data==true){
            if(that.getAllUser()){
              alert("删除成功！");//提示
            }
          }
        })
        .catch(function(err){
          console.log(err);
        });
      }
    },
    //发送修改信息
    sendEdit:function(inputInfo){
      let that=this;
      let data=Qs.stringify({
        id:inputInfo.id,
        username:inputInfo.username,
        password:inputInfo.password
      });
      axios.post('/userupdate',data)
      .then(function(response){
        console.log(response);
        if(response.data==true){
          //window.location.reload(true);//行不通，需要重新登录
          //重新请求数据
          if(that.getAllUser()){
            alert("操作成功！");//提示
            that.hideEdit();//关闭模态框
            //临时数据清空
            that.editUser={};
            //that.checkedPassword='';
          }
        }//if(data==true)
      })//then()
      .catch(function(err){
        console.log(err);
      });
    },
    //发送增添信息
    sendAdd:function(inputInfo){
      let that=this;
      let data=Qs.stringify({
        username:inputInfo.username,
        password:inputInfo.password
      });
      axios.post('/useradd',data)
      .then(function(response){
        console.log(response);
        if(response.data==true){
          //window.location.reload(true);//行不通，需要重新登录
          //重新请求数据
          if(that.getAllUser()){
            alert("操作成功！");//提示
            that.hideAdd();//关闭模态框
            //临时数据清空
            that.newUser={
              username:'',
              password:'',
            };
            //that.checkedPassword='';
          }
        }//if(data==true)
      })//then()
      .catch(function(err){
        console.log(err);
      });
    },
    //检查用户名和密码
    checked:function(inputInfo){
      let that=this;
      //check-1 username!='' 且 没有被占用
      if(!inputInfo.username){//检查用户名是否存在
        alert("用户名不能为空！");
        return false;
      }
      else if(!this.targetUser || inputInfo.username!=this.targetUser.username){//检查用户名和原来的用户名是否相同
        if(this.userData.some(function(item){
          return item.username==that.editUser.username;
        })){
          alert("用户名已被占用，请换一个！");
          return false;
        }
      }//剩下一种和原来用户名相同的情况不需排除
      //check-2 password是否一致
      if(inputInfo.password!=this.checkedPassword){
        alert("密码不一致，请修改一致后再提交！");
        return false;
      }
      console.log("用户名和密码检查完毕！");
      return true;
    },
    //检查并发送用户修改内容
    checkAndSend:function(inputInfo,type){
      
      if(this.checked(inputInfo)){
        //send
        switch(type){
          case 'edit'://edit send
            this.sendEdit(inputInfo);
            break;
          case 'add'://add send
            this.sendAdd(inputInfo);
            break;
      }//switch
      }
    },//checkAndSend()

    //打开添加模态框
    showAdd:function(){
      this.ifAddShow=true;
    },
    //打开添加模态框
    hideAdd:function(){
      this.checkedPassword='';
      this.ifAddShow=false;
    },
  },//methods{}

  //---------------------------------------methods↑


  mounted:function(){
    let that=this;
    axios.get('/getalluser')
    .then(function(response){
      console.log(response);
      that.userData=response.data;

    })
    .catch(function(err){
      console.log(err);
    });
  }
}
</script>

<style scoped>
@import '../assets/css/bootstrap4.0.min.css';
@import '../assets/css/signin.css';

.mask{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color:rgba(16, 16, 16, .5);
  /* opacity: 0.5; *//*这个属性会被子元素继承*/
  z-index: 9;
}


</style>
