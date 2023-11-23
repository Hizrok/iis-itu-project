# REST API

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
```

```json
[
  ...
  {
    "role": "admin",
    "login": "admin",
    "name": null,
    "surname": null,
    "email": null
  },
  ...
]
```

```
GET http://localhost:3000/users/teich01
Authorization: Bearer <token>
```

```json
{
  "role": "admin",
  "login": "teich00",
  "name": "Petr",
  "surname": "Teichgráb",
  "email": "petr@teichgrab.cz"
}
```

```
POST http://localhost:3000/users
Authorization: Bearer <token>
Content-Type: application/json

{
	"role": "admin",
	"name": "Petr",
	"surname": "Teichgráb",
	"email": "petr@teichgrab.cz"
}
```

```json
{
  "msg": "successfully added user teich01",
  "user": {
    "role": "admin",
    "login": "teich01",
    "name": "Petr",
    "surname": "Teichgráb",
    "email": "petr@teichgrab.cz"
  }
}
```

```
PUT http://localhost:3000/users/teich00
Authorization: Bearer <token>
Content-Type: application/json

{
	"surname": "Svetr"
}
```

```json
{
  "msg": "successfully edited user teich00",
  "user": {
    "role": "admin",
    "name": "Petr",
    "surname": "Svetr",
    "email": "petr@teichgrab.cz"
  }
}
```

```
DELETE http://localhost:3000/users/teich00
Authorization: Bearer <token>
```

```json
{
  "msg": "successfully deleted user teich01"
}
```

### courses API

| METHOD | ROUTE        | REQUIRED AUTH      | DESCRIPTION            |
| ------ | ------------ | ------------------ | ---------------------- |
| GET    | /courses     | NONE               | get all courses        |
| GET    | /courses/:id | NONE               | get course by id       |
| POST   | /users       | admin or guarantor | create new course      |
| PUT    | /courses/:id | admin or guarantor | edit existing course   |
| DELETE | /courses/:id | admin or guarantor | delete existing course |

example requests:

```
GET http://localhost:3000/courses
```

```json
[
  ...
  {
    "id": "IMA1",
    "name": "Tvorba uživatelského rozhraní",
    "annotation": "lorem ipsum",
    "guarantor": {
      "login": "admin",
      "name": null,
      "surname": null,
      "email": null
    }
  },
  ...
]
```

```
GET http://localhost:3000/courses/ITU
```

```json
{
  "id": "IMA1",
  "name": "Tvorba uživatelského rozhraní",
  "annotation": "lorem ipsum",
  "guarantor": {
    "login": "admin",
    "name": null,
    "surname": null,
    "email": null
  }
}
```

```
POST http://localhost:3000/courses
Authorization: Bearer <token>
Content-Type: application/json

{
	"id": "ITU",
	"name": "Tvorba uživatelského rozhraní",
	"annotation": "lorem ipsum",
	"guarantor": "teich00"
}
```

```json
{
  "msg": "successfully created course ITU",
  "course": {
    "id": "ITU",
    "name": "Tvorba uživatelského rozhraní",
    "annotation": "lorem ipsum",
    "guarantor": "teich00"
  }
}
```

```
PUT http://localhost:3000/courses/ITU
Authorization: Bearer <token>
Content-Type: application/json

{
	"annotation": "lorem ipsum lorem ipsum"
}
```

```json
{
  "msg": "successfully edited course",
  "course": {
    "id": "ITU",
    "name": "Tvorba uživatelského rozhraní",
    "annotation": "lorem ipsum lorem ipsum",
    "login": "teich00"
  }
}
```

```
DELETE http://localhost:3000/courses/ITU
Authorization: Bearer <token>
```

```json
{
  "msg": "successfully deleted course"
}
```

### rooms API

| METHOD | ROUTE      | REQUIRED AUTH | DESCRIPTION          |
| ------ | ---------- | ------------- | -------------------- |
| GET    | /rooms     | NONE          | get all rooms        |
| GET    | /rooms/:id | NONE          | get room by id       |
| POST   | /rooms     | admin         | create new room      |
| PUT    | /rooms/:id | admin         | edit existing room   |
| DELETE | /rooms/:id | admin         | delete existing room |

```
GET http://localhost:3000/rooms
```

```json
[
  ...
  {
    "id": "B199",
    "building": "B",
    "floor": 1,
    "number": 99,
    "capacity": 100
  },
  ...
]
```

```
GET http://localhost:3000/rooms/A101
```

```json
{
  "id": "A101",
  "building": "A",
  "floor": 1,
  "number": 1,
  "capacity": 100
}
```

```
POST http://localhost:3000/rooms
Authorization: Bearer <token>
Content-Type: application/json

{
	"building": "A",
	"floor": 1,
	"number": 1,
	"capacity": 100
}
```

```json
{
  "msg": "successfully added a new room",
  "room": {
    "id": "A101",
    "building": "A",
    "floor": 1,
    "number": 1,
    "capacity": 20
  }
}
```

```
PUT http://localhost:3000/rooms/A101
Authorization: Bearer <token>
Content-Type: application/json

{
	"capacity": 100
}

```

```json
{
  "msg": "successfully edited room",
  "room": {
    "id": "A101",
    "building": "A",
    "floor": 1,
    "number": 1,
    "capacity": 100
  }
}
```

```
DELETE http://localhost:3000/rooms/A101
Authorization: Bearer <token>
```

```json
{
  "msg": "successfully deleted room A101"
}
```
