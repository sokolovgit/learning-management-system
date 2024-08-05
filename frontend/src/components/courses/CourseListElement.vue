<script setup lang="ts">
import type { Course } from '@/types/course'
import { computed } from 'vue'

interface Props {
  course: Course
}

const props = defineProps<Props>()

const enrolledStudentsCount = computed(() => props.course.students?.length || 0)

const studentsLabel = computed(() => {
  const count = enrolledStudentsCount.value
  return count === 1 ? 'student' : 'students'
})
</script>

<template>
  <div class="bg-white shadow-lg rounded-md p-4">
    <router-link :to="`/courses/${course.id}`">
      <h3 class="text-xl font-bold text-black hover:underline">{{ course.title }}</h3>
    </router-link>
    <p class="text-gray-700 mb-4">{{ course.description }}</p>
    <div class="flex justify-between items-center">
      <p class="text-gray-600">{{ enrolledStudentsCount }} {{ studentsLabel }}</p>
      <div class="rounded-full bg-gray-200 w-10 h-10 p-7 flex items-center justify-center">
        <p class="text-gray-600">{{ course.teacher?.username[0] || 'N/A' }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
