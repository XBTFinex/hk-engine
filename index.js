const _=require('underscore');
const moment=require('moment');
const fetch=require('node-fetch');

fetch('http://127.0.0.1:5000/api/v1/user/me')
.then((Data) => {
    console.info("Data: ", Data.body);
});
