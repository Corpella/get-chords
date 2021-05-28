export interface Recording {
    name: string,
    data: string,
    isPlaying: Boolean
}

export interface UpdateStatus {
    isPlaying: boolean,
    index: number
}
