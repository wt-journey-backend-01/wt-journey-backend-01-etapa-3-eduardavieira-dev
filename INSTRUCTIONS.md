# Como rodar o projeto na sua maquina

Requisitos: ter o docker instalado no seu computador, vs code e o node

Executar o docker
```
docker compose up -d
```
(mostre como parar no final das intruções)

Executar o migrations
```
npx knex migrate:latest
```

Executar o seeds para popular o banco de dados

```
npx knex seed:run
```

docker compose --env-file .env up
docker compose --env-file .env up -d

testar:
docker exec db-departamento-policial psql -U postgres -d policia_db -c "SELECT * FROM agentes;"