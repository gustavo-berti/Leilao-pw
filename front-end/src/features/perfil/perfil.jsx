import { useRef, useState, useEffect } from 'react';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import LongContainer from '../../components/longContainer/longContainer.jsx';
import './perfil.scss';
import PersonService from '../../services/personService.js';
import PersonalAuctions from './PersonalAuctions.jsx';

const Perfil = () => {
    const avatarInputRef = useRef(null);
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : {};
    });
    const personService = new PersonService();
    const [isEditing, setIsEditing] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({
        name: user.name,
        email: user.email
    });

    useEffect(() => {
        if (user.profilePicture && user.profilePicture.length > 0) {
            const imageUrl = `data:image/jpeg;base64,${user.profilePicture}`;
            setAvatar(imageUrl);
        }
    }, [user.profilePicture]);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const updatedPerson = await personService.uploadAvatar(file, user.email);
        const updatedUser = { ...user, profilePicture: updatedPerson.profilePicture };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setAvatar(`data:image/jpeg;base64,${updatedPerson.profilePicture}`);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            await personService.updateByEmail(userData);
            const updatedUser = { ...user, ...userData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setIsEditing(false);
        } catch (error) {
            const errorObj = {};
            error.response.data.details.forEach(detail => {
                const [field, message] = detail.split(': ');
                errorObj[field] = message;
            });
            setErrors(errorObj)
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setUserData({
            name: user.name,
            email: user.email
        });
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
                                image={avatar || null}
                                label={!avatar ? (user?.name?.[0] || user?.email?.[0])?.toUpperCase() : null}
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
                            {isEditing ? (
                                <>
                                    <div>
                                        <div className='p-field'>
                                            <InputText placeholder="Nome" id="name" name="name" value={userData.name} onChange={handleInputChange} />
                                            {errors.name && <small className="p-error">{errors.name}</small>}
                                        </div>
                                        <div className='p-field'>
                                            <InputText placeholder="Email" id="email" name="email" value={userData.email} onChange={handleInputChange} />
                                            {errors.email && <small className="p-error">{errors.email}</small>}
                                        </div>
                                    </div>
                                    <div>
                                        <Button label="Salvar" icon="pi pi-check" onClick={handleSave} className='p-button-success' loading={isLoading} disabled={isLoading} />
                                        <Button label="Cancelar" icon="pi pi-times" onClick={handleCancel} className="p-button-danger" loading={isLoading} disabled={isLoading} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p><strong>Nome:</strong> {userData.name}</p>
                                    <p><strong>Email:</strong> {userData.email}</p>
                                    <Button onClick={() => setIsEditing(true)}>Editar</Button>
                                </>
                            )}
                        </div>
                    </div>
                }
            </LongContainer>
            <LongContainer>
                <PersonalAuctions email={user.email} />
            </LongContainer>
        </>
    );
}

export default Perfil;


