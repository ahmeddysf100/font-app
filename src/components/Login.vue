<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user.js'

const username = ref('')
const userStore = useUserStore()

function login() {
  userStore.login(username.value)
}
</script>

<template>
  <div>
    <input v-model="username" placeholder="Username" />
    <button @click="login">Login</button>
  </div>
</template> 