<template>
  <div>
    <button
      class="record button button--record"
      @click="toggleRecording"
      :class="status.isRecording ? 'button--active' : ''"
    >
      <i class="el-icon-microphone" aria-hidden="true"></i>
    </button>
  </div>
  <el-dialog
    width="30%"
    v-model="dialogVisible"
    :show-close="false"
    :before-close="() => {}"
  >
    <template #title>
      <div class="flex justify-start ml-5">
        <p class="text-3xl font-bold">Recording Name</p>
      </div>
    </template>
    <div class="flex flex-col justify-start ml-5">
      <div class="mb-10 text-left">
        <p class="text-3xl">Choose a name for your recording</p>
      </div>
      <div class="w-2/3">
        <el-input
          ref="inputName"
          :validate-event="true"
          placeholder="Name"
          v-model="recordingName"
        ></el-input>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between">
        <span></span>
        <div>
          <el-button type="primary" @click="addRecording">Confirm</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, ref } from 'vue'
import { useRecordingsStore } from '../store/audio'

import { InputOptions } from '../types/input'
export default defineComponent({
  name: 'Home',
  props: {
    options: {
      type: Object as PropType<InputOptions>,
      required: true,
    },
  },
  setup: (props) => {
    //TODO: refactor into dialog component

    const dialogVisible = ref(false)

    const recordingName = ref('')

    const recordingData = ref('')

    const addRecording = () => {
      audio.addRecording({
        data: recordingData.value,
        isPlaying: false,
        name: recordingName.value,
      })
      recordingData.value = ''
      recordingName.value = ''
      dialogVisible.value = false
    }

    //Store
    const audio = useRecordingsStore()
    //TODO:Refactor into a composable

    let analyser: any = null
    let scriptProcessor: any = null

    let chunks: BlobPart[] = []

    let audioContext: AudioContext | null = null
    let input: MediaStreamAudioSourceNode | null = null
    let recorder: MediaRecorder | null = null
    let stream = null
    let recording = null

    const status = reactive({
      isRecording: false,
    })

    const setAudioStream = (stream: MediaStream) => {
      stream = stream
      input = audioContext!.createMediaStreamSource(stream)

      recorder = new window.MediaRecorder(stream)

      setRecorderActions()
    }
    const setRecorderActions = () => {
      recorder!.ondataavailable = saveChunkToRecording
      recorder!.onstop = saveRecording
    }

    const saveChunkToRecording = (event: BlobEvent) => {
      chunks.push(event.data)
    }

    const saveRecording = () => {
      recordingData.value = URL.createObjectURL(
        new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
      )
      chunks = []
      //STORE ADD
      if (props.options.saveRecording) {
        dialogVisible.value = true
      }
    }

    const startRecording = () => {
      status.isRecording = true

      recorder!.start()
    }

    // Stop recording
    const stopRecording = () => {
      status.isRecording = false

      recorder!.stop()
    }
    //Methods
    const toggleRecording = () => {
      if (status.isRecording) {
        stopRecording()
      } else {
        startRecording()
      }
    }

    // Toggle the play button

    // Setup the audio player

    onMounted(() => {
      audioContext = new AudioContext()
      analyser = audioContext.createAnalyser()
      scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1)
      analyser.smoothingTimeConstant = 0.3
      analyser.fftSize = 1024
      audioContext.createScriptProcessor(2048, 1, 1)

      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream: MediaStream) => {
          setAudioStream(stream)
        })
    })
    return {
      toggleRecording,
      status,
      stream,
      dialogVisible,
      recordingName,
      addRecording,
    }
  },
})
</script>

<style lang="scss"></style>
