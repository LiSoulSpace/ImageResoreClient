<script setup lang="ts">
import { requestUrlStore } from "@/stores/requestUrl";
import { userInfoStore } from "@/stores/userInfo";
import { computed, ref, onMounted, type ComputedRef, type Ref, watch, reactive } from "vue";
import { requestHeaderStore } from "../stores/requestHeader";
import { ImageInfo, TagInfo } from "@/stores/currentImage"
import { ElMessage } from "element-plus";
import { fa } from "element-plus/es/locale";
const loginForm = ref({ username: "", password: "" });
const store = requestHeaderStore();
const userInfo = userInfoStore();
const requestUrls = requestUrlStore()

const requestOptions: RequestInit = {
  method: "POST",
  headers: store.getMyHeaders(),
  redirect: "follow",
};
const requestHeaders = requestHeaderStore();
onMounted(() => {
  initTableData()
  console.log("Login View : initTableImageData Over")
})

const fetchImageInfoByMd5 = (imgTemp: Ref<ImageInfo[]>, index: number) => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: requestHeaders.getMyHeaders(),
    redirect: "follow",
  };
  fetch(requestUrls.getImageInfoByMd5Url(imgTemp.value[index].md5), requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      const resultJson = JSON.parse(result);
      const imageInfo = resultJson["data"];
      const imageInfoJson = JSON.parse(imageInfo);
      parseImageInfo(imgTemp, index, imageInfoJson);
    })
    .catch((error) => {
      console.log("error", error);
      ElMessage({
        message: `图像信息获取失败\n${error}`,
        type: "error",
      });
    });
};

const parseImageInfo = (imgTemp: Ref<ImageInfo[]>, index: number, imageInfoJson: any) => {
  imgTemp.value[index].updateInfo(
    imageInfoJson["id"],
    imageInfoJson["imageName"],
    requestUrls.getImageSrcUrl(imageInfoJson["imagePath"]),
    imageInfoJson["imageType"],
    imageInfoJson["imageWidth"],
    imageInfoJson["imageHeight"]
  );
};

const login = () => {
  const row = JSON.stringify(loginForm.value);
  requestOptions.body = row;
  fetch(requestUrls.loginUrl(), requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const resultJson = JSON.parse(result);
      userInfo.login(resultJson)
      initTableData()
    })
    .catch((error) => console.log("error", error));
};

const tableImageData: Ref<ImageInfo[]> = ref([])
const tableTagData: Ref<TagInfo[]> = ref([])
const initTableData = () => {
  if (userInfo.isLogin) {
    fetchUserImageInfoCount()
    fetchUserImageInfos()
    fetchTagsUser()
  }
}
const currentPage: Ref<number> = ref(1);
const pageSize: Ref<number> = ref(10)
const imageTotalCount: Ref<number> = ref(10);
const dialogTagAddVisable: Ref<boolean> = ref<boolean>(false)
const tagAddForm: Ref<TagInfo> = ref<TagInfo>(new TagInfo(0, "", "", 1, 0, 0))

const fetchUserImageInfos = () => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: requestHeaders.getMyHeaders(),
    redirect: "follow",
  };
  fetch(requestUrls.getImageInfoPageByUserIdUrl(
    userInfo.userInfo.userId,
    currentPage.value,
    pageSize.value
  ), requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      const resultJson = JSON.parse(result);
      const imageInfos = resultJson["data"];
      const imageInfosJson = JSON.parse(imageInfos);
      parseUserImageInfo(imageInfosJson);
    })
    .catch((error) => {
      console.log("error", error);
      ElMessage({
        message: `图像信息获取失败\n${error}`,
        type: "error",
      });
    });
}

const fetchTagsUser = () => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: requestHeaders.getMyHeaders(),
    redirect: "follow",
  };
  fetch(requestUrls.getTagsByCreatorIdUrl(
    userInfo.userInfo.userId,
  ), requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      const resultJson = JSON.parse(result);
      const tagInfos = resultJson["data"];
      const tagInfosJson = JSON.parse(tagInfos);
      parseUserTagInfo(tagInfosJson)
    })
    .catch((error) => {
      console.log("error", error);
      ElMessage({
        message: `标签信息获取失败\n${error}`,
        type: "error",
      });
    });
}

const parseUserImageInfo = (imagesInfo: any) => {
  for (var i = tableImageData.value.length; i > 0; i--) {
    tableImageData.value.pop();
  }
  for (var i = 0; i < imagesInfo.length; i++) {
    const data = new ImageInfo(imagesInfo[i]["imageMd5"]);
    tableImageData.value.push(data);
    fetchImageInfoByMd5(tableImageData, i)
  }
}

const parseUserTagInfo = (tagInfo: any) => {
  for (var i = tableTagData.value.length; i > 0; i--) {
    tableTagData.value.pop()
  }
  for (var i = 0; i < tagInfo.length; i++) {
    const tagI = tagInfo[i];
    const data = new TagInfo(
      tagI["id"],
      tagI["tagName"],
      tagI["tagNameAlias"],
      tagI["isPublicTag"],
      tagI["isMainTag"],
      tagI["tagCreatorId"]
    )
    tableTagData.value.push(data);
  }
}

