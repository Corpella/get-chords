<template>
  <div>
    <div class="text-center mt-10 pb-10">
      <InputRecorder :options="options" />
    </div>
  </div>
  <!-- HOW IT SHOULD BE   -->

  <!-- <div class="flex m-10 mt-10">
    <div class="w-1/3">
      <RecordingList />
    </div>
    <div class="w-2/3">
    <NoteDisplay />
    </div>
  </div> -->
  <div class="flex m-10 mt-10">
    <div class="w-full">
      <RecordingList />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import RecordingList from '../components/RecordingList.vue'
import InputRecorder from '../components/InputRecorder.vue'

import { InputOptions } from '../types/input'

export default defineComponent({
  name: 'Home',
  props: {},
  components: { RecordingList, InputRecorder },
  setup: () => {
    const options: InputOptions = { saveRecording: true }
    return { options }
  },
})
</script>

<style lang="scss"></style>
