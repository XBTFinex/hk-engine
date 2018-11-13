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
        type: fieldAPI.TYPE.DECIMAL,
        label: 'Price',
        required: true
    },
    currency: {
        type: fieldAPI.TYPE.STRING,
        label: 'Currency',
        required: true
    },
    amount: {
        type: fieldAPI.TYPE.DECIMAL,
        label: 'Amount',
        min: 1,
        max: 1000,
        required: true
    },
    maturity: {
        type: fieldAPI.TYPE.DATE,
        label: 'Maturity',
        pattern: 'DD/MM/YYYY',
        required: true
    },
    entity: {
        type: fieldAPI.TYPE.STRING,
        label: 'Entity',
        required: true
    },
    yield: {
        type: fieldAPI.TYPE.DECIMAL,
        label: 'Yield',
        required: true
    },
    description: {
        type: fieldAPI.TYPE.STRING,
        label: 'Decimal',
        required: true
    },
    last: {
        type: fieldAPI.TYPE.DECIMAL,
        label: 'Last Price'
    },
    open: {
        type: fieldAPI.TYPE.DECIMAL,
        label: 'Open Price'
    },
    close: {
        type: fieldAPI.TYPE.DECIMAL,
        label: 'Close Price'
    },
    high: {
        type: fieldAPI.TYPE.DECIMAL,
        label: 'High Price'
    },
    low: {
        type: fieldAPI.TYPE.DECIMAL,
        label: 'Low Price'
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

        // asynchronously create fields
        // to test the reliability of the system
        var qu = fieldsAry.map(function (F) {
            return fieldAPI.create(authData.reqToken, F);
        });

        Promise.all(qu)
        .then(function (respAry) {
            // verify if each and all has been created
            for (var i = 0; i < respAry.length; i++) {
                var resp=respAry[i];
                if (!resp.id) {
                    done(respAry);
                    return;
                }
            }

            // compute unique list of cols
            // if there is duplicates, the list
            // will be shrunk...
            var cols=_.uniq(respAry.map(function (X){
                return X.col;
            }));

            // and the size will be diferent here
            // thus triggering a test fail
            if (cols.length!=fieldsAry.length) {
                done(respAry);
            } else {
                done();
            }
        }, done);
    });
  });
});
