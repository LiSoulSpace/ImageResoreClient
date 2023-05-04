import { ref } from "vue";
import { defineStore } from "pinia";
import { requestHeaderStore } from "./requestHeader";
import { requestUrlStore } from "./requestUrl";
import { ElMessage } from "element-plus";

export class ImageInfo {
  id?: number;
  src?: string;
  width?: number;
  height?: number;
  description?: string;
  name?: string;
  md5: string;
  type?: string;
  constructor(md5: string) {
    this.md5 = md5;
  }
  updateInfo(
    id?: number,
    name?: string,
    src?: string,
    type?: string,
    width?: number,
    height?: number,
    description?: string
  ) {
    this.id = id;
    this.src = src;
    this.type = type;
    this.width = width;
    this.height = height;
    this.description = description;
    this.name = name;
  }
}

export class TagInfo {
  id: number;
  tagName: string;
  tagNameAlias: string;
  isPublicTag: number;
  isMainTag: number;
  tagCreatorId: number;
  constructor(id: number, tagName: string, tagNameAl: string, isPublicTag: number, isMainTag: number, tagCreatorId: number) {
    this.id = id;
    this.tagName = tagName;
    this.tagNameAlias = tagNameAl;
    this.isPublicTag = isPublicTag;
    this.isMainTag = isMainTag;
    this.tagCreatorId = tagCreatorId;
  }
}

export const currentImageStore = defineStore("currentImage", () => {
  const requestHeaders = requestHeaderStore();
  const requestUrls = requestUrlStore();
  
  const currentPublicPage = ref<number>(1);
  const currentPublicViewerImageIndex = ref<number>(0);
  const setCurrentPublicPage = (currentPage: number) => {
    currentPublicPage.value = currentPage;
  };
  const setCurrentPublicViewerImageIndex = (index: number) => {
    currentPublicViewerImageIndex.value = index;
  };

  const currentUserPage = ref<number>(1);
  const currentUserViewerImageIndex = ref<number>(0);
  const setCurrentUserPage = (currentPage: number) => {
    currentUserPage.value = currentPage;
  };
  const setCurrentUserViewerImageIndex = (index: number) => {
    currentUserViewerImageIndex.value = index;
  };
  const currentImageInfo = ref<ImageInfo>(new ImageInfo(""));
  const parseImageInfo = (imageInfoJson: any) => {
    currentImageInfo.value.updateInfo(
      imageInfoJson["id"],
      imageInfoJson["imageName"],
      requestUrls.getImageSrcUrl(imageInfoJson["imagePath"]),
      imageInfoJson["imageType"],
      imageInfoJson["imageWidth"],
      imageInfoJson["imageHeight"]
    );
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
        currentImageInfo.value.md5 = md5;
        parseImageInfo(imageInfoJson);
      })
      .catch((error) => {
        console.log("error", error);
        ElMessage({
          message: `图像信息获取失败\n${error}`,
          type: "error",
        });
      });
  };

  return {
    currentImageInfo,
    fetchImageInfoByMd5,
    currentPublicPage,
    currentPublicViewerImageIndex,
    setCurrentPublicPage,
    setCurrentPublicViewerImageIndex,
    currentUserPage,
    currentUserViewerImageIndex,
    setCurrentUserPage,
    setCurrentUserViewerImageIndex
  };
});
