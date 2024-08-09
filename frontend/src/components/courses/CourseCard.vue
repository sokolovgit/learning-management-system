<template>
  <Card>
    <template #title>
      <router-link :to="`/courses/${course.id}`">
        <h3 class="text-xl font-bold text-black hover:underline">{{ course.title }}</h3>
      </router-link>
    </template>

    <template #subtitle>
      <p class="text-gray-700 mb-4">{{ course.description }}</p>
    </template>

    <template #content>
      <p class="text-gray-600">{{ enrolledStudentsCount }} {{ studentsLabel }}</p>
      <Avatar icon="pi pi-user" size="large" />
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import type { Course } from '@/types/course'
import { computed } from 'vue'

const props = defineProps<{
  course: Course
}>()

const enrolledStudentsCount = computed(() => props.course.students?.length || 0)

const studentsLabel = computed(() => {
  const count = enrolledStudentsCount.value
  return count === 1 ? 'student' : 'students'
})
</script>

<style scoped></style>
