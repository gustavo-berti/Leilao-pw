class Auth {
    static async hasRole(user, role){
        return user.role === role;
    }
}

export default Auth;