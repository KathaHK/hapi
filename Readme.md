# REST API Server for a Social Network Platform

REST API for the Backend. This Server is based on hapi and mongodb. 
Files are stored in filesystem and the sourcecode is written in Typescript.

## How to start the server

### MongoDb
The data will be stored in a mongoDb. First install and run a mongoDb server.
The server connects with default settings to the mongodb. 
This is **without authentication** via **localhost** at default port **27017**.
To change this settings edit the config file under ``/build/src/configurations/config.dev.json``

### hapi Server

To start the sever install all dependencies with:

``` npm install ```

after installing just start the server with

```npm start ```

Server runs on port `5000` and is available under [http://localhost:5000](http://localhost:5000)

## Endpoints and documentation

To access the documentation containing all informations about the endpoints 
visit [http://localhost:5000/docs](http://localhost:5000/docs) after server started.

## Testing the endpoints

There are two ways of testing the REST Endpoints.

1. perform a request via the documentation by filling out the forms
2. use [postman](https://www.getpostman.com/) (a small request builder) and import
the library by selecting the `Social Network.postman_collection.json` file in this project.

## Getting started 

### Create a User
1. create a user via the registration endpoint ([see swagger](https://www.getpostman.com/))
Send the following json to register via `POST` to the endpoint ``/user`:
```
{
  "email": "test@example.com",
  "name": "Max Musterman",
  "password": "admin"
}
```
The response will be an authentication token (which is used for session handling):
````
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5NGU4YjRhMzA3YjU1YTMxMTgwNDIwYyIsInNjb3BlIjpbXSwiZW1haWwiOiJ0ZXN0MkBleGFtcGxlLmNvbSIsImlhdCI6MTQ5ODMxOTY5MCwiZXhwIjoxNDk4MzIzMjkwfQ.Hqco9uZOeDaFTTSwxTBnr3g-z6pPIbY64vDddhrMYYI"
}
````
Note: this token is only an example and not valid!

2. For each other request send the token via a header attribute like so:

```
authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5NGU4YjRhMzA3YjU1YTMxMTgwNDIwYyIsInNjb3BlIjpbXSwiZW1haWwiOiJ0ZXN0MkBleGFtcGxlLmNvbSIsImlhdCI6MTQ5ODMxOTY5MCwiZXhwIjoxNDk4MzIzMjkwfQ.Hqco9uZOeDaFTTSwxTBnr3g-z6pPIbY64vDddhrMYYI
```

### Post Messages on a Wall
1. use the ``/post`` endpoint via POST to send messages to the system
2. use the ``/post`` endpoint via GET to get all messages by the users you are following and your own.

Note: always send the authorization token in the headers!

### Follow a User
1. use the ``/users/follow`` via PUT to link a userId to your account. 
The Body of the request contains the userId of the user you want to follow:
```
{
	"following": "594e45c71155d30942bfafd8"
}
```
Note: the id is an example and not valid! Get other Users by calling ``/users`` via GET.

2. To unfollow call the same request but with the ``/users/unfollow`` endpoint.