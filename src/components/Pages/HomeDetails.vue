<template>
  <!-- 编辑-模态框 -->
  <div class="mask" id="details">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
  
        <!-- 模态框头部 -->
        <div class="modal-header">
          <h4 class="modal-title">用户信息</h4>
          <button type="button" class="close" @click="sendCloseSignal">&times;</button>
        </div>
  
        <!-- 模态框主体 -->
        <div class="modal-body">
          <div class="form-group">
            <label>
              用户名：
              <input class="form-control" type="text" placeholder="请输入新用户名" v-model="inputInfo.username" @keyup="showChkPwd">
            </label>
            <br />
            <label>
              密码：
              <input class="form-control" type="text" placeholder="请输入新密码" v-model="inputInfo.password" @keyup="showChkPwd">
            </label>
            <br />
            <label v-if="ifCheckedPasswordShow">
              确认密码：
              <input class="form-control" type="text" placeholder="请再次输入新密码" v-model="inputInfo.checkedPassword">
            </label>
          </div>
        </div>
  
        <!-- 模态框底部 -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="submitMethod">确认</button>
          <button type="button" class="btn btn-secondary" @click="sendCloseSignal">取消</button>
        </div>
  
      </div><!--modal content-->
    </div><!--modal dialog-->
  </div><!--mask-->

</template>


<script>
//导入事件触发器
import {Event} from '../../main.js'
import Qs from 'qs'
import axios from 'axios'

export default{
  props:[
    'type',       //模态框类型：add,checkEdit
    'userInfo',   //checkEdit情况下才有的被操作用户信息
    'allUsers',   //用户列表
    
  ],//props
  data:function(){
    return{
      ifCheckedPasswordShow:false,    //密码确认框开关
      inputInfo:{                     //输入信息
        username:'',
        password:'',
        checkedPassword:'',
      },
      originalInfo:null,              //checkEdit情况下才有的被操作用户信息
    }
  },//data
  mounted:function(){
    //初始化用户名密码
    if(this.type=='checkEdit'){
      this.inputInfo.username=this.userInfo.username;
      this.inputInfo.password=this.userInfo.password;
      this.originalInfo=this.userInfo;
    }
  },//mounted
  methods:{

    //显示确认密码框
    showChkPwd:function(){
      this.ifCheckedPasswordShow=true;
    },
    //隐藏确认密码框
    hideChkPwd:function(){
      this.ifCheckedPasswordShow=false;
    },
    //发送关闭模态框信号
    sendCloseSignal:function(){
      Event.$emit('hideModal');
    },
    /**
     * 检查用户名和密码
     * 参数为用户信息和确认密码框的输入值
     * 合格返回true，不合格返回false
     */
    checked:function(inputInfo,originalInfo=null){
      let that=this;
      //check-1 username!='' 且 没有被占用
      if(!inputInfo.username){//检查用户名是否存在
        alert("用户名不能为空！");
        return false;
      }
      else if(!originalInfo || inputInfo.username!=originalInfo.username){//检查用户名和原来的用户名是否相同
        if(this.allUsers.some(function(item){
          return inputInfo.username==item.username;
        })){
          alert("用户名已被占用，请换一个！");
          return false;
        }
      }//剩下一种和原来用户名相同的情况不需排除
      //check-2 password是否一致
      if(inputInfo.password!=inputInfo.checkedPassword){
        alert("密码不一致，请修改一致后再提交！");
        return false;
      }
      console.log("用户名和密码检查完毕！");
      return true;
    },//checked
    /**
     * 发送用户信息
     */
    sendUserInfo:function(url,data,responseMethod){
      axios.post(url,data)
      .then(function(response){
        console.log(response);
        responseMethod(response);
      })
      .catch(function(err){
        console.log(err);
      });
    },//sendUserInfo
    /**
     * 添加和修改 响应处理函数
     */
    responseMethodForAddAndModify:function(response){
      if(response.data==true){
        Event.$emit('successForAddOrModify');
      }
      else{
        Event.$emit('failureForAddOrModify');
      }
    },//responseMethod
    /**
     * 表单提交：检查、发送、响应处理
     */
    submitMethod:function(){
      if(confirm("您确定提交当前信息吗？")){
        let that=this;
        switch(this.type){
          case 'add'://添加用户
            //格式化数据
            let data1=Qs.stringify({
              username:that.inputInfo.username,
              password:that.inputInfo.password,
            });
            //检查输入信息
            if(this.checked(this.inputInfo)){
              //发送请求
              this.sendUserInfo('/useradd',data1,this.responseMethodForAddAndModify)
            }
            break;
          case 'checkEdit'://修改用户信息
            //格式化数据
            let data2=Qs.stringify({
              id:that.originalInfo.id,
              username:that.inputInfo.username,
              password:that.inputInfo.password,
            });
            //检查输入信息
            if(this.checked(this.inputInfo,this.originalInfo)){
              this.sendUserInfo('/userupdate',data2,this.responseMethodForAddAndModify);
            }
            break;
        }//switch
      }//if(confirm)
    },//submitMethod

  },//methods
}
</script>

<style scoped>
@import '../../assets/css/bootstrap4.0.min.css';

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
