import {Button} from 'primereact/button';

const PerfilPopup = ({ user, onLogout }) => {
    return (
        <div>
            <h3>Perfil</h3>
            <p>Nome: {user.name}</p>
            <p>Email: {user.email}</p>
            <br />
            <Button label="Sair" icon="pi pi-sign-out" onClick={onLogout} />
        </div>
    );
}

export default PerfilPopup;