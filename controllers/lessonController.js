const User = require('../model/user');
const Nodes = require('../model/nodes');
const passport = require('passport');

let lessonController = {
  renderEssentials: (req, res) => {
    if(!req.user) {
      return res.redirect('/');
    }

    Nodes.find({}, function(err, nodes) {
      var userName = req.user.getName();
      var userPhoto = req.user.getPhoto();
      if(req.user.local.name) {
        var userPhoto = '../../' + userPhoto;
      }

      var topicsArray = [];
      var imagesArray = [];
      var nodeNumberArray = [];
      var questionsArray = [];
      var optionsArray = [];
      var correctAnswersArray = [];

      for(var i=0;i<nodes.length;i++) {
        topicsArray.push(nodes[i].topic);
        imagesArray.push(nodes[i].xrayImage);
        nodeNumberArray.push(nodes[i].nodeNumber);
        questionsArray.push(nodes[i].question);
        optionsArray.push(nodes[i].options);
        correctAnswersArray.push(nodes[i].correctAnswer);
      }

      // console.log(topicsArray);
      // console.log(imagesArray);
      // console.log(nodeNumberArray);
      // console.log(questionsArray);
      console.log(optionsArray);
      // console.log(correctAnswersArray);

      res.render('user/essentialsLesson', {
        title: 'Essentials Lesson',
        name: userName,
        photo: userPhoto,
        nodeNumber: nodeNumberArray,
        topic: topicsArray,
        question: questionsArray,
        options: optionsArray
      })
    })
  }

};

module.exports = lessonController;
