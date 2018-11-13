const fetch=require('node-fetch');
const moment=require('moment');
const _=require('underscore');


function update(token, data) {
    return new Promise(function (resolve, reject) {
        if (!data.id) {
            reject({
                error: 'object.id is mandatory'
            });
            return;
        }

        if (!data.schemaId) {
            reject({
                error: 'object.schemaId is mandatory'
            });
            return;
        }

        if (!data.fields || Object.keys(data.fields).length==0) {
            reject({
                error: 'object.fields must not be empty'
            });
            return;
        }

        fetch('http://127.0.0.1:5000/api/v1/object/'+data.id, {
            method:'PUT',
            headers: {'Content-type': 'application/json',
                     'Authorization': token},
            body: JSON.stringify(data)
        }).then(function (Data) {
            Data.json().then(function (Resp) {
                if (!Resp.id) {
                    reject(Resp);
                } else {
                    resolve(Resp);
                }
            }, reject);
        }, reject);
    });
}

function byId(token, id) {
    return new Promise(function (resolve, reject){
        fetch('http://127.0.0.1:5000/api/v1/object/'+id, {
            method: 'GET',
            headers: {'Content-type': 'application/json',
                     'Authorization': token},
        }).then(function (Data){
            Data.json().then(function (Resp){
                if (!Resp.id) {
                    reject(Resp);
                } else {
                    resolve(Resp);
                }
            }, reject);
        })
    });
}

exports.update = update;
exports.byId = byId;