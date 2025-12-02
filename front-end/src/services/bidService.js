import BaseService from "./baseService";

class BidService extends BaseService {
    constructor() {
        super('/bids');
    }

    async fetchValue(auctionId) {
        try{
            const response = await this.api.get(`${this.endPoint}/value/${auctionId}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar o valor do lance:', error);
            return error;
        }
    }
}

export default BidService;