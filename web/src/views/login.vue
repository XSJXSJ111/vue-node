<template>
  <div class="view">
    <Card dis-hover class="login-box">
      <div slot="title" class="flex align-center">
        <Icon type="ios-contacts" style="margin-right:5px;"/>
        {{loginType == 'login' ? '登录' : '注册'}}
      </div>
      <a slot="extra" @click.prevent="loginType == 'login' ? loginType = 'register' : loginType = 'login'">
        <Icon type="ios-repeat" />
        切换
      </a>
      
      <Form ref="loginForm" :model="form" :rules="formRule" :label-width="80">
        <FormItem label="账号" prop="account">
          <Input v-model="form.account" placeholder="请输入账号"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="form.password" placeholder="请输入密码"></Input>
        </FormItem>

        <FormItem>
          <Button type="primary" @click="handleSubmit" :loading="btnLoad">提交</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script lang="ts">
import api from '@/api/api'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'

@Component
export default class Login extends Vue {
  @State(state => state.btnLoad) btnLoad:any //按钮状态
  @Mutation('setBtnLoad') setBtnLoad:any
  private loginType:string = 'login'

  //表单校验
  private formRule:object = {
    account: [
      { required: true, message: '账号必填', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '密码必填', trigger: 'blur' }
    ]
  }

  private form: {
    account:string,
    password:string
  } = { account:'', password:'' }

  public $refs!: {
    loginForm: HTMLFormElement
  }

  handleSubmit():void {
    this.setBtnLoad(true)
    this.$refs.loginForm.validate(async (valid:any) => {
      if (valid) {
        if(this.loginType == 'login') {
          let login = await api.login(this.form)
          Vue.ls.set('token', login.data.token)
        } else {
          let register = await api.register(this.form)
        }

        this.$Message.success('登录成功！')
        // this.$router.replace({
        //   name:'home'
        // })
      } else {
        this.$Message.error('表单验证错误！')
        this.setBtnLoad(false)
      }
    })
  }
}
</script>

<style scoped lang="scss">
  .view {
    height: 100vh;
    background: #f8f8f9;
    padding: 200px 0 50px 0;

    .login-box {
      width: 500px;
      margin: auto;
    }
  }
</style>
