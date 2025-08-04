import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import React from 'react';
import './index.scss';

const items = [
  {
    label: 'Início',
    icon: 'pi pi-fw pi-home',
    command: () => { window.location.href = '/'; }
  },

];

const Navbar = () => {
  return (
    <>
      <nav>
        <Menubar className='navbar' 
        model={items} 
        end={<Button label="Entrar" icon="pi pi-user" className="p-button-text" onClick={() => { }} />} />
      </nav>
    </>
  )
}

export default Navbar;