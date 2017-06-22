const User = require('../model/user');
const Nodes = require('../model/nodes');
const passport = require('passport');

let lessonController = {
  renderEssentials: (req, res) => {
    if(!req.user) {
      return res.redirect('/');
    }
    var userName = req.user.getName();
    var userPhoto = req.user.getPhoto();

    // var query = Nodes.findOne ({ 'nodeNumber': 1});
    // console.log(query);

      res.render('user/essentialsLesson', {
        title: 'Essentials Lesson',
        name: userName,
        photo: userPhoto,
        user: req.user
      })
  }
}

module.exports = lessonController;
