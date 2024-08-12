<script setup lang="ts"></script>

<template>
  <div class="p-10">
    <h1 class="justify-center flex font-bold text-2xl">404 Not Found</h1>
    <p class="justify-center flex">Sorry, the page you are looking for does not exist.</p>
  </div>
  <router-link class="flex justify-center" to="/dashboard">
    <button class="text-white bg-indigo-500 hover:bg-indigo-600 rounded-md shadow-md p-2">
      Go back to the home page
    </button>
  </router-link>
</template>

<style scoped></style>
