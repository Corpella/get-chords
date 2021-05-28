<template>
  <div>
    <Navbar />
  </div>
  <div class="w-full mt-10">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Navbar from '../components/layout/Navbar.vue'

export default defineComponent({
  name: 'Home',
  props: {},
  components: { Navbar },
  setup: () => {
    return {}
  },
})
</script>

<style lang="scss"></style>
