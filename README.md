# Projeto monolito


# Serviços disponíveis na API


## Produtos
- **POST products** - Permite o cadastro de produtos

Exemplo de chamada:
```sh 
curl -X POST http://localhost:3000/api/v1/products \
-H "Content-Type: application/json" \
-d '{
  "name": "Example Product",
  "description": "This is a description of the example product.",
  "price": 29.99,
  "stock": 100
}'
```

- **GET products/{id}/stock** - Retorna informação de stock de um produto, onde ```{id}``` é o id do produto no banco de dados

Exemplo de chamada:
```sh 
curl http://localhost:3000/api/v1/products/f8fc2f72-c12f-466b-981d-d5856b3f7409/stock
```