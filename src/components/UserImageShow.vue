<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { Ref } from "vue";
import VueViewer, { component, api, Viewer } from "v-viewer";
import { userInfoStore } from "@/stores/userInfo";
import { requestHeaderStore } from "@/stores/requestHeader";
import { requestUrlStore } from "@/stores/requestUrl";
import { ElMessage, genFileId } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import router from "@/router";
import { currentImageStore } from "@/stores/currentImage";

VueViewer.setDefaults({
  zIndexInline: 2021,
});
class ImageData {
  thumbnail: string;
  source: string;
  title: string;
  md5?: string;
  constructor(source: string, thumbnail: string, title: string) {
    this.source = source;
    this.thumbnail = thumbnail;
    this.title = title;
  }
}

onMounted(() => {
  fetchImageTotalCount();
  fetchImageUrlFromServer();
  currentPage.value = currentImage.currentUserPage
  viewer.value.view(currentImage.currentPublicViewerImageIndex)
  fetchTags()
});

const activeName = ref("1");
const imgWidthDis = ref([100, 8000]);
const imgHeightDis = ref([100, 8000]);
const checkedWallpaper = ref(false);
const checkedPeople = ref(false);
const requestUrls = requestUrlStore();
const currentImage = currentImageStore()
const requestHeaders = requestHeaderStore();
const userInfo = userInfoStore();
const isOptionShow = ref<boolean>(false)

const sourceImages: Ref<ImageData[]> = ref([]);
const currentPage = ref(1);
const pageSize = ref(9);
const imageTotalCount = ref(9);
interface ListItem {
  value: string
  label: string
  id?: number
}

const tagList = ref<ListItem[]>([])
const tagValue = ref<string[]>([])



const fetchImageUrlFromServer = () => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: requestHeaders.getMyHeaders(),
    redirect: "follow",
  };
  fetch(
    requestUrls.getImgBInfoByUserIdPage(
      currentPage.value,
      pageSize.value,
      userInfo.userInfo.userId,
    ),
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      console.log(result)
      const imageListJson = JSON.parse(result);
      const imageInfoList = imageListJson["data"];
      const imageInfoListJson = JSON.parse(imageInfoList);
      setSourceImages(imageInfoListJson, "json");
    })
    .catch((error) => {
      console.log("error", error)
      ElMessage({
        message: `图像信息获取失败\n${error}`,
        type: "error",
      });
    });
};

//TODO: 修改为用户的图像数量
const fetchImageTotalCount = () => {
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
};

const fetchTags = () => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: requestHeaders.getMyHeaders(),
    redirect: "follow",
  };
  fetch(
    requestUrls.getPublicTagsUrl(),
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      const resultJson = JSON.parse(result);
      const tagInfosJSON = resultJson['data']
      while (tagList.value.length > 0) {
        tagList.value.pop()
      }
      for (var i = 0; i < tagInfosJSON.length; i++) {
        const tagInfo = tagInfosJSON[i]
        const tagName: string = tagInfo["tagName"]
        const tagId: number = tagInfo["id"]
        tagList.value.push({ value: tagName, label: tagName, id: tagId })
      }
      console.log("list : ", tagList)
    })
    .catch((error) => console.log("error", error));
  fetch(
    requestUrls.getPriTagsByCreatorIdUrl(userInfo.userInfo.userId),
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      const resultJson = JSON.parse(result);
      const tagInfosJSON = resultJson['data']
      for (var i = 0; i < tagInfosJSON.length; i++) {
        const tagInfo = tagInfosJSON[i]
        const tagName: string = tagInfo["tagName"]
        const tagId: number = tagInfo["id"]
        tagList.value.push({ value: tagName, label: tagName, id: tagId })
      }
      console.log("list : ", tagList)
    })
    .catch((error) => console.log("error", error));
}


watch(currentPage, async (newPageSize, oldQuestion) => {
  // fetchImageUrlFromServer();
  if (tagValue.value.length != 0) {
    fetchImageCountByTags()
    fetchImageInfoByTags()
  } else {
    fetchImageUrlFromServer();
    currentImage.setCurrentUserPage(currentPage.value)
  }
});

