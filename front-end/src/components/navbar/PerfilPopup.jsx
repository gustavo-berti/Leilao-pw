import {Button} from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const PerfilPopup = ({ user, onLogout }) => {
    const navigate = useNavigate();

    return (
        <div>
            <h3>Perfil</h3>
            <p>Nome: {user.name}</p>
            <p>Email: {user.email}</p>
            <br />
            <Button label="Sair" icon="pi pi-sign-out" onClick={onLogout} />
            <Button label="Alterar Senha" icon="pi pi-lock" onClick={() => navigate('/alterar-senha')} />
        </div>
    );
}

export default PerfilPopup;