# create some products
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"name":"Milk"}' http://localhost:8080/api/v1/product

curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"name":"Bread"}' http://localhost:8080/api/v1/product

curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"name":"Apple"}' http://localhost:8080/api/v1/product

# fetch the products
curl http://localhost:8080/api/v1/product

[
   {
      "name" : "Milk",
      "id" : 1
   },
   {
      "name" : "Bread",
      "id" : 2
   },
   {
      "name" : "Apple",
      "id" : 3
   }
]
