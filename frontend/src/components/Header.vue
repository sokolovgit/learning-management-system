<template>
  <header class="text-black p-1 border-b-2 border-pink-950">
    <div class="container mx-auto flex justify-between items-center">
      <router-link to="/dashboard" class="text-2xl font-bold">LMS</router-link>
      <nav>
        <ul class="flex space-x-4 font">
          <li>
            <router-link to="/courses" class="hover:text-gray-400">Courses</router-link>
          </li>
          <li>
            <router-link to="/homework" class="hover:text-gray-400">Homework</router-link>
          </li>
          <li>
            <router-link to="/grades" class="hover:text-gray-400">Grades</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
</script>

<style scoped></style>
