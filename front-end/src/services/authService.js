import BaseService from "./baseService";

class AuthService extends BaseService {
    constructor() {
        super('/auth');
    }

    async login(credentials) {
        const response = await this.api.post(`${this.endPoint}/login`, credentials);

        return response.data;
    }

    async validateToken(credentials) {
        try {
            const response = await this.api.post(`${this.endPoint}/validate`, credentials);
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
}

export default AuthService;