const setSourceImages = (imagesInfo: any, infoType: string) => {
  if (infoType == "json") {
    for (var i = sourceImages.value.length; i > 0; i--) {
      sourceImages.value.pop();
    }
    for (var i = 0; i < imagesInfo.length; i++) {
      const data = new ImageData(
        requestUrls.getDomain() + imagesInfo[i]["sourcePath"],
        requestUrls.getDomain() + imagesInfo[i]["thumbnailPath"],
        imagesInfo[i]["imageName"]
      );
      data.md5 = imagesInfo[i]['imageMd5']
      sourceImages.value.push(data);
    }
  }
  console.log("sourceImages: ", sourceImages.value);
  for (var i = state.value.images.length; i > 0; i--) {
    state.value.images.pop();
  }
  for (var i = 0; i < sourceImages.value.length; i++) {
    state.value.images.push(sourceImages.value[i]);
  }
};

const state = ref({
  form: {
    view_num: 2,
    zoom: -0.1,
    zoomTo: 0.8,
    rotate: 90,
    rotateTo: 180,
    scaleX: 1,
    scaleY: 1,
  },
  toggleOptions: [
    "button",
    "navbar",
    "title",
    "toolbar",
    "tooltip",
    "movable",
    "zoomable",
    "rotatable",
    "scalable",
    "transition",
    "fullscreen",
    "keyboard",
  ],
  options: {
    focus: false,
    inline: false,
    button: true,
    navbar: true,
    title: true,
    toolbar: true,
    tooltip: true,
    movable: true,
    zoomable: true,
    rotatable: true,
    scalable: true,
    transition: true,
    fullscreen: true,
    keyboard: true,
    url: "data-source",
  },
  images: [...sourceImages.value].splice(0, 5),
});

const ViewerComponent = component;

const viewer: Ref<Viewer> = ref(
  new Viewer(document.getElementById("app")!, state.value.options)
);
const inited = (viewerT: Viewer) => {
  viewer.value = viewerT;
};

const ConfirmSearchImages = () => {
  if (tagValue.value.length != 0) {
    console.log("tagValue:", tagValue.value)
    currentPage.value = 1;
    pageSize.value = 9;
    fetchImageCountByTags()
    fetchImageInfoByTags()
  } else {
    fetchImageTotalCount();
    fetchImageUrlFromServer();
    currentPage.value = 1
    viewer.value.view(0)
    fetchTagsPublic()
  }
}

const fetchImageCountByTags = () => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: requestHeaders.getMyHeaders(),
    redirect: "follow",
  };
  fetch(requestUrls.getImageCountByTagsUrl(tagValue.value,
    userInfo.userInfo.userId), requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const resultJson = JSON.parse(result);
      const countByTags = Number(resultJson["data"]);
      imageTotalCount.value = countByTags
    })
    .catch((error) => {
      console.log("error", error);
      ElMessage({
        message: `图像信息获取失败\n${error}`,
        type: "error",
      });
    });
}

const fetchImageInfoByTags = () => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: requestHeaders.getMyHeaders(),
    redirect: "follow",
  };
  fetch(requestUrls.getImgBaseInfoByTagPageUrl(
    tagValue.value,
    currentPage.value,
    pageSize.value,
    userInfo.userInfo.userId
  ),
    requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const resultJson = JSON.parse(result);
      const imageInfo = resultJson["data"];
      const imageInfoListJson = JSON.parse(imageInfo);
      setSourceImages(imageInfoListJson, "json")
    })
    .catch((error) => {
      console.log("error", error);
      ElMessage({
        message: `图像信息获取失败\n${error}`,
        type: "error",
      });
    });
}


const getRequestUploadUrl = () => {
  return requestUrls.uploadImageUrl(userInfo.userInfo.userId);
};

const getRequestUploadHeader = () => {
  const newHeader = new Headers();
  const myHeaders = requestHeaders.myHeaders;
  myHeaders.forEach((value, key) => {
    newHeader.append(key, value);
  });
  newHeader.delete("Content-Type");
  return newHeader;
};

const add = () => {
  if (state.value.images.length <= sourceImages.value.length) {
    state.value.images.push(sourceImages.value[state.value.images.length]);
  } else {
    console.log("没有更多图片!");
  }
};

const upload = ref<UploadInstance>();

const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  console.log(file.uid);
  console.log(file);
  upload.value!.handleStart(file);
};

