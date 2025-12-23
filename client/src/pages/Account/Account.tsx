import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/auth';
import { Loading } from '../../components/Loading';
import { Link, Navigate } from 'react-router-dom';
import { type TabResponse } from '../../types/tab';
import { getCurrentUserDownloadedTabs } from '../../api/user';
import { SongTable } from '../../components/SongTable/SongTable';

const Account: React.FC = () => {

    const { user, loadingUser } = useAuth();

    const [tabs, setTabs] = useState<TabResponse[]>([]);
    
    const [loading, setLoading] = useState<boolean>(false);

    if (loadingUser) {
        return (
            <div>
                <Loading />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    useEffect(() => {
        const handleFetch = async () => {
            setLoading(true);
            try {
                const data = await getCurrentUserDownloadedTabs();
                setTabs(data);
            } catch {
                console.log("Failed to fetch tabs.");
            } finally {
                setLoading(false);
            }
        }
        handleFetch();
    }, []);

    return (
        <div
            className='flex flex-col mt-10 md:mt-15'
        >
            <div
                className='flex flex-col gap-3'
            >
                <h1 className='text-2xl md:text-3xl font-semibold text-color'>Welcome, {user.first_name}</h1>
                <p className='text-md md:text-lg text-gray-500'>Browse the guitar tabs you've downloaded.</p>
            </div>
            <div
                className='mt-10'
            >                {
                    loading ? (
                        <div
                            className="h-[500px] w-full flex justify-center items-center"
                        >
                            <Loading />
                        </div>
                    ) :
                    tabs.length < 1 ?
                        <p className="text-color">You have no downloaded songs. You can browse our selection of music sheets to download<Link to="/browse" className='underline text-blue-500'>here</Link>.</p>
                    :
                        <SongTable songs={tabs} />
                }
            </div>
        </div>
    )
}

export default Account;