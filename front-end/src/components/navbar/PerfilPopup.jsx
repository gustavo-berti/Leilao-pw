import {Button} from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import Auth from '../../utils/auth';

const PerfilPopup = ({ user, onLogout }) => {
    const navigate = useNavigate();

    return (
        <div>
            <h3>Perfil</h3>
            <p>Nome: {user.name}</p>
            <p>Email: {user.email}</p>
            <br />
            <Button label="Meu perfil" icon="pi pi-user" onClick={() => navigate('/perfil')} />
            {Auth.hasRole(user, "ROLE_ADMIN") && <Button label="Admin" icon="pi pi-cog" onClick={() => navigate('/admin')} />}
            <Button label="Sair" icon="pi pi-sign-out" onClick={onLogout} />
        </div>
    );
}

export default PerfilPopup;