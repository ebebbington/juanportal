installServices ()
{
	yum install npm
	sleep 1
	npm init
	sleep 1
	yum install pm2
	sleep 1
	yum install nodejs
	sleep 1
}

installNpmPackages ()
{
	npm install body-parser
	sleep 1
	npm install commander
	sleep 1
	npm install express
	sleep 1
	npm install express-validator
	sleep 1
	npm install formidable
	sleep 1
	npm install mongoose
	sleep 1
	npm install mongoose-sanitizer
	sleep 1
	npm install morgan
	sleep 1
	npm install multer
	sleep 1
	npm install pug
	sleep 1
}

installServices
installNpmPackages
