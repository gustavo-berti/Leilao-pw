import api from '../config/axiosConfig'

class PersonService {
    static async recoverPassword(email, newPassword, token) {
        try {
            const response = await api.put(`/recover-password/change/${token}`, {
                email,
                newPassword
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            throw error;
        }
    }

    static async changePassword(email, password) {
        try {
            const response = await api.put('/people', {
                email,
                password
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            throw error;
        }
    }
}

export default PersonService;