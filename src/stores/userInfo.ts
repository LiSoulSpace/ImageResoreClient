import { ref } from "vue";
import { defineStore } from "pinia";
import { requestUrlStore } from "./requestUrl";
import { requestHeaderStore } from "./requestHeader";

export const userInfoStore = defineStore("userInfo", () => {
  const requestUrls = requestUrlStore();
  const requestHeaders = requestHeaderStore();
  class UserInfo {
    userId: number;
    username: string;
    avatar_image_id: number;
    avatar_image_path: string;
    constructor(
      userId: number,
      username: string,
      avatar_image_id: number,
      avatar_image_path: string
    ) {
      this.userId = userId;
      this.username = username;
      this.avatar_image_id = avatar_image_id;
      this.avatar_image_path = avatar_image_path;
    }
  }
  const userInfo = ref(
    new UserInfo(
      0,
      "Guest",
      0,
      "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
    )
  );
  const isLogin = ref(false);
  const setUserInfo = (
    userId: number,
    username: string,
    avatar_image_id: number
  ) => {
    userInfo.value.userId = userId;
    userInfo.value.username = username;
    userInfo.value.avatar_image_id = avatar_image_id;
    fetch(requestUrls.getImagePathByIdUrl(avatar_image_id))
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        userInfo.value.avatar_image_path = result;
      })
      .catch((error) => console.log("error", error));
  };

  const login = (resultJson: any) => {
    userInfo.value.userId = resultJson["data"]["userId"]
    userInfo.value.username = resultJson["data"]["nickName"]
    userInfo.value.avatar_image_path = resultJson["data"]["avatar"]
    requestHeaders.setHeaderKeyValue(
      "Authorization",
      "Bearer" + resultJson["data"]["token"]
    );
    console.log(requestHeaders.getMyHeaders().get("Authorization"));
    isLogin.value = true;
  };

  return { isLogin, userInfo, setUserInfo, login };
});
