<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { Ref } from "vue";
import VueViewer, { component, api, Viewer } from "v-viewer";
import { userInfoStore } from "@/stores/userInfo";
import { requestHeaderStore } from "@/stores/requestHeader";
import { requestUrlStore } from "@/stores/requestUrl";
import { genFileId } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";

VueViewer.setDefaults({
  zIndexInline: 2021,
});

onMounted(() => {
  fetchImageUrlFromServer();
});

const requestUrls = requestUrlStore();
const requestHeaders = requestHeaderStore();
const userInfo = userInfoStore();
class ImageData {
  thumbnail: string;
  source: string;
  title: string;
  constructor(source: string, thumbnail: string, title: string) {
    this.source = source;
    this.thumbnail = thumbnail;
    this.title = title;
  }
}
const sourceImages: Ref<ImageData[]> = ref([]);
const currentPage = ref(1);
const pageSize = ref(9);
const imageTotalCount = ref(9);

const fetchImageUrlFromServer = () => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: requestHeaders.getMyHeaders(),
    redirect: "follow",
  };
  fetch(
    requestUrls.getImageInfoPageByUserIdUrl(
      userInfo.userInfo.userId,
      currentPage.value,
      pageSize.value
    ),
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      const imageListJson = JSON.parse(result);
      const imageInfoList = imageListJson["data"];
      const imageInfoListJson = JSON.parse(imageInfoList);
      setSourceImages(imageInfoListJson, "json");
    })
    .catch((error) => console.log("error", error));
};

