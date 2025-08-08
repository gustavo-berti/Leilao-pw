import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import {ShortContainer} from '../../components';
import './index.scss';

const RecoverPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setMessage('Email de recuperação enviado com sucesso!');
        } catch (error) {
            setMessage('Erro ao enviar email de recuperação.');
        }
    };

    return (
        <ShortContainer>
            <h3>Recuperar Senha</h3>
            <p>Digite seu email para receber as instruções de recuperação.</p>
            
            <form onSubmit={handleSubmit}>
                <div className="p-field">
                    <label htmlFor="email">Email</label>
                    <InputText 
                        id="email"
                        type="email"
                        placeholder="Digite seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                
                {message && (
                    <div className="p-field">
                        <small className={message.includes('sucesso') ? 'p-success' : 'p-error'}>
                            {message}
                        </small>
                    </div>
                )}
                
                <div className="p-field" id='buttons'>
                    <Button 
                        label="Enviar"
                        className="p-button-primary" 
                        type="submit"
                    />
                    <Button 
                        label="Voltar" 
                        className="p-button-secondary" 
                        type="button"
                        onClick={() => window.location.href = '/'}
                    />
                </div>
            </form>
        </ShortContainer>
    );
}

export default RecoverPassword;