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

  //ImageInfoController
  const uploadImage = "/restore/imageInfo/uploadImage";
  const imageRestoreById = "/restore/imageInfo/imageRestoreById";
  const imageResizeById = "/restore/imageInfo/imageResizeById";
  const imageColorizeById = "/restore/imageInfo/imageColorizeById";
  const deleteImageById = "/restore/imageInfo/deleteImageById";
  const getImagePathPage = "/restore/imageInfo/getImagePathPage";
  const getImagePathById = "/restore/imageInfo/getImagePathById";
  const getImageMaxWidHei = "/restore/imageInfo/getImageMaxWidHei";
  const getImageInfoPage = "/restore/imageInfo/getImageInfoPage";
  const getImageInfoCount = "/restore/imageInfo/getImageInfoCount";
  const getImageInfoByMd5 = "/restore/imageInfo/getImageInfoByMd5";
  const getImageBaseInfoPage = "/restore/imageInfo/getImageBaseInfoPage";
  const getImageInfoById = "/restore/imageInfo/getImageInfoById";

  //TagInfoController
  const saveTagInfo = "/restore/tag/saveTagInfo";
  const saveTagImageRe = "/restore/tag/saveTagImageRe";
  const getTagsByCreatorId = "/restore/tag/getTagsByCreatorId";
  const getTagsAll = "/restore/tag/getTagsAll";
  const getPublicTags = "/restore/tag/getPublicTags";
  const getMainTags = "/restore/tag/getMainTags";
  const getImageCountByTags = "/restore/tag/getImageCountByTags";
  const getImageCountByTagsAndUserId =
    "/restore/tag/getImageCountByTagsAndUserId";
  const getImageByTags = "/restore/tag/getImageByTags";
  const countByCreatorId = "/restore/tag/countByCreatorId";
  const getPrivateTagsByCreatorId = "/restore/tag/getPrivateTagsByCreatorId";

  //ImageTagRelationController
  const getTagsByImageMd5 = "/restore/tag/getTagsByImageMd5";
  const getImageBaseInfoByTagPage = "/restore/tag/getImageBaseInfoByTagPage";

  //UserImageController
  const setImageUserRela = "/restore/imageInfo/setImageUserRela";
  const getImageInfoPageByUserId =
    "/restore/imageInfo/getImageInfoPageByUserId";
  const checkImageUserRela = "/restore/imageInfo/checkImageUserRela";

  //OriginSmallController
  const getPublicImageCount = "/restore/imageInfo/getPublicImageCount";
  const getImageCountByUserId = "/restore/imageInfo/getImageCountByUserId";
  const getImageBaseInfoByUserIdPage =
    "/restore/imageInfo/getImageBaseInfoByUserIdPage";

  const getImageDeblurByImageId =
    "/restore/imageRestore/getImageDeblurByImageId";
  const getImageColorizeByImageId =
    "/restore/imageRestore/getImageColorizeByImageId";

  const getImgMaxWidHeiUrl = () => {
    return `${domain}${getImageMaxWidHei}`;
  };

  const getImageInfoByMd5Url = (imageMd5: string) => {
    return `${domain}${getImageInfoByMd5}?imageMd5=${imageMd5}`;
  };

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
  const saveTagImageReUrl = (tagId: number, imageId: number) => {
    return `${domain}${saveTagImageRe}?tagId=${tagId}&imageId=${imageId}`;
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

  const saveTagInfoUrl = (
    tagName: string,
    tagAlias: string,
    isPublicTag: number
  ) => {
    return `${domain}${saveTagInfo}?tagName=${tagName}&tagNameAlias=${tagAlias}&isPublicTag=${isPublicTag}`;
  };
  const getTagsByCreatorIdUrl = (creatorId: number) => {
    return `${domain}${getTagsByCreatorId}?creatorId=${creatorId}`;
  };
  const getPublicTagsUrl = () => {
    return `${domain}${getPublicTags}`;
  };
  const getMainTagsUrl = () => {
    return `${domain}${getMainTags}`;
  };
  const getImageByTagsUrl = (
    tags: string[],
    currentPage?: number,
    pageSize?: number
  ) => {
    var url = `${domain}${getImageByTags}?`;
    for (var i = 0; i < tags.length; i++) {
      if (i == 0) url = url + "tags=" + tags[i];
      else url = url + "&tags=" + tags[i];
    }
    if (currentPage && pageSize) {
      url = url + "&currentPage=" + currentPage;
      url = url + "&pageSize=" + pageSize;
    }
    return url;
  };
  const getTagsAllUrl = () => {
    return `${domain}${getTagsAll}`;
  };
  const getTagsByImageMd5Url = (md5: string) => {
    return `${domain}${getTagsByImageMd5}?imageMd5=${md5}`;
  };

  const getImgBaseInfoByTagPageUrl = (
    tags: string[],
    currentPage?: number,
    pageSize?: number,
    userId?: number
  ) => {
    var url = `${domain}${getImageBaseInfoByTagPage}?`;
    for (var i = 0; i < tags.length; i++) {
      if (i == 0) url = url + "tags=" + tags[i];
      else url = url + "&tags=" + tags[i];
    }
    if (currentPage && pageSize) {
      url = url + "&currentPage=" + currentPage;
      url = url + "&pageSize=" + pageSize;
    }
    if (userId) {
      url = url + "&userId=" + userId;
    }
    return url;
  };

  const getImageCountByTagsUrl = (tags: string[], userId?: number) => {
    var url = `${domain}${getImageCountByTags}?`;
    for (var i = 0; i < tags.length; i++) {
      if (i == 0) url = url + "tags=" + tags[i];
      else url = url + "&tags=" + tags[i];
    }
    if (userId) {
      url = url + "&userId=" + userId;
    }
    return url;
  };

  const getImgCountByTagsAndUserIdUrl = (tags: string[], userId: number) => {
    var url = `${domain}${getImageCountByTags}?`;
    for (var i = 0; i < tags.length; i++) {
      if (i == 0) url = url + "tags=" + tags[i];
      else url = url + "&tags=" + tags[i];
    }
    return url;
  };

  const checkImgUserRelaUrl = (imageMd5: string, userId: number) => {
    return `${domain}${checkImageUserRela}?imageMd5=${imageMd5}&userId=${userId}`;
  };
  const setImgUserRelaUrl = (
    imageMd5: string,
    userId: number,
    isSet: number
  ) => {
    return `${domain}${setImageUserRela}?imageMd5=${imageMd5}&userId=${userId}&isSet=${isSet}`;
  };

  const countByCreatorIdUrl = (creatorId: number) => {
    return `${domain}${countByCreatorId}?creatorId=${creatorId}`;
  };

  const imageRestoreByIdUrl = (imageId: number) => {
    return `${domain}${imageRestoreById}?imageId=${imageId}`;
  };
  const imageResizeByIdUrl = (imageId: number) => {
    return `${domain}${imageResizeById}?imageId=${imageId}`;
  };
  const imageColorizeByIdUrl = (imageId: number) => {
    return `${domain}${imageColorizeById}?imageId=${imageId}`;
  };
  const deleteImageByIdUrl = (imageId: number) => {
    return `${domain}${deleteImageById}?imageId=${imageId}`;
  };

  const getImgDeblurByIdUrl = (imageId: number) => {
    return `${domain}${getImageDeblurByImageId}?imageId=${imageId}`;
  };
  const getImgColorizeByIdUrl = (imageId: number) => {
    return `${domain}${getImageColorizeByImageId}?imageId=${imageId}`;
  };
  const getImgInfoByIdUrl = (imageId: number) => {
    return `${domain}${getImageInfoById}?imageId=${imageId}`;
  };

  const getImgBInfoByUserIdPage = (
    currentPage: number,
    pageSize: number,
    userId: number
  ) => {
    return `${domain}${getImageBaseInfoByUserIdPage}?currentPage=${currentPage}&pageSize=${pageSize}&userId=${userId}`;
  };

  const getPriTagsByCreatorIdUrl = (creatorId: number) => {
    return `${domain}${getPrivateTagsByCreatorId}?creatorId=${creatorId}`;
  };

  return {
    getDomain,
    userUpdateUrl,
    sigUrl,
    logoutUrl,
    loginUrl,
    uploadImageUrl,
    imageRestoreByIdUrl,
    imageResizeByIdUrl,
    imageColorizeByIdUrl,
    deleteImageByIdUrl,
    checkIsAdminByUserIdUrl,
    saveTagInfoUrl,
    getTagsByCreatorIdUrl,
    getPublicTagsUrl,
    getMainTagsUrl,
    getImageByTagsUrl,
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
    checkImgUserRelaUrl,
    setImgUserRelaUrl,
    getImgMaxWidHeiUrl,
    countByCreatorIdUrl,
    getImageCountByTagsUrl,
    getTagsByImageMd5Url,
    getImgBaseInfoByTagPageUrl,
    getTagsAllUrl,
    saveTagImageReUrl,
    getImgDeblurByIdUrl,
    getImgColorizeByIdUrl,
    getImgInfoByIdUrl,
    getImgBInfoByUserIdPage,
    getPriTagsByCreatorIdUrl,
  };
});
