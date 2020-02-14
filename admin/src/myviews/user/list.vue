<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select class="filter-item" v-model="params.type" placeholder="请选择用户类型">      
          <el-option label="全部" value=""></el-option>
          <el-option label="前端购买会员卡" value="1"></el-option>
          <el-option label="普通会员" value="2"></el-option>
        </el-select>
      <el-input placeholder="请输入用户昵称" v-model.trim="params.nickname" style="width: 250px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="Export">导入楼盘excel</el-button>
      <el-popover
        class="filter-item tips"
        placement="top-start"
        title="excel要求"
        width="200"
        trigger="hover"
        content="excel字段先后顺序必须为：楼盘名, 地址, 所在城市, 业主名, 身份证号, 手机号">
        <el-button slot="reference"><i class="el-icon-question"></i></el-button>
      </el-popover>
    </div>
    <input type="file" id="file" @change="choose($event)" style="display:none;">


    <!-- <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit stripe highlight-current-row style="width: 100%;">
      <el-table-column label="业主姓名" align="center" width="">
        <template slot-scope="scope">
          <span>{{ scope.row.name || '未认证' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="" align="center">
        <template slot-scope="scope">
          <img class="aImg" :src="scope.row.avatar">
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone | p }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.gender | g }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="积分" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.recharge_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | t }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="userInfo.token=='admin'" width="120" label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" class="xixi" size="mini" @click="recharge(scope.row.openid)">积分充值</el-button>
        </template>
      </el-table-column>
    </el-table> -->

    <div class="tHead">
      <div class="cell0">序号</div>
      <div class="cell">房产</div>
      <div class="cell">来源</div>
      <div class="cell">昵称</div>
      <div class="cell">头像</div>
      <div class="cell">姓名</div>
      <div class="cell">身份证</div>
      <div class="cell">手机号</div>
      <div class="cell">积分</div>
      <div class="cell">注册时间</div>
      <div class="cell">操作</div>
    </div>

    <div class="tBody" v-for="(obj,index) in list" :key="index">
      <div class="lt lt0">
        <table class="build" cellpadding="0" cellspacing="0">
          <tr><td>{{index+1}}</td></tr>
        </table>
      </div>
      <div class="lt" v-if="obj.build.length>0">
        <table class="build" cellpadding="0" cellspacing="0">
          <tr v-for="(obj2,index2) in obj.build" :key="index2"><td>{{obj2.name}}</td></tr>
        </table>
      </div>
      <div class="lt" v-if="obj.build.length==0">
        <table class="build" cellpadding="0" cellspacing="0">
          <tr><td>未购买</td></tr>
        </table>
      </div>
      <div class="lt" v-if="obj.types.length>0">
        <table class="build" cellpadding="0" cellspacing="0">
          <tr v-for="(obj2,index2) in obj.types" :key="index2"><td>{{obj2.type}}</td></tr>
        </table>
      </div>
      <div class="lt" v-if="obj.types.length==0">
        <table class="build" cellpadding="0" cellspacing="0">
          <tr><td>无</td></tr>
        </table>
      </div>

      <div class="lt2">
        <div class="one">{{obj.nickname}}</div>
      </div>

      <div class="lt2">
        <div class="one">
          <img class="aImg" :src="obj.avatar">
        </div>
      </div>

      <div class="lt2">
        <div class="one">{{obj.name || '未认证'}}</div>
      </div>

      <div class="lt2">
        <div class="one">{{obj.idcard || '未认证'}}</div>
      </div>

      <div class="lt2">
        <div class="one">{{obj.phone || '未授权'}}</div>
      </div>

      <div class="lt2">
        <div class="one">{{obj.recharge_amount}}</div>
      </div>

      <div class="lt2">
        <div class="one">{{obj.create_time | t}}</div>
      </div>

      <div class="lt2">
        <div class="one">
          <el-button type="primary" class="xixi" size="mini" @click="recharge(obj.openid)">积分充值</el-button>
        </div>
      </div>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="params.pages" :limit.sync="params.limit" @pagination="getList" />
  </div>
</template>

