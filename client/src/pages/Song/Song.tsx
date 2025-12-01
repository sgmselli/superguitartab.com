import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";

import { getTabData, downloadTab } from '../../api/tabs';
import { TabViewer } from './components/TabViewer';
import { Heart } from 'lucide-react';
import { ContentNotFound } from '../../components/ContentNotFound';
import { Loading } from '../../components/Loading';
import type { DifficultyLevel } from '../../constants/difficulty';
import type { Genre } from '../../constants/genre';
import type { Style } from '../../constants/style';
import usePageTitle from '../../hooks/usePageTitle';
import { formatTitle } from '../../utils/wordFormatting';
import { useAuth } from '../../contexts/auth';
import { AuthRequiredModal } from '../../components/AuthRequiredModal';

const Song: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [numPages, setNumPages] = useState<number>(0);

    const [songName, setSongName] = useState<string | null>(null);
    const [artist, setArtist] = useState<string | null>(null);
    const [album, setAlbum] = useState<string | null>(null);
    const [genre, setGenre] = useState<Genre | null>(null);
    const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [lyricsIncluded, setLyricsIncluded] = useState<boolean | null>(null);
    const [style, setStyle] = useState<Style | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);
    // const [error, setError] = useState<string | null>(null);

    const { isAuthenticated } = useAuth();

    usePageTitle(`${songName} music tabular` || "Loading...");

    if (!id) {
        return <p>Invalid tab ID</p>;
    }

    useEffect(() => {
        const handleFetch = async () => {
            setLoading(true);
            try {
                const data = await getTabData(id);
                setSongName(data.song_name);
                setArtist(data.artist);
                setAlbum(data.album);
                setGenre(data.genre);
                setStyle(data.style);
                setDifficulty(data.difficulty);
                setDescription(data.description);
                setLyricsIncluded(data.lyrics_included)
                setFileName(data.file_name);
                setFileUrl(data.file_url);
                
            } catch (err: any) {
                // setError("");
            } finally {
                setLoading(false);
            }
        }
        handleFetch();
    }, [id])

    const handleDownload = async () => {
        if (!isAuthenticated()) {
            setShowAuthModal(true);
            return;
        }

        try {
            const data = await downloadTab(id);
            const downloadable_file_url = data.file_url
            if (!downloadable_file_url) {
                //Throw error
                return;
            }

            const response = await fetch(downloadable_file_url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;

            link.download = fileName || "superguitartab.com-tab";

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Download failed:", error);
        }
    }

    if (loading) {
        return (
            <div className='w-full h-[500px] flex items-center justify-center'>
                <Loading />
            </div>
        );
    }

    if (!fileUrl) {
        return <ContentNotFound />;
    }

    return (
        <>
            <div
                className='flex flex-col lg:flex-row gap-10 pt-6'
            >
                <div className='flex-1 flex flex-col gap-4'>
                    <div className='lg:hidden flex flex-col justify-center items-center bg-gray-100 p-5 gap-4 rounded-lg'>
                        <h1 className='text-2xl primary-color font-semibold '>Download {songName} now!</h1>
                        <button aria-label='Download song button for mobile' className='btn btn-lg w-full surface-color primary-color-bg rounded-lg' onClick={handleDownload}>Download tab</button>
                    </div>
                    <TabViewer pdfUrl={fileUrl} numPages={numPages} setNumPages={setNumPages} />
                </div>
                <div
                    className='flex-1 flex flex-col text-color'
                >
                    <div className='flex flex-col gap-2'>
                        <h1 className='text-4xl font-bold'>{songName}</h1>
                        <h3 className='text-lg font-semibold'>Composed by <span className='font-bold'>{artist} </span>- Digital sheet tab</h3>
                    </div>
            
                    <p className='text-md font-light mt-3'>Includes unlimited printable PDF downloads</p>

                    <p className='text-md font-light mt-5' >{description}</p>

                    <div className='flex flex-row gap-4 mt-8'>
                        <button aria-label='Download song button' className='btn btn-lg surface-color secondary-color-bg rounded-lg' onClick={handleDownload}>Download tab</button>
                        <button className='hidden btn btn-lg surface-color primary-color-bg rounded-lg'><Heart size={18} /> <span className='pl-2'>Support us</span></button>
                    </div>
                    
                    <div className='flex flex-row text-md gap-10 pt-8'>
                        <div className='flex flex-col font-semibold space-y-4'>
                            <p>Song:</p>
                            <p>Artist:</p>
                            <p>Album:</p>
                            <p>Genre:</p>
                            <p>Style:</p>
                            <p>Difficulty:</p>
                            <p>Lyrics included:</p>
                            <p>Pages:</p>
                            <p>Product #:</p>
                        </div>
                        <div className='flex flex-col space-y-4'>
                            <p>{songName}</p>
                            <p>{artist ? artist : "No artist"}</p>
                            <p>{album ? album : "No album"}</p>
                            <p>{formatTitle(genre)}</p>
                            <p>{formatTitle(style)}</p>
                            <p>{difficulty}</p>
                            <p>{lyricsIncluded ? "Yes" : "No"}</p>
                            <p>{numPages}</p>
                            <p>{id}</p>
                        </div>

                    </div>
                </div>
            </div>
            <AuthRequiredModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onRegister={() => {
                    setShowAuthModal(false);
                    navigate('/register');
                }}
                onLogin={() => {
                    setShowAuthModal(false);
                    navigate('/login');
                }}
            />
        </>
    )
}

export default Song;