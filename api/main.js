const fetch=require('node-fetch');
const moment=require('moment');
const _=require('underscore');

function login(userData) {
    return new Promise(function (resolve, reject) {
        fetch('http://127.0.0.1:5000/api/v1/user/signin', {
            method:'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(userData)
        }).then(function (Data){
            Data.json().then(function (Resp){
                if (Resp.token) {
                    resolve(Resp);
                } else {
                    console.error('[ERROR] could not login, req: %o', userData);
                    console.error('[ERROR] Details %o', Resp);
                    reject(Resp);
                }
            }, reject);
        }, reject);
    })
}

function me(token) {
    return new Promise(function (resolve, reject) {
        fetch('http://127.0.0.1:5000/api/v1/user/me', {
            method:'GET',
            headers: {'Content-type': 'application/json',
                     'Authorization': token},
        }).then(function (Data){
            Data.json().then(function (Resp) {
                resolve();
            }, reject);
        }, reject);
    })
}

exports.signin = login;
exports.me = me;