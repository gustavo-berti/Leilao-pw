import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { personSchema } from '../../schemas/personSchema';
import {ShortContainer} from '../../components';
import { useNavigate } from 'react-router-dom';
import PersonService from '../../services/personService';
import './index.scss';

const Register = () => {
    const personService = new PersonService();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
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
            await personSchema.validate(formData, { abortEarly: false });
        } catch (validationErrors) {
            const formattedErrors = {};
            validationErrors.inner.forEach(error => {
                formattedErrors[error.path] = error.message;
            });
            setErrors(formattedErrors);
        }
        try {
            console.log(formData)
            await personService.create(formData);
            navigate('/');
        } catch (error) {
            console.error("Error creating person:", error);
        }
    };

    return (
        <>
            <ShortContainer>
                <h3>Nova Conta</h3>
                <form className="register-form">
                    <div className="p-field">
                        <label htmlFor="name">Nome</label>
                        <InputText id="name" placeholder="Digite seu nome" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                        {errors.name && <small className="p-error">{errors.name}</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" type="email" placeholder="Digite seu email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
                        {errors.email && <small className="p-error">{errors.email}</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="password">Senha</label>
                        <InputText id="password" type="password" placeholder="Digite sua senha" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} />
                        {errors.password && <small className="p-error">{errors.password}</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="confirmPassword">Confirmação de Senha</label>
                        <InputText id="confirmPassword" type="password" placeholder="Confirme sua senha" value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} />
                        {errors.confirmPassword && <small className="p-error">{errors.confirmPassword}</small>}
                    </div>
                    <div className="p-field" id='buttons'>
                        <Button label="Registrar" className="p-button-success" onClick={handleSubmit} />
                        <Button label="Cancelar" className="p-button-secondary" style={{ marginLeft: '10px' }} />
                    </div>
                </form>
            </ShortContainer>
        </>
    );
}

export default Register;