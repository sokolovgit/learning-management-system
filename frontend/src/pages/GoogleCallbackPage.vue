<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.handleGoogleAuthCallback()
})
</script>

<template>
  <div>
    <h1>Google Callback Page</h1>
    <p>Loading...</p>
  </div>
</template>

<style scoped></style>
