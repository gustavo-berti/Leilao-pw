import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { loginSchema } from '../../schemas/loginSchema';
import AuthService from '../../services/authService';

const LoginForm = ({ onLogin }) => {
    const authService = new AuthService();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({});
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        const validateField = async () => {
            try {
                await loginSchema.validate(formData, { abortEarly: false });
                setErrors({});
            } catch (validationErrors) {
                const formattedErrors = {};
                validationErrors.inner.forEach(error => {
                    if (touched[error.path]) {
                        formattedErrors[error.path] = error.message;
                    }
                });
                setErrors(formattedErrors);
            }
        };
        const timeoutId = setTimeout(validateField, 300);
        return () => clearTimeout(timeoutId);
    }, [formData, touched]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleBlur = (field) => {
        setTouched(prev => ({
            ...prev,
            [field]: true
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        setTouched({ email: true, password: true });
        try {
            await loginSchema.validate(formData, { abortEarly: false });
        } catch (validationErrors) {
            const formattedErrors = {};
            validationErrors.inner.forEach(error => {
                formattedErrors[error.path] = error.message;
            });
            setErrors(formattedErrors);
        }
        try {
            const response = await authService.login(formData);
            localStorage.setItem('user', JSON.stringify(response));
            onLogin(response);
        } catch (error) {
            const formattedError = {};
            formattedError[error.name] = error.response.data.message;
            console.log(error.response.data.message);
            console.log(formattedError);
            setErrors(formattedError);
        } finally {
            setLoading(false);
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
                            onBlur={() => handleBlur("email")}
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
                            onBlur={() => handleBlur("password")}
                            required
                        />
                    </div>
                    <div className="field">
                        {errors.AxiosError && <small className='p-error'>{errors.AxiosError}</small>}
                        <Button
                            label="Entrar"
                            type="submit"
                            className="w-full"
                            onClick={(handleSubmit)}
                            loading={loading}
                            disabled={loading}
                        />
                    </div>
                    <div className="field">
                        <a href="/recuperar-senha" className="p-link">Esqueci minha senha</a>
                    </div>
                </form>
            </div>
        </>
    );
}

export default LoginForm;