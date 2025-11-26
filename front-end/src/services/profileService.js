import BaseService from "./baseService";

class ProfileService extends BaseService{
    constructor(){
        super("/profiles")
    }

    async getByName(name){
        try {
            const response = await this.api.get(`${this.endPoint}/search?profile=${name}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching profile by name:", error);
            throw error;
        }
    }
}

export default ProfileService