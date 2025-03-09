# Store SilaPay

## Banco de dados: MariaDB

### Executar o script para subir o bando de dados:

```sh
  docker run -d \
    --name db \
    -e MYSQL_ROOT_PASSWORD=password \
    -e MYSQL_DATABASE=store \
    -e MYSQL_USER=user \
    -e MYSQL_PASSWORD=password \
    -p 3306:3306 \
    --restart unless-stopped \
    mariadb:latest
```

## .env

### Executar o comando abaixo para ter acesso aos dados de conexao com banco:

```sh
  docker inspect db
```

procurar por IPAddress para encontrar o IP do banco.

## Dentro do .env

Após o @, adicionar o IPAddress encontrato no passo anterior


```sh
  DATABASE_URL="mysql://root:PASSWORD@IPAddress:Port/DB_NAME"
```

## Executar para subir o Backend

```sh
  npm run start:dev
```


## Executar para rodar as migrations

```sh
  npx prisma migrate dev --name init
```

## Collection SilaPay

Na raiz do projeto existe um arquivo json para ser importado para um client de request
http: collection-silapay.json. 

Fazer a importação para um postman ou insomnia caso queira testar os endpoints.



