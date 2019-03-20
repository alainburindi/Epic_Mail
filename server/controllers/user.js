export default class UserController {
    constructor(){
        this.usersList =[];
    }

    async save(user){
        this.usersList.push(user);
    }

    async checkIfExist(email){
        return this.usersList.find( user => user.email === email );
    }

    find(id){
        return this.usersList.find( user => user.id === id );
    }
}
