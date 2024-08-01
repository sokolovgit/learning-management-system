<script setup lang="ts">
import { ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, helpers } from '@vuelidate/validators'
import { useAuthStore } from '@/stores/authStore'
import type { RegisterRequest } from '@/types/auth'
import { UserRole } from '@/enums/userRole'

const isValidRole = helpers.withMessage('Invalid role', (value: UserRole) =>
  Object.values(UserRole).includes(value)
)

// Define form fields
const form = ref<RegisterRequest>({
  username: '',
  email: '',
  password: '',
  role: UserRole.STUDENT
})

// Define validation rules
const rules = {
  username: { required },
  email: { required, email },
  password: { required, minLength: minLength(6) },
  role: { required, isValidRole }
}

const authStore = useAuthStore()

// Create Vuelidate instance
const v$ = useVuelidate(rules, form)

const submissionMessage = ref('')

const onSubmit = async () => {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    console.log('Form Submitted:', form.value)
    await authStore.register(form.value)
    submissionMessage.value = 'A verification link has been sent to your email.'
  } else {
    console.log('Form has errors')
  }
}
</script>

<template>
  <div>
    <div>
      <h2 class="text-2xl font-bold text-center pt-10">Register</h2>
    </div>

    <div
      class="mt-5 rounded-md ring-gray-300 sm:mx-auto sm:w-full sm:max-w-sm ring-1 ring-offset-8"
    >
      <form @submit.prevent="onSubmit" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium leading-6 text-gray-900">
            Name
          </label>
          <div class="mt-2">
            <input
              id="username"
              name="username"
              type="text"
              v-model="form.username"
              @blur="v$.username.$touch()"
              :class="{ 'border-red-500': v$.username.$invalid && v$.username.$dirty }"
              autocomplete="username"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <span v-if="v$.username.$invalid && v$.username.$dirty" class="text-red-500 text-sm">
              Name is required
            </span>
          </div>
        </div>

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
          <label for="role" class="block text-sm font-medium leading-6 text-gray-900"> Role </label>
          <div class="mt-2">
            <select
              id="role"
              name="role"
              v-model="form.role"
              @blur="v$.role.$touch()"
              :class="{ 'border-red-500': v$.role.$invalid && v$.role.$dirty }"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            <span v-if="v$.role.$invalid && v$.role.$dirty" class="text-red-500 text-sm">
              Role is required
            </span>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Register
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Already have an account?
        {{ ' ' }}
        <router-link
          to="/login"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >Login
        </router-link>
      </p>

      <div v-if="submissionMessage" class="mt-4 text-center text-green-500">
        {{ submissionMessage }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
