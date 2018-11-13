const fetch=require('node-fetch');
const moment=require('moment');
const _=require('underscore');

// public static final String STRING="string";
// public static final String DECIMAL="decimal";
// public static final String INTEGER="integer";
// public static final String DATE="date";
// public static final String FORMULA="formula";
// public static final String JSON_HTTP_FIELD="json_http_field";
// public static final String XML_HTTP_FIELD="xml_http_field";
// public static final String CURRENCY="currency";

const TYPES ={
    STRING: 'string',
    DECIMAL: 'decimal',
    INTEGER: 'integer',
    DATE: 'date',
    FORMULA: 'formula',
    JSON_HTTP_FIELD: 'json_http_field',
    XML_HTTP_FIELD: 'xml_http_field',
    CURRENCY: 'currency'
};

function create(token, data) {
    return new Promise(function (resolve, reject) {
        if (!data.schemaId) {
            reject({
                error: 'field.schemaId is mandatory'
            });
            return;
        }

        fetch('http://127.0.0.1:5000/api/v1/schema/'+data.schemaId+'/fields', {
            method:'POST',
            headers: {'Content-type': 'application/json',
                     'Authorization': token},
            body: JSON.stringify(data)
        }).then(function (Data) {
            Data.json().then(function (Resp){
                if (!Resp.id) {
                    reject(Resp);
                } else {
                    resolve(Resp);
                }
            }, reject);
        }, reject);
    });
}

exports.create = create;
exports.TYPE = TYPES;