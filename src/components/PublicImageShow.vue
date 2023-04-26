<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { Ref } from "vue";
import VueViewer, { component, api, Viewer } from "v-viewer";
import { userInfoStore } from "@/stores/userInfo";
import { requestHeaderStore } from "@/stores/requestHeader";
import { requestUrlStore } from "@/stores/requestUrl";
import { currentImageStore } from "@/stores/currentImage"
import { ElMessage, genFileId } from "element-plus";
import router from "@/router";
import ImageInfoBlock from "./ImageInfoBlock.vue";

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

VueViewer.setDefaults({
  zIndexInline: 2021,
});

onMounted(() => {
  fetchImageTotalCount();
  fetchImageUrlFromServer();
  currentPage.value = currentImage.currentPublicPage
  viewer.value.view(currentImage.currentPublicViewerImageIndex)
});

const activeName = ref("1");
const imgWidthDis = ref([100, 8000]);
const imgHeightDis = ref([100, 8000]);
const checkedWallpaper = ref(false);
const checkedPeople = ref(false);
const sourceImages: Ref<ImageData[]> = ref([]);
const currentPage = ref(1);
const pageSize = ref(9);
const imageTotalCount = ref(9);

const requestUrls = requestUrlStore();
const requestHeaders = requestHeaderStore();
const userInfo = userInfoStore();
const currentImage = currentImageStore()
const isOptionShow = ref<boolean>(false)

const fetchImageUrlFromServer = () => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: requestHeaders.getMyHeaders(),
    redirect: "follow",
  };
  fetch(
    requestUrls.getImageBaseInfoPageUrl(
      currentPage.value,
      pageSize.value
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

const fetchImageTotalCount = () => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: requestHeaders.getMyHeaders(),
    redirect: "follow",
  };
  fetch(
    requestUrls.getPublicImageCountUrl(),
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

watch(currentPage, async (newPageSize, oldQuestion) => {
  fetchImageUrlFromServer();
  currentImage.setCurrentPublicPage(currentPage.value)
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

const clear_tag_selection = () => {

}

// 图像详情 button api
const image_detail = () => {
  currentImage.setCurrentPublicViewerImageIndex(viewer.value.index)
  router.push(`/imageinfo/${sourceImages.value[viewer.value.index].md5}`)
  router.isReady()
}

const testIndex = (index: number) => {
  viewer.value.view(3)
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

onMounted(() => {
  list.value = states.map((item) => {
    return { value: `value:${item}`, label: `label:${item}` }
  })
})

const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      options.value = list.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    options.value = list.value
  }
}

const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Wisconsin',
  'Wyoming',
]
</script>

<template>
  <div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="分类选择" name="categorySelectionCollapseItem">
        <el-row>
          <el-col :span="12">
            <el-space wrap>
              <div><el-checkbox v-model="checkedWallpaper" label="壁纸" /></div>
              <div><el-checkbox v-model="checkedPeople" label="人像" /></div>
            </el-space>
          </el-col>
          <el-col :span="4">
            <div style="align-items: center;">
              <el-space wrap size="4px">
                <el-text style="width: 100px;">高度范围(输入)</el-text>
                <el-input style="width: 60px;" v-model="imgHeightDis[0]" placeholder="min" />
                <span>~</span>
                <el-input style="width: 60px;" v-model="imgHeightDis[1]" placeholder="max" />
              </el-space>
              <el-space wrap size="4px">
                <el-text style="width: 100px;">宽度范围(输入)</el-text>
                <el-input style="width: 60px;" v-model="imgWidthDis[0]" placeholder="min" />
                <span>~</span>
                <el-input style="width: 60px;" v-model="imgWidthDis[1]" placeholder="max" />
              </el-space>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <div class="slider-demo-block">
                <el-text style="width: 100px;">图像高度范围</el-text>
                <el-slider v-model="imgHeightDis" range :max="8000" />
              </div>
              <div class="slider-demo-block">
                <el-text style="width: 100px;">图像宽度范围</el-text>
                <el-slider v-model="imgWidthDis" range :max="8000" />
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="21">
            <el-select v-model="value" multiple filterable reserve-keyword placeholder="Please enter a keyword"
              default-first-option>
              <!-- remote :remote-method="remoteMethod" :loading="loading" -->
              <el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-button type="success">确认</el-button>
            <el-button type="primary" @click="clear_tag_selection">清空</el-button>
          </el-col>
        </el-row>
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
        <div class="field has-addons">
          <div class="control">
            <button type="button" class="button" @click="testIndex(3)">
              跳转到第三张图片
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="zoom(0.5)">
              放大
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="zoom(-0.5)">
              缩小
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
      <div class="tile is-vertical is-parent">
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
