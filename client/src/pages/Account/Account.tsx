import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/auth';
import { Loading } from '../../components/Loading';
import { Link, Navigate } from 'react-router-dom';
import { MoveRight } from 'lucide-react';
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
                <p className='text-md md:text-lg text-gray-500'>Here you can browse the guitar tabs you've already downloaded. Keep practicing!</p>
            </div>
            <div
                className='flex flex-col mt-10 gap-5'
            >
                <h2 className='text-lg font-semibold text-color'>Your downloaded tabs</h2>
                {
                    loading ? (
                        <div
                            className="h-[500px] w-full flex justify-center items-center"
                        >
                            <Loading />
                        </div>
                    ) :
                    tabs.length < 1 ?
                        <DownloadedTabsNone />
                    :
                        <SongTable songs={tabs} />
                }
            </div>
        </div>
    )
}

const DownloadedTabsNone: React.FC = () => {
    return (
        <div className="w-full h-[400px] border-3 border-dotted border-base-600 rounded-xl flex flex-col items-center justify-center text-center p-6">
            <h2 className="text-2xl font-semibold mb-2">
                Oh no, you haven't downloaded any tabs yet
            </h2>

            <p className="text-lg text-gray-500 mb-8">
                When you download tabs they will appear here
            </p>

            <div>
                <Link to="/browse"><button className='btn btn-md sm:btn-lg rounded-lg primary-color-bg surface-color'>Browse songs <span className='ml-1'><MoveRight size={20} /></span></button></Link>
            </div>
        </div>
    );
};

export default Account;