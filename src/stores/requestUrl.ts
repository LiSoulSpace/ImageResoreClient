import { defineStore } from "pinia";

export const requestUrlStore = defineStore("requestUrl", () => {
  const domain = "http://localhost:8080";
  const login = "/user/login";
  const whoami = "/user/whoami";
  const userupdate = "/user/update";
  const sig = "/user/sig";
  const logout = "/user/logout";

  const uploadImage = "/restore/imageInfo/uploadImage";
  const getImagePathPage = "/restore/imageInfo/getImagePathPage";

  const getImagePathById = "/restore/imageInfo/getImagePathById";
  const getImageInfoPage = "/restore/imageInfo/getImageInfoPage";

  const getImageCountByUserId = "/erstore/imageInfo/getImageCountByUserId";

  const getImageInfoPageByUserId =
    "/restore/imageInfo/getImageInfoPageByUserId";
    
  const getPublicImageCount = "/restore/imageInfo/getPublicImageCount"

  const getDomain = () => {
    return domain;
  };

  const userUpdateUrl = (userId: number, nickName: string, avatar: string) => {
    return `${domain}${userupdate}?userId=${userId}&nickName=${nickName}&avatar=${avatar}`;
  };

  const loginUrl = ()=>{
    return `${domain}${login}`
  }

  const sigUrl = (userId: number) => {
    return `${domain}${sig}?userId=${userId}`;
  };

  const logoutUrl = () => {
    return `${domain}${logout}`;
  };

  const uploadImageUrl = (userId: number) => {
    return `${domain}${uploadImage}?userId=${userId}`;
  };

  const getImagePathPageUrl = (currentPage: number, pageSize: number) => {
    return `${domain}${getImagePathPage}?currentPage=${currentPage}&pageSize=${pageSize}`;
  };
  const getImageInfoPageUrl = (currentPage: number, pageSize: number) => {
    return `${domain}${getImageInfoPage}?currentPage=${currentPage}&pageSize=${pageSize}`;
  };
  const getImagePathByIdUrl = (imageId: number) => {
    return `${domain}${getImagePathById}?id=${imageId}`;
  };
  const getImageCountByUserIdUrl = (userId: number) => {
      return `${domain}${getImageCountByUserId}?userId=${userId}`;
  };
  const getPublicImageCountUrl = () =>{
    return `${domain}${getPublicImageCount}`
  }
  const getImageInfoPageByUserIdUrl = (
    userId: number,
    currentPage: number,
    pageSize: number
  ) => {
    return `${domain}${getImageInfoPageByUserId}?currentPage=${currentPage}&pageSize=${pageSize}&userId=${userId}`;
  };

  return {
    getDomain,
    userUpdateUrl,
    sigUrl,
    logoutUrl,
    loginUrl,
    uploadImageUrl,
    getImagePathByIdUrl,
    getImageInfoPageByUserIdUrl,
    getImagePathPageUrl,
    getImageInfoPageUrl,
    getImageCountByUserIdUrl,
    getPublicImageCountUrl
  };
});
