import api from '../config/axiosConfig'

class PersonService {
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