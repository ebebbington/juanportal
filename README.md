# JuanPortal

JuanPortal is supposed to replicate (in some sense) a website that holds profiles of people, in which they can add and delete profiles. This utilises saving to a mongoose database, using a templating engine and limiting results. This project was created to help myself understand:
* HTML
* CSS
* Pug
* NodeJS
* ExpressJS
* Mongoose
  * Schemas
  * Models
  * Documents
  * Seeding
* NPM
* PM2

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

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Built With

* [NodeJS](http://www.nodejs.com) - Server Side Language
* [Nginx](https://nginx.com) - Webserver
* [Docker](https://docker.com) - Used for Building the Environment

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Edward Bebbington** - *Initial work* - [Place website name here](Place website url here)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc

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

Nginx runs on port 9002, and will proxy pass to the Node container running the app on port 3005.

Mongoseeder will seed the database with the dump from .docker/data/mongo-db-dump

