import React from 'react'
import { useAuth } from '../../contexts/auth';
import { Loading } from '../../components/Loading';

const Account: React.FC = () => {

    const { user, loadingUser } = useAuth();

    return (
        <div
        
        >
            Account
            {loadingUser ?
                <Loading />
            :
                <div>
                <p>{user?.first_name}</p>
                <p>{user?.last_name}</p>
                <p>{user?.email}</p>
                <p>{user?.id}</p>

                </div>
            }
        </div>
    )

}

export default Account;