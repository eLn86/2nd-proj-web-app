const User = require('../model/user');
const Nodes = require('../model/nodes');
const passport = require('passport');

let lessonController = {
  renderEssentials: (req, res) => {
    if(!req.user) {
      return res.redirect('/');
    }
    // var newNode = new Nodes();
    // newNode.nodeNumber = 1;
    // newNode.topic = "Anatomical Variant";
    // newNode.xrayImage = 'http://www.radiologymasterclass.co.uk/images/competition/image_q1_cxr_big.jpg';
    // newNode.question = "Which anatomical variant is visible?";
    // newNode.options = {
    //   a: "A - Azygos fissure",
    //   b: "B - Cervical rib",
    //   c: "C - Dextrocardia",
    //   d: "D - Pectus excavatum"
    // };
    // newNode.correctAnswer = newNode.options.a;
    // newNode.explanation = "An azygos fissure is clearly demonstrated. This is a normal variant seen on 1-2% of chest radiographs. There is no cervical rib visible."
    // newNode.save();
    //
    // var newNode2 = new Nodes();
    // newNode2.nodeNumber = 2;
    // newNode2.topic = "General Chest Essentials";
    // newNode2.xrayImage = 'http://www.radiologymasterclass.co.uk/images/competition/image_q5_cxr_big.jpg';
    // newNode2.question = "Which of the following is a life threatening abnormality?";
    // newNode2.options = {
    //   a: "A - Tension pneumothorax",
    //   b: "B - Pneumoperitoneum",
    //   c: "C - Pneumobilia",
    //   d: "D - Pulmonary oedema"
    // };
    // newNode2.correctAnswer = newNode.options.b;
    // newNode2.explanation = "Free gas under the diaphragm forms crescents of low density (black) under each hemidiaphragm. In the setting of acute abdominal pain this is a sign of bowel perforation."
    // newNode2.save();
    //
    // var newNode3 = new Nodes();
    // newNode3.nodeNumber = 3;
    // newNode3.topic = "Lungs";
    // newNode3.xrayImage = 'http://www.radiologymasterclass.co.uk/gallery/competitions/chest_test_1_questions/chest_test_2.html';
    // newNode3.question = "How is the abnormality of the right lung best described?";
    // newNode3.options = {
    //   a: "A - Pneumothorax",
    //   b: "B - Hyperexpansion",
    //   c: "C - Upper lobe collapse and consolidation",
    //   d: "D - Lower lobe collapse"
    // };
    // newNode3.correctAnswer = newNode.options.c;
    // newNode3.explanation = "The right upper lobe is collapsed (raised horizontal fissure). Air bronchogram within the right upper zone indicates consolidation."
    // newNode3.save();
    //
    // var newNode4 = new Nodes();
    // newNode4.nodeNumber = 4;
    //  newNode4.topic = "Lungs";
    //  newNode4.xrayImage = 'http://www.radiologymasterclass.co.uk/images/competition/image_q11_cxr_big.jpg';
    //  newNode4.question = "This patient has right middle lobe pneumonia. Which anatomical structure (arrowheads) is limiting the superior extent of infection?";
    //  newNode4.options = {
    //    a: "A - Horizontal fissure",
    //    b: "B - Oblique fissure",
    //    c: "C - Diaphragm",
    //    d: "D - 8th rib"
    //  };
    //  newNode4.correctAnswer = newNode.options.a;
    //  newNode4.explanation = "The superior most edge of the right middle lobe is formed by the horizontal fissure."
    // newNode4.save();
    //
    // var newNode5 = new Nodes();
    // newNode5.nodeNumber = 5;
    // newNode5.topic = "General Essentials";
    // newNode5.xrayImage = 'http://www.radiologymasterclass.co.uk/images/competition/image_q12_cxr_big.jpg';
    // newNode5.question = "What is the likely cause of the pleural effusion in this smoker with finger clubbing?";
    // newNode5.options = {
    //   a: "A - Lung cancer",
    //   b: "B - Heart failure",
    //   c: "C - Sarcoidosis",
    //   d: "D - Systemic lupus erythematosus"
    // };
    // newNode5.correctAnswer = newNode.options.a;
    // newNode5.explanation = "Compare the meniscus sign with increased density beneath (effusion) with the normal right hemidiaphragm. When you see a pleural effusion don't forget to think of the causes. Sometimes the cause is visible, as on this image."
    // newNode5.save();

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
      var explanationsArray = [];

      for(var i=0;i<nodes.length;i++) {
        topicsArray.push(nodes[i].topic);
        imagesArray.push(nodes[i].xrayImage);
        nodeNumberArray.push(nodes[i].nodeNumber);
        questionsArray.push(nodes[i].question);
        optionsArray.push(nodes[i].options);
        correctAnswersArray.push(nodes[i].correctAnswer);
        explanationsArray.push(nodes[i].explanation)
      }

      var currentNodeNumberArray = req.user.getCurrentNodeNumber();
      var currentNodeNumber = currentNodeNumberArray[0];

      res.render('user/essentialsLesson', {
        title: 'Essentials Lesson',
        name: userName,
        photo: userPhoto,
        nodeNumber: nodeNumberArray,
        topic: topicsArray,
        images: imagesArray,
        question: questionsArray,
        options: optionsArray,
        correctAnswers: correctAnswersArray,
        explanations: explanationsArray,
        currentNode: currentNodeNumber
      })
    })
  }

};

module.exports = lessonController;
