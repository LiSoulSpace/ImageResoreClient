import { ref } from "vue";
import { defineStore } from "pinia";

export const requestHeaderStore = defineStore("requestHeader", () => {
  const myHeaders = ref(new Headers());
  myHeaders.value.append("Content-Type", "application/json");
  myHeaders.value.append("Accept", "*/*");
  const setHeaderKeyValue = (key: string, value: string) => {
    myHeaders.value.set(key, value);
  };
  const removeHeaderKey = (key: string) => {
    myHeaders.value.delete(key);
  };
  const getMyHeaders = () => {
    return myHeaders.value
  };
  return { myHeaders, setHeaderKeyValue, removeHeaderKey, getMyHeaders };
});
