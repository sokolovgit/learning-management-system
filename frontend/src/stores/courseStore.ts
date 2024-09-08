import { defineStore } from 'pinia'
import type { Course } from '@/types/course'
import { ref } from 'vue'

import apiClient from '@/axios'

export const useCourseStore = defineStore('courses', () => {
  const courses = ref<Course[]>([])

  const getUserCourses = async (): Promise<void> => {
    const response = await apiClient.get<Course[]>('/courses')
    courses.value = response.data
  }

  const getCourse = async (id: number): Promise<Course> => {
    const response = await apiClient.get<Course>(`/courses/${id}`)
    return response.data
  }

  return {
    courses,
    getCourse,
    getUserCourses
  }
})
