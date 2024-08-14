<template>
  <Card>
    <template #title>
      <router-link :to="`/courses/${course.id}`">
        <h3 class="text-xl font-bold text-black hover:underline">{{ course.title }}</h3>
      </router-link>
    </template>

    <template #subtitle>
      <div class="flex mx-auto justify-between">
        <p class="text-gray-700 mb-4">{{ props.course.description }}</p>
        <p class="text-gray-600">{{ enrolledStudentsCount }} {{ studentsLabel }}</p>
      </div>
    </template>

    <template #content>
      <div class="">
        <UserCard :user="course.teacher" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import type { Course } from '@/types/course'
import { computed } from 'vue'
import UserCard from '@/components/UserCard.vue'

const props = defineProps<{
  course: Course
}>()

console.log(props.course)

const enrolledStudentsCount = computed(() => props.course.students?.length || 0)

const studentsLabel = computed(() => {
  const count = enrolledStudentsCount.value
  return count === 1 ? 'student' : 'students'
})
</script>

<style scoped></style>
