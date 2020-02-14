<template>
  <div class="ipe">
    <el-form ref="form" label-width="100px">
      <el-form-item label="礼品名">
        <el-input v-model.trim="params.name" placeholder="请输入礼品名" clearable></el-input>
      </el-form-item>
      <el-form-item label="轮播图">
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
      <el-form-item label="礼品详情">
        <editor id="tinymce" v-model="params.detail" :init="editorInit"></editor>
      </el-form-item>
      <el-form-item label="积分">
        <el-input v-model.trim="params.score" placeholder="请输入所需积分" clearable></el-input>
      </el-form-item>
      <el-form-item label="原价">
        <el-input v-model.trim="params.ori_price" placeholder="请输入原价" clearable></el-input>
      </el-form-item>
      <el-form-item label="会员价">
        <el-input v-model.trim="params.price" placeholder="请输入会员价" clearable></el-input>
      </el-form-item>
      <el-form-item label="折扣">
        <el-input v-model.trim="params.discount" placeholder="请输入折扣" clearable></el-input>
      </el-form-item>
      <el-form-item label="划线价">
        <el-input v-model.trim="params.un_price" placeholder="请输入划线价" clearable></el-input>
      </el-form-item>
      <el-form-item label="运费">
        <el-input v-model.trim="params.fare" placeholder="请输入运费，为0则包邮" clearable></el-input>
      </el-form-item>
      <el-form-item label="规格">
        <el-input v-model.trim="params.sku" placeholder="请输入规格" clearable></el-input>
      </el-form-item>
      <el-form-item label="顺序">
        <el-input v-model.trim="params.sort" placeholder="请输入顺序" clearable></el-input>
      </el-form-item>

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
        shop_id: '',
        name: '',
        imgs: [],
        sku: '',
        detail: '',
        score: '',
        ori_price: '',
        price: '',
        discount: '',
        un_price: '',
        fare: '',
        sort: '',
      },
      pur: [
        { label:'否', value:1 },
        { label:'是', value:2 },
      ],
      upload: base.upload,
      fileList: [],
      limit: 5,

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
      if(!this.params.name){
        return this.$message.warning('请填写礼品名')
      }
      if(this.params.imgs.length==0){
        return this.$message.warning('请上传图片')
      }
      if(!this.params.detail){
        return this.$message.warning('请填写礼品详情')
      }
      if(!judgeNum2(this.params.score)){
        return this.$message.warning('所需积分必须为正整数')
      }
      if(!judgeNum1(this.params.ori_price)){
        return this.$message.warning('原价必须为非负整数')
      }
      if(!judgeNum1(this.params.price)){
        return this.$message.warning('会员价必须为非负整数')
      }
      if(!judgeNum4(this.params.discount, 1)){
        return this.$message.warning('折扣最多保留一位小数')
      }
      if(!judgeNum1(this.params.un_price)){
        return this.$message.warning('划线价必须为非负整数')
      }
      if(!judgeNum1(this.params.fare)){
        return this.$message.warning('运费必须为非负整数')
      }
      if(!this.params.sku){
        return this.$message.warning('请填写规格')
      }
      if(!judgeNum2(this.params.sort)){
        return this.$message.warning('顺序必须为正整数')
      }
      aPost(base.giftAdd, that.params).then(res=>{
        if(res.data.code==2000000){
          that.$message.success('提交成功')
          setTimeout(function(){
            that.$router.push({path:'/gift/list'})
          }, 500)
        } else {
          that.$message.warning(res.data.msg)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    handleRemove(file, fileList){
      let url = file.response.fileurl;
      for(let i=0;i<this.params.imgs.length;i++){
        if(this.params.imgs[i] == url){
          this.params.imgs.splice(i,1);
        }
      }
    },
    handleExceed(file, fileList){
      this.$message.warning('最多只能上传5张图片');
    },
    handleSuccess(res, file, fileList){
      this.params.imgs.push(res.fileurl);
    },
  },
  created(){
    this.userInfo = JSON.parse(localStorage.getItem('st_userinfo'))
    this.params.shop_id = this.userInfo.shop_id
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
