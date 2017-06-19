var mongoose = require('mongoose');

var nodesSchema = mongoose.Schema({

    node: {
      totalNo: Number,
      no: Number,
      topic: String,
      xrayImage: String,
      question: String,
      answerOptions: {},
      correctAnswer: {},
      explanation: String
    }

});

// create the model for nodes
const TrackNodes = mongoose.model('nodes', nodesSchema);

// Export Nodes for shared access 
module.exports = TrackNodes;
