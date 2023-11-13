# REST API server

To run this client open a terminal inside this folder and use these commands:

- npm install
- npm run dev

### routes

users

```
GET     /users                  get all users
GET     /users/:login           get user by login
POST    /users                  add new user
PUT     /users/:login           edit user with login
DELETE  /users/:login           delete user with login
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
