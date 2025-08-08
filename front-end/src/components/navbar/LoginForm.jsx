import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { loginSchema } from '../../schemas/loginSchema';

const LoginForm = ({ onLogin }) => {
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            await loginSchema.validate(formData, { abortEarly: false });
            console.log('Form submitted successfully:', formData);
            window.location.href = '/';
        } catch (validationErrors) {
            const formattedErrors = {};
            validationErrors.inner.forEach(error => {
                formattedErrors[error.path] = error.message;
            });
            setErrors(formattedErrors);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <>
            <div>
                <h3>Entrar</h3>
                <form onSubmit={handleLogin}>
                    <div className="field">
                        {errors.email && <small className='p-error'>{errors.email}</small>}
                        <InputText
                            placeholder="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                        />
                    </div>
                    <div className="field">
                        {errors.password && <small className='p-error'>{errors.password}</small>}
                        <InputText
                            placeholder="Senha"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            required
                        />
                    </div>
                    <div className="field">
                        <Button
                            label="Entrar"
                            type="submit"
                            className="w-full"
                            onClick={(handleSubmit)}
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