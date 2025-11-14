import { useRef } from 'react';
import { Avatar } from 'primereact/avatar';
import LongContainer from '../../components/longContainer/longContainer.jsx';
import './perfil.scss';
import ProfileService from '../../services/profileService.js';

const Perfil = () => {
    const avatarInputRef = useRef(null);
    const storedUser = localStorage.getItem('user');
    const profileService = new ProfileService();
    const profileImage = URL.createObjectURL(new Blob([new Uint8Array(JSON.parse(localStorage.getItem('profileImage') || '[]'))], { type: 'image/png' }));

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => setAvatar(reader.result);
        reader.readAsDataURL(file);

        await profileService.uploadAvatar(file);
    };

    return (
        <>
            <LongContainer>
                <h2>Meu Perfil</h2>
                {
                    <div className="perfil-info">
                        <div className='avatar' onClick={() => avatarInputRef.current?.click()}>
                            <Avatar
                                icon="pi pi-user"
                                image={profileImage || null}
                                label={!profileImage ? (JSON.parse(storedUser)?.name?.[0] || JSON.parse(storedUser)?.email?.[0])?.toUpperCase() : null}
                                shape="circle"
                                size='xlarge'
                            />
                            <input
                                type="file"
                                accept='image/*'
                                ref={avatarInputRef}
                                onChange={handleAvatarChange}
                                className='hidden'
                            />
                        </div>
                        <div className='details'>
                            <p><strong>Nome:</strong> {JSON.parse(storedUser).name}</p>
                            <p><strong>Email:</strong> {JSON.parse(storedUser).email}</p>
                        </div>
                    </div>
                }
            </LongContainer>
        </>
    );
}

export default Perfil;


