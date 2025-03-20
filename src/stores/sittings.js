import { defineStore } from "pinia";
import { ref } from "vue";

export const useSittingsStore = defineStore("sittings", () => {
  const resetFlag = ref(false);
  const fontSize = ref(60);
  const fontAlignment = ref("center");
  const textSample = ref("");

  function updateResetFlag() {
    resetFlag.value = !resetFlag.value;
  }

  return { resetFlag, updateResetFlag, fontAlignment };
});
