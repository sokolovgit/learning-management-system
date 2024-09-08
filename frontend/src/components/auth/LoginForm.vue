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
              @blur="vuelidate.email.$touch()"
              :class="{ 'border-red-500': vuelidate.email.$invalid && vuelidate.email.$dirty }"
              autocomplete="email"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <span
              v-if="vuelidate.email.$invalid && vuelidate.email.$dirty"
              class="text-red-500 text-sm"
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
              @blur="vuelidate.password.$touch()"
              :class="{
                'border-red-500': vuelidate.password.$invalid && vuelidate.password.$dirty
              }"
              autocomplete="current-password"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <span
              v-if="vuelidate.password.$invalid && vuelidate.password.$dirty"
              class="text-red-500 text-sm"
            >
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
import { email, required, minLength } from '@vuelidate/validators'
import { useAuthStore } from '@/stores/authStore'
import { useVuelidate } from '@vuelidate/core'
import { useRouter } from 'vue-router'

const form = ref<LoginRequest>({
  email: '',
  password: ''
})

const rules = {
  email: { required, email },
  password: { required, minLength: minLength(6) }
}

const router = useRouter()
const authStore = useAuthStore()
const vuelidate = useVuelidate(rules, form)

const onSubmit = async () => {
  vuelidate.value.$touch()

  if (vuelidate.value.$invalid) {
    console.log('Invalid form')
    return
  }

  await authStore.login(form.value)
  await router.push('/dashboard')
}
</script>

<style scoped></style>
