<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, type Ref } from "vue";
import { currentImageStore, ImageInfo, TagInfo } from "@/stores/currentImage";
import { requestUrlStore } from "@/stores/requestUrl";
import { requestHeaderStore } from "@/stores/requestHeader";
import { ElMessage } from "element-plus";
import { userInfoStore } from "@/stores/userInfo";
const route = useRoute();
const imagemd5 = String(route.params.imagemd5);
const restoreType = String(route.params.type)
const currentImage = currentImageStore();
const requestUrls = requestUrlStore();
const requestHeaders = requestHeaderStore();
const userInfos = userInfoStore();
const pageImage: Ref<ImageInfo> = ref<ImageInfo>(new ImageInfo(""));
const restoreImage: Ref<ImageInfo[]> = ref<ImageInfo[]>([])
const isKeepImage: Ref<boolean> = ref<boolean>(false);
const tags: Ref<TagInfo[]> = ref<TagInfo[]>([]);
const publicTagList: Ref<TagInfo[]> = ref<TagInfo[]>([]);
const tagIdToAdd: Ref<number> = ref<number>(0);

onMounted(() => {
  console.log(`ImageInfo : md5:[${imagemd5}]`);
  pageImage.value.md5 = imagemd5;
  fetchImageInfoByMd5(imagemd5);
  fetchImgUserRelation();
});

const parseImageInfo = (imageInfoJson: any) => {
  pageImage.value.updateInfo(
    imageInfoJson["id"],
    imageInfoJson["imageName"],
    requestUrls.getImageSrcUrl(imageInfoJson["imagePath"]),
    imageInfoJson["imageType"],
    imageInfoJson["imageWidth"],
    imageInfoJson["imageHeight"]
  );
};
const parseRestoreInfo = (imageInfoJson: any, index: number) => {
  restoreImage.value[index].updateInfo(
    imageInfoJson["id"],
    imageInfoJson["imageName"],
    requestUrls.getImageSrcUrl(imageInfoJson["imagePath"]),
    imageInfoJson["imageType"],
    imageInfoJson["imageWidth"],
    imageInfoJson["imageHeight"]
  );
};

const fetchImgUserRelation = () => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: requestHeaders.getMyHeaders(),
    redirect: "follow",
  };
  fetch(
    requestUrls.checkImgUserRelaUrl(
      pageImage.value.md5,
      userInfos.userInfo.userId
    ),
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      const resultJson = JSON.parse(result);
      const imageInfo = resultJson["data"];
      const imageInfoJson = JSON.parse(imageInfo);
      if (imageInfoJson["isExist"] === 1) {
        isKeepImage.value = true;
      }
    })
    .catch((error) => {
      console.log("error", error);
      ElMessage({
        message: `图像信息获取失败\n${error}`,
        type: "error",
      });
    });
};


const fetchImageInfoByMd5 = (md5: string) => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: requestHeaders.getMyHeaders(),
    redirect: "follow",
  };
  fetch(requestUrls.getImageInfoByMd5Url(md5), requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      const resultJson = JSON.parse(result);
      const imageInfo = resultJson["data"];
      const imageInfoJson = JSON.parse(imageInfo);
      pageImage.value.md5 = md5;
      parseImageInfo(imageInfoJson);
      //TODO 
      getImageRestoreInfo();
    })
    .catch((error) => {
      console.log("error", error);
      ElMessage({
        message: `图像信息获取失败\n${error}`,
        type: "error",
      });
    });
};

const fetchRestoreInfoById = (imageId: number, index:number) => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: requestHeaders.getMyHeaders(),
    redirect: "follow",
  };
  fetch(requestUrls.getImgInfoByIdUrl(imageId), requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      const resultJson = JSON.parse(result);
      const imageInfo = resultJson["data"];
      const imageInfoJson = JSON.parse(imageInfo);
      restoreImage.value[index].md5 = imageInfoJson['imageMd5']
      parseRestoreInfo(imageInfoJson, index);
    })
    .catch((error) => {
      console.log("error", error);
      ElMessage({
        message: `图像信息获取失败\n${error}`,
        type: "error",
      });
    });
}

