#!/usr/bin/env node
const assert = require('assert');
const fetch=require('node-fetch');
const api=require('../api/main');
const schemaAPI=require('../api/schema');
const fieldAPI=require('../api/field');
const _=require('underscore');
const U=require('../utils');

var schemaData = {
    'label': "Bond Assets"
};

var schemaFields = {
    price: {
        type: fieldAPI.TYPE.DECIMAL,
        label: 'Price',
        required: true
    },
    ticker: {
        type: fieldAPI.TYPE.STRING,
        label: 'Ticker',
        required: true,
        pattern: '\\w+'
    },
    img: {
        type: fieldAPI.TYPE.STRING,
        label: 'Image source',
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
        required: true
    },
    maturity: {
        type: fieldAPI.TYPE.DATE,
        label: 'Maturity',
        pattern: '\\d{4}-\\d{2}-\\d{2}',
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
}

U.token().then(function (Auth) {
    schemaAPI.create(Auth.reqToken, schemaData)
    .then(function (sData) {
        schemaData=sData;

        console.info("Created schema %o", sData);

        var fieldsAry = Object.keys(schemaFields).map(function (K){
            var obj=schemaFields[K];
            obj.schemaId=schemaData.id;
            return obj;
        });

        var qu = fieldsAry.map(function (F) {
            return fieldAPI.create(Auth.reqToken, F);
        });

        Promise.all(qu)
        .then(function (respAry) {
            console.info(respAry);
        }, function (Err){
            console.error("Couldnt create fields !");
            console.error("Details: ", Err);
        });
    }, function (Err){
        console.error("Couldnt create schema!");
        console.error("Details: ", Err);
    });
});
