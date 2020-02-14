<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="请输入礼品名称" v-model.trim="params.name" style="width: 250px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="addPage">添加</el-button>
    </div>

    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit stripe highlight-current-row style="width: 100%;">
      <el-table-column label="顺序" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="礼品名" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="" align="center">
        <template slot-scope="scope">
          <img class="goodsListImg" :src="scope.row.imgs.split(',')[0]">
        </template>
      </el-table-column>
      <el-table-column label="积分" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原价" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ori_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员价" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.discount || '无' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下划线价" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.un_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运费" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fare }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | t }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editPage(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="mini" @click="rmPage(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="params.pages" :limit.sync="params.limit" @pagination="getList" />
  </div>
</template>

<script>
import waves from '@/directive/waves' //波纹效果
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import base from '@/js/global'
import { aGet, aPost } from '@/js/request'
import moment from 'moment'

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    t(str){
      return moment(str).format('YYYY-MM-DD HH:mm:ss');
    },
    type(int){
      if(int==1) return '否'
      if(int==2) return '是'
    },
  },
  data(){
    return {
      userInfo: {},
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      params: {
        pages: 1,
        limit: 10,
        name: '',
      },
    }
  },
  methods:{
    search(){
      this.params.pages = 1;
      this.getList();
    },
    addPage(){
      this.$router.push({path:'/gift/add'})
    },
    getList(){
      let that = this;
      this.params.shop_id = this.userInfo.shop_id
      aGet(base.giftList, this.params).then(res=>{
        //console.log('goodsList', res.data);
        that.list = res.data.data;
        that.total = res.data.count;
        that.listLoading = false;
      }).catch(err=>{
        that.listLoading = false;
        console.log(err);
      })
    },
    editPage(id){
      this.$router.push({path:'/gift/edit', query:{id:id} })
    },
    rmPage(id){
      let that = this;
      that.$confirm('此操作将删除该礼品, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        aPost(base.giftDel, {id:id}).then(res=>{
          if(res.data.code==2000000){
            that.$message.success('操作成功');
            that.getList();
          } else {
            that.$message.warning(res.data.msg);
          }
        }).catch(err=>{
          console.log(err);
        })
      }).catch(err=>{
        console.log(err);
      })
    }
  },
  created(){
    this.userInfo = JSON.parse(localStorage.getItem('st_userinfo'))
    console.log('this.userInfo', this.userInfo)
  },
  mounted(){
    this.getList()
  }
}
</script>

<style lang="scss">
.goodsListImg{
  width: 80px;
  height: 45px;
}
</style>
