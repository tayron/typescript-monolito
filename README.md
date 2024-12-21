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

- **GET /products** - Retorna todos os produtos cadastrados

Exemplo de chamada:
```sh 
curl http://localhost:3000/api/v1/products
```

- **GET /products/{id}/stock** - Retorna informação de stock de um produto, onde ```{id}``` é o id do produto no banco de dados

Exemplo de chamada:
```sh 
curl http://localhost:3000/api/v1/products/ee838f04-44c2-4e8a-8a01-12bc4c7141c9/stock
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

## Faturas
- **GET /invoice/{id}** - Permite a fatura da compra