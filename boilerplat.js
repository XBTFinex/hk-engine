var schemaData={
    label: 'Test created_at of newly created schema #1' 
};

fetch('http://127.0.0.1:5000/api/v1/schema', {
    method:'GET',
    headers: {'Content-type': 'application/json',
              'Authorization': token}
}).then(function (Data) {
    Data.text().then(function (Resp){
        console.info(Resp);
    });
});

