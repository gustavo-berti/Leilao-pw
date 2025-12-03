import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { personSchema } from '../../schemas/personSchema';
import { ShortContainer } from '../../components';
import { useNavigate } from 'react-router-dom';
import PersonService from '../../services/personService';
import './register.scss';

const Register = () => {
    const personService = new PersonService();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const validateField = async () => {
            try {
                await personSchema.validate(formData, { abortEarly: false });
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
        setTouched({ name: true, email: true, password: true, confirmPassword: true });
        try {
            await personSchema.validate(formData, { abortEarly: false });
        } catch (validationErrors) {
            const formattedErrors = {};
            validationErrors.inner.forEach(error => {
                formattedErrors[error.path] = error.message;
            });
            setErrors(formattedErrors);
        }
        try {
            await personService.create(formData);
            navigate('/');
        } catch (error) {
            console.error("Error creating person:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ShortContainer>
                <h3>Nova Conta</h3>
                <form className="register-form">
                    <div className="p-field">
                        <label htmlFor="name">Nome</label>
                        <InputText
                            id="name"
                            placeholder="Digite seu nome"
                            value={formData.name}
                            disabled={loading}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            onBlur={() => handleBlur("name")}
                        />
                        {errors.name && <small className="p-error">{errors.name}</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="email">Email</label>
                        <InputText
                            id="email" type="email" placeholder="Digite seu email" value={formData.email} disabled={loading} onChange={(e) => handleInputChange('email', e.target.value)} onBlur={() => handleBlur("email")} />
                        {errors.email && <small className="p-error">{errors.email}</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="password">Senha</label>
                        <InputText id="password" type="password" placeholder="Digite sua senha" value={formData.password}  disabled={loading} onChange={(e) => handleInputChange('password', e.target.value)} onBlur={() => handleBlur("password")} />
                        {errors.password && <small className="p-error">{errors.password}</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="confirmPassword">Confirmação de Senha</label>
                        <InputText id="confirmPassword" type="password" placeholder="Confirme sua senha" value={formData.confirmPassword} disabled={loading} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} onBlur={() => handleBlur("confirmPassword")} />
                        {errors.confirmPassword && <small className="p-error">{errors.confirmPassword}</small>}
                    </div>
                    <div className="p-field" id='buttons'>
                        <Button label="Registrar" className="p-button-success" onClick={handleSubmit} loading={loading} disabled={loading} />
                        <Button label="Cancelar" className="p-button-secondary" style={{ marginLeft: '10px' }} disabled={loading} />
                    </div>
                </form>
            </ShortContainer>
        </>
    );
}

export default Register;