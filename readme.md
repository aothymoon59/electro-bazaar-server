## Electric gadgets Management Dashboard

- Live Link: https://l2b2a5-electronic-gadget-backend.vercel.app/

- Postman Documentation link: https://documenter.getpostman.com/view/29000250/2sA2r55RRd

### Step 1

- Create a .env file in the root directory of this project. And use this code on .env file

```
NODE_ENV= enter your env status
PORT=5000
DATABASE_URL= your db url
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET= your access secret
JWT_REFRESH_SECRET= your refresh secret
JWT_ACCESS_EXPIRES_IN= your expires in
JWT_REFRESH_EXPIRES_IN= your refresh in
```

### Step 2

- Install all necessary dependency

```
npm install
```

### Step 3

- Run the Project

###### for development

```
npm run start:dev
```

or

###### for production

```
npm run build
```

```
npm run start:prod
```
