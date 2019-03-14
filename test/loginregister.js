import 'babel-polyfill'
import chai from 'chai';
import chaiHttp from 'chai-http';


const server = require( '../app');
const should = chai.should();

chai.use(chaiHttp);

describe('Signup', () => {
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
            done()
        })
    })

    it('should not register an existing user', (done) => {
        chai.request(server)
        .post('/api/v1/auth/signup')
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
        .post('/api/v1/auth/signup')
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })

    it('should not register a if data is incomplete', (done) => {
        chai.request(server)
        .post('/api/v1/auth/signup')
        .send({
            name : "alain",
        })
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })
    it('should not register a user if body contains unrequired field', (done) => {
        chai.request(server)
        .post('/api/v1/auth/signup')
        .send({
            name : 'Burindi Alain',
            email : 'alain@gmail.com',
            password : "password",
            confirmPassword : "password",
            unwanted : "unwanted"
        })
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })

});

describe('Signin', () => {
    it('should login a user', (done) => {
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
            done()
        })
    })

    it('should not login a user if body is empty', (done) => {
        chai.request(server)
        .post('/api/v1/auth/login')
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })

    it('should not login a user if body contains unrequired field', (done) => {
        chai.request(server)
        .post('/api/v1/auth/login')
        .send({
            email : 'alain@gmail.com',
            password : "password",
            unrequired : "unrequired"
        })
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })

    it('should not login an unregistered user', (done) => {
        chai.request(server)
        .post('/api/v1/auth/login')
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

describe('Todo', () => {
    it('should return an array', (done) => {
        chai.request(server)
        .get('/')
        .end((err, res) => {
            // expect(res.body).to.be.array()
            res.body.should.be.an('Object')
            //if array exists
            res.body.should.have.property('todo')
            done()
        })
    })
})