const setSourceImages = (imagesInfo: any, infoType: string) => {
  if (infoType == "json") {
    for (var i = sourceImages.value.length; i > 0; i--) {
      sourceImages.value.pop();
    }
    for (var i = 0; i < imagesInfo.length; i++) {
      const data = new ImageData(
        requestUrls.getDomain() + imagesInfo[i]["imagePath"],
        requestUrls.getDomain() + imagesInfo[i]["imagePath"],
        imagesInfo[i]["imageName"]
      );
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
};

const remove = () => {
  state.value.images.pop();
};
function viewT() {
  if (
    state.value.form.view_num >= 0 &&
    state.value.form.view_num < state.value.images.length
  ) {
    viewer.value.view(state.value.form.view_num);
  }
}
function zoom(value?: number) {
  viewer.value.zoom(value || state.value.form.zoom);
}
function zoomTo() {
  viewer.value.zoomTo(state.value.form.zoomTo);
}
function rotate(value?: number) {
  viewer.value.rotate(value || state.value.form.rotate);
}
function rotateTo() {
  viewer.value.rotateTo(state.value.form.rotateTo);
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
</script>

<template>
  <div>
    <div class="methods is-flex">
      <div class="field has-addons">
        <p class="control">
          <button
            type="button"
            class="button is-primary"
            :class="{ ' is-active': !state.options.inline }"
            @click="toggleInline(false)"
          >
            Modal
          </button>
        </p>
        <p class="control">
          <button
            type="button"
            class="button is-primary"
            :class="{ ' is-active': state.options.inline }"
            @click="toggleInline(true)"
          >
            Inline
          </button>
        </p>
      </div>
      <button
        type="button"
        class="button"
        :disabled="state.images.length === sourceImages.length"
        @click="add"
      >
        Add
      </button>
      <button
        type="button"
        class="button"
        :disabled="state.images.length === 1"
        @click="remove"
      >
        Remove
      </button>
      <button type="button" class="button" @click="fetchImageUrlFromServer()">
        更新图像
      </button>
      <el-upload
        ref="upload"
        class="upload-demo"
        :action="getRequestUploadUrl()"
        :headers="getRequestUploadHeader()"
        :limit="1"
        :on-exceed="handleExceed"
        :auto-upload="false"
      >
        <template #trigger>
          <el-button type="primary">select file</el-button>
        </template>
        <el-button class="ml-3" type="success" @click="submitUpload">
          upload to server
        </el-button>
        <template #tip>
          <div class="el-upload__tip text-red">
            limit 1 file, new file will cover the old file
          </div>
        </template>
      </el-upload>
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        background
        layout="prev, pager, next"
        :total="imageTotalCount"
      />
    </div>
    <div class="methods is-flex">
      <template v-if="state.options.inline">
        <div class="field has-addons" style="width: 80px">
          <div class="control">
            <span class="button is-static">View</span>
          </div>
          <!-- <div class="control">
            <input
              v-model.number="state.form.view_num"
              class="input"
              type="text"
              @keyup="viewT"
              :disabled="true"
            />
          </div> -->
        </div>
        <div class="field has-addons" style="width: 90px">
          <!-- <div class="control">
            <input v-model.number="state.form.zoom" class="input" type="text" />
          </div> -->
          <div class="control">
            <span class="button" @click="zoom()">Zoom</span>
          </div>
        </div>
        <div class="field has-addons" style="width: 90px">
          <!-- <div class="control">
            <input
              v-model.number="state.form.zoomTo"
              class="input"
              type="text"
            />
          </div> -->
          <div class="control">
            <span class="button" @click="zoomTo">Zoom to</span>
          </div>
        </div>
        <div class="field has-addons" style="width: 90px">
          <!-- <div class="control">
            <input
              v-model.number="state.form.rotate"
              class="input"
              type="text"
            />
          </div> -->
          <div class="control">
            <span class="button" @click="rotate()">Rotate</span>
          </div>
        </div>
        <div class="field has-addons" style="width: 100px">
          <!-- <div class="control">
            <input
              v-model.number="state.form.rotateTo"
              class="input"
              type="text"
            />
          </div> -->
          <div class="control">
            <span class="button" @click="rotateTo">Rotate to</span>
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
              Rotate Left
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="rotate(90)">
              Rotate Right
            </button>
          </div>
        </div>
        <div class="field has-addons">
          <div class="control">
            <button type="button" class="button" @click="scaleX()">
              Flip Horizontal
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="scaleY()">
              Flip Vertical
            </button>
          </div>
        </div>
        <div class="field has-addons">
          <div class="control">
            <button type="button" class="button" @click="move(-10, 0)">
              Left
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="move(10, 0)">
              Right
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="move(0, -10)">
              Up
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="move(0, 10)">
              Down
            </button>
          </div>
        </div>
        <div class="field has-addons">
          <div class="control">
            <button type="button" class="button" @click="prev">Prev</button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="next">Next</button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="play">Play</button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="stop">Stop</button>
          </div>
        </div>
        <button type="button" class="button" @click="full">Full</button>
        <button type="button" class="button" @click="tooltip">Tooltip</button>
        <button type="button" class="button" @click="reset">Reset</button>
      </template>
      <template v-else>
        <button type="button" class="button" @click="show">Show</button>
      </template>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-2 is-vertical is-parent">
        <div class="tile is-child">
          <nav class="panel options-panel">
            <p class="panel-heading">Options</p>
            <div
              v-for="item of state.toggleOptions"
              :key="item"
              class="panel-block"
            >
              <label class="checkbox">
                <input
                  v-model="state.options[item]"
                  type="checkbox"
                  name="button"
                />
                {{ item }}
              </label>
            </div>
          </nav>
        </div>
      </div>
      <div class="tile is-10 is-vertical is-parent">
        <div class="viewer-wrapper">
          <ViewerComponent
            id="ViewerComponent1"
            ref="viewer"
            :options="state.options"
            :images="state.images"
            rebuild
            class="viewer"
            @inited="inited"
          >
            <template #default="scope">
              <figure class="images">
                <div
                  v-for="{ source, thumbnail, title } in scope.images"
                  :key="source"
                  class="image-wrapper"
                >
                  <img
                    class="image"
                    :src="thumbnail"
                    :data-source="source"
                    :alt="title"
                  />
                </div>
              </figure>
              <p><strong>Options: </strong>{{ scope.options }}</p>
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
  & > * {
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
</style>
