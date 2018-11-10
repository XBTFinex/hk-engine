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
    'label': "XBTUSD Contract"
};

var schemaFields = {
    price: {
        type: 'decimal',
        label: 'Price'
    },
    currency: {
        type: 'string',
        label: 'Currency'
    },
    amount: {
        type: 'decimal',
        label: 'Amount',
        min: 1,
        max: 1000
    },
    maturity: {
        type: 'string',
        label: 'Maturity',
        format: 'DD/MM/YYYY'
    },
    entity: {
        type: 'string',
        label: 'Entity'
    },
    yield: {
        type: 'decimal',
        label: 'Yield'
    },
    description: {
        type: 'string',
        label: 'Decimal'
    },
    last: {
        label: 'Last Price',
        type: 'decimal'        
    },
    open: {
        type: 'decimal',
        label: 'Open'        
    },
    close: {
        type: 'decimal',
        label: 'Close'        
    },
    high: {
        type: 'decimal',
        label: 'High'        
    },
    low: {
        type: 'decimal',
        label: 'Low'        
    }
};

describe('Schema with multiple fields', function() {
  before(function (done) {
    api.signin(user)
    .then(function (Auth) {
        authData=Auth;
        schemaAPI.create(authData.reqToken, schemaData)
        .then(function (sData) {
            schemaData=sData;
            done();
        }, done);
    }, function (Error) {
        done(Error);
    });
  });

  describe('#create fields', function() {
    it('should create fields with diferent col', function(done) {
        var fieldsAry = Object.keys(schemaFields).map(function (K){
            var obj=schemaFields[K];
            obj.schemaId=schemaData.id;
            return obj;
        });

        var qu = fieldsAry.map(function (F) {
            return fieldAPI.create(authData.reqToken, F);
        });

        Promise.all(qu)
        .then(function (respAry) {
            for (var i = 0; i < respAry.length; i++) {
                var resp=respAry[i];
                if (!resp.id) {
                    done(respAry);
                    return;
                }
            }

            var cols=_.uniq(respAry.map(function (X){
                return X.col;
            }));

            if (cols.length!=fieldsAry.length) {
                done(respAry);
            } else {
                done();
            }

        }, function (Err) {
            done(Err);
        });
    });
  });
});
