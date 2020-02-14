<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="请输入用户昵称" v-model.trim="params.nickname" style="width: 250px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <!-- <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="set">积分充值设置</el-button> -->
    </div>

    <el-table v-loading="listLoading" :key="tableKey" :data="list" 
    :default-sort = "{prop: 'level_time', order: 'descending'}"
    border fit stripe highlight-current-row style="width: 100%;">
      <el-table-column label="会员卡编号" align="center" width="125">
        <template slot-scope="scope">
          <span>{{ scope.row.card_no}}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员卡名称" align="center" width="">
        <template slot-scope="scope">
          <span>{{ scope.row.vipName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="" align="center">
        <template slot-scope="scope">
          <img class="aImg" :src="scope.row.avatar">
        </template>
      </el-table-column>
      <el-table-column label="业主姓名" align="center" width="">
        <template slot-scope="scope">
          <span>{{ scope.row.name || '未认证' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.idcard || '未认证' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="积分" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.recharge_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="level_time" label="购买时间" width="" align="center" sortable>
        <!--<template slot-scope="scope">
          <span>{{ scope.row.level_time | t }}</span>
        </template> -->
      </el-table-column>
      <el-table-column v-if="userInfo.token=='admin'" width="180" label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row.openid, scope.row.name, scope.row.idcard)">编辑</el-button>  
          <el-button type="primary" class="xixi" size="mini" @click="recharge(scope.row.openid)">积分充值</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="params.pages" :limit.sync="params.limit" @pagination="getList" />

    <el-dialog
      title="编辑"
      :visible.sync="dialogVisible2"
      width="40%">
      <el-form ref="form" label-width="90px">
        <el-form-item label="业主姓名">
          <el-input v-model="params2.name"></el-input>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="params2.idcard"></el-input>
        </el-form-item>
        <!-- <el-form-item label="手机">
          <el-input v-model="params2.phone"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="editSave">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' //波纹效果
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import base from '@/js/global'
import { judgeNum2, judgeNum3 } from '@/js/fun'
import { aGet, aPost } from '@/js/request'
import moment from 'moment'

export default {
  name: 'userList',
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
        id: '',
        shop_id: '',
        pages: 1,
        limit: 10,
        nickname: '',
      },
      money: '',
      dialogVisible2: false,
      params2:{
        openid: '',
        name: '',
        idcard: '',
      },
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
      aGet(base.userList2, this.params).then(res=>{
        console.log('userList2', res.data)
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

    edit(openid, name, idcard){
      console.log(openid, name, idcard)
      this.params2.openid = openid
      this.params2.name = name
      this.params2.idcard = idcard
      this.dialogVisible2 = true
    },

    editSave(){
      let that = this
      if(!this.params2.name){
        return this.$message.warning('请填写业主姓名')
      }
      if(!this.params2.idcard){
        return this.$message.warning('请填写身份证')
      }
      aPost(base.userEdit2, this.params2).then(res=>{
        that.$message.success('编辑成功')
        that.getList()
        that.dialogVisible2 = false
      }).catch(err=>{
        that.$message.warning('编辑失败')
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
    this.params.id = this.$route.path.split('/').pop()
  },
  mounted(){
    this.getList()    
  }
}
</script>

<style lang="scss">
.aImg{
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.xixi{
  width: 82px !important;
}
</style>
