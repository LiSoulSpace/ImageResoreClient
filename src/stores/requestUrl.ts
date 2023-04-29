import { defineStore } from "pinia";
/**
 * 后端请求url的整合Store
 */
export const requestUrlStore = defineStore("requestUrl", () => {
  const domain = "http://localhost:8080";
  const login = "/user/login";
  const whoami = "/user/whoami";
  const userupdate = "/user/update";
  const sig = "/user/sig";
  const logout = "/user/logout";
  const checkIsAdminByUserId = "/user/checkIsAdminByUserId";

  //图像上传uri
  const uploadImage = "/restore/imageInfo/uploadImage";
  //分页获取图像路径uri
  const getImagePathPage = "/restore/imageInfo/getImagePathPage";

  const getImagePathById = "/restore/imageInfo/getImagePathById";
  const getImageInfoPage = "/restore/imageInfo/getImageInfoPage";
  const getImageInfoCount = "/restore/imageInfo/getImageInfoCount";

  const getImageCountByUserId = "/restore/imageInfo/getImageCountByUserId";

  const getImageInfoPageByUserId =
    "/restore/imageInfo/getImageInfoPageByUserId";

  const getImageBaseInfoPage = "/restore/imageInfo/getImageBaseInfoPage";

  const getImageInfoByMd5 = "/restore/imageInfo/getImageInfoByMd5";
  const getImageInfoByMd5Url = (imageMd5: string) => {
    return `${domain}${getImageInfoByMd5}?imageMd5=${imageMd5}`;
  };

  const getPublicImageCount = "/restore/imageInfo/getPublicImageCount";

  const getDomain = () => {
    return domain;
  };

  const userUpdateUrl = (userId: number, nickName: string, avatar: string) => {
    return `${domain}${userupdate}?userId=${userId}&nickName=${nickName}&avatar=${avatar}`;
  };

  const loginUrl = () => {
    return `${domain}${login}`;
  };

  const sigUrl = (userId: number) => {
    return `${domain}${sig}?userId=${userId}`;
  };

  const logoutUrl = () => {
    return `${domain}${logout}`;
  };

  const uploadImageUrl = (userId: number) => {
    return `${domain}${uploadImage}?userId=${userId}`;
  };

  const checkIsAdminByUserIdUrl = (userId: number) => {
    return `${domain}${checkIsAdminByUserId}?userId=${userId}`;
  };

  const getImagePathPageUrl = (currentPage: number, pageSize: number) => {
    return `${domain}${getImagePathPage}?currentPage=${currentPage}&pageSize=${pageSize}`;
  };
  const getImageInfoPageUrl = (currentPage: number, pageSize: number) => {
    return `${domain}${getImageInfoPage}?currentPage=${currentPage}&pageSize=${pageSize}`;
  };
  const getImageInfoCountUrl = () => {
    return `${domain}${getImageInfoCount}`;
  };
  const getImageBaseInfoPageUrl = (currentPage: number, pageSize: number) => {
    return `${domain}${getImageBaseInfoPage}?currentPage=${currentPage}&pageSize=${pageSize}`;
  };
  const getImagePathByIdUrl = (imageId: number) => {
    return `${domain}${getImagePathById}?id=${imageId}`;
  };
  const getImageCountByUserIdUrl = (userId: number) => {
    return `${domain}${getImageCountByUserId}?userId=${userId}`;
  };
  const getPublicImageCountUrl = () => {
    return `${domain}${getPublicImageCount}`;
  };
  const getImageInfoPageByUserIdUrl = (
    userId: number,
    currentPage: number,
    pageSize: number
  ) => {
    return `${domain}${getImageInfoPageByUserId}?currentPage=${currentPage}&pageSize=${pageSize}&userId=${userId}`;
  };

  const getImageSrcUrl = (imageUri: string) => {
    return `${domain}${imageUri}`;
  };

  return {
    getDomain,
    userUpdateUrl,
    sigUrl,
    logoutUrl,
    loginUrl,
    uploadImageUrl,
    checkIsAdminByUserIdUrl,
    getImagePathByIdUrl,
    getImageInfoPageByUserIdUrl,
    getImagePathPageUrl,
    getImageInfoPageUrl,
    getImageInfoCountUrl,
    getImageCountByUserIdUrl,
    getPublicImageCountUrl,
    getImageInfoByMd5Url,
    getImageSrcUrl,
    getImageBaseInfoPageUrl,
  };
});
