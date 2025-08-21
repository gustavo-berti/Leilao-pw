import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import React, { useRef } from 'react';
import LoginForm from './LoginForm';
import PerfilPopup from './PerfilPopup';
import './index.scss';
import { useNavigate } from 'react-router-dom';

const items = [
  {
    label: 'Início',
    icon: 'pi pi-fw pi-home',
    command: () => { navigate('/'); }
  },
];

  const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const loginPanel = useRef(null);
  const perfilPanel = useRef(null);

  const handleLoginSuccess = (userData) => {
    loginPanel.current.hide();
    setUser(userData);
  };

  const handleLogoutSuccess = () => {
    perfilPanel.current.hide();
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <nav>
        <Menubar
          className='navbar'
          model={items}
          end={user ? (<>
              <Button
                id="perfil-button"
                label="Perfil"
                icon="pi pi-user"
                className="p-button-text"
                onClick={(e) => perfilPanel.current.toggle(e)}
              />
              <OverlayPanel ref={perfilPanel} className='popup'>
                {<PerfilPopup user={user} onLogout={handleLogoutSuccess} />}
              </OverlayPanel>
            </>) : (<>
              <Button
                id="register-button"
                label="Registrar"
                icon="pi pi-user-plus"
                className="p-button-text"
                onClick={(e) => navigate('/registrar')}
              />
              <Button
                id='login-button'
                label="Entrar"
                icon="pi pi-user"
                className="p-button-text"
                onClick={(e) => loginPanel.current.toggle(e)}
              />
              <OverlayPanel ref={loginPanel} className="popup">
                {<LoginForm onLogin={handleLoginSuccess} position={loginPanel.current} />}
              </OverlayPanel>
            </>
          )}
        />
      </nav>
    </>
  )
}

export default Navbar;