# Socket (Flask Server)

This section provides the socker server (endpoint) for the Chat side of JuanPortal

* Python Flask Server
* Flash SocketIO
* Redis communication

# Directory Structure / Description

***Please see the example file in each directory if it exists to understand how this project is architectured***

* `templates`

    * Holds the views to be rendered by Flask

* `.env`

    * The environment variables

* `app.py`

    * Entrypoint file and container of the whole applciation

* `ecosystem.config.yml`

    * Configuration used by PM2 written in YML to start the application

* `rediscommunicator`

    * Connects to and communicates with the Redis container

* `requirements.txt`

    * Holds pip packages to install (not in use)

# Tools Used
This is the list of all tools used here, which also act as the tools learnt, or tools implemented to learn:

* Python

    * CLasses
    * Flash
    * Flask SocketIO

* Redis