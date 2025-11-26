import BaseService from "./baseService";

class PersonService extends BaseService {
    constructor() {
        super("/people");
    }

    async validateCurrentPassword(email, newPassword) {
        try {
            const response = await this.api.post(`${this.endPoint}/validate-password`, {
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
            const response = await this.api.put(`${this.endPoint}/change-password`, {
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
            profile: { id: 2 }
        }];
        try {
            const response = await this.api.post(`${this.endPoint}/create`, data);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar pessoa:', error);
            throw error;
        }
    }

    async listAllInactive() {
        try {
            const response = await this.api.get(`${this.endPoint}/inactive`);
            return response.data;
        } catch (error) {
            console.error('Erro ao listar pessoas inativas:', error);
            throw error;
        }
    }

    async getByName(name) {
        try {
            const response = await this.api.get(`${this.endPoint}/search?name=${name}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar pessoas por nome:', error);
            throw error;
        }
    }

    async restore(userId) {
        try {
            const response = await this.api.put(`${this.endPoint}/restore/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao restaurar pessoa:', error);
            throw error;
        }
    }

    async uploadAvatar(file, email) {
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            formData.append('email', email);
            const response = await this.api.put(`${this.endPoint}/upload-avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error uploading avatar:", error);
            throw error;
        }
    }

    async updateByEmail(data) {
        try {
            const response = await this.api.put(`${this.endPoint}/update?email=${data.email}`, data);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar pessoa por email:', error);
            throw error;
        }
    }
}

export default PersonService;