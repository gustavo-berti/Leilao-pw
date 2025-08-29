import BaseService from "./baseService";

class RecoverPasswordService extends BaseService {
    constructor() {
        super("/recover-password");
    }

    static async recoverPassword(email, newPassword, token) {
        try {
            const response = await this.api.put(`/change/${token}`, {
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

export default RecoverPasswordService;