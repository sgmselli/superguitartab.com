import type { Style } from "../constants/style"
import type { Genre } from "../constants/genre"
import type { DifficultyLevel } from "../constants/difficulty"

export interface TabResponse {
    id: number
    song_name: string
    artist: string
    album: string
    genre: Genre
    style: Style
    difficulty: DifficultyLevel
    description: string
    lyrics_included: boolean
    file_name: string
    file_url: string | null
}

export interface TabFileUrlResponse {
    file_url: string | null
}