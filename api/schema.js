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
            Data.json().then(function (Resp) {
                if (Resp.id) {
                    resolve(Resp);
                } else {
                    reject(Resp);
                }
            }, reject);
        }, reject);
    })
}

function update(token, data) {
    return new Promise(function (resolve, reject){
        if (!data.id) {
            reject({
                error: "object without id"
            });
            return;
        }

        fetch('http://127.0.0.1:5000/api/v1/schema/'+data.id, {
            method:'PUT',
            headers: {'Content-type': 'application/json',
                     'Authorization': token},
            body: JSON.stringify(data)
        }).then(function (Data) {
            Data.json().then(function (Resp) {
                if (Resp.id) {
                    resolve(Resp);
                } else {
                    reject(Resp);
                }
            }, reject);
        }, reject);
    });
}

function fetch_(token, filter) {
    return new Promise(function (resolve, reject){
        filter = filter || {};
        var url='http://127.0.0.1:5000/api/v1/schema?';

        if (filter.offset) {
            url += 'offset='+filter.offset+'&';
        }
        if (filter.limit) {
            url += 'limit='+filter.limit+'&';            
        }

        fetch(url, {
            method:'GET',
            headers: {'Content-type': 'application/json',
                     'Authorization': token},
        }).then(function (Data) {
            Data.json().then(function (Resp) {
                if (Resp.list) {
                    resolve(Resp);
                } else {
                    reject(Resp);
                }
            }, reject);
        }, reject);
    });
}

function delete_(token, id) {
    return new Promise(function (resolve, reject){
        fetch('http://127.0.0.1:5000/api/v1/schema/'+id, {
            method:'DELETE',
            headers: {'Content-type': 'application/json',
                     'Authorization': token}
        }).then(function (Data) {
            resolve(Data);
        }, reject);
    });
}

function byId(token, id) {
    return new Promise(function (resolve, reject){
        fetch('http://127.0.0.1:5000/api/v1/schema/'+id, {
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

function fields(token, id) {
    return new Promise(function (resolve, reject){
        filter = filter || {};
        var url='http://127.0.0.1:5000/api/v1/schema/'+id+'/fields';

        fetch(url, {
            method:'GET',
            headers: {'Content-type': 'application/json',
                     'Authorization': token},
        }).then(function (Data) {
            Data.json().then(function (Resp) {
                if (Resp.list) {
                    resolve(Resp);
                } else {
                    reject(Resp);
                }
            }, reject);
        }, reject);
    });
}

function addField(token, schemaId, data) {
    return new Promise(function (resolve, reject) {
        if (!data.schemaId) {
            reject({
                error: 'field.schemaId is mandatory'
            });
            return;
        }

        fetch('http://127.0.0.1:5000/api/v1/schema/'+schemaId+'/fields', {
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

function addObject(token, data) {
    var url='http://127.0.0.1:5000/api/v1/object/new';
    return new Promise(function (resolve, reject) {
        fetch(url, {
            method:'POST',
            headers: {'Content-type': 'application/json',
                     'Authorization': token},
            body: JSON.stringify(data)
        }).then(function (Data){
            Data.json().then(function (Resp) {
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
exports.update = update;
exports.byId = byId;
exports.delete = delete_;
exports.fetch = fetch_;
exports.fields = fields;
exports.addField = addField;
exports.addObject = addObject;