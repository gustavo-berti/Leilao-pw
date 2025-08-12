import BaseService from "./baseService";

class AuthService extends BaseService {
    constructor(){
        super('/autenticacao');
    }

    async login(credentials){        
        const response = await this.api.post(`${this.endPoint}/login`, credentials);

        return response.data;
    }
}

export default AuthService;