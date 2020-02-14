<template>
  <div class="ipe">
    <el-form ref="form" label-width="100px">
      <el-form-item label="奖励规则">
        <el-input type="textarea" rows="5" v-model.trim="content" placeholder="请输入奖励规则">
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import base from '@/js/global'
import { aGet, aPost } from '@/js/request'
import { judgeNum1 } from '@/js/fun'
import moment from 'moment'


export default {
  data(){
    return {
      userInfo: {},
      content: '',
    }
  },
  methods:{
    ruleInfo(){
      let that = this
      aGet(base.ruleInfo).then(res=>{
        if(res.data.code==2000000){
          that.content = res.data.data.content
        } else {
          that.$message.warning(res.data.msg)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    onSubmit(){
      let that = this
      if(!this.content){
        return this.$message.warning('请填写奖励规则')
      }
      aPost(base.ruleEdit, {content:this.content}).then(res=>{
        if(res.data.code==2000000){
          that.$message.success('编辑成功')
          that.ruleInfo()
        } else {
          that.$message.warning(res.data.msg)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    
  },
  created(){
    this.userInfo = JSON.parse(localStorage.getItem('st_userinfo'))
  },
  mounted(){
    this.ruleInfo()    
  }
}
</script>

<style lang="scss">
.ipe{
  width: 1000px;
  padding: 30px 30px;
}
</style>
