import api from '../config/axiosConfig';

class tokenService {
    static async generate(email) {
        try {
            const response = await api.post(`api/people/recover-password/generate/${email}`);
            return response.data;
        } catch (error) {
            return null;
        }
    }

    static async isValid(token) {
        try {
            const response = await api.post(`api/people/recover-password/validate/${token}`);
            return response;
        } catch (error) {
            return false;
        }
    }
}

export default tokenService;