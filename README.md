## Description

Shopping cart implementation with nest.js. 
1. User:
   
   ● Register - register user (email, password, name)
   
   ○ Email validation
   
   ○ Password validation
   
   ● Login
   
   ○ Return JWT token
   
   ● Logout
   
   ○ Invalid JWT token

2. *Product (name, price, image-url or image):
   
   ● Price validation, image type and size validation
   
   ● CRUD
3. Products List
4. *Cart
   
   ● Add product (product, price, quantity - all fields are required)
   
   ● ** Remove product from basket
5. *Get cart details:
    
   ● Products List
   
   ● Summary

*only logged user

**only basket owner

## Technologies
1. Nest.js
2. TypeORM
3. Postgres
4. Docker
5. Jest

## Before first run

1. Run `npm install`
2. Copy `.env.example` to `.env` and fill it with your data
3. Run tests `npm run test`

## API Docs

1. Postman collection and environment available in `./postman` (recommended)
2. Swagger documentation available at `/api`

## Running with docker

```bash
$ docker-compose up --build -V -d
```

## Running without docker

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## License

  [MIT licensed](LICENSE).
