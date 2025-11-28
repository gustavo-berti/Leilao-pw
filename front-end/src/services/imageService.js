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

    async getImagesByAuctionId(auctionId) {
        try {
            const response = await this.api.get(`${this.endPoint}/auction/${auctionId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getImageUrl(imageName) {
        try {
            const response = await this.api.get(`/${this.endPoint}/file/${imageName}`, {
                responseType: 'blob'
            });
            const objectURL = URL.createObjectURL(response.data);
            return objectURL;
        } catch (error) {
            throw error;
        }
    }
}

export default ImageService;