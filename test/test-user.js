const assert = require('assert');
const fetch=require('node-fetch');
const _=require('underscore');

var userData = {
    email: 'com.ayrton@gmail.com',
    password: 'Password01',
    name: 'Ayrton Gomes'
};


describe('User', function() {

  describe('#new', function() {
    it('should create new user', function (done) {
        fetch('http://127.0.0.1:5000/api/v1/user/signup', {
            method:'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(userData)
        }).then(function (Data){
            Data.json().then(function (Resp){
                if (!Resp.id) {
                    done(Resp);
                } else {
                    userData.id = Resp.id;
                    done();
                }
            });
        });
    });
  });

  describe('#login', function () {
    it('should login created user', function(done) {
        var req={
            email: userData.email,
            password: userData.password
        };

        fetch('http://127.0.0.1:5000/api/v1/user/signin', {
            method:'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(req)
        }).then(function (Data){
            Data.json().then(function (Resp){
                if (!Resp.token) {                    
                    done(Resp);
                } else {
                    userData = Resp.user;
                    userData.req_token = Resp.reqToken;
                    done();
                }
            });
        })
    });
  });

  describe('#update', function() {
    it('should update user', function (done) {
        userData.name = userData.name.toUpperCase();
        var req=_.clone(userData);
        delete req.req_token;

        fetch('http://127.0.0.1:5000/api/v1/user/update', {
            method:'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': userData.req_token
            },
            body: JSON.stringify(req)
        }).then(function (Data){
            Data.json().then(function (Resp){
                if (Resp.name != req.name) {
                    done(Resp);
                } else {
                    done();
                }
            });
        });
    });
  });


  describe('#me', function() {
    it('should get my account details', function (done) {
        var req=_.clone(userData);
        delete req.req_token;

        fetch('http://127.0.0.1:5000/api/v1/user/me', {
            method:'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': userData.req_token
            },
        }).then(function (Data){
            Data.json().then(function (Resp){
                if (!_.isEqual(Resp, req)) {
                    done(Resp);
                } else {
                    done();
                }
            });
        });
    });
  });


});
