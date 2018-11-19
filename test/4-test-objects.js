const assert = require('assert');
const fetch=require('node-fetch');
const _=require('underscore');
const api=require('../api/main');
const schemaAPI=require('../api/schema');
const fieldAPI=require('../api/field');
const objAPI=require('../api/object');
const decimals=require('../api/decimals');

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
        type: fieldAPI.TYPE.STRING,
        label: 'Name',
        required: true,
        min: 5,
        orderX: 1
    },
    ticker: {
        type: fieldAPI.TYPE.STRING,
        label: 'Ticker',
        required: true,
        orderX: 2
    },
    price: {
        type: fieldAPI.TYPE.DECIMAL,
        label: 'Price',
        min: 0.00000001,
        max: 10000,
        orderX: 3
    },
    circulation: {
        type: fieldAPI.TYPE.DECIMAL,
        label: 'Amount in circulation',
        min: 1,
        orderX: 4
    },
    patt: {
        type: fieldAPI.TYPE.STRING,
        label: 'Patt',
        pattern: '\\d\\d',
        defaultVal: '12',
        orderX: 5
    },
};

var objects = [
    null, 
    null, 
    null
];

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
        it('should create object', function(done) {
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
                    objects[0]=Resp;
                    done();
                }
            }, done);
        });

        it('should create another object', function(done) {
            var obj = {
                schemaId: schemaData.id,
                fields: {}
            };

            obj.fields[schemaFields.name.col]='Bitshares';
            obj.fields[schemaFields.ticker.col]='BTS';
            obj.fields[schemaFields.price.col]='0.34';
            obj.fields[schemaFields.circulation.col]='150000000';

            schemaAPI.addObject(authData.reqToken, obj)
            .then(function (Resp) {
                obj.fields[schemaFields.patt.col] = Resp.fields[schemaFields.patt.col];
                if (!_.isEqual(Resp.fields, obj.fields)) {
                    done(Resp);
                } else {
                    objects[1]=Resp;
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
                var msg_err = col_name+'['+col+'] must contain at least '+schemaFields.name.min+' characters';
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
                var minf=decimals.format(schemaFields.price.min, schemaFields.price.scale);
                var maxf=decimals.format(schemaFields.price.max, schemaFields.price.scale);

                var msg_err = col_name+'['+col+'] must be within range ['+minf
                    +':'+maxf+']';

                if (err&&err.length>0&&err[0]==msg_err) {
                    done();
                } else {
                    done({
                        expected: msg_err,
                        got: Resp
                    });
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
                var msg_err = col_name+'['+col+'] must contain at least '+
                    schemaFields.name.min+' characters';

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

            obj.fields[schemaFields.name.col]='Ripple';
            obj.fields[schemaFields.ticker.col]='XRP';
            obj.fields[schemaFields.price.col]='0.50';
            obj.fields[schemaFields.circulation.col]='40205508733';

            schemaAPI.addObject(authData.reqToken, obj)
            .then(function (Resp) {
                if (Resp.fields[schemaFields.patt.col]!=schemaFields.patt.defaultVal) {
                    done(Resp);
                } else {
                    objects[1]=Resp;
                    done();
                }
            }, done);
        });
    });

    describe('#update object', function() {
        it('should update object', function(done) {
            var obj=objects[0];
            obj.fields[schemaFields.name.col]='BITCOIN';
            obj.fields[schemaFields.price.col]='6500.10';

            objAPI.update(authData.reqToken, obj)
            .then(function (Resp_) {
                objAPI.byId(authData.reqToken, Resp_.id)
                .then(function (Resp) {
                    obj.createdAt = Resp.createdAt;      
                    if (!_.isEqual(Resp, obj)) {
                        done({
                            expected: obj,
                            got: Resp
                        });
                    } else {
                        done();
                    }
                }, done)
            }, done);
        });

        it('should fail update with invalid field', function(done) {
            var obj=objects[1];
            obj.fields[schemaFields.circulation.col]='17923212.890000';

            objAPI.update(authData.reqToken, obj)
            .then(function (Resp) {
                done(Resp);
            }, function (Resp){
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
    });
});
