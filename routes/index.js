//
// URL: localhost:3005/
//

const express = require('express')
const app = express()
const fs = require('fs')
const people = JSON.parse(fs.readFileSync('/mnt/c/xampp/htdocs/juanportal/people.json'))
const morgan = require('morgan')
const mongoose = require('mongoose')

app.use(morgan('tiny'))


// ///////////////////////////////
// Get Profiles Promise
// ///////////////////////////////
/*
const profiles = new Promise(function (resolve, reject) {
  mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true })
  const profileSchema = new mongoose.Schema({
    'name': String,
    'description': String
  })
  const Profile = mongoose.model('Profile', profileSchema)
  Profile.find(function (err, res) {
    if (err) {
      console.error(err)
    }
    // console.log('FIRST RESULT', res)
    // console.log('FIRST RESULT LENGTH', res.length)
    // console.log('FIRST RESULT TYPEOF', typeof res)

    for(let i=0,l=res.length; i<l;i++){
      console.log('IN LOOP WHOLE OBJ', res[i])
      console.log('IN LOOP ID', res[i]._id)
      console.log('IN LOOP NAME', res[i]["name"])
    }

    resolve(res)
  })
})

profiles
  .then(function (resolved) {
    console.log(typeof resolved[0])
    console.log('Data of user 0:', resolved[0])
    console.log('Data of user 0s name:', resolved[0].name)
  })
*/

// On '/' render index.pug in views/ as pug expects it to be in views
app.get('/', (req, res) => {
  res.render('index', { // pass in variables to the file
    name: 'Edward',
    title: 'Homepage',
    people: people.profiles
  });
});

module.exports = app