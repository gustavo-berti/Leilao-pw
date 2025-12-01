import BaseService from "./baseService";

class AuctionService extends BaseService {
    constructor() {
        super("auctions");
    }

    async insert(data, email) {
        try {
            data.dateHourStart = new Date().toISOString();
            data.status = "OPEN";
            data.userEmail = email;
            const response = await this.api.post(`${this.endPoint}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getAll(page, size, title = "", dateHourEnd = "", categoryId = "", status = "", orderBy = "", direction = "") {
        try {
            const response = await this.api.get(`${this.endPoint}/list`, {
                params: {
                    page, size, title, dateHourEnd, categoryId, status, orderBy, direction
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            const response = await this.api.get(`${this.endPoint}/detail/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default AuctionService;