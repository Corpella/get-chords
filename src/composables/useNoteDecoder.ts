import { computed, onMounted, ref } from 'vue'
import { Note } from '../types/notation'
import { Recording } from '../types/recording'

export default function useNoteDecoder() {

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
    const getUpdatedPitch = () => {
        analyser.getFloatTimeDomainData(buf)
        var pitch = autoCorrelate(buf, audioContext!.sampleRate)

        if (pitch !== -1) {
            const n: Note = noteFromPitch(pitch)
            return n
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = window.webkitRequestAnimationFrame
        rafID = window.requestAnimationFrame(getUpdatedPitch)
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
    onMounted(() => {
        audioContext = new AudioContext()
    })
    return {}
}