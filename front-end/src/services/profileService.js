import BaseService from "./baseService";

class ProfileService extends BaseService{
    constructor(){
        super("/profiles")
    }
}

export default ProfileService