import 'babel-polyfill'
import chai from 'chai';
import chaiHttp from 'chai-http';


const server = require( '../app');
const should = chai.should();

chai.use(chaiHttp);

let token = ""

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

describe('Get with authentification', () => {
    it('should register and give the token', (done) => {
        chai.request(server)
        .post('/api/v1/auth/signup')
        .send({
            name : 'Burindi Alain',
            email : 'alain@gmail.com',
            password : "password",
            confirmPassword : "password"
        })
        .end((err, res) => {
            res.body.should.have.status(201)
            res.body.should.be.an('Object')
            res.body.should.have.property('data')
            token = res.body.data[0].token
            done()
        })
    })
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
})