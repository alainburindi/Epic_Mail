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