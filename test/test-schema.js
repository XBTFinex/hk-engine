const assert = require('assert');
const fetch=require('node-fetch');
const api=require('../api/main');
const _=require('underscore');

var user={
    email: 'com.ayrton@gmail.com',
    password: 'Password01'
};
var schemaData = {
    'label': "Business Leads test#" + _.random(1, 92322)
};
var authData={};

describe('Schema', function() {

  before(function (done) {
    // runs before all tests in this block
    api.signin(user)
    .then(function (Auth) {
        authData=Auth;        
        done();
    }, function (Error) {
        done(Error);
    });
  });

  describe('#new', function() {
    it('should create a new Schema', function (done) {
        fetch('http://127.0.0.1:5000/api/v1/schema/new', {
            method:'POST',
            headers: {'Content-type': 'application/json',
                     'Authorization': authData.reqToken},
            body: JSON.stringify(schemaData)
        }).then(function (Data) {
            Data.json().then(function (Resp){
                if (!Resp.id) {
                    done(Resp);
                } else {
                    schemaData = Resp;
                    done();
                }
            });
        });
    });
  });

  describe('#update', function() {
    schemaData.label = schemaData.label.toUpperCase();
    it('should update the Schema', function (done) {
        fetch('http://127.0.0.1:5000/api/v1/schema/'+schemaData.id, {
            method:'PUT',
            headers: {'Content-type': 'application/json',
                     'Authorization': authData.reqToken},
            body: JSON.stringify(schemaData)
        }).then(function (Data) {
            Data.json().then(function (Resp){
                if (!_.isEqual(Resp, schemaData)) {
                    done(Resp);
                } else {
                    done();
                }
            });
        });
    });
  });

  describe('#get', function() {
    schemaData.label = schemaData.label.toUpperCase();
    it('should fetch the Schema', function (done) {
        fetch('http://127.0.0.1:5000/api/v1/schema/'+schemaData.id, {
            method:'GET',
            headers: {'Content-type': 'application/json',
                     'Authorization': authData.reqToken}
        }).then(function (Data) {
            Data.json().then(function (Resp) {
                Resp.createdAt = Resp.createdAt.replace(' ', 'T');
                if (!_.isEqual(Resp, schemaData)) {
                    done(Resp);
                } else {
                    done();
                }
            });
        });
    });
  });

  describe('#all', function() {
    schemaData.label = schemaData.label.toUpperCase();
    it('should find the created schema on the list', function (done) {
        fetch('http://127.0.0.1:5000/api/v1/schema/', {
            method:'GET',
            headers: {'Content-type': 'application/json',
                     'Authorization': authData.reqToken}
        }).then(function (Data) {
            Data.json().then(function (Resp) {
                var f=_.find(Resp.list, function (O){
                    return O.id == schemaData.id;
                });

                f.createdAt = f.createdAt.replace(' ', 'T');

                if (!f) {
                    done({
                        error: 'cant find the object', 
                        schemaData: schemaData,
                        list: Resp.list
                    });
                } else if (!_.isEqual(f, schemaData)) {
                    done(f);
                } else {
                    done();
                }
            });
        });
    });
  });

  describe('#delete', function() {
    schemaData.label = schemaData.label.toUpperCase();
    it('should delete the Schema', function (done) {
        fetch('http://127.0.0.1:5000/api/v1/schema/'+schemaData.id, {
            method:'DELETE',
            headers: {'Content-type': 'application/json',
                     'Authorization': authData.reqToken}
        }).then(function (Data) {
            fetch('http://127.0.0.1:5000/api/v1/schema/'+schemaData.id, {
                headers: {'Content-type': 'application/json',
                         'Authorization': authData.reqToken},
            }).then(function (Data){
                Data.json().then(function (Resp){
                    if (Resp.deleted) {
                        done();
                    } else {
                        done(Resp);
                    }
                });
            })
        });
    });
  });

  describe('#all after delete', function() {
    schemaData.label = schemaData.label.toUpperCase();
    it('should NOT include the created schema on the list', function (done) {
        fetch('http://127.0.0.1:5000/api/v1/schema/', {
            method:'GET',
            headers: {'Content-type': 'application/json',
                     'Authorization': authData.reqToken}
        }).then(function (Data) {
            Data.json().then(function (Resp) {
                var f=_.find(Resp.list, function (O){
                    return O.id == schemaData.id;
                });

                if (!f) {
                    done();
                } else {
                    done(f);
                }
            });
        });
    });
  });


});