<script>
import waves from '@/directive/waves' //波纹效果
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import base from '@/js/global'
import { judgeNum2, judgeNum3 } from '@/js/fun'
import { aGet, aPost, upImg } from '@/js/request'
import moment from 'moment'
import $ from 'jquery'

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    t(str){
      return moment(str).format('YYYY-MM-DD HH:mm:ss');
    },
    g(int){
      if(int==1){
        return '男'
      } else {
        return '女'
      }
    },
    p(str){
      if(str){
        return str
      } else {
        return '未授权'
      }
    }
  },
  data(){
    return {
      userInfo: {},
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      params: {
        type: '',
        shop_id: '',
        pages: 1,
        limit: 10,
        nickname: '',
      },
      money: '',
    }
  },
  methods:{
    add(){
      this.$router.push({path:'/user/add'})
    },
    search(){
      this.params.pages = 1;
      this.getList();
    },
    getList(){
      let that = this;
      aGet(base.userList, this.params).then(res=>{
        console.log('userList', res.data)
        that.list = res.data.data;
        that.total = res.data.count;
        that.listLoading = false;
      }).catch(err=>{
        that.listLoading = false;
        console.log(err);
      })
    },

    recharge(openid){
      let that = this
      this.$prompt('请输入充值的积分', '积分充值', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if(!judgeNum2(value)){
          return that.$message.warning('请输入正确的数值')
        }
        aPost(base.userRecharge, {openid:openid, amount:0, point:value, type:2}).then(res=>{
          console.log('userRecharge', res.data)
          if(res.data.code==2000000){
            that.$message.success('充值成功')
            that.getList()
          } else {
            that.$message.warning('充值失败')
          }
        }).catch(err=>{
          console.log(err)
        })
      }).catch(() => {})
    },

    Export(){
      $('#file').click()
    },
    choose(e){
      let that = this
      let file = e.target.files[0]
      console.log('file', file)
      upImg(base.upload, 'build', file).then(res=>{
        console.log('upload', res.data)
        if(res.data.resultCode==0){
          let fileurl = res.data.fileurl.split('upload')[1]
          aPost(base.bParseXlsx, {url:fileurl}).then(res2=>{
            console.log('bParseXlsx', res2.data)
            if(res2.data.code==2000000){
              that.getList()
            } else {
              that.$message.warning('解析出错')
            }
          }).catch(err=>{
            console.log(err)
          })
        } else {
          that.$message.warning('上传出错')
        }
      }).catch(err=>{
        console.log(err)
      })
    },

    // set(){
    //   let that = this
    //   this.$prompt('请输入1积分对应赠送的优惠券数量', '积分充值设置', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消'
    //   }).then(({ value }) => {
    //     if(!judgeNum2(value)){
    //       return that.$message.warning('请输入正确的数值')
    //     }
    //     aPost(base.setScore, {num:value}).then(res=>{
    //       console.log('userRecharge', res.data)
    //       if(res.data.code==2000000){
    //         that.$message.success('设置成功')
    //         //that.getList()
    //       } else {
    //         that.$message.warning('设置失败')
    //       }
    //     }).catch(err=>{
    //       console.log(err)
    //     })
    //   }).catch(() => {})
    // },

    // getMoney(){
    //   let that = this
    //   aGet(base.getMoney).then(res=>{
    //     console.log('getMoney', res.data)
    //     if(res.data.data){
    //       that.money = res.data.data.equal
    //     } else {
    //       that.money = 1
    //     }
    //   }).catch(err=>{
    //     console.log(err)
    //   })
    // },
  },

  created(){
    this.userInfo = JSON.parse(localStorage.getItem('st_userinfo'));
  },
  mounted(){
    this.getList()
  }
}
</script>

<style lang="scss">
.xixi{
  width: 82px !important;
}
.tips{
  button{
    border: 0;
    color: #999;
  }
  i{
    font-size: 22px;
  }
}
.tHead{
  width: 100%;
  display: flex;
  .cell{
    flex: 1;
    height: 44px;
    line-height: 44px;
    text-align: center;
    color: #909399;
    border: 1px solid #ebeef5;
    font-weight: 600;
    font-size: 14px;
  }
  .cell0{
    width: 4.8% !important;
    height: 44px;
    line-height: 44px;
    text-align: center;
    color: #909399;
    border: 1px solid #ebeef5;
    font-weight: 600;
    font-size: 14px;
  }
}
.tBody{
  width: 100%;
  display: flex;
  .lt2{
    position: relative;
    width: 10%;
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    text-align: center;
    min-height: 88px;
    .one{
      position: absolute;
      width: 100%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      text-align: center;
      color: #606266;
      white-space:normal;
      word-break:break-all;
      padding-left: 4px;
      padding-right: 4px;
      .aImg{
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
    }
  }
  .lt0{
    width: 5% !important;
  }
  .lt{
    width: 10%;
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    text-align: center;
    color: #606266;
    font-size: 14px;
    .build{
      color: #606266;
      height: 100%;
      width: 100%;
      td{
        border-bottom: 1px solid #ebeef5;
        overflow: hidden;
        height: 35px;
        padding-left: 4px;
        padding-right: 4px;
      }
    }
  }
  .rt{
    width: 80%;
    .line{
      display: flex;
      .one{
        flex: 1;
        height: 44px;
        line-height: 44px;
        text-align: center;
        color: #606266;
        border-left: 1px solid #ebeef5;
        border-right: 1px solid #ebeef5;
        border-bottom: 1px solid #ebeef5;
        font-size: 14px;
      }
    }
  }
}
</style>
