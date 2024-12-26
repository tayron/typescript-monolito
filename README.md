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
  "salesPrice": 35.00,
  "stock": 100
}'
```

- **GET /products** - Retorna todos os produtos cadastrados

Exemplo de chamada:
```sh 
curl http://localhost:3000/api/v1/products
```

- **GET /products/{id}/stock** - Retorna informação de stock de um produto, onde ```{id}``` é o id do produto no banco de dados

Exemplo de chamada:
```sh 
curl http://localhost:3000/api/v1/products/b9267eb2-bcbf-4f7e-962b-815609b5214a/stock
```

---

## Clientes
- **POST /clients** - Permite o cadastro de clientes

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

- **GET /clients** - Retorna todos os clientes cadastrados

Exemplo de chamada:
```sh 
curl http://localhost:3000/api/v1/clients
```

## Pedidos
- **POST /checkout/** - Permite a realização do pedido de compra
Exemplo de chamada:
```sh 
curl -X POST http://localhost:3000/api/v1/checkout \
-H "Content-Type: application/json" \
-d '{
    "clientId": "b3b0f23d-f1d6-4f90-bba6-d74c0334a30c",
    "products": [{"productId": "b9267eb2-bcbf-4f7e-962b-815609b5214a"}]
}'
```

## Faturas
- **GET /invoice/{id}** - Permite a fatura da compra