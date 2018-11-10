const fetch=require('node-fetch');
const moment=require('moment');
const _=require('underscore');


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