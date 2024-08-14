<template>
  <Card>
    <template #content>
      <div class="flex justify-start">
        <Avatar
          v-if="props.user.avatarUrl"
          :image="props.user.avatarUrl"
          shape="circle"
          size="large"
        />
        <Avatar v-else icon="pi pi-user" size="large" shape="circle" />
        <div class="pl-4">
          <h2 class="text-xl font-bold">{{ props.user.username }}</h2>
          <p class="text-gray-500 text-sm">{{ props.user.email }}</p>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import Avatar from 'primevue/avatar'
import { defineProps } from 'vue'
import type { User } from '@/types/user'

const props = defineProps<{
  user: User
}>()

console.log(props.user)
</script>
