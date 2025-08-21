import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ShortContainer } from '../../components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { changePasswordSchema } from '../../schemas/changePasswordSchema';
import tokenService from '../../services/tokenService';
import personService from '../../services/personService';   
import './index.scss';

const RecoverPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState(searchParams.get('token'));
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const checkToken = async () => {
            if (token) {
                const response = await tokenService.isValid(token);
                if (response.status !== 200) {
                    setToken(null);
                    navigate('/recuperar-senha/', { replace: true });
                } else {
                    setToken(token);
                    navigate('/recuperar-senha/', { replace: true });
                }
            }
        };
        checkToken();
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await tokenService.generate(email);
            console.log(response);
            if (response.valid) {

            }
            setMessage('Email de recuperação enviado com sucesso!');
        } catch (error) {
            setMessage('Erro ao enviar email de recuperação.');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await changePasswordSchema.validate({ password, confirmPassword }, {abortEarly: false});
            console.log('Senha alterada com sucesso!');
        } catch (validationErrors) {
            const formattedErrors = {};
            if (validationErrors.inner && validationErrors.inner.length > 0) {
                validationErrors.inner.forEach(error => {
                    formattedErrors[error.path] = error.message;
                });
            } else if (validationErrors.path) {
                formattedErrors[validationErrors.path] = validationErrors.message;
            }
            console.log('Validation errors:', formattedErrors);
            setErrors(prevErrors => ({ ...prevErrors, ...formattedErrors }));
            return;
        }
        try {
            await personService.recoverPassword(email, password, token);
            console.log('Senha alterada com sucesso!');
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
        }
    };

    return (
        <>
            {token ? (
                <ShortContainer>
                    <h3>Redefinir Senha</h3>
                    <p>Digite sua nova senha.</p>
                    <form onSubmit={handleChangePassword}>
                        <div className='p-field'>
                            <label htmlFor="password">Nova Senha</label>
                            <InputText
                                id="password"
                                type="password"
                                placeholder="Digite sua nova senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {errors.password && <small className="p-error">{errors.password}</small>}
                        </div>
                        <div className='p-field'>
                            <label htmlFor="confirmPassword">Confirmar Senha</label>
                            <InputText
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirme sua nova senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {errors.confirmPassword && <small className="p-error">{errors.confirmPassword}</small>}
                        </div>
                        <div className="p-field" id='buttons'>
                            <Button
                                label="Alterar Senha"
                                className="p-button-primary"
                                type="submit"
                            />
                        </div>
                    </form>
                </ShortContainer>
            ) : (
                <ShortContainer>
                    <h3>Recuperar Senha</h3 >
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
                </ShortContainer >
            )}
        </>
    );
}

export default RecoverPassword;