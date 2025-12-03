import BaseService from "./baseService";

class FeedbackService extends BaseService {
    constructor() {
        super('/feedbacks');
    }

    async findByTargetPersonEmail(targetPersonEmail) {
        try {
            const response = await this.api.get(`${this.endPoint}/byTargetPerson/${targetPersonEmail}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar feedbacks do leilão:', error);
            return error;
        }
    }
}

export default FeedbackService; 