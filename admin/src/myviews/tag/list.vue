<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="add">新增</el-button>
      <!-- <el-button v-waves class="filter-item" type="primary" icon="" @click="showSet">积分充值设置</el-button> -->
    </div>

    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit stripe highlight-current-row style="width: 100%;">
      <el-table-column label="排序" align="center" width="">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="userInfo.token=='admin'" width="230" label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" class="xixi" size="mini" @click="edit(scope.row.id, scope.row.name, scope.row.sort)">
            编辑</el-button>
          <el-button type="danger" class="xixi" size="mini" @click="del(scope.row.id)">删除</el-button>          
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form ref="form" label-width="50px">
        <el-form-item label="标签">
          <el-input v-model="params2.name"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="params2.sort"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSave">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑"
      :visible.sync="dialogVisible2"
      width="40%">
      <el-form ref="form" label-width="50px">
        <el-form-item label="分类">
          <el-input v-model="params2.name"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="params2.sort"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="editSave">确 定</el-button>
      </span>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="params.pages" :limit.sync="params.limit" @pagination="getList" />
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
  components: { Pagination },
  directives: { waves },
  filters: {
    t(str){
      return moment(str).format('YYYY-MM-DD HH:mm:ss')
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
        pages: 1,
        limit: 10,
      },
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      params2:{
        id: '',
        name: '',
        sort: '',
      },
    }
  },
  methods:{
    add(){
      this.params2.name = ''
      this.params2.sort = ''
      this.dialogVisible = true
    },
    addSave(){      
      let that = this
      if(!this.params2.name){
        return this.$message.warning('分类不能为空')
      }
      if(!judgeNum2(this.params2.sort)){
        return this.$message.warning('排序必须为正整数')
      }
      aPost(base.tagAdd, this.params2).then(res=>{
        console.log('tagAdd', res.data)
        if(res.data.code==2000000){
          that.$message.success('添加成功')
          that.getList()
          that.dialogVisible = false
        } else {
          that.$message.warning('添加失败')
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    search(){
      this.params.pages = 1
      this.getList()
    },
    getList(){
      let that = this
      aGet(base.tagList, this.params).then(res=>{
        console.log('tagList', res.data)
        that.list = res.data.data;
        that.total = res.data.count;
        that.listLoading = false;
      }).catch(err=>{
        that.listLoading = false;
        console.log(err);
      })
    },
    edit(id, name, sort){
      let that = this      
      this.params2.id = id
      this.params2.name = name
      this.params2.sort = sort
      this.dialogVisible2 = true
    },
    editSave(){
      let that = this
      if(!this.params2.name){
        return this.$message.warning('分类不能为空')
      }
      if(!judgeNum2(this.params2.sort)){
        return this.$message.warning('排序必须为正整数')
      }
      aPost(base.tagEdit, this.params2).then(res=>{
        console.log('tagEdit', res.data)
        if(res.data.code==2000000){
          that.$message.success('编辑成功')
          that.getList()
          that.dialogVisible2 = false
        } else {
          that.$message.warning('编辑失败')
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    del(id){
      let that = this
      that.$confirm('此操作将删除该分类, 是否继续?', '提示', { 
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' 
      }).then(() => {
        aPost(base.tagDel, {id:id}).then(res=>{
          if(res.data.code==2000000){
            that.$message.success('操作成功')
            that.getList()
          } else {
            that.$message.warning(res.data.msg);
          }
        }).catch(err=>{
          console.log(err);
        })
      }).catch(err=>{
        console.log(err);
      })
    },

    // showSet(){
    //   let that = this
    //   aGet(base.getMoney).then(res=>{
    //     console.log('getMoney', res.data)
    //     if(res.data.data){
    //       that.money = res.data.data.equal
    //     }
    //     that.dialogVisible3 = true
    //   }).catch(err=>{
    //     console.log(err)
    //   })
    // },

    // set(){
    //   let that = this
    //   if(!judgeNum2(that.money)){
    //     return that.$message.warning('请输入正确的数值')
    //   }
    //   aPost(base.setMoney, {equal:that.money}).then(res=>{
    //     console.log('setMoney', res.data)
    //     if(res.data.code==2000000){
    //       that.$message.success('设置成功')          
    //       that.dialogVisible3 = false
    //     } else {
    //       that.$message.warning('设置失败')
    //     }
    //   }).catch(err=>{
    //     console.log(err)
    //   })
    // },
  },

  created(){
    this.userInfo = JSON.parse(localStorage.getItem('st_userinfo'))
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
