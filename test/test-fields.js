const assert = require('assert');
const fetch=require('node-fetch');
const _=require('underscore');
const api=require('../api/main');
const schema=require('../api/schema');

var authData = {
};

var user = {
    email: 'com.ayrton@gmail.com',
    password: 'Password01'
};

var schemaData = {
    label: 'Schema Test #' + _.random(0, 598)
};

var fieldData = {
    col: 'col1',
    type: 'string',
    label: 'Name',
};

describe('Fields', function() {

  before(function (done) {
    api.signin(user)
    .then(function (Auth) {
        authData=Auth;
        schema.create(authData.reqToken, schemaData)
        .then(function (sData){
            schemaData=sData;
            fieldData.schemaId = sData.id;
            done()
        }, done);
    }, function (Error) {
        done(Error);
    });
  });

  describe('#create ', function() {
    it('should create new field on schema', function (done) {
        fetch('http://127.0.0.1:5000/api/v1/schema/'+schemaData.id+'/fields', {
            method:'POST',
            headers: {'Content-type': 'application/json',
                     'Authorization': authData.reqToken},
            body: JSON.stringify(fieldData)
        }).then(function (Data) {
            Data.json().then(function (Resp){
                if (!Resp.id) {
                    done(Resp);
                } else {
                    fieldData = Resp;
                    done();
                }
            });
        });
    });
  });

  describe('#fetch ', function() {
    it('should fetch newly created field', function (done) {
        fetch('http://127.0.0.1:5000/api/v1/schema/'+schemaData.id+'/fields', {
            method:'GET',
            headers: {'Content-type': 'application/json',
                     'Authorization': authData.reqToken},
        }).then(function (Data) {
            Data.json().then(function (Resp) {
                var f=_.find(Resp.list, function (O){
                    return O.id == fieldData.id;
                });

                fieldData.createdAt = f.createdAt;

                if (!f) {
                    done({
                        error: 'could not find the field', 
                        field: fieldData,
                        list: Resp.list
                    });
                } else if (!_.isEqual(f, fieldData)) {
                    done(f);
                } else {
                    done();
                }
            });
        });
    });
  });

  describe('#update ', function() {
    fieldData.label = fieldData.label.toUpperCase();
    it('should update field', function (done) {
        fetch('http://127.0.0.1:5000/api/v1/field/'+fieldData.id, {
            method:'PUT',
            headers: {'Content-type': 'application/json',
                     'Authorization': authData.reqToken},
            body: JSON.stringify(fieldData)
        }).then(function (Data) {
            Data.json().then(function (Resp) {
                if (!_.isEqual(Resp, fieldData)) {
                    done(Resp);
                } else {
                    done();
                }
            });
        });
    });
  });

  describe('#delete ', function() {
    fieldData.label = fieldData.label.toUpperCase();
    it('should delete field', function (done) {

        fetch('http://127.0.0.1:5000/api/v1/field/'+fieldData.id, {
            method:'DELETE',
            headers: {'Content-type': 'application/json',
                     'Authorization': authData.reqToken}
        }).then(function (Data) {
            fetch('http://127.0.0.1:5000/api/v1/field/'+fieldData.id, {
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


});
