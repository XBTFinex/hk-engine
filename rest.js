#!/usr/bin/env node
const assert = require('assert');
const fetch=require('node-fetch');
const api=require('./api/main');
const _=require('underscore');
const fs = require('fs');
const utils = require('./utils');

const user = {
    email: 'com.ayrton@gmail.com',
    password: 'Password01'
};

const TOKEN_FILE='.app-token';


fs.readFile(TOKEN_FILE, 'utf-8' ,function(err, buf) {
    var content=buf;
    if (!content) {
        loginAndSaveToken()
        .then(function (auth){
            main(auth);
        });
    } else {
        var auth=JSON.parse(buf.toString());
        api.me(auth.reqToken)
        .then(function(){
            main(auth);
        }, function (err) {
            loginAndSaveToken()
            .then(function (auth){
                main(auth);
            });
        });
    }
});

function loginAndSaveToken() {
    return new Promise(function (resolve, reject){    
        api.signin(user)
        .then(function (auth) {
            fs.writeFile(TOKEN_FILE, JSON.stringify(auth), function(err, data){
                if (err) {
                    console.log('[ERROR] Could not write to file');
                    console.log('[ERROR] %o', err);
                    process.exit(1);
                    reject();
                }
                console.log("[INFO] saved token.");
                resolve(auth);
            }, reject);
        });
    })
}

function main(auth) {
    var args=utils.parseArguments();
    var url='http://127.0.0.1:5000/api/v1/'+process.argv[2];
    var method='GET';
    var token=auth.reqToken;

    if (args.token) {
        token=args.token;
    }

    if (args.method) {
        method=args.method;
    }

    var req={
        method: method,
        headers: {
            'Content-type': 'application/json',
            'Authorization': token
        }
    };

    if (args.method != 'GET' && args.body) {
        req.body = args.body;
    }

    console.info("[%s] %s", method.toUpperCase(), url);

    fetch(url, req)
    .then(function (Data){
        Data.json()
        .then(function (Resp){
            console.info('[RESP:json] %o', Resp);
        }, function (Err) {
            console.log('[WARN] Could parse response');
            console.log('[WARN] %o', Err);
        });
    }, function (Error){
        console.log('[ERROR] Could make request');
        console.log('[ERROR] %o', Error);
    });
}
