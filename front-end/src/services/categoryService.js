import BaseService from "./baseService";

class CategoryService extends BaseService{
    constructor(){
        super("/categories")
    }

    async getByName(name){
        try {
            const response = await this.api.get(`${this.endPoint}/search?name=${name}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching profile by name:", error);
            throw error;
        }
    }
    
    async getAll(){
        const response = await this.api.get(`${this.endPoint}/list`);
        return response.data;
    }
}

export default CategoryService