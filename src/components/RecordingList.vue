<template>
  <div class="flex">
    <div class="w-1/3">
      <div v-for="(recording, index) in audio.recordings" :key="index">
        <div
          class="recordings-player flex justify-between mb-10 rounded-xl ml-20"
        >
          <div class="absolute top-0 right-0 mt-"></div>
          <div class="w-2/3 content-center">
            <p class="text-2xl font-bold text-white">
              {{ recording.name }}
            </p>
          </div>
          <div class="w-1/3 flex justify-between content-center mr-5">
            <div>
              <div
                class="cursor-pointer hover:text-red-600"
                @click="removeRecording(index)"
              >
                <i class="el-icon-delete-solid text-5xl"></i>
              </div>
            </div>
            <div>
              <button
                @click="togglePlay(recording, index)"
                class="play button button--play"
              >
                <div v-if="recording.isPlaying">
                  <i class="fa fa-pause"></i>
                </div>

                <div v-else><i class="fa fa-play"></i></div>
              </button>

              <audio
                :src="recording.data"
                class="audio audio audio--hidden"
                controls
                :ref="setRecRef"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-2/3">
      <div class="content-center mt-10">
        <el-card shadow="always">
          <p class="text-6xl mx-4">{{ noteToDisplayName }}</p>
        </el-card>
      </div>
      <div class="content-center mt-10">
        <p class="text-6xl text-white">{{ notesToDisplayArray }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUpdate, onMounted, ref } from 'vue'
import { useRecordingsStore } from '../store/audio'
import { Recording } from '../types/recording'
import { Note } from '../types/notation'

export default defineComponent({
  setup: () => {
    // List
    let recRef: HTMLAudioElement[] = []
    const setRecRef = (el: HTMLAudioElement) => {
      if (el) {
        recRef.push(el)
      }
    }
    onBeforeUpdate(() => {
      recRef = []
    })


    const audio = useRecordingsStore()


    const noteToDisplayName = ref<Note | '-'>('-')

    const notesSequence = ref<Note[]>([])

    const notesToDisplayArray = computed(() => {
      return notesSequence.value.join(', ')
    })
    const removeRecording = (index: number) => {
      audio.removeRecording(index)
      notesSequence.value = []
    }

    //Note Management
    let rafID: any = null
    let buf = new Float32Array(2048)
    let sourceNode: any | null = null
    let theBuffer: any = null

    let audioContext: AudioContext | null = null
    let analyser: any = null
    var noteStrings: Note[] = [
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B',
    ]
    //Get note name
    const noteFromPitch = (frequency: number): Note => {
      const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2))
      const pitch = Math.round(noteNum) + 69
      return noteStrings[pitch % 12]
    }
    const updatePitch = () => {
      analyser.getFloatTimeDomainData(buf)
      var pitch = autoCorrelate(buf, audioContext!.sampleRate)

      if (pitch !== -1) {
        const n: Note = noteFromPitch(pitch)
        noteToDisplayName.value = n
        const lastNote: Note =
          notesSequence.value[notesSequence.value.length - 1]
        if (lastNote !== n) {
          notesSequence.value.push(n)
        }
      }

      if (!window.requestAnimationFrame)
        window.requestAnimationFrame = window.webkitRequestAnimationFrame
      rafID = window.requestAnimationFrame(updatePitch)
    }
    const togglePlayback = (stop: Boolean) => {
      if (stop) {
        //stop playing and return
        sourceNode!.stop()
        sourceNode = null
        analyser = null
        if (!window.cancelAnimationFrame)
          window.cancelAnimationFrame = window.webkitCancelAnimationFrame
        window.cancelAnimationFrame(rafID)
        return 'start'
      }
      sourceNode = audioContext!.createBufferSource()

      sourceNode.buffer = theBuffer

      analyser = audioContext!.createAnalyser()
      analyser.fftSize = 2048
      sourceNode.connect(analyser)
      analyser.connect(audioContext!.destination)
      sourceNode.start(0)
      updatePitch()

      return 'stop'
    }

    const autoCorrelate = (buf: Float32Array, sampleRate: any) => {
      // Implements the ACF2+ algorithm
      var SIZE = buf.length
      var rms = 0

      for (var i = 0; i < SIZE; i++) {
        var val = buf[i]
        rms += val * val
      }
      rms = Math.sqrt(rms / SIZE)
      if (rms < 0.01)
        // not enough signal
        return -1

      var r1 = 0,
        r2 = SIZE - 1,
        thres = 0.2
      for (var i = 0; i < SIZE / 2; i++)
        if (Math.abs(buf[i]) < thres) {
          r1 = i
          break
        }
      for (var i = 1; i < SIZE / 2; i++)
        if (Math.abs(buf[SIZE - i]) < thres) {
          r2 = SIZE - i
          break
        }

      buf = buf.slice(r1, r2)
      SIZE = buf.length

      var c = new Array(SIZE).fill(0)
      for (var i = 0; i < SIZE; i++)
        for (var j = 0; j < SIZE - i; j++) c[i] = c[i] + buf[j] * buf[j + i]

      var d = 0
      while (c[d] > c[d + 1]) d++
      var maxval = -1,
        maxpos = -1
      for (var i = d; i < SIZE; i++) {
        if (c[i] > maxval) {
          maxval = c[i]
          maxpos = i
        }
      }
      var T0 = maxpos

      var x1 = c[T0 - 1],
        x2 = c[T0],
        x3 = c[T0 + 1],
        a = (x1 + x3 - 2 * x2) / 2,
        b = (x3 - x1) / 2
      if (a) T0 = T0 - b / (2 * a)

      return sampleRate / T0
    }

    const togglePlay = (sr: Recording, index: number) => {
      const currentRec = recRef[index]
      if (sr.isPlaying) {
        currentRec.pause()
        audio.updateRecordingState({ isPlaying: false, index: index })
      } else {
        var request = new XMLHttpRequest()
        request.open('GET', sr.data, true)
        request.responseType = 'arraybuffer'
        request.onload = () => {
          audioContext!.decodeAudioData(request.response, function (buffer) {
            currentRec.play()
            audio.updateRecordingState({ isPlaying: true, index: index })
            theBuffer = buffer
            notesSequence.value = []
            togglePlayback(false)
          })
        }
        request.send()
      }

      currentRec.addEventListener('ended', () => {
        currentRec.currentTime = 0
        audio.updateRecordingState({ isPlaying: false, index: index })
        // togglePlayback(true)
      })
    }
    onMounted(() => {
      audioContext = new AudioContext()
    })
    return {
      togglePlay,
      audio,
      setRecRef,
      noteToDisplayName,
      notesToDisplayArray,
      removeRecording,
    }
  },
})
</script>

<style lang="scss">
.recordings-player {
  text-align: center;
  width: 300px;
  height: 120px;
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(48, 48, 70, 1) 35%,
    rgba(0, 212, 255, 1) 100%
  );
}
</style>
