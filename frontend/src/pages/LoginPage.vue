<template>
  <div>
    <div>
      <h2 class="text-2xl font-bold text-center pt-10">Login</h2>
    </div>

    <div
      class="mt-5 rounded-md ring-gray-300 sm:mx-auto sm:w-full sm:max-w-sm ring-1 ring-offset-8"
    >
      <form @submit.prevent="onSubmit" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900"
            >Email address</label
          >
          <div class="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              v-model="form.email"
              @blur="v$.email.$touch()"
              :class="{ 'border-red-500': v$.email.$invalid && v$.email.$dirty }"
              autocomplete="email"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <span v-if="v$.email.$invalid && v$.email.$dirty" class="text-red-500 text-sm"
              >Enter a valid email</span
            >
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>

            <div class="text-sm">
              <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
          </div>
          <div class="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              v-model="form.password"
              @blur="v$.password.$touch()"
              :class="{ 'border-red-500': v$.password.$invalid && v$.password.$dirty }"
              autocomplete="current-password"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <span v-if="v$.password.$invalid && v$.password.$dirty" class="text-red-500 text-sm">
              Password must be at least 6 characters
            </span>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoginRequest } from '@/types/auth'
import { ref } from 'vue'
import { email, required } from '@vuelidate/validators'
import { useAuthStore } from '@/stores/authStore'
import { useVuelidate } from '@vuelidate/core'

const form = ref<LoginRequest>({
  email: '',
  password: ''
})

const rules = {
  email: { required, email },
  password: { required }
}

const authStore = useAuthStore()
const v$ = useVuelidate(rules, form)

const onSubmit = () => {
  v$.value.$touch()

  if (v$.value.$invalid) {
    console.log('Invalid form')
  }

  authStore.login(form.value)
}
</script>

<style scoped></style>
