# Projeto monolito


# Serviços disponíveis na API


## Produtos
- **POST /products** - Permite o cadastro de produtos

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

- **GET /products/{id}/stock** - Retorna informação de stock de um produto, onde ```{id}``` é o id do produto no banco de dados

Exemplo de chamada:
```sh 
curl http://localhost:3000/api/v1/products/f8fc2f72-c12f-466b-981d-d5856b3f7409/stock
```
## Clientes
- **POST /clients** - Permite o cadastro de clients

Exemplo de chamada:
```sh 
curl -X POST http://localhost:3000/api/v1/clients \
-H "Content-Type: application/json" \
-d '{
    "name": "Lucian",
    "email": "lucian@xpto.com",
    "document": "1234-5678",      
    "street": "Rua 123",
    "number": "99",
    "complement": "Casa Verde",
    "city": "Criciúma",
    "state": "SC",
    "zipCode": "88888-888"
}'
```

## Clientes
- **POST /clients** - Permite o cadastro de clients

Exemplo de chamada:
```sh 
curl -X POST http://localhost:3000/api/v1/clients \
-H "Content-Type: application/json" \
-d '{
    "name": "Lucian",
    "email": "lucian@xpto.com",
    "document": "1234-5678",      
    "street": "Rua 123",
    "number": "99",
    "complement": "Casa Verde",
    "city": "Criciúma",
    "state": "SC",
    "zipCode": "88888-888"
}'
```

## Pedidos
- **POST /checkout/** - Permite a realização do pedido de compra

## Faturas
- **GET /invoice/{id}** - Permite a fatura da compra