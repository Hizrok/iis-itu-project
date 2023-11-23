# REST API server

## installation

create .env file and fill these fields:

```
ACCESS_TOKEN_SECRET=<secret>
PG_USER=<postgres user>
PG_HOST=<postgres host>
PG_DATABASE=<postgres db name>
PG_PASSWORD=<postgres user password>
PG_PORT=<postgres port>
PORT=<server port>
```

good ACCESS_TOKEN_SECRET can be generated with these commands:

```
node
require("crypto").randomBytes(64).toString("hex");
```

finally run these commands:

```
npm install
npm run dev
```

## API routes

### users API

| METHOD | ROUTE         | REQUIRED AUTH  | DESCRIPTION          |
| ------ | ------------- | -------------- | -------------------- |
| GET    | /users        | admin          | get all users        |
| GET    | /users/:login | admin or login | get user by login    |
| POST   | /users        | admin          | create new user      |
| PUT    | /users/:login | admin or login | edit existing user   |
| DELETE | /users/:login | admin or login | delete existing user |

example requests:

```
GET http://localhost:3000/users
Authorization: Bearer <token>

GET http://localhost:3000/users/teich01
Authorization: Bearer <token>

POST http://localhost:3000/users
Authorization: Bearer <token>
Content-Type: application/json

{
	"role": "admin",
	"name": "Petr",
	"surname": "Teichgráb",
	"email": "petr@teichgrab.cz"
}

PUT http://localhost:3000/users/teich00
Authorization: Bearer <token>
Content-Type: application/json

{
	"surname": "Svetr"
}

DELETE http://localhost:3000/users/teich00
Authorization: Bearer <token>

```

courses

```
GET     /courses                get all courses
GET     /courses/:course_id     get course by id
POST    /courses                add new course
```

rooms

```
GET     /rooms                  get all rooms
GET     /rooms/:id              get room by id
POST    /rooms                  add new room
DELETE  /rooms/:id              delete room with id
```
