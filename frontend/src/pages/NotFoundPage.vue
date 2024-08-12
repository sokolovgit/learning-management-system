<template>
  <Header></Header>
  <NotFound />
</template>

<script lang="ts">
import NotFound from '@/components/NotFound.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { NotFound }
})
</script>

<style scoped></style>
