import BaseService from "./baseService";

class PaymentService extends BaseService {
    constructor() {
        super('/payments');
    }

    async pay(auctionId) {
        return this.api.post(this.endPoint, { auctionId: auctionId });
    }
}

export default PaymentService;