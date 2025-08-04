import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import React, { useRef } from 'react';
import LoginForm from './LoginForm';
import './index.scss';

const items = [
  {
    label: 'Início',
    icon: 'pi pi-fw pi-home',
    command: () => { window.location.href = '/'; }
  },
];

const Navbar = () => {
  const loginPanel = useRef(null);

  const handleLoginSuccess = () => {
    loginPanel.current.hide();
  };

  return (
    <>
      <nav>
        <Menubar
          className='navbar'
          model={items}
          end={
            <>
              <Button
                id='login-button'
                label="Entrar"
                icon="pi pi-user"
                className="p-button-text"
                onClick={(e) => loginPanel.current.toggle(e)}
              />
              <OverlayPanel ref={loginPanel} className="login-popup">
                {<LoginForm onLogin={handleLoginSuccess} position={loginPanel.current} />}
              </OverlayPanel>
            </>
          }
        />
      </nav>
    </>
  )
}

export default Navbar;