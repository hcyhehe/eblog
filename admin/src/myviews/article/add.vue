<template>
  <div class="ipe">
    <el-form ref="form" label-width="100px">
      <el-form-item label="标题">
        <el-input v-model.trim="params.title" placeholder="请输入标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          class="upload-demo"
          :limit="limit"
          :action="upload"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
          :on-success="handleSuccess"
          :file-list="fileList"
          list-type="picture"
          multiple>
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章详情">
        <editor id="tinymce" v-model="params.content" :init="editorInit"></editor>
      </el-form-item>
      <el-form-item label="标签">
        <el-input v-model.trim="params.tags" placeholder="请输入标签，用逗号分隔" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item label="顺序">
        <el-input v-model.trim="params.sort" placeholder="请输入顺序" clearable></el-input>
      </el-form-item> -->

      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button type="info" icon="el-icon-back" @click="back">返回上一级</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import base from '@/js/global'
import { aGet, aPost } from '@/js/request'
import { judgeNum1, judgeNum2, judgeNum3, judgeNum4 } from '@/js/fun'
import moment from 'moment'

import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/plugins/uploadimage'
import 'tinymce/plugins/uploadvideo'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/code'

export default {
  components:{
    editor: Editor
  },
  data(){
    return {
      userInfo: {},
      params: {
        title: '',
        content: '',
        img: '',
        tags: '',
        sort: '',
      },
      upload: base.upload,
      fileList: [],
      limit: 1,

      editorInit: {
        language_url: './static/tinymce/zh_CN.js',
        language: 'zh_CN',
        skin_url: './static/tinymce/skins/lightgray',
        height: 400,
        plugins: ' uploadimage uploadvideo code colorpicker textcolor ',
        toolbar:
        'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist |'+ 
        ' outdent indent blockquote | undo redo | uploadimage uploadvideo | code removeformat',
        branding: false,
        upload_image_url: base.upload,
      },
    }
  },
  methods:{
    back(){
      this.$router.go(-1)
    },
    onSubmit(){
      let that = this
      this.params.detail = tinymce.editors[0].getContent();  //获取tinymce内容
      console.log('this.params', this.params)
      if(!this.params.title){
        return this.$message.warning('请填写标题')
      }
      // if(!this.params.img){
      //   return this.$message.warning('请上传图片')
      // }
      if(!this.params.content){
        return this.$message.warning('请填写文章详情')
      }
      if(!this.params.tags){
        return this.$message.warning('请填写标签')
      }
      // if(!judgeNum2(this.params.sort)){
      //   return this.$message.warning('顺序必须为正整数')
      // }
      aPost(base.artAdd, that.params).then(res=>{
        if(res.data.code==2000000){
          that.$message.success('提交成功')
          setTimeout(function(){
            that.$router.push({path:'/article/list'})
          }, 500)
        } else {
          that.$message.warning(res.data.msg)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    handleRemove(file, fileList){
      this.params.img = ''
    },
    handleExceed(file, fileList){
      this.$message.warning('最多只能上传1张图片')
    },
    handleSuccess(res, file, fileList){
      this.params.img = res.fileurl
    },
  },
  created(){
    this.userInfo = JSON.parse(localStorage.getItem('st_userinfo'))
  },
  mounted(){
    
  }
}
</script>

<style lang="scss">
.ipe{
  width: 1000px;
  padding: 30px 30px;
}
.ip-fanwei{
  display: flex;
  .ipf1{
    width: 140px;
  }
  .ipf2{
    margin-left: 10px;
    margin-right: 10px;
  }
}
</style>
