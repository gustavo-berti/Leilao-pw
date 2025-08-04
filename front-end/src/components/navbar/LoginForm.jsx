import React, { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const LoginForm = ({ onLogin }) => {
    const handleLogin = (e) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <>
            <div className="login-popup">
                <h3>Entrar</h3>
                <form onSubmit={handleLogin}>
                    <div className="field">
                        <InputText
                            placeholder="Email"
                            type="email"
                            required
                        />
                    </div>
                    <div className="field">
                        <InputText
                            placeholder="Senha"
                            type="password"
                            required
                        />
                    </div>
                    <div className="field">
                        <Button
                            label="Entrar"
                            type="submit"
                            className="w-full"
                        />
                    </div>
                    <div className="field">
                        <a href="/recuperar-senha" className="p-link">Esqueci minha senha</a>
                    </div>
                    <div className="field">
                        Não tem uma conta? <a href="/registrar" className="p-link">Registrar</a>
                    </div>
                </form>
            </div>
        </>
    );
}

export default LoginForm;