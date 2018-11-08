const fetch=require('node-fetch');
const moment=require('moment');
const _=require('underscore');

function create(token, data) {
    return new Promise(function (resolve, reject) {
        fetch('http://127.0.0.1:5000/api/v1/schema/new', {
            method:'POST',
            headers: {'Content-type': 'application/json',
                     'Authorization': token},
            body: JSON.stringify(data)
        }).then(function (Data){
            Data.json().then(function (Resp){
                if (Resp.id) {
                    resolve(Resp);
                } else {
                    reject(Resp);
                }
            }, reject);
        }, reject);
    })
}

exports.create = create;