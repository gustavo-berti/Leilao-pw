import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const Login = () => {
    return (
        <>
            <h1>Leilão ta pagando!</h1>
            <p>Entre com suas credenciais para acessar o sistema.</p>
            <InputText placeholder="Email" />
            <InputText placeholder="Senha" type="password" />
            <Button label="Entrar" />
        </>
    );
}

export default Login;