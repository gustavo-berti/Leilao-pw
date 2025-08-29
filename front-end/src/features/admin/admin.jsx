import LongContainer from '../../components/longContainer/longContainer';
import { Button } from 'primereact/button';
import'./admin.scss';

const Admin = () => {
    return (
        <LongContainer>
            <h1>Painel Administrativo</h1>
            <div className="row">
                <Button id='users' label="Usuários" icon="pi pi-users" />
                <Button id='role' label="Perfis" icon="pi pi-user" />
            </div>
            <div className='content'>
                
            </div>
        </LongContainer>
    );
}

export default Admin;
