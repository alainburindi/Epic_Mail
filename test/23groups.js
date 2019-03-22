import 'babel-polyfill'
import chai from 'chai';
import chaiHttp from 'chai-http';


const server = require( '../app');
const should = chai.should();

chai.use(chaiHttp);

let id = 0;
let token;
describe('Groups', () => {
    it('should login and give the token', (done) => {
        chai.request(server)
        .post('/api/v2/auth/login')
        .send({
            email : 'alain@gmail.com',
            password : "password",
        })
        .end((err, res) => {
            res.body.should.have.status(200)
            res.body.should.be.an('Object')
            res.body.should.have.property('data')
            token = res.body.data[0].token
            done()
        })
    })
    it('should create group', (done) => {
        chai.request(server)
        .post('/api/v2/groups')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name : 'Group test',
        })
        .end((err, res) => {
            res.body.should.have.status(201)
            res.body.should.be.an('Object')
            res.body.should.have.property('data')
            id = res.body.data.id
            done()
        })
    })

    it('should not create a group if name is empty', (done) => {
        chai.request(server)
        .post('/api/v2/groups')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })
    
});

describe('Get with authentification', () => {
    it('should return created group', (done) => {
        chai.request(server)
        .get('/api/v2/groups')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(200)
            res.body.should.be.an('Object')
            res.body.should.have.property('data')
            done()
        })
    })
})

describe('Edit group name', () => {
    it('should return a success message', (done) => {
        chai.request(server)
        .patch(`/api/v2/groups/${id}/name`)
        .send({
            name : "new name"
        })
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(200)
            res.body.should.be.an('Object')
            res.body.should.have.property('message')
            done()
        })
    })

    it('should return an if id is not a number', (done) => {
        chai.request(server)
        .patch(`/api/v2/groups/l/name`)
        .send({
            name : "new name"
        })
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })

    it('should return an if there is validation error', (done) => {
        chai.request(server)
        .patch(`/api/v2/groups/l/name`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })

    it('should return an if id doesn\'t exist', (done) => {
        chai.request(server)
        .patch(`/api/v2/groups/100/name`)
        .send({
            name : "new name"
        })
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(403)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })
})

describe('Add users to group', () => {

    it('should send an error if id is not a number', (done) => {
        chai.request(server)
        .post(`/api/v2/groups/l/users`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            role : "simple user",
            email : "alain@gmail.com"
        })
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })
    it('should send an error if id is not found', (done) => {
        chai.request(server)
        .post(`/api/v2/groups/100/users`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            role : "simple user",
            email : "alain@gmail.com"
        })
        .end((err, res) => {
            res.body.should.have.status(403)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })
    it('should send an error if email is not found', (done) => {
        chai.request(server)
        .post(`/api/v2/groups/${id}/users`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            role : "simple user",
            email : "un@gmail.com"
        })
        .end((err, res) => {
            res.body.should.have.status(404)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })

    it('should send an error if verification fails', (done) => {
        chai.request(server)
        .post(`/api/v2/groups/l/users`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            role : "simple user",
        })
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })
    it('should add a user to a group', (done) => {
        chai.request(server)
        .post(`/api/v2/groups/${id}/users`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            role : "simple user",
            email : "alain@gmail.com"
        })
        .end((err, res) => {
            res.body.should.have.status(201)
            res.body.should.be.an('Object')
            res.body.should.have.property('message')
            done()
        })
    })
})

describe('Not yet done', () => {
    it('should retrun 404', (done) => {
        chai.request(server)
        .delete(`/api/v2/groups/${id}/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(404)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })

    it('should retrun 404', (done) => {
        chai.request(server)
        .post(`/api/v2/groups/${id}/messages`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(404)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })
})
describe('Delete a group', () => {
    it('should return an if id is not a number', (done) => {
        chai.request(server)
        .delete(`/api/v2/groups/l`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })
    
    it('should return an err if group is not found', (done) => {
        chai.request(server)
        .delete(`/api/v2/groups/100`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(403)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })

    it('should return a success message', (done) => {
        chai.request(server)
        .delete(`/api/v2/groups/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(200)
            res.body.should.be.an('Object')
            res.body.should.have.property('message')
            done()
        })
    })
})
