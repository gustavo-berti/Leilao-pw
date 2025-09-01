import BaseService from "./baseService";

class PersonService extends BaseService {
    constructor() {
        super("/people");
    }

    async validateCurrentPassword(email, newPassword) {
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

    async changePassword(email, newPassword) {
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

    async create(data) {
        data.personProfile = [{
            profile: {id:2}
        }];
        console.log(data);
        try {
            const response = await this.api.post('/create', data);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar pessoa:', error);
            throw error;
        }
    }
}

export default PersonService;