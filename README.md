<p align="center">
  <h1 align="center">JuanPortal</h1>
</p>
<p align="center">
  <a href="https://github.com/ebebbington/juanportal/actions">
    <img src="https://img.shields.io/github/workflow/status/ebebbington/juanportal/master?label=ci">
  </a>
  <a href="https://img.shields.io/badge/API%20coverage-90%25-green">
    <img src="https://img.shields.io/badge/API%20coverage-94.18%25-green">
  </a>
</p>

---

JuanPortal is a personal learning application that allows users to create and save Profiles, view and delete those Profiles. It provides a training or learning ground to improve my own knowledge and ability regarding a NodeJS application.

This project contains:

* The docker environment required to build the sever(s)
* The main application, an express server
* The API (data layer), an express server
* A Socket.io Node server
* Mongo db
* Redis for caching
* Nginx for proxy server
* React frontend

# Components

JuanPortal is split into 3 applications:

## API

This is the Data layer for JuanPortal (any database related actions or relations reside here, server-side focus).

See the documentation for the API [here](https://github.com/ebebbington/juanportal/blob/develop/src/api/README.md)

## Main App (Juanportal)

This is the main server (client-side focus) which communicates with the API, displays views and utilises React components. Essentially, this server serves as the client-side area of the whole project.

See the documentation for the Main App [here](https://github.com/ebebbington/juanportal/blob/develop/src/juanportal/README.md)

## Socket

This acts as the server-side to the socket connection

See the documentation for the Socket [here](https://github.com/ebebbington/juanportal/blob/develop/src/socket/README.md)

# Prerequisites

Have Docker installed. This can be for Windows or for Mac - as long as you have Docker accessible in the command line. Docker knowledge is also essential to know commands such as `docker-compose down` and `docker system prune`.

## Ports

Make sure the port 9002 is open for Nginx.

# Run the Project

Clone the repository

```
cd /your/chosen/dir
git clone https://github.com/ebebbington/juanportal.git
cd juanportal
```

Build and start Docker

```
docker-compose build && docker-compose up
```

Check the Docker containers are running

```
docker-compose ps
```

Finally, go to the website

* Mac
     `0.0.0.0:9002`
     
* Windows
     `127.0.0.1:9002`

# Containers

## JuanPortal

Juanportal is the main server, where Nginx passes `/` as the proxy to the JuanPortal container. JP acts as the client, or will display anything the client sees for this project

## API

The NodeJS API acts as the data layer for JP, serving to produce and modify the database data. The API currently only receieves requests from JP

## Mongo

Setup as the database for this project

## Mongo Seeder

Populates the mongoose database with pre defined data

## Socket

A express server acting as the web socket server

## Redis

A Redis server to allow communication between the Socket and JuanPortal containers

## Nginx

Server that acts as a proxy for the API, Juanportal, and Socket containers

# Built With

* [NodeJS](http://www.nodejs.com) - Server Side Language
* [Nginx](https://nginx.com) - Webserver
* [Docker](https://docker.com) - Used for Building the Environment
* [ReactJS](https://reactjs.com) - UI
* [MongoDB](https://mongodb.com) - Database
* [TypeScript](https://typescript.com) - Strict Data Types

# Acknowledgments

* Adam Jeffery - Docker environment support, and support for learning all these technologies

# Notes

## Creating a data dump for mongoose

* `exec` into the container and create the documents inside the database

* Once the database has been updated, type `mongodump -o /mongo-data-dump/`

* Exit the container and grab the files: `docker cp juanportal_mongo:/mongo-data-dump .``

## IP's and Ports

Mac Environment

- Web Address: 0.0.0.0:9002
- Db Address: 10.x.x.x:27017

Windows Environment

- Web Address: 127.0.0.1:9002
- Db Address: 127.0.0.1:27017

Nginx runs on port 9002, and will proxy pass to the Node container (Main App) running the app on port 3005.

Mongoseeder will seed the database with the dump from .docker/data/mongo-db-dump
