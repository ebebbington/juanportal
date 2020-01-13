# JuanPortal (Project)

JuanPortal is a personal learning application that allows users to create and save Profiles, view and delete those Profiles. It provides a training or learning ground to improve my own knowledge and ability regarding a NodeJS application.

This project contains:

* The docker environment required to build the sever(s)
* The main application
* The API (data layer)

## Tools used

* Docker

    * Containers
    * Networking
    * General use

## Flow

* The root directory builds both express servers
* Juanportal acts as the client for endpoints, views etc. Which will communicate with the API when it needs to
* Both servers use the same Nginx configuration

## Components

JuanPortal is split into 2 applications:

### API

This is the Data layer for JuanPortal (any database related actions or relations reside here, server-side focus).

See the documentation for the API [here](https://github.com/ebebbington/juanportal/blob/develop/src/api/README.md)

### Main App (Juanportal)

This is the main server (client-side focus) which communicates with the API, displays views and utilises React components. Essentially, this server serves as the client-side area of the whole project.

See the documentation for the Main App [here](https://github.com/ebebbington/juanportal/blob/develop/src/juanportal/README.md)

## Prerequisites

Have Docker installed. This can be for Windows or for Mac - as long as you have Docker accessible in the command line. Docker knowledge is also essential to know commands such as `docker-compose down` and `docker system prune`.

### Ports

Make sure the port 9002 is open for Nginx.

## Run the Project

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

## Built With

* [NodeJS](http://www.nodejs.com) - Server Side Language
* [Nginx](https://nginx.com) - Webserver
* [Docker](https://docker.com) - Used for Building the Environment
* [ReactJS](https://reactjs.com) - UI
* [MongoDB](https://mongodb.com) - Database
* [TypeScript](https://typescript.com) - Strict Data Types

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Edward Bebbington** - *Initial work* - [Place website name here](Place website url here)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Adam Jeffery - Docker environment support, and support for learning all these technologies

## Notes

### Creating a data dump for mongoose

* `exec` into the container and create the documents inside the database

* Once the database has been updated, type `mongodump -o /mongo-data-dump/`

* Exit the container and grab the files: `docker cp juanportal_mongo:/mongo-data-dump .``

### IP's and Ports

Mac Environment

- Web Address: 0.0.0.0:9002
- Db Address: 10.x.x.x:27017

Windows Environment

- Web Address: 127.0.0.1:9002
- Db Address: 127.0.0.1:27017

Nginx runs on port 9002, and will proxy pass to the Node container (Main App) running the app on port 3005.

Mongoseeder will seed the database with the dump from .docker/data/mongo-db-dump