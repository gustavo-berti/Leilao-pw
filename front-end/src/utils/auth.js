class Auth {
    static hasRole(user, role){
        if(!user || !user.role) return false;
        return user.role === role;
    }
}

export default Auth;