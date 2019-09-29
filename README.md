Creating a dum of mongo

* Insert the data into the db inside the docker container

* `mongodump -o /mongo-data-dump/

* `exit`

* `docker cp juanportal_mongo:/mongo-data-dump .`

Mac Environment

- Web Address: 0.0.0.0:9002
- Db Address: 10.x.x.x:27017

Windows Environment

- Web Address: 127.0.0.1:9002
- Db Address: 127.0.0.1:27017

Nginx runs on port 9002, and will proxy pass to the Node container running the app on port 3005.

Mongoseeder will seed the database with the dump from .docker/data/mongo-db-dump

