import { defineStore } from "pinia";
import { ref } from "vue";

export const useSittingsStore = defineStore("sittings", () => {
  const resetFlag = ref(false);
  const fontSize = ref(60);
  const fontAlignment = ref("center");
  const textSample = ref("");
  const primaryColor = ref("#FA82D1");
  const drawer = ref(false); 
  const menuItems = ref([]);
  function updateResetFlag() {
    resetFlag.value = !resetFlag.value;
  }

  function storeColorInLocalStorage() {
    localStorage.setItem("primaryColor", primaryColor.value);
  }

  function getColorFromLocalStorage() {
    const color = localStorage.getItem("primaryColor");
    if (color) {
      primaryColor.value = color;
    }
  }
  return {
    resetFlag,
    updateResetFlag,
    fontAlignment,
    primaryColor,
    storeColorInLocalStorage,
    getColorFromLocalStorage,
  };
});
