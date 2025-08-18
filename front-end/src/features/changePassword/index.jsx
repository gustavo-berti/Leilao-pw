import { React, useState } from 'react';
import { ShortContainer } from '../../components'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { changePasswordSchema } from '../../schemas/changePasswordSchema';
import { useNavigate } from 'react-router-dom';
import personService from '../../services/personService';

const ChangePassword = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        currentPassword: '',
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
        setMessage('');

        try {
            await changePasswordSchema.validate(formData, { abortEarly: false });
            setMessage('Senha alterada com sucesso!');
        } catch (validationErrors) {
            const formattedErrors = {};
            console.error('Validation errors:', validationErrors);
            validationErrors.inner.forEach(error => {
                formattedErrors[error.path] = error.message;
            });
            setErrors(formattedErrors);
        }
        try {
            await personService.changePassword(user.email, formData.password);
            setMessage('Senha alterada com sucesso!');
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            setMessage('Erro ao alterar senha');
        }
    };
    return (<>
        <ShortContainer>
            <h3>Alterar Senha</h3>
            <form onSubmit={handleSubmit}>
                <div className="p-field">
                    <label htmlFor="currentPassword">Senha Atual</label>
                    <InputText id="currentPassword" value={formData.currentPassword} type="password" placeholder="Digite sua senha atual" onChange={(e) => handleInputChange('currentPassword', e.target.value)} />
                    {errors.currentPassword && <small className="p-error">{errors.currentPassword}</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="newPassword">Nova Senha</label>
                    <InputText id="newPassword" value={formData.password} type="password" placeholder="Digite sua nova senha" onChange={(e) => handleInputChange('password', e.target.value)} />
                    {errors.password && <small className="p-error">{errors.password}</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="confirmNewPassword">Confirme a Nova Senha</label>
                    <InputText id="confirmNewPassword" value={formData.confirmPassword} type="password" placeholder="Confirme sua nova senha" onChange={(e) => handleInputChange('confirmPassword', e.target.value)} />
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
                    <Button label="Alterar Senha" type='submit' className="p-button-success" />
                    <Button label="Cancelar" type='button' className="p-button-secondary" onClick={() => window.location.href = '/'} />
                </div>
            </form>
        </ShortContainer>
    </>);
}

export default ChangePassword;