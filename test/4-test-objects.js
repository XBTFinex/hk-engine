const assert = require('assert');
const fetch=require('node-fetch');
const _=require('underscore');
const api=require('../api/main');
const schemaAPI=require('../api/schema');
const fieldAPI=require('../api/field');

var authData = {};

var user = {
    email: 'com.ayrton@gmail.com',
    password: 'Password01'
};

var schemaData = {
    'label': "Cryptocurrency"
};

var schemaFields = {
    name: {
        type: 'string',
        label: 'Name',
        required: true,
        orderX: 1
    },
    ticker: {
        type: 'string',
        label: 'Ticker',
        required: true,
        orderX: 2
    },
    price: {
        type: 'decimal',
        label: 'Price',
        required: true,
        orderX: 3
    },
    circulation: {
        type: 'decimal',
        label: 'Amount in circulation',
        min: 1,
        orderX: 4
    },
};

describe('Object', function() {
    // XXX: what a mess, find a way to fix this
    before(function (done) {
        api.signin(user)
        .then(function (Auth) {
            authData=Auth;
            schemaAPI.create(authData.reqToken, schemaData)
            .then(function (sData) {
                schemaData=sData;

                var prs = Object.keys(schemaFields).map(function (K) {
                    var field=schemaFields[K];
                    field.schemaId=sData.id;
                    return schemaAPI.addField(authData.reqToken, sData.id, field)
                    .then(function (createdField){
                        schemaFields[K]=createdField;
                        return createdField;
                    });
                });

                Promise.all(prs)
                .then(function (_createdFields){
                    done();
                }, done);
            }, done);
        }, function (Error) {
            done(Error);
        });
    });

    describe('#create object', function() {
        it('should create objects', function(done) {
            var obj = {
                schemaId: schemaData.id,
                fields: {}
            };

            obj.fields[schemaFields.name.col]='Bitcoin';
            obj.fields[schemaFields.ticker.col]='BTC';
            obj.fields[schemaFields.price.col]='6542.10';
            obj.fields[schemaFields.circulation.col]='17923212.89';

            schemaAPI.addObject(authData.reqToken, obj)
            .then(function (Resp) {
                if (!_.isEqual(Resp.fields, obj.fields)) {
                    done(Resp);
                } else {
                    done();
                }
            }, done);
        });
    });

});
