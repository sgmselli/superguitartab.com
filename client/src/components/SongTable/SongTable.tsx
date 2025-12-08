import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import type { TabResponse } from "../../types/tab"
import { formatTitle } from "../../utils/wordFormatting"

interface SongTableProps {
    songs: TabResponse[]
}

interface SongTableRowProps {
    id: number
    song: string
    artist: string
    album: string
    genre: string
    style: string
    level: string
}

interface LevelBadgeProps {
    level: string
}

export const SongTable: React.FC<SongTableProps> = ({songs}) => {
    return (
        <div className="overflow-x-auto rounded-box border-2 border-base-content/6 bg-base-100">
            <table className="table px-3 [&_td]:py-5" aria-label="Downloaded tabs table">
                <tbody>
                    {songs.map((song) => {
                        return <SongTableRow key={song.id} id={song.id} song={song.song_name} artist={song.artist} album={song.album} genre={song.genre} style={song.style} level={song.difficulty} />
                    })}
                </tbody>
            </table>
        </div>
    )
}

const LevelBadge: React.FC<LevelBadgeProps> = ({level}) => {
    switch (level) {
        case "Beginner":
            return <div className="badge badge-soft badge-success">Beginner</div>
        case "Intermediate":
            return <div className="badge badge-soft badge-warning">Intermediate</div>
        case "Advanced":
            return <div className="badge badge-soft badge-error">Advanced</div>
        default:
            return <div className="badge badge-ghost">Unknown</div>
    }
}

const SongTableRow: React.FC<SongTableRowProps> = ({id, song, artist, album, genre, style, level}) => {
    return (
        <tr className="text-color">
            <td className="w-60"><div className="flex flex-col gap-1"><h4 className="text-md text-color font-semibold">{song}</h4><h5 className="text-sm text-gray-500">{album}</h5></div></td>
            <td className="w-50 font-medium">{artist ? artist : "Traditional"}</td>
            <td className="w-35">{formatTitle(genre)}</td>
            <td className="w-35">{formatTitle(style)}</td>
            <td className="w-40">{<LevelBadge level={level} />}</td>
            <td className="w-50"><Link to={`/song/${id}`}><button className='btn w-[160px] secondary-color-bg border-1 border-yellow-500 surface-color'>Go to product <ChevronRight size={18} /></button></Link></td>
        </tr>
    )
}