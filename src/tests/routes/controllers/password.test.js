import chai from 'chai';
import chaiHttp from 'chai-http';
import models from '../../../db/models';
import app from '../../../server';

// configure chai to use expect
chai.use(chaiHttp);
const { expect } = chai;

before(async () => {
  await models.sequelize.sync({ force: true });
});
let resetToken;
const userEmail = {
  email: 'jsmith@gmail.com',
};

describe('Forgot Password', () => {
  it('should send the user a password reset link via email', done => {
    chai
      .request(app)
      .post('/api/v1/users/forgot-password')
      .send(userEmail)
      .end((err, res) => {
        resetToken = res.body.data.token;
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Email has been sent successfully');
        expect(res.body.data.token).to.exist;
        done();
      });
  });

  it('should fail if the user email doesnt exist', done => {
    userEmail.email = 'nedyudobat@gmail.com';
    chai
      .request(app)
      .post('/api/v1/users/forgot-password')
      .send(userEmail)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal('User does not exist');
        expect(res.body.errors).to.equal(true);
        done();
      });
  });
});

describe('Reset Password', () => {
  it('should return a success and status of 200 if password has been reset', done => {
    chai
      .request(app)
      .patch(`/api/v1/users/reset-password/${resetToken}`)
      .send('password')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Password successfully reset');
        done();
      });
  });

  it('should fail if no token is provided in the request', done => {
    chai
      .request(app)
      .patch('/api/v1/users/reset-password/')
      .send('password')
      .end((err, res) => {
        expect(res.status).to.equal(405);
        done();
      });
  });

  it('should fail if token is invalid in the request', done => {
    chai
      .request(app)
      .patch(
        '/api/v1/users/reset-password/qwertyuikmnjhdr434567bvfre3rtybvde3rtytrf',
      )
      .send('password')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Token Malformed');
        expect(res.body.errors).to.equal(true);
        done();
      });
  });
});