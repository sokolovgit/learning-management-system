<template>
  <div class="justify-center flex pt-10">
    <div class="w-3/4 rounded-md">
      <h2 class="text-2xl text-black font-bold text-center pt-10 mx-auto">Your courses</h2>
      <DataView class="rounded-md" :value="courses">
        <template #list="slotProps">
          <template v-for="course in slotProps.items">
            <CourseCard :course="course" />
          </template>
        </template>
      </DataView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCourseStore } from '@/stores/courseStore'
import type { Course } from '@/types/course'
import CourseCard from '@/components/courses/CourseCard.vue'

const courseStore = useCourseStore()
const courses = ref<Course[]>([])

const fetchCourses = async () => {
  await courseStore.getUserCourses()
  courses.value = courseStore.courses
}

// Fetch courses when the setup function is invoked
fetchCourses()
</script>

<style scoped></style>
