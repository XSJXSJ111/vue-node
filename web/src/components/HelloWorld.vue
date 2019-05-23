<template>
  <div class="view">
    <div class="logo-box">
      <label>用户名：</label>
      <input type="text" v-model="form.account">
      </br>
      <label>密码：</label>
      <input type="text" v-model="form.password">
      </br>
      <button @click="submit">注册</button>
    </div>
  </div>
</template>

<script lang="ts">
import api from '@/api/api'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;

  form: {
    account:string,
    password:string
  } = { account:'', password:'' }

  submit():void {
    let a = api.register(this.form)
  }
}
</script>

<style scoped lang="scss">
  .logo-box {
    width: 500px;
    padding: 20px;
    margin: 200px auto 0 auto;
    border: 1px solid #e1e1e1;
    border-radius: 20px;
    text-align: center;

    label {
      display: inline-block;
      width: 80px;
    }
    button {
      display: block;
      margin: 20px auto;
      background: #006cdc;
      border:none;
      outline: none;
      padding: 8px 30px;
      color: #fff;
      border-radius: 5px;
    }
  }
</style>
