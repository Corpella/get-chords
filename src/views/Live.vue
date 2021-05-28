<template>
  <div>
    <div class="text-center mt-10 pb-10">
      <InputRecorder :options="options" />
    </div>
    <div class="flex justify-center mt-10">
      <div>
        <el-card shadow="always">
          <p class="text-6xl">D</p>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { InputOptions } from '../types/input'
import InputRecorder from '../components/InputRecorder.vue'

export default defineComponent({
  name: 'Home',
  props: {},
  components: { InputRecorder },
  setup: () => {
    const options: InputOptions = { saveRecording: true }
    return { options }
  },
})
</script>

<style></style>
