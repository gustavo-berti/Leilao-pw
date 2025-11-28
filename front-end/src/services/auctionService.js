import BaseService from "./baseService";

class AuctionService extends BaseService {
    constructor() {
        super("auctions");
    }

    async insert(data, email) {
        try {
            data.incrementValue = 0;
            data.dateHourStart = new Date().toISOString();
            data.status = "OPEN";
            data.userEmail = email;
            const response = await this.api.post(`${this.endPoint}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getAll(page, size) {
        try {
            const response = await this.api.get(`${this.endPoint}/list`, {
                params: {
                    page,
                    size
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default AuctionService;