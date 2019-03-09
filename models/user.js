export default  class User {
    constructor(_id, _name, _email, _password) {
        this.id = _id
        this.name = _name
        this.email = _email
        this.password = _password
    }

    getName(){
        return this.name;
    }
    getEmail(){
        return this.email;
    }
    getPassword(){
        return this.password;
    }

    setName(name){
        this.name = name;
    }
    setName(email){
        this.email = email;
    }
    setName(password){
        this.password = password;
    }
}