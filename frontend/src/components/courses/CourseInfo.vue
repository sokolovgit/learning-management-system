<template>
  <div class="flex justify-center pt-10">
    <div class="w-3/4 rounded-md p-10 shadow-lg">
      <div v-if="course">
        <h3 class="text-4xl pt-10 pb-10 font-bold">{{ course.title }}</h3>
        <p>{{ course.description }}</p>

        <Tabs value="0">
          <TabList class="border-b-2">
            <Tab value="0">Students</Tab>
            <Tab value="1">Lessons</Tab>
            <Tab value="2">Grades</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="0">
              <div class="pt-10">
                <h4 class="text-2xl font-bold pb-2">Teacher</h4>
                <UserCard :user="course.teacher" />
              </div>

              <div class="pt-10">
                <h4 class="text-2xl font-bold pb-2">Students</h4>
              </div>

              <scroll-panel>
                <DataView :value="course.students" v-if="course.students">
                  <template #list="slotProps">
                    <template v-for="user in slotProps.items" :key="user.id">
                      <UserCard :user="user" />
                    </template>
                  </template>
                </DataView>
              </scroll-panel>
            </TabPanel>
            <TabPanel value="1">
              <div class="pt-10">
                <h4 class="text-2xl font-bold">Lessons</h4>
              </div>
            </TabPanel>
            <TabPanel value="2">
              <div class="pt-10">
                <h4 class="text-2xl font-bold">Grades</h4>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'

import DataView from 'primevue/dataview'
import ScrollPanel from 'primevue/scrollpanel'

import UserCard from '@/components/UserCard.vue'

import { ref } from 'vue'
import { useCourseStore } from '@/stores/courseStore'
import { useRouter } from 'vue-router'

import type { Course } from '@/types/course'

const courseStore = useCourseStore()
const router = useRouter()

const course = ref<Course | null>(null)

const fetchCourse = async () => {
  const courseId = Number(router.currentRoute.value.params.id)
  course.value = await courseStore.getCourse(courseId)
}

fetchCourse()
</script>

<style scoped></style>
