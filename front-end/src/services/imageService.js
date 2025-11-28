import BaseService from "./baseService";

class ImageService extends BaseService {
    constructor() {
        super("images");
    }

    async uploadImages(auctionId, formData) {
        try {
            const response = await this.api.post(`${this.endPoint}/upload?auctionId=${auctionId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default ImageService;