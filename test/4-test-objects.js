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
        min: 5,
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
        min: 1,
        max: 10000,
        orderX: 3
    },
    circulation: {
        type: 'decimal',
        label: 'Amount in circulation',
        min: 1,
        orderX: 4
    },
    patt: {
        type: 'string',
        label: 'Patt',
        pattern: '\\d\\d',
        defaultVal: '12'
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
                obj.fields[schemaFields.patt.col] = Resp.fields[schemaFields.patt.col];
                if (!_.isEqual(Resp.fields, obj.fields)) {
                    done(Resp);
                } else {
                    done();
                }
            }, done);
        });
    });

    describe('#create invalid object', function() {
        it('should fail on create object without required field', function(done) {
            var obj = {
                schemaId: schemaData.id,
                fields: {}
            };

            // name is required
            obj.fields[schemaFields.ticker.col]='BTC';
            obj.fields[schemaFields.price.col]='6542.10';
            obj.fields[schemaFields.circulation.col]='17923212.89';

            schemaAPI.addObject(authData.reqToken, obj)
            .then(function (Resp) {
                done(Resp);
            }, function (Resp) {
                var err=Resp.errors;
                var col=schemaFields.name.col;
                if (err&&err.length>0&&err[0]=='Name['+col+'] is mandatory') {
                    done();
                } else {
                    done(Resp);
                }                
            });
        });

        it('should fail on create object with empty required field', function(done) {
            var obj = {
                schemaId: schemaData.id,
                fields: {}
            };

            obj.fields[schemaFields.name.col]='    ';
            obj.fields[schemaFields.ticker.col]='BTC';
            obj.fields[schemaFields.price.col]='6542.10';
            obj.fields[schemaFields.circulation.col]='17923212.89';

            schemaAPI.addObject(authData.reqToken, obj)
            .then(function (Resp) {
                done(Resp);
            }, function (Resp) {
                var err=Resp.errors;
                var col=schemaFields.name.col;
                var col_name=schemaFields.name.label;
                var msg_err = col_name+'['+col+'] must be within range ['+schemaFields.name.min+',]';
                if (err&&err.length>0&&err[0]==msg_err) {
                    done();
                } else {
                    done(Resp);
                }                
            });
        });

        it('should fail on create object with invalid decimal', function(done) {
            var obj = {
                schemaId: schemaData.id,
                fields: {}
            };

            // name is required
            obj.fields[schemaFields.name.col]='Ethereum';
            obj.fields[schemaFields.ticker.col]='ETH';
            obj.fields[schemaFields.price.col]='6542.';
            obj.fields[schemaFields.circulation.col]='100.89';

            schemaAPI.addObject(authData.reqToken, obj)
            .then(function (Resp) {
                done(Resp);
            }, function (Resp) {
                var err=Resp.errors;
                var col=schemaFields.price.col;
                var col_name=schemaFields.price.label;
                var msg_err = col_name+'['+col+'] is not a valid decimal';
                if (err&&err.length>0&&err[0]==msg_err) {
                    done();
                } else {
                    done(Resp);
                }                
            });
        });

        it('should fail on create object with invalid decimal', function(done) {
            var obj = {
                schemaId: schemaData.id,
                fields: {}
            };

            // name is required
            obj.fields[schemaFields.name.col]='Ethereum';
            obj.fields[schemaFields.ticker.col]='ETH';
            obj.fields[schemaFields.price.col]='6542.99';
            obj.fields[schemaFields.circulation.col]='AA';

            schemaAPI.addObject(authData.reqToken, obj)
            .then(function (Resp) {
                done(Resp);
            }, function (Resp) {
                var err=Resp.errors;
                var col=schemaFields.circulation.col;
                var col_name=schemaFields.circulation.label;
                var msg_err = col_name+'['+col+'] is not a valid decimal';
                if (err&&err.length>0&&err[0]==msg_err) {
                    done();
                } else {
                    done(Resp);
                }                
            });
        });

        it('should fail on create object with numerical field outside range', function(done) {
            var obj = {
                schemaId: schemaData.id,
                fields: {}
            };

            // name is required
            obj.fields[schemaFields.name.col]='Ethereum';
            obj.fields[schemaFields.ticker.col]='ETH';
            obj.fields[schemaFields.price.col]='65942.99';
            obj.fields[schemaFields.circulation.col]='1000';

            schemaAPI.addObject(authData.reqToken, obj)
            .then(function (Resp) {
                done(Resp);
            }, function (Resp) {
                var err=Resp.errors;
                var col=schemaFields.price.col;
                var col_name=schemaFields.price.label;
                var msg_err = col_name+'['+col+'] must be within range ['+
                    schemaFields.price.min+','+
                    schemaFields.price.max+']';

                if (err&&err.length>0&&err[0]==msg_err) {
                    done();
                } else {
                    done(Resp);
                }                
            });
        });

        it('should fail on create object with string field outside range', function(done) {
            var obj = {
                schemaId: schemaData.id,
                fields: {}
            };

            // name is required
            obj.fields[schemaFields.name.col]='Et';
            obj.fields[schemaFields.ticker.col]='ETH';
            obj.fields[schemaFields.price.col]='642.99';
            obj.fields[schemaFields.circulation.col]='1000';

            schemaAPI.addObject(authData.reqToken, obj)
            .then(function (Resp) {
                done(Resp);
            }, function (Resp) {
                var err=Resp.errors;
                var col=schemaFields.name.col;
                var col_name=schemaFields.name.label;
                var msg_err = col_name+'['+col+'] must be within range ['+
                    schemaFields.name.min+',]';

                if (err&&err.length>0&&err[0]==msg_err) {
                    done();
                } else {
                    done(Resp);
                }                
            });
        });

        it('should fail on create object with invalid pattern', function(done) {
            var obj = {
                schemaId: schemaData.id,
                fields: {}
            };

            // name is required
            obj.fields[schemaFields.name.col]='Stellar Lumens';
            obj.fields[schemaFields.ticker.col]='XLM';
            obj.fields[schemaFields.price.col]='642.99';
            obj.fields[schemaFields.circulation.col]='1000';
            obj.fields[schemaFields.patt.col]='1';

            schemaAPI.addObject(authData.reqToken, obj)
            .then(function (Resp) {
                done(Resp);
            }, function (Resp) {
                var err=Resp.errors;
                var col=schemaFields.patt.col;
                var col_name=schemaFields.patt.label;
                var msg_err = col_name+'['+col+'] is not a valid '+schemaFields.patt.type;

                if (err&&err.length>0&&err[0]==msg_err) {
                    done();
                } else {
                    done(Resp);
                }                
            });
        });
    });

    describe('#create object', function() {
        it('should fill fields with default value', function(done) {
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
                if (Resp.fields[schemaFields.patt.col]!=schemaFields.patt.defaultVal) {
                    done(Resp);
                } else {
                    done();
                }
            }, done);
        });
    });
});
