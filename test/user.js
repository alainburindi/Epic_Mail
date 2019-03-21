import 'babel-polyfill'
import chai from 'chai';
import chaiHttp from 'chai-http';


const server = require( '../app');
const should = chai.should();

chai.use(chaiHttp);

describe('Signup with db', () => {
    it('should register and give the token', (done) => {
        chai.request(server)
        .post('/api/v2/auth/signup')
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
            done()
        })
    })

    it('should not register an existing user', (done) => {
        chai.request(server)
        .post('/api/v2/auth/signup')
        .send({
            name : 'Burindi Alain',
            email : 'alain@gmail.com',
            password : "password",
            confirmPassword : "password"
        })
        .end((err, res) => {
            res.body.should.have.status(409)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })


    it('should not register a if body is empty', (done) => {
        chai.request(server)
        .post('/api/v2/auth/signup')
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })
});

describe('Signin with', () => {
    it('should login a user', (done) => {
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
            done()
        })
    })

    it('should not login if the password is incorect', (done) => {
        chai.request(server)
        .post('/api/v2/auth/login')
        .send({
            email : 'alain@gmail.com',
            password : "passwor1",
        })
        .end((err, res) => {
            res.body.should.have.status(401)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })
    it('should not login a user if body is empty', (done) => {
        chai.request(server)
        .post('/api/v2/auth/login')
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })

    it('should not login an unregistered user', (done) => {
        chai.request(server)
        .post('/api/v2/auth/login')
        .send({
            email : 'unregistered@gmail.com',
            password : "password",
        })
        .end((err, res) => {
            res.body.should.have.status(401)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })
});
