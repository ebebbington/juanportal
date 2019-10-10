const app = require('express')()
const ProfileModel = require('./../models/profile')
const logger = require('.././logger')

// On '/' render index.pug in views/ as pug expects it to be in views
app.get('/', (req, res) => {
  ProfileModel.find({}).sort({'date': -1}).limit(10).exec(function (err, profiles) {
    return res.render('index.pug', { // pass in variables to the file
      title: 'Homepage',
      people: profiles || []
    });
  })
});

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

module.exports = app
