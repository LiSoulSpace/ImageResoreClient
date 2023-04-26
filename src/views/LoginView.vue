<script setup lang="ts">
import { requestUrlStore } from "@/stores/requestUrl";
import { userInfoStore } from "@/stores/userInfo";
import { ref } from "vue";
import { requestHeaderStore } from "../stores/requestHeader";
const loginForm = ref({ username: "", password: "" });
const store = requestHeaderStore();
const userInfo = userInfoStore();
const requestUrls = requestUrlStore()

var requestOptions: RequestInit = {
  method: "POST",
  headers: store.getMyHeaders(),
  redirect: "follow",
};

const login = () => {
  const row = JSON.stringify(loginForm.value);
  requestOptions.body = row;
  fetch(requestUrls.loginUrl(), requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const resultJson = JSON.parse(result);
      userInfo.login(resultJson)
    })
    .catch((error) => console.log("error", error));
};
</script>

<template>
  <div style="margin-top: 5%;">
    <el-row class="row-bg">
      <el-col :span="6"></el-col>
      <el-col :span="12" class="demo-radius">
        <div class="radius" :style="{
            borderRadius: `var(--el-border-radius-round)`,
          }">
          <div style="align-items: center; display:flex">
            <template v-if="!userInfo.isLogin">
              <el-form class="self-login-form">
                <el-form-item>
                  <el-text class="text">系统登录</el-text>
                  <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号"></el-input>
                  <br />
                </el-form-item>
                <el-form-item>
                  <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"></el-input>
                </el-form-item>
                <br />
                <el-form-item>
                  <el-button class="button" type="primary" v-on:click="login">登 陆</el-button>
                </el-form-item>
              </el-form>
            </template>
            <el-text v-else style="margin-left: 50%;">欢迎您 {{ userInfo.userInfo.username }}</el-text>
          </div>
        </div>
      </el-col>
      <el-col :span="6"></el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.demo-radius .radius {
  border: 1px solid var(--el-border-color);
  border-radius: 0;
  margin-top: 20px;
}

.self-login-form {
  width: 100%;
  margin-left: 10%;
  margin-right: 10%;
}

.self-login-form .text {
  width: 60px;
  height: 40px;
  margin: auto;
}

.self-login-form .button {
  width: 60px;
  margin: auto;
}
</style>
