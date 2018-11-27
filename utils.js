const assert = require('assert');
const fetch=require('node-fetch');
const api=require('./api/main');
const _=require('underscore');
const fs = require('fs');
const utils = require('./utils');

const TOKEN_FILE='.app-token';

const user = {
    email: 'com.ayrton@gmail.com',
    password: 'Password01'
};

function loginAndSaveToken() {
    return new Promise(function (resolve, reject){    
        api.signin(user)
        .then(function (auth) {
            fs.writeFile(TOKEN_FILE, JSON.stringify(auth), function(err, data){
                if (err) {
                    console.log('[ERROR] Could not write file');

                    console.log('[ERROR] %o', err);

                    process.exit(1);
                }

                console.log("[INFO] saved token.");
                resolve(auth);
            }, reject);
        }, reject);
    })
}

function getToken() {
    return new Promise(function (resolve, reject) {
        fs.readFile(TOKEN_FILE, 'utf-8' ,function (err, buf) {
            var content=buf;
            if (!content) {
                loginAndSaveToken()
                .then(function (auth){
                    resolve(auth);
                }, reject);
            } else {
                var auth=JSON.parse(buf.toString());
                api.me(auth.reqToken)
                .then(function(){
                    resolve(auth);
                }, function (err) {
                    console.log('[WARN] Bad token. renewing');
                    loginAndSaveToken()
                    .then(function (auth){
                        main(auth);
                    }, reject);
                });
            }
        });
    });
}

exports.parseArguments = function() {
    const result = Object.create(null);
    process.argv.forEach((argument) => {
        if (argument.indexOf('=') != -1) {
            const index = argument.indexOf('=');
            const name = argument.substr(0, index);
            const value = argument.substr(index + 1);
            result[name] = value;
        }
    });    
    return result;
};

exports.token = getToken;