const submitUpload = () => {
  upload.value!.submit();
  ElMessage({
    message: "图像上传完成",
    type: "success",
  });
};

const ClearTagSelection = () => {
  while (tagValue.value.length > 0) {
    tagValue.value.pop()
  }
  imgWidthDis.value = [0, 8000]
  imgHeightDis.value = [0, 8000]
}

// 图像详情 button api
const image_detail = () => {
  currentImage.setCurrentUserViewerImageIndex(viewer.value.index)
  router.push(`imageinfo/${sourceImages.value[viewer.value.index].md5}`)
  router.isReady()
}

const remove = () => {
  state.value.images.pop();
};
const zoom = (value?: number) => {
  viewer.value.zoom(value || state.value.form.zoom);
}
function rotate(value?: number) {
  viewer.value.rotate(value || state.value.form.rotate);
}
function scaleX(value?: number) {
  if (value) {
    viewer.value.scaleX(value);
  } else {
    state.value.form.scaleX = -state.value.form.scaleX;
    viewer.value.scaleX(state.value.form.scaleX);
  }
}
function scaleY(value?: number) {
  if (value) {
    viewer.value.scaleY(value);
  } else {
    state.value.form.scaleY = -state.value.form.scaleY;
    viewer.value.scaleY(state.value.form.scaleY);
  }
}
function move(x: number, y: number) {
  viewer.value.move(x, y);
}
function prev() {
  viewer.value.prev();
  console.log("viewer.value.index : ", viewer.value.index);
}
function next() {
  viewer.value.next();
  console.log("viewer.value.index : ", viewer.value.index);
}
function play() {
  viewer.value.play();
}
function stop() {
  viewer.value.stop();
}
function show() {
  viewer.value.show();
}
function full() {
  viewer.value.full();
}
function tooltip() {
  viewer.value.tooltip();
}
function reset() {
  viewer.value.reset();
}
function toggleInline(inline: boolean) {
  state.value.options.inline = inline;
}

// 下方内容有关于 多选输入框 用于tag的多选
interface ListItem {
  value: string
  label: string
}

const list = ref<ListItem[]>([])
const options = ref<ListItem[]>([])
const value = ref<string[]>([])
const loading = ref(false)
</script>

