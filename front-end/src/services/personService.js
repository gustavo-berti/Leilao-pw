import BaseService from "./baseService";

class PersonService extends BaseService {
    constructor() {
        super("/people");
    }

    static async validateCurrentPassword(email, newPassword) {
        try {
            const response = await this.api.post('/validate-password', {
                email,
                newPassword
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao validar senha atual:', error);
            throw error;
        }
    }

    static async changePassword(email, newPassword) {
        try {
            const response = await this.api.put('/change-password', {
                email,
                newPassword
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            throw error;
        }
    }
}

export default PersonService;