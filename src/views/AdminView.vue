<script setup lang="ts">
import { requestUrlStore } from "@/stores/requestUrl";
import { userInfoStore } from "@/stores/userInfo";
import { computed, ref, onMounted, type ComputedRef, type Ref, watch } from "vue";
import { requestHeaderStore } from "../stores/requestHeader";
import { ImageInfo, TagInfo } from "@/stores/currentImage"
import { ElMessage } from "element-plus";
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

const tableImageData: Ref<ImageInfo[]> = ref([])
const initTableData = () => {
    if (userInfo.isLogin) {
        fetchUserImageInfoCount()
        fetchUserImageInfos()
        fetchTagsAll()
    }
}
const currentPage: Ref<number> = ref(1);
const pageSize: Ref<number> = ref(10)
const imageTotalCount: Ref<number> = ref(10);
const tableTagData: Ref<TagInfo[]> = ref([]);

const fetchTagsAll = () => {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: requestHeaders.getMyHeaders(),
    redirect: "follow",
  };
  fetch(requestUrls.getTagsAllUrl(), requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      const resultJson = JSON.parse(result);
      const tagInfos = resultJson["data"];
      parseTagsInfo(tagInfos)
    })
    .catch((error) => {
      console.log("error", error);
      ElMessage({
        message: `标签信息获取失败\n${error}`,
        type: "error",
      });
    });
}


const parseTagsInfo = (tagInfo: any) => {
  for (var i = tableTagData.value.length; i > 0; i--) {
    tableTagData.value.pop()
  }
  for (var i = 0; i < tagInfo.length; i++) {
    const tagI = tagInfo[i];
    const data = new TagInfo(tagI["id"],
      tagI["tagName"],
      tagI["tagNameAlias"],
      tagI["isPublicTag"],
      tagI["isMainTag"],
      tagI["tagCreatorId"]
    )
    tableTagData.value.push(data);
  }
}

const fetchUserImageInfos = () => {
    const requestOptions: RequestInit = {
        method: "GET",
        headers: requestHeaders.getMyHeaders(),
        redirect: "follow",
    };
    fetch(requestUrls.getImageInfoPageUrl(
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

const fetchUserImageInfoCount = () => {
    const requestOptions: RequestInit = {
        method: "GET",
        headers: requestHeaders.getMyHeaders(),
        redirect: "follow",
    };
    fetch(
        requestUrls.getImageInfoCountUrl(),
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
</script>

<template>
    <el-tabs type="border-card">
        <el-tab-pane label="ImageTable">
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
        <el-tab-pane label="TagTable">
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
                    <el-button size="small" type="danger"
                      @click="handleTagDelete(scope.$index, scope.row)">Delete</el-button>
                  </template>
                </el-table-column>
              </el-table>
        </el-tab-pane>
        <el-tab-pane label="Role">Role</el-tab-pane>
        <el-tab-pane label="Task">Task</el-tab-pane>
    </el-tabs>
</template>

<style lang="scss" scoped></style>