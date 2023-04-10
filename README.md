# Universities API

API  de gerenciamento de universidades, desenvolvido em NestJS, utilzando MongoDB.

Contendo todas as universidades listadas dos seguintes países: 

 - Argentina
 - Brasil
 - Chile
 - Colombia
 - Paraguay
 - Peru
 - Suriname
 - Uruguay

### Resumo
A API foi desenvolvida em NestJS utilizando Typescript que é um framework NodeJs muito utilizado para aplicações robustas e escaláveis, que usa Express por padrão e nele também é utilizado o mongoose como framework para a persistência de dados.

### Autenticação
Autenticação utilizando JasonWebTokens em todas as rotas de universidades.

### Manejo de senhas
Todas as senhas são criptografadas utilizado o hash de senha disponível na biblioteca Bcrypt antes da inserção no banco.

### Limitador de acesso
Todas as rotas possuem um limitador de taxa de requisições, permitindo 10 requisições do mesmo cliente durante 1 minuto, além disso o mesmo precisa aguardar o tempo de espera, a limitação de acesso as rotas ajuda a evitar ataques de negação de serviço por alta carga.
### Acesso do banco
Nas variáveis de ambiente é possível alterar a origem do mongo, é possivel utilizar o
(MongoAtlas)[https://www.mongodb.com/cloud/atlas/register] que é o atual configurado, mas também é possível utilizar o mongo disponibilizado pelo docker-compose, bastando remover o comentário da URI localhost e comentar a URI mongodb+srv.

### População do banco
A população do banco de dados é feito utilizando uma migration disponível na API.

### Atualização das universidades
A atualização da lista de universidade é diária, acontecendo todos os dias á meia noite.

### Documentação
A documentação das rotas são autogeradas pelo Swagger, que é uma API pública de documentação.

## Instalação

Clone este repositório:

```bash
git clone https://github.com/Andrei-Majada/Backend-challenge-universities.git
```

### Execução

No diretório de origem abra o terminal e execute **na ordem** a lista de comandos. 

### Env
Estas são as variaveis de ambiente que precisam ser criadas no arquivo .env 
```bash
PORT= ${port}
MONGOURI='mongodb://localhost:27017/universitiesAPI'
SECRET= ${secret}
SALT_ROUNDS=10
UNIVERSITIES_URL='http://universities.hipolabs.com/search?country='
TOKEN_EXPIRATION_TIME='1d'
```
* caso prefira basta alterar o env.example para .env!

```bash
npm install
```
O banco de dados MongoDB foi containerizado para a aplicação, caso não tenha o Docker instalado é possível seguir o tutorial de instalação no [link](https://www.docker.com/).
```bash
docker-compose up -d
```
Para popular o banco de dados que está sendo utilizado, utilizei a biblioteca migrate-mongo. Criei o script migrate:up que realiza uma requisição na rota de universidades, cria a collection e popula com as universidades dos países listados acima.
```bash
npm run migrate:up
```
e depois
```bash
npm run start
```
Caso todos os comando obtenham êxito a API deve estar rodando e disponível na porta 3000.
Como documentação da aplicação utilizei a biblioteca Swagger, com ela é possível simular requisições a todas as rotas contendo os parâmetros e *bodys* necessários.
Para acessar o Swagger acesse a rota:
```bash
localhost:3000/docs
```
Foi criado também o migrate:down que apaga todos os elementos da collection de universidades.
```bash
npm run migrate:down
```

## hospedagem
Caso queira testar a aplicação em produção, a API está rodando em uma instancia t2.small na AWS EC2(Elastic Compute Cloud).

URL: ```http://ec2-34-227-222-176.compute-1.amazonaws.com/docs```

Foi utilizado o (PM2)[https://pm2.keymetrics.io/] para garantir o gerenciamento de acessos e disponibilidade da máquina em produção.

*Caso tenha problemas para acessar entre em contato comigo.

### Testes
Os testes unitários e end-to-end foram desenvolvidos utilizando Jest e supertest, é possivel verifica-los com o comando:
```
npm run test
```
e para somente os end2end o comando:
```
npm run test:e2e
```

## Rotas
baseURL aqui é representado pelo localhost:3000 ou o DNS público do EC2.

#### Universities:
Criação de novas universidades.
##### create:
**POST** /universities

**Authorization**: Bearer token.

**Body**:
 ```
 {
	"state-province":  "string",
	"web_pages":  ["string"],
	"country":  "string",
	"name":  "string",
	"alpha_two_code":  "string",
	"domains":  ["string"]
}
```
**responses:**
 ```
 201: { payload da universidade criada }
 400: { alguma informação foi inserida incorreta ou fora dos padrões estabelecidos. }
```
----------------
##### findAll:
Busca pelas universidades disponíveis no banco, rota com paginação de 20 registros por pagina e filtro por país.

**GET** /universities/:page/:country

**Authorization**: Bearer token.

**Params**:

page: por conta da paginação da rota é necessário informar a pagina desejada.

country: caso precise filtrar as universidades por país é possível informa-lo aqui, caso queira basta informar a palavra **Any**.

**responses:**
 ```
 200: [{ lista de universidades, quantidade total de páginas e página atual }]
 400: { alguma informação foi inserida incorreta ou fora dos padrões estabelecidos. }
```
----------------
##### findById:
Busca por uma universidade pelo identificados da mesma.

**GET** /universities/:id

**Authorization**: Bearer token.

**Params**:

id: é o identificador de um registro de universidade no banco.

**responses:**
 ```
 200: { universidade encontrada }
 400: { alguma informação foi inserida incorreta ou fora dos padrões estabelecidos. }
```
----------------
##### update:
Atualização de um registro de universidade.

**PUT** /universities/:id

**Authorization**: Bearer token.

**Params**:

id: é o idv4 que identifica a universidade no banco.

**Body**:
 ```
 {
	"web_pages":  ["string"],
	"name":  "string",
	"domains":  ["string"]
}
```
**responses:**
 ```
 200: { universidade atualizada }
 400: { alguma informação foi inserida incorreta ou fora dos padrões estabelecidos. }
```
----------------
##### delete:
Remoção de um registro de universidade.

**Delete** /universities/:id

**Authorization**: Bearer token.

**Params**:

id: é o idv4 que identifica a universidade no banco.

**responses:**
 ```
 200: sem retorno
 400: { alguma informação foi inserida incorreta ou fora dos padrões estabelecidos. }
```


#### Usuários:
Criação de um novo usuário, o email precisa ser único.
##### create:

**POST** /users

**Body**:
 ```
{
	"name":  "string",
	"email":  "string",
	"password":  "string"
}
```
**responses:**
 ```
 201: { id, nome e email do usuário criado }
 400: { alguma informação foi inserida incorreta ou fora dos padrões estabelecidos. }
```
----------------
##### auth:
Login de um usuário com email e senha.

**POST** /users/auth

**Body**:
 ```
{
	"email":  "string",
	"password":  "string"
}
```
**responses:**
 ```
 201: { access_token: 'token jwt' }
 400: { alguma informação foi inserida incorreta, fora dos padrões estabelecidos ou usuário não encontrado. }
```
----------------
##### recovery password:
Recuperação de senha através do email, a rtoa retorna a URL que deve ser utilizada para alteração da senha.

**POST** /users/recovery

**Body**:
 ```
{
	"email":  "string",
}
```
**responses:**
 ```
 201: { recoveryUrl: 'url com jwt unico para recuperação de senha' }
 400: { alguma informação foi inserida incorreta, fora dos padrões estabelecidos ou usuário não encontrado. }
```
----------------
##### change password:

Utilizada para alteração de senha, recebida pela recuperação de senha, para alterar basta informar a nova senha e a confirmação de nova senha.

*Não pode ser igual a senha anterior

**POST** /users/recovery/:token
**Body**:
 ```
{
	"newPassword":  "string",
	"confirmNewPassword":  "string"
}
```
**responses:**
 ```
 201: senha alterada com sucesso!
 400: { alguma informação foi inserida incorreta, a nova senha não pode ser igual a anterior ou as senhas inseridas não são iguais. }
```