<template>
  <div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="分类选择" name="categorySelectionCollapseItem">
        <el-row>
          <el-col :span="21">
            <el-select v-model="tagValue" multiple filterable reserve-keyword placeholder="请选择标签"
              default-first-option>
              <!-- remote :remote-method="remoteMethod" :loading="loading" -->
              <el-option v-for="item in tagList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-button type="success" @click="ConfirmSearchImages">确认</el-button>
            <el-button type="primary" @click="ClearTagSelection">清空</el-button>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="文件上传" name="imageUploadCollapseItem">
        <el-upload ref="upload" class="upload-demo" :action="getRequestUploadUrl()" :headers="getRequestUploadHeader()"
          :limit="1" :on-exceed="handleExceed" :auto-upload="false">
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>
          <el-button class="ml-3" type="success" @click="submitUpload">
            上传文件
          </el-button>
          <template #tip>
            <div class="el-upload__tip text-red">
              限制 1个 文件 新文件会覆盖旧文件
            </div>
          </template>
        </el-upload>
      </el-collapse-item>
    </el-collapse>
    <div class="methods is-flex">
      <div class="field has-addons">
        <p class="control">
          <button type="button" class="button is-primary" :class="{ ' is-active': !state.options.inline }"
            @click="toggleInline(false)">
            预览模式
          </button>
        </p>
        <p class="control">
          <button type="button" class="button is-primary" :class="{ ' is-active': state.options.inline }"
            @click="toggleInline(true)">
            处理模式
          </button>
        </p>
      </div>
      <div>
        <button type="button" class="button" :disabled="state.images.length === sourceImages.length" @click="add">
          添加一张图片
        </button>
        <button type="button" class="button" :disabled="state.images.length === 1" @click="remove">
          移除一张图片
        </button>
        <button type="button" class="button" @click="fetchImageUrlFromServer()">
          更新图像
        </button>
        <button type="button" class="button" @click="isOptionShow = !isOptionShow">预览区显示控制</button>
      </div>

      <el-pagination v-model:current-page="currentPage" :page-size="pageSize" background layout="prev, pager, next"
        :total="imageTotalCount" />
    </div>
    <div class="methods is-flex">
      <template v-if="state.options.inline">
        <div class="field has-addons" style="width: 80px">
          <div class="control">
            <span class="button is-static">View</span>
          </div>
        </div>
        <div class="field has-addons" style="width: 90px">
          <div class="control">
            <span class="button" @click="zoom()">Zoom</span>
          </div>
        </div>
        <div class="field has-addons" style="width: 90px">
          <div class="control">
            <span class="button" @click="rotate()">Rotate</span>
          </div>
        </div>
        <div class="field has-addons">
          <div class="control">
            <button type="button" class="button" @click="zoom(0.5)">
              Zoom In
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="zoom(-0.5)">
              Zoom Out
            </button>
          </div>
        </div>
        <div class="field has-addons">
          <div class="control">
            <button type="button" class="button" @click="rotate(-90)">
              向左旋转
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="rotate(90)">
              向右旋转
            </button>
          </div>
        </div>
        <div class="field has-addons">
          <div class="control">
            <button type="button" class="button" @click="scaleX()">
              水平翻转
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="scaleY()">
              垂直翻转
            </button>
          </div>
        </div>
        <div class="field has-addons">
          <div class="control">
            <button type="button" class="button" @click="move(-10, 0)">
              左移
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="move(10, 0)">
              右移
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="move(0, -10)">
              上移
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="move(0, 10)">
              下移
            </button>
          </div>
        </div>
        <div class="field has-addons">
          <div class="control">
            <button type="button" class="button" @click="prev">前一张</button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="next">后一张</button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="play">区域全屏</button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="stop">
              退出区域全屏
            </button>
          </div>
        </div>
        <button type="button" class="button" @click="full">网页全屏</button>
        <button type="button" class="button" @click="tooltip">
          显示缩放比例
        </button>
        <button type="button" class="button" @click="reset">复原</button>
        <button type="button" class="button" @click="image_detail">图像详情</button>
      </template>
      <template v-else>
        <button type="button" class="button" @click="show">网页全屏</button>
      </template>
    </div>
    <div class="tile is-ancestor">
      <template v-if="isOptionShow">
        <div class="tile is-2 is-vertical is-parent">
          <div class="tile is-child">
            <nav class="panel options-panel">
              <p class="panel-heading">Options</p>
              <div v-for="item of state.toggleOptions" :key="item" class="panel-block">
                <label class="checkbox">
                  <input v-model="state.options[item]" type="checkbox" name="button" />
                  {{ item }}
                </label>
              </div>
            </nav>
          </div>
        </div>
      </template>
      <div class="tile is-10 is-vertical is-parent">
        <div class="viewer-wrapper">
          <ViewerComponent id="ViewerComponent1" ref="viewer" :options="state.options" :images="state.images" rebuild
            class="viewer" @inited="inited">
            <template #default="scope">
              <figure class="images">
                <div v-for="{ source, thumbnail, title } in scope.images" :key="source" class="image-wrapper">
                  <img class="image" :src="thumbnail" :data-source="source" :alt="title" />
                </div>
              </figure>
              <template v-if="isOptionShow">
                <p><strong>Options: </strong>{{ scope.options }}</p>
              </template>
            </template>
          </ViewerComponent>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.viewer-wrapper {
  position: relative;
  background: #333;
  height: 100%;
}

.methods {
  margin-bottom: 1em;
  flex-wrap: wrap;

  &>* {
    margin-right: 0.75rem;
  }
}

.options-panel {
  .panel-block {
    padding: 0;

    .checkbox {
      display: block;
      width: 100%;
      margin: 0;
      padding: 0.5em 0.75em;
    }
  }
}

.viewer {
  height: 100%;

  .images {
    height: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 5px;

    .image-wrapper {
      display: inline-block;
      width: calc(33% - 20px);
      margin: 5px 5px 0 5px;

      .image {
        width: 100%;
        cursor: pointer;
        display: inline-block;
      }
    }
  }
}

.dis-input-block {
  display: inline-flex;
  align-items: center;
}

.slider-demo-block {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}

.slider-demo-block .demonstration {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 44px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}

.slider-demo-block .demonstration+.el-slider {
  flex: 0 0 70%;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
