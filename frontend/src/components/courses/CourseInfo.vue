<template>
  <div class="flex justify-center pt-10">
    <div class="w-3/4 rounded-md p-10 shadow-lg">
      <div v-if="course">
        <h3 class="text-4xl pt-10 pb-10 font-bold">{{ course.title }}</h3>
        <p>{{ course.description }}</p>

        <div class="flex space-x-4 pt-10 pb-10 border-b text-gray-500 text-xl hover:bg-accent-500">
          <button
            :class="{
              'border-b-2 text-black font-bold border-indigo-500': activeTab === 'students'
            }"
            @click="activeTab = 'students'"
          >
            Students
          </button>
          <button
            :class="{
              'border-b-2 text-black font-bold border-indigo-500': activeTab === 'lessons'
            }"
            @click="activeTab = 'lessons'"
          >
            Lessons
          </button>
          <button
            :class="{
              'border-b-2 text-black font-bold border-indigo-500': activeTab === 'grades'
            }"
            @click="activeTab = 'grades'"
          >
            Grades
          </button>
        </div>

        <div v-if="activeTab === 'students'">List of students enrolled in this course</div>
        <div v-if="activeTab === 'lessons'">List of lessons for this course</div>
        <div v-if="activeTab === 'grades'">View student grades for this course</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCourseStore } from '@/stores/courseStore'
import type { Course } from '@/types/course'
import { useRouter } from 'vue-router'

const courseStore = useCourseStore()
const router = useRouter()

const course = ref<Course | null>(null)
const activeTab = ref('students')

const fetchCourse = async () => {
  const courseId = Number(router.currentRoute.value.params.id)
  course.value = await courseStore.getCourse(courseId)
}

fetchCourse()
</script>

<style scoped></style>
