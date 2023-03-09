<script setup lang="ts">
import { userInfoStore } from "@/stores/userInfo";
import { ref } from "vue";
import { requestHeaderStore } from "../stores/requestHeader";
const loginForm = ref({ username: "", password: "" });
const store = requestHeaderStore();
const userInfo = userInfoStore();

var requestOptions: RequestInit = {
  method: "POST",
  headers: store.getMyHeaders(),
  redirect: "follow",
};

const login = () => {
  const row = JSON.stringify(loginForm.value);
  requestOptions.body = row;
  fetch("http://localhost:8080/user/login", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const resultJson = JSON.parse(result);
      userInfo.login(resultJson)
    })
    .catch((error) => console.log("error", error));
};
</script>

<template>
  <div v-if="!userInfo.isLogin">
    <el-form class="login-container" label-position="right">
      <el-form-item>
        <h3 class="login_title">系统登录</h3>
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
        ></el-input>
        <br />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <br />
      <el-form-item>
        <el-button type="primary" v-on:click="login">登 陆</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div v-if="userInfo.isLogin">欢迎您 {{ userInfo.userInfo.username }}</div>
</template>
