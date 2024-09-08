<template>
  <login-form class=""></login-form>
  <button @click="loginWithGoogle">Login with Google</button>
</template>

<script setup lang="ts">
import LoginForm from '@/components/auth/LoginForm.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const loginWithGoogle = async () => {
  await authStore.loginWithGoogle()
}
</script>
