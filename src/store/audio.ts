import { defineStore } from 'pinia'

import { Recording, UpdateStatus } from '../types/recording'
export const useRecordingsStore = defineStore({
    id: 'audio',
    state: () => ({
        recordings: [] as Recording[]
    }),
    getters: {
        recordingsCount() {
            return this.recordings.length
        }
    },
    actions: {
        addRecording(rec: Recording) {
            this.recordings.push(rec)
        },

        removeRecording(index: number) {
            this.recordings.splice(index, 1)
        },

        updateRecordingState(status: UpdateStatus) {
            this.recordings[status.index].isPlaying = status.isPlaying
        }

    }
})