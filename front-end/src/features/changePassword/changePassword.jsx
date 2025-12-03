import { React, useState, useEffect } from 'react';
import { ShortContainer } from '../../components'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { changePasswordSchema } from '../../schemas/changePasswordSchema';
import { useNavigate } from 'react-router-dom';
import PersonService from '../../services/personService';
import './changePassword.scss';

const ChangePassword = () => {
    const personService = new PersonService();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        currentPassword: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const validateField = async () => {
            try {
                await changePasswordSchema.validate(formData, { abortEarly: false });
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
        setMessage('');
        setLoading(true);
        setTouched({ currentPassword: true, password: true, confirmPassword: true });
        try {
            await changePasswordSchema.validate(formData, { abortEarly: false });
        } catch (validationErrors) {
            const formattedErrors = {};
            console.error('Validation errors:', validationErrors);
            validationErrors.inner.forEach(error => {
                formattedErrors[error.path] = error.message;
            });
            setErrors(formattedErrors);
        }
        try {
            const isValid = await personService.validateCurrentPassword(user.email, formData.currentPassword);
            if (!isValid) {
                setErrors(errors => ({ ...errors, currentPassword: 'Senha atual inválida' }));
                return;
            }
            await personService.changePassword(user.email, formData.password);
            setMessage('Senha alterada com sucesso!');
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
        } finally {
            setLoading(false);
        }
    };
    return (<>
        <ShortContainer>
            <h3>Alterar Senha</h3>
            <form onSubmit={handleSubmit}>
                <div className="p-field">
                    <label htmlFor="currentPassword">Senha Atual</label>
                    <InputText id="currentPassword" value={formData.currentPassword} type="password" placeholder="Digite sua senha atual" disabled={loading} onChange={(e) => handleInputChange('currentPassword', e.target.value)} onBlur={() => handleBlur("currentPassword")} />
                    {errors.currentPassword && <small className="p-error">{errors.currentPassword}</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="newPassword">Nova Senha</label>
                    <InputText id="newPassword" value={formData.password} type="password" placeholder="Digite sua nova senha"  disabled={loading} onChange={(e) => handleInputChange('password', e.target.value)} onBlur={() => handleBlur("password")} />
                    {errors.password && <small className="p-error">{errors.password}</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="confirmNewPassword">Confirme a Nova Senha</label>
                    <InputText id="confirmNewPassword" value={formData.confirmPassword} type="password" placeholder="Confirme sua nova senha" disabled={loading} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} onBlur={() => handleBlur("confirmPassword")} />
                    {errors.confirmPassword && <small className="p-error">{errors.confirmPassword}</small>}
                </div>
                {message && (
                    <div className="p-field">
                        <small className={message.includes('sucesso') ? 'p-success' : 'p-error'}>
                            {message}
                        </small>
                    </div>
                )}
                <div className="p-field" id='buttons'>
                    <Button label="Alterar Senha" type='submit' className="p-button-success" loading={loading} disabled={loading} />
                    <Button label="Cancelar" type='button' className="p-button-secondary" onClick={() => navigate(-1)} disabled={loading} />
                </div>
            </form>
        </ShortContainer>
    </>);
}

export default ChangePassword;