const fetchKeepImage = (isSet: number) => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: requestHeaders.getMyHeaders(),
    redirect: "follow",
  };
  fetch(
    requestUrls.setImgUserRelaUrl(
      pageImage.value.md5,
      userInfos.userInfo.userId,
      isSet
    ),
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      const resultJson = JSON.parse(result);
      const imageInfo = resultJson["data"];
      const imageInfoJson = JSON.parse(imageInfo);
    })
    .catch((error) => {
      console.log("error", error);
      ElMessage({
        message: `图像信息获取失败\n${error}`,
        type: "error",
      });
    });
};

const keepImage = () => {
  //TODO: 收藏图像接口
  fetchKeepImage(1);
  isKeepImage.value = true;
};

const removeKeep = () => {
  fetchKeepImage(0);
  isKeepImage.value = false;
};

const getImageRestoreInfo = () => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: requestHeaders.getMyHeaders(),
    redirect: "follow",
  };
  if (restoreType == 'deblur') {
    fetch(requestUrls.getImgDeblurByIdUrl(pageImage.value.id), requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const resultJson = JSON.parse(result);
        console.log(resultJson)
        const resultDataJson = JSON.parse(resultJson["data"])
        console.log("resultDataJson:", resultDataJson)
        for (var i = 0; i < resultDataJson.length; i++) {
          console.log(resultDataJson[i])
          restoreImage.value.push(new ImageInfo(""))
          restoreImage.value[i].id = resultDataJson[i]['restoreImageId']
          fetchRestoreInfoById(resultDataJson[i]['restoreImageId'], i)
        }
      })
      .catch((error) => console.log("error", error));
  } else if (restoreType == 'colorize') {
    fetch(requestUrls.getImgColorizeByIdUrl(pageImage.value.id), requestOptions)
    .then((response) => response.text())
      .then((result) => {
        const resultJson = JSON.parse(result);
        console.log(resultJson)
        const resultDataJson = JSON.parse(resultJson["data"])
        console.log("resultDataJson:", resultDataJson)
        for (var i = 0; i < resultDataJson.length; i++) {
          console.log(resultDataJson[i])
          restoreImage.value.push(new ImageInfo(""))
          restoreImage.value[i].id = resultDataJson[i]['restoreImageId']
          fetchRestoreInfoById(resultDataJson[i]['restoreImageId'], i)
        }
      })
      .catch((error) => console.log("error", error));
  }


};

const imageColorize = () => {
  console.log("image colorize: ", pageImage.value);
  const requestOptions: RequestInit = {
    method: "GET",
    headers: requestHeaders.getMyHeaders(),
    redirect: "follow",
  };
  fetch(requestUrls.imageColorizeByIdUrl(pageImage.value.id), requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const resultJson = JSON.parse(result);
      const tagInfosJSON = resultJson["data"];
    })
    .catch((error) => console.log("error", error));
};

</script>

<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <div class="grid-content ep-bg-purple" />
      <div>
        <el-image :src="pageImage.src" fit="scale-down" />
      </div>
    </el-col>
    <el-col :span="12">
      <div class="grid-content ep-bg-purple" />
      <div v-for="image in restoreImage">
        <el-image :src="image.src" fit="scale-down" />
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form :model="pageImage" label-width="120px">
        <el-form-item label="名字">
          <el-text>{{ pageImage.name }}</el-text>
        </el-form-item>
        <el-form-item label="文件类型">
          <el-text>{{ pageImage.type }}</el-text>
        </el-form-item>
        <el-form-item label="宽度">
          <el-text>{{ pageImage.width }}</el-text>
        </el-form-item>
        <el-form-item label="高度">
          <el-text>{{ pageImage.height }}</el-text>
        </el-form-item>
        <el-form-item label="MD5">
          <el-text>{{ pageImage.md5 }}</el-text>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style></style>