const fetchUserImageInfoCount = () => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: requestHeaders.getMyHeaders(),
    redirect: "follow",
  };
  fetch(
    requestUrls.getImageCountByUserIdUrl(userInfo.userInfo.userId),
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      const resultJson = JSON.parse(result);
      imageTotalCount.value = Number(resultJson['data'])
      console.log(imageTotalCount.value, imageTotalCount)
    })
    .catch((error) => console.log("error", error));

}

watch(currentPage, async (newPageSize, oldQuestion) => {
  fetchUserImageInfos();
  //TODO: 缺少图标页数的保存，可以在currentImage中间增加词条，也可以不管
  //currentImage.setCurrentPublicPage(currentPage.value)
});

const searchImage = ref('')
const filterImageData: ComputedRef<ImageInfo[]> = computed(() => {
  return tableImageData.value.filter(
    (data) =>
      !searchImage.value ||
      data.name.toLowerCase().includes(searchImage.value.toLowerCase())
  )
})
const handleImageEdit = (index: number, row: ImageInfo) => {
  console.log(index, row)
}
const handleImageDelete = (index: number, row: ImageInfo) => {
  console.log(index, row)
}
const handleTagEdit = (index: number, row: ImageInfo) => {
  console.log(index, row)
}
const handleTagDelete = (index: number, row: ImageInfo) => {
  console.log(index, row)
}
const confirmAddTag = () => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: requestHeaders.getMyHeaders(),
    redirect: "follow",
  };
  fetch(
    requestUrls.saveTagInfoUrl(
      tagAddForm.value.tagName,
      tagAddForm.value.tagNameAlias,
      tagAddForm.value.isPublicTag
    ),
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      const resultJson = JSON.parse(result);
      if (resultJson['code'] == 0) {
        console.log(resultJson)
      } else {
        ElMessage.error('标签添加失败')
      }
    })
    .catch((error) => {
      ElMessage.error('添加标签发生错误', error)
    });


  dialogTagAddVisable.value = false
}
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
            <template v-else>
              <el-text style="margin:auto;">欢迎您 {{ userInfo.userInfo.username }}</el-text>
            </template>
          </div>
        </div>

      </el-col>
      <el-col :span="6"></el-col>
    </el-row>
    <el-divider />
    <template v-if="userInfo.isLogin">
      <el-tabs type="border-card">
        <el-tab-pane label="个人图像信息">
          <el-row class="row-bg">
            <el-col :span="18"></el-col>
            <el-col :span="6">
              <el-pagination style="width:100%;margin:auto;" v-model:current-page="currentPage" :page-size="pageSize"
                background layout="prev, pager, next" :total="imageTotalCount" />
            </el-col>
          </el-row>
          <el-table :data="filterImageData" style="width: 100%">
            <el-table-column min-width="40px" label="图像id" prop="id" />
            <el-table-column label="图像名字" prop="name" />
            <el-table-column min-width="40px" label="宽度" prop="width" />
            <el-table-column min-width="40px" label="高度" prop="height" />
            <el-table-column label="描述" prop="description" />
            <el-table-column label="图像地址" prop="src" />
            <el-table-column label="md5" prop="md5" />
            <el-table-column align="right">
              <template #header>
                <el-input v-model="searchImage" size="small" placeholder="Type to search" />
              </template>
              <template #default="scope">
                <el-button size="small" @click="handleImageEdit(scope.$index, scope.row)">Edit</el-button>
                <el-button size="small" type="danger"
                  @click="handleImageDelete(scope.$index, scope.row)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="个人标签信息">
          <el-row class="row-bg">
            <el-col :span="18"></el-col>
            <el-col :span="6">
              <el-button @click="dialogTagAddVisable = true">添加标签</el-button>
            </el-col>
          </el-row>
          <el-table :data="tableTagData" style="width: 100%">
            <el-table-column min-width="40px" label="标签id" prop="id" />
            <el-table-column label="标签名字" prop="tagName" />
            <el-table-column label="标签别名" prop="tagNameAlias" />
            <el-table-column label="是否为公共标签" prop="isPublicTag" />
            <el-table-column label="是否为主要标签" prop="isMainTag" />
            <el-table-column align="right">
              <template #header>
                <el-input v-model="searchImage" size="small" placeholder="Type to search" />
              </template>
              <template #default="scope">
                <el-button size="small" @click="handleTagEdit(scope.$index, scope.row)">Edit</el-button>
                <el-button size="small" type="danger" @click="handleTagDelete(scope.$index, scope.row)">Delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- <el-tab-pane label="Role">Role</el-tab-pane> -->
      </el-tabs>
      <el-dialog v-model="dialogTagAddVisable" title="添加标签">
        <el-form :model="tagAddForm">
          <el-form-item label="标签名称" label-width="240px">
            <el-input v-model="tagAddForm.tagName" />
          </el-form-item>
          <el-form-item label="标签别名(用户搜索,逗号分割)" label-width="240px">
            <el-input v-model="tagAddForm.tagNameAlias" />
          </el-form-item>
          <el-form-item label="是否为公共标签" label-width="240px">
            <el-select v-model="tagAddForm.isPublicTag" placeholder="Please select a zone">
              <el-option label="是" value=1 />
              <el-option label="否" value=0 />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogTagAddVisable = false">取消</el-button>
            <el-button type="primary" @click="confirmAddTag">
              确认添加
            </el-button>
          </span>
        </template>
      </el-dialog>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.demo-radius .radius {
  border: 1px solid var(--el-border-color);
  border-radius: 0;

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
