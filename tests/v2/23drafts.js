import 'babel-polyfill'
import chai from 'chai';
import chaiHttp from 'chai-http';


const server = require( '../app');

chai.use(chaiHttp);

let  token = ""
let id = 0;
describe('Add a draft with authentification', () => {
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
    it('should return a drafted email', (done) => {
        chai.request(server)
        .post('/api/v2/messages/drafts/save')
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
            id = res.body.data.id
            done()
        })
    })

    it('should send a drafted email', (done) => {
        chai.request(server)
        .post(`/api/v2/messages/drafts/send/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(200)
            res.body.should.be.an('Object')
            res.body.should.have.property('data')
            id = res.body.data.id
            done()
        })
    })
    it('should return an error if user is not found', (done) => {
        chai.request(server)
        .post('/api/v2/messages/drafts/save')
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
        .post('/api/v2/messages/drafts/save')
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

})

describe('Get drafted with authentification', () => {
    it('should return drafted email data', (done) => {
        chai.request(server)
        .get('/api/v2/messages/drafts/all')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(200)
            res.body.should.be.an('Object')
            res.body.should.have.property('data')
            done()
        })
    })

    it('should return a specific drafted email data', (done) => {
        chai.request(server)
        .get(`/api/v2/messages/drafts/get/${id}`)
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
        .get('/api/v2/messages/drafts/get/r')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })
})

describe('DELETE with authentification', () => {
    it("should delete the specified message", (done) =>{
        chai.request(server)
        .delete(`/api/v2/messages/${id}`)
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
        .delete('/api/v2/messages/l')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.have.status(422)
            res.body.should.be.an('Object')
            res.body.should.have.property('error')
            done()
        })
    })
})
