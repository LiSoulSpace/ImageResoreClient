<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { useRouter, useRoute } from "vue-router";
import { ElMessageBox } from "element-plus";
import { ref, onMounted } from "vue";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { userInfoStore } from "./stores/userInfo";

const userInfo = userInfoStore();
const isCollapse = ref(false);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const changHandle = () => {
  isCollapse.value = !isCollapse.value;
};
const router = useRouter();
const route = useRoute();

const checkIsLogin = () => {
  if (!userInfo.isLogin) {
    ElMessage({
      message: "您未登录，为您跳转登录页面",
      type: "warning",
    });
  }
  return userInfo.isLogin;
};

const routerTo = (pathT: string) => {
  router.push({ path: pathT });
  // if (pathT == "/imageshow") {
  //   if (checkIsLogin()) {
  //     router.push(pathT);
  //   } else {
  //     router.push("/login");
  //   }
  // } else {
  //   router.push({
  //     path: pathT,
  //   });
  // }
};
onMounted(() => {
  console.log(`the App is now mounted.`);
});

const drawer = ref(false);
const direction = ref("ltr");
const pageHeaderBack = () => {
  router.back()
};

const logout = () => {
  userInfo.logout()
  router.push("/login")
}
const redirectToLogin = () => {
  router.push({ path: '/login' });
}
</script>

<template>
  <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-page-header :icon="null" title="图像存储修复平台">
          <template #content>
            <el-button style="margin-left: 16px" @click="drawer = true">
              <el-icon>
                <Menu />
              </el-icon>
            </el-button>
          </template>
          <template #extra>
            <div class="flex">
              <el-avatar :size="32" class="mr-3" :src="userInfo.userInfo.avatar_image_path" />
              <span class="text-large font-600 mr-3">
                {{ userInfo.userInfo.username }}
              </span>
              <span class="text-sm mr-2" style="color: var(--el-text-color-regular)">
              </span>
              <!-- <span> <el-tag>Default</el-tag></span> -->
              <span class="flex items-center">
                <!-- <el-button @click="">Print</el-button> -->
                <template v-if="userInfo.isLogin">
                  <el-button type="primary" @click="logout">登出</el-button>
                </template>
                <template v-else>
                  <el-button type="primary" @click="redirectToLogin">登录</el-button>
                </template>
              </span>
            </div>
          </template>
        </el-page-header>
      </el-header>
      <el-container>
        <el-drawer v-model="drawer" title="导航栏" size="15%" :direction="direction">
          <el-menu default-active="1" class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen"
            @close="handleClose">
            <el-menu-item index="1" @click="routerTo('/')">
              <el-icon>
                <location />
              </el-icon>
              <template #title>
                <div to="/">公共图像预览</div>
              </template>
            </el-menu-item>
            <template v-if="userInfo.isLogin">
              <el-menu-item index="2" @click="routerTo('/imageshow')">
                <el-icon>
                  <setting />
                </el-icon>
                <template #title>
                  <div to="/imageshow">个人图像预览</div>
                </template>
              </el-menu-item>
            </template>
            <el-menu-item index="3" @click="routerTo('/login')">
              <el-icon>
                <User />
              </el-icon>
              <template #title>
                <template v-if="!userInfo.isLogin">
                  <div to="/login">登录</div>
                </template>
                <template v-else>
                  <div to="/login">个人信息</div>
                </template>
              </template>
            </el-menu-item>
            <el-menu-item index="4" @click="routerTo('/about')">
              <el-icon><icon-menu /></el-icon>
              <template #title>
                <div to="/about">关于</div>
              </template>
            </el-menu-item>
            <template v-if="userInfo.isAdmin">
              <el-menu-item index="5" @click="routerTo('/admin')">
                <el-icon><icon-menu /></el-icon>
                <template #title>
                  <div to="/admin">管理员界面</div>
                </template>
              </el-menu-item>
            </template>
          </el-menu>
        </el-drawer>
        <el-container>
          <el-main>
            <RouterView />
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
