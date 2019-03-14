import 'babel-polyfill'
import chai from 'chai';
import chaiHttp from 'chai-http';


const server = require( '../../app');
const should = chai.should();

chai.use(chaiHttp);

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

