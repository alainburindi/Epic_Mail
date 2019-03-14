import 'babel-polyfill'
import chai from 'chai';
import chaiHttp from 'chai-http';


const server = require( '../app');
const should = chai.should();

chai.use(chaiHttp);

// describe('Signup', () => {
//     it('should add a user on /auth/signup POST', (done) => {
//         chai.request(server).post('/auth/signup')
//         .send({'name':'myname', 'email' : 'al@mail.com', 'password' : 'password'})
//         .end((err, res)=>{
//             res.should.have.status(200);
//             done()
//         })
//     });
//   });

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