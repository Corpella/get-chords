<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  props: {},
  setup: () => {
    const noteNames: string[] = [
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
    const onMidiMessage = (midiEvent: WebMidi.MIDIMessageEvent) => {
      console.log('event', midiEvent)

      let data: Uint8Array = midiEvent.data
      if (data.length === 3) {
        // status is the first byte.
        let status = data[0]
        // command is the four most significant bits of the status byte.
        let command = status >>> 4
        // channel 0-15 is the lower four bits.
        let channel = status & 0xf

        console.log(
          `$Command: ${command.toString(16)}, Channel: ${channel.toString(16)}`
        )

        // just look at note on and note off messages.
        if (command === 0x9 || command === 0x8) {
          // note number is the second byte.
          let note = data[1]
          // velocity is the thrid byte.
          let velocity = data[2]

          let commandName = command === 0x9 ? 'Note On ' : 'Note Off'

          // calculate octave and note name.
          let octave = Math.trunc(note / 12)
          let noteName = noteNames[note % 12]

          console.log(`${commandName} ${noteName}${octave} ${velocity}`)
        }
      }
    }

    // const noteName: string = computed(() => {
    //   return note.toString()
    // })
    // var note
    var inputs

    const midiSuccess = (access: any) => {
      inputs = access.inputs
      inputs.forEach((entry: any) => {
        entry.onmidimessage = onMidiMessage
      })
    }
    onMounted(() => {
      window.navigator.requestMIDIAccess().then(midiSuccess)
    })
    return {}
  },
})
</script>

<style scoped></style>
