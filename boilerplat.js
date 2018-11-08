var schemaData={
};

fetch('http://127.0.0.1:5000/api/v1/schema/new', {
    method:'POST',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify(schemaData)
}).then(function (Data) {
    Data.text().then(function (Resp){
        console.info(Resp);
    });
});

