import 'babel-polyfill'
import chai from 'chai';
import chaiHttp from 'chai-http';


const server = require( '../app');
const should = chai.should();

chai.use(chaiHttp);

let  token = ""

describe('Get without authentification', () => {
    it('should return a correct error', (done) => {
        chai.request(server)
        .get('/api/v1/messages')
        .end((err, res) => {
            res.body.should.have.status(401)
            res.body.should.be.an('Object')
            res.body.should.have.property('error').equal("Authentication failed, please check your credentials")
            done()
        })
    })

    it('should return a correct error', (done) => {
        chai.request(server)
        .get('/api/v1/messages/unread')
        .end((err, res) => {
            res.body.should.have.status(401)
            res.body.should.be.an('Object')
            res.body.should.have.property('error').equal("Authentication failed, please check your credentials")
            done()
        })
    })

    it('should return a correct error', (done) => {
        chai.request(server)
        .get('/api/v1/messages/sent')
        .end((err, res) => {
            res.body.should.have.status(401)
            res.body.should.be.an('Object')
            res.body.should.have.property('error').equal("Authentication failed, please check your credentials")
            done()
        })
    })

    it('should return a correct error', (done) => {
        chai.request(server)
        .get('/api/v1/messages/1')
        .end((err, res) => {
            res.body.should.have.status(401)
            res.body.should.be.an('Object')
            res.body.should.have.property('error').equal("Authentication failed, please check your credentials")
            done()
        })
    })
})

describe('Post with authentification', () => {
    it('should login and give the token', (done) => {
        chai.request(server)
        .post('/api/v1/auth/login')
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
    it('should return a created email', (done) => {
        chai.request(server)
        .post('/api/v1/messages')
        .set('Authorization', `Bearer ${token}`)
        .send({
            subject : "fisrt test",
            message : "this is the content",
            to : "alain@gmail.com"
        })
        .end((err, res) => {
            res.body.should.have.status(201)
            res.body.should.be.an('Object')
            res.body.should.have.property('data')
            done()
        })
    })

    it('should return an error if user is not found', (done) => {
        chai.request(server)
        .post('/api/v1/messages')
        .set('Authorization', `Bearer ${token}`)
        .send({
            subject : "fisrt test",
            message : "this is the content",
            to : "unregistered@gmail.com"
        })
        .end((err, res) => {
            res.body.should.have.status(404)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })

    it('should return an error if message field is missing', (done) => {
        chai.request(server)
        .post('/api/v1/messages')
        .set('Authorization', `Bearer ${token}`)
        .send({
            subject : "fisrt test",
        })
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })

    it('should return an error if the body contains unnecessary field', (done) => {
        chai.request(server)
        .post('/api/v1/messages')
        .set('Authorization', `Bearer ${token}`)
        .send({
            subject : "fisrt test",
            message : "thi is the content",
            unecessary : "unecessary"
        })
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })
})

describe('Get with authentification', () => {
    it('should return received email data', (done) => {
        chai.request(server)
        .get('/api/v1/messages')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(200)
            res.body.should.be.an('Object')
            res.body.should.have.property('data')
            done()
        })
    })


    it('should return a unread message data', (done) => {
        chai.request(server)
        .get('/api/v1/messages/unread')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(200)
            res.body.should.be.an('Object')
            res.body.should.have.property('data')
            done()
        })
    })

    it('should return sent email data', (done) => {
        chai.request(server)
        .get('/api/v1/messages/sent')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(200)
            res.body.should.be.an('Object')
            res.body.should.have.property('data')
            done()
        })
    })

    it('should return a specific email data', (done) => {
        chai.request(server)
        .get('/api/v1/messages/1')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(200)
            res.body.should.be.an('Object')
            res.body.should.have.property('data')
            done()
        })
    })

    it('should return an error if id doesn\'t exist', (done) => {
        chai.request(server)
        .get('/api/v1/messages/100')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(200)
            res.body.should.be.an('Object')
            res.body.should.have.property('data')
            done()
        })
    })

    it('should return an error if id is not a number', (done) => {
        chai.request(server)
        .get('/api/v1/messages/r')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })

    it('should return an error if id is less tha 1', (done) => {
        chai.request(server)
        .get('/api/v1/messages/0')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })
})

describe('Post without authentification', () => {
    it('should return a correct error', (done) => {
        chai.request(server)
        .post('/api/v1/messages')
        .end((err, res) => {
            res.body.should.have.status(401)
            res.body.should.be.an('Object')
            res.body.should.have.property('error').equal("Authentication failed, please check your credentials")
            done()
        })
    })
})

describe('DELETE without authentification', () => {
    it("should send the correct error", (done) =>{
        chai.request(server)
        .delete('/api/v1/messages/1')
        .end((err, res) => {
            res.body.should.have.status(401)
            res.body.should.be.an('Object')
            res.body.should.have.property('error').equal("Authentication failed, please check your credentials")
            done()
        })
    })
})

describe('DELETE with authentification', () => {
    it("should delete the specified message", (done) =>{
        chai.request(server)
        .delete('/api/v1/messages/1')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(200)
            res.body.should.be.an('Object')
            res.body.should.have.property('data')
            done()
        })
    })

    it("should send an error if id is not a number", (done) =>{
        chai.request(server)
        .delete('/api/v1/messages/l')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })
    
})
