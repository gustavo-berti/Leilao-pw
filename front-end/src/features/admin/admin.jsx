import LongContainer from '../../components/longContainer/longContainer';
import { Button } from 'primereact/button';
import UsersTable from './users/UsersTable';
import ProfilesTable from './profiles/ProfilesTable';
import { useState } from 'react';
import './admin.scss';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('users');
    return (
        <LongContainer>
            <h1>Painel Administrativo</h1>
            <div className="row">
                <Button id='users' label="Usuários" icon="pi pi-users" onClick={() => setActiveTab('users')}/>
                <Button id='profiles' label="Perfis" icon="pi pi-user" onClick={() => setActiveTab('profiles')} />
            </div>
            <div className='content'>
                {activeTab === 'users' &&(
                    <UsersTable/>
                )}
                {activeTab === 'profiles' &&(
                   <ProfilesTable/>
                )}
            </div>
        </LongContainer>
    );
}

export default Admin;
